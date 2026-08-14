import Coupon from "./coupon.model.js";

/**
 * Get all coupons (Admin only)
 */
export const getAllCoupons = async () => {
  return await Coupon.find().sort({ createdAt: -1 });
};

/**
 * Numeric-field guards shared by create + update.
 * Throws a friendly error with statusCode 400 on bad inputs.
 */
const validateNumericFields = (data) => {
  if (data.discountPercentage != null) {
    const d = Number(data.discountPercentage);
    if (!Number.isFinite(d) || d <= 0 || d > 100) {
      const err = new Error("Discount % must be between 1 and 100.");
      err.statusCode = 400;
      throw err;
    }
    data.discountPercentage = d;
  }
  if (data.minOrderValue != null) {
    const m = Number(data.minOrderValue);
    if (!Number.isFinite(m) || m < 0) {
      const err = new Error("Min Order Value cannot be negative.");
      err.statusCode = 400;
      throw err;
    }
    data.minOrderValue = m;
  }
  if (data.maxUses != null && data.maxUses !== "") {
    const n = Number(data.maxUses);
    if (!Number.isInteger(n) || n < 1) {
      const err = new Error("Max Uses must be a positive whole number (or leave blank for unlimited).");
      err.statusCode = 400;
      throw err;
    }
    data.maxUses = n;
  } else {
    data.maxUses = null;   // empty string / undefined → unlimited
  }
};

/**
 * Create a new coupon.
 * Pre-checks for duplicate code so users see a friendly error instead of Mongo's E11000.
 */
export const createCoupon = async (couponData) => {
  // Normalize code so case/whitespace differences ("SAVE10" vs " save10 ") collide correctly.
  const normalizedCode = (couponData.code || "").trim().toUpperCase();
  if (!normalizedCode) {
    const err = new Error("Coupon code is required.");
    err.statusCode = 400;
    throw err;
  }

  validateNumericFields(couponData);

  const existing = await Coupon.findOne({ code: normalizedCode });
  if (existing) {
    const err = new Error(`A coupon with code "${normalizedCode}" already exists. Please choose a different code.`);
    err.statusCode = 409;   // HTTP 409 Conflict
    throw err;
  }

  const coupon = new Coupon({ ...couponData, code: normalizedCode });
  return await coupon.save();
};

/**
 * Update a coupon.
 * If the code is being changed, pre-check that no OTHER coupon already uses it.
 */
export const updateCoupon = async (id, updateData) => {
  if (updateData.code) {
    const normalizedCode = updateData.code.trim().toUpperCase();
    if (!normalizedCode) {
      const err = new Error("Coupon code cannot be empty.");
      err.statusCode = 400;
      throw err;
    }
    const existing = await Coupon.findOne({ code: normalizedCode, _id: { $ne: id } });
    if (existing) {
      const err = new Error(`A coupon with code "${normalizedCode}" already exists. Please choose a different code.`);
      err.statusCode = 409;
      throw err;
    }
    updateData.code = normalizedCode;
  }
  validateNumericFields(updateData);
  return await Coupon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

/**
 * Delete a coupon
 */
export const deleteCoupon = async (id) => {
  return await Coupon.findByIdAndDelete(id);
};

/**
 * Public — active, currently-usable coupons for storefront display (cart page
 * ticket list). Only exposes customer-facing fields, no admin/internal data.
 */
export const getActiveCoupons = async () => {
  const now = new Date();
  const coupons = await Coupon.find({
    isActive: true,
    validUntil: { $gte: now },
    $or: [{ maxUses: null }, { $expr: { $lt: ["$usedCount", "$maxUses"] } }],
  })
    .select("code discountPercentage minOrderValue description validUntil")
    .sort({ createdAt: -1 });

  return coupons;
};

/**
 * Validate a coupon code
 */
export const validateCoupon = async (code, orderSubtotal) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) {
    throw new Error("Invalid or inactive coupon code.");
  }

  // Check validity date
  const now = new Date();
  if (coupon.validUntil < now) {
    throw new Error("Coupon has expired.");
  }

  // Check min order value
  if (orderSubtotal < coupon.minOrderValue) {
    throw new Error(`Minimum order value of ₹${coupon.minOrderValue} required for this coupon.`);
  }

  // Check max uses
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    throw new Error("Coupon usage limit reached.");
  }

  return coupon;
};

/**
 * Increment usage count
 */
export const incrementUsedCount = async (code) => {
  return await Coupon.findOneAndUpdate(
    { code: code.toUpperCase() },
    { $inc: { usedCount: 1 } },
    { new: true }
  );
};
