/**
 * CityTier Service — manages city-to-tier assignments and their auto-generated ShippingRules.
 *
 * Every mutating operation (create, update, delete) wraps CityTier + ShippingRule
 * changes inside withTransaction() so both succeed or neither persists.
 *
 * Factory logic is NOT touched — auto-rules are just ordinary ShippingRule documents
 * (source: "city_tier") that the existing evaluateRules() already knows how to read.
 */

import CityTier from "./models/cityTier.model.js";
import ShippingRule from "./models/shippingRule.model.js";
import ShippingProvider from "./models/shippingProvider.model.js";
import AppError from "../../shared/utils/appError.js";
import { withTransaction } from "../../shared/infrastructure/db.transaction.js";
import {
  getPrefixesForCity,
  isKnownCity,
  searchCityNames,
} from "./utils/cityTier.js";

/* ── Dynamic pincode lookup (free India Post API) ────────────────────────── */

/**
 * Queries the free India Post API for a city name and extracts all unique
 * 3-digit pincode prefixes from the returned post-office list.
 *
 * Returns an empty array when:
 *   - The city is genuinely unknown ("Error" status from the API)
 *   - The network request times out (5-second guard)
 *   - Any unexpected error occurs (fail-silent so the caller can fall back)
 *
 * @param {string} city
 * @returns {Promise<string[]>} sorted unique 3-digit prefixes, e.g. ["400", "421"]
 */
async function fetchPincodePrefixesFromApi(city) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `https://api.postalpincode.in/postoffice/${encodeURIComponent(city)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) return [];

    const json = await res.json();
    // API wraps results in an array; first element has { Status, PostOffice[] }
    const block = Array.isArray(json) ? json[0] : null;
    if (!block || block.Status !== "Success" || !Array.isArray(block.PostOffice)) {
      return [];
    }

    const prefixSet = new Set();
    for (const office of block.PostOffice) {
      const pin = String(office.Pincode || "").trim();
      if (pin.length === 6) prefixSet.add(pin.slice(0, 3));
    }

    return [...prefixSet].sort();
  } catch {
    // AbortError (timeout) or network failure — fail silently
    return [];
  }
}

/* ── Constants ───────────────────────────────────────────────────────────── */

// Auto-rules live in 100–199 so manually written rules (1–99) always win.
// Within that range: Tier 1 = 100, Tier 2 = 133, Tier 3 = 166.
const AUTO_RULE_BASE_PRIORITY = 100;
const AUTO_RULE_TIER_STEP = 33;

const TIER_COLORS = { 1: "blue", 2: "yellow", 3: "green" };

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function deriveColor(tier) {
  return TIER_COLORS[tier] || "green";
}

function buildAutoRulePriority(tier) {
  return AUTO_RULE_BASE_PRIORITY + (tier - 1) * AUTO_RULE_TIER_STEP;
}

function buildAutoRuleName(tier, city) {
  return `City Tier ${tier} — ${city}`;
}

function enrichTier(tierDoc) {
  const obj = tierDoc.toObject ? tierDoc.toObject() : { ...tierDoc };
  obj.color = deriveColor(obj.tier);
  return obj;
}

/* ── List ────────────────────────────────────────────────────────────────── */

export async function listCityTiers() {
  const tiers = await CityTier.find()
    .populate("defaultProvider", "name displayName isActive")
    .populate("autoRuleId", "ruleName priority isActive")
    .sort({ tier: 1, city: 1 });
  return tiers.map(enrichTier);
}

/* ── Create ──────────────────────────────────────────────────────────────── */

export async function createCityTier(data, userId) {
  const { city, tier, defaultProvider: providerId, pincodes: manualPincodes = [] } = data;

  // Verify provider exists
  const provider = await ShippingProvider.findById(providerId);
  if (!provider) throw new AppError("Provider not found.", 404);

  // Resolve pincode prefixes — priority: manual override → static map → live API
  let pincodes = manualPincodes.length > 0
    ? manualPincodes
    : getPrefixesForCity(city);

  if (pincodes.length === 0 && !isKnownCity(city)) {
    // Attempt a live lookup via the free India Post API before giving up
    pincodes = await fetchPincodePrefixesFromApi(city);
  }

  if (pincodes.length === 0) {
    throw new AppError(
      `City "${city}" is not in known map. Supply the "pincodes" array manually (e.g. ["422","423"]) to create a rule for this city.`,
      400
    );
  }

  const ruleName = buildAutoRuleName(tier, city);
  const rulePriority = buildAutoRulePriority(tier);

  const result = await withTransaction(async (session) => {
    // Create CityTier (autoRuleId set after rule creation)
    const [tierDoc] = await CityTier.create(
      [{ city, tier, defaultProvider: providerId, createdBy: userId }],
      { session }
    );

    // Create the auto ShippingRule
    const [rule] = await ShippingRule.create(
      [{
        providerId,
        ruleName,
        conditions: { pincodes },
        priority: rulePriority,
        source: "city_tier",
        isActive: true,
      }],
      { session }
    );

    // Back-link the rule onto the tier
    tierDoc.autoRuleId = rule._id;
    await tierDoc.save({ session });

    return { tier: tierDoc, rule };
  });

  return enrichTier(result.tier);
}

/* ── Update ──────────────────────────────────────────────────────────────── */

export async function updateCityTier(id, data, userId) {
  const existing = await CityTier.findById(id);
  if (!existing) throw new AppError("City tier entry not found.", 404);

  const newTier = data.tier ?? existing.tier;
  const newProviderId = data.defaultProvider ?? existing.defaultProvider;
  const city = existing.city;

  // Reuse the existing rule's pincodes when no new ones are supplied, so a plain
  // edit (tier/provider only) doesn't re-resolve a city that isn't in the static
  // map (e.g. cities added via the pincode flow) and fail.
  // Priority: manual override → existing rule pincodes → static map → live API.
  const existingRule = existing.autoRuleId
    ? await ShippingRule.findById(existing.autoRuleId).select("conditions.pincodes")
    : null;
  const existingPincodes = existingRule?.conditions?.pincodes || [];

  let pincodes = (data.pincodes && data.pincodes.length > 0)
    ? data.pincodes
    : (existingPincodes.length > 0 ? existingPincodes : getPrefixesForCity(city));

  if (pincodes.length === 0) {
    pincodes = await fetchPincodePrefixesFromApi(city);
  }

  if (pincodes.length === 0) {
    throw new AppError(
      `City "${city}" is not in known map. Supply the "pincodes" array manually (e.g. ["422","423"]) to create a rule for this city.`,
      400
    );
  }

  if (newProviderId.toString() !== existing.defaultProvider.toString()) {
    const provider = await ShippingProvider.findById(newProviderId);
    if (!provider) throw new AppError("Provider not found.", 404);
  }

  const ruleName = buildAutoRuleName(newTier, city);
  const rulePriority = buildAutoRulePriority(newTier);

  const result = await withTransaction(async (session) => {
    // Update or create the auto-rule
    let rule;
    if (existing.autoRuleId) {
      rule = await ShippingRule.findByIdAndUpdate(
        existing.autoRuleId,
        {
          $set: {
            providerId: newProviderId,
            ruleName,
            "conditions.pincodes": pincodes,
            priority: rulePriority,
          },
        },
        { new: true, session }
      );
    }

    // autoRuleId was null (edge case) — create fresh rule
    if (!rule) {
      const [created] = await ShippingRule.create(
        [{
          providerId: newProviderId,
          ruleName,
          conditions: { pincodes },
          priority: rulePriority,
          source: "city_tier",
          isActive: true,
        }],
        { session }
      );
      rule = created;
    }

    existing.tier = newTier;
    existing.defaultProvider = newProviderId;
    existing.autoRuleId = rule._id;
    existing.updatedBy = userId;
    await existing.save({ session });

    return { tier: existing, rule };
  });

  return enrichTier(result.tier);
}

/* ── Delete ──────────────────────────────────────────────────────────────── */

export async function deleteCityTier(id) {
  const existing = await CityTier.findById(id);
  if (!existing) throw new AppError("City tier entry not found.", 404);

  await withTransaction(async (session) => {
    if (existing.autoRuleId) {
      await ShippingRule.findByIdAndDelete(existing.autoRuleId, { session });
    }
    await CityTier.findByIdAndDelete(id, { session });
  });
}

/* ── City search (typeahead) ─────────────────────────────────────────────── */

export async function searchCities(q) {
  return searchCityNames(q);
}
