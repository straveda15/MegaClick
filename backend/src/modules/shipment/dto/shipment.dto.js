/**
 * Shipment DTOs — Unified request/response data transfer objects.
 *
 * Every provider adapter translates its proprietary payloads
 * into these normalised shapes. The service layer ONLY works
 * with these DTOs — never with raw provider data.
 */

import { resolveShipmentPayment } from "../utils/payment-mode.js";

/* ═══════════════════════════════════════════════════════════════════════════
   REQUEST DTOs — what the service layer passes TO the adapter
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Build a CreateOrder request DTO from an order document.
 * @param {Object} order - Mongoose Order document.
 * @returns {Object}
 */
export function buildCreateOrderRequest(order, { weight = 0, length = 10, breadth = 10, height = 10, productSkuMap = new Map() } = {}) {
  // Previously this derived the mode from `paymentStatus === "SUCCESS"`, which
  // silently mishandled partial COD (status "PARTIAL"): it shipped as COD but
  // with the FULL order value, so the courier re-collected the online advance.
  const payment = resolveShipmentPayment(order);

  return {
    orderId: order.orderNumber || order._id.toString(),
    internalOrderId: order._id.toString(),
    consignee: {
      name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim(),
      phone: order.shippingAddress.phone,
      addressLine1: order.shippingAddress.addressLine1,
      addressLine2: order.shippingAddress.addressLine2 || "",
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      pincode: order.shippingAddress.postalCode,
      country: order.shippingAddress.country || "India",
    },
    items: order.items.map((item) => ({
      name: item.productName,
      // Product's current SKU (Product Master is the source of truth) —
      // falls back to the productId only if the product has no SKU set.
      sku: productSkuMap.get(item.productId?.toString()) || item.productId?.toString() || "",
      quantity: item.quantity,
      price: item.priceAtPurchase,
      variant: item.variant || null,
    })),

    paymentMode: payment.paymentMode,
    totalAmount: order.pricing?.finalAmount ?? 0,
    subtotal: order.pricing?.subtotal ?? 0,
    discount: order.pricing?.discountAmount ?? 0,
    deliveryCharge: order.pricing?.deliveryCharge ?? 0,

    // Partial-COD context. Adapters use `codAmount` to tell the courier what to
    // actually collect at the door — for plain COD it equals totalAmount, so
    // existing COD/Prepaid payloads are unaffected.
    paymentMethod: payment.paymentMethod,
    paymentStatus: payment.paymentStatus,
    isPartialCOD: payment.isPartialCOD,
    prepaidAmount: payment.prepaidAmount,
    codAmount: payment.codAmount,

    /** Weight in grams — resolved from order items by the service layer */
    weight,
    length,
    breadth,
    height,
  };
}

/**
 * Build a CreateReturn request DTO from an order.
 */
export function buildCreateReturnRequest(order, { weight = 0, length = 10, breadth = 10, height = 10, productSkuMap = new Map() } = {}) {
  return {
    orderId: order.orderNumber || order._id.toString(),
    internalOrderId: order._id.toString(),
    consignee: {
      name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim(),
      phone: order.shippingAddress.phone,
      addressLine1: order.shippingAddress.addressLine1,
      addressLine2: order.shippingAddress.addressLine2 || "",
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      pincode: order.shippingAddress.postalCode,
      country: order.shippingAddress.country || "India",
      email: order.userId?.email || "",
    },
    items: order.items.map((item) => ({
      name: item.productName,
      sku: productSkuMap.get(item.productId?.toString()) || item.productId?.toString() || "",
      quantity: item.quantity,
      price: item.priceAtPurchase,
    })),
    paymentMode: "PREPAID",
    totalAmount: order.pricing?.finalAmount ?? 0,
    weight,
    length,
    breadth,
    height,
  };
}

/**
 * Build an AssignCourier request DTO.
 */
export function buildAssignCourierRequest({
  providerOrderId,
  trackingId,
  courierId = null,
  autoAssign = true,
}) {
  return { providerOrderId, trackingId, courierId, autoAssign };
}

/**
 * Build a SchedulePickup request DTO.
 */
export function buildSchedulePickupRequest({
  providerOrderId,
  trackingId,
  pickupDate,
  pickupTime = null,
  warehouseAddress = null,
}) {
  return { providerOrderId, trackingId, pickupDate, pickupTime, warehouseAddress };
}

/**
 * Build a CancelOrder request DTO.
 */
export function buildCancelOrderRequest({ providerOrderId, trackingId, reason = "" }) {
  return { providerOrderId, trackingId, reason };
}

/**
 * Build a TrackOrder request DTO.
 */
export function buildTrackOrderRequest({ trackingId, awbNumber = null }) {
  return { trackingId, awbNumber };
}

/**
 * Build a GenerateLabel request DTO.
 */
export function buildGenerateLabelRequest({ trackingId, awbNumber = null, format = "pdf" }) {
  return { trackingId, awbNumber, format };
}

/**
 * Build a CalculateRates request DTO.
 */
export function buildCalculateRatesRequest({
  originPincode,
  destinationPincode,
  weight,
  length = 0,
  breadth = 0,
  height = 0,
  paymentMode = "PREPAID",
  declaredValue = 0,
}) {
  return {
    originPincode,
    destinationPincode,
    weight,
    length,
    breadth,
    height,
    paymentMode,
    declaredValue,
  };
}

/**
 * Build a Serviceability request DTO.
 */
export function buildServiceabilityRequest({
  originPincode,
  destinationPincode,
  paymentMode = "PREPAID",
  weight = null,
}) {
  return { originPincode, destinationPincode, paymentMode, weight };
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESPONSE DTOs — what the adapter returns TO the service layer
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Normalise a provider's create-order response.
 */
export function normaliseCreateOrderResponse(data) {
  return {
    providerOrderId: data.providerOrderId || "",
    trackingId: data.trackingId || "",
    awbNumber: data.awbNumber || "",
    trackingUrl: data.trackingUrl || "",
    status: data.status || "CREATED",
    statusCode: data.statusCode || "",
    estimatedDelivery: data.estimatedDelivery
      ? new Date(data.estimatedDelivery)
      : null,
    raw: data.raw || null,
  };
}

/**
 * Normalise a provider's assign-courier response.
 */
export function normaliseAssignCourierResponse(data) {
  return {
    courierName: data.courierName || "",
    courierId: data.courierId || "",
    awbNumber: data.awbNumber || "",
    trackingUrl: data.trackingUrl || "",
    estimatedDelivery: data.estimatedDelivery
      ? new Date(data.estimatedDelivery)
      : null,
    raw: data.raw || null,
  };
}

/**
 * Normalise a provider's schedule-pickup response.
 */
export function normaliseSchedulePickupResponse(data) {
  return {
    pickupId: data.pickupId || "",
    scheduledDate: data.scheduledDate || "",
    scheduledTime: data.scheduledTime || "",
    status: data.status || "SCHEDULED",
    raw: data.raw || null,
  };
}

/**
 * Normalise a provider's cancel-order response.
 */
export function normaliseCancelOrderResponse(data) {
  return {
    success: data.success ?? true,
    message: data.message || "Order cancelled",
    raw: data.raw || null,
  };
}

/**
 * Normalise a provider's tracking response.
 */
export function normaliseTrackOrderResponse(data) {
  return {
    status: data.status || "",
    statusCode: data.statusCode || "",
    currentLocation: data.currentLocation || "",
    estimatedDelivery: data.estimatedDelivery
      ? new Date(data.estimatedDelivery)
      : null,
    timeline: Array.isArray(data.timeline)
      ? data.timeline.map((t) => ({
          status: t.status || "",
          location: t.location || "",
          description: t.description || "",
          timestamp: t.timestamp ? new Date(t.timestamp) : new Date(),
        }))
      : [],
    raw: data.raw || null,
  };
}

/**
 * Normalise a provider's label response.
 */
export function normaliseGenerateLabelResponse(data) {
  return {
    labelUrl: data.labelUrl || "",
    format: data.format || "pdf",
    raw: data.raw || null,
  };
}

/**
 * Normalise a provider's rate calculation response.
 */
export function normaliseCalculateRatesResponse(data) {
  return {
    rates: Array.isArray(data.rates)
      ? data.rates.map((r) => ({
          courierName: r.courierName || "",
          courierId: r.courierId || "",
          estimatedDays: r.estimatedDays || 0,
          charges: {
            freight: r.charges?.freight || 0,
            cod: r.charges?.cod || 0,
            handling: r.charges?.handling || 0,
            total: r.charges?.total || 0,
          },
          isRecommended: r.isRecommended || false,
        }))
      : [],
    raw: data.raw || null,
  };
}

/**
 * Normalise a provider's serviceability response.
 */
export function normaliseServiceabilityResponse(data) {
  return {
    serviceable: data.serviceable ?? false,
    availableCouriers: Array.isArray(data.availableCouriers)
      ? data.availableCouriers.map((c) => ({
          courierName: c.courierName || "",
          courierId: c.courierId || "",
          codAvailable: c.codAvailable ?? false,
          prepaidAvailable: c.prepaidAvailable ?? true,
          estimatedDays: c.estimatedDays || 0,
        }))
      : [],
    raw: data.raw || null,
  };
}
