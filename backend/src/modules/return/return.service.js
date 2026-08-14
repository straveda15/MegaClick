import Return from "./return.model.js";
import Order from "../order/order.model.js";
import { increaseStock } from "../operations/inventory/ops-inventory.service.js";
import * as refundService from "../refund/refund.service.js";
import * as shipmentService from "../shipment/shipment.service.js";
import { processRefund } from '../refund/refund.service.js';
import Refund from '../refund/refund.model.js';
import User from "../user/user.model.js";
import { sendReturnRequestEmail } from "./return.mailer.js";

// `requestUser` may be the authenticated user document (has _id, name, email,
// phone) — as sent from the customer-facing flow — OR a bare userId/ObjectId,
// as sent by the staff "manual return" flow. We normalise both here.
export const requestReturn = async (requestUser, data) => {
    const userId = requestUser?._id || requestUser;
    let customer = requestUser && requestUser._id ? requestUser : null;
    const { orderId, items, comment, requestedPickupDate } = data;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error("Order not found.");
    }

    // 1. Verify order belongs to user
    if (order.userId.toString() !== userId.toString()) {
        throw new Error("Unauthorized to request return for this order.");
    }

    // 2. Verify items exist in order
    for (const item of items) {
        const orderItem = order.items.find(
            (oi) => oi.productId.toString() === item.productId.toString()
        );
        if (!orderItem) {
            throw new Error(`Item with Product ID ${item.productId} not found in order.`);
        }
        if (item.quantity > orderItem.quantity) {
            throw new Error(`Requested return quantity for ${item.productId} exceeds purchased quantity.`);
        }
    }

    // 3. Prevent duplicate return requests for the same items in this order
    const existingReturn = await Return.findOne({
        orderId: orderId,
        "items.productId": { $in: items.map(i => i.productId) },
        status: { $ne: "REJECTED" }
    });

    if (existingReturn) {
        throw new Error("A return request has already been submitted for one or more of these items.");
    }

    // 4. Create return request
    const returnRequest = new Return({
        orderId,
        userId,
        items,
        comment,
        requestedPickupDate: requestedPickupDate || null,
        status: "REQUESTED",
    });

    await returnRequest.save();

    // 5. Update order returnStatus
    order.returnStatus = "RETURN_REQUESTED";
    await order.save();

    // 6. Email the returns team (best-effort — never blocks the request).
    //    replyTo is set to the customer so the team can reply directly to them.
    if (!customer) {
        customer = await User.findById(userId).select("name email phone").lean().catch(() => null);
    }
    sendReturnRequestEmail({ order, items, comment, requestedPickupDate, customer })
        .catch((err) => console.error("Return request email failed:", err?.message));

    return returnRequest;
};

export const approveReturn = async (returnId, adminComment, pickupDate) => {
    const returnRequest = await Return.findById(returnId);
    if (!returnRequest) {
        throw new Error("Return request not found.");
    }

    if (returnRequest.status !== "REQUESTED") {
        throw new Error(`Cannot approve return in ${returnRequest.status} status.`);
    }

    if (!pickupDate) {
        throw new Error("A pickup date is required to approve a return.");
    }

    // 1. Update status to APPROVED
    returnRequest.status = "APPROVED";
    returnRequest.adminComment = adminComment;
    returnRequest.pickupDate = new Date(pickupDate);
    returnRequest.approvedAt = new Date();
    await returnRequest.save();

    // 2. Increase stock in inventory
    for (const item of returnRequest.items) {
        await increaseStock(item.productId, item.quantity);
    }

    // 3. Update order returnStatus
    const order = await Order.findById(returnRequest.orderId);
    if (order) {
        order.returnStatus = "RETURN_APPROVED";
        await order.save();
    }

    // 4. Create actual return shipment with provider (Shiprocket/Shipmozo/IndiaPost)
    try {
        const shipment = await shipmentService.createReturnShipment(order);
        returnRequest.shipmentId = shipment._id;
        returnRequest.trackingId = shipment.trackingId;
        returnRequest.awbNumber = shipment.awbNumber;
        await returnRequest.save();
    } catch (shipmentError) {
        console.error("Return Shipment creation failed, but return was approved:", shipmentError.message);
        // We don't throw here to avoid rolling back the approval, 
        // but admin might need to retry shipment creation manually if needed.
    }

    return returnRequest;
};

export const rejectReturn = async (returnId, adminComment) => {
    const returnRequest = await Return.findById(returnId);
    if (!returnRequest) {
        throw new Error("Return request not found.");
    }

    if (returnRequest.status !== "REQUESTED") {
        throw new Error(`Cannot reject return in ${returnRequest.status} status.`);
    }

    // 1. Status REJECTED
    returnRequest.status = "REJECTED";
    returnRequest.adminComment = adminComment;
    returnRequest.rejectedAt = new Date();
    await returnRequest.save();

    // 2. Update order returnStatus
    const order = await Order.findById(returnRequest.orderId);
    if (order) {
        order.returnStatus = "RETURN_REJECTED";
        await order.save();
    }

    return returnRequest;
};

export const markAsPickedUp = async (returnId) => {
    const returnRequest = await Return.findById(returnId);
    if (!returnRequest || returnRequest.status !== "APPROVED") {
        throw new Error("Only approved returns can be marked as picked up.");
    }

    // 1. Update status to PICKED_UP + timestamp
    returnRequest.status = "PICKED_UP";
    returnRequest.pickedUpAt = new Date();
    await returnRequest.save();

    // 2. Update order returnStatus
    const order = await Order.findById(returnRequest.orderId);
    if (order) {
        order.returnStatus = "RETURN_PICKED_UP";
        await order.save();
    }

    // 3. Calculate raw return value — sum of (priceAtPurchase × quantity) for returned items
    const rawReturnValue = returnRequest.items.reduce((total, returnItem) => {
        const orderItem = order?.items?.find((oi) => {
            const orderItemProductId = oi.productId?._id?.toString() || oi.productId?.toString();
            const returnItemProductId = returnItem.productId?._id?.toString() || returnItem.productId?.toString();
            return orderItemProductId === returnItemProductId;
        });
        const unitPrice = orderItem?.priceAtPurchase || 0;
        return total + unitPrice * returnItem.quantity;
    }, 0);

    let refundAmount = 0;
    
    // Check if returning ALL items at full quantities (Full Return)
    const isFullReturn = order?.items?.length > 0 && order.items.every(oi => {
        const ri = returnRequest.items.find(r => {
            const orderItemProductId = oi.productId?._id?.toString() || oi.productId?.toString();
            const returnItemProductId = r.productId?._id?.toString() || r.productId?.toString();
            return orderItemProductId === returnItemProductId;
        });
        return ri && ri.quantity === oi.quantity;
    });

    if (isFullReturn) {
        refundAmount = order?.pricing?.finalAmount || 0;
    } else {
        const subtotal = order?.pricing?.subtotal || 1; // prevent division by zero
        const discountAmount = order?.pricing?.discountAmount || 0;
        
        // Proportionally deduct the discount based on how much is being returned
        const proportionalDiscount = (rawReturnValue / subtotal) * discountAmount;
        refundAmount = Math.max(0, rawReturnValue - proportionalDiscount);
        
        // Round to 2 decimal places to avoid floating point anomalies
        refundAmount = Math.round(refundAmount * 100) / 100;
    }

    // 4. Create a PENDING refund record — admin must process it from the Refunds tab
    await refundService.createPendingRefund({
        orderId: returnRequest.orderId,
        amount: refundAmount,
        reason: `Return Picked Up — ${returnRequest.comment || "Customer requested return"}`,
        returnId: returnRequest._id,
        userId: returnRequest.userId,
    });

    return returnRequest;
};

export const markAsRefunded = async (returnId) => {
    const returnRequest = await Return.findById(returnId);
    if (!returnRequest || returnRequest.status !== "PICKED_UP") {
        throw new Error("Only picked-up returns can be marked as refunded.");
    }

    // Find the pending refund created when pickup was confirmed
    const { createPendingRefund } = await import('../refund/refund.service.js');
    let refund = await Refund.findOne({ returnId });

    // If no refund record exists yet, create one now
    if (!refund) {
        const order = await Order.findById(returnRequest.orderId);
        
        // Calculate raw return value — sum of (priceAtPurchase × quantity) for returned items
        const rawReturnValue = returnRequest.items.reduce((total, returnItem) => {
            const orderItem = order?.items?.find((oi) => {
                const orderItemProductId = oi.productId?._id?.toString() || oi.productId?.toString();
                const returnItemProductId = returnItem.productId?._id?.toString() || returnItem.productId?.toString();
                return orderItemProductId === returnItemProductId;
            });
            const unitPrice = orderItem?.priceAtPurchase || 0;
            return total + unitPrice * returnItem.quantity;
        }, 0);

        let refundAmount = 0;
        
        // Check if returning ALL items at full quantities (Full Return)
        const isFullReturn = order?.items?.length > 0 && order.items.every(oi => {
            const ri = returnRequest.items.find(r => {
                const orderItemProductId = oi.productId?._id?.toString() || oi.productId?.toString();
                const returnItemProductId = r.productId?._id?.toString() || r.productId?.toString();
                return orderItemProductId === returnItemProductId;
            });
            return ri && ri.quantity === oi.quantity;
        });

        if (isFullReturn) {
            refundAmount = order?.pricing?.finalAmount || 0;
        } else {
            const subtotal = order?.pricing?.subtotal || 1; // prevent division by zero
            const discountAmount = order?.pricing?.discountAmount || 0;
            
            // Proportionally deduct the discount based on how much is being returned
            const proportionalDiscount = (rawReturnValue / subtotal) * discountAmount;
            refundAmount = Math.max(0, rawReturnValue - proportionalDiscount);
            
            // Round to 2 decimal places to avoid floating point anomalies
            refundAmount = Math.round(refundAmount * 100) / 100;
        }

        refund = await createPendingRefund({
            orderId: returnRequest.orderId,
            returnId,
            userId: returnRequest.userId,
            amount: refundAmount,
            reason: 'Return picked up — auto-refund',
        });
    }

    // Call the real PayU refund
    const processed = await processRefund(refund._id.toString());

    if (processed.status !== 'SUCCESS') {
        throw new Error(`Refund processing failed: ${processed.metadata?.error || 'unknown error'}`);
    }

    // Return status is already updated by processRefund
    return returnRequest;
};

export const getReturns = async (filters = {}) => {
    return await Return.find(filters)
        .populate("userId", "name phone email")
        .populate("orderId", "orderNumber items pricing payment createdAt shippingAddress userId")
        .populate("items.productId", "name img price")
        .sort({ createdAt: -1 });
};

export const getReturnById = async (returnId) => {
    const returnDoc = await Return.findById(returnId)
        .populate("userId", "name phone email")
        .populate("orderId", "orderNumber items pricing");
    if (!returnDoc) {
        throw new Error("Return record not found.");
    }
    return returnDoc;
};

export const getUserReturns = async (userId) => {
    return await Return.find({ userId })
        .populate("orderId", "orderNumber")
        .sort({ createdAt: -1 });
};