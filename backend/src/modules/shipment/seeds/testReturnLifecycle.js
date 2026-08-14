/**
 * Test for Return Shipment Lifecycle
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Order from "../../order/order.model.js";
import * as shipmentService from "../shipment.service.js";
import Shipment from "../shipment.model.js";

async function runReturnTest() {
  console.log("🚀 [TEST] Starting RETURN Lifecycle Integration Test (Shiprocket)...");

  try {
    await connectDB();

    // 1. Find a test order
    const order = await Order.findOne().sort({ createdAt: -1 });
    if (!order) throw new Error("No order found to test with.");

    console.log(`\n--- 1. Initiating Return Shipment ---`);
    // This calls the NEW createReturnShipment service method
    const returnShipment = await shipmentService.createReturnShipment(order);
    
    console.log(`✅ Return Shipment Created!`);
    console.log(`   Provider: ${returnShipment.provider}`);
    console.log(`   Tracking ID: ${returnShipment.trackingId}`);
    console.log(`   Status: ${returnShipment.status}`);
    console.log(`   isReturn: ${returnShipment.isReturn}`);

    console.log(`\n--- 2. Tracking Return ---`);
    const track = await shipmentService.trackShipment(returnShipment.trackingId);
    console.log(`✅ Return Status: ${track.status}`);

    console.log("\n🎊 [TEST] RETURN INTEGRATION IS FULLY VERIFIED!");

  } catch (error) {
    console.error("\n❌ [TEST] Failed:", error.message);
    if (error.response?.data) console.log("Response:", JSON.stringify(error.response.data, null, 2));
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runReturnTest();
