import SalesLead, { SERVICE_STAGE_VALUES } from "../models/salesLead.model.js";
import AppError from "../../../shared/utils/appError.js";

/**
 * The Clients board.
 *
 * Every lead is a client the moment it is captured — the Clients page is where
 * the work actually gets handed out, so a lead with nothing assigned yet has to
 * appear there or it can never be assigned at all.
 *
 * One row per lead, sharing the lead's own id: the reference on the Clients
 * board and the reference on the Leads board are deliberately the same string,
 * so anyone can carry it between the two.
 */

const TERMINAL_TASK_STATUSES = ["completed", "cancelled"];

/**
 * How far along one service is, as a percentage.
 *
 * Nothing assigned means nothing has started — 0, not a stage-derived number
 * that would make an untouched request look part-done. Once there is a task,
 * the step checklist is the truthful measure (it's what the employee ticks);
 * services with no template configured fall back to the filing pipeline.
 */
const serviceProgress = (service, task, steps) => {
  if (!task) return 0;

  if (steps?.length) {
    const done = steps.filter((step) => step.done).length;
    return Math.round((done / steps.length) * 100);
  }

  const index = SERVICE_STAGE_VALUES.indexOf(service.stage || "documents_pending");
  return Math.round(((index + 1) / SERVICE_STAGE_VALUES.length) * 100);
};

/** Human-facing reference, derived from the record so it needs no counter. */
const shortId = (id) => `LD-${String(id).slice(-5).toUpperCase()}`;

const projectService = (service, lead) => {
  const task = service.taskId && typeof service.taskId === "object" ? service.taskId : null;
  const steps = task?.serviceRequest?.steps ?? [];
  const assignee = service.assignedTo && typeof service.assignedTo === "object" ? service.assignedTo : null;

  return {
    _id: String(service._id),
    leadId: String(lead._id),
    title: service.title,
    slug: service.slug,
    category: service.category,
    stage: task?.serviceRequest?.stage || service.stage || "documents_pending",
    temperature: service.temperature || "WARM",
    startAt: service.startAt ?? null,
    dueAt: task?.dueAt ?? service.dueAt ?? null,
    taskId: task ? String(task._id) : null,
    // An unassigned service has no task, so it has no task status either.
    taskStatus: task?.status ?? "unassigned",
    priority: task?.priority ?? null,
    assignedAt: service.assignedAt ?? null,
    assignedTo: assignee
      ? {
          _id: String(assignee._id),
          name: [assignee.name, assignee.lastName].filter(Boolean).join(" ") || assignee.email,
          email: assignee.email,
        }
      : null,
    steps: steps.map((step) => ({
      _id: String(step._id),
      title: step.title,
      description: step.description,
      order: step.order,
      done: Boolean(step.done),
      completedAt: step.completedAt ?? null,
    })),
    stepsDone: steps.filter((step) => step.done).length,
    stepsTotal: steps.length,
    progress: serviceProgress(service, task, steps),
    notes: service.notes,
  };
};

/**
 * Rebuilds the flat legacy fields into a one-entry service list, so leads
 * captured before multi-service support still show something to assign.
 */
const leadServices = (lead) => {
  if (lead.services?.length) return lead.services;
  if (!lead.productInterest) return [];

  return [{
    _id: lead._id,
    title: lead.productInterest,
    slug: lead.serviceSlug,
    category: lead.serviceCategory,
    stage: lead.serviceStage || "documents_pending",
    taskId: lead.taskId,
    assignedTo: lead.assignedTo,
  }];
};

/** Every client, each carrying the services they opted for and their state. */
export const listClients = async (user, filters = {}) => {
  const query = {};

  // Ownership scoping mirrors the Leads board: admins and the sales manager see
  // everyone; everyone else sees the clients they are actually working for.
  const isManagerView = user.role === "admin" || user.isSalesManager === true;
  if (!isManagerView) {
    query.$or = [{ assignedTo: user._id }, { "services.assignedTo": user._id }];
  }

  const leads = await SalesLead.find(query)
    .populate("customer")
    .populate("assignedTo", "name lastName email")
    .populate("followUpHistory.createdBy", "name lastName email")
    .populate("services.assignedTo", "name lastName email")
    .populate("services.taskId", "title status dueAt priority serviceRequest")
    .populate("taskId", "title status dueAt priority serviceRequest")
    .sort({ createdAt: -1 })
    .lean();

  const clients = leads
    .filter((lead) => lead.customer)
    .map((lead) => {
      const customer = lead.customer;
      const services = leadServices(lead).map((service) => projectService(service, lead));

      const assigned = services.filter((service) => service.assignedTo);
      const active = assigned.filter((service) => !TERMINAL_TASK_STATUSES.includes(service.taskStatus));
      const completed = services.filter(
        (service) => service.taskStatus === "completed" || service.stage === "completed"
      );

      // Averaged across everything they have with us, so a client who is done
      // with three of four services reads as nearly finished rather than as
      // whatever their newest request happens to say.
      const progress = services.length
        ? Math.round(services.reduce((sum, service) => sum + service.progress, 0) / services.length)
        : 0;

      // The earliest live deadline is the one that actually needs attention.
      const nextDeadline = active
        .map((service) => service.dueAt)
        .filter(Boolean)
        .sort((a, b) => Number(new Date(a)) - Number(new Date(b)))[0] ?? null;

      return {
        // The lead IS the client — same record, same reference.
        _id: String(lead._id),
        leadId: String(lead._id),
        clientId: shortId(lead._id),
        customerId: String(customer._id),
        name: customer.name?.trim() || customer.phone || "Unnamed client",
        phone: customer.phone ?? "",
        email: customer.email ?? "",
        company: customer.company ?? "",
        city: customer.city ?? "",
        state: customer.state ?? "",
        address: [customer.addressLine1, customer.addressLine2, customer.city, customer.state, customer.postalCode]
          .filter(Boolean)
          .join(", "),
        source: lead.source,
        status: lead.status,
        followUpAt: lead.followUpAt ?? null,
        followUpNote: lead.followUpNote ?? "",
        // Newest first, so the popup's timeline reads top-down.
        followUpHistory: [...(lead.followUpHistory ?? [])]
          .sort((a, b) => Number(new Date(b.createdAt ?? 0)) - Number(new Date(a.createdAt ?? 0)))
          .map((entry) => ({
            _id: String(entry._id),
            note: entry.note ?? "",
            outcome: entry.outcome ?? "note",
            followUpAt: entry.followUpAt ?? null,
            createdAt: entry.createdAt ?? null,
            createdBy: entry.createdBy
              ? [entry.createdBy.name, entry.createdBy.lastName].filter(Boolean).join(" ") || entry.createdBy.email
              : null,
          })),
        message: lead.message ?? "",
        createdAt: lead.createdAt,
        services,
        totalServices: services.length,
        assignedServices: assigned.length,
        unassignedServices: services.length - assigned.length,
        activeServices: active.length,
        completedServices: completed.length,
        progress,
        nextDeadline,
        assignedTo: [...new Set(services.map((service) => service.assignedTo?.name).filter(Boolean))],
      };
    });

  const q = String(filters.q ?? "").trim().toLowerCase();
  if (!q) return clients;

  return clients.filter((client) =>
    [client.name, client.company, client.phone, client.email, client.city, client.clientId]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(q))
      || client.services.some((service) => service.title?.toLowerCase().includes(q))
  );
};

/** One client's full record, for the details popup. */
export const getClient = async (user, leadId) => {
  const clients = await listClients(user);
  const client = clients.find((candidate) => candidate._id === String(leadId));
  if (!client) throw new AppError("Client not found", 404);
  return client;
};
