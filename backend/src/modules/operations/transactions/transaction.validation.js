import Joi from "joi";

export const createTransactionSchema = Joi.object({
  vendorId: Joi.string().required(),
  type: Joi.string().valid("credit", "debit").required(),
  amount: Joi.number().positive().required(),
  referenceType: Joi.string().valid("invoice", "payment", "adjustment").required(),
  referenceId: Joi.string().allow("", null),
  note: Joi.string().allow("", null),
});
