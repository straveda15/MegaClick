import leaveService from "./leave.service.js";
import { applyLeaveSchema, updateLeaveStatusSchema } from "./leave.validation.js";

export const applyLeave = async (req, res) => {
  try {
    const { error, value } = applyLeaveSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Self check: Employee can only apply for themselves unless Admin/HR
    if (req.user.role !== "admin" && req.user.departmentRole !== "hr" && req.user._id.toString() !== value.userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to apply leave for another user." });
    }

    const leave = await leaveService.applyLeave(value, req.user._id);
    return res.status(201).json({ success: true, data: leave });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const { error, value } = updateLeaveStatusSchema.validate({ ...req.body, status: "approved" });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const leave = await leaveService.updateLeaveStatus(req.params.id, value, req.user._id);
    return res.status(200).json({ success: true, data: leave });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const { error, value } = updateLeaveStatusSchema.validate({ ...req.body, status: "rejected" });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const leave = await leaveService.updateLeaveStatus(req.params.id, value, req.user._id);
    return res.status(200).json({ success: true, data: leave });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const listLeaves = async (req, res) => {
  try {
    const { userId, status } = req.query;
    const filters = {};
    if (userId) filters.userId = userId;
    if (status) filters.status = status;

    const leaves = await leaveService.getAllLeaves(filters);
    return res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const getLeavesByUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Authorization: Self, HR, Admin, Manager
    if (req.user.role !== "admin" && 
        req.user.departmentRole !== "hr" && 
        req.user.departmentRole !== "manager" && 
        req.user._id.toString() !== id) {
      return res.status(403).json({ success: false, message: "Unauthorized to view these leave records." });
    }

    const leaves = await leaveService.getLeavesByUser(id);
    return res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await leaveService.getPendingLeaves();
    return res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const leave = await leaveService.softDeleteLeave(req.params.id, req.user._id);
    return res.status(200).json({ success: true, message: "Leave record deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

// ── Self-service handlers (production_staff + employees) ──────────────────

export const getMyLeaves = async (req, res) => {
  try {
    const { status } = req.query;
    const leaves = await leaveService.getMyLeaves(req.user._id, { status });
    return res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const getMyLeaveBalance = async (req, res) => {
  try {
    const balance = await leaveService.getMyLeaveBalance(req.user._id);
    return res.status(200).json({ success: true, data: balance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const applyLeaveForSelf = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason, isHalfDay, halfDaySession } = req.body;
    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ success: false, message: "leaveType, fromDate, toDate, and reason are required." });
    }
    const leave = await leaveService.applyLeaveForSelf(req.user._id, {
      leaveType, fromDate, toDate, reason, isHalfDay, halfDaySession,
    });
    return res.status(201).json({ success: true, data: leave });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Failed to apply leave." });
  }
};

export const cancelMyLeave = async (req, res) => {
  try {
    const leave = await leaveService.cancelMyLeave(req.params.id, req.user._id);
    return res.status(200).json({ success: true, message: "Leave request cancelled.", data: leave });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Failed to cancel leave." });
  }
};
