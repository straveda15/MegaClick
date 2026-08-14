import Joi from "joi";

export const createOrderSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().required(),
                productName: Joi.string().required(),
                priceAtPurchase: Joi.number().min(0).required(),
                quantity: Joi.number().min(1).required(),
                weight: Joi.number().min(0).optional(),
                variant: Joi.object({
                    name: Joi.string(),
                    value: Joi.string(),
                }).optional(),
            })
        )
        .min(1)
        .required(),

    shippingAddress: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string().required(),
        addressLine1: Joi.string().required(),
        addressLine2: Joi.string().allow("", null),
        city: Joi.string().required(),
        state: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().default("India"),
    }).required(),

    pricing: Joi.object({
        subtotal: Joi.number().min(0).required(),
        discountAmount: Joi.number().min(0).default(0),
        couponCode: Joi.string().allow("", null),
        deliveryCharge: Joi.number().min(0).default(0),
        finalAmount: Joi.number().min(0).required(),
    }).required(),

    paymentMethod: Joi.string().valid("card", "upi", "netbanking", "cod", "partial_cod").default("card"),
    notes: Joi.string().allow("", null),
    source: Joi.string().valid("web", "app", "admin", "instagram", "facebook", "google", "direct").default("web"),
});

export const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid(
            "CREATED",
            "PENDING_PAYMENT",
            "PAID",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
            "FAILED",
            "REFUNDED"
        )
        .required(),
});

export const verifyPaymentSchema = Joi.object({
    paymentOrderId: Joi.string().required(),
    paymentId: Joi.string().required(),
    signature: Joi.string().required(),
});
