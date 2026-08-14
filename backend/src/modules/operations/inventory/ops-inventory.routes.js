import express from "express";
import * as opsInventoryController from "./ops-inventory.controller.js";
import { authenticateUser, restrictTo, requirePageAccess } from "../../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateUser, requirePageAccess("/operations/inventory"), opsInventoryController.getInventory);
router.patch("/:id", authenticateUser, requirePageAccess("/operations/inventory"), opsInventoryController.updateInventory);

router.post("/", authenticateUser, restrictTo("admin"), opsInventoryController.createInventory);
router.post("/adjust", authenticateUser, requirePageAccess("/operations/inventory"), opsInventoryController.adjustInventory);
router.post("/threshold", authenticateUser, requirePageAccess("/operations/inventory"), opsInventoryController.applyThreshold);

router.delete("/:id", authenticateUser, restrictTo("admin"), opsInventoryController.deleteInventory);

export default router;
