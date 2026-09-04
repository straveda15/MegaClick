import express from "express";
import { allowIfGrantedPage } from "../../shared/middleware/auth.middleware.js";
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

// Admin, HR, and Manager always get in (the roles this page is granted to by
// default); anyone else only if the admin specifically checked "Work
// Locations" for them in Permissions. `protect` is already applied by the
// parent attendance router.
router.use(allowIfGrantedPage("/people/work-locations", ["hr", "manager"]));

router.post("/", createWorkLocation);
router.get("/", listWorkLocations);
router.get("/:id", getWorkLocation);
router.patch("/:id", updateWorkLocation);
router.delete("/:id", deleteWorkLocation);
router.post("/:id/assign", assignEmployees);
router.post("/:id/unassign", unassignEmployees);

export default router;
