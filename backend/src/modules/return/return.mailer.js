import { sendMail, RETURNS_EMAIL } from "../../shared/infrastructure/mailer.js";

const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "(to be suggested by team)";

/**
 * Builds and sends the return-request email to the store's returns inbox.
 * Best-effort: resolves to true/false, never throws.
 */
export const sendReturnRequestEmail = async ({ order, items, comment, requestedPickupDate, customer }) => {
    const orderNumber = order?.orderNumber || String(order?._id || "");
    const customerName = customer?.name || `${order?.shippingAddress?.firstName || ""} ${order?.shippingAddress?.lastName || ""}`.trim();
    const customerEmail = customer?.email || "";
    const customerPhone = customer?.phone || order?.shippingAddress?.phone || "";

    // Resolve product names from the order's stored item snapshots (productName).
    const lines = (items || []).map((it) => {
        const orderItem = order?.items?.find((oi) => {
            const oid = oi.productId?._id?.toString() || oi.productId?.toString();
            return oid === String(it.productId);
        });
        const name = orderItem?.productName || "Item";
        return { name, quantity: it.quantity, reason: it.reason || "" };
    });

    const itemsText = lines
        .map((l) => `  • ${l.name} × ${l.quantity}${l.reason ? ` — ${l.reason}` : ""}`)
        .join("\n");

    const itemsHtml = lines
        .map((l) => `<li>${esc(l.name)} &times; ${l.quantity}${l.reason ? ` — ${esc(l.reason)}` : ""}</li>`)
        .join("");

    const subject = `Return request — Order ${orderNumber}`;

    const text =
        `New return request\n\n` +
        `Order: ${orderNumber}\n` +
        `Customer: ${customerName || "—"}\n` +
        `Email: ${customerEmail || "—"}\n` +
        `Phone: ${customerPhone || "—"}\n` +
        `Preferred pickup date: ${fmtDate(requestedPickupDate)}\n\n` +
        `Item(s):\n${itemsText || "  • —"}\n\n` +
        `Reason / message from customer:\n${comment || "(none provided)"}\n`;

    const html = `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;line-height:1.6">
          <h2 style="margin:0 0 12px">New return request</h2>
          <table style="border-collapse:collapse">
            <tr><td style="padding:2px 12px 2px 0;color:#666">Order</td><td><strong>${esc(orderNumber)}</strong></td></tr>
            <tr><td style="padding:2px 12px 2px 0;color:#666">Customer</td><td>${esc(customerName) || "&mdash;"}</td></tr>
            <tr><td style="padding:2px 12px 2px 0;color:#666">Email</td><td>${esc(customerEmail) || "&mdash;"}</td></tr>
            <tr><td style="padding:2px 12px 2px 0;color:#666">Phone</td><td>${esc(customerPhone) || "&mdash;"}</td></tr>
            <tr><td style="padding:2px 12px 2px 0;color:#666">Preferred pickup</td><td>${esc(fmtDate(requestedPickupDate))}</td></tr>
          </table>
          <h3 style="margin:18px 0 6px">Item(s)</h3>
          <ul style="margin:0 0 12px">${itemsHtml || "<li>&mdash;</li>"}</ul>
          <h3 style="margin:18px 0 6px">Reason / message from customer</h3>
          <p style="white-space:pre-wrap;background:#f6f6f4;padding:12px 14px;border-radius:8px;margin:0">${esc(comment) || "(none provided)"}</p>
        </div>`;

    return sendMail({
        to: RETURNS_EMAIL(),
        subject,
        text,
        html,
        replyTo: customerEmail || undefined,
    });
};
