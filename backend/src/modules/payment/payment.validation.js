import Joi from "joi";

export const initiatePaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  firstname: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

export const gokwikCreateOrderSchema = Joi.object({
  orderId: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().allow("", null),
  name: Joi.string().allow("", null),
  address: Joi.object({
    line1: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required(),
  }).required(),
});

export const initiateRefundSchema = Joi.object({
  amount: Joi.number().positive().required(),
  reason: Joi.string().allow("", null),
});
