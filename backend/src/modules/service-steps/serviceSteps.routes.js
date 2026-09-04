import express from "express";

import * as serviceStepsController from "./serviceSteps.controller.js";
import { authenticateUser, allowIfGrantedPage } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser);

// Anyone assigning work needs to read the templates to preload the stepper.
router.get("/", serviceStepsController.listTemplates);
router.get("/:serviceSlug", serviceStepsController.getTemplate);

// Defining what the steps ARE is an admin decision by default, but honours an
// explicit "Service Steps" grant from Permissions the same way the page's
// visibility does.
const serviceStepsPageAccess = allowIfGrantedPage("/service-steps");
router.put("/:serviceSlug", serviceStepsPageAccess, serviceStepsController.saveTemplate);
router.delete("/:serviceSlug", serviceStepsPageAccess, serviceStepsController.deleteTemplate);

export default router;
