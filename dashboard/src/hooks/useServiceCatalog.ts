import { useQuery } from "@tanstack/react-query";
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
    staleTime: 5 * 60 * 1000,
  });
}
