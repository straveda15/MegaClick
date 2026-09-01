import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

const BASE_URL = `${API_BASE}/api/v1/tasks`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface TeamMember {
  _id: string;
  name: string;
  lastName?: string;
  email: string;
}

export const SERVICE_STAGES = [
  "documents_pending",
  "documents_received",
  "application_submitted",
  "government_verification",
  "approval_received",
  "certificate_ready",
  "completed",
] as const;

export type ServiceStage = (typeof SERVICE_STAGES)[number];

/**
 * Present when the task IS a client service request. Carries the service asked
 * for plus the client's contact details, so the assignee has full context on
 * their task board without looking anything up elsewhere.
 */
export interface TaskServiceStep {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  done: boolean;
  completedAt?: string;
}

export interface TaskServiceRequest {
  serviceTitle?: string;
  serviceSlug?: string;
  serviceCategory?: string;
  serviceCategorySlug?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  clientAddress?: string;
  notes?: string;
  stage?: ServiceStage;
  /** Back-links to the lead service this task was created from. */
  leadId?: string;
  leadServiceId?: string;
  /**
   * The checklist for this service, copied from its template when the work was
   * assigned. Ticking these off is what drives the progress bar the client's
   * record shows.
   */
  steps?: TaskServiceStep[];
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  serviceRequest?: TaskServiceRequest | null;
  type: string;
  status: "pending" | "in_progress" | "completed" | "cancelled" | "overdue";
  priority: "low" | "medium" | "high" | "urgent" | "critical";
  cancelReason?: "manual" | "assignee_inactive";
  cancelAlertAck?: boolean;
  cancelledAt?: string;
  assignedTo: TeamMember;
  assignedBy?: TeamMember;
  createdBy?: TeamMember | string;
  dueAt: string;
  startedAt?: string;
  completedAt?: string;
  timeTakenMinutes?: number;
  /**
   * Everyone who held this task before the current assignee — reassigning
   * hands the same task document on rather than creating a new one, so a
   * former holder still finds it here (read-only) instead of it just
   * disappearing from their board.
   */
  previousAssignees?: Array<{
    user: TeamMember;
    transferredTo: TeamMember;
    transferredAt: string;
  }>;
  relatedEntity?: {
    entityType: "SalesLead" | "Order" | "SalesReturn" | "None";
    entityId: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  taskGroup?: string;
  followers?: TeamMember[];
  followUps?: Array<{
    _id: string;
    message: string;
    author?: TeamMember;
    createdAt: string;
  }>;
  flags?: Array<{
    _id: string;
    message: string;
    raisedBy: TeamMember;
    raisedAt: string;
    adminResponse?: string;
    adminResponseAt?: string;
    resolvedAt?: string;
  }>;
}

export interface TaskFilters {
  status?: string;
  type?: string;
  assignedTo?: string;
  view?: "assigned_by_me" | "assigned_to_me" | "all" | "following";
}

// ── Hooks ──────────────────────────────────────────────────────────────────

export function useMyTasks(filters?: TaskFilters, options?: { enabled?: boolean }) {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== "all") params.append("status", filters.status);
  if (filters?.type && filters.type !== "all") params.append("type", filters.type);
  if (filters?.assignedTo) params.append("assignedTo", filters.assignedTo);
  if (filters?.view) params.append("view", filters.view);

  const qs = params.toString() ? `?${params.toString()}` : "";

  return useQuery({
    enabled: options?.enabled ?? true,
    queryKey: ["tasks", filters],
    queryFn: async (): Promise<Task[]> => {
      const res = await fetch(`${BASE_URL}/my${qs}`, { headers: authHeaders() });
      if (!res.ok) {
        let message = "";

        try {
          const body = await res.text();
          if (body) {
            try {
              const parsed = JSON.parse(body);
              message = parsed?.message || parsed?.error || body;
            } catch {
              message = body;
            }
          }
        } catch {
          message = "";
        }

        throw new Error(
          `Failed to fetch tasks (${res.status} ${res.statusText})${message ? `: ${message}` : ""}`
        );
      }

      const data = await res.json();
      return data.data || [];
    },
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${BASE_URL}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update task");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      // Completing a task closes out its checklist server-side, which is what
      // the Clients board measures progress by — refetch both boards or they
      // keep showing the work as unfinished.
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

/**
 * Ticks one step of a service request's checklist off (or back on). The lead's
 * service — and so the client's progress bar — follows automatically.
 */
export function useUpdateServiceStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stepId, done }: { id: string; stepId: string; done: boolean }) => {
      const res = await fetch(`${BASE_URL}/${id}/steps/${stepId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ done }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update the checklist");
      return data.data as Task;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useCreateManualTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; type?: string; priority?: string; dueAt?: string; assignedTo?: string | string[]; followers?: string[]; description?: string; serviceRequest?: TaskServiceRequest }) => {
      const res = await fetch(`${BASE_URL}/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create task");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export interface ServiceImportRow {
  serviceTitle: string;
  serviceCategory?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  clientAddress?: string;
  notes?: string;
  assignedToName?: string;
  stage?: string;
  priority?: string;
  dueAt?: string;
}

/**
 * Bulk-creates service request tasks from a parsed spreadsheet. Rows whose
 * assignee can't be matched fall back to `fallbackAssignedTo`; anything still
 * unresolvable comes back in `skipped` rather than failing the whole import.
 */
export function useImportServiceTasks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ rows, fallbackAssignedTo }: { rows: ServiceImportRow[]; fallbackAssignedTo?: string }) => {
      const res = await fetch(`${BASE_URL}/service-import`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ rows, fallbackAssignedTo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to import services");
      return data.data as { imported: number; skipped: Array<{ row: number; reason: string }> };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useCancelTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, scope = "all" }: { id: string; scope?: "all" | "single" }) => {
      const res = await fetch(`${BASE_URL}/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ scope }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel task");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

/**
 * Removes a task from every board. Soft delete on the server — the row survives
 * so work logs and follow-up notes pointing at it don't dangle.
 */
export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, scope = "all" }: { id: string; scope?: "all" | "single" }) => {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ scope }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete task");
      return data.data as { deleted: number };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useAdminRespondToFlag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, flagId, response }: { id: string; flagId: string; response: string }) => {
      const res = await fetch(`${BASE_URL}/${id}/issue/${flagId}/respond`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ response }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to respond");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useExtendTaskDue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dueAt }: { id: string; dueAt: string }) => {
      const res = await fetch(`${BASE_URL}/${id}/extend-due`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ dueAt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to extend due date");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useReassignTask() {
  const qc = useQueryClient();
  return useMutation({
    // assignedTo may be a single id or an array (reassign to several people at once).
    mutationFn: async ({ id, assignedTo }: { id: string; assignedTo: string | string[] }) => {
      const body = Array.isArray(assignedTo) ? { assigneeIds: assignedTo } : { assignedTo };
      const res = await fetch(`${BASE_URL}/${id}/reassign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reassign task");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useAcknowledgeCancelAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`${BASE_URL}/${id}/ack-cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to acknowledge cancellation");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useAddFollowUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, message }: { id: string; message: string }) => {
      const res = await fetch(`${BASE_URL}/${id}/follow-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add follow-up");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateFollowers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, followerIds }: { id: string; followerIds: string[] }) => {
      const res = await fetch(`${BASE_URL}/${id}/followers`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ followerIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update follow-up tags");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useAssignMoreToTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, assigneeIds }: { id: string; assigneeIds: string[] }) => {
      const res = await fetch(`${BASE_URL}/${id}/assign-more`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ assigneeIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to assign more staff");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}


