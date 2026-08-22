import SalesCustomer from "../models/salesCustomer.model.js";
import SalesLead, { PAYMENT_METHODS } from "../models/salesLead.model.js";
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
import { buildTaskSteps } from "../../service-steps/serviceSteps.service.js";
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

    const leads = await SalesLead.find(query)
        .populate("customer")
        .populate("orderId", "orderNumber orderStatus pricing items")
        .populate("assignedTo", "name lastName email")
        // Lets the Leads board show whether a request has been handed to
        // someone yet, and how that work is going.
        .populate("taskId", "title status dueAt priority")
        .populate("services.assignedTo", "name lastName email")
        .populate("services.taskId", "title status dueAt priority serviceRequest")
        .populate("followUpHistory.createdBy", "name email")
        .sort({ createdAt: -1 })
        .lean();

    return leads.map(withServices);
};

/**
 * Guarantees a lead exposes a `services` array to the client.
 *
 * Leads captured before multi-service support only carry the flat
 * productInterest/serviceSlug fields, so one is synthesized from them on read.
 * Nothing is written back — the row upgrades itself the first time it is saved
 * through the normal paths.
 */
const withServices = (lead) => {
    if (!lead) return lead;
    if (Array.isArray(lead.services) && lead.services.length > 0) return lead;

    if (!lead.productInterest) return { ...lead, services: [] };

    return {
        ...lead,
        services: [{
            // Reuse the lead id so the assign call has a stable handle for a
            // service that has no subdocument of its own yet.
            _id: lead._id,
            title: lead.productInterest,
            slug: lead.serviceSlug,
            category: lead.serviceCategory,
            stage: lead.serviceStage || "documents_pending",
            taskId: lead.taskId,
            assignedTo: lead.assignedTo,
            dueAt: lead.taskId?.dueAt,
            legacy: true,
        }],
    };
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
export const LEAD_TEMPERATURES = ["HOT", "WARM", "COLD"];

/**
 * Normalizes the services a client opted for.
 *
 * Accepts either the multi-service shape (`services: [{ title, slug, … }]`) or
 * the legacy single-service fields, so website submissions, spreadsheet imports
 * and the dashboard all land on the same array. Duplicates are collapsed —
 * asking for the same service twice is one piece of work.
 */
export const buildLeadServices = (data) => {
    const raw = Array.isArray(data?.services) ? data.services : [];

    const candidates = raw.length
        ? raw
        : [{
            title: data?.productInterest,
            slug: data?.serviceSlug,
            category: data?.serviceCategory,
            stage: data?.serviceStage,
        }];

    const services = [];
    const seen = new Set();

    for (const candidate of candidates) {
        const title = String(candidate?.title ?? candidate?.serviceTitle ?? "").trim();
        if (!title) continue;

        const slug = String(candidate?.slug ?? candidate?.serviceSlug ?? "").trim();
        // Slug identifies a catalog service; free-text entries fall back to the
        // title so two spellings of the same thing still collapse.
        const key = (slug || title).toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);

        const stage = SERVICE_STAGES.includes(candidate?.stage) ? candidate.stage : "documents_pending";
        const temperature = LEAD_TEMPERATURES.includes(String(candidate?.temperature ?? "").toUpperCase())
            ? String(candidate.temperature).toUpperCase()
            : "WARM";

        services.push({
            title,
            slug: slug || undefined,
            category: String(candidate?.category ?? candidate?.serviceCategory ?? "").trim() || undefined,
            categorySlug: String(candidate?.categorySlug ?? candidate?.serviceCategorySlug ?? "").trim() || undefined,
            stage,
            temperature,
            startAt: parseDate(candidate?.startAt ?? candidate?.startDate),
            // The target date the client was promised. Assigning the service
            // carries it onto the task as its deadline.
            dueAt: parseDate(candidate?.dueAt ?? candidate?.targetDate ?? candidate?.deadline),
            // Quotation set at lead creation time. Mirrored into
            // initialQuotation, which later confirmations never overwrite.
            quotation: candidate?.quotation != null ? Number(candidate.quotation) : undefined,
            initialQuotation: candidate?.quotation != null ? Number(candidate.quotation) : undefined,
        });
    }

    return services;
};

/** Lenient date coercion — anything unparseable is simply left unset. */
const parseDate = (value) => {
    if (!value) return undefined;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

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

    const services = buildLeadServices(data);

    // Temperature is set per service. The lead-level badge on the board shows
    // the hottest of them — a client with one urgent request is a hot lead even
    // if their other requests can wait.
    const hottest = ["HOT", "WARM", "COLD"].find((level) =>
        services.some((service) => service.temperature === level)
    );

    // With no services and no explicit value, read it off the urgency the lead
    // came in with, so an imported "Urgent" row lands on the board as Hot.
    const fromPriority = { URGENT: "HOT", HIGH: "HOT", MEDIUM: "WARM", LOW: "COLD" }[priority] ?? "WARM";

    const temperature = LEAD_TEMPERATURES.includes(String(data.temperature ?? "").toUpperCase())
        ? String(data.temperature).toUpperCase()
        : (hottest ?? fromPriority);

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
        services,
        // The flat service fields mirror services[0] so older screens, exports
        // and the CSV pipelines keep reading a sensible "primary" service.
        productInterest: services[0]?.title ?? (String(data.productInterest ?? "").trim() || undefined),
        serviceSlug: services[0]?.slug ?? (String(data.serviceSlug ?? "").trim() || undefined),
        serviceCategory: services[0]?.category ?? (String(data.serviceCategory ?? "").trim() || undefined),
        serviceStage: services[0]?.stage ?? (SERVICE_STAGES.includes(data.serviceStage) ? data.serviceStage : "documents_pending"),
        temperature,
        priority,
        status,
        source,
        followUpAt,
        // One follow-up note for the lead as a whole — the reminder of what was
        // agreed with the client, regardless of how many services they booked.
        followUpNote: String(data.followUpNote ?? "").trim() || undefined,
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

    // "Add Client" on the Clients board creates the record as CONVERTED — the
    // act of adding someone as a client IS the confirmation, so its services
    // start confirmed. A plain lead has to be confirmed on the Leads board
    // before it becomes a client.
    const services = input.status === "CONVERTED"
        ? input.services.map((service) => ({ ...service, quotationConfirmed: true }))
        : input.services;

    // A lead captured here stays deliberately unassigned until someone uses
    // "Assign to" — it is NOT pooled, so the auto-distribute job leaves it be.
    const lead = await SalesLead.create({
        customer: customer._id,
        assignedTo: data.assignedTo || undefined,
        pool: false,
        status: input.status,
        source: input.source,
        services,
        productInterest: input.productInterest,
        serviceSlug: input.serviceSlug,
        serviceCategory: input.serviceCategory,
        serviceStage: input.serviceStage,
        temperature: input.temperature,
        priority: input.priority,
        followUpAt: input.followUpAt,
        followUpNote: input.followUpNote,
        message: input.message,
        statusHistory: [{
            status: input.status,
            changedBy: actorId,
            note: "Manually created lead",
        }],
        // Seed the timeline so the note captured at intake is the first entry,
        // not something that only appears once someone edits the lead later.
        followUpHistory: input.followUpNote
            ? [{ note: input.followUpNote, followUpAt: input.followUpAt, createdBy: actorId }]
            : [],
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
                services: input.services,
                productInterest: input.productInterest,
                serviceSlug: input.serviceSlug,
                serviceCategory: input.serviceCategory,
                serviceStage: input.serviceStage,
                temperature: input.temperature,
                priority: input.priority,
                followUpAt: input.followUpAt,
                followUpNote: input.followUpNote,
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

/** Full lead record for the details popup, with every service's task resolved. */
export const getLeadDetail = async (leadId) => {
    const lead = await SalesLead.findById(leadId)
        .populate("customer")
        .populate("assignedTo", "name lastName email")
        .populate("taskId", "title status dueAt priority")
        .populate("services.assignedTo", "name lastName email")
        .populate("services.taskId", "title status dueAt priority serviceRequest")
        .populate("statusHistory.changedBy", "name lastName email")
        .populate("followUpHistory.createdBy", "name lastName email")
        .lean();

    if (!lead) throw new AppError("Lead not found", 404);

    // Newest first, with the author flattened to a name — the popups render
    // this list directly, and an unsorted list of populated user objects is not
    // something a timeline can display.
    lead.followUpHistory = [...(lead.followUpHistory ?? [])]
        .sort((a, b) => Number(new Date(b.createdAt ?? 0)) - Number(new Date(a.createdAt ?? 0)))
        .map((entry) => ({
            _id: String(entry._id),
            note: entry.note ?? "",
            outcome: entry.outcome ?? "note",
            followUpAt: entry.followUpAt ?? null,
            createdAt: entry.createdAt ?? null,
            createdBy: entry.createdBy
                ? [entry.createdBy.name, entry.createdBy.lastName].filter(Boolean).join(" ") || entry.createdBy.email
                : null,
        }));

    return withServices(lead);
};

/** Marks how warm the lead is — the hot/warm/cold badge on the Leads board. */
export const setLeadTemperature = async (leadId, temperature, actorId) => {
    const value = String(temperature ?? "").toUpperCase();
    if (!LEAD_TEMPERATURES.includes(value)) {
        throw new AppError(`Temperature must be one of: ${LEAD_TEMPERATURES.join(", ")}.`, 400);
    }

    const lead = await SalesLead.findByIdAndUpdate(
        leadId,
        { $set: { temperature: value } },
        { new: true }
    )
        .populate("customer")
        .populate("assignedTo", "name lastName email")
        .populate("services.assignedTo", "name lastName email")
        .populate("services.taskId", "title status dueAt priority serviceRequest")
        .lean();

    if (!lead) throw new AppError("Lead not found", 404);

    await SalesActivityLog.create({
        actor: actorId,
        action: "LEAD_TEMPERATURE_SET",
        entityType: "SalesLead",
        entityId: lead._id,
        metadata: { temperature: value },
    });

    return withServices(lead);
};

/**
 * Normalizes the checklist the admin confirmed in the assign stepper. Steps the
 * admin already ticked are stored as done so a service picked up mid-way starts
 * with an honest progress bar.
 */
const normalizeTaskSteps = (steps, actorId) => {
    if (!Array.isArray(steps)) return [];

    return steps
        .map((step, index) => ({
            title: String(step?.title ?? "").trim(),
            description: String(step?.description ?? "").trim() || undefined,
            order: Number.isFinite(Number(step?.order)) ? Number(step.order) : index,
            done: Boolean(step?.done),
        }))
        .filter((step) => step.title)
        .sort((a, b) => a.order - b.order)
        .map((step, index) => ({
            ...step,
            order: index,
            completedAt: step.done ? new Date() : undefined,
            completedBy: step.done ? actorId : undefined,
        }));
};

/**
 * Hands ONE of the client's services to an employee.
 *
 * Creates a Task stamped with that service, the client's full contact details
 * and the step checklist the admin confirmed, then links the task back to the
 * service so the Clients board can show who is doing what.
 *
 * Re-assigning a service that already has a task creates a fresh task for the
 * new employee and re-points the link; the old task is left alone so its
 * history (and any work logged against it) survives.
 */
export const assignLeadService = async (leadId, serviceId, actorId, { assignedTo, dueAt, priority, notes, steps, stage }) => {
    const lead = await SalesLead.findById(leadId).populate("customer");
    if (!lead) throw new AppError("Lead not found", 404);
    if (!assignedTo) throw new AppError("An assignee is required.", 400);

    const assignee = await User.findById(assignedTo).select("name lastName isActive");
    if (!assignee) throw new AppError("That employee no longer exists.", 400);
    if (assignee.isActive === false) {
        const name = [assignee.name, assignee.lastName].filter(Boolean).join(" ") || "That employee";
        throw new AppError(`${name} is deactivated — reactivate the account first.`, 400);
    }

    // Leads captured before multi-service support carry their service in the
    // flat fields only. Promote it to a real subdocument on first assignment so
    // it gets an id of its own from here on.
    if (lead.services.length === 0 && lead.productInterest) {
        lead.services.push({
            title: lead.productInterest,
            slug: lead.serviceSlug,
            category: lead.serviceCategory,
            stage: lead.serviceStage || "documents_pending",
        });
    }

    // No id at all (the back-compat caller) or a legacy lead's synthesized
    // service — which carries the lead's OWN id — both mean "the primary one".
    const wantsPrimary = !serviceId || String(serviceId) === String(lead._id);
    const target = wantsPrimary ? lead.services[0] : lead.services.id(serviceId);

    if (!target && wantsPrimary) throw new AppError("This lead has no service to assign yet.", 400);
    if (!target) throw new AppError("That service is not on this lead.", 404);

    const serviceTitle = target.title || "Service request";
    const clientName = lead.customer?.name?.trim() || lead.customer?.phone || "Client";

    const taskPriority = ["low", "medium", "high", "urgent", "critical"].includes(String(priority ?? "").toLowerCase())
        ? String(priority).toLowerCase()
        : (lead.priority || "MEDIUM").toLowerCase();

    // Falls back to the target date captured when the client asked for this
    // service, so assigning without touching the deadline keeps the promise
    // already made to them.
    const due = parseDate(dueAt) ?? target.dueAt ?? null;

    // The caller normally sends the checklist it showed the admin; a direct API
    // call with no steps still gets the service's configured template.
    const taskSteps = Array.isArray(steps) && steps.length > 0
        ? normalizeTaskSteps(steps, actorId)
        : normalizeTaskSteps(await buildTaskSteps(target.slug), actorId);

    const nextStage = SERVICE_STAGES.includes(stage) ? stage : (target.stage || "documents_pending");
    const clientAddress = [lead.customer?.addressLine1, lead.customer?.addressLine2, lead.customer?.city, lead.customer?.state]
        .filter(Boolean).join(", ") || undefined;

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
            serviceSlug: target.slug,
            serviceCategory: target.category,
            serviceCategorySlug: target.categorySlug,
            clientName,
            clientEmail: lead.customer?.email,
            clientPhone: lead.customer?.phone,
            clientCompany: lead.customer?.company,
            clientAddress,
            notes: notes ? String(notes).trim() : undefined,
            leadId: lead._id,
            leadServiceId: target._id,
            steps: taskSteps,
            stage: nextStage,
        },
    });

    target.taskId = task._id;
    target.assignedTo = assignedTo;
    target.assignedBy = actorId;
    target.assignedAt = new Date();
    target.dueAt = due ?? undefined;
    target.stage = nextStage;
    if (notes) target.notes = String(notes).trim();

    // The lead-level fields keep tracking the primary service so older screens
    // and exports stay meaningful.
    if (String(lead.services[0]?._id) === String(target._id)) {
        lead.serviceStage = nextStage;
        lead.taskId = task._id;
    }
    if (!lead.assignedTo) lead.assignedTo = assignedTo;
    lead.pool = false;

    // Handing a request to someone is the first real contact on it.
    if (lead.status === "NEW") {
        lead.status = "CONTACTED";
        lead.statusHistory.push({ status: "CONTACTED", changedBy: actorId, note: `Assigned "${serviceTitle}" to an employee` });
    }
    await lead.save();

    await SalesActivityLog.create({
        actor: actorId,
        action: "LEAD_SERVICE_ASSIGNED",
        entityType: "SalesLead",
        entityId: lead._id,
        metadata: {
            taskId: String(task._id),
            assignedTo: String(assignedTo),
            service: serviceTitle,
            serviceId: String(target._id),
        },
    });

    return await getLeadDetail(lead._id);
};

/**
 * Back-compat entry point for the older "assign the whole lead" call. Routes
 * through the per-service path so there is only one assignment code path.
 */
export const assignLeadAsTask = async (leadId, actorId, payload) =>
    await assignLeadService(leadId, payload?.serviceId ?? null, actorId, payload);

export const updateLeadServiceQuotation = async (leadId, serviceId, quotation, actorId) => {
    const lead = await SalesLead.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    const service = lead.services.id(serviceId);
    if (!service) throw new Error("Service not found on this lead");

    const oldQuotation = service.quotation;
    service.quotation = quotation;
    service.quotationConfirmed = true;

    lead.statusHistory.push({
        status: lead.status,
        changedBy: actorId,
        note: `Quotation for '${service.title}' updated from ${oldQuotation || 0} to ${quotation} (confirmed)`,
    });

    await lead.save();
    return lead;
};

/** Sum of a service's agreed line items, rounded to paise. */
const itemsTotal = (items = []) =>
    Math.round(items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) * 100) / 100;

/**
 * Confirms the whole engagement in one go: the line items agreed for each
 * service, the final quotation each of those sums to, and the single advance
 * payment covering the lot.
 *
 * Services the payload doesn't mention are left exactly as they were, so a
 * partial re-confirmation never silently wipes an earlier one.
 */
export const confirmLeadQuotation = async (leadId, payload, actorId) => {
    const lead = await SalesLead.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    const entries = Array.isArray(payload?.services) ? payload.services : [];
    if (entries.length === 0) throw new Error("At least one service is required");

    const confirmedTitles = [];

    // A lead captured before multi-service support has no subdocument to
    // confirm against — the board shows it one synthesized service, keyed on the
    // lead's own id. Give it a real subdocument the first time it is confirmed.
    if (lead.services.length === 0 && lead.productInterest) {
        lead.services.push({
            title: lead.productInterest,
            slug: lead.serviceSlug,
            category: lead.serviceCategory,
            stage: lead.serviceStage || "documents_pending",
            taskId: lead.taskId,
            assignedTo: lead.assignedTo,
        });
    }

    for (const entry of entries) {
        // The legacy service carries the lead's id on the board, so accept that
        // as a handle for the one subdocument just created above.
        const service =
            lead.services.id(entry.serviceId)
            || (String(entry.serviceId) === String(lead._id) && lead.services.length === 1
                ? lead.services[0]
                : null);
        if (!service) throw new Error("Service not found on this lead");

        const items = (Array.isArray(entry.items) ? entry.items : [])
            .filter((item) => String(item?.name ?? "").trim())
            .map((item) => ({
                name: String(item.name).trim(),
                amount: Math.max(0, Number(item.amount) || 0),
            }));

        const nextQuotation = items.length
            ? itemsTotal(items)
            : Math.max(0, Number(entry.quotation) || 0);

        // The opening figure is whatever was quoted when the lead was captured;
        // backfilled here for services that pre-date the field.
        if (service.initialQuotation == null && service.quotation != null) {
            service.initialQuotation = service.quotation;
        }

        service.quotationItems = items;
        // The quotation is the sum of its parts; an explicit total is only
        // honoured when there are no line items to add up.
        service.quotation = nextQuotation;
        service.quotationConfirmed = true;
        confirmedTitles.push(service.title);
    }

    const advance = payload?.advancePayment;
    if (advance && Number(advance.amount) > 0) {
        lead.advancePayment = {
            amount: Math.max(0, Number(advance.amount) || 0),
            mode: advance.mode === "online" ? "online" : "cash",
            note: advance.note ? String(advance.note).trim() : undefined,
            recordedAt: new Date(),
            recordedBy: actorId,
        };
    }

    const advanceNote = lead.advancePayment?.amount
        ? ` Advance ${lead.advancePayment.amount} received (${lead.advancePayment.mode}).`
        : "";

    lead.statusHistory.push({
        status: lead.status,
        changedBy: actorId,
        note: `Quotation confirmed for ${confirmedTitles.join(", ")}.${advanceNote}`,
    });

    await lead.save();
    return await getLeadDetail(lead._id);
};

/**
 * Records one payment received from the client.
 *
 * Payments sit on the account rather than on a service — an accountant opening
 * the ledger adds what came in, and the outstanding balance falls by that much.
 */
export const addLeadPayment = async (leadId, entry, actorId) => {
    const lead = await SalesLead.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    const amount = Number(entry?.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a payment amount greater than zero");

    const mode = PAYMENT_METHODS.includes(String(entry?.mode)) ? String(entry.mode) : "cash";

    lead.payments.push({
        amount: Math.round(amount * 100) / 100,
        mode,
        note: entry?.note ? String(entry.note).trim() : undefined,
        paidAt: entry?.paidAt ? new Date(entry.paidAt) : new Date(),
        recordedBy: actorId,
    });

    lead.statusHistory.push({
        status: lead.status,
        changedBy: actorId,
        note: `Payment of ${amount} received.`,
    });

    await lead.save();
    return await getLeadDetail(lead._id);
};

/**
 * Removes a wrongly recorded payment. Looks on the account first, then falls
 * back to the per-service ledgers so receipts recorded before payments moved to
 * the account can still be corrected.
 */
export const deleteLeadPayment = async (leadId, paymentId, actorId) => {
    const lead = await SalesLead.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    const existing = lead.payments.id(paymentId);
    if (existing) {
        const { amount } = existing;
        existing.deleteOne();
        lead.statusHistory.push({
            status: lead.status,
            changedBy: actorId,
            note: `Payment of ${amount} removed.`,
        });
        await lead.save();
        return await getLeadDetail(lead._id);
    }

    for (const service of lead.services) {
        const legacy = service.ledger?.id(paymentId);
        if (!legacy) continue;

        const { amount } = legacy;
        legacy.deleteOne();
        lead.statusHistory.push({
            status: lead.status,
            changedBy: actorId,
            note: `Payment of ${amount} removed from '${service.title}'.`,
        });
        await lead.save();
        return await getLeadDetail(lead._id);
    }

    throw new Error("Payment not found");
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

/* ── Follow-ups ─────────────────────────────────────────────────────────────
 *
 * A follow-up is a promise to get back to the client. Each one logged records
 * what happened, when it was logged, and the date/time it was pushed to — so
 * the timeline answers "who said what, and when are we due next?" rather than
 * just overwriting a single date.
 */

export const FOLLOW_UP_OUTCOMES = ["contacted", "no_answer", "rescheduled", "meeting_set", "note"];

/** Which bucket a scheduled follow-up falls into, relative to right now. */
export const followUpBucket = (followUpAt) => {
    if (!followUpAt) return "unscheduled";

    const due = new Date(followUpAt);
    if (Number.isNaN(due.getTime())) return "unscheduled";

    const now = new Date();
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    if (due < now) return "overdue";
    if (due <= endOfToday) return "today";

    const endOfWeek = new Date(endOfToday);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    return due <= endOfWeek ? "this_week" : "later";
};

/**
 * Logs a follow-up against a lead and (optionally) reschedules the next one.
 *
 * The lead's own followUpAt/followUpNote always mirror the most recent entry,
 * so the boards can show "next due" without walking the history.
 */
export const logFollowUp = async (leadId, actorId, { note, outcome, nextFollowUpAt }) => {
    const lead = await SalesLead.findById(leadId);
    if (!lead) throw new AppError("Lead not found", 404);

    const text = String(note ?? "").trim();
    const next = parseDate(nextFollowUpAt);

    // An entry with neither a note nor a new date records nothing.
    if (!text && !next) {
        throw new AppError("Add a note, a next follow-up date, or both.", 400);
    }

    // Rescheduling has to move the date forward. Booking the next call on or
    // before the one currently on the books is how a lead ends up permanently
    // "due today" without anyone ever actually calling.
    if (next && lead.followUpAt && next.getTime() <= new Date(lead.followUpAt).getTime()) {
        throw new AppError(
            "The next follow-up has to be later than the one already scheduled.",
            400
        );
    }

    const resolvedOutcome = FOLLOW_UP_OUTCOMES.includes(String(outcome ?? "").toLowerCase())
        ? String(outcome).toLowerCase()
        : (next ? "rescheduled" : "note");

    lead.followUpHistory.push({
        note: text,
        outcome: resolvedOutcome,
        followUpAt: next ?? undefined,
        createdBy: actorId,
        createdAt: new Date(),
    });

    lead.lastContactedAt = new Date();
    // Clearing the date (logging with a note only) closes the loop: the lead
    // drops out of the due list rather than sitting there permanently overdue.
    lead.followUpAt = next ?? undefined;
    lead.followUpNote = text || lead.followUpNote;

    // Logging contact on an untouched lead moves it along the pipeline.
    if (lead.status === "NEW") {
        lead.status = next ? "FOLLOW_UP" : "CONTACTED";
        lead.statusHistory.push({ status: lead.status, changedBy: actorId, note: text || "Follow-up logged" });
    } else if (next && lead.status === "CONTACTED") {
        lead.status = "FOLLOW_UP";
        lead.statusHistory.push({ status: "FOLLOW_UP", changedBy: actorId, note: text || "Follow-up scheduled" });
    }

    await lead.save();

    await SalesActivityLog.create({
        actor: actorId,
        action: "LEAD_FOLLOW_UP_LOGGED",
        entityType: "SalesLead",
        entityId: lead._id,
        metadata: { outcome: resolvedOutcome, nextFollowUpAt: next ? next.toISOString() : null },
    });

    return await getLeadDetail(lead._id);
};

/**
 * Every lead with follow-up activity — those with a date scheduled, plus any
 * that have been followed up before. Shaped for the Follow-ups board.
 */
export const listFollowUps = async (user, filters = {}) => {
    const query = {
        // A converted or dropped lead is finished; chasing it is noise.
        status: { $nin: ["CONVERTED", "DROPPED"] },
        $or: [
            { followUpAt: { $ne: null } },
            { "followUpHistory.0": { $exists: true } },
        ],
    };

    const isManagerView = user.role === "admin" || user.isSalesManager === true;
    if (!isManagerView) {
        query.$and = [{ $or: [{ assignedTo: user._id }, { "services.assignedTo": user._id }] }];
    }

    const leads = await SalesLead.find(query)
        .populate("customer")
        .populate("assignedTo", "name lastName email")
        .populate("followUpHistory.createdBy", "name lastName email")
        .populate("services.assignedTo", "name lastName email")
        .sort({ followUpAt: 1 })
        .lean();

    const rows = leads.map((lead) => {
        const history = [...(lead.followUpHistory ?? [])].sort(
            (a, b) => Number(new Date(b.createdAt ?? 0)) - Number(new Date(a.createdAt ?? 0))
        );

        return {
            _id: String(lead._id),
            leadId: String(lead._id),
            reference: `LD-${String(lead._id).slice(-5).toUpperCase()}`,
            client: {
                name: lead.customer?.name?.trim() || lead.customer?.phone || "Unnamed client",
                phone: lead.customer?.phone ?? "",
                email: lead.customer?.email ?? "",
                company: lead.customer?.company ?? "",
                city: lead.customer?.city ?? "",
            },
            services: (lead.services ?? []).map((service) => ({
                _id: String(service._id),
                title: service.title,
                temperature: service.temperature || "WARM",
                assignedTo: service.assignedTo
                    ? [service.assignedTo.name, service.assignedTo.lastName].filter(Boolean).join(" ")
                    : null,
            })),
            status: lead.status,
            source: lead.source,
            owner: lead.assignedTo
                ? [lead.assignedTo.name, lead.assignedTo.lastName].filter(Boolean).join(" ")
                : null,
            followUpAt: lead.followUpAt ?? null,
            followUpNote: lead.followUpNote ?? "",
            bucket: followUpBucket(lead.followUpAt),
            lastFollowUpAt: history[0]?.createdAt ?? null,
            followUpCount: history.length,
            history: history.map((entry) => ({
                _id: String(entry._id),
                note: entry.note ?? "",
                outcome: entry.outcome ?? "note",
                followUpAt: entry.followUpAt ?? null,
                createdAt: entry.createdAt ?? null,
                createdBy: entry.createdBy
                    ? [entry.createdBy.name, entry.createdBy.lastName].filter(Boolean).join(" ") || entry.createdBy.email
                    : null,
            })),
        };
    });

    const bucket = String(filters.bucket ?? "").trim();
    return bucket ? rows.filter((row) => row.bucket === bucket) : rows;
};
