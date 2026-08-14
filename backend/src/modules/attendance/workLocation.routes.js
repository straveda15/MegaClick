import express from "express";
import { requireAdmin } from "../../shared/middleware/auth.middleware.js";
import {
  createWorkLocation,
  listWorkLocations,
  getWorkLocation,
  updateWorkLocation,
  assignEmployees,
  unassignEmployees,
  deleteWorkLocation,
} from "./workLocation.controller.js";

const router = express.Router();

// All work-location routes are admin-only.
// `protect` is already applied by the parent attendance router.
router.use(requireAdmin);

router.post("/", createWorkLocation);
router.get("/", listWorkLocations);
router.get("/:id", getWorkLocation);
router.patch("/:id", updateWorkLocation);
router.delete("/:id", deleteWorkLocation);
router.post("/:id/assign", assignEmployees);
router.post("/:id/unassign", unassignEmployees);

export default router;
