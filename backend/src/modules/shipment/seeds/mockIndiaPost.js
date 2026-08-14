/**
 * Mock India Post API Server
 * Runs on port 5003.
 */

import express from "express";

const app = express();
app.use(express.json());

const PORT = 5003;

// 1. Tracking (Public API)
app.post("/api/dop-site/track-consignment/consumer", (req, res) => {
  res.json({
    track_info: [
      { event: "Item Delivered", event_location: "Mumbai GPO", event_date: "2026-05-01", event_time: "10:00:00" },
      { event: "Out for Delivery", event_location: "Mumbai GPO", event_date: "2026-05-01", event_time: "08:00:00" },
      { event: "Item Booked", event_location: "Delhi GPO", event_date: "2026-04-28", event_time: "14:00:00" }
    ]
  });
});

// 2. Booking (Partner API)
app.post("/api/booking/create", (req, res) => {
  res.json({
    status: "BOOKED",
    booking_id: "IP" + Date.now(),
    article_number: "EN" + Math.floor(100000000 + Math.random() * 900000000) + "IN",
    expected_delivery_date: "2026-05-05"
  });
});

// 3. Pickup Schedule
app.post("/api/pickup/schedule", (req, res) => {
  res.json({
    status: "SCHEDULED",
    pickup_request_id: "REQ-" + Math.random().toString(36).substring(7).toUpperCase(),
    pickup_time: "09:00-13:00"
  });
});

// 4. Label Generate
app.post("/api/label/generate", (req, res) => {
  res.json({
    label_url: "https://indiapost.mock/label/EN123456789IN.pdf",
    format: "pdf"
  });
});

// 5. Cancel Booking
app.post("/api/booking/cancel", (req, res) => {
  res.json({
    success: true,
    message: "Cancellation request submitted"
  });
});

app.listen(PORT, () => {
  console.log(`✅ [MOCK-INDIAPOST] Server listening on http://localhost:${PORT}`);
});
