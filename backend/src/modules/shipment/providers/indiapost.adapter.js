/**
 * India Post Adapter — production implementation of ShipmentProviderInterface.
 */

import { createHttpClient } from "../utils/httpClient.js";
import { ShipmentProviderInterface } from "./provider.interface.js";
import { ShipmentProviderError, ShipmentConfigError } from "../utils/shipmentErrors.js";

// Default public tracking endpoint
const DEFAULT_TRACKING_URL = "https://www.indiapost.gov.in";
const DEFAULT_BOOKING_BASE_URL = "https://dopecomm.gov.in/api";

// ── India Post Speed Post rate slabs (domestic, 2024) ─────────────────────────
const SPEED_POST_BASE = [
  [50,    35,  40,  60],
  [100,   35,  43,  65],
  [200,   38,  47,  72],
  [500,   45,  55,  80],
  [1000,  57,  70,  100],
  [2000,  75,  95,  130],
  [5000,  120, 150, 200],
];

const ORDINARY_POST_BASE = [
  [20,    5,   8,   10],
  [50,    7,   10,  13],
  [100,   10,  14,  18],
  [250,   15,  20,  26],
  [500,   22,  28,  36],
  [1000,  35,  45,  55],
  [2000,  55,  70,  85],
  [5000,  90,  115, 140],
];

const COD_CHARGES = 35;
const HANDLING_FEE = 10;

function calcRate(slabs, weightG, zone = "national") {
  const col = zone === "local" ? 1 : zone === "state" ? 2 : 3;
  for (const [maxW, local, state, national] of slabs) {
    if (weightG <= maxW) {
      return [local, state, national][col - 1];
    }
  }
  const extra = Math.ceil((weightG - 5000) / 1000) * 40;
  return slabs[slabs.length - 1][col] + extra;
}

function detectZone(originPincode, destPincode) {
  if (!originPincode || !destPincode) return "national";
  const o = String(originPincode).slice(0, 3);
  const d = String(destPincode).slice(0, 3);
  if (o === d) return "local";
  if (o.slice(0, 2) === d.slice(0, 2)) return "state";
  return "national";
}

export class IndiaPostAdapter extends ShipmentProviderInterface {
  constructor(config = {}) {
    super("indiapost", config);

    // Tracking client - uses config.trackingBaseUrl if provided (for mocking)
    this._trackingClient = createHttpClient({
      baseURL: config.trackingBaseUrl || DEFAULT_TRACKING_URL,
      headers: { Referer: "https://www.indiapost.gov.in/" },
      timeout: 15_000,
      retries: 2,
    });

    // Booking client
    if (config.apiKey) {
      this._bookingClient = createHttpClient({
        baseURL: config.apiBaseUrl || DEFAULT_BOOKING_BASE_URL,
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "X-Customer-ID": config.customerId || "",
        },
        timeout: 20_000,
        retries: 3,
      });
    }
    this._originPincode = config.originPincode || null;
  }

  /* ── helpers ───────────────────────────────────────────────────────────── */

  _requireBookingClient(method) {
    if (!this._bookingClient) {
      throw new ShipmentConfigError(
        `India Post ${method}: booking API not configured.`,
        { provider: "indiapost", method }
      );
    }
  }

  _handleError(method, error) {
    if (error instanceof ShipmentProviderError || error instanceof ShipmentConfigError) {
      throw error;
    }
    const status = error.response?.status;
    const body = error.response?.data || error.message;
    throw new ShipmentProviderError(
      `India Post ${method} failed (${status || "NETWORK"})`,
      {
        httpStatus: status && status >= 400 ? status : 502,
        provider: "indiapost",
        method,
        response: body,
      }
    );
  }

  /* ── createOrder ─────────────────────────────────────────────────────── */

  async createOrder(payload, { idempotencyKey = null } = {}) {
    this._requireBookingClient("createOrder");
    try {
      const c = payload.consignee || {};
      const body = {
        customer_id: this.config.customerId,
        consignee: {
          name: c.name,
          address: [c.addressLine1, c.addressLine2].filter(Boolean).join(", "),
          city: c.city,
          state: c.state,
          pincode: c.pincode,
          phone: c.phone,
          country: c.country || "India",
        },
        payment_mode: payload.paymentMode === "COD" ? "COD" : "PREPAID",
        declared_value: payload.totalAmount || 0,
        weight_grams: payload.weight || 0,
        reference_number: payload.orderId,
      };

      const { data } = await this._bookingClient.post("/booking/create", body, {
        idempotencyKey,
      });

      const articleNo = data.article_number || data.tracking_number || data.booking_id || "";
      return {
        providerOrderId: String(data.booking_id || articleNo),
        trackingId: articleNo,
        awbNumber: articleNo,
        trackingUrl: `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?Barcode=${encodeURIComponent(articleNo)}`,
        status: "CREATED",
        statusCode: data.status || "BOOKED",
        estimatedDelivery: data.expected_delivery_date ? new Date(data.expected_delivery_date) : null,
        raw: data,
      };
    } catch (err) {
      this._handleError("createOrder", err);
    }
  }

  /* ── assignCourier ───────────────────────────────────────────────────── */

  async assignCourier(payload) {
    return {
      courierName: "India Post Speed Post",
      courierId: "IP_SPEED",
      awbNumber: payload.trackingId || payload.providerOrderId,
      trackingUrl: "",
      estimatedDelivery: null,
      raw: {},
    };
  }

  /* ── schedulePickup ──────────────────────────────────────────────────── */

  async schedulePickup(payload, { idempotencyKey = null } = {}) {
    this._requireBookingClient("schedulePickup");
    try {
      const body = {
        article_number: payload.providerOrderId,
        pickup_date: payload.pickupDate,
        pickup_time: payload.pickupTime || "09:00-13:00",
      };

      const { data } = await this._bookingClient.post("/pickup/schedule", body, {
        idempotencyKey,
      });

      return {
        pickupId: String(data.pickup_request_id || ""),
        scheduledDate: payload.pickupDate,
        scheduledTime: data.pickup_time || payload.pickupTime || "09:00-13:00",
        status: data.status || "SCHEDULED",
        raw: data,
      };
    } catch (err) {
      this._handleError("schedulePickup", err);
    }
  }

  /* ── cancelOrder ─────────────────────────────────────────────────────── */

  async cancelOrder(payload) {
    this._requireBookingClient("cancelOrder");
    try {
      const { data } = await this._bookingClient.post("/booking/cancel", {
        article_number: payload.providerOrderId,
      });
      return { success: true, message: data.message || "Cancelled", raw: data };
    } catch (err) {
      this._handleError("cancelOrder", err);
    }
  }

  /* ── trackOrder ──────────────────────────────────────────────────────── */

  async trackOrder(payload) {
    const articleNo = payload.awbNumber || payload.trackingId;
    try {
      const { data } = await this._trackingClient.post(
        "/api/dop-site/track-consignment/consumer",
        { conSignNo: articleNo }
      );

      const events = data?.track_info || [];
      const latest = events[0] || {};
      const rawStatus = (latest.event || "").toUpperCase();

      let status = "IN_TRANSIT";
      if (rawStatus.includes("DELIVERED")) status = "DELIVERED";
      else if (rawStatus.includes("OUT FOR DELIVERY")) status = "OUT_FOR_DELIVERY";
      else if (rawStatus.includes("BOOKED")) status = "CREATED";

      return {
        status,
        statusCode: rawStatus,
        currentLocation: latest.event_location || "",
        estimatedDelivery: null,
        timeline: events.map((e) => ({
          status: (e.event || "").toUpperCase(),
          location: e.event_location || "",
          description: e.event || "",
          timestamp: e.event_date ? new Date(e.event_date) : new Date(),
        })),
        raw: data,
      };
    } catch (err) {
      this._handleError("trackOrder", err);
    }
  }

  /* ── generateLabel ───────────────────────────────────────────────────── */

  async generateLabel(payload) {
    this._requireBookingClient("generateLabel");
    try {
      const { data } = await this._bookingClient.post("/label/generate", {
        article_number: payload.providerOrderId || payload.trackingId,
      });
      return { labelUrl: data.label_url || "", format: "pdf", raw: data };
    } catch (err) {
      this._handleError("generateLabel", err);
    }
  }

  /* ── calculateRates ──────────────────────────────────────────────────── */

  async calculateRates(payload) {
    const zone = detectZone(payload.originPincode || this._originPincode, payload.destinationPincode);
    const wt = payload.weight || 0;
    const isCOD = payload.paymentMode === "COD";

    const ordinaryFreight = calcRate(ORDINARY_POST_BASE, wt, zone);
    const speedFreight = calcRate(SPEED_POST_BASE, wt, zone);
    const speedCOD = isCOD ? COD_CHARGES : 0;

    return {
      rates: [
        {
          courierName: "India Post Ordinary",
          courierId: "IP_ORDINARY",
          estimatedDays: 7,
          charges: { freight: ordinaryFreight, cod: 0, handling: 0, total: ordinaryFreight },
          isRecommended: false,
        },
        {
          courierName: "India Post Speed Post",
          courierId: "IP_SPEED",
          estimatedDays: 3,
          charges: { freight: speedFreight, cod: speedCOD, handling: HANDLING_FEE, total: speedFreight + speedCOD + HANDLING_FEE },
          isRecommended: true,
        },
      ],
      raw: { zone },
    };
  }

  /* ── checkServiceability ─────────────────────────────────────────────── */

  async checkServiceability(payload) {
    const valid = /^\d{6}$/.test(String(payload.destinationPincode));
    return {
      serviceable: valid,
      availableCouriers: valid ? [
        { courierName: "India Post Ordinary", courierId: "IP_ORDINARY", codAvailable: false, prepaidAvailable: true, estimatedDays: 10 },
        { courierName: "India Post Speed Post", courierId: "IP_SPEED", codAvailable: true, prepaidAvailable: true, estimatedDays: 4 },
      ] : [],
      raw: {},
    };
  }

  /* ── createReturn ─────────────────────────────────────────────────────── */

  async createReturn(payload, { idempotencyKey = null } = {}) {
    this._requireBookingClient("createReturn");
    try {
      const c = payload.consignee || {};
      const body = {
        customer_id: this.config.customerId,
        shipper: {
          name: c.name,
          address: [c.addressLine1, c.addressLine2].filter(Boolean).join(", "),
          city: c.city,
          pincode: c.pincode,
          phone: c.phone,
        },
        consignee: {
          name: "Everlive Returns",
          address: "Your Warehouse Address",
          city: "Mumbai",
          pincode: this._originPincode || "400001",
          phone: "9999999999",
        },
        payment_mode: "PREPAID",
        weight_grams: payload.weight || 0,
        reference_number: payload.orderId + "-R",
        is_reverse: true,
      };

      const { data } = await this._bookingClient.post("/booking/create", body, { idempotencyKey });
      const articleNo = data.article_number || data.tracking_number || "";
      return {
        providerOrderId: String(data.booking_id || articleNo),
        trackingId: articleNo,
        awbNumber: articleNo,
        status: "CREATED",
        raw: data,
      };
    } catch (err) {
      this._handleError("createReturn", err);
    }
  }
}
