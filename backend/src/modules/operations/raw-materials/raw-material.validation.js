import Joi from "joi";

export const createRawMaterialSchema = Joi.object({
  name: Joi.string().required(),
  unit: Joi.string().required(),
  stock: Joi.number().min(0).default(0),
  reorderLevel: Joi.number().min(0).default(10),
  costPerUnit: Joi.number().min(0).required(),
  vendorId: Joi.string().allow("", null),
});

export const updateRawMaterialSchema = Joi.object({
  name: Joi.string().optional(),
  unit: Joi.string().optional(),
  reorderLevel: Joi.number().min(0).optional(),
  costPerUnit: Joi.number().min(0).optional(),
  vendorId: Joi.string().allow("", null).optional(),
});

export const consumeReceiveRawMaterialSchema = Joi.object({
  quantity: Joi.number().positive().required(),
});
