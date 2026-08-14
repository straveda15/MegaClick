import mongoose from "mongoose";

const shipmentOperationSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    requestFingerprint: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCEEDED", "FAILED"],
      default: "PENDING",
      index: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingProvider",
      default: null,
    },
    providerName: {
      type: String,
      default: null,
      trim: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    error: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    attempts: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

shipmentOperationSchema.index(
  { method: 1, idempotencyKey: 1 },
  { unique: true }
);

const ShipmentOperation = mongoose.model(
  "ShipmentOperation",
  shipmentOperationSchema
);

export default ShipmentOperation;
