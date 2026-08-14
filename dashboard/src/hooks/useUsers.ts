import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

const BASE = API_BASE + "/api/v1/users";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface SiteUser {
  _id: string;
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  landmark?: string;
  amountSpent?: number;
  source?: "website" | "admin_panel";
  role: string;
  departmentRole?: string;
  operationalRoles: string[];
  allowedPaths: string[];
  department?: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  authProvider: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserInput {
  name: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  landmark?: string;
  role?: string;
  departmentRole?: string;
  operationalRoles?: string[];
  allowedPaths?: string[];
  department?: string;
  isActive?: boolean;
}

async function fetchAllUsers(role?: string): Promise<SiteUser[]> {
  const url = role ? `${BASE}/all?role=${role}` : `${BASE}/all`;
  const res = await fetch(url, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch users");
  return data.data ?? [];
}

async function createUser(body: UserInput): Promise<SiteUser> {
  const res = await fetch(`${BASE}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create user");
  if (!data.data || typeof data.data !== "object") {
    throw new Error("Missing user data in response");
  }
  return data.data as SiteUser;
}

async function updateUser({ id, body }: { id: string; body: UserInput }): Promise<SiteUser> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update user");
  return data.data;
}

async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (res.status === 204) return; // No Content — success, no body to parse
  const contentType = res.headers.get("Content-Type") ?? "";
  const hasJson = contentType.includes("application/json");
  if (!res.ok) {
    const errData = hasJson ? await res.json() : null;
    throw new Error(errData?.message || "Failed to delete user");
  }
}

export function useUsers(role?: string) {
  return useQuery({ 
    queryKey: ["site-users", role], 
    queryFn: () => fetchAllUsers(role) 
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-users"] }),
  });
}
