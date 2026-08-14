/**
 * Webhook HMAC Verification Middleware
 *
 * Enforces signature verification at the route boundary before ANY business
 * logic executes. Relies on req.rawBody captured by app.js's captureRawJsonBody.
 *
 * Security properties:
 *  - Timing-safe comparison (prevents timing attacks)
 *  - Timestamp tolerance check (prevents replay attacks)
 *  - Hard-rejects requests without a valid signature — no fallback, no bypass
 *  - Provider is looked up strictly from DB; "mock" name is rejected
 */

import crypto from "crypto";
import ShippingProvider from "../../modules/shipment/models/shippingProvider.model.js";

const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Build the expected HMAC signature.
 * Algorithm matches what providers are configured to send:
 *   HMAC-SHA256( `${timestamp}.${rawBody}`, webhookSecret )
 */
function buildExpectedSignature(secret, timestamp, rawBody) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");
}

function timingSafeEqual(a, b) {
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

/**
 * Express middleware. Attach to webhook routes before any other handler.
 *
 * Usage:
 *   router.post("/webhook/:providerName", verifyWebhookHmac, controller.webhookUpdate);
 */
export const verifyWebhookHmac = async (req, res, next) => {
  const { providerName } = req.params;

  // Reject "mock" provider name at the route level — never a valid webhook source
  if (!providerName || providerName.toLowerCase() === "mock") {
    return res.status(400).json({
      success: false,
      message: "Invalid provider",
      error: "WEBHOOK_INVALID_PROVIDER",
    });
  }

  // Require raw body (captured by app.js captureRawJsonBody)
  const rawBody = req.rawBody;
  if (!rawBody) {
    return res.status(400).json({
      success: false,
      message: "Missing request body",
      error: "WEBHOOK_MISSING_BODY",
    });
  }

  // Extract signature and timestamp from headers
  const signature =
    req.headers["x-webhook-signature"] ||
    req.headers["x-shipmozo-signature"] ||
    null;

  const timestampHeader =
    req.headers["x-webhook-timestamp"] ||
    req.headers["x-shipmozo-timestamp"] ||
    null;

  if (!signature) {
    return res.status(401).json({
      success: false,
      message: "Missing webhook signature",
      error: "WEBHOOK_MISSING_SIGNATURE",
    });
  }

  if (!timestampHeader) {
    return res.status(401).json({
      success: false,
      message: "Missing webhook timestamp",
      error: "WEBHOOK_MISSING_TIMESTAMP",
    });
  }

  // Validate timestamp is a recent integer
  const timestamp = parseInt(timestampHeader, 10);
  if (!Number.isFinite(timestamp)) {
    return res.status(401).json({
      success: false,
      message: "Invalid webhook timestamp",
      error: "WEBHOOK_INVALID_TIMESTAMP",
    });
  }

  const ageMsec = Date.now() - timestamp;
  if (ageMsec > TIMESTAMP_TOLERANCE_MS || ageMsec < -TIMESTAMP_TOLERANCE_MS) {
    return res.status(401).json({
      success: false,
      message: "Webhook timestamp outside acceptable window (replay attack protection)",
      error: "WEBHOOK_TIMESTAMP_EXPIRED",
    });
  }

  // Load provider config from DB — no mock bypass, no env override
  const providerDoc = await ShippingProvider.findOne({
    name: providerName.toLowerCase(),
    isActive: true,
  }).select("webhookSecret name").lean();

  if (!providerDoc) {
    return res.status(401).json({
      success: false,
      message: `Provider "${providerName}" not found or not active`,
      error: "WEBHOOK_UNKNOWN_PROVIDER",
    });
  }

  if (!providerDoc.webhookSecret) {
    // Provider exists but has no secret configured — reject
    return res.status(500).json({
      success: false,
      message: "Provider webhook secret not configured",
      error: "WEBHOOK_SECRET_MISSING",
    });
  }

  // Verify HMAC
  const expected = buildExpectedSignature(providerDoc.webhookSecret, timestamp, rawBody);

  if (!timingSafeEqual(expected, signature)) {
    return res.status(401).json({
      success: false,
      message: "Webhook signature verification failed",
      error: "WEBHOOK_INVALID_SIGNATURE",
    });
  }

  // Attach verified provider doc for downstream handlers to use without re-fetching
  req.verifiedProvider = providerDoc;

  next();
};
