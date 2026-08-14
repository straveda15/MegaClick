/**
 * Shiprocket Adapter — implements ShipmentProviderInterface against the
 * official Shiprocket REST API v2 (apiv2.shiprocket.in).
 *
 * Auth: JWT obtained via POST /v1/external/auth/login, cached for 23 h, auto-refreshed on 401.
 *
 * Required config fields (stored in ShippingProvider.config in MongoDB):
 *   email          — Shiprocket account email
 *   password       — Shiprocket account password
 *   pickupLocation — name of the pickup location in Shiprocket dashboard (e.g. "Primary")
 *   baseURL        — defaults to https://apiv2.shiprocket.in
 */

import axios from "axios";
import { ShipmentProviderInterface } from "./provider.interface.js";
import { ShipmentError, ShipmentProviderError, ShipmentConfigError, ShipmentValidationError } from "../utils/shipmentErrors.js";

const DEFAULT_BASE_URL = "https://apiv2.shiprocket.in";
const API_PREFIX = "/v1/external";
const TOKEN_TTL_MS = 23 * 60 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 20_000;

/**
 * Normalizes an Indian mobile number to the 10-digit format Shiprocket requires.
 * Strips country code (+91 / 91), leading zero, spaces, and hyphens.
 * Returns the last 10 digits of the cleaned number, or "" if nothing remains.
 */
function normalizeIndianPhone(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0"))  return digits.slice(1);
  return digits.slice(-10);
}

export class ShiprocketAdapter extends ShipmentProviderInterface {
  constructor(config = {}) {
    super("shiprocket", config);

    if (!config.email || !config.password) {
      throw new ShipmentConfigError(
        "Shiprocket: email and password are required in provider config",
        { provider: "shiprocket" }
      );
    }
    if (!config.pickupLocation) {
      throw new ShipmentConfigError(
        "Shiprocket: pickupLocation is required in provider config (must match a location name in your Shiprocket dashboard)",
        { provider: "shiprocket" }
      );
    }

    this._baseURL = (config.baseURL || DEFAULT_BASE_URL).replace(/\/$/, "");
    this._email = config.email;
    this._password = config.password;
    this._pickupLocation = config.pickupLocation.trim();

    // ── DIAG: URL trace ───────────────────────────────────────────────────────
    console.log('[DIAG][Shiprocket constructor] config.baseURL (from MongoDB):', config.baseURL);
    console.log('[DIAG][Shiprocket constructor] this._baseURL (after trim)   :', this._baseURL);
    console.log('[DIAG][Shiprocket constructor] API_PREFIX constant           :', API_PREFIX);
    console.log('[DIAG][Shiprocket constructor] expected login URL            :', `${this._baseURL}${API_PREFIX}/auth/login`);
    // Optional Shiprocket channel ID (storefront). Set config.channelId in the
    // ShippingProvider document to scope orders to a specific sales channel.
    this._channelId = config.channelId ? Number(config.channelId) : null;
    this._token = null;
    this._tokenExpiry = 0;

    // Warehouse / return-address config (stored in ShippingProvider.config.warehouse)
    this._warehouse = {
      name: config.warehouse?.name || "Everlive Returns",
      address: config.warehouse?.address || "",
      address2: config.warehouse?.address2 || "",
      city: config.warehouse?.city || "",
      state: config.warehouse?.state || "Maharashtra",
      pincode: config.warehouse?.pincode || "",
      country: config.warehouse?.country || "India",
      phone: config.warehouse?.phone || "",
    };
  }

  /* ── Auth ──────────────────────────────────────────────────────────────── */

  async _fetchToken() {
    try {
      // ── DIAG: Stage 3 — login URL ─────────────────────────────────────────
      const _loginUrl = `${this._baseURL}${API_PREFIX}/auth/login`;
      console.log('[DIAG][_fetchToken] this._baseURL:', this._baseURL);
      console.log('[DIAG][_fetchToken] API_PREFIX   :', API_PREFIX);
      console.log('[DIAG][_fetchToken] final URL    :', _loginUrl);

      const { data } = await axios.post(
        _loginUrl,
        { email: this._email, password: this._password },
        { timeout: DEFAULT_TIMEOUT_MS }
      );
      if (!data?.token) {
        throw new ShipmentConfigError(
          "Shiprocket auth response did not include a token",
          { provider: "shiprocket", response: data }
        );
      }
      this._token = data.token;
      this._tokenExpiry = Date.now() + TOKEN_TTL_MS;
      return this._token;
    } catch (err) {
      if (err instanceof ShipmentConfigError) throw err;
      this._handleError("auth/login", err);
    }
  }

  async _getToken() {
    if (this._token && Date.now() < this._tokenExpiry) return this._token;
    return this._fetchToken();
  }

  async _request(method, path, data = null, params = null, retried = false) {
    const token = await this._getToken();
    try {
      // ── DIAG: Stage 4 — request URL ──────────────────────────────────────
      const _requestUrl = `${this._baseURL}${API_PREFIX}${path}`;
      console.log('[DIAG][_request] this._baseURL:', this._baseURL);
      console.log('[DIAG][_request] API_PREFIX   :', API_PREFIX);
      console.log('[DIAG][_request] path         :', path);
      console.log('[DIAG][_request] final URL    :', _requestUrl);

      const config = {
        method,
        url: _requestUrl,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: DEFAULT_TIMEOUT_MS,
      };
      if (data) config.data = data;
      if (params) config.params = params;
      const response = await axios(config);
      return response.data;
    } catch (err) {
      if (!retried && err.response?.status === 401) {
        this._token = null; 
        return this._request(method, path, data, params, true);
      }
      this._handleError(path, err);
    }
  }

  /* ── Error helper ──────────────────────────────────────────────────────── */

  _handleError(method, error) {
    if (error instanceof ShipmentProviderError || error instanceof ShipmentConfigError) {
      throw error;
    }
    const status = error.response?.status;
    const body   = error.response?.data || error.message;

    // Build a human-readable message that includes Shiprocket's per-field
    // validation errors when present (common on 422 responses).
    let msg;
    if (typeof body === "object") {
      const parts = [];
      if (body.message) parts.push(body.message);
      if (body.errors && typeof body.errors === "object") {
        const fieldErrors = Object.entries(body.errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
          .join("; ");
        parts.push(`Validation — ${fieldErrors}`);
      }
      msg = parts.length > 0 ? parts.join(" | ") : JSON.stringify(body);
    } else {
      msg = String(body);
    }

    throw new ShipmentProviderError(
      `Shiprocket ${method} failed (${status || "NETWORK"}): ${msg}`,
      {
        httpStatus: status && status >= 400 ? status : 502,
        provider: "shiprocket",
        method,
        response: body,
      }
    );
  }

  // Shiprocket returns HTTP 200 for both success and business-logic failures.
  // Fail fast when the response envelope carries status === false.
  // httpStatus 422 makes isFallbackEligible() return false → hard stop, no fallback.
  _checkResult(data, method) {
    if (data.status === false) {
      throw new ShipmentProviderError(
        `Shiprocket ${method} rejected: ${data.message || "Unknown error"}`,
        { httpStatus: 422, provider: "shiprocket", method, response: data }
      );
    }
  }

  // Throws ShipmentValidationError listing every key whose value is absent.
  // Identical contract to Shipmozo._validateRequired — pass { fieldName: value } pairs.
  _validateRequired(fields, method) {
    const missing = Object.entries(fields)
      .filter(([, v]) => v === undefined || v === null || v === "")
      .map(([k]) => k);
    if (missing.length > 0) {
      throw new ShipmentValidationError(
        `Shiprocket ${method} missing required fields: ${missing.join(", ")}`,
        { provider: "shiprocket", method, missingFields: missing }
      );
    }
  }

  /* ── createOrder ─────────────────────────────────────────────────────── */

  async createOrder(payload, { idempotencyKey = null } = {}) {
    console.log('[DIAG][Shiprocket] createOrder() invoked — Shiprocket API will be called');
    console.log('[DIAG][Shiprocket] pickup_location being sent:', JSON.stringify(this._pickupLocation));
    // ── DIAG: Stage 4 — payload.items at adapter entry ───────────────────────
    console.log('[DIAG][SKU] adapter received payload.items:', JSON.stringify(payload.items));
    try {
      const c = payload.consignee || {};
      this._validateRequired(
        { order_id: payload.orderId, billing_email: c.email },
        "createOrder"
      );

      // order_date: use actual order creation time; fall back to now.
      // Format required by Shiprocket: "YYYY-MM-DD HH:MM"
      const orderDate = payload.orderDate
        ? new Date(payload.orderDate).toISOString().replace("T", " ").slice(0, 16)
        : new Date().toISOString().replace("T", " ").slice(0, 16);

      // weight is stored in grams in the payload; Shiprocket expects kg.
      const weightKg = payload.weight ? payload.weight / 1000 : 0.5;

      // billing_customer_name / billing_last_name: Shiprocket requires first and
      // last name split from a single full-name string.
      const nameParts = (c.name || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName  = nameParts.slice(1).join(" ");

      const body = {
        // order_id: must be a string; String() coerces MongoDB ObjectId to its
        // 24-character hex representation via ObjectId.toJSON().
        order_id:        String(payload.orderId),
        order_date:      orderDate,
        pickup_location: this._pickupLocation,

        billing_customer_name: firstName,
        billing_last_name:     lastName,
        billing_address:       c.addressLine1 || "",
        billing_address_2:     c.addressLine2 || "",
        billing_city:          c.city         || "",
        billing_pincode:       c.pincode       || "",
        billing_state:         c.state         || "",
        billing_country:       c.country       || "India",
        billing_email:         c.email,
        // Normalize to the 10-digit format Shiprocket validates against.
        billing_phone:         normalizeIndianPhone(c.phone),

        shipping_is_billing: true,

        order_items: (payload.items || []).map((item) => ({
          name:          item.name        || "",
          sku:           item.sku         || "",
          units:         item.quantity,
          selling_price: item.price,
          discount:      0,
          tax:           0,
          hsn:           item.hsn         || "",
        })),

        payment_method: payload.paymentMode === "PREPAID" ? "Prepaid" : "COD",

        // ── Money fields ───────────────────────────────────────────────────────
        // Shiprocket has NO explicit COD-amount field. When payment_method is
        // "COD" it derives the collectible itself:
        //
        //     collectible = sub_total - total_discount + shipping_charges
        //
        // Normal COD / Prepaid: send the real figures. sub_total must equal the
        // sum of order_items (selling_price × units), i.e. the raw pre-discount
        // goods value — NOT payload.totalAmount (already discounted +
        // delivery-inclusive); feeding that here double-counted the coupon.
        //
        // Partial COD: the customer has already paid `prepaidAmount` online, so
        // the courier must collect only the balance. Because there is no field to
        // state that directly, we make the arithmetic land on it — feed the
        // balance as sub_total and zero the other two terms:
        //
        //     codDueAmount - 0 + 0 = codDueAmount
        //
        // Trade-off: Shiprocket's manifest then shows the balance as the
        // sub-total rather than the true goods value. Unavoidable with this API,
        // and the collectible being correct matters more than the cosmetics.
        ...(payload.isPartialCOD
          ? {
              sub_total:           payload.codAmount ?? 0,
              total_discount:      0,
              shipping_charges:    0,
            }
          : {
              sub_total:           payload.subtotal || 0,
              total_discount:      payload.discount || 0,
              shipping_charges:    payload.deliveryCharge || 0,
            }),
        giftwrap_charges:    0,
        transaction_charges: 0,

        // Dimensions in centimetres (parseDimToCm in orchestrator has already
        // converted mm/m → cm). Shiprocket minimum is 0.5 cm; default 10 cm.
        length:  payload.length  || 10,
        breadth: payload.breadth || 10,
        height:  payload.height  || 10,
        weight:  weightKg,

        // Optional fields — only included when values are present to avoid
        // sending empty strings that might fail validation on future API versions.
        ...(payload.notes    && { comment:    payload.notes }),
        ...(this._channelId !== null && { channel_id: this._channelId }),
      };

      // ── DIAG: Stage 5 — final HTTP request body ──────────────────────────────
      console.log('[DIAG][SKU] final body.order_items before HTTP:', JSON.stringify(body.order_items, null, 2));

      const data = await this._request("POST", "/orders/create/adhoc", body);

      console.log('[DIAG][Shiprocket] createOrder raw response:', JSON.stringify(data, null, 2));

      // Shiprocket returns HTTP 200 even for business-logic failures (e.g. wrong
      // pickup location). A genuinely created order always contains both order_id
      // and shipment_id. Treat any other response as a hard failure — httpStatus 422
      // makes isFallbackEligible() return false, so no fallback providers are tried.
      this._checkResult(data, "createOrder");
      if (!data.order_id || !data.shipment_id) {
        throw new ShipmentProviderError(
          `Shiprocket createOrder rejected: order_id or shipment_id missing in response`,
          { httpStatus: 422, provider: "shiprocket", method: "createOrder", response: data }
        );
      }

      return {
        providerOrderId: String(data.order_id || data.ship_order_id || ""),
        trackingId:      String(data.shipment_id || data.awb_code   || ""),
        awbNumber:       data.awb_code  || "",
        trackingUrl:     data.label     || "",
        status:          "CREATED",
        statusCode:      String(data.status_code || data.status || ""),
        estimatedDelivery: null,
        raw: data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("createOrder", error);
    }
  }

  /* ── assignCourier ───────────────────────────────────────────────────── */

  async assignCourier(payload, { idempotencyKey = null } = {}) {
    try {
      this._validateRequired({ shipment_id: payload.providerOrderId }, "assignCourier");

      const body = {
        shipment_id: payload.providerOrderId,
        courier_id: payload.courierId || undefined,
      };
      if (!payload.courierId || payload.autoAssign) {
        delete body.courier_id;
      }

      const data = await this._request("POST", "/courier/assign/awb", body);
      this._checkResult(data, "assignCourier");

      return {
        courierName: data.response?.data?.courier_name || data.courier_name || "",
        courierId: String(data.response?.data?.courier_id || data.courier_id || ""),
        awbNumber: data.response?.data?.awb_code || data.awb_code || "",
        trackingUrl: data.response?.data?.tracking_url || "",
        estimatedDelivery: null,
        raw: data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("assignCourier", error);
    }
  }

  /* ── schedulePickup ──────────────────────────────────────────────────── */

  async schedulePickup(payload, { idempotencyKey = null } = {}) {
    try {
      this._validateRequired(
        { shipment_id: payload.providerOrderId, pickup_date: payload.pickupDate },
        "schedulePickup"
      );

      const body = {
        shipment_id: [payload.providerOrderId],
        pickup_date: [payload.pickupDate],
      };

      const data = await this._request("POST", "/courier/generate/pickup", body);
      this._checkResult(data, "schedulePickup");

      const pickupData = data.pickup_scheduled_data || data || {};
      return {
        pickupId: pickupData.pickup_token_number || "",
        scheduledDate: payload.pickupDate,
        scheduledTime: payload.pickupTime || "",
        status: pickupData.pickup_generated_message
          ? "SCHEDULED"
          : data.status || "SCHEDULED",
        raw: data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("schedulePickup", error);
    }
  }

  /* ── cancelOrder ─────────────────────────────────────────────────────── */

  async cancelOrder(payload) {
    try {
      this._validateRequired({ order_id: payload.providerOrderId }, "cancelOrder");

      const body = { ids: [payload.providerOrderId] };
      const data = await this._request("POST", "/orders/cancel", body);
      this._checkResult(data, "cancelOrder");

      return {
        success: true,
        message: data.message || "Order cancelled",
        raw: data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("cancelOrder", error);
    }
  }

  /* ── trackOrder ──────────────────────────────────────────────────────── */

  async trackOrder(payload) {
    try {
      const awb = payload.awbNumber || payload.trackingId;
      this._validateRequired({ awb_number: awb }, "trackOrder");

      const data = await this._request("GET", `/courier/track/awb/${awb}`);
      this._checkResult(data, "trackOrder");

      const trackData = data.tracking_data || data || {};
      const shipmentTrack = trackData.shipment_track?.[0] || {};
      const trackActivities = trackData.shipment_track_activities || [];

      return {
        status: (shipmentTrack.current_status || "").toUpperCase(),
        statusCode: String(shipmentTrack.current_status_id || ""),
        currentLocation: shipmentTrack.origin || "",
        estimatedDelivery: shipmentTrack.edd ? new Date(shipmentTrack.edd) : null,
        timeline: trackActivities.map((a) => ({
          status: (a.activity || "").toUpperCase(),
          location: a.location || "",
          description: a.activity || "",
          timestamp: a.date ? new Date(a.date) : new Date(),
        })),
        raw: data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("trackOrder", error);
    }
  }

  /* ── generateLabel ───────────────────────────────────────────────────── */

  async generateLabel(payload) {
    try {
      this._validateRequired(
        { shipment_id: payload.providerOrderId || payload.trackingId },
        "generateLabel"
      );

      const body = { shipment_id: [payload.providerOrderId || payload.trackingId] };
      const data = await this._request("POST", "/courier/generate/label", body);
      this._checkResult(data, "generateLabel");

      const labelUrl = data.label_url || data.response?.label_url || "";
      return {
        labelUrl,
        format: "pdf",
        raw: data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("generateLabel", error);
    }
  }

  /* ── calculateRates ──────────────────────────────────────────────────── */

  async calculateRates(payload) {
    try {
      const weightKg = (payload.weight || 0) / 1000;
      const params = {
        pickup_postcode: payload.originPincode,
        delivery_postcode: payload.destinationPincode,
        weight: weightKg,
        cod: payload.paymentMode === "COD" ? 1 : 0,
        declared_value: payload.declaredValue || 0,
        length: payload.length || 10,
        breadth: payload.breadth || 10,
        height: payload.height || 10,
      };

      const data = await this._request("GET", "/courier/serviceability/", null, params);
      this._checkResult(data, "calculateRates");

      const couriers = data.data?.available_courier_companies || [];
      return {
        rates: couriers.map((c) => ({
          courierName: c.courier_name || "",
          courierId: String(c.courier_company_id || ""),
          estimatedDays: c.estimated_delivery_days || c.etd || 0,
          charges: {
            freight: c.freight_charge || 0,
            cod: c.cod_charges || 0,
            handling: 0,
            total: c.rate || c.freight_charge || 0,
          },
          isRecommended: c.is_recommended || false,
        })),
        raw: data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("calculateRates", error);
    }
  }

  /* ── checkServiceability ─────────────────────────────────────────────── */

  async checkServiceability(payload) {
    try {
      const weightKg = (payload.weight || 0.5) / 1000;
      const params = {
        pickup_postcode: payload.originPincode,
        delivery_postcode: payload.destinationPincode,
        weight: weightKg,
        cod: payload.paymentMode === "COD" ? 1 : 0,
      };

      const data = await this._request("GET", "/courier/serviceability/", null, params);
      this._checkResult(data, "checkServiceability");

      const couriers = data.data?.available_courier_companies || [];
      return {
        serviceable: couriers.length > 0,
        availableCouriers: couriers.map((c) => ({
          courierName: c.courier_name || "",
          courierId: String(c.courier_company_id || ""),
          codAvailable: Boolean(c.cod),
          prepaidAvailable: true,
          estimatedDays: c.estimated_delivery_days || 0,
        })),
        raw: data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("checkServiceability", error);
    }
  }

  /* ── createReturn ─────────────────────────────────────────────────────── */

  async createReturn(payload, { idempotencyKey = null } = {}) {
    try {
      const c = payload.consignee || {};
      this._validateRequired(
        { order_id: payload.orderId, pickup_pincode: c.pincode },
        "createReturn"
      );

      const orderDate = new Date().toISOString().replace("T", " ").slice(0, 16);
      const weightKg = payload.weight ? payload.weight / 1000 : 0.5;

      const body = {
        order_id: payload.orderId + "-R",
        order_date: orderDate,
        pickup_customer_name: c.name?.split(" ")[0] || c.name || "",
        pickup_last_name: c.name?.split(" ").slice(1).join(" ") || "",
        pickup_address: c.addressLine1 || "",
        pickup_address_2: c.addressLine2 || "",
        pickup_city: c.city || "",
        pickup_state: c.state || "",
        pickup_country: "India",
        pickup_pincode: c.pincode || "",
        pickup_email: c.email || "",
        pickup_phone: c.phone || "",
        pickup_location: this._pickupLocation,
        shipping_customer_name: this._warehouse.name,
        shipping_address: this._warehouse.address,
        shipping_address_2: this._warehouse.address2,
        shipping_city: this._warehouse.city,
        shipping_pincode: this._warehouse.pincode,
        shipping_state: this._warehouse.state,
        shipping_country: this._warehouse.country,
        shipping_phone: this._warehouse.phone,
        order_items: (payload.items || []).map((item) => ({
          name: item.name,
          sku: item.sku || "",
          units: item.quantity,
          selling_price: item.price,
        })),
        payment_method: "Prepaid",
        total_amount: payload.totalAmount || 0,
        sub_total: payload.totalAmount || 0,
        length: payload.length || 10,
        breadth: payload.breadth || 10,
        height: payload.height || 10,
        weight: weightKg,
      };

      const data = await this._request("POST", "/orders/create/return", body);
      this._checkResult(data, "createReturn");

      return {
        providerOrderId: String(data.order_id || ""),
        trackingId: String(data.shipment_id || ""),
        awbNumber: data.awb_code || "",
        status: "CREATED",
        raw: data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("createReturn", error);
    }
  }
}
