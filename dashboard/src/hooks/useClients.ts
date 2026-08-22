import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "./api-config";
import type { ServiceStage } from "./useTasks";
import type { FollowUpEntry } from "./useFollowUps";
import type { AdvancePayment, LedgerEntry, QuotationItem } from "./useLeads";

const BASE_URL = `${API_BASE}/api/v1/sales`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface ClientServiceStep {
  _id: string;
  title: string;
  description?: string;
  order: number;
  done: boolean;
  completedAt?: string | null;
}

export type ClientTaskStatus =
  | "unassigned" | "pending" | "in_progress" | "completed" | "cancelled" | "overdue";

/** One service a client has with us, and the state of the work on it. */
export interface ClientService {
  _id: string;
  leadId: string;
  title: string;
  slug?: string;
  category?: string;
  stage: ServiceStage;
  /** Hot/warm/cold for this request specifically. */
  temperature: "HOT" | "WARM" | "COLD";
  startAt: string | null;
  dueAt: string | null;
  taskId: string | null;
  /** "unassigned" until the service is handed to an employee. */
  taskStatus: ClientTaskStatus;
  priority: string | null;
  assignedAt: string | null;
  assignedTo: { _id: string; name: string; email?: string } | null;
  steps: ClientServiceStep[];
  stepsDone: number;
  stepsTotal: number;
  /** Percentage — 0 until assigned, then the checklist, else the stage. */
  progress: number;
  quotation?: number;
  /** What was quoted when the lead was first captured. */
  initialQuotation?: number | null;
  quotationConfirmed?: boolean;
  /** The agreed line items — also the invoice's Particulars. */
  quotationItems: QuotationItem[];
  /** Payments received against this service, oldest first. */
  ledger: LedgerEntry[];
  /** Sum of the ledger — what has actually been received for this service. */
  paid: number;
  /** The part of that which is new money, excluding applied customer credit. */
  directPaid: number;
  /** Quotation minus what has been received. */
  balance: number;
  notes?: string;
}

/**
 * A client is a lead — the same record under a different lens, sharing the same
 * reference so `clientId` on this board and the Lead ID on the Leads board are
 * the same string.
 */
export interface Client {
  _id: string;
  leadId: string;
  clientId: string;
  customerId: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  city: string;
  state: string;
  address: string;
  source?: string;
  status?: string;
  followUpAt: string | null;
  followUpNote: string;
  /** Every follow-up logged against this client, newest first. */
  followUpHistory: FollowUpEntry[];
  message?: string;
  createdAt?: string;
  /** One advance covering the whole engagement, taken at confirmation. */
  advancePayment: AdvancePayment | null;
  services: ClientService[];
  totalServices: number;
  assignedServices: number;
  unassignedServices: number;
  activeServices: number;
  completedServices: number;
  progress: number;
  nextDeadline: string | null;
  assignedTo: string[];
}

// ── Hooks ──────────────────────────────────────────────────────────────────

/**
 * Every client. A lead shows up here as soon as it is captured — this is the
 * board where work gets handed to employees, so a lead with nothing assigned
 * has to appear or it could never be assigned at all.
 */
export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async (): Promise<Client[]> => {
      const res = await fetch(`${BASE_URL}/clients`, { headers: authHeaders() });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to fetch clients");
      return data.data || [];
    },
  });
}
