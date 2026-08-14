import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["payu", "gokwik"],
      required: true,
    },

    // PayU fields
    payuTxnid: { type: String, index: true },
    payuMihpayid: { type: String, index: true },

    // Razorpay legacy fields — kept for backward compat with existing DB documents
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String, index: true },
    razorpaySignature: { type: String },

    // GoKwik fields
    gokwikOrderId: { type: String, index: true },
    gokwikMerchantOrderId: { type: String },

    amount: { type: Number, required: true },  // in paise (INR × 100)
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["created", "attempted", "paid", "failed", "refunded", "partially_refunded"],
      default: "created",
    },

    method: { type: String },  // card, upi, netbanking, wallet, cod

    refundId: { type: String },
    refundAmount: { type: Number },
    refundStatus: {
      type: String,
      enum: ["pending", "processed", "failed"],
    },

    webhookEvents: [
      {
        event: String,
        payload: { type: mongoose.Schema.Types.Mixed },
        receivedAt: Date,
      },
    ],

    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
