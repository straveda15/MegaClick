import express from "express";
import * as vendorOrderController from "./vendorOrder.controller.js";
import { authenticateUser, restrictTo, requirePageAccess } from "../../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, requirePageAccess("/operations/vendor-orders", [], ["warehouse", "ops_staff"]), vendorOrderController.createVendorOrder);
router.get("/", authenticateUser, requirePageAccess("/operations/vendor-orders"), vendorOrderController.getVendorOrders);
router.post("/:id/receive", authenticateUser, requirePageAccess("/operations/vendor-orders"), vendorOrderController.receiveVendorOrder);

export default router;
