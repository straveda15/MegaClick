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

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadPriority = (typeof LEAD_PRIORITIES)[number];

export interface LeadCustomer {
  _id: string;
  name?: string;
  email?: string;
  phone: string;
  company?: string;
  city?: string;
  state?: string;
}

export interface LeadTask {
  _id: string;
  title: string;
  status: string;
  dueAt?: string;
  priority?: string;
}

export interface SalesLead {
  _id: string;
  customer?: LeadCustomer | null;
  assignedTo?: { _id: string; name?: string; lastName?: string; email?: string } | null;
  /** Set once the lead has been assigned to an employee as a task. */
  taskId?: LeadTask | null;
  status: LeadStatus;
  priority?: LeadPriority;
  source: string;
  /** Title of the service this lead wants. */
  productInterest?: string;
  serviceSlug?: string;
  serviceCategory?: string;
  serviceStage?: ServiceStage;
  followUpAt?: string;
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
  /** Title of the service the client is interested in. */
  productInterest?: string;
  serviceSlug?: string;
  serviceCategory?: string;
  serviceStage?: ServiceStage;
  priority?: LeadPriority;
  status?: LeadStatus;
  source?: string;
  followUpAt?: string;
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
 * Turns a lead into assigned work — creates the task, stamps it with the
 * client's details, and links it back to the lead.
 */
export function useAssignLeadAsTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, assignedTo, dueAt, priority, notes }: {
      id: string;
      assignedTo: string;
      dueAt?: string;
      priority?: string;
      notes?: string;
    }) => {
      const res = await fetch(`${BASE_URL}/leads/${id}/assign-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ assignedTo, dueAt, priority, notes }),
      });
      const data = await readJson(res, "Failed to assign lead");
      return data.data as SalesLead;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
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
