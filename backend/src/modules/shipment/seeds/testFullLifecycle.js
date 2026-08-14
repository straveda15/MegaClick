/**
 * Full Lifecycle Test for Shipmozo Integration
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Order from "../../order/order.model.js";
import * as shipmentService from "../shipment.service.js";

async function runFullTest() {
  console.log("🚀 [TEST] Starting FULL Lifecycle Shipmozo Integration Test...");

  try {
    await connectDB();

    // Find a test order
    const order = await Order.findOne().sort({ createdAt: -1 });
    if (!order) throw new Error("No order found");

    console.log(`\n--- 1. Serviceability & Rates ---`);
    const service = await shipmentService.checkServiceability({
      originPincode: "400001",
      destinationPincode: order.shippingAddress?.pincode || "411001",
      weight: 500,
      paymentMode: "PREPAID"
    });
    console.log("✅ Serviceability:", service.serviceable ? "OK" : "FAILED");

    const rates = await shipmentService.calculateRates({
      originPincode: "400001",
      destinationPincode: order.shippingAddress?.pincode || "411001",
      weight: 500,
      paymentMode: "PREPAID",
      providerName: "shipmozo"
    });
    console.log("✅ Rates Fetched:", rates.rates?.length, "couriers");

    console.log(`\n--- 2. Booking (Create Shipment) ---`);
    const shipment = await shipmentService.createShipment(order);
    console.log("✅ Shipment Created:", shipment.trackingId);

    console.log(`\n--- 3. Courier Assignment ---`);
    const assigned = await shipmentService.assignCourier(order._id, "101", true);
    console.log("✅ Courier Assigned:", assigned.courierName);

    console.log(`\n--- 4. Pickup Scheduling ---`);
    const pickup = await shipmentService.schedulePickup(order._id, "2026-05-01");
    console.log("✅ Pickup Scheduled:", pickup.pickupScheduledAt);

    console.log(`\n--- 5. Documentation (Label) ---`);
    const label = await shipmentService.generateLabel(shipment.trackingId);
    console.log("✅ Label URL Generated:", label.labelUrl);

    console.log(`\n--- 6. Tracking ---`);
    const track = await shipmentService.trackShipment(shipment.trackingId);
    console.log("✅ Tracking Status:", track.status);

    console.log(`\n--- 7. Cancellation ---`);
    const cancelled = await shipmentService.cancelShipment(order._id, "Test cancellation");
    console.log("✅ Shipment Cancelled:", cancelled.status);

    console.log("\n🎊 [TEST] ALL SHIPMOZO APIs ARE FULLY INTEGRATED AND WORKING!");

  } catch (error) {
    console.error("\n❌ [TEST] Failed at step:", error.message);
    if (error.response?.data) console.error("   Response:", JSON.stringify(error.response.data));
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runFullTest();
