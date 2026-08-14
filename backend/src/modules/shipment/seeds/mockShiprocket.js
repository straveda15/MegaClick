/**
 * Mock Shiprocket API Server
 * Runs on port 5002.
 */

import express from "express";

const app = express();
app.use(express.json());

const PORT = 5002;

// 1. Auth Login
app.post("/auth/login", (req, res) => {
  res.json({ token: "MOCK-JWT-TOKEN-SHIPROCKET" });
});

// 2. Create Order
app.post("/orders/create/adhoc", (req, res) => {
  res.json({
    status: 1,
    order_id: 200001,
    shipment_id: 300001,
    awb_code: "SR-AWB-12345",
    status_code: 1
  });
});

// 3. Serviceability & Rates
app.get("/courier/serviceability", (req, res) => {
  res.json({
    status: 200,
    data: {
      available_courier_companies: [
        { courier_name: "SR-Express", courier_company_id: "10", rate: 45, etd: "3 days" }
      ]
    }
  });
});

// 4. Assign AWB
app.post("/courier/assign/awb", (req, res) => {
  res.json({ status: 200, response: { data: { awb_code: "SR-AWB-12345-ASS" } } });
});

// 5. Generate Label
app.post("/courier/generate/label", (req, res) => {
  res.json({ label_url: "https://shiprocket.mock/label.pdf" });
});

// 6. Track
app.get("/courier/track/awb/:awb", (req, res) => {
  res.json({
    tracking_data: {
      shipment_track: [{ current_status: "DELIVERED", origin: "Delhi", edd: "2026-05-05" }],
      shipment_track_activities: [{ activity: "Delivered", location: "Mumbai", date: "2026-05-01" }]
    }
  });
});

// 7. Cancel Order
app.post("/orders/cancel", (req, res) => {
  res.json({ success: true, message: "Order cancelled successfully" });
});

// 8. Create Return Order
app.post("/orders/create/return", (req, res) => {
  res.json({
    status: 1,
    order_id: 200001,
    shipment_id: 300001,
    awb_code: "SR-RET-12345",
  });
});

app.listen(PORT, () => {
  console.log(`✅ [MOCK-SHIPROCKET] Full suite server listening on http://localhost:${PORT}`);
});
