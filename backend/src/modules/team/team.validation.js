import Joi from "joi";

export const createEmployeeSchema = Joi.object({
  userId: Joi.string().required(),
  designation: Joi.string().required(),
  department: Joi.string().required(),
  managerId: Joi.string().allow(null, ""),
  employmentType: Joi.string().valid("full-time", "contract").default("full-time"),
  joiningDate: Joi.date().required(),
});

export const updateEmployeeSchema = Joi.object({
  designation: Joi.string(),
  department: Joi.string(),
  managerId: Joi.string().allow(null, ""),
  joiningDate: Joi.date().required(),
  status: Joi.string().valid("active", "inactive"),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid("active", "inactive").required(),
});
