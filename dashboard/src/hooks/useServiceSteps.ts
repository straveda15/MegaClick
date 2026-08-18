import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

const BASE_URL = `${API_BASE}/api/v1/service-steps`;

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

/** One step of the checklist configured for a service. */
export interface ServiceStep {
  title: string;
  description?: string;
  order: number;
}

export interface ServiceStepTemplate {
  _id?: string;
  serviceSlug: string;
  serviceTitle?: string;
  serviceCategory?: string;
  categorySlug?: string;
  steps: ServiceStep[];
  updatedAt?: string;
}

// ── Hooks ──────────────────────────────────────────────────────────────────

/** Every service that has a checklist configured. */
export function useServiceStepTemplates() {
  return useQuery({
    queryKey: ["service-steps"],
    queryFn: async (): Promise<ServiceStepTemplate[]> => {
      const res = await fetch(BASE_URL, { headers: authHeaders() });
      const data = await readJson(res, "Failed to fetch service steps");
      return data.data || [];
    },
  });
}

/**
 * The checklist for one service. A service with nothing configured resolves to
 * an empty step list rather than an error — that's a normal state.
 */
export function useServiceStepTemplate(serviceSlug?: string) {
  return useQuery({
    enabled: Boolean(serviceSlug),
    queryKey: ["service-steps", serviceSlug],
    queryFn: async (): Promise<ServiceStepTemplate> => {
      const res = await fetch(`${BASE_URL}/${encodeURIComponent(serviceSlug!)}`, { headers: authHeaders() });
      const data = await readJson(res, "Failed to fetch service steps");
      return data.data;
    },
  });
}

export function useSaveServiceSteps() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ serviceSlug, serviceTitle, steps }: {
      serviceSlug: string;
      serviceTitle?: string;
      steps: Array<{ title: string; description?: string; order: number }>;
    }) => {
      const res = await fetch(`${BASE_URL}/${encodeURIComponent(serviceSlug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ serviceTitle, steps }),
      });
      const data = await readJson(res, "Failed to save service steps");
      return data.data as ServiceStepTemplate;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["service-steps"] });
    },
  });
}

export function useDeleteServiceSteps() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (serviceSlug: string) => {
      const res = await fetch(`${BASE_URL}/${encodeURIComponent(serviceSlug)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      await readJson(res, "Failed to remove service steps");
      return serviceSlug;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["service-steps"] });
    },
  });
}
