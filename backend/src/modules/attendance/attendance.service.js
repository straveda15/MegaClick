import Attendance from "./attendance.model.js";
import EmployeeProfile from "../team/team.model.js";
import AppError from "../../shared/utils/appError.js";
import { haversineDistanceMeters } from "../../shared/utils/geo.js";
import { findLocationForEmployee } from "./workLocation.service.js";

/**
 * Validates the site an employee declared for off-site work.
 *
 * Client-site work has no configured geofence, so there is nothing to check
 * them against — instead they say where they are, and that is recorded. The
 * coordinates still have to be real ones, so a typo can't be filed as a
 * location.
 */
const validateSite = (site) => {
  const name = String(site?.name ?? "").trim();
  if (!name) {
    throw new AppError("Enter the name of the site you are working from.", 400);
  }

  const lat = Number(site?.lat);
  const lng = Number(site?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new AppError("Enter the site's latitude and longitude.", 400);
  }
  if (lat < -90 || lat > 90) {
    throw new AppError("Latitude must be between -90 and 90.", 400);
  }
  if (lng < -180 || lng > 180) {
    throw new AppError("Longitude must be between -180 and 180.", 400);
  }

  return { name, lat, lng };
};

class AttendanceService {
  async verifyWorkLocationGate(userId, gpsLocation, action) {
    const workLocation = await findLocationForEmployee(userId);
    if (!workLocation) {
      throw new AppError(
        `No active work location is assigned to your account. Please ask an admin to assign your work location before you ${action}.`,
        403
      );
    }

    const hasCoords =
      gpsLocation &&
      Number.isFinite(gpsLocation.lat) &&
      Number.isFinite(gpsLocation.lng);

    if (!hasCoords) {
      throw new AppError(
        `Your work location requires GPS coordinates to ${action}. Please enable location access.`,
        400
      );
    }

    const distanceM = haversineDistanceMeters(
      gpsLocation.lat,
      gpsLocation.lng,
      workLocation.lat,
      workLocation.lng
    );

    if (distanceM > workLocation.radiusMeters) {
      throw new AppError(
        `You are ${Math.round(distanceM)} m from "${workLocation.name}" (limit: ${workLocation.radiusMeters} m). Move within the allowed range to ${action}.`,
        403
      );
    }

    return { workLocation, gpsVerified: true };
  }

  async punchIn(data) {
    const { userId, gpsLocation, source } = data;
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const profile = await EmployeeProfile.findOne({ userId });
    if (!profile) {
      throw new AppError("Employee profile not found. Please create a profile first.", 404);
    }

    if (profile.status === "inactive") {
      throw new AppError("Employee is inactive and cannot punch in.", 403);
    }

    const existing = await Attendance.findOne({ userId, date });
    if (existing) {
      throw new AppError("Already punched in for today.", 409);
    }

    const attendance = await Attendance.create({
      userId,
      employeeProfileId: profile._id,
      date,
      punchIn: new Date(),
      gpsLocation,
      source,
      status: "present",
    });

    return attendance;
  }

  async punchOut(userId) {
    const date = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({ userId, date });
    if (!attendance) {
      throw new AppError("No punch-in record found for today.", 400);
    }

    if (attendance.punchOut) {
      throw new AppError("Already punched out for today.", 409);
    }

    const punchOutTime = new Date();
    attendance.punchOut = punchOutTime;

    // Calculate total hours
    const diffMs = punchOutTime - attendance.punchIn;
    const diffHrs = diffMs / (1000 * 60 * 60);
    attendance.totalHours = Math.round(diffHrs * 100) / 100; // round to 2 decimals

    await attendance.save();
    return attendance;
  }

  async getAttendanceByDate(date) {
    return await Attendance.find({ date, isDeleted: { $ne: true } })
      .populate("userId", "name lastName email")
      .populate("employeeProfileId", "employeeId designation department");
  }

  async getAttendanceByUser(userId) {
    return await Attendance.find({ userId, isDeleted: { $ne: true } })
      .sort({ date: -1 })
      .limit(30); // Last 30 days
  }

  async getTodayAttendance() {
    const date = new Date().toISOString().split("T")[0];
    return await Attendance.find({ date, isDeleted: { $ne: true } })
      .populate("userId", "name lastName email")
      .populate("employeeProfileId", "employeeId designation department");
  }

  // ── Self-service methods ──────────────────────────────────────────────────────

  async selfPunchIn(userId, gpsLocation, source, isHalfDay = false, halfDayReason = "", workMode = "office", site = null) {
    const date = new Date().toISOString().split("T")[0];

    // ── Criterion 2: one punch-in per calendar day ────────────────────────────
    const existing = await Attendance.findOne({ userId, date, isDeleted: { $ne: true } });
    if (existing) {
      throw new AppError("Already punched in for today.", 409);
    }

    // ── Criterion 4: half-day reason required ────────────────────────────────
    if (isHalfDay && (!halfDayReason || halfDayReason.trim() === "")) {
      throw new AppError("halfDayReason is required when isHalfDay is true.", 400);
    }

    const mode = ["site", "home"].includes(workMode) ? workMode : "office";

    // ── Criterion 1: location gate ────────────────────────────────────────────
    // Office work is checked against the assigned geofence. Site work has no
    // geofence to check, so the declared site stands in its place. Work from
    // home has neither — there is nowhere to be, so nothing is verified.
    let workLocation = null;
    let gpsVerified = false;
    let declaredSite;

    if (mode === "site") {
      declaredSite = validateSite(site);
    } else if (mode === "home") {
      // Nothing to verify: remote work is taken at its word.
    } else {
      ({ workLocation, gpsVerified } = await this.verifyWorkLocationGate(
        userId,
        gpsLocation,
        "punch in"
      ));
    }

    const profile = await EmployeeProfile.findOne({ userId }).lean();

    const attendance = await Attendance.create({
      userId,
      ...(profile && { employeeProfileId: profile._id }),
      date,
      punchIn: new Date(),
      gpsLocation: gpsLocation || undefined,
      gpsVerified,
      locationId: workLocation?._id ?? null,
      workMode: mode,
      site: declaredSite,
      source: source || "mobile",
      isHalfDay,
      halfDayReason: isHalfDay ? halfDayReason.trim() : undefined,
      halfDayStatus: isHalfDay ? "pending" : "none",
      status: "present", // Shift initially counted as 'present' until half-day request is approved
    });

    return attendance;
  }

  /**
   * Punch-out with explicit confirmation gate.
   *
   * When `confirmed` is not strictly true this method returns a plain object
   * `{ requiresConfirmation: true, message }` instead of throwing. The controller
   * detects this and responds HTTP 200 with requiresConfirmation: true so the
   * client can show a confirmation screen rather than treating it as an error.
   */
  async selfPunchOut(
    userId,
    confirmed = false,
    earlyPunchOutReason = "",
    earlyPunchOutConfirmed = false,
    gpsLocation = null
  ) {
    const date = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({ userId, date, isDeleted: { $ne: true } });
    if (!attendance) {
      throw new AppError("No punch-in record found for today.", 400);
    }
    if (attendance.punchOut) {
      throw new AppError("Already punched out for today.", 409);
    }

    // ── Criterion 3: explicit confirmation required ───────────────────────────
    if (confirmed !== true) {
      return { requiresConfirmation: true, message: "Please confirm punch-out." };
    }

    // Punching out of a site or work-from-home shift is gated the same way it
    // was punched in — never on an office geofence the employee was never
    // expected to be inside.
    let workLocation = null;
    let gpsVerified = false;
    if (!["site", "home"].includes(attendance.workMode)) {
      ({ workLocation, gpsVerified } = await this.verifyWorkLocationGate(
        userId,
        gpsLocation,
        "punch out"
      ));
    }

    const punchOutTime = new Date();
    const diffMs = punchOutTime - attendance.punchIn;
    const diffHrs = diffMs / (1000 * 60 * 60);

    // ── Early Punch-out logic (8 hours) ──────────────────────────────────────
    const MIN_HOURS = 8;
    if (diffHrs < MIN_HOURS && !earlyPunchOutConfirmed) {
      return { 
        requiresEarlyPunchOutReason: true, 
        message: `You are punching out after only ${Math.round(diffHrs * 10) / 10} hours. Minimum required is ${MIN_HOURS} hours. Please provide a reason.` 
      };
    }

    attendance.punchOut = punchOutTime;
    attendance.punchOutGpsLocation = gpsLocation || undefined;
    attendance.punchOutGpsVerified = gpsVerified;
    if (!attendance.locationId && workLocation?._id) {
      attendance.locationId = workLocation._id;
    }
    attendance.totalHours = Math.round(diffHrs * 100) / 100;
    attendance.confirmedPunchOut = true;

    if (diffHrs < MIN_HOURS) {
      attendance.earlyPunchOutReason = earlyPunchOutReason;
      attendance.earlyPunchOutStatus = "pending";
    }

    await attendance.save();
    return attendance;
  }

  /**
   * Force-punches-out anyone still clocked in 8+ hours after their punch-in.
   * The punch-out timestamp is set to exactly punchIn + 8h (not "now"), so
   * totalHours always reads 8 regardless of how long the record sat overdue
   * before this scheduler tick caught it.
   */
  async autoPunchOutOverdue() {
    const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
    const cutoff = new Date(Date.now() - EIGHT_HOURS_MS);

    const overdue = await Attendance.find({
      punchOut: null,
      punchIn: { $ne: null, $lte: cutoff },
      isDeleted: { $ne: true },
    });

    for (const attendance of overdue) {
      attendance.punchOut = new Date(attendance.punchIn.getTime() + EIGHT_HOURS_MS);
      attendance.totalHours = 8;
      attendance.autoPunchedOut = true;
      await attendance.save();
    }

    return overdue.length;
  }

  async approveEarlyPunchOut(attendanceId, approverId, status, approverRole, approverDeptRole) {
    const attendance = await Attendance.findById(attendanceId).populate("userId");
    if (!attendance) {
      throw new AppError("Attendance record not found.", 404);
    }

    if (attendance.earlyPunchOutStatus !== "pending") {
      throw new AppError("This request is not pending approval.", 400);
    }

    const requester = attendance.userId;
    const isRequesterHR = requester.departmentRole === "hr";

    // Logic: 
    // If requester is HR, only Admin can approve.
    // If requester is not HR, HR or Admin can approve.
    if (isRequesterHR) {
      if (approverRole !== "admin") {
        throw new AppError("Only an Admin can approve early punch-out for HR staff.", 403);
      }
    } else {
      if (approverRole !== "admin" && approverDeptRole !== "hr") {
        throw new AppError("Only HR or Admin can approve early punch-out requests.", 403);
      }
    }

    attendance.earlyPunchOutStatus = status; // "approved" or "rejected"
    attendance.earlyPunchOutApprovedBy = approverId;

    if (status === "rejected") {
      attendance.punchOut = undefined;
      attendance.totalHours = 0;
      attendance.confirmedPunchOut = false;
    }

    await attendance.save();

    return attendance;
  }

  async approveHalfDay(attendanceId, approverId, status, approverRole, approverDeptRole) {
    const attendance = await Attendance.findById(attendanceId).populate("userId");
    if (!attendance) {
      throw new AppError("Attendance record not found.", 404);
    }

    if (attendance.halfDayStatus !== "pending") {
      throw new AppError("This half-day request is not pending approval.", 400);
    }

    const requester = attendance.userId;
    const isRequesterHR = requester.departmentRole === "hr";

    if (isRequesterHR) {
      if (approverRole !== "admin") {
        throw new AppError("Only an Admin can approve half-day requests for HR staff.", 403);
      }
    } else {
      if (approverRole !== "admin" && approverDeptRole !== "hr") {
        throw new AppError("Only HR or Admin can approve half-day requests.", 403);
      }
    }

    attendance.halfDayStatus = status; // "approved" or "rejected"
    attendance.halfDayApprovedBy = approverId;

    if (status === "approved") {
      attendance.status = "half-day";
    } else {
      attendance.status = "present";
    }

    await attendance.save();
    return attendance;
  }

  async getMyAttendance(userId, month) {
    // month format: YYYY-MM
    const filter = { userId, isDeleted: { $ne: true } };
    if (month && /^\d{4}-\d{2}$/.test(month)) {
      filter.date = { $regex: `^${month}` };
    }

    const records = await Attendance.find(filter).sort({ date: -1 });

    // Build monthly summary
    const summary = { present: 0, absent: 0, halfDay: 0, late: 0, onLeave: 0, totalHours: 0 };
    for (const r of records) {
      if (r.status === "present") summary.present++;
      else if (r.status === "absent") summary.absent++;
      else if (r.status === "half-day") summary.halfDay++;
      else if (r.status === "late") summary.late++;
      else if (r.status === "on-leave") summary.onLeave++;
      summary.totalHours += r.totalHours || 0;
    }
    summary.totalHours = Math.round(summary.totalHours * 100) / 100;

    return { records, summary };
  }

  async getMyTodayAttendance(userId) {
    const date = new Date().toISOString().split("T")[0];
    const record = await Attendance.findOne({ userId, date, isDeleted: { $ne: true } });
    return record || null;
  }

  async softDeleteAttendance(id, adminId) {
    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), overriddenBy: adminId },
      { new: true }
    );

    if (!attendance) {
      throw new AppError("Attendance record not found.", 404);
    }
    return attendance;
  }

  async overrideAttendance(data, adminId) {
    try {
      const { userId, date, ...updateData } = data;

      // Worked days must carry both punch times; punchOut must follow punchIn.
      if (updateData.status === "present" || updateData.status === "half-day") {
        if (!updateData.punchIn || !updateData.punchOut) {
          throw new AppError("Punch In and Punch Out are required for present/half-day.", 400);
        }
      }
      if (updateData.punchIn && updateData.punchOut &&
          new Date(updateData.punchOut).getTime() <= new Date(updateData.punchIn).getTime()) {
        throw new AppError("Punch Out must be after Punch In.", 400);
      }

      // Absent/on-leave days don't work at all — an override to either status
      // must wipe every trace of a prior punch (work mode, GPS, half-day and
      // early-exit requests). Otherwise the employee's own attendance page
      // keeps showing "working from home" or a live punch-out button for a
      // day HR just marked as not worked.
      const isNonWorkingStatus = updateData.status === "absent" || updateData.status === "on-leave";
      if (isNonWorkingStatus) {
        Object.assign(updateData, {
          punchIn: null,
          punchOut: null,
          workMode: "office",
          site: undefined,
          gpsLocation: undefined,
          gpsVerified: false,
          punchOutGpsLocation: undefined,
          punchOutGpsVerified: false,
          locationId: null,
          confirmedPunchOut: false,
          autoPunchedOut: false,
          isHalfDay: false,
          halfDayReason: undefined,
          halfDayStatus: "none",
          earlyPunchOutReason: undefined,
          earlyPunchOutStatus: "none",
        });
      }

      let attendance = await Attendance.findOne({ userId, date });
      
      if (attendance) {
        // Update existing
        Object.assign(attendance, updateData);
        attendance.overriddenBy = adminId;
        
        if (attendance.punchIn && attendance.punchOut) {
          const diffMs = new Date(attendance.punchOut).getTime() - new Date(attendance.punchIn).getTime();
          attendance.totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
        } else {
          attendance.totalHours = 0;
        }

        await attendance.save();
      } else {
        // Create new override
        const profile = await EmployeeProfile.findOne({ userId: userId }).lean();

        if (!profile) {
          throw new AppError(`Employee profile not found for user ID ${userId}. Please check if the HR profile is created.`, 404);
        }

        attendance = await Attendance.create({
          userId,
          employeeProfileId: profile._id,
          date,
          ...updateData,
          overriddenBy: adminId,
        });
        
        if (attendance.punchIn && attendance.punchOut) {
          const diffMs = new Date(attendance.punchOut).getTime() - new Date(attendance.punchIn).getTime();
          attendance.totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
          await attendance.save();
        }
      }

      return attendance;
    } catch (error) {
      throw error;
    }
  }
}

const attendanceService = new AttendanceService();

// Catches anyone who forgot to punch out — runs every 10 minutes so a missed
// 8-hour mark is closed out promptly without hammering the database.
export const startAutoPunchOutScheduler = (intervalMs = 10 * 60 * 1000) => {
  const run = async () => {
    try {
      const count = await attendanceService.autoPunchOutOverdue();
      if (count > 0) {
        console.log(`[Attendance] Auto punched-out ${count} overdue record(s).`);
      }
    } catch (err) {
      console.error("[Attendance] Auto punch-out scheduler failed:", err);
    }
  };
  run();
  setInterval(run, intervalMs);
};

export default attendanceService;
