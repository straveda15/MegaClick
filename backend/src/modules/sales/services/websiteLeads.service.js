import mongoose from "mongoose";
import SalesCustomer from "../models/salesCustomer.model.js";
import SalesLead from "../models/salesLead.model.js";
import User from "../../user/user.model.js";
import Order from "../../order/order.model.js";
import { MarketingEvent, MarketingSession } from "../../marketing/marketing.model.js";
import Task from "../../task/task.model.js";
import logger from "../../../shared/infrastructure/logger.js";
import { nextRoundRobinIndex } from "./roundRobin.service.js";
import { getContactRecipients, getSmtpAccountForIndex } from "../../../shared/infrastructure/mailer.js";
import { sendContactNotification } from "../mailers/contact.mailer.js";

/**
 * Sync leads from website orders.
 * Instead of abandoned carts, we now track actual orders placed on the website
 * so sales agents can follow up or confirm them.
 */
export const syncCartLeads = async (actorId) => {
    // 1. Find orders from the website in the last 30 days
    // We'll sync PENDING_PAYMENT, PAID, and CREATED orders.
    // Already CONFIRMED/SHIPPED orders might not need to be in the leads flow, 
    // but the user said "all orders placed by customer".
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const orders = await Order.find({
        source: "web",
        createdAt: { $gte: thirtyDaysAgo },
        // Only include orders that might need sales attention
        orderStatus: { $in: ["PENDING", "PENDING_PAYMENT", "PAID", "CREATED", "CONFIRMED"] }
    }).sort({ createdAt: -1 });

    if (orders.length === 0) return { created: 0, skipped: 0 };

    let createdCount = 0;
    let skippedCount = 0;

    for (const order of orders) {
        // Find the user for this order
        const userData = await User.findById(order.userId);
        if (!userData) {
            skippedCount++;
            continue;
        }

        const phone = order.shippingAddress?.phone || userData.phone;
        if (!phone) {
            skippedCount++;
            continue;
        }

        // Resolve name
        const resolvedName = `${order.shippingAddress?.firstName || ""} ${order.shippingAddress?.lastName || ""}`.trim() || userData.name || "Web Customer";

        // Check if customer exists
        let customer = await SalesCustomer.findOne({ phone });

        // Parse addressLine1 (Website sends "Flat, Area")
        const addressParts = (order.shippingAddress?.addressLine1 || "").split(",").map(p => p.trim());
        const flat = addressParts[0] || "";
        const area = addressParts.slice(1).join(", ") || "";
        const landmark = order.shippingAddress?.addressLine2 || "";

        if (!customer) {
            customer = await SalesCustomer.create({
                name: resolvedName,
                email: order.shippingAddress?.email || userData.email,
                phone: phone,
                source: "web",
                addressLine1: flat,
                addressLine2: area,
                landmark: landmark,
                city: order.shippingAddress?.city,
                state: order.shippingAddress?.state,
                postalCode: order.shippingAddress?.postalCode
            });
        } else {
            // Update existing customer with latest address from website order
            customer.addressLine1 = flat || customer.addressLine1;
            customer.addressLine2 = area || customer.addressLine2;
            customer.landmark = landmark || customer.landmark;
            customer.city = order.shippingAddress?.city || customer.city;
            customer.state = order.shippingAddress?.state || customer.state;
            customer.postalCode = order.shippingAddress?.postalCode || customer.postalCode;
            await customer.save();
        }

        // Check if a lead already exists for THIS order (or by orderNumber in notes for safety)
        const existingLead = await SalesLead.findOne({
            $or: [
                { orderId: order._id },
                { statusHistory: { $elemMatch: { note: { $regex: order.orderNumber } } } }
            ],
            source: "website_order"
        });

        if (existingLead) {
            skippedCount++;
            continue;
        }

        // Create new SalesLead with source 'website_order'
        const products = order.items.map(i => `${i.productName} (x${i.quantity})`).join(", ");
        const orderValue = order.pricing.finalAmount || 0;
        
        // Every website order starts as a NEW lead for sales team to process/confirm.
        // It lands in the distribution pool; the auto-distribute job spreads it
        // across the roster equally (holding placeholder = the syncing user).
        await SalesLead.create({
            customer: customer._id,
            assignedTo: actorId,
            pool: true,
            status: "NEW",
            source: "website_order",
            productInterest: products,
            estimatedValue: orderValue,
            orderId: order._id,
            createdAt: order.createdAt, // Match the original order date for sorting
            statusHistory: [{ 
                status: "NEW", 
                changedBy: actorId, 
                note: `Automatically synced from website order: ${order.orderNumber}. Items: ${products}` 
            }]
        });

        createdCount++;
    }

    return { created: createdCount, skipped: skippedCount };
};

/**
 * Create a lead from a website contact form submission.
 *
 * Flow:
 *   1. Advance round-robin counter (MongoDB-backed, crash-safe)
 *   2. Resolve admin placeholder for pool assignment
 *   3. Transaction: create/update SalesCustomer + create SalesLead (atomic)
 *   4. Fire-and-forget email to the round-robin recipient
 */
export const createContactLead = async (contactData) => {
    const { name, email, phone, message } = contactData;

    // ── 1. Round-robin (outside transaction — counter is best-effort) ─────────
    // The counter lives in MongoDB so it survives restarts and is shared across
    // processes. Two concurrent requests cannot land on the same index.
    // recipient   = inbox that receives the notification (TO)
    // smtpAccount = MAIL_USER_n used to send it (FROM) — intentionally decoupled
    const recipients = getContactRecipients();
    let recipient   = null;
    let smtpAccount = null;
    if (recipients.length > 0) {
        const idx = await nextRoundRobinIndex("contact_round_robin", recipients.length);
        recipient   = recipients[idx];
        smtpAccount = getSmtpAccountForIndex(idx);
        logger.info("[createContactLead] Round-robin assigned", { recipient, smtpAccount, recipientCount: recipients.length });
    } else {
        logger.warn("[createContactLead] CONTACT_RECIPIENTS is not configured — email notification skipped.");
    }

    // ── 2. Admin placeholder (outside transaction — read-only lookup) ─────────
    // Contact-form leads have no acting user, so they are held under an active
    // admin and marked pool:true. The auto-distribute job spreads them later.
    const holder = await User.findOne({ role: "admin", isActive: true }).select("_id");
    if (!holder) throw new Error("No active admin found to hold the contact lead.");
    const ownerId = holder._id;

    // ── 3. Transaction: customer upsert + lead creation ───────────────────────
    // Wrapping both writes in one transaction ensures that a failed lead creation
    // cannot leave behind a customer record with no associated lead. Atlas is a
    // replica set so multi-document transactions are supported.
    const session = await mongoose.startSession();
    let newLead;
    try {
        await session.withTransaction(async () => {
            // Always refresh name + email on repeat submissions
            let customer = await SalesCustomer.findOne({ phone }).session(session);
            if (!customer) {
                [customer] = await SalesCustomer.create(
                    [{ name, email, phone, source: "web" }],
                    { session }
                );
            } else {
                customer.name  = name  || customer.name;
                customer.email = email || customer.email;
                await customer.save({ session });
            }

            [newLead] = await SalesLead.create([{
                customer:        customer._id,
                assignedTo:      ownerId,
                pool:            true,
                status:          "NEW",
                source:          "website_contact",
                productInterest: "Contact Us Inquiry",
                message:         message || undefined,
                assignedEmail:   recipient || undefined,
                statusHistory: [{
                    status:    "NEW",
                    changedBy: ownerId,
                    note:      `Lead from Website Contact Form: ${message || "No message provided"}`,
                }],
            }], { session });
        });
    } finally {
        await session.endSession();
    }

    // ── 4. Email notification (fire-and-forget — outside transaction) ─────────
    // The lead is already committed. A failed email does NOT roll back the lead
    // or affect the HTTP response.
    if (recipient) {
        void sendContactNotification({ name, email, phone, message, smtpAccount, recipient });
    }

    return newLead;
};
