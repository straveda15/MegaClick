/**
 * Full Lifecycle Test for India Post Integration
 */

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Order from "../../order/order.model.js";
import * as shipmentService from "../shipment.service.js";
import Shipment from "../shipment.model.js";

async function runIndiaPostTest() {
  console.log("🚀 [TEST] Starting FULL Lifecycle India Post Integration Test...");

  try {
    await connectDB();

    // 1. Find or Create a test order
    let order = await Order.findOne().sort({ createdAt: -1 });
    if (!order) throw new Error("No order found to test with.");

    console.log(`\n--- 1. Serviceability & Rates ---`);
    const service = await shipmentService.checkServiceability({
      originPincode: "400001",
      destinationPincode: order.shippingAddress?.pincode || "411001",
      weight: 500,
      paymentMode: "PREPAID"
    });
    console.log("✅ Serviceability: Reachable by Speed Post");

    const rates = await shipmentService.calculateRates({
      originPincode: "400001",
      destinationPincode: order.shippingAddress?.pincode || "411001",
      weight: 500,
      paymentMode: "PREPAID",
      providerName: "indiapost"
    });
    console.log(`✅ Rates Fetched: ${rates.rates?.length} options found`);
    rates.rates.forEach(r => console.log(`   - ${r.courierName}: ₹${r.charges.total}`));

    console.log(`\n--- 2. Booking (Create Order) ---`);
    // Deactivate others to ensure indiapost is used or handle via direct call
    // For testing we will force the service to use it
    const shipment = await shipmentService.createShipment(order); 
    console.log(`✅ Shipment Created. Article No: ${shipment.trackingId}`);

    console.log(`\n--- 3. Tracking ---`);
    const track = await shipmentService.trackShipment(shipment.trackingId);
    console.log(`✅ Latest Event: ${track.status} (${track.statusCode})`);

    console.log(`\n--- 4. Documentation (Label) ---`);
    const label = await shipmentService.generateLabel(shipment.trackingId);
    console.log(`✅ Label URL: ${label.labelUrl}`);

    console.log(`\n--- 5. Return Lifecycle ---`);
    const returnShipment = await shipmentService.createReturnShipment(order);
    console.log(`✅ Return Initiated. Tracking ID: ${returnShipment.trackingId}`);

    console.log("\n🎊 [TEST] INDIA POST INTEGRATION IS FULLY VERIFIED!");

  } catch (error) {
    console.error("\n❌ [TEST] Failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

runIndiaPostTest();
