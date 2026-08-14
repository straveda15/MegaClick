import mongoose from "mongoose";

/**
 * A checkout that has been handed off to PayU but not yet paid for.
 *
 * Why this exists: the order used to be written to Mongo BEFORE the customer was
 * redirected to PayU. If the payment then failed — or, worse, if PayU rejected
 * the request outright (bad hash) or the customer just closed the tab — PayU
 * fired no callback at all, and the order was stranded as PENDING_PAYMENT
 * forever, showing to the customer as a placed order.
 *
 * So: no Order exists until payment is verified. Everything needed to build one
 * lives here instead. If the payment never completes, this draft simply expires
 * via the TTL index below and nothing is left behind.
 */

const draftItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  priceAtPurchase: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  weight: { type: Number, min: 0, default: null },
  variant: {
    name: String,
    value: String,
  },
}, { _id: false });

const draftAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, default: "" },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: "India" },
}, { _id: false });

const pendingCheckoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: { type: [draftItemSchema], required: true },
    shippingAddress: { type: draftAddressSchema, required: true },

    // Server-computed by order.service.prepareOrderPayload() — the client's
    // numbers are never trusted, and this is the source of truth when the real
    // Order is built on payment success.
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      discountAmount: { type: Number, default: 0, min: 0 },
      couponCode: { type: String, default: null },
      deliveryCharge: { type: Number, default: 0, min: 0 },
      finalAmount: { type: Number, required: true, min: 0 },
      prepaidAmount: { type: Number, default: 0, min: 0 },
      codDueAmount: { type: Number, default: 0, min: 0 },
    },

    paymentMethod: { type: String, required: true },
    notes: { type: String },
    source: { type: String, default: "web" },

    // The PayU txnid this draft was handed off with — lets the success callback
    // tie a payment back to its draft, and backs the duplicate-callback guard.
    payuTxnid: { type: String, index: true, default: null },
  },
  { timestamps: true }
);

// Self-cleaning: an abandoned checkout deletes itself after an hour. This is what
// makes the whole approach safe without a sweeper job — an unpaid draft was never
// an order, so there is nothing to reconcile when it disappears.
pendingCheckoutSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

const PendingCheckout = mongoose.model("PendingCheckout", pendingCheckoutSchema);

export default PendingCheckout;
