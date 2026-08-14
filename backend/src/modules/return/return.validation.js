import Joi from "joi";

export const requestReturnSchema = Joi.object({
    orderId: Joi.string().required(),
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().required(),
                quantity: Joi.number().integer().min(1).required(),
                // Optional now — the customer-facing flow contacts support
                // rather than collecting a written reason up front.
                reason: Joi.string().allow("").optional(),
            })
        )
        .min(1)
        .required(),
    comment: Joi.string().allow(""),
    // Customer's preferred pickup date; admin finalises it on approval.
    requestedPickupDate: Joi.date().optional(),
});

export const approveReturnSchema = Joi.object({
    adminComment: Joi.string().allow(""),
    pickupDate: Joi.date().required(),
});

export const rejectReturnSchema = Joi.object({
    adminComment: Joi.string().required(),
});