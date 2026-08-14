import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

const BASE = API_BASE + "/api/v1/orders";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface OrderItem {
  productId: string;
  productName: string;
  priceAtPurchase: number;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  pricing: {
    subtotal: number;
    discountAmount: number;
    finalAmount: number;
    prepaidAmount?: number;
    codDueAmount?: number;
  };
  payment: {
    paymentProvider: string;
    paymentOrderId?: string;
    paymentId?: string;
    paymentStatus: string;
    paymentMethod?: string;
  };
  orderStatus: string;
  notes?: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchOrders(statusFilter?: string): Promise<Order[]> {
  const url = statusFilter && statusFilter !== "all" 
    ? `${BASE}?orderStatus=${statusFilter}` 
    : BASE;
    
  const res = await fetch(url, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
  return data.data ?? [];
}

export function useOrders(statusFilter?: string) {
  return useQuery({
    queryKey: ["orders", statusFilter],
    queryFn: () => fetchOrders(statusFilter),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}

async function updateOrderStatus({ id, status }: { id: string; status: string }): Promise<Order> {
  const res = await fetch(`${BASE}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update status");
  return data.data;
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

async function fetchOrderById(orderId: string): Promise<Order> {
  const url = `${BASE}/${orderId}`;
  console.log("[fetchOrderById] → GET", url);
  const res = await fetch(url, { headers: authHeaders() });
  const data = await res.json();
  console.log("[fetchOrderById] HTTP status:", res.status);
  console.log("[fetchOrderById] raw response:", JSON.stringify(data, null, 2));
  if (!res.ok) {
    console.log("[fetchOrderById] FAILED — throwing, data.data will be undefined");
    throw new Error(data.message || "Order not found");
  }
  console.log("[fetchOrderById] data.data keys:", data.data ? Object.keys(data.data) : "data.data IS NULL/UNDEFINED");
  console.log("[fetchOrderById] data.data.shippingAddress:", data.data?.shippingAddress ?? "MISSING");
  console.log("[fetchOrderById] data.data.items:", data.data?.items ?? "MISSING");
  return data.data;
}

export function useOrderById(orderId: string | null) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId!),
    enabled: !!orderId,
  });
}

export interface OrderEditStatus {
  canEdit: boolean;
  warning?: string | null;
  reason?: string;
}

async function fetchOrderEditStatus(orderId: string): Promise<OrderEditStatus> {
  const res = await fetch(`${BASE}/${orderId}/edit-status`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch edit status");
  return data.data;
}

export function useOrderEditStatus(orderId: string | null) {
  return useQuery({
    queryKey: ["order-edit-status", orderId],
    queryFn: () => fetchOrderEditStatus(orderId!),
    enabled: !!orderId,
  });
}

export interface EditOrderPayload {
  items?: Array<{
    productId: string;
    productName: string;
    priceAtPurchase: number;
    quantity: number;
    variant?: { name: string; value: string };
    weight?: number;
  }>;
  shippingAddress?: Partial<Order["shippingAddress"]>;
  notes?: string;
  pricing?: { discountAmount?: number; couponCode?: string | null; deliveryCharge?: number };
}

async function patchEditOrder({ orderId, payload }: { orderId: string; payload: EditOrderPayload }): Promise<Order> {
  const res = await fetch(`${BASE}/${orderId}/edit`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update order");
  return data.data;
}

export function useEditOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchEditOrder,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order", variables.orderId] });
      qc.invalidateQueries({ queryKey: ["packaging-queue"] });
      qc.invalidateQueries({ queryKey: ["packaging-order", variables.orderId] });
      qc.invalidateQueries({ queryKey: ["order-edit-status", variables.orderId] });
    },
  });
}
