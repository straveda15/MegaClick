import Joi from "joi";

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({ "string.pattern.base": "Must be a valid MongoDB ObjectId" });

const conditionsSchema = Joi.object({
  pincodes:       Joi.array().items(Joi.string()).default([]),
  originPincodes: Joi.array().items(Joi.string()).default([]),
  minWeight:      Joi.number().min(0).default(0),
  maxWeight:      Joi.number().min(0).default(null),
  paymentModes:   Joi.array().items(Joi.string().valid("COD", "PREPAID")).default([]),
  states:         Joi.array().items(Joi.string()).default([]),
  minValue:       Joi.number().min(0).default(0),
  maxValue:       Joi.number().min(0).default(null),
});

export const createRuleSchema = Joi.object({
  providerId:  objectId.required(),
  ruleName:    Joi.string().trim().min(2).max(200).required(),
  conditions:  conditionsSchema.default({}),
  priority:    Joi.number().integer().min(1).max(99).default(10),
  isActive:    Joi.boolean().default(true),
});

export const updateRuleSchema = Joi.object({
  providerId:  objectId,
  ruleName:    Joi.string().trim().min(2).max(200),
  conditions:  conditionsSchema,
  priority:    Joi.number().integer().min(1).max(99),
  isActive:    Joi.boolean(),
}).min(1);
