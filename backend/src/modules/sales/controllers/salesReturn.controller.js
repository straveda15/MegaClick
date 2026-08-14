import * as salesReturnService from "../services/salesReturn.service.js";

export const getMyReturns = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const filters = req.query;
        const returns = await salesReturnService.getAssignedReturns(userId, filters);

        res.status(200).json({
            success: true,
            message: "Sales returns retrieved successfully",
            data: returns
        });
    } catch (error) {
        next(error);
    }
};

export const createReturn = async (req, res, next) => {
    try {
        const actorId = req.user._id;
        const data = req.body;

        const result = await salesReturnService.createManualReturn(actorId, data);

        res.status(201).json({
            success: true,
            message: "Return registered successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};


export const verifyReturn = async (req, res, next) => {
    try {
        const returnId = req.params.id;
        const actorId = req.user._id;

        const result = await salesReturnService.verifyReturn(returnId, actorId);

        res.status(200).json({
            success: true,
            message: "Return verified",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const approveReturn = async (req, res, next) => {
    try {
        const returnId = req.params.id;
        const actorId = req.user._id;
        const { comment } = req.body;

        const result = await salesReturnService.approveSalesReturn(returnId, actorId, comment);

        res.status(200).json({
            success: true,
            message: "Return approved",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const initiatePickup = async (req, res, next) => {
    try {
        const returnId = req.params.id;
        const actorId = req.user._id;

        const result = await salesReturnService.initiatePickup(returnId, actorId);

        res.status(200).json({
            success: true,
            message: "Pickup initiated",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const completeReturn = async (req, res, next) => {
    try {
        const returnId = req.params.id;
        const actorId = req.user._id;

        const result = await salesReturnService.completeReturn(returnId, actorId);

        res.status(200).json({
            success: true,
            message: "Return marked as completed",
            data: result
        });
    } catch (error) {
        next(error);
    }
};
