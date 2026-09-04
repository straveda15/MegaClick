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
import { protect, allowIfGrantedPage } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// All team routes require authentication
router.use(protect);

// Writes: admin, HR, or Manager by default, or anyone explicitly granted the
// "Employees" page — creating/editing/deleting employee profiles is the
// entire point of that page, so a granted user needs to actually be able to
// use it, not just view the list.
const employeesPageAccess = allowIfGrantedPage("/employees", ["hr", "manager"]);
router.post("/", employeesPageAccess, createEmployee);
router.patch("/:id", employeesPageAccess, updateEmployee);
router.patch("/:id/status", employeesPageAccess, updateEmployeeStatus);
router.delete("/:id", employeesPageAccess, deleteEmployee);

// Reads: any authenticated employee (sidebar already hides this from unauthorized users)
router.get("/", listEmployees);
router.get("/hierarchy", getHierarchy);
router.get("/:id", getEmployee);


export default router;
