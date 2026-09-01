import mongoose from "mongoose";

const feeItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
}, { _id: false });

const serviceFeeSchema = new mongoose.Schema(
  {
    serviceSlug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fees: {
      type: [feeItemSchema],
      default: [],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const ServiceFee = mongoose.model("ServiceFee", serviceFeeSchema);
