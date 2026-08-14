import express from "express";
import { 
  createEmployee, 
  listEmployees, 
  getEmployee, 
  updateEmployee, 
  updateEmployeeStatus,
  getHierarchy,
  deleteEmployee
} from "./team.controller.js";
import { protect, requireHR, requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// All team routes require authentication
router.use(protect);

// Writes: only HR department or admin can create/modify/delete employee profiles
router.post("/", requireHR, createEmployee);
router.patch("/:id", requireHR, updateEmployee);
router.patch("/:id/status", requireHR, updateEmployeeStatus);
router.delete("/:id", requireAdmin, deleteEmployee);

// Reads: any authenticated employee (sidebar already hides this from unauthorized users)
router.get("/", listEmployees);
router.get("/hierarchy", getHierarchy);
router.get("/:id", getEmployee);


export default router;
