import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

const BASE_URL = `${API_BASE}/api/v1/worklogs`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface WorkLogUser {
  _id: string;
  name: string;
  lastName?: string;
  email?: string;
  role?: string;
}

export type WorkLogCategory =
  | "task" | "lead" | "production" | "dispatch" | "warehouse"
  | "packaging" | "order" | "return" | "manual" | "other";

export interface WorkLog {
  _id: string;
  user: string | WorkLogUser; // populated on the team endpoint, id on /my
  activity: string;
  category: WorkLogCategory;
  startedAt?: string | null;
  endedAt?: string | null;
  loggedAt: string;
  timeSpentMinutes?: number;
  note?: string;
  source: "auto" | "manual";
  refType?: string | null;
  refId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkLogRange {
  start?: string;
  end?: string;
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body?.message || body?.error || fallback;
  } catch {
    return fallback;
  }
}

// ── Hooks ──────────────────────────────────────────────────────────────────

/** The current user's own day-wise work logs. */
export function useMyWorkLogs(range?: WorkLogRange) {
  const params = new URLSearchParams();
  if (range?.start) params.append("start", range.start);
  if (range?.end) params.append("end", range.end);
  const qs = params.toString() ? `?${params.toString()}` : "";

  return useQuery({
    queryKey: ["worklogs", "mine", range ?? {}],
    queryFn: async (): Promise<WorkLog[]> => {
      const res = await fetch(`${BASE_URL}/my${qs}`, { headers: authHeaders() });
      if (!res.ok) throw new Error(await parseError(res, "Failed to fetch work logs"));
      const data = await res.json();
      return data.data || [];
    },
  });
}

/** Every person's work logs — admin/founder/cofounder only. */
export function useTeamWorkLogs(
  filters?: WorkLogRange & { userId?: string },
  options?: { enabled?: boolean }
) {
  const params = new URLSearchParams();
  if (filters?.start) params.append("start", filters.start);
  if (filters?.end) params.append("end", filters.end);
  if (filters?.userId) params.append("userId", filters.userId);
  const qs = params.toString() ? `?${params.toString()}` : "";

  return useQuery({
    enabled: options?.enabled ?? true,
    queryKey: ["worklogs", "team", filters ?? {}],
    queryFn: async (): Promise<WorkLog[]> => {
      const res = await fetch(`${BASE_URL}/team${qs}`, { headers: authHeaders() });
      if (!res.ok) throw new Error(await parseError(res, "Failed to fetch team logs"));
      const data = await res.json();
      return data.data || [];
    },
  });
}

/** Add a manual work-log entry for the current user. */
export function useCreateWorkLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      activity: string;
      startedAt?: string;
      endedAt?: string;
      note?: string;
    }) => {
      const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await parseError(res, "Failed to add log entry"));
      const data = await res.json();
      return data.data as WorkLog;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["worklogs"] });
    },
  });
}
