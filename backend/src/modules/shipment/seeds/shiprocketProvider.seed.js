/**
 * Seed script for Shiprocket Shipping Provider.
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import ShippingProvider from "../models/shippingProvider.model.js";

async function seedShiprocket() {
  console.log("🚀 [SEED] Starting Shiprocket provider seeding...");

  try {
    await connectDB();

    const config = {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
      pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
      baseURL: process.env.SHIPROCKET_BASE_URL || "https://apiv2.shiprocket.in",
    };

    // Validation
    if (!config.email || !config.password) {
      console.error("❌ [SEED] Error: Missing required environment variables.");
      console.error("   Required: SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD");
      process.exit(1);
    }

    const providerName = "shiprocket";
    const isActive = process.env.SHIPROCKET_IS_ACTIVE !== "false";

    const update = {
      $set: {
        displayName: "Shiprocket",
        isActive,
        config,
        supportedMethods: ["COD", "PREPAID"],
        isDeleted: false,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        name: providerName,
        priority: 2, // Default priority (Shipmozo is 1)
        isFallback: true,
        fallbackPriority: 1,
        createdAt: new Date(),
      },
    };

    const provider = await ShippingProvider.findOneAndUpdate(
      { name: providerName },
      update,
      { upsert: true, new: true, runValidators: true }
    );

    console.log("✅ [SEED] Shiprocket provider synchronized successfully.");
    console.log(`   ID:       ${provider._id}`);
    console.log(`   Status:   ${provider.isActive ? "ACTIVE" : "INACTIVE"}`);
    console.log(`   Priority: ${provider.priority}`);

  } catch (error) {
    console.error("💥 [SEED] Critical failure during seeding:", error.message);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(0);
  }
}

seedShiprocket();
