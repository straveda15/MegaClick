import * as salesOrderService from "../services/salesOrder.service.js";

export const getMyAssignedOrders = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const filters = req.query; // basic filter logic can be passed

        const orders = await salesOrderService.getAssignedOrders(userId, filters);

        res.status(200).json({
            success: true,
            message: "Assigned orders retrieved successfully",
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

export const confirmOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const actorId = req.user._id;

        const confirmedOrder = await salesOrderService.confirmSalesOrder(orderId, actorId);

        res.status(200).json({
            success: true,
            message: "Order confirmed successfully",
            data: confirmedOrder
        });
    } catch (error) {
        next(error);
    }
};

export const createOrder = async (req, res, next) => {
    try {
        const actorId = req.user._id;
        const data = req.body;

        const order = await salesOrderService.createManualOrder(actorId, data);

        res.status(201).json({
            success: true,
            message: "Manual order created successfully",
            data: order
        });
    } catch (error) {
        next(error);
    }
};
export const getOrderByNumber = async (req, res, next) => {
    try {
        const { orderNumber } = req.params;
        const result = await salesOrderService.getOrderByNumber(orderNumber);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};
