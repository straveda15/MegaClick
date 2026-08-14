import express from "express";
import * as opsNotificationController from "./ops-notification.controller.js";
import { authenticateUser } from "../../../shared/middleware/ops.middleware.js";

const router = express.Router();

router.get("/", authenticateUser, opsNotificationController.getNotifications);
router.patch("/:id/read", authenticateUser, opsNotificationController.markAsRead);

export default router;
