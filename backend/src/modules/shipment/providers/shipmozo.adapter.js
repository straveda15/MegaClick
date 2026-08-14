/**
 * Shipmozo Adapter — Reference implementation of ShipmentProviderInterface.
 *
 * Maps each interface method to the corresponding Shipmozo API endpoint.
 * Authentication: PUBLIC-KEY + PRIVATE-KEY headers on every request.
 *
 * Endpoint paths follow standard courier-aggregator patterns.
 * Update the paths in this file once you receive official Shipmozo docs,
 * OR override them via the provider's DB config:
 *   config.endpoints.createOrder = "/custom/path"
 */

import { ShipmentProviderInterface } from "./provider.interface.js";
import { createHttpClient } from "../utils/httpClient.js";
import {
  ShipmentError,
  ShipmentProviderError,
  ShipmentValidationError,
} from "../utils/shipmentErrors.js";

/* ── Default Shipmozo endpoint paths ─────────────────────────────────────── */

const DEFAULT_ENDPOINTS = {
  createOrder: "/push-order",
  assignCourier: "/assign-courier",
  schedulePickup: "/schedule-pickup",
  cancelOrder: "/cancel-order",
  trackOrder: "/track-order",
  generateLabel: "/get-order-label",
  calculateRates: "/rate-calculator",
  checkServiceability: "/pincode-serviceability",
  createReturn: "/push-return-order",
};

export class ShipmozoAdapter extends ShipmentProviderInterface {
  constructor(config = {}) {
    super("shipmozo", config);

    if (!config.apiBaseUrl) {
      throw new ShipmentProviderError("Shipmozo: apiBaseUrl is required", {
        provider: "shipmozo",
      });
    }

    this.endpoints = { ...DEFAULT_ENDPOINTS, ...(config.endpoints || {}) };

    // Warehouse config (stored in ShippingProvider.config.warehouse).
    // warehouseId is required by push-order and push-return-order.
    this._warehouse = {
      warehouseId: config.warehouse?.id || config.warehouse?.warehouseId || "",
      name:    config.warehouse?.name    || "Everlive Returns",
      email:   config.warehouse?.email   || "",
      address: config.warehouse?.address || "",
      address2: config.warehouse?.address2 || "",
      city:    config.warehouse?.city    || "",
      state:   config.warehouse?.state   || "",
      pincode: config.warehouse?.pincode || "",
      country: config.warehouse?.country || "India",
      phone:   config.warehouse?.phone   || "",
    };

    this.client = createHttpClient({
      baseURL: config.apiBaseUrl,
      headers: {
        "PUBLIC-KEY":  config.publicKey  || "",
        "PRIVATE-KEY": config.privateKey || "",
        ...(config.customHeaders || {}),
      },
      timeout:             config.timeout             || 15000,
      retries:             config.retries             || 3,
      maxRetryWithBackoff: config.maxRetryWithBackoff || config.retries || 3,
    });
  }

  /* ── helpers ──────────────────────────────────────────────────────────── */

  _handleError(method, error) {
    const providerStatus =
      typeof error.response?.status === "number" ? error.response.status : null;
    const status = providerStatus || "NETWORK";
    const body = error.response?.data || error.message;
    throw new ShipmentProviderError(
      `Shipmozo ${method} failed (${status}): ${typeof body === "string" ? body : JSON.stringify(body)}`,
      {
        httpStatus:
          providerStatus && providerStatus >= 400 && providerStatus < 600
            ? providerStatus
            : 502,
        provider: "shipmozo",
        method,
        status,
        response: body,
      }
    );
  }

  // Shipmozo returns HTTP 200 for both success and validation failure.
  // Only result === "1" means the request was accepted.
  _checkResult(data, method) {
    if (String(data?.result) !== "1") {
      const errorDetail =
        (data?.data && data.data.error) ||
        data?.message ||
        "Shipmozo rejected the request";
      throw new ShipmentProviderError(
        `Shipmozo ${method} rejected: ${errorDetail}`,
        { httpStatus: 422, provider: "shipmozo", method, response: data }
      );
    }
  }

  // Throws ShipmentValidationError listing every key whose value is absent.
  // Pass a plain object of { fieldName: value } pairs.
  _validateRequired(fields, method) {
    const missing = Object.entries(fields)
      .filter(([, v]) => v === undefined || v === null || v === "")
      .map(([k]) => k);
    if (missing.length > 0) {
      throw new ShipmentValidationError(
        `Shipmozo ${method} missing required fields: ${missing.join(", ")}`,
        { provider: "shipmozo", method, missingFields: missing }
      );
    }
  }

  // Normalises an Indian mobile number to the bare 10-digit form Shipmozo requires.
  // Strips spaces, dashes, and the leading +91 / 91 country code when present.
  // Throws ShipmentValidationError if the result is not exactly 10 digits.
  _normalizePhone(raw) {
    const digits = String(raw ?? "").replace(/\D/g, "");
    const phone = digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits;
    if (phone.length !== 10) {
      throw new ShipmentValidationError(
        `Shipmozo createOrder: consignee phone must be 10 digits after normalisation (got "${raw}" → "${phone}")`,
        { provider: "shipmozo", method: "createOrder", field: "consignee_phone" }
      );
    }
    return phone;
  }

  // Converts internal item objects to the Shipmozo product_detail array format.
  //
  // Shipmozo's push-order API has no order-level sub_total/total_discount field —
  // the only discount hook is the per-item `discount` field in product_detail.
  // Unlike totalAmount/cod_amount (which already carry the finalAmount from
  // order.pricing and are correct), leaving `discount` blank meant Shipmozo's own
  // record of the order (and its `unit_price` × quantity total) reflected the full
  // undiscounted goods value whenever a coupon was applied. We don't recompute the
  // discount here — we distribute the single already-known totalDiscount
  // (order.pricing.discountAmount) across lines proportional to each line's share
  // of the pre-discount value, so unit_price × quantity − discount sums to the
  // same discounted subtotal used everywhere else.
  _buildProductDetail(items = [], totalDiscount = 0) {
    const arr = Array.isArray(items) ? items : [];
    const grossTotal = arr.reduce(
      (sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1),
      0
    );

    let remainingDiscount = Math.round((totalDiscount ?? 0) * 100) / 100;

    return arr.map((i, index) => {
      const lineValue = (i.price ?? 0) * (i.quantity ?? 1);
      let lineDiscount = 0;
      if (grossTotal > 0 && remainingDiscount > 0) {
        lineDiscount =
          index === arr.length - 1
            ? remainingDiscount // last line absorbs any rounding remainder
            : Math.round((totalDiscount * lineValue / grossTotal) * 100) / 100;
        remainingDiscount = Math.round((remainingDiscount - lineDiscount) * 100) / 100;
      }

      return {
        name:             i.name             ?? "Item",
        sku_number:       i.sku              ?? "",
        quantity:         i.quantity         ?? 1,
        discount:         lineDiscount || (i.discount ?? ""),
        hsn:              i.hsn              ?? "",
        unit_price:       i.price            ?? 0,
        product_category: i.category         ?? "Other",
      };
    });
  }

  /* ── createOrder ─────────────────────────────────────────────────────── */

  async createOrder(payload, { idempotencyKey = null } = {}) {
    try {
      // Pre-flight: validate every field Shipmozo documents as required.
      this._validateRequired(
        {
          warehouse_id:              this._warehouse.warehouseId,
          order_id:                  payload?.orderId,
          consignee_name:            payload?.consignee?.name,
          consignee_phone:           payload?.consignee?.phone,
          consignee_address_line_one: payload?.consignee?.addressLine1,
          consignee_pin_code:        payload?.consignee?.pincode,
          consignee_city:            payload?.consignee?.city,
          consignee_state:           payload?.consignee?.state,
          weight:                    payload.weight,
        },
        "createOrder"
      );

      const productDetail = this._buildProductDetail(payload.items, payload.discount);
      if (productDetail.length === 0) {
        throw new ShipmentValidationError(
          "Shipmozo createOrder requires at least one item in product_detail",
          { provider: "shipmozo", method: "createOrder" }
        );
      }

      // Use dispatch date (today) when the payload doesn't carry an explicit order date.
      const orderDate = payload.orderDate
        ? new Date(payload.orderDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      const body = {
        order_id:                   String(payload.orderId),
        order_date:                 orderDate,
        warehouse_id:               String(this._warehouse.warehouseId),
        consignee_name:             payload.consignee.name,
        consignee_phone:            this._normalizePhone(payload.consignee.phone),
        consignee_address_line_one: payload.consignee.addressLine1,
        consignee_address_line_two: payload.consignee.addressLine2 ?? "",
        consignee_pin_code:         payload.consignee.pincode,
        consignee_city:             payload.consignee.city,
        consignee_state:            payload.consignee.state,
        product_detail:             productDetail,
        // Official docs: PREPAID | COD (uppercase)
        payment_type:               payload.paymentMode === "PREPAID" ? "PREPAID" : "COD",
        // Declared value of the goods — always the true order total, even for
        // partial COD where only part of it is collected at the door.
        total_amount:               payload.totalAmount,
        // What the courier actually collects on delivery. For plain COD this
        // equals totalAmount (unchanged behaviour); for partial COD it is only
        // the outstanding balance, since the advance was already paid online.
        cod_amount:                 payload.paymentMode === "PREPAID"
                                      ? 0
                                      : (payload.codAmount ?? payload.totalAmount),
        weight:                     payload.weight,
        length:                     payload.length  ?? 0,
        width:                      payload.breadth ?? 0,
        height:                     payload.height  ?? 0,
      };

      const { data } = await this.client.post(this.endpoints.createOrder, body, {
        idempotencyKey,
      });

      this._checkResult(data, "createOrder");
      

      // Push-Order returns only order_id and reference_id.
      // AWB is assigned by schedule-pickup; do not expect it here.
      return {
        providerOrderId: data.data?.order_id    || "",
        referenceId:     data.data?.reference_id || "",
        trackingId:      "",
        awbNumber:       "",
        status:          "CREATED",
        raw:             data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("createOrder", error);
    }
  }

  /* ── assignCourier ───────────────────────────────────────────────────── */

  async assignCourier(payload, { idempotencyKey = null } = {}) {
    try {
      this._validateRequired(
        { order_id: payload?.providerOrderId },
        "assignCourier"
      );

      const body = {
        order_id:    payload.providerOrderId,
        courier_id:  payload.courierId,
        auto_assign: payload.autoAssign,
      };

      const { data } = await this.client.post(
        this.endpoints.assignCourier,
        body,
        { idempotencyKey }
      );

      this._checkResult(data, "assignCourier");

      const result = data.data ?? {};

      // Official Assign Courier response: order_id, reference_id, courier.
      // AWB is NOT returned at this stage — it comes from schedule-pickup.
      return {
        providerOrderId: result.order_id     || "",
        referenceId:     result.reference_id  || "",
        courierName:     result.courier       || "",
        awbNumber:       "",
        raw:             data,
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
        { order_id: payload?.providerOrderId },
        "schedulePickup"
      );

      const body = {
        order_id:     payload.providerOrderId,
        pickup_date:  payload.pickupDate,
        pickup_time:  payload.pickupTime,
        warehouse_id: String(this._warehouse.warehouseId),
      };

      const { data } = await this.client.post(
        this.endpoints.schedulePickup,
        body,
        { idempotencyKey }
      );

      this._checkResult(data, "schedulePickup");

      const result = data.data ?? {};

      // Official Schedule Pickup response: order_id, reference_id, courier, awb_number, lr_number.
      return {
        providerOrderId: result.order_id     || "",
        referenceId:     result.reference_id  || "",
        courierName:     result.courier       || "",
        awbNumber:       result.awb_number    || "",
        lrNumber:        result.lr_number     || "",
        status:          "SCHEDULED",
        raw:             data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("schedulePickup", error);
    }
  }

  /* ── cancelOrder ─────────────────────────────────────────────────────── */

  async cancelOrder(payload) {
    try {
      this._validateRequired(
        { order_id: payload?.providerOrderId },
        "cancelOrder"
      );

      const body = {
        order_id:   payload.providerOrderId,
        awb_number: payload.awbNumber,
        reason:     payload.reason,
      };

      const { data } = await this.client.post(
        this.endpoints.cancelOrder,
        body
      );

      this._checkResult(data, "cancelOrder");

      return {
        success: true,
        message: data.message || "Order cancelled",
        raw:     data,
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

      // Official endpoint: GET /track-order?awb_number=<awb>  (query param, not path segment)
      const { data } = await this.client.get(this.endpoints.trackOrder, {
        params: { awb_number: awb },
      });

      this._checkResult(data, "trackOrder");

      const result = data.data ?? {};
      const scans = Array.isArray(result.scans)
        ? result.scans
        : Array.isArray(result.timeline)
          ? result.timeline
          : [];

      return {
        status:            (result.current_status || result.status || "").toUpperCase(),
        statusCode:        result.status_code || result.statusCode || "",
        currentLocation:   result.current_location || result.location || "",
        estimatedDelivery: result.estimated_delivery || null,
        timeline: scans.map((s) => ({
          status:      (s.status || "").toUpperCase(),
          location:    s.location                               || "",
          description: s.remarks    || s.description           || "",
          timestamp:   s.time       || s.timestamp             || new Date().toISOString(),
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
      const awb = payload.awbNumber || payload.trackingId;

      this._validateRequired({ awb_number: awb }, "generateLabel");

      // Official endpoint: GET /get-order-label/{awb_number}
      const { data } = await this.client.get(
        `${this.endpoints.generateLabel}/${awb}`,
        { params: { format: payload.format || "pdf" } }
      );

      this._checkResult(data, "generateLabel");

      const result = data.data ?? {};

      return {
        labelUrl: result.label_url || result.labelUrl || result.url || "",
        format:   result.format    || payload.format  || "pdf",
        raw:      data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("generateLabel", error);
    }
  }

  /* ── calculateRates ──────────────────────────────────────────────────── */

  async calculateRates(payload) {
    try {
      const body = {
        origin_pincode:      payload.originPincode,
        destination_pincode: payload.destinationPincode,
        weight:              payload.weight,
        length:              payload.length,
        breadth:             payload.breadth,
        height:              payload.height,
        payment_mode:        payload.paymentMode === "PREPAID" ? "PREPAID" : "COD",
        declared_value:      payload.declaredValue,
      };

      const { data } = await this.client.post(
        this.endpoints.calculateRates,
        body
      );

      this._checkResult(data, "calculateRates");

      const ratesArray = Array.isArray(data.data) ? data.data : [];

      return {
        rates: ratesArray.map((r) => ({
          courierName:    r.courier_name  || r.courierName  || "",
          courierId:      r.courier_id    || r.courierId    || "",
          estimatedDays:  r.estimated_days || r.etd          || 0,
          charges: {
            freight:  r.freight_charge || r.freight  || 0,
            cod:      r.cod_charge     || r.cod      || 0,
            handling: r.handling_charge || r.handling || 0,
            total:    r.total_charge   || r.total    || 0,
          },
          isRecommended: r.is_recommended || r.recommended || false,
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
      const body = {
        pickup_pincode:   payload.originPincode,
        delivery_pincode: payload.destinationPincode,
      };

      const { data } = await this.client.post(
        this.endpoints.checkServiceability,
        body
      );

      this._checkResult(data, "checkServiceability");

      return {
        serviceable:       data.data?.serviceable === true,
        availableCouriers: [],
        raw:               data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("checkServiceability", error);
    }
  }

  /* ── createReturn ─────────────────────────────────────────────────────── */

  async createReturn(payload, { idempotencyKey = null } = {}) {
    try {
      // Push Return Order uses pickup_* fields (customer's address to collect from),
      // NOT consignee_* fields. The destination is always the warehouse identified by warehouse_id.
      this._validateRequired(
        {
          warehouse_id:          this._warehouse.warehouseId,
          order_id:              payload?.orderId,
          pickup_name:           payload?.consignee?.name,
          pickup_phone:          payload?.consignee?.phone,
          pickup_address_line_one: payload?.consignee?.addressLine1,
          pickup_pin_code:       payload?.consignee?.pincode,
          pickup_city:           payload?.consignee?.city,
          pickup_state:          payload?.consignee?.state,
        },
        "createReturn"
      );

      const productDetail = this._buildProductDetail(payload.items);
      if (productDetail.length === 0) {
        throw new ShipmentValidationError(
          "Shipmozo createReturn requires at least one item in product_detail",
          { provider: "shipmozo", method: "createReturn" }
        );
      }

      const body = {
        order_id:               `${payload.orderId}-R`,
        warehouse_id:           this._warehouse.warehouseId,
        pickup_name:            payload.consignee.name,
        pickup_phone:           payload.consignee.phone,
        pickup_email:           payload.consignee.email           ?? "",
        pickup_address_line_one: payload.consignee.addressLine1,
        pickup_address_line_two: payload.consignee.addressLine2   ?? "",
        pickup_pin_code:        payload.consignee.pincode,
        pickup_city:            payload.consignee.city,
        pickup_state:           payload.consignee.state,
        product_detail:         productDetail,
        return_reason_id:       payload.returnReasonId            ?? "",
        customer_request:       payload.customerRequest           ?? "",
        reason_comment:         payload.reasonComment             ?? "",
      };

      const { data } = await this.client.post(this.endpoints.createReturn, body, {
        idempotencyKey,
      });

      this._checkResult(data, "createReturn");

      return {
        providerOrderId: data.data?.order_id     || "",
        referenceId:     data.data?.reference_id  || "",
        trackingId:      "",
        awbNumber:       "",
        status:          "CREATED",
        raw:             data,
      };
    } catch (error) {
      if (error instanceof ShipmentError) throw error;
      this._handleError("createReturn", error);
    }
  }
}
