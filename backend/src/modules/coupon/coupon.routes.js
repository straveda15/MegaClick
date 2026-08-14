import express from "express";
import * as couponController from "./coupon.controller.js";
import { authenticateUser, requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Public — customer-facing: validate a coupon code at checkout
router.post("/validate", couponController.validateCoupon);

// Public — customer-facing: list active coupons for cart page display
router.get("/active", couponController.getActiveCoupons);

// Admin-only — manage coupons (auth required, admin role required).
// Everything declared after this router.use(...) inherits admin protection.
router.use(authenticateUser, requireAdmin);

router.get("/",       couponController.getCoupons);
router.post("/",      couponController.createCoupon);
router.patch("/:id",  couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);

export default router;
