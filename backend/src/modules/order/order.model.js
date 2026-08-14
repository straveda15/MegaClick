import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  priceAtPurchase: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  weight: {
    type: Number,
    min: 0,
    default: null,
  },
  variant: {
    name: String,
    value: String,
  },
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: "India" },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: String,
      index: true,
      default: null,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [v => v.length > 0, "Order must have at least one item."],
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      couponCode: {
        type: String,
        default: null,
      },
      deliveryCharge: {
        type: Number,
        default: 0,
        min: 0,
      },
      finalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      // Partial COD: paid online up-front (2% of subtotal + delivery charge).
      prepaidAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      // Partial COD: balance collected as cash on delivery (subtotal − 2%).
      codDueAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    payment: {
      paymentProvider: {
        type: String,
        enum: ["payu", "gokwik", "cod", "mock", "razorpay"],
        default: "payu",
      },
      // User-facing payment method chosen at checkout.
      paymentMethod: {
        type: String,
        enum: ["card", "upi", "netbanking", "cod", "partial_cod"],
        default: "card",
      },
      // Partial COD: set true once the courier collects the COD balance.
      codCollected: {
        type: Boolean,
        default: false,
      },
      paymentOrderId: {
        type: String,
      },
      paymentId: {
        type: String,
      },
      paymentStatus: {
        type: String,
        // PARTIAL = the online prepaid leg (partial_cod) succeeded but a COD
        // balance is still due — distinct from SUCCESS (fully paid online).
        enum: ["PENDING", "PARTIAL", "SUCCESS", "FAILED", "REFUNDED"],
        default: "PENDING",
      },
      // PayU-specific fields
      payu_txnid: { type: String, default: null },
      payu_mihpayid: { type: String, default: null },
      gateway_status: { type: String, default: null },
      paidAt: { type: Date, default: null },
    },
    notes: {
      type: String,
      default: "",
    },
    orderStatus: {
      type: String,
      enum: ["PENDING_PAYMENT", "PENDING", "PAID", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED", "FAILED", "CREATED"],
      default: "PENDING_PAYMENT",
    },
    source: {
      type: String,
      enum: ["web", "app", "admin", "instagram", "facebook", "google", "direct"],
      default: "web",
    },
    returnStatus: {
      type: String,
      enum: ["NONE", "RETURN_REQUESTED", "RETURN_APPROVED", "RETURN_REJECTED", "RETURN_PICKED_UP", "RETURN_REFUNDED", "RETURN_COMPLETED"],
      default: "NONE",
    },

    packagingNotes: {
      type: String,
      default: "",
    },

    packagingStatus: {
      type: String,
      enum: ["pending", "in_progress", "packed"],
      default: "pending",
    },

    assignedPackager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    dispatchStatus: {
      type: String,
      // 'dispatching' acts as an exclusive lock — only one process may hold it
      enum: ["pending", "in_progress", "dispatching", "dispatched", "failed"],
      default: "pending",
    },

    // Timestamp when the dispatching lock was acquired (used to detect stuck locks)
    dispatchLockedAt: {
      type: Date,
      default: null,
    },

    dispatchStartedAt: {
      type: Date,
      default: null,
    },

    dispatchStartedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    selectedCourier: {
      type: String,
      default: null,
    },

    selectedCourierName: {
      type: String,
      default: null,
    },

    dispatchFailedAt: {
      type: Date,
      default: null,
    },

    dispatchFailureReason: {
      type: String,
      default: null,
    },

    dispatchedAt: {
      type: Date,
      default: null,
    },

    dispatchedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    trackingNumber: {
      type: String,
      default: null,
    },

    courier: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to speed up the dispatch queue query (packagingStatus + dispatchStatus + createdAt FIFO)
orderSchema.index({ packagingStatus: 1, dispatchStatus: 1, createdAt: 1 });

orderSchema.virtual("salesStatus").get(function () {
  if (["PENDING_PAYMENT", "CREATED"].includes(this.orderStatus)) return "PENDING";
  if (this.orderStatus === "PAID") return "CONFIRMED";
  if (this.orderStatus === "CONFIRMED") return "PACKAGING"; // Waiting dispatch
  return this.orderStatus; // SHIPPED, DELIVERED map 1:1
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
