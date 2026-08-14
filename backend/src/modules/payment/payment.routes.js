import express from "express";
import { authenticateUser, requireAdmin } from "../../shared/middleware/auth.middleware.js";
import * as paymentController from "./payment.controller.js";

const router = express.Router();

// ── Webhook routes (no auth — HMAC signature is the sole auth mechanism) ───
router.post("/webhook/gokwik", paymentController.gokwikWebhook);

// ── PayU callback routes (unauthenticated — PayU posts here from their servers) ──
router.post("/payu/success", paymentController.handlePayUSuccess);
router.post("/payu/failure", paymentController.handlePayUFailure);
router.post("/payu/verify", paymentController.verifyPayUPaymentHandler);

// ── Authenticated routes ────────────────────────────────────────────────────
router.use(authenticateUser);

// /payu/initiate removed — use POST /api/v1/checkout/initiate instead. It creates
// a PendingCheckout draft rather than an order, so a failed or abandoned payment
// leaves nothing behind.
router.post("/gokwik/create-order", paymentController.gokwikCreateOrder);
router.get("/status/:orderId", paymentController.getPaymentStatus);

// ── Admin only ──────────────────────────────────────────────────────────────
router.post("/refund/:orderId", requireAdmin, paymentController.initiateRefund);

export default router;
