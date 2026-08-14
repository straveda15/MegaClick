import mongoose from "mongoose";

const rawMaterialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    reorderLevel: {
      type: Number,
      default: 10,
    },
    costPerUnit: {
      type: Number,
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },
    lastReceived: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["available", "low_stock", "out_of_stock"],
      default: "out_of_stock",
    },
  },
  {
    timestamps: true,
  }
);

rawMaterialSchema.methods.updateStatus = function () {
  if (this.stock === 0) {
    this.status = "out_of_stock";
  } else if (this.stock <= this.reorderLevel) {
    this.status = "low_stock";
  } else {
    this.status = "available";
  }
};

rawMaterialSchema.pre("save", function () {
  this.updateStatus();
});

const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);

export default RawMaterial;
