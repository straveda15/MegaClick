import * as salesLeadService from "../services/salesLead.service.js";
import * as salesClientService from "../services/salesClient.service.js";
import * as websiteLeadsService from "../services/websiteLeads.service.js";
import { contactUsSchema } from "../validation/sales.validation.js";

export const getMyLeads = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const leads = await salesLeadService.getAssignedLeads(req.user, req.query);

        res.status(200).json({
            success: true,
            message: "Leads retrieved successfully",
            data: leads
        });
    } catch (error) {
        next(error);
    }
};

export const getMyLeadStats = async (req, res, next) => {
    try {
        const stats = await salesLeadService.getMyLeadStats(req.user);
        res.status(200).json({ success: true, message: "Lead stats retrieved", data: stats });
    } catch (error) {
        next(error);
    }
};

export const getBacklogLeads = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const leads = await salesLeadService.getBacklogLeads(userId);

        res.status(200).json({
            success: true,
            message: "Backlog leads retrieved successfully",
            data: leads
        });
    } catch (error) {
        next(error);
    }
};

export const updateLeadStatus = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        const { status, note, followUpAt } = req.body;
        const actorId = req.user._id;

        const lead = await salesLeadService.advanceLeadStatus(leadId, status, actorId, note, followUpAt);

        res.status(200).json({
            success: true,
            message: "Lead status updated",
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

export const convertLead = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        const orderData = req.body;
        const actorId = req.user._id;

        const result = await salesLeadService.convertLead(leadId, actorId, orderData);

        res.status(200).json({
            success: true,
            message: "Lead converted successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const dropLead = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        const { reason } = req.body;
        const actorId = req.user._id;

        if (!reason) throw new Error("Reason is required to drop a lead");

        const lead = await salesLeadService.dropLead(leadId, actorId, reason);

        res.status(200).json({
            success: true,
            message: "Lead dropped",
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

export const syncWebsiteLeads = async (req, res, next) => {
    try {
        const actorId = req.user._id;
        const result = await websiteLeadsService.syncCartLeads(actorId);
        
        console.log(`[SalesSync] Actor: ${actorId}, Created: ${result.created}, Skipped: ${result.skipped}`);

        res.status(200).json({
            success: true,
            message: `Synced ${result.created} leads from website orders.`,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const handleContactUs = async (req, res, next) => {
    try {
        const { error, value } = contactUsSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map((d) => d.message).join("; "),
            });
        }

        const lead = await websiteLeadsService.createContactLead(value);

        res.status(201).json({
            success: true,
            message: "Thank you for contacting us. A sales agent will reach out soon.",
            data: lead,
        });
    } catch (error) {
        next(error);
    }
};

export const createManualLead = async (req, res, next) => {
    try {
        const actorId = req.user._id;
        const data = req.body;

        const lead = await salesLeadService.createManualLead(actorId, data);

        res.status(201).json({
            success: true,
            message: "Manual lead created successfully",
            data: lead
        });
    } catch (error) {
        next(error);
    }
};
export const importLeads = async (req, res, next) => {
    try {
        const { rows, fallbackAssignedTo } = req.body;

        const result = await salesLeadService.importLeads(req.user._id, { rows, fallbackAssignedTo });

        res.status(201).json({
            success: true,
            message: `Imported ${result.imported} lead${result.imported === 1 ? "" : "s"}`,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const assignLeadAsTask = async (req, res, next) => {
    try {
        const { assignedTo, dueAt, priority, notes, steps, stage, serviceId } = req.body;

        const lead = await salesLeadService.assignLeadAsTask(req.params.id, req.user._id, {
            assignedTo, dueAt, priority, notes, steps, stage, serviceId
        });

        res.status(201).json({
            success: true,
            message: "Lead assigned as a task",
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

/** Hands one of the client's services to an employee, with its step checklist. */
export const assignLeadService = async (req, res, next) => {
    try {
        const { assignedTo, dueAt, priority, notes, steps, stage } = req.body;

        const lead = await salesLeadService.assignLeadService(
            req.params.id,
            req.params.serviceId,
            req.user._id,
            { assignedTo, dueAt, priority, notes, steps, stage }
        );

        res.status(201).json({
            success: true,
            message: "Service assigned",
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

export const getLeadDetail = async (req, res, next) => {
    try {
        const lead = await salesLeadService.getLeadDetail(req.params.id);

        res.status(200).json({
            success: true,
            message: "Lead retrieved successfully",
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

export const setLeadTemperature = async (req, res, next) => {
    try {
        const lead = await salesLeadService.setLeadTemperature(
            req.params.id,
            req.body?.temperature,
            req.user._id
        );

        res.status(200).json({
            success: true,
            message: "Lead temperature updated",
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

export const getClients = async (req, res, next) => {
    try {
        const clients = await salesClientService.listClients(req.user, req.query);

        res.status(200).json({
            success: true,
            message: "Clients retrieved successfully",
            data: clients
        });
    } catch (error) {
        next(error);
    }
};

export const getClientById = async (req, res, next) => {
    try {
        const client = await salesClientService.getClient(req.user, req.params.id);

        res.status(200).json({
            success: true,
            message: "Client retrieved successfully",
            data: client
        });
    } catch (error) {
        next(error);
    }
};

export const updateLeadCustomer = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        const customerData = req.body;
        const lead = await salesLeadService.updateLeadCustomer(leadId, customerData);

        res.status(200).json({
            success: true,
            message: "Customer details updated successfully",
            data: lead
        });
    } catch (error) {
        next(error);
    }
};

// ─── Sales Team & Distribution ───────────────────────────────────────────────

export const getSalesTeam = async (req, res, next) => {
    try {
        const data = await salesLeadService.getSalesTeam();
        res.status(200).json({ success: true, message: "Sales team retrieved", data });
    } catch (error) {
        next(error);
    }
};

export const assignSalesManager = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) throw new Error("userId is required");
        const user = await salesLeadService.assignSalesManager(userId, req.user._id);
        res.status(200).json({ success: true, message: "Senior Sales Manager assigned", data: user });
    } catch (error) {
        next(error);
    }
};

export const unassignSalesManager = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) throw new Error("userId is required");
        const user = await salesLeadService.unassignSalesManager(userId, req.user._id);
        res.status(200).json({ success: true, message: "Senior Sales Manager unassigned", data: user });
    } catch (error) {
        next(error);
    }
};

// Persist the distribution roster and do the one-time equal spread of all open
// leads across it. New/freed leads are then auto-distributed every 30 min.
export const distributeLeads = async (req, res, next) => {
    try {
        const { memberIds } = req.body;
        const result = await salesLeadService.setDistributionRoster(req.user._id, memberIds);
        res.status(200).json({
            success: true,
            message: `Roster saved — distributed ${result.distributed} leads`,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const assignLead = async (req, res, next) => {
    try {
        const leadId = req.params.id;
        const { assignedTo } = req.body;
        if (!assignedTo) throw new Error("assignedTo is required");
        const lead = await salesLeadService.assignLead(leadId, assignedTo, req.user._id);
        res.status(200).json({ success: true, message: "Lead reassigned", data: lead });
    } catch (error) {
        next(error);
    }
};

export const sweepLeads = async (req, res, next) => {
    try {
        const result = await salesLeadService.sweepNonMemberLeads(req.user._id);
        res.status(200).json({
            success: true,
            message: result.swept
                ? `Freed ${result.swept} lead(s) from admins/founders and shared them across ${result.members} active sales member(s).`
                : "No admin/founder-held open leads to free.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getSalesOversight = async (req, res, next) => {
    try {
        const data = await salesLeadService.getSalesOversight();
        res.status(200).json({ success: true, message: "Oversight retrieved", data });
    } catch (error) {
        next(error);
    }
};

export const getSalesNotices = async (req, res, next) => {
    try {
        const data = await salesLeadService.getSalesNotices();
        res.status(200).json({ success: true, message: "Notices retrieved", data });
    } catch (error) {
        next(error);
    }
};

export const getFollowUps = async (req, res, next) => {
    try {
        const rows = await salesLeadService.listFollowUps(req.user, req.query);

        res.status(200).json({
            success: true,
            message: "Follow-ups retrieved successfully",
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

export const logFollowUp = async (req, res, next) => {
    try {
        const { note, outcome, nextFollowUpAt } = req.body;

        const lead = await salesLeadService.logFollowUp(req.params.id, req.user._id, {
            note, outcome, nextFollowUpAt
        });

        res.status(201).json({
            success: true,
            message: "Follow-up logged",
            data: lead
        });
    } catch (error) {
        next(error);
    }
};
