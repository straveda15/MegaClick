import "dotenv/config";
import nodemailer from "nodemailer";

const numberedAccounts = [];
for (let i = 1; process.env[`MAIL_USER_${i}`] && process.env[`MAIL_PASS_${i}`]; i += 1) {
  numberedAccounts.push({
    label: `Contact SMTP account ${i}`,
    user: process.env[`MAIL_USER_${i}`].trim(),
    pass: process.env[`MAIL_PASS_${i}`].trim(),
    multiAccount: true,
  });
}

const accounts = numberedAccounts.length
  ? numberedAccounts
  : process.env.MAIL_USER && process.env.MAIL_PASS
    ? [{
        label: "Single-account SMTP",
        user: process.env.MAIL_USER.trim(),
        pass: process.env.MAIL_PASS.trim(),
        multiAccount: false,
      }]
    : [];

if (accounts.length === 0) {
  console.error("SMTP is not configured. Add MAIL_USER_1 and MAIL_PASS_1 to backend .env.");
  process.exit(1);
}

const host = process.env.MAIL_HOST || "smtp.gmail.com";
const port = Number(process.env.MAIL_PORT) || 465;
let failed = false;

for (const account of accounts) {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: account.multiAccount
      ? process.env.MAIL_SECURE !== "false"
      : port === 465,
    auth: { user: account.user, pass: account.pass },
  });

  try {
    await transporter.verify();
    console.log(`${account.label}: SMTP connection and authentication succeeded. No email was sent.`);
  } catch (error) {
    failed = true;
    const reason = [error.code, error.responseCode, error.command]
      .filter(Boolean)
      .join(" / ");
    console.error(
      `${account.label}: verification failed${reason ? ` (${reason})` : ""}. Check MAIL_HOST, MAIL_PORT, TLS settings, and SMTP credentials.`,
    );
  } finally {
    transporter.close();
  }
}

if (numberedAccounts.length > 0 && !process.env.CONTACT_RECIPIENTS?.trim()) {
  console.warn("CONTACT_RECIPIENTS is missing; SMTP works, but contact-form messages have no configured recipient.");
}

if (failed) process.exitCode = 1;
