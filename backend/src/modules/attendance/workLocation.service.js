import WorkLocation from "./workLocation.model.js";
import EmployeeProfile from "../team/team.model.js";
import AppError from "../../shared/utils/appError.js";

export const createWorkLocation = async (data, adminId) => {
  return WorkLocation.create({ ...data, createdBy: adminId });
};

export const listWorkLocations = async () => {
  return WorkLocation.find()
    .populate("assignedEmployees", "name lastName phone")
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });
};

export const getWorkLocation = async (id) => {
  const loc = await WorkLocation.findById(id)
    .populate("assignedEmployees", "name lastName phone")
    .populate("createdBy", "name");
  if (!loc) throw new AppError("Work location not found.", 404);
  return loc;
};

export const updateWorkLocation = async (id, data) => {
  const loc = await WorkLocation.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!loc) throw new AppError("Work location not found.", 404);
  return loc;
};

export const assignEmployees = async (id, employeeIds) => {
  // 1. Remove these employees from any other work location to enforce single-location constraint
  await WorkLocation.updateMany(
    { _id: { $ne: id }, assignedEmployees: { $in: employeeIds } },
    { $pull: { assignedEmployees: { $in: employeeIds } } }
  );

  // 2. Add them to the target location
  const loc = await WorkLocation.findByIdAndUpdate(
    id,
    { $addToSet: { assignedEmployees: { $each: employeeIds } } },
    { new: true }
  ).populate("assignedEmployees", "name lastName phone");

  if (!loc) throw new AppError("Work location not found.", 404);
  return loc;
};

export const unassignEmployees = async (id, employeeIds) => {
  const loc = await WorkLocation.findByIdAndUpdate(
    id,
    { $pull: { assignedEmployees: { $in: employeeIds } } },
    { new: true }
  );
  if (!loc) throw new AppError("Work location not found.", 404);
  return loc;
};

export const deleteWorkLocation = async (id) => {
  const loc = await WorkLocation.findByIdAndDelete(id);
  if (!loc) throw new AppError("Work location not found.", 404);
  return loc;
};

/**
 * Returns the first active WorkLocation that applies to this employee,
 * checking direct employee assignment first, then department assignment.
 * Returns null if no location is configured for the employee — in which
 * case the location gate is skipped (backward-compatible).
 */
export const findLocationForEmployee = async (userId) => {
  // 1. Direct employee assignment
  const byEmployee = await WorkLocation.findOne({
    isActive: true,
    assignedEmployees: userId,
  });
  if (byEmployee) return byEmployee;

  // 2. Department assignment — requires EmployeeProfile lookup
  const profile = await EmployeeProfile.findOne({ userId }).lean();
  if (!profile?.department) return null;

  return WorkLocation.findOne({
    isActive: true,
    assignedDepartments: profile.department,
  });
};
