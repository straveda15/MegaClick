import mongoose from "mongoose";

const salesCustomerSchema = new mongoose.Schema(
  {
    name: {
      // Optional: bulk-imported leads may arrive with only a phone number.
      // The UI falls back to showing the phone until a name is filled in.
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
    },
    addressLine1: {
      type: String,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    landmark: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    source: {
      type: String,
      enum: ["csv", "excel", "manual", "web", "scraped", "offline_orders"],
      default: "manual",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

salesCustomerSchema.index({ email: 1 }, { sparse: true });
salesCustomerSchema.index({ source: 1 });

const SalesCustomer = mongoose.model("SalesCustomer", salesCustomerSchema);


export default SalesCustomer;
