import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    address: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 200,
    },
    initialInvestment: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Initial investment must be a whole number",
      },
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    notes: {
      type: String,
      default: "",
    },
    productCosts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: false,
        },
        isCustom: { type: Boolean, default: false },
        customName: { type: String, trim: true },
        powderCostPerGram: { type: Number, default: 0 },
        powderGrams: { type: Number, default: 0 },
        packagingCost: { type: Number, default: 0 },
        packagingGrams: { type: Number, default: 0 },
        sideLabelCost: { type: Number, default: 0 },
        sideLabelGrams: { type: Number, default: 0 },
        upperLabelCost: { type: Number, default: 0 },
        upperLabelGrams: { type: Number, default: 0 },
        spoonCost: { type: Number, default: 0 },
        spoonGrams: { type: Number, default: 0 },
        shippingCharges: { type: Number, default: 0 },
        shippingGrams: { type: Number, default: 0 },
        jarCost: { type: Number, default: 0 },
        jarGrams: { type: Number, default: 0 },
        plasticSleevesCost: { type: Number, default: 0 },
        plasticSleevesGrams: { type: Number, default: 0 },
        courierBagCost: { type: Number, default: 0 },
        courierBagGrams: { type: Number, default: 0 },
        tapeCost: { type: Number, default: 0 },
        tapeGrams: { type: Number, default: 0 },
        bubbleSheetCost: { type: Number, default: 0 },
        bubbleSheetGrams: { type: Number, default: 0 },
        // Live Stock Balances
        powderStock: { type: Number, default: 0 },
        packagingStock: { type: Number, default: 0 },
        sideLabelStock: { type: Number, default: 0 },
        upperLabelStock: { type: Number, default: 0 },
        spoonStock: { type: Number, default: 0 },
        shippingStock: { type: Number, default: 0 },
        jarStock: { type: Number, default: 0 },
        plasticSleevesStock: { type: Number, default: 0 },
        courierBagStock: { type: Number, default: 0 },
        tapeStock: { type: Number, default: 0 },
        bubbleSheetStock: { type: Number, default: 0 },
        extraCosts: [
          {
            label: { type: String, trim: true },
            amount: { type: Number, default: 0 },
            grams: { type: Number, default: 0 },
            unit: { type: String, default: "g" },
            stock: { type: Number, default: 0 }, // Added for live tracking
            // "herb" entries render in the Herbs section; everything else (incl.
            // legacy untagged) is treated as a generic extra cost.
            kind: { type: String, enum: ["herb", "extra"], default: "extra" },
          }
        ],
        finalCost: { type: Number, default: null },
        powderUnit: { type: String, default: "g" },
        jarUnit: { type: String, default: "units" },
        packagingUnit: { type: String, default: "units" },
        sideLabelUnit: { type: String, default: "units" },
        upperLabelUnit: { type: String, default: "units" },
        spoonUnit: { type: String, default: "units" },
        shippingUnit: { type: String, default: "units" },
        plasticSleevesUnit: { type: String, default: "units" },
        courierBagUnit: { type: String, default: "units" },
        tapeUnit: { type: String, default: "units" },
        bubbleSheetUnit: { type: String, default: "units" },
      }
    ],
    investments: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
