import express from "express";
import * as refundController from "./refund.controller.js";
import { authenticateUser as authenticate } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// User routes
router.get("/my-refunds", authenticate, refundController.getUserRefunds);

// Any authenticated employee can access refund data (sidebar hides this for unauthorized users)
router.get("/", authenticate, refundController.getRefunds);
router.get("/:id", authenticate, refundController.getRefundById);
router.post("/initiate", authenticate, refundController.initiateRefund);
router.patch("/:id/process", authenticate, refundController.processRefund);

export default router;
