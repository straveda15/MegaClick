/**
 * Production-grade seed script for India Post
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import ShippingProvider from "../models/shippingProvider.model.js";

const indiaPostConfig = {
  name: "indiapost",
  displayName: "India Post (Speed Post)",
  description: "Government-backed postal service with 100% pincode coverage.",
  isActive: true,
  priority: 5, // Usually used for rural fallback
  isFallback: true,
  fallbackPriority: 1,
  config: {
    apiKey: "MOCK-API-KEY-IP",
    customerId: "CUST-IP-123",
    apiBaseUrl: "http://localhost:5003/api", trackingBaseUrl: "http://localhost:5003", // Point to mock server
    originPincode: "400001",
    webhookSecret: "mock_secret_ip"
  }
};

async function seedIndiaPost() {
  console.log("🚀 [SEED] Starting India Post provider seeding...");
  try {
    await connectDB();
    const result = await ShippingProvider.findOneAndUpdate(
      { name: "indiapost" },
      indiaPostConfig,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✅ [SEED] India Post provider synchronized successfully.`);
    console.log(`   ID:       ${result._id}`);
    console.log(`   Priority: ${result.priority}`);
  } catch (error) {
    console.error("❌ [SEED] Failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

seedIndiaPost();
