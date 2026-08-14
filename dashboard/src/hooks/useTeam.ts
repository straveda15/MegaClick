import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

const BASE = API_BASE + "/api/v1/team";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface EmployeeProfile {
  _id: string;
  userId: any; // populated User object
  employeeId: string;
  designation: string;
  department: string;
  managerId?: any; // populated User object
  employmentType: string;
  joiningDate: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeInput {
  userId: string;
  designation: string;
  department: string;
  managerId?: string | null;
  employmentType?: string;
  joiningDate: string;
  status?: "active" | "inactive";
}

async function fetchAllEmployees(): Promise<EmployeeProfile[]> {
  const res = await fetch(`${BASE}/`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch employees");
  return data.data ?? [];
}

async function createEmployee(body: EmployeeInput): Promise<EmployeeProfile> {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create employee");
  return data.data;
}

async function updateEmployee({ id, body }: { id: string; body: Partial<EmployeeInput> }): Promise<EmployeeProfile> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update employee");
  return data.data;
}

async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete employee");
}

export function useTeam() {
  return useQuery({ queryKey: ["team-employees"], queryFn: fetchAllEmployees, staleTime: 0 });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team-employees"] }),
  });
}

export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team-employees"] }),
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team-employees"] }),
  });
}
