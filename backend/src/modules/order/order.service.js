import Order from "./order.model.js";
import Product from "../product/product.model.js";
import { reduceStock } from "../operations/inventory/ops-inventory.service.js";
import { sendOrderConfirmation } from "../notification/notification.service.js";
import * as refundService from "../refund/refund.service.js";
import Shipment from "../shipment/shipment.model.js";
import eventBus, { EVENTS } from "../../shared/events/eventBus.js";
import crypto from "crypto";
import mongoose from "mongoose";
import { incrementUsedCount } from "../coupon/coupon.service.js";
import { withTransaction } from "../../shared/infrastructure/db.transaction.js";
import { computeDeliveryCharge, computePartialCodSplit } from "./pricing.config.js";


const generateOrderNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const randomStr = crypto.randomBytes(2).toString("hex").toUpperCase(); // XXXX
  return `ORD-${dateStr}-${randomStr}`;
};

const CONFIRMATION_FAILURE_NOTE_PREFIX =
  "[System] Order confirmation failed after payment capture: ";

const PRODUCT_WEIGHT_FIELDS = [
  { field: "shippingWeight", unit: "grams" },
  { field: "shippingWeightGrams", unit: "grams" },
  { field: "weight", unit: "grams" },
  { field: "weightGrams", unit: "grams" },
];

const normalizeWeightToGrams = (value, unit = "grams") => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return null;
  }

  return unit === "kilograms" ? numericValue * 1000 : numericValue;
};

const readWeightFromRecord = (record = {}) => {
  for (const { field, unit } of PRODUCT_WEIGHT_FIELDS) {
    const weight = normalizeWeightToGrams(record?.[field], unit);
    if (weight !== null) {
      return weight;
    }
  }

  return null;
};

async function attachItemWeightSnapshots(items = []) {
  const validProductIds = Array.from(
    new Set(
      items
        .map((item) => item.productId)
        .filter((productId) => mongoose.Types.ObjectId.isValid(productId))
        .map((productId) => productId.toString())
    )
  );

  let productWeightMap = new Map();

  if (validProductIds.length > 0) {
    const products = await Product.find({
      _id: { $in: validProductIds },
    }).lean();

    productWeightMap = new Map(
      products.map((product) => [product._id.toString(), readWeightFromRecord(product)])
    );
  }

  return items.map((item) => {
    const itemWeight =
      readWeightFromRecord(item) ??
      productWeightMap.get(item.productId?.toString?.() || "") ??
      null;

    return {
      ...item,
      ...(itemWeight !== null && { weight: itemWeight }),
    };
  });
}

const appendSystemOrderNote = (existingNotes = "", message = "") => {
  const trimmedMessage = String(message || "").trim();
  const trimmedNotes = String(existingNotes || "").trim();

  if (!trimmedMessage) {
    return trimmedNotes;
  }

  const failureNote = `${CONFIRMATION_FAILURE_NOTE_PREFIX}${trimmedMessage}`;
  if (trimmedNotes.includes(failureNote)) {
    return trimmedNotes;
  }

  return trimmedNotes ? `${trimmedNotes}\n${failureNote}` : failureNote;
};

async function markOrderConfirmationFailure(order, error) {
  order.orderStatus = "FAILED";
  order.notes = appendSystemOrderNote(
    order.notes,
    error?.message || "Unknown confirmation error"
  );
  await order.save();
}

/**
 * Server-authoritative order preparation, shared by BOTH checkout paths:
 *   - COD          → createPendingOrder() below (writes an Order immediately)
 *   - online/PayU  → checkout.service.js (writes a PendingCheckout draft; the
 *                    real Order is only built once payment is verified)
 *
 * Both must derive pricing identically — a tampered client payload must never
 * change what is charged, and the two flows must never drift apart.
 */
export const prepareOrderPayload = async (data) => {
  const items = await attachItemWeightSnapshots(data.items);
  const paymentMethod = data.paymentMethod || "card";

  // Recompute delivery + final from subtotal — never trust the client's numbers.
  const subtotal = data.pricing.subtotal;
  const discountAmount = data.pricing.discountAmount || 0;
  const deliveryCharge = computeDeliveryCharge(subtotal);
  const finalAmount = (subtotal - discountAmount) + deliveryCharge;

  // Partial COD: split into an online prepaid leg and a COD balance.
  let prepaidAmount = 0;
  let codDueAmount = 0;
  if (paymentMethod === "partial_cod") {
    ({ prepaidAmount, codDueAmount } = computePartialCodSplit(subtotal, deliveryCharge, discountAmount));
  }

  return {
    items,
    paymentMethod,
    shippingAddress: data.shippingAddress,
    pricing: {
      subtotal,
      discountAmount,
      couponCode: data.pricing.couponCode || null,
      deliveryCharge,
      finalAmount,
      prepaidAmount,
      codDueAmount,
    },
    notes: data.notes,
    source: data.source,
  };
};

// COD only. Online payments must NOT create an order up-front — a failed or
// abandoned payment would strand it as PENDING_PAYMENT forever (PayU fires no
// callback at all when it rejects the request outright). See checkout.service.js.
export const createPendingOrder = async (userId, data) => {
  const prepared = await prepareOrderPayload(data);

  const order = new Order({
    orderNumber: generateOrderNumber(),
    userId,
    items: prepared.items,
    shippingAddress: prepared.shippingAddress,
    pricing: prepared.pricing,
    notes: prepared.notes,
    source: prepared.source,
    orderStatus: "PENDING_PAYMENT",
    payment: {
      paymentStatus: "PENDING",
      paymentMethod: prepared.paymentMethod,
    },
  });

  await order.save();
  return order;
};

/**
 * Build the real Order from a verified-paid PendingCheckout draft.
 *
 * The draft's pricing is already server-computed (prepareOrderPayload) — it is
 * the source of truth here, never recomputed from client input. The order number
 * is assigned HERE, on success, so failed payment attempts burn no numbers.
 *
 * The order is left PENDING so the caller can hand it to confirmOrder(), which
 * owns the stock reduction / coupon / packaging / notification side-effects and
 * guards on ["PENDING", "PAID"].
 */
export const createOrderFromCheckout = async (draft, payment = {}) => {
  const order = new Order({
    orderNumber: generateOrderNumber(),
    userId: draft.userId,
    items: draft.items,
    shippingAddress: draft.shippingAddress,
    pricing: draft.pricing,
    notes: draft.notes,
    source: draft.source,
    orderStatus: "PENDING",
    payment: {
      paymentMethod: draft.paymentMethod,
      paymentProvider: "payu",
      // Partial COD: only the prepaid leg came through PayU — a COD balance is
      // still outstanding, so this is PARTIAL, not a fully-paid SUCCESS.
      paymentStatus: draft.paymentMethod === "partial_cod" ? "PARTIAL" : "SUCCESS",
      payu_txnid: payment.txnid || null,
      payu_mihpayid: payment.mihpayid || null,
      gateway_status: "success",
      paidAt: new Date(),
    },
  });

  await order.save();
  return order;
};

export const attachPayment = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.orderStatus !== "PENDING_PAYMENT" && order.orderStatus !== "CREATED") {
    throw new Error("Order is not in pending payment state");
  }

  // Simulate PayU payment initiation (mock txnid for dev/testing)
  const mockPayuTxnId = `EVL_${Date.now()}_${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  order.payment.paymentOrderId = mockPayuTxnId;
  await order.save();

  return {
    orderId: order._id,
    paymentOrderId: mockPayuTxnId,
    amount: order.pricing.finalAmount,
    currency: "INR",
  };
};

export const verifyPayment = async (orderId, payload) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // In real-world, verify PayU hash here — use the /api/v1/payments/payu/verify endpoint
  const { paymentOrderId, paymentId, signature } = payload;

  if (order.payment.paymentOrderId !== paymentOrderId) {
    throw new Error("Invalid payment order ID");
  }

  const isPartialCod = order.payment.paymentMethod === "partial_cod";
  order.payment.paymentId = paymentId;
  // Partial COD: only the prepaid leg is confirmed here — a COD balance is
  // still due, so PARTIAL (not a fully-paid SUCCESS).
  order.payment.paymentStatus = isPartialCod ? "PARTIAL" : "SUCCESS";
  order.orderStatus = "PENDING";

  await order.save();

  return order;
};

export const bypassPayment = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  const isPartialCod = order.payment.paymentMethod === "partial_cod";
  // Bypass payment collection only — the order still awaits sales-team
  // confirmation, so it must rest at PENDING (not auto-confirmed).
  order.payment.paymentId = `BYPASS_DEMO_${Date.now()}`;
  order.payment.paymentStatus = isPartialCod ? "PARTIAL" : "SUCCESS";
  order.orderStatus = "PENDING";

  await order.save();

  return order;
};

export const confirmOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (!["PENDING", "PAID"].includes(order.orderStatus)) {
    throw new Error("Order must be PENDING or PAID before confirming");
  }

  try {
    // 1 + 3. Atomically reduce stock AND confirm the order.
    // If either fails the transaction rolls back — no desync between inventory and order.
    await withTransaction(async (session) => {
      await reduceStock(order.items, session);
      order.orderStatus = "CONFIRMED";
      await order.save({ session });
    });

    // 2. Send confirmation notification (non-atomic side-effect, outside transaction)
    await sendOrderConfirmation(order);

    // 3.5 Increment coupon usage if applied (best-effort)
    if (order.pricing.couponCode) {
      try {
        await incrementUsedCount(order.pricing.couponCode);
      } catch (err) {
        console.error("Failed to increment coupon count:", err.message);
      }
    }

    // 4. Notify packaging staff that a new order is ready to pack
    eventBus.emit(EVENTS.ORDER.CONFIRMED, {
      orderId: order._id,
      orderDisplayId: order.orderNumber,
    });

    return order;
  } catch (error) {
    try {
      await markOrderConfirmationFailure(order, error);
    } catch (markFailureError) {
      console.error(
        "Failed to persist order confirmation failure state:",
        markFailureError.message
      );
    }

    throw error;
  }
};

export const cancelOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // Ensure user owns order or is admin (controller will handle admin bypass if needed, but safe check here)
  if (order.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized to cancel this order");
  }

  const nonCancellableStatuses = ["SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
  if (nonCancellableStatuses.includes(order.orderStatus)) {
    throw new Error(`Cannot cancel order in ${order.orderStatus} status`);
  }

  order.orderStatus = "CANCELLED";
  await order.save();

  // If order was PAID, initiate a refund
  if (order.payment.paymentStatus === "SUCCESS") {
    await refundService.initiateRefund({
      orderId: order._id,
      amount: order.pricing.finalAmount,
      reason: "Order Cancelled by User",
      userId: order.userId
    });
  }

  return order;
};

export const updateOrderStatus = async (orderId, status) => {
  // Confirming an order is the sales-team gate: route it through confirmOrder
  // so stock reduction + packaging notification run as one atomic flow.
  if (status === "CONFIRMED") {
    return await confirmOrder(orderId);
  }

  const updateData = { orderStatus: status };

  if (["PAID", "CONFIRMED", "SHIPPED", "DELIVERED"].includes(status)) {
    updateData["payment.paymentStatus"] = "SUCCESS";
  } else if (status === "REFUNDED") {
    updateData["payment.paymentStatus"] = "REFUNDED";
  } else if (status === "FAILED") {
    updateData["payment.paymentStatus"] = "FAILED";
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    updateData,
    { new: true }
  );

  if (!order) {
    throw new Error("Order not found");
  }

  // Cascade status changes to the linked Shipment document
  if (status === "DELIVERED") {
    await Shipment.findOneAndUpdate(
      { orderId },
      {
        status: "DELIVERED",
        isDelivered: true,
        $push: {
          timeline: {
            status: "DELIVERED",
            description: "Marked delivered by admin",
            timestamp: new Date(),
          },
        },
      }
    );
  } else if (status === "CANCELLED") {
    await Shipment.findOneAndUpdate(
      { orderId },
      {
        status: "CANCELLED",
        $push: {
          timeline: {
            status: "CANCELLED",
            description: "Shipment cancelled — order cancelled by admin",
            timestamp: new Date(),
          },
        },
      }
    );
  }

  return order;
};

// FAILED orders are payment attempts that never went through — the order row is
// kept for audit/analytics but must never surface to the customer as a placed
// order. (Admins still see them via getAllOrders.)
export const getUserOrders = async (userId) => {
  return await Order.find({ userId, orderStatus: { $ne: "FAILED" } })
    .populate("items.productId", "img")
    .sort({ createdAt: -1 });
};

export const getAllOrders = async (filters = {}) => {
  return await Order.find(filters).populate("userId", "name email phone").sort({ createdAt: -1 });
};

export const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId).populate("userId", "name email phone");
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

export const getOrderByNumber = async (orderNumber) => {
  const order = await Order.findOne({ orderNumber }).populate("userId", "name email phone");
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};
