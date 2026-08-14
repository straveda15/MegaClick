import Joi from "joi";

export const createInventorySchema = Joi.object({
  productId: Joi.string().required(),
  sku: Joi.string().allow("", null),
  variant: Joi.string().allow("", null),
  warehouse: Joi.string().allow("", null),
  available: Joi.number().min(0).default(0),
  reserved: Joi.number().min(0).default(0),
  reorderLevel: Joi.number().min(0).default(10),
});

export const updateInventorySchema = Joi.object({
  sku: Joi.string().allow("", null).optional(),
  variant: Joi.string().allow("", null).optional(),
  warehouse: Joi.string().allow("", null).optional(),
  reorderLevel: Joi.number().min(0).optional(),
});

export const adjustInventorySchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().required(),
  type: Joi.string().valid("available", "reserved").default("available"),
});
