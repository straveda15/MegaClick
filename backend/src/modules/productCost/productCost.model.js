import mongoose from "mongoose";

const extraCostSchema = new mongoose.Schema(
  {
    label:  { type: String, required: true, trim: true },
    amount: { type: Number, required: true, default: 0, min: 0 },
  },
  { _id: false }
);

const productCostSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
      index: true,
    },

    // Powder — gram-based pricing
    powderCostPerGram: { type: Number, default: 0, min: 0 },
    powderGrams:       { type: Number, default: 0, min: 0 },

    // Per-unit fixed costs
    packagingCost:      { type: Number, default: 0, min: 0 },
    sideLabelCost:      { type: Number, default: 0, min: 0 },
    upperLabelCost:     { type: Number, default: 0, min: 0 },
    spoonCost:          { type: Number, default: 0, min: 0 },
    shippingCharges:    { type: Number, default: 0, min: 0 },
    jarCost:            { type: Number, default: 0, min: 0 },
    plasticSleevesCost: { type: Number, default: 0, min: 0 },
    courierBagCost:     { type: Number, default: 0, min: 0 },
    tapeCost:           { type: Number, default: 0, min: 0 },
    bubbleSheetCost:    { type: Number, default: 0, min: 0 },

    // Admin-defined extra line items
    extraCosts: { type: [extraCostSchema], default: [] },

    // Admin can override computed total (null = use auto-computed)
    finalCost: { type: Number, default: null, min: 0 },
  },
  { timestamps: true }
);

// Virtual: auto-computed total (not stored)
productCostSchema.virtual("computedTotal").get(function () {
  const powder  = (this.powderCostPerGram || 0) * (this.powderGrams || 0);
  const fixed   =
    (this.packagingCost      || 0) +
    (this.sideLabelCost      || 0) +
    (this.upperLabelCost     || 0) +
    (this.spoonCost          || 0) +
    (this.shippingCharges    || 0) +
    (this.jarCost            || 0) +
    (this.plasticSleevesCost || 0) +
    (this.courierBagCost     || 0) +
    (this.tapeCost           || 0) +
    (this.bubbleSheetCost    || 0);
  const extras  = (this.extraCosts || []).reduce((s, e) => s + (e.amount || 0), 0);
  return powder + fixed + extras;
});

productCostSchema.set("toJSON", { virtuals: true });
productCostSchema.set("toObject", { virtuals: true });

const ProductCost = mongoose.model("ProductCost", productCostSchema);
export default ProductCost;
