import express from "express";

import batchRoutes from "./batch/batch.routes.js";
import inventoryRoutes from "./inventory/ops-inventory.routes.js";
import rawMaterialRoutes from "./raw-materials/raw-material.routes.js";
import vendorRoutes from "./vendors/vendor.routes.js";
import vendorOrderRoutes from "./vendorOrders/vendorOrder.routes.js";
import invoiceRoutes from "./invoices/invoice.routes.js";
import transactionRoutes from "./transactions/transaction.routes.js";
import notificationRoutes from "./notifications/ops-notification.routes.js";

const router = express.Router();

router.use("/batches", batchRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/raw-materials", rawMaterialRoutes);
router.use("/vendors", vendorRoutes);
router.use("/vendor-orders", vendorOrderRoutes);

// Flat resource routes — filter by vendorId via query param (?vendorId=)
// Removed /vendors/:vendorId/invoices and /vendors/:vendorId/transactions to eliminate
// duplicate route mounts that caused ambiguous resolution and inconsistent API behavior.
router.use("/invoices", invoiceRoutes);
router.use("/transactions", transactionRoutes);

router.use("/notifications", notificationRoutes);

export default router;
