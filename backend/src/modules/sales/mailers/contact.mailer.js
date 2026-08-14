import { sendFromAccount } from "../../../shared/infrastructure/mailer.js";

/**
 * Contact form email notification mailer.
 *
 * Sends FROM the smtpAccount (MAIL_USER_n) TO the recipient inbox.
 * These two addresses are intentionally decoupled — the SMTP account that
 * sends the email and the inbox that receives it can be the same or different.
 * If CONTACT_REPLY_TO_ENABLED=true, "Reply" in Gmail goes to the customer.
 *
 * Best-effort: resolves true/false, never throws.
 */

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const fmtDateTime = (d) =>
  new Date(d || Date.now()).toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }) + " IST";

/**
 * @param {{ name, email, phone, message, smtpAccount, recipient }} params
 *   smtpAccount — MAIL_USER_n email used as the SMTP sender (FROM)
 *   recipient   — inbox that receives the notification (TO)
 * @returns {Promise<boolean>}
 */
export const sendContactNotification = async ({ name, email, phone, message, smtpAccount, recipient }) => {
  const subject   = process.env.CONTACT_EMAIL_SUBJECT || "New Contact Form Submission";
  const replyToOn = process.env.CONTACT_REPLY_TO_ENABLED !== "false";
  const timestamp = fmtDateTime(new Date());

  // ── Plain-text fallback ───────────────────────────────────────────────────
  const text =
    `New Contact Form Submission — Everlive India\n` +
    `${"─".repeat(44)}\n\n` +
    `Name       : ${name}\n` +
    `Email      : ${email}\n` +
    `Phone      : ${phone}\n` +
    `Submitted  : ${timestamp}\n` +
    `Assigned To: ${recipient}\n\n` +
    `Message\n${"─".repeat(44)}\n${message || "(no message provided)"}\n\n` +
    `${"─".repeat(44)}\n` +
    `This notification was sent automatically by the Everlive website contact form.\n`;

  // ── HTML template ─────────────────────────────────────────────────────────
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

          <!-- Header -->
          <tr>
            <td style="background:#0b180b;padding:24px 32px;border-radius:12px 12px 0 0">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;
                               text-transform:uppercase;color:rgba(255,255,255,0.5)">
                      Everlive India
                    </p>
                    <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff;
                                letter-spacing:-0.01em;line-height:1.3">
                      New Contact Inquiry
                    </h1>
                  </td>
                  <td align="right" style="vertical-align:bottom">
                    <span style="display:inline-block;background:rgba(132,204,22,0.18);
                                 color:#84cc16;font-size:11px;font-weight:700;
                                 letter-spacing:0.06em;text-transform:uppercase;
                                 padding:5px 12px;border-radius:20px;
                                 border:1px solid rgba(132,204,22,0.3)">
                      New
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;
                       border-radius:0 0 12px 12px;padding:28px 32px">

              <!-- Customer details table -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border-collapse:collapse;margin-bottom:24px">
                <tr style="border-bottom:1px solid #f3f4f6">
                  <td style="padding:10px 16px 10px 0;color:#6b7280;font-size:13px;
                             white-space:nowrap;vertical-align:top;width:110px">
                    Name
                  </td>
                  <td style="padding:10px 0;font-weight:600;font-size:15px">
                    ${esc(name)}
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6">
                  <td style="padding:10px 16px 10px 0;color:#6b7280;font-size:13px;
                             white-space:nowrap;vertical-align:top">
                    Email
                  </td>
                  <td style="padding:10px 0">
                    <a href="mailto:${esc(email)}"
                       style="color:#166534;text-decoration:none;font-size:15px">
                      ${esc(email)}
                    </a>
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6">
                  <td style="padding:10px 16px 10px 0;color:#6b7280;font-size:13px;
                             white-space:nowrap;vertical-align:top">
                    Phone
                  </td>
                  <td style="padding:10px 0">
                    <a href="tel:${esc(phone)}"
                       style="color:#166534;text-decoration:none;font-size:15px">
                      ${esc(phone)}
                    </a>
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6">
                  <td style="padding:10px 16px 10px 0;color:#6b7280;font-size:13px;
                             white-space:nowrap;vertical-align:top">
                    Submitted
                  </td>
                  <td style="padding:10px 0;color:#374151;font-size:14px">
                    ${esc(timestamp)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 16px 10px 0;color:#6b7280;font-size:13px;
                             white-space:nowrap;vertical-align:top">
                    Assigned To
                  </td>
                  <td style="padding:10px 0;color:#374151;font-size:14px">
                    ${esc(recipient)}
                  </td>
                </tr>
              </table>

              <!-- Message block -->
              <p style="margin:0 0 8px;color:#6b7280;font-size:12px;font-weight:700;
                         letter-spacing:0.08em;text-transform:uppercase">
                Message
              </p>
              <div style="white-space:pre-wrap;background:#f9fafb;border:1px solid #e5e7eb;
                          border-radius:8px;padding:16px;font-size:15px;line-height:1.7;
                          color:#1f2937">
                ${message ? esc(message) : '<span style="color:#9ca3af;font-style:italic">No message provided</span>'}
              </div>

              <!-- Footer note -->
              <p style="margin:24px 0 0;font-size:11px;color:#9ca3af;
                        border-top:1px solid #f3f4f6;padding-top:16px;line-height:1.6">
                This notification was sent automatically by the Everlive website contact form.<br/>
                Reply to this email to respond directly to the customer.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendFromAccount(smtpAccount, {
    to:      recipient,
    subject,
    text,
    html,
    replyTo: replyToOn ? email : undefined,
  });
};
