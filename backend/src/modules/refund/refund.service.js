import Refund from "./refund.model.js";
import Order from "../order/order.model.js";
import Return from "../return/return.model.js";
import crypto from "crypto";
import { initiatePayURefund } from "../payment/payment.service.js";

/**
 * Creates a PENDING refund record only — does NOT call the gateway.
 * Called automatically when admin confirms pickup.
 */
export const createPendingRefund = async (data) => {
    const { orderId, amount, reason, returnId, userId } = data;

    // Check for an existing pending refund for this return to avoid duplicates
    if (returnId) {
        const existing = await Refund.findOne({ returnId });
        if (existing) return existing;
    }

    const refund = new Refund({
        orderId,
        returnId,
        userId,
        amount,
        reason,
        status: "PENDING",
    });

    await refund.save();
    return refund;
};

/**
 * Processes a PENDING refund — calls the mock gateway, then updates
 * the Refund, Return, and Order statuses. Called manually by the admin.
 */
export const processRefund = async (refundId) => {
    const refund = await Refund.findById(refundId);
    if (!refund) throw new Error("Refund record not found.");
    if (refund.status !== "PENDING") {
        throw new Error(`Cannot process a refund that is already ${refund.status}.`);
    }

    // Mark as PROCESSING first
    refund.status = "PROCESSING";
    await refund.save();

    // Simulate gateway call
    const gatewayResponse = await simulateGatewayRefund(refund.orderId, refund.amount);

    if (gatewayResponse.success) {
        refund.status = "SUCCESS";
        refund.refundId = gatewayResponse.refundId;
        refund.processedAt = new Date();
        refund.metadata = gatewayResponse;
    } else {
        refund.status = "FAILED";
        refund.metadata = gatewayResponse.error;
    }

    await refund.save();

    // Update Return + Order statuses on success
    if (refund.status === "SUCCESS") {
        if (refund.returnId) {
            await Return.findByIdAndUpdate(refund.returnId, { status: "REFUNDED" });

            const order = await Order.findById(refund.orderId);
            if (order) {
                order.returnStatus = "RETURN_REFUNDED";
                await order.save();
            }
        }
    }

    return refund;
};

/**
 * Legacy: kept for any cancellation flows that don't go through returns.
 * For return-triggered refunds use createPendingRefund + processRefund.
 * Delegates to initiatePayURefund() for the actual PayU API call.
 */
export const initiateRefund = async (data) => {
    const { orderId, amount, reason, returnId, userId } = data;

    const refund = new Refund({
        orderId,
        returnId,
        userId,
        amount,
        reason,
        status: "PENDING",
    });
    await refund.save();

    try {
        const { gatewayRefundId } = await initiatePayURefund({
            mihpayid: refund.payu_mihpayid || refund.gatewayPaymentId,
            amount: refund.amount,
            txnid: refund.payu_txnid || refund.gatewayOrderId,
        });

        refund.status = "SUCCESS";
        refund.refundId = gatewayRefundId;
        refund.processedAt = new Date();
        refund.metadata = { gatewayRefundId };
    } catch (err) {
        refund.status = "FAILED";
        refund.metadata = { error: err.message };
    }

    await refund.save();

    if (refund.status === "SUCCESS") {
        if (returnId) {
            await Return.findByIdAndUpdate(returnId, { status: "REFUNDED" });
            const order = await Order.findById(orderId);
            if (order) {
                order.returnStatus = "RETURN_REFUNDED";
                await order.save();
            }
        } else {
            await Order.findByIdAndUpdate(orderId, { orderStatus: "CANCELLED" });
        }
    }

    return refund;
};

const simulateGatewayRefund = async (orderId, amount) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const isSuccess = Math.random() < 0.95;

    if (isSuccess) {
        return {
            success: true,
            refundId: `rfnd_${crypto.randomBytes(8).toString("hex")}`,
            gateway: "payu_mock",
            amount_refunded: amount,
        };
    } else {
        return {
            success: false,
            error: "Gateway Timeout",
        };
    }
};

export const getAllRefunds = async (filters = {}) => {
    return await Refund.find(filters)
        .populate("userId", "name email phone")
        .populate("orderId", "orderNumber")
        .populate("returnId", "status items")
        .sort({ createdAt: -1 });
};

export const getUserRefunds = async (userId) => {
    return await Refund.find({ userId })
        .populate("orderId", "orderNumber")
        .sort({ createdAt: -1 });
};

export const getRefundById = async (refundId) => {
    return await Refund.findById(refundId)
        .populate("userId", "name email phone")
        .populate("orderId", "orderNumber items pricing")
        .populate("returnId", "status items");
};
