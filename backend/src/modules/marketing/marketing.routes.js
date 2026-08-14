import express from "express";
import multer from "multer";
import * as marketingController from "./marketing.controller.js";
import { protect, requirePageAccess } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Apply protection to all dashboard/dataset routes
router.use(["/dashboard", "/dataset", "/revenue", "/assisted-conversions", "/meta", "/sync"], protect, requirePageAccess("/marketing/overview"));

const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: 50 * 1024 * 1024 } 
});

// ── Dashboard APIs ──
router.get("/dashboard/kpis", marketingController.getDashboardKpis);
router.get("/dashboard/timeseries", marketingController.getSpendRevenueTimeseries);
router.get("/dashboard/campaigns", marketingController.getCampaignPerformance);
router.get("/dashboard/funnel", marketingController.getConversionFunnel);
router.get("/dashboard/products", marketingController.getProductPerformance);
router.get("/dashboard/creatives", marketingController.getCreativePerformance);
router.get("/dashboard/budget", marketingController.getBudgetVsActual);
router.get("/dashboard/agency", marketingController.getAgencyTransparency);
router.get("/dashboard/insights", marketingController.getAiInsights);

// ── Attribution ──
router.get("/revenue/by-source", marketingController.getRevenueBySource);
router.get("/assisted-conversions", marketingController.getAssistedConversions);

// ── Dataset ──
router.get("/dataset/device-breakdown", marketingController.getDeviceBreakdown);
router.get("/dataset/keyword-performance", marketingController.getKeywordPerformance);
router.get("/dataset/campaign-detail", marketingController.getFullCampaignMetrics);

// ── Meta ──
router.get("/meta/summary", marketingController.getMetaSummaryV2);
router.get("/meta/kpis", marketingController.getMetaKpisV2);
router.get("/meta/timeseries", marketingController.getMetaTimeseries);
router.get("/meta/coverage", marketingController.getDataCoverage);

// ── Manual Sync ──
router.post("/sync", marketingController.syncPlatformData);


// ── Live Event Tracking (from website) ──
router.post("/track", marketingController.trackEvent);

export default router;
