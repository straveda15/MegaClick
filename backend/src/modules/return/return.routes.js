import express from "express";
import * as returnController from "./return.controller.js";
import { authenticateUser, restrictTo } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// User Routes
router.post("/request", authenticateUser, restrictTo("user", "admin", "employee"), returnController.requestReturn);
router.get("/my", authenticateUser, restrictTo("user", "admin", "employee"), returnController.getMyReturns);

// Admin / Employee Routes
router.get("/", authenticateUser, restrictTo("admin", "employee"), returnController.getAllReturns);
router.get("/:id", authenticateUser, returnController.getReturnById);
router.patch("/:id/approve", authenticateUser, restrictTo("admin", "employee"), returnController.approveReturn);
router.patch("/:id/reject", authenticateUser, restrictTo("admin", "employee"), returnController.rejectReturn);
router.patch("/:id/refund", authenticateUser, restrictTo("admin", "employee"), returnController.markAsRefunded);
router.patch("/:id/pickup", authenticateUser, restrictTo("admin", "employee"), returnController.markAsPickedUp);

export default router;