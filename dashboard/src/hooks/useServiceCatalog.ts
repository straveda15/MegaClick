import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

const BASE = API_BASE + "/api/v1/service-catalog";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface CatalogService {
  title: string;
  slug: string;
  emoji?: string;
  category: string;
  categorySlug: string;
}

export interface CatalogCategory {
  id: number;
  title: string;
  slug: string;
  description?: string;
  services: Array<{
    title: string;
    slug: string;
    emoji?: string;
  }>;
}

export interface ServiceCatalog {
  categories: CatalogCategory[];
  services: CatalogService[];
  total: number;
}

async function fetchServiceCatalog(): Promise<ServiceCatalog> {
  const res = await fetch(BASE, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch service catalog");
  return data.data;
}

export function useServiceCatalog() {
  return useQuery({
    queryKey: ["service-catalog"],
    queryFn: fetchServiceCatalog,
    // Services can be added from the Service Steps page, so keep this short
    // enough that other people's open sessions pick a new one up promptly.
    staleTime: 60 * 1000,
  });
}

/**
 * Adds a service to the catalog. Every dropdown that lists services (Add Lead,
 * Add Client, the Service Steps picker) reads the same query, so invalidating it
 * is all it takes for the new service to appear in all of them.
 */
export function useCreateCatalogService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string; categorySlug: string }): Promise<CatalogService> => {
      const res = await fetch(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(input),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to add the service");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["service-catalog"] });
    },
  });
}

/**
 * Renames a service or moves it to another category. Its slug stays put, so
 * leads, step templates and fees that reference it are unaffected.
 */
export function useUpdateCatalogService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, ...input }: { slug: string; title: string; categorySlug: string }): Promise<CatalogService> => {
      const res = await fetch(`${BASE}/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(input),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to update the service");
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["service-catalog"] });
      // The step template keeps its own copy of the service's name and category.
      qc.invalidateQueries({ queryKey: ["service-steps"] });
    },
  });
}

/** Removes a service from the dashboard's list. Existing leads and clients keep it. */
export function useDeleteCatalogService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`${BASE}/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to delete the service");
      return slug;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["service-catalog"] });
    },
  });
}
