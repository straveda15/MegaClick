import attendanceService from "./attendance.service.js";
import catchAsync from "../../shared/utils/catchAsync.js";
import AppError from "../../shared/utils/appError.js";
import { selfPunchInSchema, selfPunchOutSchema } from "./attendance.validation.js";

export const punchIn = catchAsync(async (req, res, next) => {
  const attendance = await attendanceService.punchIn(req.body);

  res.status(201).json({
    status: "success",
    data: { attendance },
  });
});

export const punchOut = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  const attendance = await attendanceService.punchOut(userId);

  res.status(200).json({
    status: "success",
    data: { attendance },
  });
});

export const getTodayAttendance = catchAsync(async (req, res, next) => {
  const attendance = await attendanceService.getTodayAttendance();

  res.status(200).json({
    status: "success",
    results: attendance.length,
    data: { attendance },
  });
});

export const getPendingAttendance = catchAsync(async (req, res, next) => {
  const attendance = await attendanceService.getPendingAttendance();

  res.status(200).json({
    status: "success",
    results: attendance.length,
    data: { attendance },
  });
});

export const getAttendanceByDate = catchAsync(async (req, res, next) => {
  const { date } = req.query;
  if (!date) {
    return next(new AppError("Please provide a date query parameter (YYYY-MM-DD).", 400));
  }

  const attendance = await attendanceService.getAttendanceByDate(date);

  res.status(200).json({
    status: "success",
    results: attendance.length,
    data: { attendance },
  });
});

export const getAttendanceByUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const attendance = await attendanceService.getAttendanceByUser(id);

  res.status(200).json({
    status: "success",
    results: attendance.length,
    data: { attendance },
  });
});

export const overrideAttendance = catchAsync(async (req, res, next) => {
  const adminId = req.user._id;
  const attendance = await attendanceService.overrideAttendance(req.body, adminId);
  res.status(200).json({ status: "success", data: { attendance } });
});

export const deleteAttendance = catchAsync(async (req, res, next) => {
  const adminId = req.user._id;
  const { id } = req.params;

  await attendanceService.softDeleteAttendance(id, adminId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// ── Self-service handlers ─────────────────────────────────────────────────────

export const selfPunchIn = catchAsync(async (req, res, next) => {
  const { error, value } = selfPunchInSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const { gpsLocation, source, isHalfDay, halfDayReason, workMode, site } = value;

  const attendance = await attendanceService.selfPunchIn(
    req.user._id,
    gpsLocation,
    source,
    isHalfDay,
    halfDayReason,
    workMode,
    site
  );

  return res.status(201).json({ success: true, data: { attendance } });
});

export const selfPunchOut = catchAsync(async (req, res, next) => {
  const { error, value } = selfPunchOutSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const { confirmed, earlyPunchOutReason, earlyPunchOutConfirmed, gpsLocation } = value;
  const result = await attendanceService.selfPunchOut(
    req.user._id,
    confirmed,
    earlyPunchOutReason,
    earlyPunchOutConfirmed,
    gpsLocation
  );

  if (result?.requiresConfirmation) {
    return res.status(200).json({
      success: true,
      requiresConfirmation: true,
      message: result.message,
    });
  }

  if (result?.requiresEarlyPunchOutReason) {
    return res.status(200).json({
      success: true,
      requiresEarlyPunchOutReason: true,
      message: result.message,
    });
  }

  return res.status(200).json({ success: true, data: { attendance: result } });
});

export const getMyAttendance = catchAsync(async (req, res, next) => {
  const { month } = req.query;
  const { records, summary } = await attendanceService.getMyAttendance(req.user._id, month);
  return res.status(200).json({ success: true, data: { records, summary } });
});

export const getMyTodayAttendance = catchAsync(async (req, res, next) => {
  const record = await attendanceService.getMyTodayAttendance(req.user._id);
  return res.status(200).json({ success: true, data: { attendance: record } });
});

export const approveEarlyPunchOut = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body; // "approved" or "rejected"
  const approverId = req.user._id;
  const approverRole = req.user.role;
  const approverDeptRole = req.user.departmentRole;

  if (!["approved", "rejected"].includes(status)) {
    return next(new AppError("Invalid status. Must be 'approved' or 'rejected'.", 400));
  }

  const attendance = await attendanceService.approveEarlyPunchOut(
    id,
    approverId,
    status,
    approverRole,
    approverDeptRole,
    req.user.allowedPaths || []
  );

  res.status(200).json({
    status: "success",
    data: { attendance },
  });
});

export const approveHalfDay = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body; // "approved" or "rejected"
  const approverId = req.user._id;
  const approverRole = req.user.role;
  const approverDeptRole = req.user.departmentRole;

  if (!["approved", "rejected"].includes(status)) {
    return next(new AppError("Invalid status. Must be 'approved' or 'rejected'.", 400));
  }

  const attendance = await attendanceService.approveHalfDay(
    id,
    approverId,
    status,
    approverRole,
    approverDeptRole,
    req.user.allowedPaths || []
  );

  res.status(200).json({
    status: "success",
    data: { attendance },
  });
});

