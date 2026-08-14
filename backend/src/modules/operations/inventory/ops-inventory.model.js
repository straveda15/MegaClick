import mongoose from "mongoose";

const opsInventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    variant: {
      type: String,
      default: null,
    },
    warehouse: {
      type: String,
      default: "Main Warehouse",
    },
    available: {
      type: Number,
      default: 0,
    },
    reserved: {
      type: Number,
      default: 0,
    },
    reorderLevel: {
      type: Number,
      default: 10,
    },
    status: {
      type: String,
      enum: ["available", "low_stock", "out_of_stock"],
      default: "out_of_stock",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

opsInventorySchema.methods.updateStatus = function () {
  if (this.available <= 0) {
    this.status = "out_of_stock";
  } else if (this.available <= this.reorderLevel) {
    this.status = "low_stock";
  } else {
    this.status = "available";
  }
};

opsInventorySchema.pre("save", function () {
  this.updateStatus();
  this.lastUpdated = new Date();
});

const OpsInventory = mongoose.model("OpsInventory", opsInventorySchema);

export default OpsInventory;
