import catchAsync from "../../shared/utils/catchAsync.js";
import AppError from "../../shared/utils/appError.js";
import * as paymentService from "./payment.service.js";
import {
  gokwikCreateOrderSchema,
  initiateRefundSchema,
} from "./payment.validation.js";
import Order from "../order/order.model.js";
import { confirmOrder, createOrderFromCheckout } from "../order/order.service.js";
import * as checkoutService from "../checkout/checkout.service.js";

/* ── PayU: Initiate Payment ──────────────────────────────────────────────────
 * REMOVED — superseded by POST /api/v1/checkout/initiate.
 *
 * This used to look up an already-created Order to get the payable amount. That
 * order no longer exists at this point in the flow: nothing is written to the
 * orders collection until PayU confirms the payment. See checkout.service.js.
 */

/* ── PayU: Success Callback ──────────────────────────────────────────────── */

// The order is CREATED here, not updated — nothing exists in the orders
// collection until PayU has confirmed the payment and we've verified the hash.
// udf1 carries a PendingCheckout draft id, not an orderId.
export const handlePayUSuccess = catchAsync(async (req, res, next) => {
  const result = await paymentService.verifyPayUPayment(req.body);
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const cartUrl = `${frontendUrl}/cart`;

  if (!result.success) {
    console.warn(`[PayU] Success callback failed verification (${result.reason}) txnid=${result.txnid}`);
    return res.redirect(cartUrl);
  }

  const draftId = req.body.udf1;
  if (!draftId) {
    console.error("[PayU] Success callback missing udf1 (checkout draft id). txnid:", result.txnid);
    return res.redirect(cartUrl);
  }

  // ── Idempotency guard ────────────────────────────────────────────────────
  // PayU retries callbacks (network blip / browser back). We can no longer guard
  // on an order's status, because no order exists until this handler runs — so
  // the txnid is the identity. Without this, every retry mints a duplicate order.
  const alreadyPlaced = await Order.findOne({ "payment.payu_txnid": result.txnid })
    .select("_id")
    .lean();

  if (alreadyPlaced) {
    console.log(`[PayU] Duplicate callback ignored — txnid ${result.txnid} already produced order ${alreadyPlaced._id}`);
    return res.redirect(
      `${frontendUrl}/order-success?txnid=${result.txnid}&mihpayid=${result.mihpayid}&status=success&orderId=${alreadyPlaced._id}`
    );
  }

  const draft = await checkoutService.findDraftById(draftId);
  if (!draft) {
    // Money was taken but the draft is gone (TTL-expired, or already consumed by
    // a racing callback that hadn't yet written the order). Needs manual
    // reconciliation — shout about it.
    console.error(
      `[PayU] PAYMENT TAKEN BUT NO DRAFT — cannot build order. draftId=${draftId} txnid=${result.txnid} mihpayid=${result.mihpayid} amount=${req.body.amount}`
    );
    return res.redirect(cartUrl);
  }

  // ── Create the real order ────────────────────────────────────────────────
  const order = await createOrderFromCheckout(draft, {
    txnid: result.txnid,
    mihpayid: result.mihpayid,
  });

  // ── Payment record (required for refund lookups) ─────────────────────────
  await paymentService.createPayUPaymentRecord({
    orderId: order._id,
    userId: draft.userId,
    txnid: result.txnid,
    mihpayid: result.mihpayid,
    amount: req.body.amount,
  }).catch((err) => {
    console.error(`[PayU] Failed to create Payment record for order ${order._id}:`, err.message);
  });

  // ── Confirm → stock reduction, coupon usage, packaging queue, notifications ─
  await confirmOrder(order._id).catch((err) => {
    console.error(`[PayU] confirmOrder failed for ${order._id}:`, err.message);
  });

  // The draft has served its purpose. (Safe if this fails — the TTL index reaps it.)
  await checkoutService.deleteDraft(draftId).catch((err) => {
    console.error(`[PayU] Failed to delete checkout draft ${draftId}:`, err.message);
  });

  res.redirect(
    `${frontendUrl}/order-success?txnid=${result.txnid}&mihpayid=${result.mihpayid}&status=success&orderId=${order._id}`
  );
});

/* ── PayU: Failure Callback ──────────────────────────────────────────────── */

// Nothing to clean up in the orders collection — a failed payment never had an
// order. Just bin the draft and send the customer back to their cart, which
// still has their items so they can retry.
//
// Note this handler is a nicety, not the safety net: when PayU rejects a request
// outright (bad hash) or the customer closes the tab, NO callback fires at all.
// That case is covered by the draft's TTL index, not by this code path.
export const handlePayUFailure = catchAsync(async (req, res, next) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const cartUrl = `${frontendUrl}/cart`;

  const result = await paymentService.verifyPayUFailure(req.body);

  // Never act on an unverified, unauthenticated POST.
  if (!result.valid) {
    console.warn(`[PayU] Ignoring unverified failure callback (${result.reason}) txnid=${result.txnid}`);
    return res.redirect(cartUrl);
  }

  const draftId = result.orderId; // udf1 carries the PendingCheckout id
  if (draftId) {
    await checkoutService.deleteDraft(draftId).catch((err) => {
      console.error(`[PayU] Failed to delete checkout draft ${draftId} after payment failure:`, err.message);
    });
  }

  res.redirect(cartUrl);
});

/* ── PayU: Optional client-side verify ──────────────────────────────────── */

export const verifyPayUPaymentHandler = catchAsync(async (req, res, next) => {
  const result = await paymentService.verifyPayUPayment(req.body);
  if (!result.success) return next(new AppError(result.reason || "Payment verification failed", 400));
  res.status(200).json({ success: true, message: "Payment verified", data: result });
});

/* ── GoKwik: Create Order ────────────────────────────────────────────────── */

export const gokwikCreateOrder = catchAsync(async (req, res, next) => {
  const { error, value } = gokwikCreateOrderSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const { orderId, phone, email, name, address } = value;
  const result = await paymentService.createGokwikOrder(orderId, req.user._id, {
    phone,
    email,
    name,
    address,
  });
  res.status(200).json({ success: true, message: "GoKwik order created.", data: result });
});

/* ── GoKwik: Webhook ─────────────────────────────────────────────────────── */

export const gokwikWebhook = catchAsync(async (req, res, next) => {
  const rawBody = req.rawBody;
  const signature = req.headers["x-gokwik-signature"];
  const timestamp = req.headers["x-gokwik-timestamp"];

  if (!rawBody) return next(new AppError("Missing request body.", 400));
  if (!signature) return next(new AppError("Missing x-gokwik-signature header.", 400));
  if (!timestamp) return next(new AppError("Missing x-gokwik-timestamp header.", 400));

  const result = await paymentService.handleGokwikWebhook(rawBody, signature, timestamp);
  res.status(200).json(result);
});

/* ── Payment Status ──────────────────────────────────────────────────────── */

export const getPaymentStatus = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentByOrderId(req.params.orderId);
  res.status(200).json({ success: true, data: payment });
});

/* ── Refund: Initiate ────────────────────────────────────────────────────── */

export const initiateRefund = catchAsync(async (req, res, next) => {
  const { error, value } = initiateRefundSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const result = await paymentService.initiateRefund(
    req.params.orderId,
    value.amount,
    value.reason
  );
  res.status(200).json({ success: true, message: "Refund initiated.", data: result });
});
