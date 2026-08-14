import teamService from "./team.service.js";
import { createEmployeeSchema, updateEmployeeSchema, updateStatusSchema } from "./team.validation.js";

export const createEmployee = async (req, res) => {
  try {
    const { error, value } = createEmployeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const employee = await teamService.createEmployee(value, req.user._id);
    return res.status(201).json({ success: true, data: employee });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const listEmployees = async (req, res) => {
  try {
    const employees = await teamService.getAllEmployees();
    return res.status(200).json({ success: true, data: employees });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await teamService.getEmployeeById(req.params.id);
    return res.status(200).json({ success: true, data: employee });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message || "Employee not found." });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { error, value } = updateEmployeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const employee = await teamService.updateEmployee(req.params.id, value, req.user._id);
    return res.status(200).json({ success: true, data: employee });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const updateEmployeeStatus = async (req, res) => {
  try {
    const { error, value } = updateStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const employee = await teamService.updateStatus(req.params.id, value.status, req.user._id);
    return res.status(200).json({ success: true, data: employee });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const getHierarchy = async (req, res) => {
  try {
    const hierarchy = await teamService.getHierarchy();
    return res.status(200).json({ success: true, data: hierarchy });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await teamService.softDeleteEmployee(req.params.id, req.user._id);
    return res.status(200).json({ success: true, message: "Employee profile deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};
