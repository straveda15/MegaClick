import express from "express";

// ── Core (the five Victory Media modules) ────────────────────────────────────
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import teamRoutes from "../modules/team/team.routes.js";
import attendanceRoutes from "../modules/attendance/attendance.routes.js";
import leaveRoutes from "../modules/leave/leave.routes.js";
import salesRoutes from "../modules/sales/routes/sales.routes.js";
import taskRoutes from "../modules/task/task.routes.js";
import workLogRoutes from "../modules/worklog/worklog.routes.js";
import employeeNotificationRoutes from "../modules/notification/employee-notification.routes.js";
import auditRoutes from "../modules/audit/audit.routes.js";
import payslipRoutes from "../modules/payslip/payslip.routes.js";
import serviceCatalogRoutes from "../modules/service-catalog/serviceCatalog.routes.js";
import serviceStepsRoutes from "../modules/service-steps/serviceSteps.routes.js";

// ── Supporting (surfaces the Sales pipeline reads from / writes to) ──────────
import orderRoutes from "../modules/order/order.routes.js";
import returnRoutes from "../modules/return/return.routes.js";
import productRoutes from "../modules/product/product.routes.js";
import operationsRoutes from "../modules/operations/operations.routes.js";
import productCostRoutes from "../modules/productCost/productCost.routes.js";
import shipmentRoutes from "../modules/shipment/shipment.routes.js";
import shipmentTierRoutes from "../modules/shipment/tier.routes.js";
import shipmentRuleRoutes from "../modules/shipment/rule.routes.js";

const router = express.Router();

// ── Auth & identity ──────────────────────────────────────────────────────────
router.use("/v1/auth", authRoutes);
router.use("/v1/users", userRoutes);

// ── People: employees, attendance, leave ─────────────────────────────────────
// Work locations live inside attendance.routes.js at /v1/attendance/work-locations
router.use("/v1/team", teamRoutes);
router.use("/v1/attendance", attendanceRoutes);
router.use("/v1/leaves", leaveRoutes);
router.use("/v1/payslips", payslipRoutes);

// ── Sales leads ──────────────────────────────────────────────────────────────
router.use("/v1/sales", salesRoutes);

// ── Task management ──────────────────────────────────────────────────────────
router.use("/v1/tasks", taskRoutes);
router.use("/v1/worklogs", workLogRoutes);
router.use("/v1/service-catalog", serviceCatalogRoutes);
router.use("/v1/service-steps", serviceStepsRoutes);

// ── Supporting surfaces used by the sales pipeline ───────────────────────────
// Tier and rule routes must be registered BEFORE /v1/shipment to avoid
// the /:orderId wildcard in shipment.routes.js capturing "tiers" or "rules".
router.use("/v1/shipment/tiers", shipmentTierRoutes);
router.use("/v1/shipment/rules", shipmentRuleRoutes);
router.use("/v1/shipment", shipmentRoutes);
router.use("/v1/orders", orderRoutes);
router.use("/v1/returns", returnRoutes);
router.use("/v1/operations", operationsRoutes);
router.use("/v1/product-costs", productCostRoutes);
router.use("/products", productRoutes);

// ── System ───────────────────────────────────────────────────────────────────
router.use("/v1/notifications", employeeNotificationRoutes);
router.use("/v1/audit", auditRoutes);

export default router;
