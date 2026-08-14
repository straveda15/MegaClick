/**
 * Shipment Service — Business logic layer.
 *
 * Orchestrates DB operations and delegating provider calls to the ProviderFactory.
 * Provider selection and fallback are handled entirely by the factory.
 */

import crypto from "crypto";
import mongoose from "mongoose";
import Shipment from "./shipment.model.js";
import Order from "../order/order.model.js";
import Return from "../return/return.model.js";
import Product from "../product/product.model.js";
import ShippingProvider from "./models/shippingProvider.model.js";
import { resolveShipmentPayment } from "./utils/payment-mode.js";
import {
  clearAdapterCache,
  executeWithFallback,
  getProvider,
  getProviderByName,
  getProviderForShipment,
} from "./providers/provider.factory.js";
import {
  ShipmentConfigError,
  ShipmentDuplicateError,
  ShipmentNotFoundError,
  ShipmentValidationError,
  WebhookAuthError,
} from "./utils/shipmentErrors.js";
import * as dto from "./dto/shipment.dto.js";
import {
  buildRateKey,
  getRateFromCache,
  invalidateProviderRates,
  setRateInCache,
} from "./utils/rateCache.js";
import {
  buildStoredOperationError,
  claimOrGetOperation,
  markOperationFailure,
  markOperationPending,
  markOperationSuccess,
  waitForStoredOperationResolution,
} from "./utils/idempotencyStore.js";

/* ── Context Helpers ─────────────────────────────────────────────────────── */

function buildShipmentContext(order) {
  // Payment mode + collectible come from the shared resolver, so this can't drift
  // from the dispatch orchestrator or the DTO again — which is exactly how partial
  // COD ended up handled three different (and two wrong) ways.
  const payment = resolveShipmentPayment(order);

  return {
    destinationPincode: order.shippingAddress?.postalCode,
    paymentMode: payment.paymentMode,
    state: order.shippingAddress?.state,
    // Amount the courier collects on delivery: the balance for partial COD, the
    // full total for plain COD, zero for prepaid.
    orderValue: payment.codAmount,
    codAmount: payment.codAmount,
  };
}

const PRODUCT_WEIGHT_FIELDS = [
  { field: "weight", unit: "grams" },
  { field: "shippingWeight", unit: "grams" },
  { field: "shippingWeightGrams", unit: "grams" },
  { field: "weightGrams", unit: "grams" },
];

function normalizeWeightToGrams(value, unit = "grams") {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return null;
  }

  return unit === "kilograms" ? numericValue * 1000 : numericValue;
}

function readWeightFromRecord(record = {}) {
  for (const { field, unit } of PRODUCT_WEIGHT_FIELDS) {
    const weight = normalizeWeightToGrams(record?.[field], unit);
    if (weight !== null) {
      return weight;
    }
  }

  return null;
}

async function resolveOrderWeight(order) {
  const items = Array.isArray(order?.items) ? order.items : [];

  if (items.length === 0) {
    throw new ShipmentValidationError("Order must contain at least one item to create a shipment", {
      orderId: order?._id?.toString?.() || null,
    });
  }

  const validProductIds = Array.from(
    new Set(
      items
        .map((item) => item.productId)
        .filter((productId) => mongoose.Types.ObjectId.isValid(productId))
        .map((productId) => productId.toString())
    )
  );

  let productWeightMap = new Map();

  if (validProductIds.length > 0) {
    const products = await Product.find({
      _id: { $in: validProductIds },
    }).lean();

    productWeightMap = new Map(
      products.map((product) => [product._id.toString(), readWeightFromRecord(product)])
    );
  }

  let totalWeight = 0;
  const missingWeights = [];
  const invalidQuantities = [];

  for (const item of items) {
    const quantity = Number(item.quantity);
    const itemWeight =
      readWeightFromRecord(item) ??
      productWeightMap.get(item.productId?.toString?.() || "") ??
      null;

    if (!Number.isFinite(quantity) || quantity <= 0) {
      invalidQuantities.push({
        productId: item.productId?.toString?.() || null,
        productName: item.productName || null,
        quantity: item.quantity ?? null,
      });
      continue;
    }

    if (itemWeight === null) {
      missingWeights.push({
        productId: item.productId?.toString?.() || null,
        productName: item.productName || null,
      });
      continue;
    }

    totalWeight += itemWeight * quantity;
  }

  if (missingWeights.length > 0 || invalidQuantities.length > 0) {
    throw new ShipmentValidationError(
      "Cannot select a shipping provider because one or more order items have invalid shipment data",
      {
        orderId: order?._id?.toString?.() || null,
        ...(missingWeights.length > 0 && { missingItems: missingWeights }),
        ...(invalidQuantities.length > 0 && { invalidItems: invalidQuantities }),
      }
    );
  }

  return totalWeight;
}

// Resolves each order item's current SKU from the Product collection (the
// source of truth) rather than trusting anything snapshotted on the order.
async function resolveOrderItemSkus(order) {
  const items = Array.isArray(order?.items) ? order.items : [];

  const validProductIds = Array.from(
    new Set(
      items
        .map((item) => item.productId)
        .filter((productId) => mongoose.Types.ObjectId.isValid(productId))
        .map((productId) => productId.toString())
    )
  );

  if (validProductIds.length === 0) {
    return new Map();
  }

  const products = await Product.find({ _id: { $in: validProductIds } })
    .select("sku")
    .lean();

  return new Map(products.map((product) => [product._id.toString(), product.sku || ""]));
}

async function getShipmentBoundProvider(shipment) {
  return getProviderForShipment({
    providerId: shipment.providerId,
    providerName: shipment.provider,
  });
}

function buildShipmentOperationIdempotencyKey(method, parts = []) {
  return ["shipment", method, ...parts]
    .map((part) => {
      if (part === null) {
        return "__NULL__";
      }

      if (part === undefined) {
        return "__UNDEFINED__";
      }

      return String(part);
    })
    .join(":");
}

function buildPickupScheduledAt(scheduledDate, scheduledTime) {
  if (!scheduledDate) return null;

  const primaryTime =
    typeof scheduledTime === "string" && scheduledTime.trim()
      ? scheduledTime.split("-")[0].trim()
      : "";

  const timestamp = primaryTime
    ? `${scheduledDate}T${primaryTime}`
    : scheduledDate;

  const parsed = new Date(timestamp);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  const dateOnly = new Date(scheduledDate);
  return Number.isNaN(dateOnly.getTime()) ? null : dateOnly;
}

async function executeBoundOperationWithIdempotency({
  method,
  payload,
  adapter,
  providerDoc,
  idempotencyKey = null,
}) {
  const operationClaim = await claimOrGetOperation({
    method,
    idempotencyKey,
    payload,
    providerDoc,
  });
  if (!operationClaim.claimed) {
    if (operationClaim.result) {
      return operationClaim.result;
    }

    const resolvedOperation = await waitForStoredOperationResolution({
      method,
      idempotencyKey,
      payload,
    });

    if (resolvedOperation?.result) {
      return resolvedOperation.result;
    }

    if (resolvedOperation?.record?.status === "FAILED") {
      throw buildStoredOperationError(resolvedOperation.record);
    }

    throw new ShipmentValidationError(
      `Shipment operation "${method}" is already in progress for idempotency key "${idempotencyKey}"`,
      { method, idempotencyKey }
    );
  }

  await markOperationPending({
    method,
    idempotencyKey,
    payload,
    providerDoc,
  });

  try {
    const result = await adapter[method](payload, { idempotencyKey });
    await markOperationSuccess({
      method,
      idempotencyKey,
      payload,
      providerDoc,
      result,
    });
    return result;
  } catch (error) {
    await markOperationFailure({
      method,
      idempotencyKey,
      payload,
      providerDoc,
      error,
    });
    throw error;
  }
}

/* ── Core Operations ─────────────────────────────────────────────────────── */

export const createShipment = async (order) => {
  const existing = await Shipment.findOne({ orderId: order._id });
  if (existing) {
    throw new ShipmentDuplicateError(`Shipment already exists for order ${order.orderNumber}`);
  }

  const weight = await resolveOrderWeight(order);
  const productSkuMap = await resolveOrderItemSkus(order);
  const context = {
    ...buildShipmentContext(order),
    weight,
  };
  const payload = dto.buildCreateOrderRequest(order, { weight, productSkuMap });
  const idempotencyKey = buildShipmentOperationIdempotencyKey("createOrder", [
    order._id,
  ]);

  const { result: providerResponse, providerDoc } = await executeWithFallback(
    "createOrder",
    payload,
    context,
    { idempotencyKey }
  );

  const shipment = new Shipment({
    orderId: order._id,
    userId: order.userId,
    providerId: providerDoc._id,
    provider: providerDoc.name,
    providerOrderId: providerResponse.providerOrderId,
    trackingId: providerResponse.trackingId,
    awbNumber: providerResponse.awbNumber,
    trackingUrl: providerResponse.trackingUrl,
    status: providerResponse.status,
    statusCode: providerResponse.statusCode,
    estimatedDelivery: providerResponse.estimatedDelivery,
    providerPayload: providerResponse.raw,

    // Snapshot what the courier was told to collect (payload came from the same
    // resolver, so these always agree with what the provider received).
    paymentMethod: payload.paymentMethod ?? null,
    prepaidAmount: payload.prepaidAmount ?? 0,
    codAmount: payload.codAmount ?? 0,
    orderTotal: payload.totalAmount ?? 0,

    timeline: [
      {
        status: providerResponse.status || "CREATED",
        description: `Shipment created via ${providerDoc.displayName}`,
        timestamp: new Date(),
      },
    ],
  });

  await shipment.save();
  return shipment;
};

export const createReturnShipment = async (order) => {
  const weight = await resolveOrderWeight(order);
  const productSkuMap = await resolveOrderItemSkus(order);
  const context = {
    ...buildShipmentContext(order),
    weight,
    isReturn: true,
  };
  const payload = dto.buildCreateReturnRequest(order, { weight, productSkuMap });
  const idempotencyKey = buildShipmentOperationIdempotencyKey("createReturn", [
    order._id,
  ]);

  const { result: providerResponse, providerDoc } = await executeWithFallback(
    "createReturn",
    payload,
    context,
    { idempotencyKey }
  );

  const shipment = new Shipment({
    orderId: order._id,
    userId: order.userId,
    providerId: providerDoc._id,
    provider: providerDoc.name,
    providerOrderId: providerResponse.providerOrderId,
    trackingId: providerResponse.trackingId,
    awbNumber: providerResponse.awbNumber,
    status: providerResponse.status || "RETURN_CREATED",
    isReturn: true,
    providerPayload: providerResponse.raw,
    timeline: [
      {
        status: providerResponse.status || "RETURN_CREATED",
        description: `Return shipment initiated via ${providerDoc.displayName}`,
        timestamp: new Date(),
      },
    ],
  });

  await shipment.save();
  return shipment;
};

export const assignCourier = async (orderId, courierId = null, autoAssign = true) => {
  const shipment = await Shipment.findOne({ orderId }).populate("orderId");
  if (!shipment) throw new ShipmentNotFoundError();

  const statusBefore = shipment.status;

  console.log("========== ASSIGN COURIER ==========");
  console.log({
    shipmentId:      String(shipment._id),
    orderId:         String(orderId),
    providerOrderId: shipment.providerOrderId,
    courier:         shipment.courierName || "",
    awb:             shipment.awbNumber   || "",
    statusBefore,
  });

  const payload = dto.buildAssignCourierRequest({
    providerOrderId: shipment.providerOrderId,
    trackingId: shipment.trackingId,
    courierId,
    autoAssign,
  });

  const { adapter, providerDoc } = await getShipmentBoundProvider(shipment);
  const idempotencyKey = buildShipmentOperationIdempotencyKey("assignCourier", [
    shipment._id,
    courierId || "auto",
    autoAssign ? "auto" : "manual",
  ]);
  const providerResponse = await executeBoundOperationWithIdempotency({
    method: "assignCourier",
    payload,
    adapter,
    providerDoc,
    idempotencyKey,
  });

  if (providerResponse.courierName)       shipment.courierName      = providerResponse.courierName;
  if (providerResponse.awbNumber)         shipment.awbNumber        = providerResponse.awbNumber;
  if (providerResponse.trackingUrl)       shipment.trackingUrl      = providerResponse.trackingUrl;
  if (providerResponse.estimatedDelivery) shipment.estimatedDelivery = providerResponse.estimatedDelivery;
  if (providerDoc.name)                   shipment.provider         = providerDoc.name;
  if (providerDoc._id)                    shipment.providerId       = providerDoc._id;
  shipment.status = "COURIER_ASSIGNED";

  shipment.timeline.push({
    status: "COURIER_ASSIGNED",
    description: `Courier assigned: ${providerResponse.courierName || "auto"}`,
    timestamp: new Date()
  });

  await shipment.save();

  console.log("Assign Courier Result:", {
    shipmentId:  String(shipment._id),
    courier:     shipment.courierName,
    awb:         shipment.awbNumber,
    statusAfter: shipment.status,
  });

  return shipment;
};

export const schedulePickup = async (orderId, pickupDate, pickupTime = null, warehouseAddress = null) => {
  const shipment = await Shipment.findOne({ orderId }).populate("orderId");
  if (!shipment) throw new ShipmentNotFoundError();

  const statusBefore = shipment.status;

  console.log("========== PICKUP SCHEDULE ==========");
  console.log({
    shipmentId:      String(shipment._id),
    orderId:         String(orderId),
    providerOrderId: shipment.providerOrderId,
    courier:         shipment.courierName || "",
    awb:             shipment.awbNumber   || "",
    statusBefore,
    pickupDate,
  });

  const payload = dto.buildSchedulePickupRequest({
    providerOrderId: shipment.providerOrderId,
    trackingId: shipment.trackingId,
    pickupDate,
    pickupTime,
    warehouseAddress
  });

  const { adapter, providerDoc } = await getShipmentBoundProvider(shipment);
  const idempotencyKey = buildShipmentOperationIdempotencyKey("schedulePickup", [
    shipment._id,
    pickupDate,
    pickupTime || "default",
  ]);
  const providerResponse = await executeBoundOperationWithIdempotency({
    method: "schedulePickup",
    payload,
    adapter,
    providerDoc,
    idempotencyKey,
  });

  if (providerResponse.awbNumber)   shipment.awbNumber   = providerResponse.awbNumber;
  if (providerResponse.courierName) shipment.courierName = providerResponse.courierName;
  if (providerResponse.referenceId) shipment.referenceId = providerResponse.referenceId;

  // AWB is the tracking identifier used by /track-order; set trackingId only if
  // it was empty (createOrder returns "" for Shipmozo — AWB comes from schedulePickup).
  if (providerResponse.awbNumber && !shipment.trackingId) {
    shipment.trackingId = providerResponse.awbNumber;
  }

  shipment.status = "PICKUP_SCHEDULED";
  shipment.pickupScheduledAt = buildPickupScheduledAt(
    providerResponse.scheduledDate,
    providerResponse.scheduledTime
  );

  const pickupDesc = providerResponse.awbNumber
    ? `Pickup scheduled — AWB: ${providerResponse.awbNumber}`
    : `Pickup scheduled for ${providerResponse.scheduledDate ?? pickupDate}`;

  shipment.timeline.push({
    status: "PICKUP_SCHEDULED",
    description: pickupDesc,
    timestamp: new Date()
  });

  await shipment.save();

  console.log("Pickup Schedule Result:", {
    shipmentId:  String(shipment._id),
    courier:     shipment.courierName,
    awb:         shipment.awbNumber,
    trackingId:  shipment.trackingId,
    statusAfter: shipment.status,
  });

  return shipment;
};

export const cancelShipment = async (orderId, reason = "Cancelled by admin") => {
  const shipment = await Shipment.findOne({ orderId }).populate("orderId");
  if (!shipment) throw new ShipmentNotFoundError();

  const payload = dto.buildCancelOrderRequest({
    providerOrderId: shipment.providerOrderId,
    trackingId: shipment.trackingId,
    reason,
  });

  const { adapter, providerDoc } = await getShipmentBoundProvider(shipment);
  const idempotencyKey = buildShipmentOperationIdempotencyKey("cancelOrder", [
    shipment._id,
  ]);
  await executeBoundOperationWithIdempotency({
    method: "cancelOrder",
    payload,
    adapter,
    providerDoc,
    idempotencyKey,
  });

  shipment.status = "CANCELLED";
  shipment.timeline.push({
    status: "CANCELLED",
    description: `Shipment cancelled: ${reason}`,
    timestamp: new Date(),
  });

  await shipment.save();
  return shipment;
};

export const trackShipment = async (trackingId) => {
  const shipment = await Shipment.findOne({ trackingId });
  if (!shipment) throw new ShipmentNotFoundError();

  const payload = dto.buildTrackOrderRequest({ trackingId, awbNumber: shipment.awbNumber });
  const { adapter } = await getShipmentBoundProvider(shipment);
  const providerResponse = await adapter.trackOrder(payload);

  // Sync to DB
  if (providerResponse.status) shipment.status = providerResponse.status;
  if (providerResponse.statusCode) shipment.statusCode = providerResponse.statusCode;
  if (providerResponse.currentLocation) shipment.currentLocation = providerResponse.currentLocation;
  if (providerResponse.estimatedDelivery) shipment.estimatedDelivery = providerResponse.estimatedDelivery;

  if (providerResponse.timeline.length > 0) {
    // Merge: keep local events (CREATED, COURIER_ASSIGNED, etc.) and
    // append incoming provider events that aren't already present.
    const existing = shipment.timeline || [];
    const merged = [...existing];
    for (const event of providerResponse.timeline) {
      const isDup = merged.some(
        (e) =>
          e.status === event.status &&
          Math.abs(new Date(e.timestamp) - new Date(event.timestamp)) < 60_000
      );
      if (!isDup) merged.push(event);
    }
    merged.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    shipment.timeline = merged;
  }

  if (["DELIVERED", "delivered"].includes(providerResponse.status)) {
    shipment.isDelivered = true;
    if (shipment.isReturn) {
      // If it's a return, DELIVERED means it's back at warehouse
      await Return.findOneAndUpdate({ shipmentId: shipment._id }, { status: "PICKED_UP" }); 
    } else {
      await Order.findByIdAndUpdate(shipment.orderId, { orderStatus: "DELIVERED" });
    }
  } else if (["RTO_DELIVERED", "rto_delivered"].includes(providerResponse.status)) {
    shipment.isReturned = true;
  } else if (["PICKED_UP", "picked_up"].includes(providerResponse.status)) {
    if (shipment.isReturn) {
      await Return.findOneAndUpdate({ shipmentId: shipment._id }, { status: "PICKED_UP", pickedUpAt: new Date() });
    }
  }

  await shipment.save();
  return shipment;
};

export const generateLabel = async (trackingId, format = "pdf") => {
  const shipment = await Shipment.findOne({ trackingId });
  if (!shipment) throw new ShipmentNotFoundError();

  if (shipment.labelUrl && format === "pdf") {
      return { labelUrl: shipment.labelUrl, format: "pdf" };
  }

  const payload = dto.buildGenerateLabelRequest({ trackingId, awbNumber: shipment.awbNumber, format });
  const { adapter } = await getShipmentBoundProvider(shipment);
  const providerResponse = await adapter.generateLabel(payload);

  shipment.labelUrl = providerResponse.labelUrl;
  await shipment.save();

  return providerResponse;
};

export const calculateRates = async (params) => {
  const cacheKey = buildRateKey({
    provider: params.providerName || "auto",
    originPincode: params.originPincode,
    destinationPincode: params.destinationPincode,
    weight: params.weight,
    paymentMode: params.paymentMode,
  });

  const cached = getRateFromCache(cacheKey);
  if (cached) return cached;

  const payload = dto.buildCalculateRatesRequest(params);
  
  let providerResponse;
  
  if (params.providerName) {
      const { adapter } = await getProviderByName(params.providerName);
      providerResponse = await adapter.calculateRates(payload);
  } else {
      // Use best provider based on context
      const { result } = await executeWithFallback("calculateRates", payload, {
          originPincode: params.originPincode,
          destinationPincode: params.destinationPincode,
          weight: params.weight,
          paymentMode: params.paymentMode
      });
      providerResponse = result;
  }

  // Determine if it's an express request (simple heuristic based on requested params)
  const isExpress = params.isExpress || false;
  
  setRateInCache(cacheKey, providerResponse, { isExpress });
  
  return providerResponse;
};

export const checkServiceability = async (params) => {
    const payload = dto.buildServiceabilityRequest(params);
    const { result } = await executeWithFallback("checkServiceability", payload, {
          originPincode: params.originPincode,
          destinationPincode: params.destinationPincode,
          weight: params.weight,
          paymentMode: params.paymentMode
    });
    return result;
};


/* ── Webhook Handling ────────────────────────────────────────────────────── */

const DEFAULT_WEBHOOK_TOLERANCE_MS = 5 * 60 * 1000;

function verifyWebhookSignature(providerDoc, headers, rawBody) {
  if (!providerDoc?.config?.webhookSecret) {
    throw new ShipmentConfigError(
      `Webhook secret is not configured for provider "${providerDoc?.name || "unknown"}"`,
      { provider: providerDoc?.name || null }
    );
  }

  const signature = headers["x-webhook-signature"] || headers["x-shipmozo-signature"];
  if (!signature) {
    throw new WebhookAuthError("Missing webhook signature header");
  }

  const timestampHeader = headers["x-webhook-timestamp"];
  if (!timestampHeader) {
    throw new WebhookAuthError("Missing webhook timestamp header");
  }

  const timestamp = Array.isArray(timestampHeader)
    ? timestampHeader[0]
    : timestampHeader;
  const parsedTimestamp = new Date(timestamp);
  if (Number.isNaN(parsedTimestamp.getTime())) {
    console.warn("[WebhookAuth] Invalid webhook timestamp", {
      provider: providerDoc.name,
      timestamp,
    });
    throw new WebhookAuthError("Invalid webhook timestamp");
  }

  const configuredTolerance = Number(
    providerDoc.config?.webhookToleranceMs ??
      process.env.SHIPMENT_WEBHOOK_TOLERANCE_MS ??
      DEFAULT_WEBHOOK_TOLERANCE_MS
  );
  const toleranceMs =
    Number.isFinite(configuredTolerance) && configuredTolerance > 0
      ? configuredTolerance
      : DEFAULT_WEBHOOK_TOLERANCE_MS;

  if (Math.abs(Date.now() - parsedTimestamp.getTime()) > toleranceMs) {
    console.warn("[WebhookAuth] Expired webhook timestamp", {
      provider: providerDoc.name,
      timestamp,
      toleranceMs,
    });
    throw new WebhookAuthError("Expired webhook timestamp");
  }

  const expectedSignature = crypto
    .createHmac("sha256", providerDoc.config.webhookSecret)
    .update(`${timestamp}.${rawBody || ""}`)
    .digest("hex");

  const providedSignature = String(signature).trim().replace(/^sha256=/i, "");
  const providedBuffer = Buffer.from(providedSignature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    console.warn("[WebhookAuth] Webhook signature mismatch", {
      provider: providerDoc.name,
    });
    throw new WebhookAuthError("Webhook signature mismatch");
  }
  
  return true;
}

export const processWebhook = async (providerName, headers, rawBody, payload) => {
   const providerDoc = await ShippingProvider.findOne({
      name: providerName?.toLowerCase?.(),
      isActive: true
   });
   if (!providerDoc) {
      console.warn(`[WebhookAuth] Webhook received for unknown or inactive provider: ${providerName}`);
      return null;
   }
   
   // Verify Signature
   verifyWebhookSignature(providerDoc, headers, rawBody);
   
   // Assuming standard webhook shape for now, adapters could provide parsing in future
   const trackingId = payload.trackingId || payload.tracking_id || payload.awb;
   if (!trackingId) return null;
   
   try {
       // Sync tracking using our method
       return await trackShipment(trackingId);
   } catch(err) {
       console.error(`[Webhook] Failed to process trackingId ${trackingId}:`, err);
       return null;
   }
};

/* ── Backfill ────────────────────────────────────────────────────────────── */

export const backfillShipments = async (providerName = "shipmozo") => {
  const shipments = await Shipment.find({
    provider: providerName,
    status: "CREATED",
  }).select("_id orderId providerOrderId courierName awbNumber status").lean();

  const pickupDate = new Date().toISOString().slice(0, 10);

  console.log("========== BACKFILL START ==========");
  console.log({ provider: providerName, total: shipments.length, pickupDate });

  const summary = {
    processed: shipments.length,
    successful: 0,
    failed: 0,
    errors: [],
  };

  for (let i = 0; i < shipments.length; i++) {
    const s = shipments[i];
    const shipmentId = String(s._id);

    console.log(`[Backfill ${i + 1}/${shipments.length}]`, {
      shipmentId,
      orderId:         String(s.orderId),
      providerOrderId: s.providerOrderId,
      courier:         s.courierName || "",
      awb:             s.awbNumber   || "",
      statusBefore:    s.status,
    });

    try {
      await assignCourier(s.orderId);
      await schedulePickup(s.orderId, pickupDate);
      summary.successful++;
    } catch (err) {
      summary.failed++;
      summary.errors.push({ shipmentId, error: err.message });
      console.log(`[Backfill ${i + 1}/${shipments.length}] FAILED:`, err.message);
    }
  }

  console.log("========== BACKFILL COMPLETE ==========");
  console.log(summary);

  return summary;
};

/* ── Admin Queries ───────────────────────────────────────────────────────── */

export const getAllShipments = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.provider) query.provider = filters.provider;
  if (filters.isDelivered !== undefined) query.isDelivered = filters.isDelivered === "true";

  return Shipment.find(query)
    .populate("orderId", "orderNumber orderStatus pricing")
    .populate("userId", "name email phone")
    .populate("providerId", "displayName")
    .sort({ createdAt: -1 });
};

export const getShipmentByOrderId = async (orderId) => {
  const shipment = await Shipment.findOne({ orderId })
    .populate("orderId")
    .populate("userId", "name email phone");
  if (!shipment) throw new ShipmentNotFoundError();
  return shipment;
};

export const getTrackingByOrderId = async (orderId) => {
  const shipment = await Shipment.findOne({ orderId }).lean();
  if (!shipment) throw new ShipmentNotFoundError();

  return {
    trackingId: shipment.trackingId,
    awbNumber: shipment.awbNumber,
    status: shipment.status,
    currentLocation: shipment.currentLocation,
    trackingUrl: shipment.trackingUrl,
    estimatedDelivery: shipment.estimatedDelivery,
    isDelivered: shipment.isDelivered,
    timeline: shipment.timeline,
  };
};

/* ── Provider Management (CRUD) ──────────────────────────────────────────── */

export const getProviders = async () => {
    const providers = await ShippingProvider.find().lean();
    // The dispatch UI keeps mock available so staff can complete dry runs while
    // real carrier credentials are being configured.
    const hasMock = providers.some(p => p.name === 'mock');
    if (!hasMock) {
      providers.push({
        _id: 'mock_id',
        name: 'mock',
        displayName: 'Mock / Test',
        isActive: true,
        priority: 999,
        supportedMethods: ['COD', 'PREPAID'],
        isFallback: false,
        fallbackPriority: 100
      });
    }
    return providers;
};

export const getDispatchRecommendation = async (orderId) => {
  const order = await Order.findById(orderId).lean();
  if (!order) throw new ShipmentNotFoundError("Order not found");

  let weight = 0;
  try {
    weight = await resolveOrderWeight(order);
  } catch {
    weight = (order.items ?? []).reduce(
      (sum, item) => sum + (Number(item.weight) || 0) * (Number(item.quantity) || 1),
      0
    );
  }
  const context = {
    ...buildShipmentContext(order),
    pincode: order.shippingAddress?.postalCode,
    city: order.shippingAddress?.city,
    weight,
  };

  const allProviders = await getProviders();
  let providerDoc = null;

  try {
    const selected = await getProvider(context);
    providerDoc = selected?.providerDoc ?? null;
  } catch {
    providerDoc = allProviders.find((provider) => provider.name === "mock") ?? null;
  }

  if (!providerDoc) {
    providerDoc = allProviders.find((provider) => provider.isActive) ?? allProviders[0] ?? null;
  }
  const selectableProviders = allProviders.filter((provider) => provider.isActive);

  return {
    recommended: {
      id: providerDoc?._id ?? null,
      name: providerDoc?.name ?? "mock",
      displayName: providerDoc?.displayName ?? "Mock / Test"
    },
    available: selectableProviders.map(p => ({
      id: p._id,
      name: p.name,
      displayName: p.displayName,
      isActive: p.isActive
    })),
    options: selectableProviders.map(p => ({
      id: p._id,
      name: p.name,
      displayName: p.displayName,
      isActive: p.isActive
    }))
  };
};

export const getProviderById = async (id) => {
    return ShippingProvider.findById(id);
};

export const createProvider = async (data) => {
    const provider = new ShippingProvider(data);
    await provider.save();
    return provider;
};

export const updateProvider = async (id, data) => {
    const provider = await ShippingProvider.findByIdAndUpdate(id, data, { new: true });
    
    // Invalidate caches if config changed
    if (provider) {
       clearAdapterCache(provider._id);
       invalidateProviderRates(provider.name);
    }
    
    return provider;
};

export const disableProvider = async (id) => {
    const provider = await ShippingProvider.findByIdAndUpdate(id, { isActive: false, isDeleted: true, deletedAt: new Date() }, { new: true });

    if (provider) {
       clearAdapterCache(provider._id);
       invalidateProviderRates(provider.name);
    }
    return provider;
};

/* ── Provider Priority Manager ───────────────────────────────────────────── */

/**
 * Bulk re-sequence provider priorities.
 * Accepts an array of {id, priority} — re-assigns each provider's priority
 * value in a single bulkWrite. Validates no duplicate priorities in the input.
 * Returns the full provider list after the write.
 */
export const reorderProviders = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ShipmentValidationError("items must be a non-empty array of {id, priority} objects.");
  }

  // Validate uniqueness of submitted priorities
  const priorities = items.map((i) => i.priority);
  if (new Set(priorities).size !== priorities.length) {
    throw new ShipmentValidationError("Duplicate priority values in reorder request. Each provider must have a unique priority.");
  }

  // Skip synthetic/placeholder rows (e.g. the "mock" provider has a fake string
  // _id and no DB document); their invalid _id would otherwise fail the bulkWrite.
  const bulkOps = items
    .filter(({ id }) => mongoose.Types.ObjectId.isValid(id))
    .map(({ id, priority }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { priority } },
      },
    }));

  if (bulkOps.length > 0) {
    await ShippingProvider.bulkWrite(bulkOps);
  }
  return ShippingProvider.find().sort({ priority: 1 });
};

/**
 * Toggle a provider's isFallback status and set its fallbackPriority.
 * After update, re-sequences fallbackPriority for all isFallback providers
 * (1, 2, 3… in ascending order of current fallbackPriority) to close any gaps.
 * Returns the full provider list.
 */
export const toggleProviderFallback = async (id, { isFallback, fallbackPriority }) => {
  // `mock_id` is the synthetic id from getProviders() — the mock row isn't in the DB,
  // so any mutation against it would hit a Mongoose cast error with a confusing message.
  if (id === "mock_id" || !mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Mock / Test provider is a UI placeholder and cannot be set as a fallback. Configure a real carrier first.");
    err.statusCode = 400;
    throw err;
  }

  const provider = await ShippingProvider.findById(id);
  if (!provider) throw new ShipmentNotFoundError("Provider not found.");

  await ShippingProvider.findByIdAndUpdate(id, {
    $set: { isFallback, fallbackPriority: fallbackPriority ?? provider.fallbackPriority },
  });

  // Re-sequence all fallback providers to close gaps (1, 2, 3…)
  const fallbackProviders = await ShippingProvider.find({ isFallback: true }).sort({ fallbackPriority: 1 });
  if (fallbackProviders.length > 0) {
    const resequencedOps = fallbackProviders.map((p, idx) => ({
      updateOne: {
        filter: { _id: p._id },
        update: { $set: { fallbackPriority: idx + 1 } },
      },
    }));
    await ShippingProvider.bulkWrite(resequencedOps);
  }

  return ShippingProvider.find().sort({ priority: 1 });
};

/**
 * Toggle isActive on a provider (reversible, does not soft-delete).
 * Clears adapter and rate caches when deactivating.
 */
export const toggleProviderActive = async (id) => {
  const provider = await ShippingProvider.findById(id);
  if (!provider) throw new ShipmentNotFoundError("Provider not found.");

  const updated = await ShippingProvider.findByIdAndUpdate(
    id,
    { $set: { isActive: !provider.isActive } },
    { new: true }
  );

  if (!updated.isActive) {
    clearAdapterCache(updated._id);
    invalidateProviderRates(updated.name);
  }

  return updated;
};
