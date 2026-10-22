import { sendFromAccount } from "../../../shared/infrastructure/mailer.js";

const esc = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])
  );

const fmtDateTime = (date) =>
  new Date(date || Date.now()).toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }) + " IST";

/** Sends a contact inquiry notification to the configured inbox. */
export const sendContactNotification = async ({
  name, email, phone, message, service, smtpAccount, recipient,
}) => {
  const serviceName = service || "Contact Us Inquiry";
  const subject = serviceName;
  const timestamp = fmtDateTime(new Date());

  const text =
    `${serviceName}\n\n` +
    `Name: ${name}\n` +
    `Email: ${email || "Not provided"}\n` +
    `Phone: ${phone}\n` +
    `Submitted: ${timestamp}\n\n` +
    `Message: ${message || "No message provided"}\n`;

  const emailRow = email
    ? `<a href="mailto:${esc(email)}">${esc(email)}</a>`
    : "Not provided";
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
  <h2 style="margin:0 0 20px;font-size:20px">${esc(serviceName)}</h2>
  <p style="margin:8px 0"><strong>Name:</strong> ${esc(name)}</p>
  <p style="margin:8px 0"><strong>Email:</strong> ${emailRow}</p>
  <p style="margin:8px 0"><strong>Phone:</strong> <a href="tel:${esc(phone)}">${esc(phone)}</a></p>
  <p style="margin:8px 0"><strong>Submitted:</strong> ${esc(timestamp)}</p>
  <p style="margin:20px 0 0;white-space:pre-wrap;line-height:1.6"><strong>Message:</strong> ${esc(message || "No message provided")}</p>
</body>
</html>`;

  return sendFromAccount(smtpAccount, {
    to: recipient,
    subject,
    text,
    html,
    replyTo: process.env.CONTACT_REPLY_TO_ENABLED === "false" ? undefined : email,
  });
};
