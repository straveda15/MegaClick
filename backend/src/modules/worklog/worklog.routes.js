import express from "express";
import * as workLogController from "./worklog.controller.js";
import { authenticateUser, requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// A person's own day-wise logs + adding a manual entry.
router.get("/my", authenticateUser, workLogController.getMyLogs);
router.post("/", authenticateUser, workLogController.createLog);

// Admin/founder/cofounder oversight — every person's logs.
router.get("/team", authenticateUser, requireAdmin, workLogController.getTeamLogs);

export default router;
