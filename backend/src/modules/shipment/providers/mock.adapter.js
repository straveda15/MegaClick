/**
 * Mock Adapter — deterministic mock provider for dev/testing.
 *
 * Returns predictable responses without making external HTTP calls.
 * Used automatically when no real provider is configured, or when
 * a provider named "mock" exists in the DB.
 */

import crypto from "crypto";
import { ShipmentProviderInterface } from "./provider.interface.js";

export class MockAdapter extends ShipmentProviderInterface {
  constructor(config = {}) {
    super("mock", config);
  }

  /* ── helpers ──────────────────────────────────────────────────────────── */

  _mockId(prefix = "MOCK") {
    return `${prefix}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  }

  _futureDate(days) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  /* ── interface methods ───────────────────────────────────────────────── */

  async createOrder(payload, _options = {}) {
    console.log(`  ⚠  [MockAdapter] createOrder — orderId: ${payload.orderId}`);
    const trackingId = this._mockId("TRK");
    return {
      providerOrderId: this._mockId("ORD"),
      trackingId,
      awbNumber: `AWB${trackingId}`,
      trackingUrl: `https://mock.track/${trackingId}`,
      status: "CREATED",
      statusCode: "SHP_CREATED",
      estimatedDelivery: this._futureDate(5),
      raw: { mock: true },
    };
  }

  async assignCourier(payload, _options = {}) {
    console.log(`  ⚠  [MockAdapter] assignCourier — ${payload.trackingId}`);
    return {
      courierName: "MockCourier Express",
      courierId: "MOCK_COURIER_001",
      awbNumber: payload.trackingId ? `AWB${payload.trackingId}` : this._mockId("AWB"),
      trackingUrl: `https://mock.track/${payload.trackingId}`,
      estimatedDelivery: this._futureDate(4),
      raw: { mock: true },
    };
  }

  async schedulePickup(payload, _options = {}) {
    console.log(`  ⚠  [MockAdapter] schedulePickup — ${payload.trackingId}`);
    return {
      pickupId: this._mockId("PU"),
      scheduledDate: payload.pickupDate || new Date().toISOString().slice(0, 10),
      scheduledTime: payload.pickupTime || "10:00-14:00",
      status: "SCHEDULED",
      raw: { mock: true },
    };
  }

  async cancelOrder(payload) {
    console.log(`  ⚠  [MockAdapter] cancelOrder — ${payload.trackingId}`);
    return {
      success: true,
      message: "Mock cancellation successful",
      raw: { mock: true },
    };
  }

  async trackOrder(payload) {
    const { trackingId } = payload;
    console.log(`  ⚠  [MockAdapter] trackOrder — ${trackingId}`);

    if (trackingId?.includes("FAIL")) {
      return {
        status: "FAILED",
        statusCode: "DELIVERY_FAILED",
        currentLocation: "Local Hub",
        estimatedDelivery: null,
        timeline: [
          { status: "FAILED", location: "Local Hub", description: "Delivery failed - Customer not reachable", timestamp: new Date() }
        ],
        raw: { mock: true, scenario: "failed" }
      };
    }

    if (trackingId?.includes("INVALID")) {
      throw new Error("Invalid AWB Number");
    }

    if (trackingId?.includes("DELAY")) {
      return {
        status: "DELAYED",
        statusCode: "TRANSIT_DELAY",
        currentLocation: "Transit Hub",
        estimatedDelivery: this._futureDate(7),
        timeline: [
          { status: "DELAYED", location: "Transit Hub", description: "Shipment delayed due to operational issues", timestamp: new Date() },
          { status: "IN_TRANSIT", location: "Origin Hub", description: "Package arrived at hub", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        ],
        raw: { mock: true, scenario: "delayed" }
      };
    }

    if (trackingId?.includes("DELIVERED")) {
      return {
        status: "DELIVERED",
        statusCode: "DELIVERED",
        currentLocation: "Destination",
        estimatedDelivery: new Date(),
        timeline: [
          { status: "DELIVERED", location: "Destination", description: "Package delivered to customer", timestamp: new Date() },
          { status: "OUT_FOR_DELIVERY", location: "Local Hub", description: "Out for delivery", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) }
        ],
        raw: { mock: true, scenario: "delivered" }
      };
    }

    // Default In-Transit
    return {
      status: "IN_TRANSIT",
      statusCode: "IN_TRANSIT",
      currentLocation: "Mumbai Hub",
      estimatedDelivery: this._futureDate(3),
      timeline: [
        {
          status: "IN_TRANSIT",
          location: "Mumbai Hub",
          description: "Package arrived at hub",
          timestamp: new Date(),
        },
        {
          status: "PICKED_UP",
          location: "Origin Facility",
          description: "Picked up from origin",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          status: "CREATED",
          location: "Warehouse",
          description: "Shipment created",
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
      ],
      raw: { mock: true, scenario: "in_transit" },
    };
  }

  async generateLabel(payload) {
    console.log(`  ⚠  [MockAdapter] generateLabel — ${payload.trackingId}`);
    return {
      labelUrl: `https://mock.labels/${payload.trackingId}.pdf`,
      format: payload.format || "pdf",
      raw: { mock: true },
    };
  }

  async calculateRates(payload) {
    console.log(
      `  ⚠  [MockAdapter] calculateRates — ${payload.originPincode} → ${payload.destinationPincode}`
    );
    return {
      rates: [
        {
          courierName: "MockCourier Standard",
          courierId: "MOCK_STD",
          estimatedDays: 5,
          charges: { freight: 45, cod: payload.paymentMode === "COD" ? 25 : 0, handling: 5, total: payload.paymentMode === "COD" ? 75 : 50 },
          isRecommended: true,
        },
        {
          courierName: "MockCourier Express",
          courierId: "MOCK_EXP",
          estimatedDays: 2,
          charges: { freight: 95, cod: payload.paymentMode === "COD" ? 25 : 0, handling: 10, total: payload.paymentMode === "COD" ? 130 : 105 },
          isRecommended: false,
        },
      ],
      raw: { mock: true },
    };
  }

  async checkServiceability(payload) {
    console.log(
      `  ⚠  [MockAdapter] checkServiceability — ${payload.originPincode} → ${payload.destinationPincode}`
    );

    // Simulate non-serviceable for pincodes starting with "000"
    const isServiceable = !payload.destinationPincode?.startsWith("000");

    return {
      serviceable: isServiceable,
      availableCouriers: isServiceable
        ? [
            {
              courierName: "MockCourier Standard",
              courierId: "MOCK_STD",
              codAvailable: true,
              prepaidAvailable: true,
              estimatedDays: 5,
            },
            {
              courierName: "MockCourier Express",
              courierId: "MOCK_EXP",
              codAvailable: false,
              prepaidAvailable: true,
              estimatedDays: 2,
            },
          ]
        : [],
      raw: { mock: true },
    };
  }
}
