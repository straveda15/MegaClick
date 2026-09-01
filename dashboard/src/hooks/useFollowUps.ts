import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

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

export const FOLLOW_UP_OUTCOMES = [
  "contacted",
  "no_answer",
  "rescheduled",
  "meeting_set",
  "note",
] as const;

export type FollowUpOutcome = (typeof FOLLOW_UP_OUTCOMES)[number];

/** How urgent a scheduled follow-up is, relative to now. */
export type FollowUpBucket = "overdue" | "today" | "this_week" | "later" | "unscheduled";

/** One logged follow-up: what happened, when, and where it was pushed to. */
export interface FollowUpEntry {
  _id: string;
  note: string;
  outcome: FollowUpOutcome;
  /** The next follow-up this entry scheduled. */
  followUpAt: string | null;
  /** When the entry itself was recorded. */
  createdAt: string | null;
  createdBy: string | null;
}

export interface FollowUpRow {
  _id: string;
  leadId: string;
  reference: string;
  client: { name: string; phone: string; email: string; company: string; city: string };
  services: Array<{ _id: string; title: string; temperature: string; assignedTo: string | null }>;
  status: string;
  source?: string;
  owner: string | null;
  followUpAt: string | null;
  followUpNote: string;
  bucket: FollowUpBucket;
  lastFollowUpAt: string | null;
  followUpCount: number;
  history: FollowUpEntry[];
}

// ── Hooks ──────────────────────────────────────────────────────────────────

/** Every lead that is due a follow-up or has been followed up before. */
export function useFollowUps() {
  return useQuery({
    queryKey: ["follow-ups"],
    queryFn: async (): Promise<FollowUpRow[]> => {
      const res = await fetch(`${BASE_URL}/follow-ups`, { headers: authHeaders() });
      const data = await readJson(res, "Failed to fetch follow-ups");
      return data.data || [];
    },
  });
}

/**
 * Logs what happened on a follow-up and reschedules the next one. Leaving the
 * next date empty closes the loop — the lead drops off the due list instead of
 * sitting there permanently overdue.
 */
export function useLogFollowUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadId, note, outcome, nextFollowUpAt }: {
      leadId: string;
      note?: string;
      outcome?: FollowUpOutcome;
      nextFollowUpAt?: string | null;
    }) => {
      const res = await fetch(`${BASE_URL}/leads/${leadId}/follow-ups`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ note, outcome, nextFollowUpAt }),
      });
      const data = await readJson(res, "Failed to log the follow-up");
      return data.data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["follow-ups"] });
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["lead", variables.leadId] });
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
