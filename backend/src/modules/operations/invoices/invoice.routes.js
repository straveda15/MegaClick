import express from "express";
import * as invoiceController from "./invoice.controller.js";
import { authenticateUser, restrictTo } from "../../../shared/middleware/ops.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", authenticateUser, restrictTo("admin"), invoiceController.createInvoice);
router.get("/", authenticateUser, restrictTo("admin"), invoiceController.getInvoices);
router.get("/:id", authenticateUser, restrictTo("admin"), invoiceController.getInvoice);
router.patch("/:id/pay", authenticateUser, restrictTo("admin"), invoiceController.payInvoice);

export default router;
