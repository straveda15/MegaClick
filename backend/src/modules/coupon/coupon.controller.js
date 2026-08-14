import * as couponService from "./coupon.service.js";

export const getCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Friendly translator for Mongo's E11000 duplicate-key error (race-condition safety net
// for when the service-level pre-check is bypassed by simultaneous requests).
const handleDuplicateKey = (error, res) => {
  if (error.code === 11000) {
    const dupCode = error.keyValue?.code || "this code";
    return res.status(409).json({
      message: `A coupon with code "${dupCode}" already exists. Please choose a different code.`,
    });
  }
  return null;
};

export const createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    if (handleDuplicateKey(error, res)) return;
    const status = error.statusCode || 400;
    res.status(status).json({ message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    if (handleDuplicateKey(error, res)) return;
    const status = error.statusCode || 400;
    res.status(status).json({ message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await couponService.deleteCoupon(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getActiveCoupons();
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  const { code, subtotal } = req.body;
  try {
    const coupon = await couponService.validateCoupon(code, subtotal);
    res.json({
      valid: true,
      discountPercentage: coupon.discountPercentage,
      code: coupon.code,
      minOrderValue: coupon.minOrderValue || 0,
      message: "Coupon applied successfully!"
    });
  } catch (error) {
    res.status(400).json({ valid: false, message: error.message });
  }
};
