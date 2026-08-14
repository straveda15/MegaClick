import Joi from "joi";

/**
 * Validates the body sent by the website contact form.
 * The frontend prepends +91 to the 10-digit number before submitting,
 * so the backend receives phone in the format +91XXXXXXXXXX.
 */
export const contactUsSchema = Joi.object({
  name:    Joi.string().trim().min(2).max(100).required()
             .messages({ "string.min": "Name must be at least 2 characters." }),
  email:   Joi.string().trim().email({ tlds: { allow: false } }).lowercase().required()
             .messages({ "string.email": "A valid email address is required." }),
  phone:   Joi.string().trim().pattern(/^\+91\d{10}$/).required()
             .messages({ "string.pattern.base": "Phone must be a valid Indian mobile number (+91 followed by 10 digits)." }),
  message: Joi.string().trim().max(2000).optional().allow(""),
});

export const orderCSVSchema = Joi.object({
    customerName: Joi.string().required(),
    customerEmail: Joi.string().email().optional().allow(''),
    customerPhone: Joi.string().required(), // Simple string, can add regex
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required(),
    productId: Joi.string().required(), // expecting objectId string
    productName: Joi.string().required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(1).required()
});

export const leadCSVSchema = Joi.object({
    // Phone is the only hard requirement — it is the key we de-dupe/upsert on.
    // Everything else is optional so partial files (e.g. only phone + product)
    // are accepted and the blanks are filled in later from the telephony UI.
    customerPhone: Joi.string().trim().pattern(/\d/).required().messages({
        "string.pattern.base": "customerPhone must contain a phone number",
        "any.required": "customerPhone (mobile number) is required",
    }),
    customerName: Joi.string().trim().optional().allow(''),
    customerEmail: Joi.string().email().optional().allow(''),
    productInterest: Joi.string().trim().optional().allow(''),
    estimatedValue: Joi.number().min(0).optional().allow('', null).default(0)
});

/**
 * Header alias maps: { canonicalField: [accepted header variants...] }.
 * Matching is case/space/punctuation-insensitive (see fileParser normalizeHeader),
 * so "MOBILE NO.", "Mobile Number", "phone no" all resolve to customerPhone.
 */
export const leadHeaderAliases = {
    customerName: ["name", "customer name", "customer", "full name", "client name", "lead name"],
    customerPhone: ["mobile", "mobile no", "mobile number", "phone", "phone no", "phone number", "contact", "contact no", "contact number", "number"],
    customerEmail: ["email", "email id", "e-mail", "mail"],
    productInterest: ["product", "product name", "product interest", "interested product", "item", "products"],
    estimatedValue: ["value", "estimated value", "amount", "deal value", "order value"],
};

export const returnCSVSchema = Joi.object({
    orderNumber: Joi.string().required(),
    returnId: Joi.string().required() // expecting existing Return doc _id string
});

export const scrapedDataCSVSchema = Joi.object({
    customerName: Joi.string().required(),
    customerPhone: Joi.string().required(),
    customerEmail: Joi.string().email().optional().allow(''),
    scrapedFrom: Joi.string().required(),
    productInterest: Joi.string().optional().allow(''),
    notes: Joi.string().optional().allow('')
});
