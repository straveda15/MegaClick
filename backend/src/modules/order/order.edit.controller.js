import { editOrder, getEditability, canUserEditOrder } from "./order.edit.service.js";
import Order from "./order.model.js";

// GET /api/v1/orders/:id/edit-status
// Returns whether the order can be edited and any warnings, without requiring auth beyond the base check.
export const getOrderEditStatus = async (req, res) => {
  try {
    if (!canUserEditOrder(req.user)) {
      return res.status(403).json({ success: false, message: "You do not have permission to edit orders." });
    }

    const order = await Order.findById(req.params.id).select(
      "orderStatus packagingStatus dispatchStatus trackingNumber"
    );
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const result = getEditability(order);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/v1/orders/:id/edit
export const editOrderById = async (req, res) => {
  try {
    if (!canUserEditOrder(req.user)) {
      return res.status(403).json({ success: false, message: "You do not have permission to edit orders." });
    }

    const { items, shippingAddress, notes, pricing } = req.body;

    if (!items && !shippingAddress && notes === undefined && !pricing) {
      return res.status(400).json({ success: false, message: "No changes provided." });
    }

    const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ?? req.socket?.remoteAddress;

    const updated = await editOrder(
      req.params.id,
      { items, shippingAddress, notes, pricing },
      req.user._id,
      ipAddress
    );

    return res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      data: updated,
    });
  } catch (err) {
    const status = err.message.includes("not found") ? 404
      : err.message.includes("cannot be edited") || err.message.includes("dispatched") ? 409
      : err.message.includes("Insufficient") ? 422
      : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};
