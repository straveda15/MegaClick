import * as orderService from "./order.service.js";
import { createOrderSchema, updateOrderStatusSchema, verifyPaymentSchema } from "./order.validation.js";
import { createShipment } from "../shipment/shipment.service.js";
import Order from "./order.model.js";
import { canUserEditOrder } from "./order.edit.service.js";

// === USER APIs ===

export const createOrder = async (req, res) => {
  try {
    const { error, value } = createOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const userId = req.user._id;
    const order = await orderService.createPendingOrder(userId, value);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const payOrder = async (req, res) => {
  try {
    const paymentDetails = await orderService.attachPayment(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Payment initiated",
      data: paymentDetails,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { error, value } = verifyPaymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const order = await orderService.verifyPayment(req.params.id, value);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully, pending sales confirmation",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const bypassPaymentVerification = async (req, res) => {
  try {
    const order = await orderService.bypassPayment(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Payment bypassed, order placed — pending sales confirmation",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /orders/:id/confirm — used by website frontend for COD checkout
export const confirmCodOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (order.orderStatus !== "PENDING_PAYMENT") {
      return res.status(400).json({ success: false, message: `Order is already ${order.orderStatus}` });
    }

    // COD: payment not yet collected, set to PENDING for sales confirmation
    order.payment.paymentStatus = "PENDING";
    order.payment.paymentProvider = "cod";
    order.orderStatus = "PENDING";
    await order.save();

    return res.status(200).json({ success: true, message: "COD order placed, pending sales confirmation", data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderService.getUserOrders(userId);
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    // [DEBUG] Full req.user so we can see every field the permission helper uses
    console.log("[getOrder] FULL req.user:", JSON.stringify(req.user.toObject ? req.user.toObject() : req.user));
    const guardPasses = canUserEditOrder(req.user) || order.userId._id.toString() === req.user._id.toString();
    console.log("[getOrder] canUserEditOrder(req.user):", canUserEditOrder(req.user), "| guardPasses:", guardPasses);
    console.log("[getOrder] order._id:", order._id, "| shippingAddress keys:", order.shippingAddress ? Object.keys(order.shippingAddress.toObject ? order.shippingAddress.toObject() : order.shippingAddress) : "MISSING");
    console.log("[getOrder] items count:", Array.isArray(order.items) ? order.items.length : "NOT_ARRAY", "| first item:", order.items?.[0] ?? "NONE");

    // Allow admin/staff with order-management roles, or the customer who placed the order
    if (!guardPasses) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
        // Temporary debug payload — remove after investigation
        _debug: {
          role: req.user.role,
          operationalRoles: req.user.operationalRoles ?? null,
          currentOperationalRole: req.user.currentOperationalRole ?? null,
          departmentRole: req.user.departmentRole ?? null,
          canUserEditOrder: canUserEditOrder(req.user),
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.log("[getOrder] ERROR:", error.message);
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user._id);
    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// === ADMIN APIs ===

export const getAllOrders = async (req, res) => {
  try {
    // Optional filters from query could be passed here
    const orders = await orderService.getAllOrders(req.query);
    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { error, value } = updateOrderStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const order = await orderService.updateOrderStatus(req.params.id, value.status);
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/* ── POST /api/v1/orders/:id/dispatch — admin ───────────────────────────── */
export const dispatchOrder = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const allowedStatuses = ["CONFIRMED"];
    if (!allowedStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order must be CONFIRMED to dispatch (current: ${order.orderStatus})`,
      });
    }

    // Create the shipment record (calls shipment wrapper architecture)
    const shipment = await createShipment(order);

    // Move order status to SHIPPED
    const updated = await orderService.updateOrderStatus(req.params.id, "SHIPPED");

    return res.status(200).json({
      success: true,
      message: "Order dispatched and shipment created",
      data: { order: updated, shipment },
    });
  } catch (error) {
    const hasDuplicateMessage =
      typeof error.message === "string" &&
      error.message.includes("already exists");
    const status =
      error.httpStatus ||
      (error.name === "ShipmentDuplicateError" || hasDuplicateMessage
        ? 409
        : 500);

    return res.status(status).json({
      success: false,
      message: error.message || "Failed to dispatch order",
      data: null,
      error: error.code || error.message,
    });
  }
};
