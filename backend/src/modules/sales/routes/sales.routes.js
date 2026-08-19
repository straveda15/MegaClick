import express from "express";
import multer from "multer";

import * as salesIngestController from "../controllers/salesIngest.controller.js";
import * as salesOrderController from "../controllers/salesOrder.controller.js";
import * as salesLeadController from "../controllers/salesLead.controller.js";
import * as salesReturnController from "../controllers/salesReturn.controller.js";
import { authenticateUser, requireSales, requireAdmin, requireSalesManager } from "../../../shared/middleware/auth.middleware.js";

const router = express.Router();
const upload = multer(); // Memory storage for parsing CSV strings

// --- Public / Website Integration ---
// This route is called by the website frontend contact form
router.post("/contact-us", salesLeadController.handleContactUs);

// Apply auth and role guard to all internal sales routes
router.use(authenticateUser, requireSales);

// --- Website Sync ---
router.post("/sync/website", salesLeadController.syncWebsiteLeads);

// --- CSV Ingestion ---
router.post("/upload/orders", upload.single("file"), salesIngestController.uploadOrdersCSV);
router.post("/upload/leads", upload.single("file"), salesIngestController.uploadLeadsCSV);
router.post("/upload/scraped", upload.single("file"), salesIngestController.uploadScrapedDataCSV);

// --- Active Orders ---
router.post("/orders", salesOrderController.createOrder);
router.get("/orders/my", salesOrderController.getMyAssignedOrders);
router.get("/orders/number/:orderNumber", salesOrderController.getOrderByNumber);
router.patch("/orders/:id/confirm", salesOrderController.confirmOrder);

// --- Sales Team & Lead Distribution ---
router.get("/team", salesLeadController.getSalesTeam);
router.post("/team/manager", requireAdmin, salesLeadController.assignSalesManager);
router.delete("/team/manager", requireAdmin, salesLeadController.unassignSalesManager);
router.get("/team/oversight", requireSalesManager, salesLeadController.getSalesOversight);
router.post("/leads/distribute", requireSalesManager, salesLeadController.distributeLeads);
// Free every open lead held by an admin/founder/co-founder (or any non-member)
// and spread it across the active sales team.
router.post("/leads/sweep", requireSalesManager, salesLeadController.sweepLeads);

// --- Leads ---
router.post("/leads", salesLeadController.createManualLead);
// Bulk lead import from a CSV/Excel upload parsed client-side.
router.post("/leads/import", salesLeadController.importLeads);
router.get("/leads/my", salesLeadController.getMyLeads);
router.get("/leads/my/stats", salesLeadController.getMyLeadStats);
router.get("/notices", salesLeadController.getSalesNotices);
router.get("/leads/backlog", salesLeadController.getBacklogLeads);

// --- Follow-ups ---
// Registered before the /leads/:id wildcard so the board route resolves first.
router.get("/follow-ups", salesLeadController.getFollowUps);
router.post("/leads/:id/follow-ups", salesLeadController.logFollowUp);

// --- Clients ---
// A lead becomes a client once one of its services is assigned. Registered
// before the /leads/:id wildcard below so "backlog"/"my" keep resolving first.
router.get("/clients", salesLeadController.getClients);
router.get("/clients/:id", salesLeadController.getClientById);

// Full lead record for the details popup — must stay last of the /leads GETs so
// it doesn't swallow /leads/my, /leads/backlog, etc.
router.get("/leads/:id", salesLeadController.getLeadDetail);
router.patch("/leads/:id/assign", requireSalesManager, salesLeadController.assignLead);
// Turn a lead into assigned work: creates the task and links it to the lead.
router.post("/leads/:id/assign-task", salesLeadController.assignLeadAsTask);
// Hand ONE of the client's services to an employee, carrying its step checklist.
router.post("/leads/:id/services/:serviceId/assign", salesLeadController.assignLeadService);
router.patch("/leads/:id/temperature", salesLeadController.setLeadTemperature);
router.patch("/leads/:id/status", salesLeadController.updateLeadStatus);
router.patch("/leads/:id/customer", salesLeadController.updateLeadCustomer);
router.patch("/leads/:id/services/:serviceId/quotation", salesLeadController.updateServiceQuotation);
router.patch("/leads/:id/convert", salesLeadController.convertLead);
router.patch("/leads/:id/drop", salesLeadController.dropLead);

// --- Returns ---
router.post("/returns", salesReturnController.createReturn);
router.get("/returns/my", salesReturnController.getMyReturns);

router.patch("/returns/:id/verify", salesReturnController.verifyReturn);
router.patch("/returns/:id/approve", salesReturnController.approveReturn);
router.patch("/returns/:id/pickup", salesReturnController.initiatePickup);
router.patch("/returns/:id/complete", salesReturnController.completeReturn);

export default router;
