import catchAsync from "../../shared/utils/catchAsync.js";
import AppError from "../../shared/utils/appError.js";
import * as workLocationService from "./workLocation.service.js";

export const createWorkLocation = catchAsync(async (req, res) => {
  const location = await workLocationService.createWorkLocation(req.body, req.user._id);
  res.status(201).json({ success: true, message: "Work location created.", data: { location } });
});

export const listWorkLocations = catchAsync(async (_req, res) => {
  const locations = await workLocationService.listWorkLocations();
  res.status(200).json({ success: true, data: { locations } });
});

export const getWorkLocation = catchAsync(async (req, res) => {
  const location = await workLocationService.getWorkLocation(req.params.id);
  res.status(200).json({ success: true, data: { location } });
});

export const updateWorkLocation = catchAsync(async (req, res) => {
  const location = await workLocationService.updateWorkLocation(req.params.id, req.body);
  res.status(200).json({ success: true, message: "Work location updated.", data: { location } });
});

export const assignEmployees = catchAsync(async (req, res, next) => {
  const { employeeIds } = req.body;
  if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
    return next(new AppError("employeeIds must be a non-empty array.", 400));
  }
  const location = await workLocationService.assignEmployees(req.params.id, employeeIds);
  res.status(200).json({ success: true, message: "Employees assigned.", data: { location } });
});

export const unassignEmployees = catchAsync(async (req, res, next) => {
  const { employeeIds } = req.body;
  if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
    return next(new AppError("employeeIds must be a non-empty array.", 400));
  }
  const location = await workLocationService.unassignEmployees(req.params.id, employeeIds);
  res.status(200).json({ success: true, message: "Employees unassigned.", data: { location } });
});

export const deleteWorkLocation = catchAsync(async (req, res) => {
  await workLocationService.deleteWorkLocation(req.params.id);
  res.status(200).json({ success: true, message: "Work location deleted." });
});
