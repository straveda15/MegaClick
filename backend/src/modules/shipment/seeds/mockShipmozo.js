/**
 * Mock Shipmozo API Server (With Verbose Logging)
 */

import express from "express";

const app = express();
app.use(express.json());

const PORT = 5001;

// Global request logger
app.use((req, res, next) => {
  console.log(`📡 [MOCK-LOG] ${req.method} ${req.url}`);
  next();
});

// 1. Serviceability
app.post("/api/v1/serviceability/check", (req, res) => {
  res.json({ success: true, available_couriers: [{ courier_name: "Mock Express", courier_id: "101", etd: 3 }] });
});

// 2. Rates
app.all("/api/v1/rates/calculate", (req, res) => {
  res.json({ success: true, rates: [{ courier_name: "Mock Express", courier_id: "101", total_charge: 50 }] });
});

// 3. Create Order
app.post("/api/v1/orders/push", (req, res) => {
  res.json({ success: true, order_id: req.body.order_id, tracking_id: "MOCK-TRK-123", awb_number: "MOCK-AWB-123", status_code: "SHP_CREATED" });
});

// 4. Assign Courier
app.post("/api/v1/orders/assign-courier", (req, res) => {
  res.json({ success: true, courier_name: "Mock Express", awb_number: "MOCK-AWB-123-ASS", tracking_url: "http://track.me" });
});

// 5. Schedule Pickup
app.post("/api/v1/pickups/schedule", (req, res) => {
  res.json({ success: true, pickup_id: "P-123", scheduled_date: "2026-05-01", status: "SCHEDULED" });
});

// 6. Label
app.get("/api/v1/labels/:awb", (req, res) => {
  res.json({ success: true, label_url: "https://mock.cdn/label.pdf" });
});

// 7. Track
app.get("/api/v1/tracking/:awb", (req, res) => {
  res.json({ success: true, status: "SHIPPED", scans: [] });
});

// 8. Cancel
app.post("/api/v1/orders/cancel", (req, res) => {
  res.json({ success: true, message: "Order cancelled" });
});

// 9. Create Return
app.post("/api/v1/returns/create", (req, res) => {
  res.json({ success: true, order_id: req.body.order_id, tracking_id: "RET-TRK-123", awb_number: "RET-AWB-123" });
});

app.listen(PORT, () => {
  console.log(`✅ [MOCK-SHIPMOZO] Verbose server listening on http://localhost:${PORT}`);
});
