import mongoose from "mongoose";

const timelineEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// NOTE: `cod` here is the courier's COD *handling fee*, NOT the amount collected
// from the customer. The collectible lives in shipment.codAmount below — the two
// were previously conflated in the admin UI.
const shipmentChargesSchema = new mongoose.Schema(
  {
    freight: { type: Number, default: 0 },
    cod: { type: Number, default: 0 },
    handling: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    // ── Payment snapshot ──────────────────────────────────────────────────────
    // Denormalised from the order at dispatch time so a shipment record shows
    // what the courier was actually told to collect, without re-deriving it.
    // All optional — existing shipment documents load unchanged.
    paymentMethod: { type: String, default: null },   // e.g. "cod" | "partial_cod" | "card"
    prepaidAmount: { type: Number, default: 0 },      // already settled online
    codAmount:     { type: Number, default: 0 },      // collected on delivery
    orderTotal:    { type: Number, default: 0 },      // declared value of the goods

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    /** Reference to the ShippingProvider document used for this shipment */
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingProvider",
      default: null,
    },

    /** Provider machine name — e.g. "shipmozo", "indiapost", "mock" */
    provider: {
      type: String,
      default: "mock",
      index: true,
    },

    /** Provider's internal order ID (their system, not ours) */
    providerOrderId: {
      type: String,
      default: "",
    },

    /** Provider's secondary reference ID (Shipmozo: reference_id from push-order) */
    referenceId: {
      type: String,
      default: "",
    },

    trackingId: {
      type: String,
      index: true,
    },

    awbNumber: {
      type: String,
      default: "",
    },

    /** Assigned courier name (e.g. "BlueDart", "DTDC", "MockCourier Express") */
    courierName: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "COURIER_ASSIGNED",
        "PICKUP_SCHEDULED",
        "PICKED_UP",
        "SHIPPED",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "FAILED",
        "CANCELLED",
        "RTO_INITIATED",
        "RTO_DELIVERED",
        "RETURN_CREATED",
        "RETURN_PICKED_UP",
        "RETURN_DELIVERED",
      ],
      default: "CREATED",
      index: true,
    },

    statusCode: {
      type: String,
      default: "",
    },

    trackingUrl: {
      type: String,
      default: "",
    },

    /** Shipping label download URL */
    labelUrl: {
      type: String,
      default: "",
    },

    currentLocation: {
      type: String,
      default: "",
    },

    estimatedDelivery: {
      type: Date,
    },

    /** When pickup was scheduled */
    pickupScheduledAt: {
      type: Date,
      default: null,
    },

    /** Shipping charges breakdown */
    charges: {
      type: shipmentChargesSchema,
      default: () => ({}),
    },

    timeline: {
      type: [timelineEventSchema],
      default: [],
    },

    /** Raw response payload from the delivery provider — kept for debugging */
    providerPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    isReturned: {
      type: Boolean,
      default: false,
    },

    isReturn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
