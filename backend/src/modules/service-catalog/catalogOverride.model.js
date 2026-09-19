import mongoose from "mongoose";

/**
 * A dashboard-side edit to one of the built-in services in `servicesData.js`:
 * a new name, a different category, or the service hidden altogether.
 *
 * `servicesData.js` is shared with the public website, so it is never touched —
 * these overrides are applied on top of it when the dashboard's catalog is
 * built, which is what keeps every change here invisible to the website.
 */
const catalogOverrideSchema = new mongoose.Schema(
  {
    // The built-in service being overridden. Its slug never changes, so leads,
    // step templates and fees keep pointing at it through a rename.
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: { type: String, trim: true },
    categorySlug: { type: String, trim: true },
    deleted: { type: Boolean, default: false },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const CatalogOverride = mongoose.model("CatalogOverride", catalogOverrideSchema);

export default CatalogOverride;
