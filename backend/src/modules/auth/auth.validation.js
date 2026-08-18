import Joi from "joi";

export const employeeLoginSchema = Joi.object({
  phone: Joi.string()
    .optional()
    .messages({
      "string.empty": "Phone number is required.",
    }),
  email: Joi.string().email().optional(),
  // The login form no longer asks for a country — every phone login is
  // assumed Indian unless a caller explicitly says otherwise.
  countryCode: Joi.string().optional().default("IN"),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
}).or("phone", "email").messages({"string.empty": "Either phone number or email is required."});
