import express from "express";

import * as serviceFeesController from "./serviceFees.controller.js";
import { authenticateUser, requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", serviceFeesController.listFees);
router.put("/:serviceSlug", requireAdmin, serviceFeesController.saveFee);

export default router;
