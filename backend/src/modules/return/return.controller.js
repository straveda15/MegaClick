import * as returnService from "./return.service.js";
import {
    requestReturnSchema,
    approveReturnSchema,
    rejectReturnSchema,
} from "./return.validation.js";

export const requestReturn = async (req, res) => {
    try {
        const { error, value } = requestReturnSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const returnDoc = await returnService.requestReturn(req.user, value);

        return res.status(201).json({
            success: true,
            message: "Return request submitted successfully",
            data: returnDoc,
        });
    } catch (error) {
        console.error("Return Request Error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const approveReturn = async (req, res) => {
    try {
        console.log("Approve request body:", req.body);
        const { error, value } = approveReturnSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const returnDoc = await returnService.approveReturn(req.params.id, value.adminComment, value.pickupDate);

        return res.status(200).json({
            success: true,
            message: "Return approved successfully",
            data: returnDoc,
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const rejectReturn = async (req, res) => {
    try {
        const { error, value } = rejectReturnSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const returnDoc = await returnService.rejectReturn(req.params.id, value.adminComment);

        return res.status(200).json({
            success: true,
            message: "Return rejected successfully",
            data: returnDoc,
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const getAllReturns = async (req, res) => {
    try {
        const returns = await returnService.getReturns(req.query);
        return res.status(200).json({
            success: true,
            message: "Returns fetched successfully",
            data: returns,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const getMyReturns = async (req, res) => {
    try {
        const userId = req.user._id;
        const returns = await returnService.getUserReturns(userId);
        return res.status(200).json({
            success: true,
            message: "Your returns fetched successfully",
            data: returns,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const getReturnById = async (req, res) => {
    try {
        const returnDoc = await returnService.getReturnById(req.params.id);

        // Security check for non-admin users
        if (req.user.role === "user" && returnDoc.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this return record",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Return details fetched successfully",
            data: returnDoc,
        });
    } catch (error) {
        return res.status(error.statusCode || 404).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const markAsRefunded = async (req, res) => {
    try {
        const { pickupDate } = req.body;
        const returnDoc = await returnService.markAsRefunded(req.params.id, pickupDate);
        return res.status(200).json({
            success: true,
            message: "Return marked as refunded",
            data: returnDoc,
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

export const markAsPickedUp = async (req, res) => {
    try {
        const returnDoc = await returnService.markAsPickedUp(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Return marked as picked up",
            data: returnDoc,
        });
    } catch (error) {
        return res.status(error.statusCode || 400).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};