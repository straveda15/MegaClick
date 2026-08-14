/**
 * Shipment Controller.
 * Endpoints for shipment management and provider management.
 */

import * as shipmentService from "./shipment.service.js";
import {
  createShipmentSchema,
  assignCourierSchema,
  schedulePickupSchema,
  cancelShipmentSchema,
  calculateRatesSchema,
  serviceabilitySchema,
  providerDBSchema,
  updateProviderSchema,
  reorderProvidersSchema,
  fallbackToggleSchema,
} from "./shipment.validation.js";
import Order from "../order/order.model.js";

const fail = (res, status, message, error = message) =>
  res.status(status).json({ success: false, message, data: null, error });

const ok = (res, data, message = "Success", status = 200) =>
  res.status(status).json({ success: true, message, data, error: null });

/* ═══════════════════════════════════════════════════════════════════════════
   SHIPMENT OPERATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

export const createShipment = async (req, res, next) => {
  try {
    const { error } = createShipmentSchema.validate({ orderId: req.params.orderId });
    if (error) return fail(res, 400, error.details[0].message);

    const order = await Order.findById(req.params.orderId);
    if (!order) return fail(res, 404, "Order not found");

    const shipment = await shipmentService.createShipment(order);
    return ok(res, shipment, "Shipment created successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const assignCourier = async (req, res, next) => {
  try {
    const { error, value } = assignCourierSchema.validate(req.body);
    if (error) return fail(res, 400, error.details[0].message);

    const shipment = await shipmentService.assignCourier(value.orderId, value.courierId, value.autoAssign);
    return ok(res, shipment, "Courier assigned");
  } catch (error) {
    next(error);
  }
};

export const schedulePickup = async (req, res, next) => {
  try {
    const { error, value } = schedulePickupSchema.validate(req.body);
    if (error) return fail(res, 400, error.details[0].message);

    const shipment = await shipmentService.schedulePickup(value.orderId, value.pickupDate, value.pickupTime, value.warehouseAddress);
    return ok(res, shipment, "Pickup scheduled");
  } catch (error) {
    next(error);
  }
};

export const cancelShipment = async (req, res, next) => {
  try {
    const { error, value } = cancelShipmentSchema.validate(req.body);
    if (error) return fail(res, 400, error.details[0].message);

    const shipment = await shipmentService.cancelShipment(value.orderId, value.reason);
    return ok(res, shipment, "Shipment cancelled");
  } catch (error) {
    next(error);
  }
};

export const trackShipment = async (req, res, next) => {
  try {
    const trackingId = req.params.trackingId;
    const tracking = await shipmentService.trackShipment(trackingId);
    return ok(res, tracking, "Tracking fetched");
  } catch (error) {
    next(error);
  }
};

export const generateLabel = async (req, res, next) => {
   try {
     const trackingId = req.params.trackingId;
     const format = req.query.format || "pdf";
     const label = await shipmentService.generateLabel(trackingId, format);
     return ok(res, label, "Label generated");
   } catch (error) {
     next(error);
   }
};

export const calculateRates = async (req, res, next) => {
  try {
    const { error, value } = calculateRatesSchema.validate(req.body);
    if (error) return fail(res, 400, error.details[0].message);

    const rates = await shipmentService.calculateRates(value);
    return ok(res, rates, "Rates calculated");
  } catch (error) {
    next(error);
  }
};

export const checkServiceability = async (req, res, next) => {
  try {
    const { error, value } = serviceabilitySchema.validate(req.body);
    if (error) return fail(res, 400, error.details[0].message);

    const serviceability = await shipmentService.checkServiceability(value);
    return ok(res, serviceability, "Serviceability check complete");
  } catch (error) {
    next(error);
  }
};

export const backfillShipments = async (req, res, next) => {
  try {
    const providerName = req.body?.provider ?? "shipmozo";
    const summary = await shipmentService.backfillShipments(providerName);
    return ok(res, summary, "Backfill complete");
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN QUERIES
   ═══════════════════════════════════════════════════════════════════════════ */

export const getAllShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getAllShipments(req.query);
    return ok(res, shipments, "Shipments fetched");
  } catch (error) {
    next(error);
  }
};

export const getShipmentByOrderId = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentByOrderId(req.params.orderId);
    return ok(res, shipment, "Shipment fetched");
  } catch (error) {
    next(error);
  }
};

export const getRecommendation = async (req, res, next) => {
  try {
    const recommendation = await shipmentService.getDispatchRecommendation(req.params.orderId);
    return ok(res, recommendation, "Recommendation fetched");
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   USER QUERIES
   ═══════════════════════════════════════════════════════════════════════════ */

export const getUserTracking = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) return fail(res, 404, "Order not found");

    if (req.user.role !== "admin" && order.userId.toString() !== req.user._id.toString()) {
      return fail(res, 403, "Not authorized to view this tracking");
    }

    const tracking = await shipmentService.getTrackingByOrderId(orderId);
    return ok(res, { tracking }, "Tracking fetched successfully");
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   WEBHOOK
   ═══════════════════════════════════════════════════════════════════════════ */

export const webhookUpdate = async (req, res, next) => {
  try {
    // We expect the provider name as a URL parameter /api/v1/shipment/webhook/:providerName
    const providerName = req.params.providerName || req.query.provider || "mock";
    
    // In express, raw body might need to be configured for signature validation.
    // For now, stringify the parsed body, but in a real app you'd use a raw body parser middlware
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const result = await shipmentService.processWebhook(providerName, req.headers, rawBody, req.body);
    
    if (!result) {
        return fail(res, 400, "Webhook processing failed or ignored");
    }
    return ok(res, null, "Webhook processed");
  } catch (error) {
    next(error);
  }
};

/* ═══════════════════════════════════════════════════════════════════════════
   PROVIDER MANAGEMENT (CRUD)
   ═══════════════════════════════════════════════════════════════════════════ */

export const getProviders = async (req, res, next) => {
    try {
        const providers = await shipmentService.getProviders();
        return ok(res, providers, "Providers fetched");
    } catch(err) { next(err); }
};

export const getProviderById = async (req, res, next) => {
    try {
        const provider = await shipmentService.getProviderById(req.params.id);
        if (!provider) return fail(res, 404, "Provider not found");
        return ok(res, provider, "Provider fetched");
    } catch(err) { next(err); }
};

export const createProvider = async (req, res, next) => {
    try {
        const { error, value } = providerDBSchema.validate(req.body);
        if (error) return fail(res, 400, error.details[0].message);
        const provider = await shipmentService.createProvider(value);
        return ok(res, provider, "Provider created", 201);
    } catch(err) { next(err); }
};

export const updateProvider = async (req, res, next) => {
    try {
        const { error, value } = updateProviderSchema.validate(req.body);
        if (error) return fail(res, 400, error.details[0].message);
        const provider = await shipmentService.updateProvider(req.params.id, value);
        if (!provider) return fail(res, 404, "Provider not found");
        return ok(res, provider, "Provider updated");
    } catch(err) { next(err); }
};

export const disableProvider = async (req, res, next) => {
    try {
        const provider = await shipmentService.disableProvider(req.params.id);
        if (!provider) return fail(res, 404, "Provider not found");
        return ok(res, provider, "Provider disabled");
    } catch(err) { next(err); }
};

export const reorderProviders = async (req, res, next) => {
    try {
        const { error, value } = reorderProvidersSchema.validate(req.body);
        if (error) return fail(res, 400, error.details[0].message);
        const providers = await shipmentService.reorderProviders(value.items);
        return ok(res, providers, "Provider priorities updated");
    } catch(err) { next(err); }
};

export const toggleProviderFallback = async (req, res, next) => {
    try {
        const { error, value } = fallbackToggleSchema.validate(req.body);
        if (error) return fail(res, 400, error.details[0].message);
        const providers = await shipmentService.toggleProviderFallback(req.params.id, value);
        return ok(res, providers, "Provider fallback status updated");
    } catch(err) { next(err); }
};

export const toggleProviderActive = async (req, res, next) => {
    try {
        const provider = await shipmentService.toggleProviderActive(req.params.id);
        return ok(res, provider, `Provider ${provider.isActive ? "activated" : "deactivated"}`);
    } catch(err) { next(err); }
};
