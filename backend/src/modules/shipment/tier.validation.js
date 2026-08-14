import Joi from "joi";

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({ "string.pattern.base": "Must be a valid MongoDB ObjectId" });

export const createTierSchema = Joi.object({
  city: Joi.string().trim().min(2).max(100).required(),
  tier: Joi.number().valid(1, 2, 3).required(),
  defaultProvider: objectId.required(),
  /**
   * Optional: manually supply pincode prefixes when city is not in the
   * known CITY_PINCODE_PREFIXES map (e.g. a newly created suburb/district).
   */
  pincodes: Joi.array().items(Joi.string().pattern(/^\d{2,6}$/)).default([]),
});

export const updateTierSchema = Joi.object({
  // City is immutable on update (the service keeps the existing city); it is
  // accepted here only so the client can send the full form without a 400.
  city: Joi.string().trim().min(2).max(100),
  tier: Joi.number().valid(1, 2, 3),
  defaultProvider: objectId,
  pincodes: Joi.array().items(Joi.string().pattern(/^\d{2,6}$/)),
}).min(1);

export const citySearchSchema = Joi.object({
  q: Joi.string().trim().min(1).max(100).required(),
});
