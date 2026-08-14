import crypto from "crypto";
import axios from "axios";
import mongoose from "mongoose";
import Payment from "./payment.model.js";
import Order from "../order/order.model.js";
import Product from "../product/product.model.js";
import { confirmOrder } from "../order/order.service.js";
import AppError from "../../shared/utils/appError.js";

const GOKWIK_BASE_URL =
  process.env.GOKWIK_ENV === "production"
    ? "https://api.gokwik.co/v1"
    : "https://sandbox.gokwik.co/v1";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function timingSafeCompare(a, b) {
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

/* ── PayU: Hash Helpers ──────────────────────────────────────────────────── */

// sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
function generatePayUHash({ key, txnid, amount, productinfo, firstname, email, salt, udf1 = "", udf2 = "", udf3 = "", udf4 = "", udf5 = "" }) {
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

// sha512(salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
function verifyPayUHash({ salt, status, udf5 = "", udf4 = "", udf3 = "", udf2 = "", udf1 = "", email, firstname, productinfo, amount, txnid, key, receivedHash }) {
  const hashString = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const computedHash = crypto.createHash("sha512").update(hashString).digest("hex");
  return computedHash === receivedHash;
}

function generateTxnId() {
  return `EVL_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

/* ── PayU: Create Payment Params ─────────────────────────────────────────── */

export const createPayUPaymentParams = async ({
  orderId,
  amount,
  productinfo,
  firstname,
  email,
  phone,
  successUrl,
  failureUrl,
  udf1 = "",
  udf2 = "",
  udf3 = "",
  udf4 = "",
  udf5 = "",
}) => {
  const key = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;

  if (!key || !salt) throw new Error("PayU credentials (PAYU_MERCHANT_KEY / PAYU_MERCHANT_SALT) are not configured");

  const txnid = generateTxnId();
  const amountStr = parseFloat(amount).toFixed(2);

  const hash = generatePayUHash({ key, txnid, amount: amountStr, productinfo, firstname, email, salt, udf1, udf2, udf3, udf4, udf5 });

  return {
    key,
    txnid,
    amount: amountStr,
    productinfo,
    firstname,
    email,
    phone,
    surl: successUrl,
    furl: failureUrl,
    hash,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    service_provider: "payu_paisa",
    payuBaseUrl: `${process.env.PAYU_BASE_URL || "https://secure.payu.in"}/_payment`,
  };
};

/* ── PayU: Verify Callback ───────────────────────────────────────────────── */

export const verifyPayUPayment = async (body) => {
  const {
    mihpayid,
    status,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1 = "",
    udf2 = "",
    udf3 = "",
    udf4 = "",
    udf5 = "",
    hash: receivedHash,
  } = body;

  const key = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;

  if (!receivedHash) return { success: false, reason: "No hash in PayU response", txnid, mihpayid };
  if (status !== "success") return { success: false, reason: `Payment status: ${status}`, txnid, mihpayid };

  const isValid = verifyPayUHash({ salt, status, udf5, udf4, udf3, udf2, udf1, email, firstname, productinfo, amount, txnid, key, receivedHash });

  if (!isValid) {
    console.warn(`[PayU] Hash mismatch for txnid=${txnid} mihpayid=${mihpayid} — possible response tampering`);
    return { success: false, reason: "Hash mismatch — possible response tampering", txnid, mihpayid };
  }

  return { success: true, txnid, mihpayid, amount, status };
};

/* ── PayU: Verify a FAILURE callback ─────────────────────────────────────── */

// verifyPayUPayment() above short-circuits on any non-"success" status before it
// ever checks the hash, so it can't be reused here. The hash formula includes
// `status`, so it validates a "failure" response just as well — and we MUST
// verify it: without a hash check anyone could POST a spoofed failure callback
// and kill someone else's paid order.
export const verifyPayUFailure = async (body) => {
  const {
    mihpayid,
    status,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1 = "",
    udf2 = "",
    udf3 = "",
    udf4 = "",
    udf5 = "",
    hash: receivedHash,
  } = body;

  const key = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;

  const base = { txnid, mihpayid, orderId: udf1, status };

  if (!receivedHash) return { ...base, valid: false, reason: "No hash in PayU response" };
  if (status === "success") return { ...base, valid: false, reason: "Success status on the failure callback" };

  const isValid = verifyPayUHash({ salt, status, udf5, udf4, udf3, udf2, udf1, email, firstname, productinfo, amount, txnid, key, receivedHash });

  if (!isValid) {
    console.warn(`[PayU] Hash mismatch on FAILURE callback for txnid=${txnid} mihpayid=${mihpayid} — possible response tampering`);
    return { ...base, valid: false, reason: "Hash mismatch — possible response tampering" };
  }

  return { ...base, valid: true };
};

/* ── PayU: Create Payment Record (called from success callback) ──────────── */

export const createPayUPaymentRecord = async ({ orderId, userId, txnid, mihpayid, amount }) => {
  // Upsert — safe to call multiple times (idempotent on txnid)
  const existing = await Payment.findOne({ payuTxnid: txnid });
  if (existing) return existing;

  return await Payment.create({
    orderId,
    userId,
    provider: "payu",
    status: "paid",
    payuTxnid: txnid,
    payuMihpayid: mihpayid,
    amount: Math.round(parseFloat(amount) * 100), // store in paise
    currency: "INR",
  });
};

/* ── PayU: Initiate Refund ───────────────────────────────────────────────── */

export const initiatePayURefund = async ({ mihpayid, amount, txnid }) => {
  const key = process.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_MERCHANT_SALT;
  const refundTxnId = `REFUND_${txnid}_${Date.now()}`;

  // PayU refund hash: sha512(key|'cancel_refund_transaction'|refundTxnId|mihpayid|amount|salt)
  const hashStr = `${key}|cancel_refund_transaction|${refundTxnId}|${mihpayid}|${amount}|${salt}`;
  const hash = crypto.createHash("sha512").update(hashStr).digest("hex");

  const params = new URLSearchParams({
    key,
    command: "cancel_refund_transaction",
    var1: mihpayid,
    var2: refundTxnId,
    var3: String(amount),
    hash,
  });

  const response = await axios.post(
    "https://info.payu.in/merchant/postservice?form=2",
    params.toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  if (response.data?.status !== 1) {
    throw new Error(`PayU refund failed: ${response.data?.msg || JSON.stringify(response.data)}`);
  }

  return { gatewayRefundId: response.data?.mihpayid || refundTxnId, raw: response.data };
};

/* ── PayU: Service-level refund (called from refund.service.js) ─────────── */

export const initiateRefund = async (orderId, amount, reason) => {
  const payment = await Payment.findOne({ orderId, status: "paid" });
  if (!payment) throw new AppError("No paid payment found for this order.", 404);

  const { gatewayRefundId } = await initiatePayURefund({
    mihpayid: payment.payuMihpayid,
    amount,
    txnid: payment.payuTxnid,
  });

  payment.refundId = gatewayRefundId;
  payment.refundAmount = amount;
  payment.refundStatus = "pending";
  await payment.save();

  return { refundId: gatewayRefundId, amount };
};

/* ── GoKwik: Create Order ────────────────────────────────────────────────── */

export const createGokwikOrder = async (orderId, userId, customerData) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found.", 404);

  // Product's current SKU (Product Master) is the source of truth — resolve it
  // live rather than substituting the Mongo productId as a placeholder.
  const validProductIds = Array.from(
    new Set(
      order.items
        .map((i) => i.productId)
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => id.toString())
    )
  );
  const products = validProductIds.length
    ? await Product.find({ _id: { $in: validProductIds } }).select("sku").lean()
    : [];
  const skuMap = new Map(products.map((p) => [p._id.toString(), p.sku || ""]));

  const payload = {
    merchant_id: process.env.GOKWIK_MERCHANT_ID,
    merchant_order_id: order.orderNumber,
    amount: order.pricing.finalAmount,
    currency: "INR",
    customer: {
      phone: customerData.phone,
      email: customerData.email || "",
      name: customerData.name || "",
    },
    shipping_address: customerData.address,
    items: order.items.map((i) => ({
      sku: skuMap.get(i.productId?.toString()) || i.productId.toString(),
      name: i.productName,
      quantity: i.quantity,
      price: i.priceAtPurchase,
    })),
    environment: process.env.GOKWIK_ENV || "sandbox",
  };

  const response = await axios.post(`${GOKWIK_BASE_URL}/merchant/order`, payload, {
    headers: {
      "x-api-key": process.env.GOKWIK_API_KEY,
      "x-api-secret": process.env.GOKWIK_API_SECRET,
      "Content-Type": "application/json",
    },
  });

  await Payment.create({
    orderId,
    userId,
    provider: "gokwik",
    status: "created",
    gokwikOrderId: response.data.order_id,
    gokwikMerchantOrderId: order.orderNumber,
    amount: Math.round(order.pricing.finalAmount * 100),
  });

  return {
    gokwikOrderId: response.data.order_id,
    checkoutToken: response.data.checkout_token,
    merchantOrderId: order.orderNumber,
  };
};

/* ── GoKwik: Webhook ─────────────────────────────────────────────────────── */

export const handleGokwikWebhook = async (rawBody, signatureHeader, timestampHeader) => {
  const expected = crypto
    .createHmac("sha256", process.env.GOKWIK_WEBHOOK_SECRET)
    .update(`${timestampHeader}.${rawBody}`)
    .digest("hex");

  if (!timingSafeCompare(expected, signatureHeader || "")) {
    throw new AppError("GoKwik webhook signature verification failed.", 400);
  }

  const event = JSON.parse(rawBody.toString());

  const order = await Order.findOne({ orderNumber: event.merchant_order_id });
  if (!order) throw new AppError("Order not found for GoKwik event.", 404);

  const payment = await Payment.findOne({
    gokwikMerchantOrderId: event.merchant_order_id,
  });

  switch (event.event_type) {
    case "order.confirmed": {
      // COD only — prepaid is now handled exclusively by PayU
      if (event.payment_mode === "cod") {
        order.payment.paymentStatus = "PENDING";
        order.orderStatus = "CONFIRMED";
        if (payment) {
          payment.method = "cod";
        }
        await confirmOrder(order._id.toString()).catch(() => {});
      } else {
        console.log(`[GoKwikWebhook] order.confirmed with payment_mode=${event.payment_mode} ignored — handled by PayU`);
      }
      break;
    }
    case "payment.success": {
      // Deprecated — GoKwik prepaid is no longer used; PayU handles all prepaid
      console.log(`[GoKwikWebhook] payment.success ignored — prepaid now handled by PayU (order: ${event.merchant_order_id})`);
      break;
    }
    case "order.cancelled": {
      order.orderStatus = "CANCELLED";
      if (payment) payment.status = "failed";
      break;
    }
    case "cod.verified": {
      order.orderStatus = "CONFIRMED";
      await confirmOrder(order._id.toString()).catch(() => {});
      break;
    }
    default:
      console.log(`[GoKwikWebhook] Unknown event: ${event.event_type}`);
  }

  // Enrich shipping address from webhook if not already set
  if (!order.shippingAddress && event.shipping_address) {
    order.shippingAddress = {
      firstName: (event.shipping_address.name || "").split(" ")[0] || "Customer",
      lastName: (event.shipping_address.name || "").split(" ").slice(1).join(" ") || "",
      phone: event.shipping_address.phone || "",
      addressLine1: event.shipping_address.address_line1 || "",
      addressLine2: event.shipping_address.address_line2 || "",
      city: event.shipping_address.city || "",
      state: event.shipping_address.state || "",
      postalCode: event.shipping_address.pincode || "",
      country: "India",
    };
  }

  await order.save();

  if (payment) {
    payment.webhookEvents.push({
      event: event.event_type,
      payload: event,
      receivedAt: new Date(),
    });
    await payment.save();
  }

  return { received: true };
};

/* ── Payment Status ──────────────────────────────────────────────────────── */

export const getPaymentByOrderId = async (orderId) => {
  const payment = await Payment.findOne({ orderId }).sort({ createdAt: -1 });
  if (!payment) throw new AppError("Payment record not found.", 404);
  return payment;
};
