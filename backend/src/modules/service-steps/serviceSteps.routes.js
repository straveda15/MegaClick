import express from "express";

import * as serviceStepsController from "./serviceSteps.controller.js";
import { authenticateUser, requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser);

// Anyone assigning work needs to read the templates to preload the stepper.
router.get("/", serviceStepsController.listTemplates);
router.get("/:serviceSlug", serviceStepsController.getTemplate);

// Defining what the steps ARE is an admin decision.
router.put("/:serviceSlug", requireAdmin, serviceStepsController.saveTemplate);
router.delete("/:serviceSlug", requireAdmin, serviceStepsController.deleteTemplate);

export default router;
