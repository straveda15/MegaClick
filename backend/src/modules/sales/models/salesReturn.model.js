import mongoose from "mongoose";

const salesReturnSchema = new mongoose.Schema(
  {
    returnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Return", // Links to existing generic Return document
      required: true,
      unique: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    salesStatus: {
      type: String,
      enum: ["REQUESTED", "VERIFIED", "APPROVED", "PICKUP_INITIATED", "COMPLETED"],
      default: "REQUESTED",
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: String,
      },
    ],
    verifiedAt: { type: Date },
    approvedAt: { type: Date }, // aligns with Return.approvedAt
    pickupInitiatedAt: { type: Date },
    completedAt: { type: Date },
    
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    deliveryPartnerRef: {
      type: String, // e.g., mock AWB generated during PICKUP_INITIATED
      default: null,
    },
    source: {
        type: String,
        enum: ["csv", "web", "manual"],
        default: "manual"
    }
  },
  {
    timestamps: true,
  }
);

salesReturnSchema.index({ assignedTo: 1, salesStatus: 1 });
salesReturnSchema.index({ orderId: 1 });

const SalesReturn = mongoose.model("SalesReturn", salesReturnSchema);

export default SalesReturn;
