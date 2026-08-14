import express from "express";
import * as vendorController from "./vendor.controller.js";
import { authenticateUser, restrictTo, requirePageAccess } from "../../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, requirePageAccess("/operations/vendors"), vendorController.createVendor);
router.get("/", authenticateUser, requirePageAccess(["/operations/vendors", "/operations/transactions", "/operations/vendor-orders"], [], ["warehouse", "ops_staff"]), vendorController.getVendors);
router.get("/:id", authenticateUser, requirePageAccess("/operations/vendors"), vendorController.getVendor);
router.patch("/:id", authenticateUser, requirePageAccess("/operations/vendors"), vendorController.updateVendor);
router.delete("/:id", authenticateUser, requirePageAccess("/operations/vendors"), vendorController.deleteVendor);
router.post("/:id/investments", authenticateUser, requirePageAccess("/operations/vendors"), vendorController.addInvestment);


export default router;
