import mongoose from "mongoose";

/**
 * The reusable checklist for one catalog service — "GST Registration always
 * goes: collect PAN → file ARN → respond to queries → download certificate".
 *
 * Templates are configured once on the Service Steps page and preloaded every
 * time that service is assigned to an employee. The assigned task keeps its own
 * copy of the steps, so editing a template never rewrites work already handed
 * out.
 */
const serviceStepTemplateSchema = new mongoose.Schema(
  {
    // The catalog slug is the identity — one template per service.
    serviceSlug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    serviceTitle: {
      type: String,
      required: true,
      trim: true,
    },
    serviceCategory: {
      type: String,
      trim: true,
    },
    categorySlug: {
      type: String,
      trim: true,
    },
    steps: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        // Position in the checklist. Kept explicit so reordering survives a
        // round-trip through the API.
        order: { type: Number, default: 0 },
      },
    ],
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ServiceStepTemplate = mongoose.model("ServiceStepTemplate", serviceStepTemplateSchema);

export default ServiceStepTemplate;
