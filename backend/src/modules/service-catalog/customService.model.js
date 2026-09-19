import mongoose from "mongoose";

/**
 * A service added from the dashboard's Service Steps page, on top of the ones
 * shipped in `servicesData.js`. It is merged into the catalog on every read, so
 * it shows up everywhere the built-in services do — the Add Lead / Add Client
 * dropdowns, the Service Steps picker, lead import matching.
 *
 * Only the category's slug is stored: the category itself stays defined in
 * `servicesData.js`, and its title is resolved from there when the catalog is
 * built, so renaming a category never leaves stale copies behind.
 */
const customServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // The catalog identity — what leads, tasks and step templates key on.
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    categorySlug: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const CustomService = mongoose.model("CustomService", customServiceSchema);

export default CustomService;
