import Joi from "joi";
import { BATCH_STAGES } from "./batch.model.js";

export const createBatchSchema = Joi.object({
  productId: Joi.string().required(),
  productName: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  orderId: Joi.string().optional(),
  assignedEmployees: Joi.array().items(Joi.string()).optional(),
  dueDate: Joi.date().iso().required(),
  notes: Joi.string().allow("", null).optional(),
  rawMaterialVendorId: Joi.string().allow("", null).optional(),
});

export const updateBatchSchema = Joi.object({
  quantity: Joi.number().min(1).optional(),
  assignedEmployees: Joi.array().items(Joi.string()).optional(),
  dueDate: Joi.date().iso().optional(),
  notes: Joi.string().allow("", null).optional(),
});

export const qcSchema = Joi.object({
  outcome: Joi.string().valid("pass", "fail").required(),
  notes: Joi.string().allow("", null).optional(),
});

export const assignShipmentSchema = Joi.object({
  trackingId: Joi.string().required(),
  awbNumber: Joi.string().allow("", null).optional(),
  providerId: Joi.string().optional(),
  providerName: Joi.string().required(),
  estimatedDelivery: Joi.date().iso().optional(),
});
