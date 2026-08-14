import * as vendorOrderService from "./vendorOrder.service.js";

export const createVendorOrder = async (req, res) => {
  try {
    const data = req.body;
    if (!data.vendorId || !data.itemsOrdered || data.itemsOrdered.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const order = await vendorOrderService.createVendorOrder(data, req.user?._id);
    return res.status(201).json({ success: true, message: "Vendor order placed successfully", data: order });
  } catch (error) {
    return res.status(error.statusCode || error.httpStatus || 500).json({ success: false, message: error.message });
  }
};

export const getVendorOrders = async (req, res) => {
  try {
    const orders = await vendorOrderService.getAllVendorOrders(req.query);
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const receiveVendorOrder = async (req, res) => {
  try {
    const order = await vendorOrderService.receiveVendorOrder(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Order marked as received and stock updated",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
