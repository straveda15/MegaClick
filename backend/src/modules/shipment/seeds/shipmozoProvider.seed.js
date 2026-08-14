/**
 * Seed script for Shipmozo Shipping Provider.
 *
 * This script is idempotent:
 * - Creates the Shipmozo provider if it doesn't exist.
 * - Updates config and isActive if it already exists.
 * - DOES NOT overwrite the 'priority' field if it already exists (Admin-controlled).
 *
 * Usage:
 *   node src/modules/shipment/seeds/shipmozoProvider.seed.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import ShippingProvider from "../models/shippingProvider.model.js";

async function seedShipmozo() {
  console.log("🚀 [SEED] Starting Shipmozo provider seeding...");

  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Prepare Config from Environment
    const config = {
      apiBaseUrl: process.env.SHIPMOZO_API_BASE_URL,
      publicKey: process.env.SHIPMOZO_PUBLIC_KEY,
      privateKey: process.env.SHIPMOZO_PRIVATE_KEY,
      webhookSecret: process.env.SHIPMOZO_WEBHOOK_SECRET || "",
      // Optional defaults
      timeout: parseInt(process.env.SHIPMOZO_TIMEOUT || "15000", 10),
      retries: parseInt(process.env.SHIPMOZO_RETRIES || "3", 10),
    };

    // 3. Basic Validation
    if (!config.apiBaseUrl || !config.publicKey || !config.privateKey) {
      console.error("❌ [SEED] Error: Missing required environment variables.");
      console.error("   Required: SHIPMOZO_API_BASE_URL, SHIPMOZO_PUBLIC_KEY, SHIPMOZO_PRIVATE_KEY");
      process.exit(1);
    }

    const providerName = "shipmozo";
    const isActive = process.env.SHIPMOZO_IS_ACTIVE !== "false"; // Default true unless explicitly 'false'

    // 4. Upsert with Priority Protection
    // $set: Updates these fields on every run
    // $setOnInsert: Only sets these if creating a NEW document
    const update = {
      $set: {
        displayName: "Shipmozo",
        isActive,
        config,
        supportedMethods: ["COD", "PREPAID"],
        isDeleted: false,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        name: providerName,
        priority: 1, // Default priority for new setup
        isFallback: false,
        fallbackPriority: 100,
        createdAt: new Date(),
      },
    };

    const options = {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    };

    const provider = await ShippingProvider.findOneAndUpdate(
      { name: providerName },
      update,
      options
    );

    console.log("✅ [SEED] Shipmozo provider synchronized successfully.");
    console.log(`   ID:       ${provider._id}`);
    console.log(`   Status:   ${provider.isActive ? "ACTIVE" : "INACTIVE"}`);
    console.log(`   Priority: ${provider.priority} (Preserved existing)`);
    console.log(`   Base URL: ${provider.config.apiBaseUrl}`);

  } catch (error) {
    console.error("💥 [SEED] Critical failure during seeding:");
    console.error(error);
    process.exit(1);
  } finally {
    // 5. Cleanup
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("🔌 [SEED] Database connection closed.");
    }
    process.exit(0);
  }
}

// Check if running directly
if (import.meta.url.endsWith(process.argv[1]) || (process.argv[1] && process.argv[1].endsWith('shipmozoProvider.seed.js'))) {
  seedShipmozo();
}

export default seedShipmozo;
