import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

const BASE_SHIPMENT = API_BASE + "/api/v1/shipment";
const BASE_ORDERS   = API_BASE + "/api/v1/orders";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export interface TimelineEvent {
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

export interface Shipment {
  _id: string;
  // Populated by the backend. Comes back null when the referenced order no
  // longer exists — populate() resolves a dangling ref to null — so every read
  // of a field on it has to be guarded.
  orderId: {
    _id: string;
    orderNumber: string;
    orderStatus: string;
    pricing: { finalAmount: number };
  } | null;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  provider: string;
  trackingId: string;
  awbNumber: string;
  status: string;
  statusCode: string;
  trackingUrl: string;
  currentLocation: string;
  estimatedDelivery: string | null;
  charges: {
    freight: number;
    cod: number;
    handling: number;
    total: number;
  };
  timeline: TimelineEvent[];
  isDelivered: boolean;
  isReturned: boolean;
  createdAt: string;
  updatedAt: string;
}

/* â”€â”€ Fetch all shipments (admin) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

async function fetchShipments(filters?: Record<string, string>): Promise<Shipment[]> {
  const params = new URLSearchParams(filters || {}).toString();
  const url = params ? `${BASE_SHIPMENT}?${params}` : BASE_SHIPMENT;
  const res = await fetch(url, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch shipments");
  return data.data ?? [];
}

export function useShipments(filters?: Record<string, string>) {
  return useQuery({
    queryKey: ["shipments", filters],
    queryFn: () => fetchShipments(filters),
  });
}

/* â”€â”€ Dispatch an order (admin) â†’ creates shipment + moves order to SHIPPED â”€â”€ */

async function dispatchOrder(orderId: string): Promise<{ order: unknown; shipment: Shipment }> {
  const res = await fetch(`${BASE_ORDERS}/${orderId}/dispatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to dispatch order");
  return data.data;
}

export function useDispatchOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: dispatchOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shipments"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

/* â”€â”€ Sync tracking from provider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

async function syncTracking(trackingId: string): Promise<Shipment> {
  const res = await fetch(`${BASE_SHIPMENT}/${trackingId}/sync`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to sync tracking");
  return data.data;
}

export function useSyncTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: syncTracking,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shipments"] }),
  });
}

/* â”€â”€ Fetch single shipment by orderId â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

async function fetchShipmentByOrder(orderId: string): Promise<Shipment> {
  const res = await fetch(`${BASE_SHIPMENT}/${orderId}`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Shipment not found");
  return data.data;
}

export function useShipmentByOrder(orderId: string | null) {
  return useQuery({
    queryKey: ["shipment", orderId],
    queryFn: () => fetchShipmentByOrder(orderId!),
    enabled: !!orderId,
  });
}
