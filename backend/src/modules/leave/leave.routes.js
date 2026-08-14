import express from "express";
import {
  applyLeave,
  approveLeave,
  rejectLeave,
  listLeaves,
  getLeavesByUser,
  getPendingLeaves,
  deleteLeave,
  getMyLeaves,
  getMyLeaveBalance,
  applyLeaveForSelf,
  cancelMyLeave,
} from "./leave.controller.js";
import {
  protect,
  requireHR,
  requireManager,
  requireEmployee,
  requireProductionStaff,
  authenticateUser,
  requirePageAccess,
} from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser);

// ── Self-service (available to all) ───────────────────────────────────────
router.get("/me", getMyLeaves);
router.get("/me/balance", getMyLeaveBalance);
router.post("/me/apply", applyLeaveForSelf);
router.delete("/me/:id/cancel", cancelMyLeave);

// ── Management actions (HR/Manager/Granular) ───────────────────────────────
router.patch("/:id/approve", requirePageAccess("/people/hr", ["hr", "manager"]), approveLeave);
router.patch("/:id/reject", requirePageAccess("/people/hr", ["hr", "manager"]), rejectLeave);

// ── View actions (HR/Manager/Granular) ─────────────────────────────────────
router.get("/", requirePageAccess("/people/hr", ["hr", "manager"]), listLeaves);
router.get("/pending", requirePageAccess("/people/hr", ["hr", "manager"]), getPendingLeaves);
router.get("/user/:id", requirePageAccess("/people/hr", ["hr", "manager"]), getLeavesByUser);

// ── Delete (HR/Granular) ──────────────────────────────────────────────────
router.delete("/:id", requirePageAccess("/people/hr", ["hr"]), deleteLeave);


export default router;
