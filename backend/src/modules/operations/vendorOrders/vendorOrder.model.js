import mongoose from "mongoose";

const vendorOrderSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    itemsOrdered: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        productName: { type: String, required: true },
        component: { type: String, required: true, default: "powder" },
        quantity: { type: Number, required: true }, // normalised value (grams for g/kg)
        displayQuantity: { type: Number }, // quantity as entered by the user, in `unit`
        unit: { type: String, required: true, default: "g" },
        pricePerUnit: { type: Number, required: true },
        totalItemCost: { type: Number, required: true },
      }
    ],
    totalCost: {
      type: Number,
      required: true,
    },
    dateOrdered: {
      type: Date,
      default: Date.now,
    },
    remainingBalanceAfterOrder: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "received"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const VendorOrder = mongoose.model("VendorOrder", vendorOrderSchema);

export default VendorOrder;
