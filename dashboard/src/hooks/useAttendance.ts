import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

const BASE = API_BASE + "/api/v1/attendance";
const WL_BASE = API_BASE + "/api/v1/attendance/work-locations";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AttendanceRecord {
  _id: string;
  userId: any;
  employeeProfileId?: any;
  date: string;
  punchIn: string;
  punchOut?: string;
  gpsLocation?: { lat: number; lng: number };
  gpsVerified: boolean;
  punchOutGpsLocation?: { lat: number; lng: number };
  punchOutGpsVerified?: boolean;
  locationId?: string;
  totalHours?: number;
  status: "present" | "half-day" | "late" | "absent" | "on-leave";
  source?: string;
  isHalfDay: boolean;
  halfDayReason?: string;
  workMode?: "office" | "site";
  site?: { name?: string; lat?: number; lng?: number };
  halfDayStatus?: "none" | "pending" | "approved" | "rejected";
  halfDayApprovedBy?: any;
  confirmedPunchOut: boolean;
  earlyPunchOutReason?: string;
  earlyPunchOutStatus: "none" | "pending" | "approved" | "rejected";
  earlyPunchOutApprovedBy?: any;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PunchInput {
  userId: string;
  location?: { lat: number; lng: number };
}

export interface SelfPunchInInput {
  gpsLocation?: { lat: number; lng: number } | null;
  source?: string;
  isHalfDay?: boolean;
  halfDayReason?: string;
  /** "office" is gated on the assigned geofence; "site" is declared instead. */
  workMode?: "office" | "site";
  site?: { name: string; lat: number; lng: number };
}

type PunchOutResult =
  | { requiresConfirmation: true; message: string }
  | { requiresEarlyPunchOutReason: true; message: string }
  | { success: true; data: { attendance: AttendanceRecord } };

export interface WorkLocationInput {
  name: string;
  lat: number;
  lng: number;
  radiusMeters?: number;
  isActive?: boolean;
  assignedDepartments?: string[];
}

export interface WorkLocation {
  _id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  isActive: boolean;
  assignedEmployees: { _id: string; name: string; lastName: string; phone: string }[];
  assignedDepartments: string[];
  createdBy: { _id: string; name: string };
  createdAt: string;
}

// ── Admin punch helpers ───────────────────────────────────────────────────────

async function fetchTodayAttendance(): Promise<AttendanceRecord[]> {
  const res = await fetch(`${BASE}/today`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch today's attendance");
  return data.data.attendance ?? [];
}

async function fetchUserAttendance(userId: string): Promise<AttendanceRecord[]> {
  const res = await fetch(`${BASE}/user/${userId}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch user attendance");
  return data.data.attendance ?? [];
}

async function fetchAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
  const res = await fetch(`${BASE}/?date=${date}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch attendance by date");
  return data.data.attendance ?? [];
}

async function fetchPendingAttendance(): Promise<AttendanceRecord[]> {
  const res = await fetch(`${BASE}/pending`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch pending attendance");
  return data.data.attendance ?? [];
}

async function punchIn(body: PunchInput): Promise<AttendanceRecord> {
  const res = await fetch(`${BASE}/punch-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to punch in");
  return data.data;
}

async function punchOut(body: PunchInput): Promise<AttendanceRecord> {
  const res = await fetch(`${BASE}/punch-out`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to punch out");
  return data.data;
}

async function deleteAttendance(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete attendance");
  }
}

async function overrideAttendance(body: any): Promise<AttendanceRecord> {
  const res = await fetch(`${BASE}/override`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to override attendance");
  return data.data.attendance;
}

export function useTodayAttendance() {
  return useQuery({ queryKey: ["today-attendance"], queryFn: fetchTodayAttendance });
}

export function useUserAttendance(userId: string) {
  return useQuery({
    queryKey: ["user-attendance", userId],
    queryFn: () => fetchUserAttendance(userId),
    enabled: !!userId,
  });
}

export function usePunchIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: punchIn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["today-attendance"] });
      qc.invalidateQueries({ queryKey: ["user-attendance"] });
    },
  });
}

export function usePunchOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: punchOut,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["today-attendance"] });
      qc.invalidateQueries({ queryKey: ["user-attendance"] });
    },
  });
}

export function useDeleteAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["today-attendance"] });
      qc.invalidateQueries({ queryKey: ["attendance-by-date"] });
    },
  });
}

export function useAttendanceByDate(date: string) {
  return useQuery({
    queryKey: ["attendance-by-date", date],
    queryFn: () => fetchAttendanceByDate(date),
    enabled: !!date,
  });
}

export function usePendingAttendance() {
  return useQuery({
    queryKey: ["pending-attendance"],
    queryFn: fetchPendingAttendance,
  });
}

export function useOverrideAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: overrideAttendance,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["today-attendance"] });
      qc.invalidateQueries({ queryKey: ["attendance-by-date"] });
      qc.invalidateQueries({ queryKey: ["user-attendance"] });
    },
  });
}

// ── Self-service hooks ────────────────────────────────────────────────────────

async function fetchMyTodayAttendance(): Promise<AttendanceRecord | null> {
  const res = await fetch(`${BASE}/me/today`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch your today's attendance");
  return data.data.attendance || null;
}

async function fetchMyAttendance(month?: string): Promise<{ records: AttendanceRecord[]; summary: any }> {
  const url = month ? `${BASE}/me?month=${month}` : `${BASE}/me`;
  const res = await fetch(url, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch your attendance history");
  return data.data;
}

async function selfPunchIn(body: SelfPunchInInput): Promise<AttendanceRecord> {
  const res = await fetch(`${BASE}/me/punch-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to punch in");
  return data.data.attendance;
}

async function selfPunchOut(body: { 
  confirmed?: boolean; 
  earlyPunchOutReason?: string; 
  earlyPunchOutConfirmed?: boolean; 
  gpsLocation?: { lat: number; lng: number } | null;
}): Promise<PunchOutResult> {
  const res = await fetch(`${BASE}/me/punch-out`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to punch out");
  return data;
}

async function approveEarlyPunchOut({ id, status }: { id: string; status: "approved" | "rejected" }): Promise<AttendanceRecord> {
  const res = await fetch(`${BASE}/${id}/approve-early-punch-out`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to approve early punch-out");
  return data.data.attendance;
}

async function approveHalfDay({ id, status }: { id: string; status: "approved" | "rejected" }): Promise<AttendanceRecord> {
  const res = await fetch(`${BASE}/${id}/approve-half-day`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to approve half-day");
  return data.data.attendance;
}

export function useMyTodayAttendance() {
  return useQuery({ queryKey: ["my-today-attendance"], queryFn: fetchMyTodayAttendance });
}

export function useMyAttendance(month?: string) {
  return useQuery({
    queryKey: ["my-attendance", month],
    queryFn: () => fetchMyAttendance(month),
  });
}

export function useSelfPunchIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: selfPunchIn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-today-attendance"] });
      qc.invalidateQueries({ queryKey: ["my-attendance"] });
    },
  });
}

export function useSelfPunchOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: selfPunchOut,
    onSuccess: (result) => {
      if (!("requiresConfirmation" in result) && !("requiresEarlyPunchOutReason" in result)) {
        qc.invalidateQueries({ queryKey: ["my-today-attendance"] });
        qc.invalidateQueries({ queryKey: ["my-attendance"] });
      }
    },
  });
}

export function useApproveEarlyPunchOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approveEarlyPunchOut,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["today-attendance"] });
      qc.invalidateQueries({ queryKey: ["attendance-by-date"] });
      qc.invalidateQueries({ queryKey: ["pending-attendance"] });
    },
  });
}

export function useApproveHalfDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approveHalfDay,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["today-attendance"] });
      qc.invalidateQueries({ queryKey: ["attendance-by-date"] });
      qc.invalidateQueries({ queryKey: ["pending-attendance"] });
    },
  });
}

// ── WorkLocation hooks ────────────────────────────────────────────────────────

async function fetchWorkLocations(): Promise<WorkLocation[]> {
  const res = await fetch(WL_BASE, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch work locations");
  return data.data.locations;
}

async function createWorkLocation(body: WorkLocationInput): Promise<WorkLocation> {
  const res = await fetch(WL_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create work location");
  return data.data.location;
}

async function updateWorkLocation({ id, ...body }: WorkLocationInput & { id: string }): Promise<WorkLocation> {
  const res = await fetch(`${WL_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update work location");
  return data.data.location;
}

async function assignEmployees({ id, employeeIds }: { id: string; employeeIds: string[] }): Promise<WorkLocation> {
  const res = await fetch(`${WL_BASE}/${id}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ employeeIds }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to assign employees");
  return data.data.location;
}

async function unassignEmployees({ id, employeeIds }: { id: string; employeeIds: string[] }): Promise<WorkLocation> {
  const res = await fetch(`${WL_BASE}/${id}/unassign`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ employeeIds }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to unassign employees");
  return data.data.location;
}

async function deleteWorkLocation(id: string): Promise<void> {
  const res = await fetch(`${WL_BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete work location");
  }
}

export function useWorkLocations() {
  return useQuery({ queryKey: ["work-locations"], queryFn: fetchWorkLocations });
}

export function useCreateWorkLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createWorkLocation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-locations"] }),
  });
}

export function useUpdateWorkLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateWorkLocation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-locations"] }),
  });
}

export function useAssignEmployees() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assignEmployees,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-locations"] }),
  });
}

export function useUnassignEmployees() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unassignEmployees,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-locations"] }),
  });
}

export function useDeleteWorkLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkLocation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-locations"] }),
  });
}
