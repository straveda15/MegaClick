import Joi from "joi";

export const applyLeaveSchema = Joi.object({
  userId: Joi.string().required(),
  leaveType: Joi.string().valid("sick", "casual", "earned", "maternity", "paternity", "other").required(),
  fromDate: Joi.date().min(new Date().setHours(0, 0, 0, 0)).required()
    .messages({ "date.min": "Cannot apply leave for past dates" }),
  toDate: Joi.date().min(Joi.ref("fromDate")).required(),
  reason: Joi.string().required(),
  // A half day covers one date only, so the session is required with it and
  // meaningless without it.
  isHalfDay: Joi.boolean().default(false),
  halfDaySession: Joi.string().valid("first_half", "second_half")
    .when("isHalfDay", { is: true, then: Joi.required(), otherwise: Joi.optional().strip() })
    .messages({ "any.required": "Pick which half of the day the leave covers." }),
});

export const updateLeaveStatusSchema = Joi.object({
  status: Joi.string().valid("approved", "rejected").required(),
  approvedBy: Joi.string(), // ID of the manager/HR
  rejectionReason: Joi.string(),
});
