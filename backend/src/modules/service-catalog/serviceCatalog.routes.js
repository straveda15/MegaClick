import express from "express";
import * as serviceCatalogController from "./serviceCatalog.controller.js";
import { authenticateUser, allowIfGrantedPage } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.get("/", serviceCatalogController.getCatalog);

// Managing the list is done from the Service Steps page, so it follows that
// page's access: admin, or anyone explicitly granted "Service Steps".
const serviceStepsPageAccess = [authenticateUser, allowIfGrantedPage("/service-steps")];

router.post("/", ...serviceStepsPageAccess, serviceCatalogController.createService);
router.patch("/:slug", ...serviceStepsPageAccess, serviceCatalogController.updateService);
router.delete("/:slug", ...serviceStepsPageAccess, serviceCatalogController.deleteService);

export default router;
