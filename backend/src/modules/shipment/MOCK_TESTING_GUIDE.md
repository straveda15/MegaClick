# Shipment Mock Testing Guide

This guide provides instructions on how to use the newly implemented mock testing capabilities for the Everlive Shipment Module to safely simulate real-world logistics scenarios without triggering live external APIs (like Shipmozo or India Post).

## 1. 🚀 Enable Mock Mode

The system is configured to dynamically bypass all external shipment providers (and MongoDB provider routing) if `SHIPMENT_MODE` is present in your environment config.

Add the following environment variable to your root `.env` file:
```env
SHIPMENT_MODE=mock
```

*Note: You must restart your Node.js server after modifying the `.env` file.*

## 2. 🧪 Testing the APIs

Once you boot the server, all traffic to the shipment module will intercept, and you should see `⚠ [ProviderFactory] SHIPMENT_MODE=mock active` logs in the console.

### Step 1: Create a Mock Shipment
To trigger the mock provider directly during development:
```http
POST /api/v1/shipment/create/:orderId
```
**Expected Outcome:**
* A shipment will be instantiated locally and saved to the database.
* The mock provider automatically generates a test Tracking ID (e.g., `MOCK-TRK-A1B2C3D4`) wrapped inside your typical provider response DTO.

### Step 2: Track the Shipment
```http
GET /api/v1/shipment/track/:trackingId
```
Pass the newly returned `trackingId` here. 

**Expected Outcome:**
* This will fetch the shipment and return a generic 200 OK `"IN_TRANSIT"` state with a historical tracking timeline bridging your local system and the mock data layer.

## 3. 🔁 Simulation Scenarios

The Mock Adapter (`mock.adapter.js`) now actively intercepts tracking keys to determine simulated responses. 

Since the `/shipment/track/` endpoint verifies the shipment exists in MongoDB *before* dispatching the request to the provider adapter, you can simulate realistic dynamic responses by **editing the tracking ID value directly in your database via MongoDB Compass**.

| Scenario To Test | DB Edit `trackingId` Entry To | Expected API Outcome via GET `/shipment/track/` |
| :--- | :--- | :--- |
| **Normal (In Transit)** | `MOCK-TRK-1234` *(Default)* | Yields `200 OK` — `status: "IN_TRANSIT"` with a 3-step historical timeline. |
| **Delivered** | `MOCK-TRK-1234_DELIVERED` | Yields `200 OK` — `status: "DELIVERED"`. Triggers the `Shipment.isDelivered = true` backend system patch over your local DB! |
| **Delivery Failed** | `MOCK-TRK-1234_FAIL` | Yields `200 OK` — `status: "FAILED"`. Allows trace and response validation for failed shipments bounding back down to order history. |
| **Delayed** | `MOCK-TRK-1234_DELAY` | Yields `200 OK` — `status: "DELAYED"`. Returns an altered simulated operational delay and timeline. |
| **Provider API Rejection**| `MOCK-TRK-1234_INVALID` | Yields `500 Server Error` – Forces the adapter to throw an exception to test error handling boundaries (simulates generic external provider timeouts or faults). |

---

> **Tip:** Ensure Mock mode is disabled (`SHIPMENT_MODE=`) before testing on a Staging or Production database setup!
