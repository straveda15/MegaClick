import express from "express";
import * as rawMaterialController from "./raw-material.controller.js";
import { authenticateUser, restrictTo, requireOpsRole } from "../../../shared/middleware/ops.middleware.js";

const router = express.Router();

router.get("/", authenticateUser, requireOpsRole("warehouse", "production"), rawMaterialController.getRawMaterials);
router.get("/:id", authenticateUser, requireOpsRole("warehouse", "production"), rawMaterialController.getRawMaterial);

router.post("/:id/consume", authenticateUser, requireOpsRole("production"), rawMaterialController.consumeStock);
router.post("/:id/receive", authenticateUser, requireOpsRole("warehouse"), rawMaterialController.receiveStock);

router.post("/", authenticateUser, restrictTo("admin"), rawMaterialController.createRawMaterial);
router.patch("/:id", authenticateUser, restrictTo("admin"), rawMaterialController.updateRawMaterial);
router.delete("/:id", authenticateUser, restrictTo("admin"), rawMaterialController.deleteRawMaterial);

export default router;
