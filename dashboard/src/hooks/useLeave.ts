import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

const BASE = API_BASE + "/api/v1/leaves";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface LeaveRecord {
  _id: string;
  userId: any; // populated User object
  leaveType: "sick" | "casual" | "earned" | "maternity" | "paternity" | "other";
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: any;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveInput {
  userId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

async function fetchPendingLeaves(): Promise<LeaveRecord[]> {
  const res = await fetch(`${BASE}/pending`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch pending leaves");
  return data.data ?? [];
}

async function fetchAllLeaves(): Promise<LeaveRecord[]> {
  const res = await fetch(`${BASE}/`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch all leaves");
  return data.data ?? [];
}

async function applyLeave(body: LeaveInput): Promise<LeaveRecord> {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to apply leave");
  return data.data;
}

async function approveLeave(id: string): Promise<LeaveRecord> {
  const res = await fetch(`${BASE}/${id}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to approve leave");
  return data.data;
}

async function rejectLeave({ id, rejectionReason }: { id: string; rejectionReason?: string }): Promise<LeaveRecord> {
  const res = await fetch(`${BASE}/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ rejectionReason }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to reject leave");
  return data.data;
}

export function usePendingLeaves() {
  return useQuery({ queryKey: ["pending-leaves"], queryFn: fetchPendingLeaves });
}

export function useAllLeaves() {
  return useQuery({ queryKey: ["all-leaves"], queryFn: fetchAllLeaves });
}

export function useApplyLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applyLeave,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pending-leaves"] });
      qc.invalidateQueries({ queryKey: ["all-leaves"] });
    },
  });
}

export function useApproveLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approveLeave,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pending-leaves"] });
      qc.invalidateQueries({ queryKey: ["all-leaves"] });
    },
  });
}

export function useRejectLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rejectLeave,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pending-leaves"] });
      qc.invalidateQueries({ queryKey: ["all-leaves"] });
    },
  });
}

// ── Self-service hooks ────────────────────────────────────────────────────────

export interface LeaveBalance {
  year: number;
  earned: { total: number; used: number };
  sick: { total: number; used: number };
  casual: { total: number; used: number };
}

async function fetchMyLeaves(): Promise<LeaveRecord[]> {
  const res = await fetch(`${BASE}/me`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch your leaves");
  return data.data ?? [];
}

async function fetchMyLeaveBalance(): Promise<LeaveBalance> {
  const res = await fetch(`${BASE}/me/balance`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch your leave balance");
  return data.data;
}

async function applyLeaveSelf(body: any): Promise<LeaveRecord> {
  const res = await fetch(`${BASE}/me/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to apply leave");
  return data.data;
}

async function cancelMyLeave(id: string): Promise<void> {
  const res = await fetch(`${BASE}/me/${id}/cancel`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to cancel leave");
  }
}

export function useMyLeaves() {
  return useQuery({ queryKey: ["my-leaves"], queryFn: fetchMyLeaves });
}

export function useMyLeaveBalance() {
  return useQuery({ queryKey: ["my-leave-balance"], queryFn: fetchMyLeaveBalance });
}

export function useApplyLeaveSelf() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applyLeaveSelf,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-leaves"] });
      qc.invalidateQueries({ queryKey: ["my-leave-balance"] });
    },
  });
}

export function useCancelMyLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelMyLeave,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-leaves"] });
      qc.invalidateQueries({ queryKey: ["my-leave-balance"] });
    },
  });
}

