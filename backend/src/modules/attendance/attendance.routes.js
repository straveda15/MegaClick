import express from "express";
import {
  punchIn,
  punchOut,
  getTodayAttendance,
  getAttendanceByDate,
  getAttendanceByUser,
  overrideAttendance,
  deleteAttendance,
  selfPunchIn,
  selfPunchOut,
  getMyAttendance,
  getMyTodayAttendance,
  approveEarlyPunchOut,
  approveHalfDay,
  getPendingAttendance,
} from "./attendance.controller.js";
import { protect, requireHR, requireEmployee, requireManager, requireProductionStaff, requireOperationsStaff, requireEmployeeAppAccess, requirePageAccess } from "../../shared/middleware/auth.middleware.js";
import workLocationRouter from "./workLocation.routes.js";

const router = express.Router();

router.use(protect);

// ── Work location management (sub-router — see workLocation.routes.js for its
// own per-route access grant) ─────────────────────────────────────────────────
// Must be mounted before parametric routes to avoid conflicts.
router.use("/work-locations", workLocationRouter);

// ── Self-service (available to all employees) ──
router.post("/me/punch-in", requireEmployeeAppAccess, selfPunchIn);
router.post("/me/punch-out", requireEmployeeAppAccess, selfPunchOut);
router.get("/me/today", requireEmployeeAppAccess, getMyTodayAttendance);
router.get("/me", requireEmployeeAppAccess, getMyAttendance);

// HR/Manager — Dashboard / Management view
router.post("/override", requirePageAccess("/people/attendance", ["hr"]), overrideAttendance);
router.get("/", requirePageAccess("/people/attendance", ["hr", "manager"]), getAttendanceByDate);
router.get("/today", requirePageAccess(["/", "/people/attendance"], ["hr", "manager"]), getTodayAttendance);
// Every early-punch-out / half-day request still awaiting approval, across all
// dates — feeds the "pending from other dates" banner on HR & Leave.
router.get("/pending", requirePageAccess("/people/attendance", ["hr", "manager"]), getPendingAttendance);

// View specific user history
router.get("/user/:id", requirePageAccess("/people/attendance", ["hr", "manager"]), getAttendanceByUser);

// Approve early punch-out
router.patch("/:id/approve-early-punch-out", requirePageAccess("/people/attendance", ["hr", "admin"]), approveEarlyPunchOut);

// Approve half-day
router.patch("/:id/approve-half-day", requirePageAccess("/people/attendance", ["hr", "admin"]), approveHalfDay);

// Delete record (Soft Delete)
router.delete("/:id", requirePageAccess("/people/attendance", ["hr"]), deleteAttendance);


export default router;
