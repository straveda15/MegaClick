import Joi from "joi";

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({ "string.pattern.base": "Must be a valid MongoDB ObjectId" });

export const createShipmentSchema = Joi.object({
  orderId: objectId.required(),
});

export const assignCourierSchema = Joi.object({
  orderId: objectId.required(),
  courierId: Joi.string().allow(null, ""),
  autoAssign: Joi.boolean().default(true)
});

export const schedulePickupSchema = Joi.object({
  orderId: objectId.required(),
  pickupDate: Joi.string().isoDate().required(),
  pickupTime: Joi.string().allow(null, ""),
  warehouseAddress: Joi.object().optional() // Details depend on provider
});

export const cancelShipmentSchema = Joi.object({
  orderId: objectId.required(),
  reason: Joi.string().max(200).default("Cancelled by admin")
});

export const calculateRatesSchema = Joi.object({
  providerName: Joi.string().optional(),
  originPincode: Joi.string().required(),
  destinationPincode: Joi.string().required(),
  weight: Joi.number().min(0).required(),
  length: Joi.number().min(0).default(0),
  breadth: Joi.number().min(0).default(0),
  height: Joi.number().min(0).default(0),
  paymentMode: Joi.string().valid("PREPAID", "COD").default("PREPAID"),
  declaredValue: Joi.number().min(0).default(0),
  isExpress: Joi.boolean().default(false)
});

export const serviceabilitySchema = Joi.object({
  originPincode: Joi.string().required(),
  destinationPincode: Joi.string().required(),
  paymentMode: Joi.string().valid("PREPAID", "COD").default("PREPAID"),
  weight: Joi.number().optional()
});

/* Provider DB Schemas */
export const providerDBSchema = Joi.object({
    name: Joi.string().required(),
    displayName: Joi.string().required(),
    isActive: Joi.boolean().default(true),
    priority: Joi.number().default(10),
    isFallback: Joi.boolean().default(false),
    fallbackPriority: Joi.number().default(100),
    config: Joi.object().default({}),
    supportedMethods: Joi.array().items(Joi.string().valid("COD", "PREPAID")).default(["COD", "PREPAID"])
});

export const updateProviderSchema = Joi.object({
    displayName: Joi.string(),
    isActive: Joi.boolean(),
    priority: Joi.number(),
    isFallback: Joi.boolean(),
    fallbackPriority: Joi.number(),
    config: Joi.object(),
    supportedMethods: Joi.array().items(Joi.string().valid("COD", "PREPAID"))
});

/* Provider Priority Manager Schemas */
export const reorderProvidersSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                id: objectId.required(),
                priority: Joi.number().integer().min(1).required(),
            })
        )
        .min(1)
        .required(),
});

export const fallbackToggleSchema = Joi.object({
    isFallback: Joi.boolean().required(),
    fallbackPriority: Joi.number().integer().min(1).optional(),
});
