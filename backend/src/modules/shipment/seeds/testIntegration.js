/**
 * Live Integration Test for Shipmozo
 * Bypasses HTTP/Auth to test the service and adapter logic directly.
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Order from "../../order/order.model.js";
import { createShipment } from "../shipment.service.js";

async function runLiveTest() {
  console.log("🔍 [TEST] Starting Live Shipmozo Integration Test...");

  try {
    await connectDB();

    // 1. Check if mock mode is on
    if (process.env.SHIPMENT_MODE === "mock") {
      console.warn("⚠️  [TEST] Warning: SHIPMENT_MODE=mock is active in .env. Real API calls will be bypassed.");
    }

    // 2. Find a testable order
    // We'll look for an order that doesn't have a shipment yet
    const order = await Order.findOne().sort({ createdAt: -1 });

    if (!order) {
      console.error("❌ [TEST] No orders found in database. Please create an order first.");
      process.exit(1);
    }

    console.log(`📦 [TEST] Testing with Order: ${order.orderNumber} (ID: ${order._id})`);
    console.log(`📍 [TEST] Destination: ${order.shippingAddress?.pincode}, ${order.shippingAddress?.city}`);

    // 3. Trigger Shipment Creation
    console.log("📡 [TEST] Calling Shipmozo API via createShipment service...");
    
    // We'll wrap this in a timer to track performance
    const start = Date.now();
    const shipment = await createShipment(order);
    const duration = Date.now() - start;

    console.log("✅ [TEST] Success!");
    console.log(`   Tracking ID:   ${shipment.trackingId}`);
    console.log(`   AWB Number:    ${shipment.awbNumber}`);
    console.log(`   Provider:      ${shipment.provider}`);
    console.log(`   Status:        ${shipment.status}`);
    console.log(`   Response Time: ${duration}ms`);

  } catch (error) {
    console.error("💥 [TEST] Integration Failed!");
    
    if (error.response) {
      console.error("   HTTP Status:", error.response.status);
      console.error("   API Response:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("   Error Message:", error.message);
      if (error.details) console.error("   Details:", JSON.stringify(error.details, null, 2));
    }
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runLiveTest();
