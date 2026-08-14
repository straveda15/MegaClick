import catchAsync from "../../shared/utils/catchAsync.js";
import AppError from "../../shared/utils/appError.js";
import * as checkoutService from "./checkout.service.js";
import { createOrderSchema } from "../order/order.validation.js";

/* ── POST /api/v1/checkout/initiate ──────────────────────────────────────────
 * Replaces the old "create the order, THEN send them to PayU" flow. Returns the
 * PayU params for a draft checkout; no Order is created until payment succeeds.
 */
export const initiateCheckout = catchAsync(async (req, res, next) => {
  const { firstname, email, phone, ...orderPayload } = req.body;

  if (!firstname || !email || !phone) {
    return next(new AppError("firstname, email, and phone are required", 400));
  }

  // Same validation the COD order path runs.
  const { error, value } = createOrderSchema.validate(orderPayload);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const params = await checkoutService.initiateCheckout(req.user._id, value, {
    firstname,
    email,
    phone,
  });

  res.status(200).json({ success: true, data: params });
});
