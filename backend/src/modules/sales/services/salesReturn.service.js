import SalesReturn from "../models/salesReturn.model.js";
import Return from "../../return/return.model.js";
import Order from "../../order/order.model.js";
import SalesActivityLog from "../models/salesActivityLog.model.js";
import Task from "../../task/task.model.js";
import salesEventBus from "../events/salesEventBus.js";
import { validateTransition } from "../utils/stateMachine.js";
import { createReturnShipment } from "../../shipment/shipment.service.js";
import * as baseReturnService from "../../return/return.service.js"; // to call existing base return logic
import * as workLog from "../../worklog/worklog.service.js"; // day-wise activity logs

export const ingestReturnsFromCSV = async (rows, session, actorId) => {
    // CSV can contain orderNumber (human readable) or returnId (ObjectId)
    
    const returnIds = [];
    
    // 1. Resolve IDs
    for (const row of rows) {
        if (row.returnId) {
            returnIds.push(row.returnId);
        } else if (row.orderNumber) {
            const order = await Order.findOne({ orderNumber: row.orderNumber }).session(session);
            if (order) {
                // Find the standard return for this order that is pending verification
                const baseRet = await Return.findOne({ 
                    orderId: order._id, 
                    status: "REQUESTED" 
                }).session(session);
                
                if (baseRet) {
                    returnIds.push(baseRet._id);
                }
            }
        }
    }

    const uniqueReturnIds = [...new Set(returnIds.map(id => id.toString()))];

    if (uniqueReturnIds.length === 0) {
        throw new Error("No valid returns found for the provided identifiers (orderNumber/returnId)");
    }

    const baseReturns = await Return.find({ _id: { $in: uniqueReturnIds } }).session(session);

    const salesReturnDocs = [];
    baseReturns.forEach(baseRet => {
        salesReturnDocs.push({
            returnId: baseRet._id,
            orderId: baseRet.orderId,
            assignedTo: actorId, // Auto-assign to uploader or pool
            salesStatus: "REQUESTED",
            source: "csv",
            statusHistory: [{ status: "REQUESTED", changedBy: actorId, note: "Ingested via CSV" }]
        });
    });

    const salesReturns = await SalesReturn.insertMany(salesReturnDocs, { session });

    // Tasks for verification
    const taskDocs = salesReturns.map(sr => ({
        title: `Verify Return ${sr.returnId}`,
        type: "return_verify",
        status: "pending",
        assignedTo: sr.assignedTo,
        relatedEntity: {
            entityType: "SalesReturn",
            entityId: sr._id
        },
        source: "csv_upload",
        priority: "high",
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }));

    const tasks = await Task.insertMany(taskDocs, { session });

    // Link Tasks
    for (let i=0; i<salesReturns.length; i++) {
        salesReturns[i].taskId = tasks[i]._id;
        await salesReturns[i].save({ session });
    }

    await SalesActivityLog.create([{
        actor: actorId,
        action: "CSV_RETURNS_INGESTED",
        entityType: "CSVUpload",
        entityId: `upload_${Date.now()}`,
        metadata: { rowsProcessed: salesReturns.length }
    }], { session });
};

export const verifyReturn = async (salesReturnId, actorId) => {
    const sr = await SalesReturn.findById(salesReturnId);
    if (!sr) throw new Error("Sales Return not found");

    validateTransition("RETURN", sr.salesStatus, "VERIFIED");

    sr.statusHistory.push({ status: "VERIFIED", changedBy: actorId });
    sr.salesStatus = "VERIFIED";
    sr.verifiedAt = new Date();
    await sr.save();

    await SalesActivityLog.create({
        actor: actorId,
        action: "RETURN_VERIFIED",
        entityType: "SalesReturn",
        entityId: sr._id
    });
    return sr;
};

export const approveSalesReturn = async (salesReturnId, actorId, adminComment = "Approved by Sales") => {
    const sr = await SalesReturn.findById(salesReturnId);
    if (!sr) throw new Error("Sales Return not found");

    validateTransition("RETURN", sr.salesStatus, "APPROVED");

    // 1. Delegate to underlying return module (it requires a pickupDate)
    const mockPickupDate = new Date();
    mockPickupDate.setDate(mockPickupDate.getDate() + 2); // 2 days from now

    await baseReturnService.approveReturn(sr.returnId, adminComment, mockPickupDate);

    // 2. Update Sales Wrapper
    sr.statusHistory.push({ status: "APPROVED", changedBy: actorId, note: adminComment });
    sr.salesStatus = "APPROVED";
    sr.approvedAt = new Date();
    await sr.save();

    await SalesActivityLog.create({
        actor: actorId,
        action: "RETURN_APPROVED",
        entityType: "SalesReturn",
        entityId: sr._id
    });

    // 3. Emit event (e.g. to initiate pickup asynchronously)
    salesEventBus.emit("RETURN_APPROVED", { salesReturn: sr, customer: {} });

    return sr;
};

export const initiatePickup = async (salesReturnId, actorId) => {
     const sr = await SalesReturn.findById(salesReturnId).populate('returnId').populate('orderId');
     if (!sr) throw new Error("Sales Return not found");

     validateTransition("RETURN", sr.salesStatus, "PICKUP_INITIATED");

     const addressDetails = sr.orderId?.shippingAddress || {};

     // Call the real shipment service
     const shipment = await createReturnShipment({
       orderId: sr.orderId._id,
       returnId: sr.returnId._id,
       items: sr.returnId.items,
       pickupAddress: addressDetails,
     });

     sr.salesStatus = "PICKUP_INITIATED";
     sr.pickupInitiatedAt = new Date();
     sr.deliveryPartnerRef = shipment.trackingId;
     sr.awb = shipment.trackingId;
     sr.shipmentId = shipment._id;
     sr.statusHistory.push({ status: "PICKUP_INITIATED", changedBy: actorId, note: `AWB: ${shipment.trackingId}` });
     
     await sr.save();

     await SalesActivityLog.create({
        actor: actorId,
        action: "RETURN_PICKUP_INITIATED",
        entityType: "SalesReturn",
        entityId: sr._id,
        metadata: { awb: shipment.trackingId }
    });

    return sr;
};

export const completeReturn = async (salesReturnId, actorId) => {
    const sr = await SalesReturn.findById(salesReturnId);
    if (!sr) throw new Error("Sales Return not found");

    validateTransition("RETURN", sr.salesStatus, "COMPLETED");

    // Update underlying module
    await baseReturnService.markAsPickedUp(sr.returnId);
    // Or mark as refunded depending on flow, keeping it isolated.

    sr.salesStatus = "COMPLETED";
    sr.completedAt = new Date();
    sr.statusHistory.push({ status: "COMPLETED", changedBy: actorId });
    await sr.save();

    // Close task
    if (sr.taskId) {
         await Task.findByIdAndUpdate(sr.taskId, { status: "completed", completedAt: new Date() });
    }

    await SalesActivityLog.create({
        actor: actorId,
        action: "RETURN_COMPLETED",
        entityType: "SalesReturn",
        entityId: sr._id
    });

    await workLog.logActivity({
        user: actorId,
        activity: `Completed return ${sr.returnId || sr._id}`,
        category: "return",
        refType: "SalesReturn",
        refId: sr._id,
    });

    return sr;
};

export const getAssignedReturns = async (userId, filters = {}) => {
    const query = {};

    return await SalesReturn.find(query)
        .populate({
            path: "returnId",
            populate: [
                { path: "userId", select: "name phone email" },
                { path: "items.productId", select: "name img price" }
            ]
        })
        .populate({
            path: "orderId",
            select: "orderNumber items pricing payment createdAt shippingAddress userId"
        })
        .sort({ createdAt: -1 });
};

export const createManualReturn = async (actorId, data) => {
    const { orderNumber, reason, items } = data;

    // 1. Find the order
    const order = await Order.findOne({ orderNumber });
    if (!order) throw new Error("Order not found with that reference number");

    // 2. Create base return record via base service
    const baseRet = await baseReturnService.requestReturn(order.userId, {
        orderId: order._id,
        items, // array of { productId, quantity, reason }
        comment: reason
    });

    // 3. Create Sales Wrapper
    const sr = await SalesReturn.create({
        returnId: baseRet._id,
        orderId: order._id,
        assignedTo: actorId,
        salesStatus: "REQUESTED",
        source: "manual",
        statusHistory: [{ status: "REQUESTED", changedBy: actorId, note: "Manually registered return" }]
    });

    const task = await Task.create({
        title: `Verify Manual Return for Order ${orderNumber}`,
        type: "return_verify",
        status: "pending",
        assignedTo: actorId,
        relatedEntity: {
            entityType: "SalesReturn",
            entityId: sr._id
        },
        source: "manual",
        priority: "medium",
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    sr.taskId = task._id;
    await sr.save();

    await SalesActivityLog.create({
        actor: actorId,
        action: "MANUAL_RETURN_REGISTERED",
        entityType: "SalesReturn",
        entityId: sr._id,
        metadata: { orderNumber }
    });

    // Emit event to notify customer (bridge to website workflow)
    // We pass a dummy customer object since the notification hook uses it
    salesEventBus.emit("RETURN_REGISTERED", { salesReturn: sr, customer: { name: order.shippingAddress.fullName, phone: order.shippingAddress.phone } });

    return await sr.populate(["returnId", "orderId"]);
};

