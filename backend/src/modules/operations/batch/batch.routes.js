import express from "express";
import * as batchController from "./batch.controller.js";
import { authenticateUser, restrictTo, requirePageAccess } from "../../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Allows any employee with an operational role (production, warehouse, packaging, ops_staff)
// Checks both the currentOperationalRole string AND the operationalRoles array so either
// is sufficient — staff don't always have currentOperationalRole set in their session.
const ALLOWED_OPS_ROLES = ["production", "packaging", "warehouse", "ops_staff"];

const requireAdvanceAccess = (req, res, next) => {
  const { role, currentOperationalRole, operationalRoles = [] } = req.user;
  if (role === "admin") return next();
  if (role === "production_staff") return next();
  if (
    role === "employee" && (
      ALLOWED_OPS_ROLES.includes(currentOperationalRole) ||
      operationalRoles.some(r => ALLOWED_OPS_ROLES.includes(r))
    )
  ) return next();
  return res.status(403).json({ success: false, message: "Permission denied. Production access required." });
};

/* ── Admin: batch lifecycle management ──────────────────────────────────── */
router.post("/", authenticateUser, restrictTo("admin"), batchController.createBatch);
router.patch("/:id", authenticateUser, requirePageAccess("/operations/batches"), batchController.updateBatch);
router.delete("/:id", authenticateUser, restrictTo("admin"), batchController.deleteBatch);

/* ── Lifecycle transitions ──────────────────────────────────────────────── */
router.post(
  "/:id/reserve-inventory",
  authenticateUser,
  requirePageAccess("/operations/batches"),
  batchController.reserveInventory
);

router.post(
  "/:id/advance",
  authenticateUser,
  requireAdvanceAccess,
  batchController.advanceStage
);

router.post(
  "/:id/qc",
  authenticateUser,
  requireAdvanceAccess,
  batchController.runQualityCheck
);

router.post(
  "/:id/assign-shipment",
  authenticateUser,
  requirePageAccess("/operations/batches"),
  batchController.assignShipment
);

/* ── Read ────────────────────────────────────────────────────────────────── */
router.get(
  "/",
  authenticateUser,
  requirePageAccess("/operations/batches", ["production_staff"]),
  batchController.getBatches
);
router.get(
  "/:id",
  authenticateUser,
  requirePageAccess("/operations/batches", ["production_staff"]),
  batchController.getBatch
);


export default router;
