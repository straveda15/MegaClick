import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    returnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Return",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    refundId: {
      type: String,
      unique: true,
      sparse: true, // For pending refunds that don't have a gateway ID yet
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    reason: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Refund = mongoose.model("Refund", refundSchema);

export default Refund;
