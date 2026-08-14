import nodemailer from "nodemailer";
import logger from "./logger.js";

// ─────────────────────────────────────────────────────────────────────────────
// Single-account mailer (Returns, MR — uses MAIL_USER / MAIL_PASS)
//
// Env vars:
//   MAIL_HOST       (default: smtp.gmail.com)
//   MAIL_PORT       (default: 465)
//   MAIL_USER       Gmail/SMTP account
//   MAIL_PASS       Gmail App Password (NOT the login password)
//   MAIL_FROM       display name shown as sender (defaults to MAIL_USER)
//   RETURNS_EMAIL   inbox that receives return requests
// ─────────────────────────────────────────────────────────────────────────────

let _singleTransporter = null;

const _isSingleConfigured = () => Boolean(process.env.MAIL_USER && process.env.MAIL_PASS);

const _getSingleTransporter = () => {
  if (_singleTransporter) return _singleTransporter;
  if (!_isSingleConfigured()) return null;

  _singleTransporter = nodemailer.createTransport({
    host:   process.env.MAIL_HOST || "smtp.gmail.com",
    port:   Number(process.env.MAIL_PORT) || 465,
    secure: (Number(process.env.MAIL_PORT) || 465) === 465,
    auth:   { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });
  return _singleTransporter;
};

/**
 * Send from the single shared SMTP account (MAIL_USER / MAIL_PASS).
 * Used by: Returns module, MR module.
 * Never throws — returns true on success, false on failure.
 */
export const sendMail = async ({ to, subject, text, html, replyTo }) => {
  const tx = _getSingleTransporter();
  if (!tx) {
    logger.warn("Email not sent — mailer is not configured (set MAIL_USER and MAIL_PASS).", { subject, to });
    return false;
  }
  try {
    await tx.sendMail({ from: process.env.MAIL_FROM || process.env.MAIL_USER, to, subject, text, html, replyTo });
    logger.info("Email sent", { subject, to });
    return true;
  } catch (err) {
    logger.error("Email send failed", { subject, to, error: err.message });
    return false;
  }
};

export const RETURNS_EMAIL = () => process.env.RETURNS_EMAIL || "everliveindia@gmail.com";

// ─────────────────────────────────────────────────────────────────────────────
// Multi-account mailer (Contact Us round-robin — uses MAIL_USER_n / MAIL_PASS_n)
//
// Additional env vars:
//   MAIL_SECURE         port 465 = true (implicit TLS), 587 = false (STARTTLS)
//   MAIL_USER_1         first Gmail SMTP account
//   MAIL_PASS_1         Gmail App Password for account 1
//   MAIL_USER_2         second Gmail SMTP account
//   MAIL_PASS_2         Gmail App Password for account 2
//   …                   add MAIL_USER_3/MAIL_PASS_3 etc. — no code changes needed
//   CONTACT_RECIPIENTS  ordered comma-separated list of recipient inboxes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads MAIL_USER_n / MAIL_PASS_n pairs from env until the sequence breaks.
 * Supports any number of accounts — just add the next numbered pair.
 */
const _discoverAccounts = () => {
  const accounts = [];
  let i = 1;
  while (process.env[`MAIL_USER_${i}`] && process.env[`MAIL_PASS_${i}`]) {
    accounts.push({
      user: process.env[`MAIL_USER_${i}`].trim(),
      pass: process.env[`MAIL_PASS_${i}`].trim(),
    });
    i++;
  }
  return accounts;
};

// One transporter per account, cached after first use
const _accountTransporterCache = new Map();

/**
 * Returns the lazily-created nodemailer transporter for a given SMTP account email.
 * Matches MAIL_USER_n exactly; falls back to account 1 if no match found.
 * Returns null when no accounts are configured.
 */
export const getTransporterForAccount = (email) => {
  if (_accountTransporterCache.has(email)) return _accountTransporterCache.get(email);

  const accounts = _discoverAccounts();
  if (accounts.length === 0) {
    logger.warn("[mailer] No multi-account SMTP configured (MAIL_USER_1 / MAIL_PASS_1 missing).");
    return null;
  }

  const account = accounts.find((a) => a.user === email) ?? accounts[0];

  const transporter = nodemailer.createTransport({
    host:   process.env.MAIL_HOST || "smtp.gmail.com",
    port:   Number(process.env.MAIL_PORT) || 465,
    // MAIL_SECURE=false enables STARTTLS (port 587); default is implicit TLS (port 465)
    secure: process.env.MAIL_SECURE !== "false",
    auth:   { user: account.user, pass: account.pass },
  });

  _accountTransporterCache.set(email, transporter);
  return transporter;
};

/**
 * Send from a specific numbered SMTP account.
 * The SMTP account (FROM) and the recipient inbox (TO) are independent —
 * they may be the same address or different addresses.
 * Never throws — returns true on success, false on failure.
 *
 * @param {string|null} fromEmail  matches one of MAIL_USER_n
 */
export const sendFromAccount = async (fromEmail, { to, subject, text, html, replyTo }) => {
  const tx = getTransporterForAccount(fromEmail);
  if (!tx) {
    logger.warn("[mailer] Email not sent — no multi-account transporter available.", { subject, to });
    return false;
  }

  const displayName = process.env.MAIL_FROM ? String(process.env.MAIL_FROM).trim() : null;
  const fromHeader  = displayName ? `"${displayName}" <${fromEmail}>` : fromEmail;

  try {
    await tx.sendMail({ from: fromHeader, to, subject, text, html, replyTo });
    logger.info("[mailer] Email sent", { from: fromEmail, to, subject });
    return true;
  } catch (err) {
    logger.error("[mailer] Email send failed", { from: fromEmail, to, subject, error: err.message });
    return false;
  }
};

/**
 * Returns the ordered list of contact-form recipient inboxes.
 * Source: CONTACT_RECIPIENTS=sales1@x.com,sales2@x.com
 * Adding recipients requires only an env-var change.
 */
export const getContactRecipients = () => {
  const raw = (process.env.CONTACT_RECIPIENTS || "").trim();
  if (!raw) return [];
  return raw.split(",").map((e) => e.trim()).filter(Boolean);
};

/**
 * Returns the SMTP account email (MAIL_USER_n) that maps to the given
 * round-robin index. If there are fewer accounts than recipients the list
 * wraps: index 2 with 2 accounts → account[0], etc.
 * Returns null when no accounts are configured.
 */
export const getSmtpAccountForIndex = (idx) => {
  const accounts = _discoverAccounts();
  if (accounts.length === 0) return null;
  return accounts[idx % accounts.length].user;
};

/**
 * Checks that the contact-form mailer is fully configured and logs the result.
 * Call once during server startup so misconfiguration surfaces immediately
 * rather than silently on the first customer submission.
 *
 * Does NOT throw — email is a non-critical background feature and should
 * never prevent the server from starting.
 */
export const warnIfContactMailerUnconfigured = () => {
  const missing = [];
  if (!process.env.MAIL_USER_1 || !process.env.MAIL_PASS_1) {
    missing.push("MAIL_USER_1 / MAIL_PASS_1");
  }
  if (!process.env.CONTACT_RECIPIENTS) {
    missing.push("CONTACT_RECIPIENTS");
  }
  if (missing.length > 0) {
    logger.warn(
      `[mailer] Contact form email is DISABLED — missing env: ${missing.join(", ")}. ` +
      "Fill these in .env to enable round-robin delivery."
    );
    return;
  }
  const accounts  = _discoverAccounts();
  const recipients = getContactRecipients();
  logger.info(
    `[mailer] Contact mailer ready — ${accounts.length} SMTP account(s), ${recipients.length} recipient(s).`,
    { accounts: accounts.map((a) => a.user), recipients }
  );
};
