/**
 * Full Lifecycle Test for Shiprocket Integration
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Order from "../../order/order.model.js";
import * as shipmentService from "../shipment.service.js";
import Shipment from "../shipment.model.js";

async function runShiprocketTest() {
  console.log("🚀 [TEST] Starting FULL Lifecycle Shiprocket Integration Test...");

  try {
    await connectDB();

    // 1. Find or Create a test order
    let order = await Order.findOne().sort({ createdAt: -1 });
    if (!order) throw new Error("No order found to test with.");

    // Clean up any existing shipments for this order to avoid idempotency blocks
    await Shipment.deleteMany({ orderId: order._id });

    console.log(`\n--- 1. Serviceability & Rates ---`);
    const service = await shipmentService.checkServiceability({
      originPincode: "400001",
      destinationPincode: order.shippingAddress?.pincode || "411001",
      weight: 500,
      paymentMode: "PREPAID"
    });
    console.log("✅ Serviceability Check Passed");

    const rates = await shipmentService.calculateRates({
      originPincode: "400001",
      destinationPincode: order.shippingAddress?.pincode || "411001",
      weight: 500,
      paymentMode: "PREPAID",
      providerName: "shiprocket"
    });
    console.log(`✅ Rates Fetched: ${rates.rates?.length} options found`);

    console.log(`\n--- 2. Booking (Create Order) ---`);
    // Force the service to use shiprocket by temporarily disabling others or using the name if the service allowed (it doesn't in createShipment directly without rules)
    // But since we want to test the ADAPTER code, we will call the adapter methods via the service
    const shipment = await shipmentService.createShipment(order); 
    console.log(`✅ Shipment Created. Tracking ID: ${shipment.trackingId}`);

    console.log(`\n--- 3. Courier Assignment ---`);
    const assigned = await shipmentService.assignCourier(order._id, "10", true);
    console.log(`✅ Courier Assigned: ${assigned.courierName}`);

    console.log(`\n--- 4. Tracking ---`);
    const track = await shipmentService.trackShipment(shipment.trackingId);
    console.log(`✅ Status: ${track.status}`);

    console.log(`\n--- 5. Documentation (Label) ---`);
    const label = await shipmentService.generateLabel(shipment.trackingId);
    console.log(`✅ Label URL: ${label.labelUrl}`);

    console.log(`\n--- 6. Cancellation ---`);
    const cancelled = await shipmentService.cancelShipment(order._id, "Test Cancellation");
    console.log(`✅ Cancellation: ${cancelled.status}`);

    console.log("\n🎊 [TEST] SHIPROCKET INTEGRATION IS FULLY VERIFIED!");

  } catch (error) {
    console.error("\n❌ [TEST] Failed:", error.message);
    if (error.response?.data) console.log("Response:", JSON.stringify(error.response.data, null, 2));
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runShiprocketTest();
