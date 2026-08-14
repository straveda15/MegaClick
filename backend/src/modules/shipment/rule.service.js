/**
 * ShippingRule Service — CRUD for manually created rules only.
 *
 * Rules with source "city_tier" are managed exclusively by the CityTierService.
 * Attempting to edit or delete them via this service returns 403.
 */

import ShippingRule from "./models/shippingRule.model.js";
import ShippingProvider from "./models/shippingProvider.model.js";
import AppError from "../../shared/utils/appError.js";

export async function listRules() {
  return ShippingRule.find()
    .populate("providerId", "name displayName isActive")
    .sort({ priority: 1 });
}

export async function createRule(data) {
  const provider = await ShippingProvider.findById(data.providerId);
  if (!provider) throw new AppError("Provider not found.", 404);

  return ShippingRule.create({ ...data, source: "manual" });
}

export async function updateRule(id, data) {
  const rule = await ShippingRule.findById(id);
  if (!rule) throw new AppError("Shipping rule not found.", 404);

  if (rule.source === "city_tier") {
    throw new AppError(
      "This rule is auto-managed by a City Tier entry. Edit it via PATCH /v1/shipment/tiers/:id instead.",
      403
    );
  }

  if (data.providerId) {
    const provider = await ShippingProvider.findById(data.providerId);
    if (!provider) throw new AppError("Provider not found.", 404);
  }

  // Enforce manual rules stay in 1–99 priority range
  if (data.priority !== undefined && (data.priority < 1 || data.priority > 99)) {
    throw new AppError("Manual rule priority must be between 1 and 99. Range 100–199 is reserved for city tier auto-rules.", 400);
  }

  return ShippingRule.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
}

export async function deleteRule(id) {
  const rule = await ShippingRule.findById(id);
  if (!rule) throw new AppError("Shipping rule not found.", 404);

  if (rule.source === "city_tier") {
    throw new AppError(
      "This rule is auto-managed by a City Tier entry. Delete it via DELETE /v1/shipment/tiers/:id instead.",
      403
    );
  }

  await ShippingRule.findByIdAndDelete(id);
}
