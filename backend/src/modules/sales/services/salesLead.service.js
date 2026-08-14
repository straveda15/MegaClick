import SalesCustomer from "../models/salesCustomer.model.js";
import SalesLead from "../models/salesLead.model.js";
import AppError from "../../../shared/utils/appError.js";
import SalesActivityLog from "../models/salesActivityLog.model.js";
import Task from "../../task/task.model.js";
import User from "../../user/user.model.js";
import Order from "../../order/order.model.js";
import Product from "../../product/product.model.js";
import Leave from "../../leave/leave.model.js";
import salesEventBus from "../events/salesEventBus.js";
import { validateTransition } from "../utils/stateMachine.js";
import * as baseOrderService from "../../order/order.service.js"; // to create orders
import * as workLog from "../../worklog/worklog.service.js"; // day-wise activity logs
import { getSalesConfig, setSalesRoster } from "../models/salesConfig.model.js";

// Collapse to lowercase space-separated tokens so "Stamina & Heart Health"
// and "STAMINA  HEART HEALTH" compare equal.
const normalizeProductText = (s) =>
    String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Matches a free-text product cell from an uploaded sheet against the real
 * product catalog, returning the catalog product docs that actually appear in
 * the text. Invalid product names (e.g. "VAJRALIVE") match nothing, so the
 * caller can leave the product/value blank while valid ones are kept.
 */
const matchCatalogProducts = (raw, products) => {
    const text = normalizeProductText(raw);
    if (!text) return [];
    const padded = ` ${text} `;
    const matched = [];
    const seen = new Set();
    // Longer names first so a multi-word product is preferred over a substring.
    const sorted = [...products].sort((a, b) => (b.name?.length || 0) - (a.name?.length || 0));
    for (const product of sorted) {
        const name = normalizeProductText(product.name);
        if (!name || seen.has(product.name)) continue;
        if (padded.includes(` ${name} `)) {
            matched.push(product);
            seen.add(product.name);
        }
    }
    return matched;
};

export const ingestLeadsFromCSV = async (rows, session, actorId, uploadSource = "csv") => {
    // 1. Upsert Customers
    const customerOps = rows.map(row => ({
       updateOne: {
          filter: { phone: row.customerPhone },
          update: {
             $setOnInsert: {
                name: row.customerName,
                email: row.customerEmail,
                source: uploadSource,
                createdBy: actorId,
                createdAt: new Date()
             }
          },
          upsert: true
       }
    }));
    
    await SalesCustomer.bulkWrite(customerOps, { session });

    const phones = rows.map(r => r.customerPhone);
    const customers = await SalesCustomer.find({ phone: { $in: phones } }).session(session);
    const phoneToCustomerMap = new Map(customers.map(c => [c.phone, c._id]));

    // Load catalog once to validate/normalize the free-text product column.
    const products = await Product.find({}, "name price").lean();

    // Existing OPEN leads keyed by customer, so re-uploading the same sheet
    // refreshes them in place instead of stacking duplicates.
    const customerIds = customers.map(c => c._id);
    const openLeads = await SalesLead.find({
        customer: { $in: customerIds },
        status: { $in: ["NEW", "CONTACTED", "FOLLOW_UP"] }
    }).session(session);
    const openLeadByCustomer = new Map(openLeads.map(l => [String(l.customer), l]));

    const sourceLabel = uploadSource === "excel" ? "Excel" : "CSV";
    const handledCustomers = new Set(); // guard against duplicate phones within one file
    const newLeadDocs = [];
    const updateOps = [];
    let updatedCount = 0;

    for (const row of rows) {
        const customerId = phoneToCustomerMap.get(row.customerPhone);
        if (!customerId) continue;
        const key = String(customerId);
        if (handledCustomers.has(key)) continue; // only act on first row per phone
        handledCustomers.add(key);

        const matchedProducts = matchCatalogProducts(row.productInterest, products);
        const productInterest = matchedProducts.map(p => p.name).join(", ") || undefined;
        // Default the lead value to the current catalog price(s) of the matched
        // product(s) when the sheet doesn't carry an explicit value column.
        const catalogPrice = matchedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
        const providedValue = Number(row.estimatedValue);
        const estimatedValue = (providedValue > 0 ? providedValue : catalogPrice) || 0;

        const existing = openLeadByCustomer.get(key);
        if (existing) {
            // Refresh the open lead in place.
            updateOps.push({
                updateOne: {
                    filter: { _id: existing._id },
                    update: {
                        $set: { productInterest, estimatedValue, source: uploadSource },
                        $push: { statusHistory: { status: existing.status, changedBy: actorId, note: `Refreshed via ${sourceLabel} upload` } }
                    }
                }
            });
            updatedCount++;
        } else {
            newLeadDocs.push({
                customer: customerId,
                assignedTo: actorId, // holding placeholder — pooled, distributed by the auto job
                pool: true,
                status: "NEW",
                source: uploadSource,
                productInterest,
                estimatedValue,
                statusHistory: [{ status: "NEW", changedBy: actorId, note: `Imported via ${sourceLabel} upload` }]
            });
        }
    }

    if (updateOps.length > 0) await SalesLead.bulkWrite(updateOps, { session });
    if (newLeadDocs.length > 0) {
        // New leads land in the distribution pool; the auto-distribute job (every
        // 30 min, or on demand) spreads them equally across the roster.
        await SalesLead.insertMany(newLeadDocs, { session });
    }

    // Automated task creation removed as per requirement.
    // Manual assignment is preferred.

    // 4. Activity Logs
    await SalesActivityLog.create([{
        actor: actorId,
        action: "CSV_LEADS_INGESTED",
        entityType: "CSVUpload",
        entityId: `upload_${Date.now()}`,
        metadata: { rowsProcessed: rows.length, created: newLeadDocs.length, updated: updatedCount }
    }], { session });
};

export const ingestScrapedLeadsFromCSV = async (rows, session, actorId) => {
    // 1. Upsert Customers
    const customerOps = rows.map(row => ({
       updateOne: {
          filter: { phone: row.customerPhone },
          update: {
             $setOnInsert: {
                name: row.customerName,
                email: row.customerEmail,
                source: "scraped",
                createdBy: actorId,
                createdAt: new Date(),
                notes: row.notes || undefined
             }
          },
          upsert: true
       }
    }));
    
    await SalesCustomer.bulkWrite(customerOps, { session });
    
    const phones = rows.map(r => r.customerPhone);
    const customers = await SalesCustomer.find({ phone: { $in: phones } }).session(session);
    const phoneToCustomerMap = new Map(customers.map(c => [c.phone, c._id]));

    // 2. Create Leads — pooled; the auto-distribute job spreads them across the roster.
    const leadDocs = rows.map((row) => {
        const customerId = phoneToCustomerMap.get(row.customerPhone);
        return {
            customer: customerId,
            assignedTo: actorId, // holding placeholder while pooled
            pool: true,
            status: "NEW",
            source: "scraped",
            productInterest: row.productInterest || undefined,
            statusHistory: [{
                status: "NEW",
                changedBy: actorId,
                note: `Imported via Scraped Data CSV. Source: ${row.scrapedFrom}. ${row.notes || ""}`
            }]
        };
    });

    const leads = await SalesLead.insertMany(leadDocs, { session });

    // Automated task creation removed as per requirement.
    // Manual assignment is preferred.

    // 4. Activity Logs
    await SalesActivityLog.create([{
        actor: actorId,
        action: "CSV_SCRAPED_DATA_INGESTED",
        entityType: "CSVUpload",
        entityId: `scraped_upload_${Date.now()}`,
        metadata: { rowsProcessed: rows.length }
    }], { session });
};

export const advanceLeadStatus = async (leadId, newStatus, actorId, note = "", followUpAt = null) => {
    const lead = await SalesLead.findById(leadId);
    if (!lead) throw new Error("Lead not found");
 
    validateTransition("LEAD", lead.status, newStatus);
 
    lead.statusHistory.push({
        status: newStatus,
        changedBy: actorId,
        note: note
    });
 
    const oldStatus = lead.status;
    lead.status = newStatus;
    lead.lastContactedAt = new Date();
 
    if (newStatus === "FOLLOW_UP") {
        const scheduledFor = followUpAt ? new Date(followUpAt) : new Date(Date.now() + 24 * 60 * 60 * 1000);
        lead.followUpAt = scheduledFor;
        lead.followUpNote = note || "";
        lead.followUpHistory.push({
            note: note || "",
            followUpAt: scheduledFor,
            createdBy: actorId,
            createdAt: new Date(),
        });
    }

    await lead.save();

    await SalesActivityLog.create({
        actor: actorId,
        action: "LEAD_STATUS_CHANGED",
        entityType: "SalesLead",
        entityId: lead._id,
        metadata: { prevStatus: oldStatus, newStatus, note }
    });

    // Day-wise work log so the rep's lead activity shows in their Logs / Team Logs.
    await workLog.logActivity({
        user: actorId,
        activity: `Worked lead — marked ${String(newStatus).replace(/_/g, " ").toLowerCase()}`,
        category: "lead",
        note,
        refType: "SalesLead",
        refId: lead._id,
    });

    return lead;
};

export const convertLead = async (leadId, actorId, orderData) => {
    const lead = await SalesLead.findById(leadId).populate("customer");
    if (!lead) throw new Error("Lead not found");
    if (lead.status === "CONVERTED") throw new Error("Lead already converted");

    // Persist any customer details entered in the convert form (name/address)
    // back onto the customer record, so the lead/customer reflects the name
    // after conversion instead of still showing only the phone number.
    const sa = orderData.shippingAddress;
    if (sa && lead.customer) {
        const fullName = `${sa.firstName || ""} ${sa.lastName || ""}`.trim();
        if (fullName && fullName !== ".") lead.customer.name = fullName;
        if (sa.phone) lead.customer.phone = sa.phone;
        if (sa.email) lead.customer.email = sa.email;
        if (sa.addressLine1 && sa.addressLine1 !== "TBD") lead.customer.addressLine1 = sa.addressLine1;
        if (sa.addressLine2) lead.customer.addressLine2 = sa.addressLine2;
        if (sa.city && sa.city !== "TBD") lead.customer.city = sa.city;
        if (sa.state && sa.state !== "TBD") lead.customer.state = sa.state;
        if (sa.postalCode && sa.postalCode !== "000000") lead.customer.postalCode = sa.postalCode;
        await lead.customer.save();
    }

    let normalizedPhone = String(lead.customer.phone || "").replace(/[^\d+]/g, "");
    if (/^\d{10}$/.test(normalizedPhone)) {
        normalizedPhone = `+91${normalizedPhone}`;
    } else if (/^\d{12}$/.test(normalizedPhone) && normalizedPhone.startsWith("91")) {
        normalizedPhone = `+${normalizedPhone}`;
    } else if (normalizedPhone.startsWith("0")) {
        normalizedPhone = `+91${normalizedPhone.slice(1)}`;
    }

    let user = await User.findOne({ phone: normalizedPhone });
    if (!user && lead.customer.email) {
        user = await User.findOne({ email: lead.customer.email.toLowerCase() });
    }

    if (!user) {
        user = await User.create({
            name: lead.customer.name || "Customer",
            phone: normalizedPhone,
            email: lead.customer.email || undefined,
            role: "user",
            authProvider: ["local"],
            isActive: true
        });
    }

    // 1. Handle existing website orders differently
    let finalOrder;

    if (lead.source === "website_order" && lead.orderId) {
        finalOrder = await Order.findById(lead.orderId);
        if (!finalOrder) throw new Error("Linked order not found");

        // If it's already confirmed, just finish the lead
        if (!["CONFIRMED", "SHIPPED", "DELIVERED"].includes(finalOrder.orderStatus)) {
            // Promote to confirmed
            if (finalOrder.payment.paymentProvider === "cod") {
                finalOrder.payment.paymentStatus = "PENDING";
                finalOrder.orderStatus = "PAID"; // transitional requirement
            } else if (finalOrder.payment.paymentStatus === "SUCCESS" || finalOrder.orderStatus === "PENDING") {
                finalOrder.orderStatus = "PAID";
            }
            
            await finalOrder.save();
            if (finalOrder.orderStatus === "PAID") {
                await baseOrderService.confirmOrder(finalOrder._id);
            }
        }
    } else {
        // 1. Create Pending Order using refined data for other sources (abandoned cart, telephony, etc.)
        const pendingOrder = await baseOrderService.createPendingOrder(user._id, {
            items: orderData.items,
            shippingAddress: orderData.shippingAddress || {
                firstName: lead.customer.name.split(" ")[0],
                lastName: lead.customer.name.split(" ").slice(1).join(" ") || ".",
                phone: lead.customer.phone,
                addressLine1: lead.customer.addressLine1 || lead.customer.address || "TBD",
                addressLine2: lead.customer.addressLine2 || "",
                city: lead.customer.city || "TBD",
                state: lead.customer.state || "TBD",
                postalCode: lead.customer.postalCode || "000000",
                country: "India"
            },
            pricing: {
                subtotal: orderData.subtotal,
                finalAmount: orderData.subtotal // For now assume same, can be refined
            },
            source: "admin"
        });

        // 2. Promote order into the fulfilment pipeline (COD by default for lead conversions)
        const orderToConfirm = await Order.findById(pendingOrder._id);
        orderToConfirm.payment.paymentStatus = "PENDING"; // COD — cash collected on delivery
        orderToConfirm.payment.paymentProvider = "cod";
        orderToConfirm.orderStatus = "PAID"; // transitional status required by confirmOrder gate
        await orderToConfirm.save();

        try {
            await baseOrderService.confirmOrder(pendingOrder._id);
        } catch (confirmError) {
            console.warn(`[convertLead] Confirmation failed for ${pendingOrder.orderNumber}:`, confirmError.message);
        }
        
        finalOrder = pendingOrder;
    }

    // 3. Update Lead Status
    lead.status = "CONVERTED";
    lead.convertedAt = new Date();
    lead.orderId = finalOrder._id;
    lead.statusHistory.push({
        status: "CONVERTED",
        changedBy: actorId,
        note: lead.source === "website_order" 
            ? `Website order ${finalOrder.orderNumber} confirmed via sales tracker`
            : `Lead converted to manual order: ${finalOrder.orderNumber}`
    });
    await lead.save();

    // 4. Log Activity
    await SalesActivityLog.create({
        actor: actorId,
        action: "LEAD_CONVERTED",
        entityType: "SalesLead",
        entityId: lead._id,
        metadata: { orderId: finalOrder._id, orderNumber: finalOrder.orderNumber }
    });

    await workLog.logActivity({
        user: actorId,
        activity: `Converted lead to order ${finalOrder.orderNumber}`,
        category: "lead",
        refType: "SalesLead",
        refId: lead._id,
    });

    return { lead, order: finalOrder };
};

export const dropLead = async (leadId, actorId, reason) => {
    const lead = await SalesLead.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    validateTransition("LEAD", lead.status, "DROPPED");

    // If it's a website order, cancel the actual order too
    if (lead.source === "website_order" && lead.orderId) {
        try {
            const order = await Order.findById(lead.orderId);
            if (order && !["SHIPPED", "DELIVERED", "CANCELLED"].includes(order.orderStatus)) {
                order.orderStatus = "CANCELLED";
                order.notes = (order.notes ? order.notes + "\n" : "") + `Cancelled by sales agent: ${reason}`;
                await order.save();
                console.log(`[dropLead] Cancelled order ${order.orderNumber} because lead was dropped.`);
            }
        } catch (orderError) {
            console.error(`[dropLead] Failed to cancel order ${lead.orderId}:`, orderError.message);
        }
    }

    lead.statusHistory.push({ status: "DROPPED", changedBy: actorId, note: reason });
    lead.status = "DROPPED";
    lead.droppedAt = new Date();
    lead.droppedReason = reason;
    await lead.save();

    // Close Task
    if (lead.taskId) {
         await Task.findByIdAndUpdate(lead.taskId, { status: "completed", completedAt: new Date() });
    }

    await SalesActivityLog.create({
         actor: actorId,
         action: "LEAD_DROPPED",
         entityType: "SalesLead",
         entityId: lead._id,
         metadata: { reason }
    });

    return lead;
};

export const getAssignedLeads = async (user, filters = {}) => {
    const query = {};

    if (filters.status) query.status = filters.status;

    // Ownership scoping: admins and the Senior Sales Manager see every lead
    // (oversight); regular sales members see only leads assigned to them.
    const isManagerView = user.role === "admin" || user.isSalesManager === true;
    if (!isManagerView) {
        query.assignedTo = user._id;
        query.pool = { $ne: true }; // pooled leads aren't "theirs" until distributed
    }

    // Auto-sync website orders if that's the requested source
    if (filters.source === "website_order") {
        try {
            const { syncCartLeads } = await import("./websiteLeads.service.js");
            await syncCartLeads(user._id);
        } catch (syncError) {
            console.error("[getAssignedLeads] Auto-sync failed:", syncError.message);
        }
    }

    if (filters.source === "telephony") {
        query.source = { $in: ["telephony", "manual", "scraped", "csv", "excel"] };
    } else if (filters.source && filters.source !== "all") {
        query.source = filters.source;
    }

    return await SalesLead.find(query)
        .populate("customer")
        .populate("orderId", "orderNumber orderStatus pricing items")
        .populate("assignedTo", "name lastName email")
        // Lets the Leads board show whether a request has been handed to
        // someone yet, and how that work is going.
        .populate("taskId", "title status dueAt priority")
        .populate("followUpHistory.createdBy", "name email")
        .sort({ createdAt: -1 });
};

/**
 * Lead progress counts for the current user. Scoped the same way as the lead
 * list: a regular member gets their own counts; admins and the sales lead get
 * team-wide counts. "done" = terminal leads (converted + dropped).
 */
export const getMyLeadStats = async (user) => {
    const match = {};
    const isManagerView = user.role === "admin" || user.isSalesManager === true;
    if (!isManagerView) {
        match.assignedTo = user._id;
        match.pool = { $ne: true };
    }

    const rows = await SalesLead.aggregate([
        { $match: match },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const byStatus = Object.fromEntries(rows.map((r) => [r._id, r.count]));

    const converted = byStatus.CONVERTED || 0;
    const dropped = byStatus.DROPPED || 0;
    const followUp = byStatus.FOLLOW_UP || 0;
    const open = (byStatus.NEW || 0) + (byStatus.CONTACTED || 0);

    return {
        total: converted + dropped + followUp + open,
        done: converted + dropped,
        open,
        followUp,
        converted,
        dropped,
    };
};

export const getBacklogLeads = async (userId) => {
    // Leads due for follow up before now, and not converted/dropped (no restriction on assignee)
    return await SalesLead.find({
        status: { $in: ["NEW", "CONTACTED", "FOLLOW_UP"] },
        followUpAt: { $lt: new Date() }
    }).populate("customer").sort({ followUpAt: 1 });
};

export const LEAD_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
export const LEAD_STATUSES = ["NEW", "CONTACTED", "FOLLOW_UP", "CONVERTED", "DROPPED"];
export const SERVICE_STAGES = [
    "documents_pending",
    "documents_received",
    "application_submitted",
    "government_verification",
    "approval_received",
    "certificate_ready",
    "completed",
];
const LEAD_SOURCES = ["website_cart", "website_order", "telephony", "website_contact", "csv", "excel", "manual", "scraped", "offline_orders"];

/**
 * Normalizes one lead's worth of user/spreadsheet input into the customer and
 * lead documents. Shared by single-lead creation and bulk import so both accept
 * exactly the same fields and coerce them the same way.
 */
const buildLeadInput = (data) => {
    const name = (data.name || `${data.firstName || ""} ${data.lastName || ""}`).trim();
    const phone = String(data.phone ?? "").trim();

    const priority = LEAD_PRIORITIES.includes(String(data.priority ?? "").toUpperCase())
        ? String(data.priority).toUpperCase()
        : "MEDIUM";
    const status = LEAD_STATUSES.includes(String(data.status ?? "").toUpperCase())
        ? String(data.status).toUpperCase()
        : "NEW";
    const source = LEAD_SOURCES.includes(data.source) ? data.source : "manual";

    let followUpAt = null;
    if (data.followUpAt) {
        const parsed = new Date(data.followUpAt);
        if (!Number.isNaN(parsed.getTime())) followUpAt = parsed;
    }

    return {
        name,
        phone,
        email: String(data.email ?? "").trim() || undefined,
        company: String(data.company ?? "").trim() || undefined,
        city: String(data.city ?? "").trim() || undefined,
        state: String(data.state ?? "").trim() || undefined,
        addressLine1: data.flat,
        addressLine2: data.area,
        landmark: data.landmark,
        postalCode: data.pincode,
        productInterest: String(data.productInterest ?? "").trim() || undefined,
        serviceSlug: String(data.serviceSlug ?? "").trim() || undefined,
        serviceCategory: String(data.serviceCategory ?? "").trim() || undefined,
        serviceStage: SERVICE_STAGES.includes(data.serviceStage) ? data.serviceStage : "documents_pending",
        priority,
        status,
        source,
        followUpAt,
        message: data.message,
    };
};

/** Upserts the customer behind a lead. Phone is the identity key. */
const upsertLeadCustomer = async (input, actorId) => {
    const set = {};
    // Only overwrite fields the caller actually supplied — a second lead for an
    // existing customer must not blank out details captured the first time.
    for (const field of ["name", "email", "company", "city", "state", "addressLine1", "addressLine2", "landmark", "postalCode"]) {
        if (input[field]) set[field] = input[field];
    }

    return await SalesCustomer.findOneAndUpdate(
        { phone: input.phone },
        {
            $set: set,
            $setOnInsert: {
                phone: input.phone,
                source: "manual",
                createdBy: actorId,
                createdAt: new Date(),
            },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
};

export const createManualLead = async (actorId, data) => {
    const input = buildLeadInput(data);

    if (!input.phone) {
        const err = new Error("Phone number is required — it identifies the customer.");
        err.statusCode = 400;
        throw err;
    }

    const customer = await upsertLeadCustomer(input, actorId);

    // A lead captured here stays deliberately unassigned until someone uses
    // "Assign to" — it is NOT pooled, so the auto-distribute job leaves it be.
    const lead = await SalesLead.create({
        customer: customer._id,
        assignedTo: data.assignedTo || undefined,
        pool: false,
        status: input.status,
        source: input.source,
        productInterest: input.productInterest,
        serviceSlug: input.serviceSlug,
        serviceCategory: input.serviceCategory,
        serviceStage: input.serviceStage,
        priority: input.priority,
        followUpAt: input.followUpAt,
        message: input.message,
        statusHistory: [{
            status: input.status,
            changedBy: actorId,
            note: "Manually created lead",
        }],
    });

    await SalesActivityLog.create({
        actor: actorId,
        action: "MANUAL_LEAD_CREATED",
        entityType: "SalesLead",
        entityId: lead._id,
        metadata: { source: input.source },
    });

    return await SalesLead.findById(lead._id)
        .populate("customer")
        .populate("assignedTo", "name lastName email");
};

/**
 * Bulk-creates leads from an imported spreadsheet (CSV/Excel).
 *
 * Rows are validated individually: anything missing a phone number (the
 * customer identity key) is skipped and reported back rather than failing the
 * whole import, so a client can fix a few bad rows and re-import.
 */
export const importLeads = async (actorId, { rows, fallbackAssignedTo }) => {
    if (!Array.isArray(rows) || rows.length === 0) {
        const err = new Error("No rows to import.");
        err.statusCode = 400;
        throw err;
    }
    if (rows.length > 2000) {
        const err = new Error("Too many rows — import at most 2000 at a time.");
        err.statusCode = 400;
        throw err;
    }

    // Resolve "Assigned To" names against active staff so a sheet carrying a
    // person's name (not their database id) still lands on the right rep.
    const activeUsers = await User.find({ isActive: { $ne: false } }).select("name lastName email").lean();
    const byName = new Map();
    for (const u of activeUsers) {
        const id = String(u._id);
        const keys = [
            [u.name, u.lastName].filter(Boolean).join(" "),
            u.name,
            u.email,
        ];
        for (const key of keys) {
            const normalized = String(key ?? "").trim().toLowerCase().replace(/\s+/g, " ");
            if (normalized && !byName.has(normalized)) byName.set(normalized, id);
        }
    }

    const skipped = [];
    let imported = 0;

    for (const [index, row] of rows.entries()) {
        // Row number as the client sees it in their spreadsheet: +2 for the header.
        const rowNumber = index + 2;
        const input = buildLeadInput({ ...row, source: row.source || "excel" });

        if (!input.phone) {
            skipped.push({ row: rowNumber, reason: `Missing phone number${input.name ? ` for ${input.name}` : ""}` });
            continue;
        }

        const rawAssignee = String(row.assignedToName ?? "").trim();
        const matched = rawAssignee
            ? byName.get(rawAssignee.toLowerCase().replace(/\s+/g, " "))
            : undefined;
        // Unmatched rows stay unassigned and wait for a manual "Assign to",
        // rather than silently landing on whoever ran the import.
        const assignedTo = matched || fallbackAssignedTo || undefined;

        try {
            const customer = await upsertLeadCustomer(input, actorId);

            await SalesLead.create({
                customer: customer._id,
                assignedTo,
                pool: false,
                status: input.status,
                source: input.source,
                productInterest: input.productInterest,
                serviceSlug: input.serviceSlug,
                serviceCategory: input.serviceCategory,
                serviceStage: input.serviceStage,
                priority: input.priority,
                followUpAt: input.followUpAt,
                statusHistory: [{
                    status: input.status,
                    changedBy: actorId,
                    note: "Imported from spreadsheet",
                }],
            });

            imported += 1;
        } catch (error) {
            skipped.push({ row: rowNumber, reason: error.message || "Could not be saved" });
        }
    }

    if (imported === 0) {
        const err = new Error(
            `No valid rows found. ${skipped[0]?.reason ?? "Check the column headers against the template."}`
        );
        err.statusCode = 400;
        throw err;
    }

    return { imported, skipped };
};

/**
 * Turns a lead into assigned work: creates a Task stamped with the service and
 * the client's full contact details, puts the assignee on the lead, and links
 * the two so the Leads board can show what happened to each request.
 *
 * Re-assigning a lead that already has a task creates a fresh task for the new
 * assignee and re-points the link; the old task is left alone so its history
 * (and any work logged against it) survives.
 */
export const assignLeadAsTask = async (leadId, actorId, { assignedTo, dueAt, priority, notes }) => {
    const lead = await SalesLead.findById(leadId).populate("customer");
    if (!lead) throw new AppError("Lead not found", 404);
    if (!assignedTo) throw new AppError("An assignee is required.", 400);

    const assignee = await User.findById(assignedTo).select("name lastName isActive");
    if (!assignee) throw new AppError("That employee no longer exists.", 400);
    if (assignee.isActive === false) {
        const name = [assignee.name, assignee.lastName].filter(Boolean).join(" ") || "That employee";
        throw new AppError(`${name} is deactivated — reactivate the account first.`, 400);
    }

    const serviceTitle = lead.productInterest || "Service request";
    const clientName = lead.customer?.name?.trim() || lead.customer?.phone || "Client";

    const taskPriority = ["low", "medium", "high", "urgent", "critical"].includes(String(priority ?? "").toLowerCase())
        ? String(priority).toLowerCase()
        : (lead.priority || "MEDIUM").toLowerCase();

    let due = null;
    if (dueAt) {
        const parsed = new Date(dueAt);
        if (!Number.isNaN(parsed.getTime())) due = parsed;
    }

    const task = await Task.create({
        title: serviceTitle,
        description: [
            `Service request: ${serviceTitle}`,
            `Client: ${clientName}`,
            notes ? `Notes: ${String(notes).trim()}` : null,
        ].filter(Boolean).join("\n"),
        type: "manual",
        source: "manual",
        status: "pending",
        priority: taskPriority,
        dueAt: due,
        assignedTo,
        assignedBy: actorId,
        relatedEntity: { entityType: "SalesLead", entityId: lead._id },
        serviceRequest: {
            serviceTitle,
            serviceSlug: lead.serviceSlug,
            serviceCategory: lead.serviceCategory,
            clientName,
            clientEmail: lead.customer?.email,
            clientPhone: lead.customer?.phone,
            clientCompany: lead.customer?.company,
            clientAddress: [lead.customer?.addressLine1, lead.customer?.addressLine2, lead.customer?.city, lead.customer?.state]
                .filter(Boolean).join(", ") || undefined,
            notes: notes ? String(notes).trim() : undefined,
            stage: lead.serviceStage || "documents_pending",
        },
    });

    lead.assignedTo = assignedTo;
    lead.taskId = task._id;
    lead.pool = false;
    // Handing the request to someone is the first real contact on it.
    if (lead.status === "NEW") {
        lead.status = "CONTACTED";
        lead.statusHistory.push({ status: "CONTACTED", changedBy: actorId, note: "Assigned to an employee" });
    }
    await lead.save();

    await SalesActivityLog.create({
        actor: actorId,
        action: "LEAD_ASSIGNED_AS_TASK",
        entityType: "SalesLead",
        entityId: lead._id,
        metadata: { taskId: String(task._id), assignedTo: String(assignedTo) },
    });

    return await SalesLead.findById(lead._id)
        .populate("customer")
        .populate("assignedTo", "name lastName email");
};

export const updateLeadCustomer = async (leadId, customerData) => {
    const lead = await SalesLead.findById(leadId).populate("customer");
    if (!lead) throw new Error("Lead not found");
    if (!lead.customer) throw new Error("No customer associated with this lead");

    const customer = await SalesCustomer.findById(lead.customer._id);
    if (!customer) throw new Error("Customer not found");

    // Update fields
    if (customerData.firstName || customerData.lastName) {
        customer.name = `${customerData.firstName || ""} ${customerData.lastName || ""}`.trim();
    }
    if (customerData.email) customer.email = customerData.email;
    if (customerData.phone) customer.phone = customerData.phone;
    if (customerData.flat) customer.addressLine1 = customerData.flat;
    if (customerData.area) customer.addressLine2 = customerData.area;
    if (customerData.city) customer.city = customerData.city;
    if (customerData.state) customer.state = customerData.state;
    if (customerData.pincode) customer.postalCode = customerData.pincode;
    if (customerData.landmark !== undefined) customer.landmark = customerData.landmark;

    await customer.save();
    return lead;
};

// ─── Sales Team & Lead Distribution ──────────────────────────────────────────

const OPEN_LEAD_STATUSES = ["NEW", "CONTACTED", "FOLLOW_UP"];

/**
 * Build bulkWrite ops from an explicit per-lead assignee list (used with
 * balancedAssignment so distribution accounts for each member's current load).
 */
const buildAssignmentOps = (leads, assigneeIds, actorId, note) =>
    leads.map((lead, i) => ({
        updateOne: {
            filter: { _id: lead._id },
            update: {
                // Distributing a lead always takes it out of the pool.
                $set: { assignedTo: assigneeIds[i], pool: false },
                $push: { statusHistory: { status: lead.status, changedBy: actorId, note } },
            },
        },
    }));

/**
 * Active sales members who actually work leads — excludes inactive accounts and
 * the Senior Sales Manager (who never holds leads). This is the single source of
 * truth for "who can be assigned a lead".
 */
export const getActiveSalesMemberIds = async () => {
    const members = await User.find({
        departmentRole: "sales",
        isActive: true,
        isSalesManager: { $ne: true },
    }).select("_id").sort({ _id: 1 }).lean();
    return members.map((m) => m._id);
};

/**
 * Set of userId strings currently on an APPROVED leave that overlaps today.
 * These members are treated as unavailable — their leads are freed and they
 * receive none — until their leave period ends.
 */
export const getOnLeaveUserIdsToday = async () => {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(); end.setHours(23, 59, 59, 999);
    const leaves = await Leave.find({
        status: "approved",
        isDeleted: { $ne: true },
        fromDate: { $lte: end },
        toDate: { $gte: start },
    }).select("userId").lean();
    return new Set(leaves.map((l) => String(l.userId)));
};

/**
 * The members who should currently receive auto-distributed leads: the persisted
 * roster, constrained to active, non-manager sales members and minus anyone on
 * leave today. Falls back to every eligible active member when no roster has been
 * configured yet (so distribution still works out of the box).
 */
export const getAvailableRosterMemberIds = async () => {
    const onLeave = await getOnLeaveUserIdsToday();
    const base = await User.find({
        departmentRole: "sales",
        isActive: true,
        isSalesManager: { $ne: true },
    }).select("_id").sort({ _id: 1 }).lean();
    const eligible = base
        .map((m) => m._id)
        .filter((id) => !onLeave.has(String(id)));

    const cfg = await getSalesConfig();
    const rosterIds = (cfg.rosterMemberIds || []).map(String);
    if (rosterIds.length === 0) return eligible; // not configured — use everyone eligible

    const rosterSet = new Set(rosterIds);
    return eligible.filter((id) => rosterSet.has(String(id)));
};

/**
 * Current open-lead load per member id (string) across the given member ids.
 */
const getOpenLeadLoad = async (memberIds) => {
    if (memberIds.length === 0) return new Map();
    const counts = await SalesLead.aggregate([
        { $match: { assignedTo: { $in: memberIds }, status: { $in: OPEN_LEAD_STATUSES } } },
        { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
    ]);
    return new Map(counts.map((c) => [String(c._id), c.count]));
};

/**
 * Greedily assign `count` leads to the least-loaded members, keeping the load
 * even so everyone gets work — not just a few. Returns an array of member ids.
 */
const balancedAssignment = (count, memberIds, loadMap) => {
    const load = new Map(memberIds.map((id) => [String(id), loadMap.get(String(id)) || 0]));
    const result = [];
    for (let i = 0; i < count; i++) {
        let best = memberIds[0];
        for (const id of memberIds) {
            if (load.get(String(id)) < load.get(String(best))) best = id;
        }
        result.push(best);
        load.set(String(best), load.get(String(best)) + 1);
    }
    return result;
};

/**
 * The core distribution job — runs every 30 min (see the scheduler) and on
 * demand (roster save, leave approval, member deactivation). It spreads the
 * distribution pool EQUALLY across the currently-available roster.
 *
 * The pool is every open lead that is either explicitly flagged `pool: true`
 * (freshly created / freed) or currently held by someone who is not an available
 * roster member (a member who just went inactive or on leave). Leads already
 * held by an available member are never touched — so manual assignments stick
 * and a returning member starts from zero, only catching up via their equal
 * slice of subsequent pooled batches.
 */
export const autoDistributeLeads = async (actorId = null) => {
    const available = await getAvailableRosterMemberIds();
    if (available.length === 0) return { distributed: 0, members: 0 };

    const pool = await SalesLead.find({
        status: { $in: OPEN_LEAD_STATUSES },
        $or: [
            { pool: true },
            // Reclaim leads held by someone no longer available. `$exists`/`$ne: null`
            // matter: a deliberately unassigned lead (captured on the Leads page and
            // waiting for a manual "Assign to") also satisfies `$nin`, and must NOT
            // be swept up by this job.
            { assignedTo: { $exists: true, $ne: null, $nin: available } },
        ],
    }).select("_id status").lean();
    if (pool.length === 0) return { distributed: 0, members: available.length };

    // Empty load map ⇒ an even split of THIS batch (e.g. 50 leads / 5 = 10 each),
    // regardless of anyone's existing worked-lead count.
    const assignees = balancedAssignment(pool.length, available, new Map());
    await SalesLead.bulkWrite(buildAssignmentOps(pool, assignees, actorId, "Auto-distributed to the sales team"));

    await SalesActivityLog.create({
        actor: actorId,
        action: "LEADS_AUTO_DISTRIBUTED",
        entityType: "SalesLead",
        entityId: `auto_${Date.now()}`,
        metadata: { distributed: pool.length, members: available.length },
    });

    return { distributed: pool.length, members: available.length };
};

/** Background scheduler — spread new/freed leads across the roster every 30 min. */
export const startLeadAutoDistributeScheduler = (intervalMs = 30 * 60 * 1000) => {
    setInterval(() => {
        autoDistributeLeads().catch((err) =>
            console.error("[LeadAutoDistribute] scheduled run failed:", err.message)
        );
    }, intervalMs);
};

export const getSalesTeam = async () => {
    const members = await User.find({ departmentRole: "sales" })
        .select("name lastName email departmentRole isSalesManager isActive")
        .sort({ name: 1 })
        .lean();
    const manager = members.find((m) => m.isSalesManager) || null;

    // Flag who's on leave today so the UI can grey them out, and expose the saved
    // roster so the distribution selector can pre-tick it.
    const onLeave = await getOnLeaveUserIdsToday();
    const cfg = await getSalesConfig();
    const roster = (cfg.rosterMemberIds || []).map(String);
    const withStatus = members.map((m) => ({ ...m, onLeave: onLeave.has(String(m._id)) }));

    return { members: withStatus, managerId: manager ? manager._id : null, roster };
};

export const assignSalesManager = async (userId, actorId) => {
    const target = await User.findById(userId);
    if (!target) throw new Error("User not found");
    if (target.departmentRole !== "sales") {
        throw new Error("Only a member of the Sales department can be made Senior Sales Manager");
    }

    // Clear any existing Senior Sales Manager(s) — single holder. Department
    // stays "sales"; only the isSalesManager flag moves.
    await User.updateMany(
        { isSalesManager: true, _id: { $ne: target._id } },
        { $set: { isSalesManager: false } }
    );

    target.isSalesManager = true;
    await target.save();

    // The sales lead doesn't work leads themselves — hand any open leads they
    // currently hold to the rest of the active team.
    await redistributeOpenLeadsFrom(
        target._id, actorId, "Reassigned — owner promoted to Senior Sales Manager", "LEADS_REDISTRIBUTED_PROMOTION"
    );

    await SalesActivityLog.create({
        actor: actorId,
        action: "SALES_MANAGER_ASSIGNED",
        entityType: "User",
        entityId: target._id,
        metadata: { name: target.name }
    });

    return target;
};

export const unassignSalesManager = async (userId, actorId) => {
    const target = await User.findById(userId);
    if (!target) throw new Error("User not found");
    if (target.isSalesManager) {
        target.isSalesManager = false;
        await target.save();
    }

    await SalesActivityLog.create({
        actor: actorId,
        action: "SALES_MANAGER_UNASSIGNED",
        entityType: "User",
        entityId: target._id,
        metadata: { name: target.name }
    });

    return target;
};

/**
 * Persist the distribution roster (the members among whom leads are auto-split),
 * then do a one-time EQUAL spread of every open lead across the available roster
 * — the "500 leads / 5 staff" initial setup. From then on `autoDistributeLeads`
 * keeps only new/freed leads evenly distributed.
 */
export const setDistributionRoster = async (managerId, memberIds) => {
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
        throw new Error("Select at least one sales member for the roster");
    }

    // Roster may only contain active, non-manager sales members.
    const members = await User.find({
        _id: { $in: memberIds },
        departmentRole: "sales",
        isSalesManager: { $ne: true },
    }).select("_id").lean();
    const validIds = members.map((m) => m._id);
    if (validIds.length === 0) throw new Error("No eligible sales members selected");

    await setSalesRoster(validIds, managerId);

    // Spread all open leads equally across the available roster (on-leave members
    // are excluded here and picked up automatically once they return).
    const available = await getAvailableRosterMemberIds();
    if (available.length === 0) return { distributed: 0, perMember: {} };

    const pool = await SalesLead.find({ status: { $in: OPEN_LEAD_STATUSES } })
        .select("_id status").lean();
    if (pool.length === 0) return { distributed: 0, perMember: {} };

    const assignees = balancedAssignment(pool.length, available, new Map());
    const perMember = {};
    available.forEach((id) => { perMember[String(id)] = 0; });
    assignees.forEach((id) => { perMember[String(id)] += 1; });
    await SalesLead.bulkWrite(buildAssignmentOps(pool, assignees, managerId, "Distributed across the sales roster"));

    await SalesActivityLog.create({
        actor: managerId,
        action: "LEADS_DISTRIBUTED",
        entityType: "SalesLead",
        entityId: `distribute_${Date.now()}`,
        metadata: { distributed: pool.length, members: available.length }
    });

    return { distributed: pool.length, perMember };
};

export const assignLead = async (leadId, memberId, actorId) => {
    const lead = await SalesLead.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    const member = await User.findById(memberId).select("_id departmentRole isActive isSalesManager");
    if (!member || member.departmentRole !== "sales") {
        throw new Error("Target is not a sales team member");
    }
    if (member.isSalesManager) {
        throw new Error("The Senior Sales Manager does not take leads");
    }

    lead.assignedTo = member._id;
    lead.statusHistory.push({ status: lead.status, changedBy: actorId, note: "Manually reassigned by Senior Sales Manager" });
    await lead.save();

    await SalesActivityLog.create({
        actor: actorId,
        action: "LEAD_REASSIGNED",
        entityType: "SalesLead",
        entityId: lead._id,
        metadata: { assignedTo: member._id }
    });

    return lead.populate("customer");
};

/**
 * Spread a user's open leads across the remaining active sales members. The
 * Senior Sales Manager never works leads themselves, so managers are excluded
 * from receiving here. No-op when nobody eligible is available.
 */
const redistributeOpenLeadsFrom = async (userId, actorId, note, action) => {
    const openLeads = await SalesLead.find({
        assignedTo: userId,
        status: { $in: OPEN_LEAD_STATUSES },
    }).select("_id status").lean();
    if (openLeads.length === 0) return { redistributed: 0 };

    // Available roster members other than the one leaving — on-leave/inactive
    // members are excluded so leads never land back on someone unavailable.
    const memberIds = (await getAvailableRosterMemberIds())
        .filter((id) => String(id) !== String(userId));
    if (memberIds.length === 0) return { redistributed: 0 };

    const loadMap = await getOpenLeadLoad(memberIds);
    const assignees = balancedAssignment(openLeads.length, memberIds, loadMap);
    await SalesLead.bulkWrite(buildAssignmentOps(openLeads, assignees, actorId, note));

    const fromUser = await User.findById(userId).select("name lastName").lean();
    const fromName = fromUser
        ? [fromUser.name, fromUser.lastName].filter(Boolean).join(" ") || "A team member"
        : "A team member";

    await SalesActivityLog.create({
        actor: actorId,
        action,
        entityType: "SalesLead",
        entityId: `${action}_${Date.now()}`,
        metadata: { fromUser: userId, fromName, redistributed: openLeads.length, members: memberIds.length }
    });

    return { redistributed: openLeads.length, members: memberIds.length };
};

/**
 * When a sales member is deactivated, spread their open leads across the
 * remaining active sales members.
 */
export const redistributeLeadsFromInactive = async (userId, actorId) =>
    redistributeOpenLeadsFrom(userId, actorId, "Reassigned — previous owner set inactive", "LEADS_REDISTRIBUTED_INACTIVE");

/**
 * Free every open lead held by a non-available member (admin, founder, the sales
 * lead, an inactive or on-leave account) and spread it equally across the
 * available roster. Now an alias of the auto-distribute job, kept for the
 * "Free admin leads" action which triggers it on demand.
 */
export const sweepNonMemberLeads = async (actorId) => {
    const { distributed, members } = await autoDistributeLeads(actorId);
    return { swept: distributed, members };
};

/**
 * Recent "leads were redistributed" notices for the sales tracker banner.
 */
export const getSalesNotices = async () => {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const logs = await SalesActivityLog.find({
        action: { $in: ["LEADS_REDISTRIBUTED_INACTIVE", "LEADS_REDISTRIBUTED_PROMOTION"] },
        createdAt: { $gte: since },
    }).sort({ createdAt: -1 }).limit(20).lean();

    return logs.map((l) => {
        const name = l.metadata?.fromName || "A team member";
        const count = l.metadata?.redistributed || 0;
        const message = l.action === "LEADS_REDISTRIBUTED_INACTIVE"
            ? `${name} is now inactive — their ${count} open lead(s) were shared out across the active sales team.`
            : `${name} was made Senior Sales Manager — their ${count} open lead(s) were shared out across the active sales team.`;
        return { id: String(l._id), createdAt: l.createdAt, type: l.action, name, count, message };
    });
};

export const getSalesOversight = async () => {
    const { members } = await getSalesTeam();

    const counts = await SalesLead.aggregate([
        { $match: { pool: { $ne: true } } }, // ignore leads still sitting in the pool
        { $group: { _id: "$assignedTo", statuses: { $push: "$status" } } }
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.statuses]));

    const rows = members.map((m) => {
        const statuses = countMap.get(String(m._id)) || [];
        const tally = { open: 0, followUp: 0, converted: 0, dropped: 0, total: statuses.length };
        statuses.forEach((s) => {
            if (s === "FOLLOW_UP") tally.followUp += 1;
            else if (s === "CONVERTED") tally.converted += 1;
            else if (s === "DROPPED") tally.dropped += 1;
            else tally.open += 1; // NEW / CONTACTED
        });
        const actionable = tally.converted + tally.dropped + tally.open + tally.followUp;
        const completion = actionable > 0 ? Math.round((tally.converted / actionable) * 100) : 0;
        return {
            _id: m._id,
            name: [m.name, m.lastName].filter(Boolean).join(" ") || m.email,
            email: m.email,
            isManager: !!m.isSalesManager,
            isActive: m.isActive,
            ...tally,
            completion,
        };
    });

    return rows;
};
