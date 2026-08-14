import * as refundService from "./refund.service.js";

export const initiateRefund = async (req, res) => {
    try {
        const { orderId, amount, reason, returnId } = req.body;
        const userId = req.user._id;

        if (!orderId || !amount || !reason) {
            return res.status(400).json({
                success: false,
                message: "orderId, amount, and reason are required.",
            });
        }

        const refund = await refundService.initiateRefund({
            orderId,
            amount,
            reason,
            returnId,
            userId
        });

        return res.status(201).json({
            success: true,
            message: "Refund processed successfully.",
            data: refund,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
};

export const processRefund = async (req, res) => {
    try {
        const refund = await refundService.processRefund(req.params.id);
        return res.status(200).json({
            success: true,
            message: refund.status === "SUCCESS"
                ? "Refund processed successfully."
                : "Refund processing failed — check gateway metadata.",
            data: refund,
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
};

export const getRefunds = async (req, res) => {
    try {
        const refunds = await refundService.getAllRefunds();
        return res.status(200).json({
            success: true,
            data: refunds,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
};

export const getUserRefunds = async (req, res) => {
    try {
        const userId = req.user._id;
        const refunds = await refundService.getUserRefunds(userId);
        return res.status(200).json({
            success: true,
            data: refunds,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
};

export const getRefundById = async (req, res) => {
    try {
        const refund = await refundService.getRefundById(req.params.id);
        if (!refund) {
            return res.status(404).json({
                success: false,
                message: "Refund not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: refund,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error.",
        });
    }
};
