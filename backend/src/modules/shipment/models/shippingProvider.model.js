/**
 * ShippingProvider Model — DB-driven provider configuration.
 *
 * Each document represents one logistics provider (Shipmozo, IndiaPost, etc.).
 * Admin dashboard creates/updates these records.
 * ProviderFactory reads them to select the active adapter at runtime.
 *
 * Soft-delete via `isDeleted` flag — never hard-delete.
 */

import mongoose from "mongoose";

const shippingProviderSchema = new mongoose.Schema(
  {
    /** Machine name — must match a registered adapter key (e.g. "shipmozo", "indiapost") */
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    /** Human-friendly name for the admin dashboard */
    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    /** Whether this provider is currently usable */
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /** Selection priority — lower number = higher priority (1 = primary) */
    priority: {
      type: Number,
      default: 10,
    },

    /** Use as fallback when the primary provider fails */
    isFallback: {
      type: Boolean,
      default: false,
    },

    /** Deterministic fallback ordering â€” lower number = higher preference */
    fallbackPriority: {
      type: Number,
      default: 100,
    },

    /** Provider-specific credentials and config — stored as JSON */
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // Expected shape per provider:
      // {
      //   apiBaseUrl: "https://api.shipmozo.com",
      //   publicKey: "pk_xxx",
      //   privateKey: "sk_xxx",
      //   webhookSecret: "whsec_xxx",
      //   sandboxMode: false,
      //   customHeaders: {},
      // }
    },

    /** Payment methods this provider supports */
    supportedMethods: {
      type: [String],
      enum: ["COD", "PREPAID"],
      default: ["COD", "PREPAID"],
    },

    /** Soft-delete flag — NEVER hard-delete provider records */
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* ── Query helpers — always exclude soft-deleted by default ──────────────── */

shippingProviderSchema.pre(/^find/, function () {
  const filter = this.getFilter();
  const includeDeleted = this.getOptions().includeDeleted ?? filter.includeDeleted;

  delete filter.includeDeleted;
  if (includeDeleted !== true) {
    this.where({ isDeleted: false });
  }
});

/* ── Index for factory lookups ──────────────────────────────────────────── */

shippingProviderSchema.index({ isActive: 1, priority: 1 });
shippingProviderSchema.index({ isFallback: 1, fallbackPriority: 1, priority: 1 });

const ShippingProvider = mongoose.model(
  "ShippingProvider",
  shippingProviderSchema
);

export default ShippingProvider;
