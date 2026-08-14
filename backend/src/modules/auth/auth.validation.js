import Joi from "joi";

export const employeeLoginSchema = Joi.object({
  phone: Joi.string()
    .optional()
    .messages({
      "string.empty": "Phone number is required.",
    }),
  email: Joi.string().email().optional(),
  countryCode: Joi.string().optional().messages({
    "string.empty": "Country code is required.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
}).or("phone", "email").messages({"string.empty": "Either phone number or email is required."});
