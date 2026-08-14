import express from "express";
import * as shipmentController from "./shipment.controller.js";
import { authenticateUser, requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

/* ── Provider Management (Admin) ────────────────────────────────────────────
   ORDERING: specific named paths MUST come before /:id to avoid Express
   treating "reorder" as a provider ObjectId.
   ──────────────────────────────────────────────────────────────────────── */
router.get("/providers", authenticateUser, shipmentController.getProviders);
router.post("/providers", authenticateUser, requireAdmin, shipmentController.createProvider);

// Named sub-paths before /:id
router.patch("/providers/reorder", authenticateUser, requireAdmin, shipmentController.reorderProviders);

router.get("/providers/:id", authenticateUser, shipmentController.getProviderById);
router.patch("/providers/:id", authenticateUser, requireAdmin, shipmentController.updateProvider);
router.patch("/providers/:id/disable", authenticateUser, requireAdmin, shipmentController.disableProvider);
router.patch("/providers/:id/toggle", authenticateUser, requireAdmin, shipmentController.toggleProviderActive);
router.patch("/providers/:id/fallback", authenticateUser, requireAdmin, shipmentController.toggleProviderFallback);

/* ── Rate & Serviceability (Admin / Dispatch) ───────────────────────────── */
router.post("/rates", authenticateUser, shipmentController.calculateRates);
router.post("/serviceability", authenticateUser, shipmentController.checkServiceability);

/* ── Webhook (no JWT auth — HMAC verified in service per-provider) ─────── */
router.post("/webhook/:providerName", shipmentController.webhookUpdate);

/* ── User-facing tracking (any authenticated user — ownership checked in controller) */
router.get("/orders/:id/track", authenticateUser, shipmentController.getUserTracking);

/* ── Shipment Management (Admin / Dispatch) ─────────────────────────────── */
router.post("/backfill", authenticateUser, requireAdmin, shipmentController.backfillShipments);
router.get("/", authenticateUser, shipmentController.getAllShipments);
router.post("/create/:orderId", authenticateUser, shipmentController.createShipment);
router.post("/assign", authenticateUser, shipmentController.assignCourier);
router.post("/pickup", authenticateUser, shipmentController.schedulePickup);
router.post("/cancel", authenticateUser, shipmentController.cancelShipment);
router.get("/track/:trackingId", authenticateUser, shipmentController.trackShipment);
router.patch("/:trackingId/sync", authenticateUser, shipmentController.trackShipment);
router.get("/label/:trackingId", authenticateUser, shipmentController.generateLabel);
router.get("/recommend/:orderId", authenticateUser, shipmentController.getRecommendation);
router.get("/:orderId", authenticateUser, shipmentController.getShipmentByOrderId);

export default router;
