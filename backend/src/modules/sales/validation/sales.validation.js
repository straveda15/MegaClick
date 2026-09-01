import Joi from "joi";

/**
 * Accepts an Indian mobile in whatever shape a visitor types it — "9876543210",
 * "+91 98765 43210", "098765-43210" — and normalizes to +91XXXXXXXXXX so every
 * stored customer has the same phone format (it is the de-dupe key).
 */
const normalizeIndianPhone = (value, helpers) => {
  const digits = String(value).replace(/\D/g, "");

  const local =
    digits.length === 12 && digits.startsWith("91") ? digits.slice(2) :
    digits.length === 11 && digits.startsWith("0")  ? digits.slice(1) :
    digits;

  if (!/^[6-9]\d{9}$/.test(local)) return helpers.error("string.pattern.base");
  return `+91${local}`;
};

/**
 * Validates the body sent by the website contact form. Phone is normalized to
 * +91XXXXXXXXXX here, so the form may submit it in any common format.
 */
export const contactUsSchema = Joi.object({
  name:    Joi.string().trim().min(2).max(100).required()
             .messages({ "string.min": "Name must be at least 2 characters." }),
  // Optional — the form labels this field "Email Address (Optional)".
  email:   Joi.string().trim().email({ tlds: { allow: false } }).lowercase().optional().allow("")
             .messages({ "string.email": "A valid email address is required." }),
  phone:   Joi.string().trim().custom(normalizeIndianPhone).required()
             .messages({ "string.pattern.base": "Enter a valid 10-digit Indian mobile number." }),
  message: Joi.string().trim().max(2000).optional().allow(""),
  // The service picked in the form's dropdown, carried through to the lead so
  // the Leads board shows what the visitor actually asked about.
  service:         Joi.string().trim().max(200).optional().allow(""),
  serviceSlug:     Joi.string().trim().max(200).optional().allow(""),
  serviceCategory: Joi.string().trim().max(200).optional().allow(""),
  // A visitor can ask about several services at once. The flat fields above
  // stay for older clients and mirror the first entry.
  services: Joi.array()
    .items(
      Joi.object({
        title:        Joi.string().trim().max(200).required(),
        slug:         Joi.string().trim().max(200).optional().allow(""),
        category:     Joi.string().trim().max(200).optional().allow(""),
        categorySlug: Joi.string().trim().max(200).optional().allow(""),
      })
    )
    .max(20)
    .optional(),
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
