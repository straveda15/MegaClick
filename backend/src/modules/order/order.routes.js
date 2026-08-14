import express from "express";
import * as orderController from "./order.controller.js";
import * as orderEditController from "./order.edit.controller.js";
import { getUserTracking } from "../shipment/shipment.controller.js";
import { authenticateUser } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// User routes
router.post("/", authenticateUser, orderController.createOrder);
router.post("/:id/pay", authenticateUser, orderController.payOrder);
router.post("/:id/verify", authenticateUser, orderController.verifyPayment);
router.post("/:id/bypass-verify", authenticateUser, orderController.bypassPaymentVerification);
router.get("/my", authenticateUser, orderController.getMyOrders);
router.get("/:id/tracking", authenticateUser, getUserTracking);
router.get("/:id", authenticateUser, orderController.getOrder);
router.patch("/:id/confirm", authenticateUser, orderController.confirmCodOrder);
router.post("/:id/cancel", authenticateUser, orderController.cancelOrder);

// Admin / Employee routes — any authenticated user can read orders
router.get("/", authenticateUser, orderController.getAllOrders);
router.patch("/:id/status", authenticateUser, orderController.updateOrderStatus);
router.post("/:id/dispatch", authenticateUser, orderController.dispatchOrder);

// Edit order (role-gated inside controller)
router.get("/:id/edit-status", authenticateUser, orderEditController.getOrderEditStatus);
router.patch("/:id/edit", authenticateUser, orderEditController.editOrderById);


export default router;