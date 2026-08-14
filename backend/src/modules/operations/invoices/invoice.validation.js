import Joi from "joi";

export const createInvoiceSchema = Joi.object({
  invoiceNumber: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      materialId: Joi.string().required(),
      name: Joi.string().required(),
      qty: Joi.number().min(0.01).required(),
      rate: Joi.number().min(0).required(),
    })
  ).min(1).required(),
  invoiceDate: Joi.date().iso().required(),
  dueDate: Joi.date().iso().required(),
});

export const payInvoiceSchema = Joi.object({
  amount: Joi.number().positive().required(),
  paymentReference: Joi.string().allow("", null),
  note: Joi.string().allow("", null),
});
