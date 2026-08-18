import express from "express";
import * as taskController from "./task.controller.js";
import { authenticateUser } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Role validation will be via a wrapper imported from shared later, 
// for now standard authenticateUser ensures they are logged in.

router.get("/my", authenticateUser, taskController.getMyTasks);
router.get("/:id", authenticateUser, taskController.getTaskById);
router.patch("/:id/status", authenticateUser, taskController.updateTaskStatus);
router.patch("/:id/cancel", authenticateUser, taskController.cancelTask);
// Soft delete — hides the task everywhere but keeps the row for history.
router.delete("/:id", authenticateUser, taskController.deleteTask);
router.post("/manual", authenticateUser, taskController.createManualTask);
// Bulk service-request import from a CSV/Excel upload parsed client-side.
router.post("/service-import", authenticateUser, taskController.importServiceTasks);

// Issue management
router.post("/:id/issue", authenticateUser, taskController.raiseIssue);
router.patch("/:id/issue/:flagId/respond", authenticateUser, taskController.respondToIssue);

// Service-request checklist: tick a step off as the work progresses
router.patch("/:id/steps/:stepId", authenticateUser, taskController.updateServiceStep);

// Follow-up: tag followers + post follow-up notes
router.patch("/:id/followers", authenticateUser, taskController.updateFollowers);
router.post("/:id/follow-up", authenticateUser, taskController.addFollowUp);

// Admin task management
router.patch("/:id/extend-due", authenticateUser, taskController.extendDueDate);
router.patch("/:id/reassign", authenticateUser, taskController.reassignTask);
router.patch("/:id/ack-cancel", authenticateUser, taskController.acknowledgeCancelAlert);
router.post("/:id/assign-more", authenticateUser, taskController.assignMore);

export default router;
