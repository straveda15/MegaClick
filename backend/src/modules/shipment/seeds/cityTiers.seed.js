/**
 * City Tier Seed Script — idempotent (upsert by city name).
 *
 * Creates CityTier entries + their auto ShippingRules for a representative
 * set of Indian cities. Safe to re-run: existing entries are updated in place.
 *
 * Usage (standalone):
 *   node src/modules/shipment/seeds/cityTiers.seed.js
 *
 * Or from npm scripts in package.json:
 *   "seed:tiers": "node src/modules/shipment/seeds/cityTiers.seed.js"
 *
 * Requires: MongoDB running, MONGO_URI in environment.
 * Providers must already exist in the DB (insert via Compass or seed:providers first).
 */

import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";

// Load .env relative to the Backend root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../../config/.env") });

import CityTier from "../models/cityTier.model.js";
import ShippingProvider from "../models/shippingProvider.model.js";
import ShippingRule from "../models/shippingRule.model.js";
import { getPrefixesForCity } from "../utils/cityTier.js";
import { withTransaction } from "../../../shared/infrastructure/db.transaction.js";

/* ── Seed Data ───────────────────────────────────────────────────────────── */

/**
 * Each entry: { city, tier, providerName }
 * providerName must match ShippingProvider.name in the DB.
 *
 * Tier 1 — Shiprocket (fastest SLA, best metro coverage)
 * Tier 2 — Shipmozo   (good mid-tier coverage)
 * Tier 3 — India Post (widest rural last-mile reach)
 */
const SEED_DATA = [
  // Tier 1 — Major metros
  { city: "Mumbai",    tier: 1, providerName: "shiprocket" },
  { city: "Delhi",     tier: 1, providerName: "shiprocket" },
  { city: "Bangalore", tier: 1, providerName: "shiprocket" },
  { city: "Kolkata",   tier: 1, providerName: "shiprocket" },
  { city: "Pune",      tier: 1, providerName: "shiprocket" },
  { city: "Chennai",   tier: 1, providerName: "shiprocket" },
  { city: "Hyderabad", tier: 1, providerName: "shiprocket" },
  { city: "Ahmedabad", tier: 1, providerName: "shiprocket" },

  // Tier 2 — State capitals / large cities
  { city: "Nashik",    tier: 2, providerName: "shipmozo" },
  { city: "Nagpur",    tier: 2, providerName: "shipmozo" },
  { city: "Jaipur",    tier: 2, providerName: "shipmozo" },
  { city: "Lucknow",   tier: 2, providerName: "shipmozo" },
  { city: "Indore",    tier: 2, providerName: "shipmozo" },
  { city: "Bhopal",    tier: 2, providerName: "shipmozo" },
  { city: "Surat",     tier: 2, providerName: "shipmozo" },
  { city: "Patna",     tier: 2, providerName: "shipmozo" },
  { city: "Chandigarh",tier: 2, providerName: "shipmozo" },
  { city: "Kochi",     tier: 2, providerName: "shipmozo" },

  // Tier 3 — Semi-urban / district towns
  { city: "Satana",    tier: 3, providerName: "indiapost" },
  { city: "Malegaon",  tier: 3, providerName: "indiapost" },
  { city: "Latur",     tier: 3, providerName: "indiapost" },
  { city: "Nanded",    tier: 3, providerName: "indiapost" },
  { city: "Akola",     tier: 3, providerName: "indiapost" },
  { city: "Amravati",  tier: 3, providerName: "indiapost" },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const AUTO_RULE_BASE = 100;
const AUTO_RULE_STEP = 33;

function buildPriority(tier) { return AUTO_RULE_BASE + (tier - 1) * AUTO_RULE_STEP; }
function buildRuleName(tier, city) { return `City Tier ${tier} — ${city}`; }

/* ── Seed Runner ─────────────────────────────────────────────────────────── */

async function seedCityTiers() {
  const uri = process.env.MONGO_URI || process.env.LOCAL_MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set in environment.");

  await mongoose.connect(uri);
  console.log("✔  Connected to MongoDB");

  // Build provider name → doc map
  const providers = await ShippingProvider.find();
  const providerMap = new Map(providers.map((p) => [p.name, p]));

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const entry of SEED_DATA) {
    const { city, tier, providerName } = entry;
    const provider = providerMap.get(providerName);

    if (!provider) {
      console.warn(`  ⚠  Provider "${providerName}" not found — skipping ${city}`);
      skipped++;
      continue;
    }

    const pincodes = getPrefixesForCity(city);
    if (pincodes.length === 0) {
      console.warn(`  ⚠  No pincode prefixes found for "${city}" — skipping`);
      skipped++;
      continue;
    }

    const ruleName = buildRuleName(tier, city);
    const rulePriority = buildPriority(tier);

    try {
      const existing = await CityTier.findOne(
        { city },
        {},
        { collation: { locale: "en", strength: 2 } }
      );

      if (existing) {
        // Update in place
        await withTransaction(async (session) => {
          if (existing.autoRuleId) {
            await ShippingRule.findByIdAndUpdate(
              existing.autoRuleId,
              {
                $set: {
                  providerId: provider._id,
                  ruleName,
                  "conditions.pincodes": pincodes,
                  priority: rulePriority,
                },
              },
              { session }
            );
          } else {
            const [rule] = await ShippingRule.create(
              [{ providerId: provider._id, ruleName, conditions: { pincodes }, priority: rulePriority, source: "city_tier", isActive: true }],
              { session }
            );
            existing.autoRuleId = rule._id;
          }
          existing.tier = tier;
          existing.defaultProvider = provider._id;
          await existing.save({ session });
        });
        console.log(`  ✏  Updated  : ${city} (Tier ${tier} → ${providerName})`);
        updated++;
      } else {
        // Create new
        await withTransaction(async (session) => {
          const [tierDoc] = await CityTier.create(
            [{ city, tier, defaultProvider: provider._id, createdBy: null }],
            { session }
          );
          const [rule] = await ShippingRule.create(
            [{ providerId: provider._id, ruleName, conditions: { pincodes }, priority: rulePriority, source: "city_tier", isActive: true }],
            { session }
          );
          tierDoc.autoRuleId = rule._id;
          await tierDoc.save({ session });
        });
        console.log(`  ✔  Created  : ${city} (Tier ${tier} → ${providerName}, pincodes: [${pincodes.join(",")}])`);
        created++;
      }
    } catch (err) {
      console.error(`  ✖  Failed   : ${city} — ${err.message}`);
    }
  }

  console.log(`\nSeed complete — Created: ${created}  Updated: ${updated}  Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seedCityTiers().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
