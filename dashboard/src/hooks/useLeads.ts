import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";
import type { ServiceStage } from "./useTasks";

const BASE_URL = `${API_BASE}/api/v1/sales`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function readJson(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallback);
  return data;
}

// ── Types ──────────────────────────────────────────────────────────────────

export const LEAD_STATUSES = ["NEW", "CONTACTED", "FOLLOW_UP", "CONVERTED", "DROPPED"] as const;
export const LEAD_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
/** How warm the lead is — the badge shown in the Status column on the board. */
export const LEAD_TEMPERATURES = ["HOT", "WARM", "COLD"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadPriority = (typeof LEAD_PRIORITIES)[number];
export type LeadTemperature = (typeof LEAD_TEMPERATURES)[number];

export interface LeadCustomer {
  _id: string;
  name?: string;
  email?: string;
  phone: string;
  company?: string;
  city?: string;
  state?: string;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  postalCode?: string;
  notes?: string;
  createdAt?: string;
}

export interface LeadTask {
  _id: string;
  title: string;
  status: string;
  dueAt?: string;
  priority?: string;
  serviceRequest?: {
    stage?: ServiceStage;
    steps?: Array<{
      _id: string;
      title: string;
      description?: string;
      order: number;
      done: boolean;
      completedAt?: string;
    }>;
  };
}

export interface LeadEmployee {
  _id: string;
  name?: string;
  lastName?: string;
  email?: string;
}

/**
 * One service the client opted for. A lead can carry several, and each is
 * assigned to an employee on its own — hence the per-service task and assignee.
 */
export interface LeadService {
  _id: string;
  title: string;
  slug?: string;
  category?: string;
  categorySlug?: string;
  stage?: ServiceStage;
  /** How warm this particular request is — tracked per service. */
  temperature?: LeadTemperature;
  /** Custom quotation amount given to the client */
  quotation?: number;
  /** True only if the salesperson explicitly confirmed the quotation */
  quotationConfirmed?: boolean;
  /** When work on this service should begin. */
  startAt?: string;
  /** The target date promised to the client; becomes the task's deadline. */
  dueAt?: string;
  taskId?: LeadTask | string | null;
  assignedTo?: LeadEmployee | null;
  assignedAt?: string;
  notes?: string;
  /** True for leads captured before multi-service support. */
  legacy?: boolean;
}

/** One service as captured on the Add Lead form. */
export interface LeadServiceInput {
  title: string;
  slug?: string;
  category?: string;
  categorySlug?: string;
  startAt?: string;
  dueAt?: string;
  temperature?: LeadTemperature;
  quotation?: number;
}

export interface ServiceStepInput {
  title: string;
  description?: string;
  order: number;
  done?: boolean;
}

export interface SalesLead {
  _id: string;
  customer?: LeadCustomer | null;
  assignedTo?: LeadEmployee | null;
  /** Set once the lead has been assigned to an employee as a task. */
  taskId?: LeadTask | null;
  status: LeadStatus;
  temperature?: LeadTemperature;
  priority?: LeadPriority;
  source: string;
  /** Everything the client asked for. Each entry is assigned separately. */
  services?: LeadService[];
  /** Legacy single-service mirror of services[0]. */
  productInterest?: string;
  serviceSlug?: string;
  serviceCategory?: string;
  serviceStage?: ServiceStage;
  message?: string;
  /** One follow-up date and note for the lead as a whole. */
  followUpAt?: string;
  followUpNote?: string;
  /** Every follow-up logged against this lead, newest first. */
  followUpHistory?: Array<{
    _id: string;
    note: string;
    outcome: 'contacted' | 'no_answer' | 'rescheduled' | 'meeting_set' | 'note';
    followUpAt: string | null;
    createdAt: string | null;
    createdBy?: { name?: string; lastName?: string; email?: string } | string | null;
  }>;
  statusHistory?: Array<{
    _id?: string;
    status: string;
    note?: string;
    changedAt?: string;
    changedBy?: LeadEmployee | null;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
  state?: string;
  /** Every service the client opted for, each with its own dates and status. */
  services?: LeadServiceInput[];
  /** Title of the service the client is interested in. Mirrors services[0]. */
  productInterest?: string;
  serviceSlug?: string;
  serviceCategory?: string;
  serviceStage?: ServiceStage;
  temperature?: LeadTemperature;
  priority?: LeadPriority;
  status?: LeadStatus;
  source?: string;
  followUpAt?: string;
  followUpNote?: string;
  assignedTo?: string;
}

export interface LeadImportRow extends Omit<CreateLeadPayload, "assignedTo"> {
  assignedToName?: string;
}

// ── Hooks ──────────────────────────────────────────────────────────────────

/** Admins and the sales manager get every lead; a rep gets only their own. */
export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async (): Promise<SalesLead[]> => {
      const res = await fetch(`${BASE_URL}/leads/my`, { headers: authHeaders() });
      const data = await readJson(res, "Failed to fetch leads");
      return data.data || [];
    },
  });
}

/** The full lead record behind the details popup — every service, resolved. */
export function useLead(id?: string | null) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: ["lead", id],
    queryFn: async (): Promise<SalesLead> => {
      const res = await fetch(`${BASE_URL}/leads/${id}`, { headers: authHeaders() });
      const data = await readJson(res, "Failed to fetch lead");
      return data.data;
    },
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateLeadPayload) => {
      const res = await fetch(`${BASE_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ...payload, source: payload.source || "manual" }),
      });
      const data = await readJson(res, "Failed to create lead");
      return data.data as SalesLead;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

/**
 * Bulk-creates leads from a parsed spreadsheet. Rows missing a phone number
 * come back in `skipped` rather than failing the whole import.
 */
export function useImportLeads() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ rows, fallbackAssignedTo }: { rows: LeadImportRow[]; fallbackAssignedTo?: string }) => {
      const res = await fetch(`${BASE_URL}/leads/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ rows, fallbackAssignedTo }),
      });
      const data = await readJson(res, "Failed to import leads");
      return data.data as { imported: number; skipped: Array<{ row: number; reason: string }> };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

/**
 * Hands ONE of a lead's services to an employee, along with the step checklist
 * the admin confirmed in the stepper. The client shows up on the Clients board
 * as soon as this succeeds.
 */
export function useAssignLeadService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadId, serviceId, assignedTo, dueAt, priority, notes, steps, stage }: {
      leadId: string;
      serviceId: string;
      assignedTo: string;
      dueAt?: string;
      priority?: string;
      notes?: string;
      steps?: ServiceStepInput[];
      stage?: ServiceStage;
    }) => {
      const res = await fetch(`${BASE_URL}/leads/${leadId}/services/${serviceId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ assignedTo, dueAt, priority, notes, steps, stage }),
      });
      const data = await readJson(res, "Failed to assign service");
      return data.data as SalesLead;
    },
    onSuccess: (lead) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["lead", lead?._id] });
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useSetLeadTemperature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, temperature }: { id: string; temperature: LeadTemperature }) => {
      const res = await fetch(`${BASE_URL}/leads/${id}/temperature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ temperature }),
      });
      const data = await readJson(res, "Failed to update lead");
      return data.data as SalesLead;
    },
    onSuccess: (lead) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["lead", lead?._id] });
    },
  });
}

export function useUpdateServiceQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadId, serviceId, quotation }: { leadId: string; serviceId: string; quotation: number }) => {
      const res = await fetch(`${BASE_URL}/leads/${leadId}/services/${serviceId}/quotation`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ quotation }),
      });
      const data = await readJson(res, "Failed to update quotation");
      return data.data as SalesLead;
    },
    onSuccess: (lead) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["lead", lead?._id] });
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, note, followUpAt }: { id: string; status: LeadStatus; note?: string; followUpAt?: string }) => {
      const res = await fetch(`${BASE_URL}/leads/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status, note, followUpAt }),
      });
      const data = await readJson(res, "Failed to update lead");
      return data.data as SalesLead;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
