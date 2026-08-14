/**
 * useOperations.ts
 *
 * Unified data-fetching hooks for the Operations module.
 * All requests route through /v1/operations/...  -  the old fragmented
 * hooks (useOrders, useShipments, useDispatchOrder, useSyncTracking)
 * are fully replaced by the exports below.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";
import { ProductCostConfig } from "./useProductCosts";

// ---------------------------------------------------------------------------
// Shared fetch helper
// ---------------------------------------------------------------------------
async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
    const token = localStorage.getItem("opsos_access_token");
    const headers: HeadersInit = {};

    if (init?.body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
        ...init,
        headers: { ...headers, ...init?.headers },
    });
    
    const body = await res.json().catch(() => ({}));
    
    if (!res.ok) {
        throw new Error(body?.message ?? `Operations API error ${res.status}`);
    }
    
    return (body.data !== undefined ? body.data : body) as T;
}

async function opsFetch<T>(path: string, init?: RequestInit): Promise<T> {
    return apiFetch<T>(`${API_BASE}/api/v1/operations${path}`, init);
}

async function ordersFetch<T>(path: string, init?: RequestInit): Promise<T> {
    return apiFetch<T>(`${API_BASE}/api/v1/orders${path}`, init);
}

async function shipmentFetch<T>(path: string, init?: RequestInit): Promise<T> {
    return apiFetch<T>(`${API_BASE}/api/v1/shipment${path}`, init);
}

// ---------------------------------------------------------------------------
// Types  -  aligned with the unified Operations backend responses
// ---------------------------------------------------------------------------

export interface BatchItem {
    productName: string;
    quantity: number;
}

/** A batch record from GET /v1/operations/batches?status=CONFIRMED */
export interface DispatchBatch {
    _id: string;
    batchNumber: string;          // replaces orderNumber
    status: string;
    customer: {
        name: string;
        phone: string;
        email?: string;
    };
    shippingAddress: {
        city: string;
        state: string;
        postalCode: string;
    };
    items: BatchItem[];
    pricing: {
        finalAmount: number;
    };
}

export interface TimelineEvent {
    status: string;
    location?: string;
    description?: string;
    timestamp: string;
}

/** A shipment record from GET /v1/operations/batches/shipments */
export interface Shipment {
    _id: string;
    batchId: {
        batchNumber: string;
    };
    customer: {
        name: string;
        email?: string;
        phone?: string;
    };
    provider: string;
    courierName?: string;
    providerOrderId?: string;
    trackingId: string;
    awbNumber?: string;
    status: string;
    currentLocation?: string;
    estimatedDelivery?: string;
    trackingUrl?: string;
    isDelivered: boolean;
    timeline: TimelineEvent[];
}

export interface Vendor {
    _id: string;
    name: string;
    category: string;
    phone: string;
    email?: string;
    address?: string;
    initialInvestment: number;
    openingBalance: number;
    currentBalance: number;
    status: "active" | "inactive";
    notes?: string;
    productCosts?: ProductCostConfig[];
    investments?: Array<{
        amount: number;
        date: string;
        note?: string;
    }>;
    createdAt: string;
}

export interface Transaction {
    _id: string;
    vendorId: string | Vendor;
    type: "credit" | "debit";
    amount: number;
    referenceType: "invoice" | "payment" | "adjustment";
    referenceId?: string;
    note?: string;
    createdBy: string;
    createdAt: string;
}

/** A row from GET /v1/operations/inventory */
export interface InventoryRow {
    _id: string;
    productId: string;
    productName: string;
    slug?: string;
    sku: string;
    available: number;
    reserved: number;
    total: number;
    reorderLevel: number;
    warehouse: string;
    lastUpdated: string;
    productStock: number;
    isActive: boolean;
    status: "available" | "low_stock" | "out_of_stock";
}

export type BatchStage = 
    | "DRAFT"
    | "CREATED"
    | "INVENTORY_RESERVED"
    | "MIXING"
    | "PROCESSING"
    | "QUALITY_CHECK"
    | "PACKAGING"
    | "READY_FOR_DISPATCH"
    | "DISPATCHED"
    | "DELIVERED"
    | "COMPLETED";

export interface ProductionBatch {
    _id: string;
    batchNumber: string;
    productId: string | { _id: string; name: string; slug: string };
    productName: string;
    quantity: number;
    currentStage: BatchStage;
    dueDate: string;
    notes?: string;
    startedAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
    stageHistory: Array<{
        stage: BatchStage;
        enteredAt: string;
        exitedAt?: string;
        notes?: string;
    }>;
}

interface DispatchOrderApi {
    _id: string;
    orderNumber: string;
    orderStatus: string;
    userId?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    shippingAddress: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        city?: string;
        state?: string;
        postalCode?: string;
    };
    items?: Array<{
        productName?: string;
        quantity?: number;
    }>;
    pricing: {
        finalAmount?: number;
    };
}

interface ShipmentApiRecord {
    _id: string;
    orderId?: {
        orderNumber?: string;
    };
    userId?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    providerId?: {
        displayName?: string;
        name?: string;
    };
    provider: string;
    providerOrderId?: string;
    courierName?: string;
    trackingId: string;
    awbNumber?: string;
    status: string;
    currentLocation?: string;
    estimatedDelivery?: string;
    trackingUrl?: string;
    isDelivered?: boolean;
    timeline?: TimelineEvent[];
}

function buildCustomerName(order: DispatchOrderApi) {
    const firstName = order.shippingAddress?.firstName?.trim?.() || "";
    const lastName = order.shippingAddress?.lastName?.trim?.() || "";
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

    return fullName || order.userId?.name || "Unknown Customer";
}

function mapOrderToDispatchBatch(order: DispatchOrderApi): DispatchBatch {
    return {
        _id: order._id,
        batchNumber: order.orderNumber,
        status: order.orderStatus,
        customer: {
            name: buildCustomerName(order),
            phone: order.shippingAddress?.phone || order.userId?.phone || "",
            email: order.userId?.email,
        },
        shippingAddress: {
            city: order.shippingAddress?.city || "",
            state: order.shippingAddress?.state || "",
            postalCode: order.shippingAddress?.postalCode || "",
        },
        items: Array.isArray(order.items)
            ? order.items.map((item) => ({
                productName: item.productName || "",
                quantity: item.quantity || 0,
            }))
            : [],
        pricing: {
            finalAmount: order.pricing?.finalAmount || 0,
        },
    };
}

function mapShipmentToOperationsShipment(shipment: ShipmentApiRecord): Shipment {
    return {
        _id: shipment._id,
        batchId: {
            batchNumber: shipment.orderId?.orderNumber || "",
        },
        customer: {
            name: shipment.userId?.name || "Unknown Customer",
            email: shipment.userId?.email,
            phone: shipment.userId?.phone,
        },
        // Prefer the human-readable courier name, then the provider display name,
        // then the raw machine name as a last resort.
        provider: shipment.courierName || shipment.providerId?.displayName || shipment.provider,
        courierName: shipment.courierName,
        providerOrderId: shipment.providerOrderId,
        trackingId: shipment.trackingId,
        awbNumber: shipment.awbNumber,
        status: shipment.status,
        currentLocation: shipment.currentLocation,
        estimatedDelivery: shipment.estimatedDelivery,
        trackingUrl: shipment.trackingUrl,
        isDelivered: shipment.isDelivered ?? false,
        timeline: Array.isArray(shipment.timeline) ? shipment.timeline : [],
    };
}

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------
export const opsKeys = {
    batches: (status?: string) => ["ops", "batches", status] as const,
    shipments: (filters?: Record<string, string>) => ["ops", "shipments", filters] as const,
    inventory: () => ["ops", "inventory"] as const,
    vendors: (status?: string) => ["ops", "vendors", status].filter(Boolean) as any,
    vendorTransactions: (vendorId: string) => ["ops", "vendors", vendorId, "transactions"] as const,
    transactions: () => ["ops", "transactions"] as const,
    productionBatches: (filters?: any) => ["ops", "production-batches", filters] as const,
};

// ---------------------------------------------------------------------------
// Inventory - GET /v1/operations/inventory
// ---------------------------------------------------------------------------
export function useOperationsInventory() {
    return useQuery({
        queryKey: opsKeys.inventory(),
        queryFn: () => opsFetch<InventoryRow[]>("/inventory"),
    });
}

export function useUpdateInventoryThreshold() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ threshold }: { threshold: number }) =>
            opsFetch("/inventory/threshold", {
                method: "POST",
                body: JSON.stringify({ threshold }),
            }),
        onSuccess: () => qc.invalidateQueries({ queryKey: opsKeys.inventory() }),
    });
}

// ---------------------------------------------------------------------------
// Dispatch queue - GET /v1/operations/batches?status=CONFIRMED
// ---------------------------------------------------------------------------
export function useConfirmedBatches() {
    return useQuery({
        queryKey: opsKeys.batches("CONFIRMED"),
        queryFn: async () => {
            const orders = await ordersFetch<DispatchOrderApi[] | null>(
                "?orderStatus=CONFIRMED"
            );
            return Array.isArray(orders) ? orders.map(mapOrderToDispatchBatch) : [];
        },
    });
}

// ---------------------------------------------------------------------------
// Shipments list  -  GET /v1/operations/batches/shipments[?status=...]
// ---------------------------------------------------------------------------
export function useOperationsShipments(filters?: { status?: string }) {
    const params = filters?.status
        ? `?status=${encodeURIComponent(filters.status)}`
        : "";
    return useQuery({
        queryKey: opsKeys.shipments(filters),
        queryFn: async () => {
            const rawData = await shipmentFetch<ShipmentApiRecord[] | null>(params);
            const mapped = Array.isArray(rawData)
                ? rawData.map(mapShipmentToOperationsShipment)
                : [];
            return mapped;
        },
    });
}

// ---------------------------------------------------------------------------
// Dispatch a batch  -  POST /v1/operations/batches/:batchId/dispatch
// ---------------------------------------------------------------------------
export function useDispatchBatch() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (orderId: string) =>
            ordersFetch<{ message: string }>(`/${orderId}/dispatch`, { method: "POST" }),
        onSuccess: () => {
            // Refresh both the confirmed queue and shipment list
            qc.invalidateQueries({ queryKey: opsKeys.batches("CONFIRMED") });
            qc.invalidateQueries({ queryKey: opsKeys.shipments() });
        },
    });
}

// ---------------------------------------------------------------------------
// Sync tracking  -  POST /v1/operations/batches/shipments/:trackingId/sync
// ---------------------------------------------------------------------------
export function useOperationsSyncTracking() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (trackingId: string) =>
            shipmentFetch<ShipmentApiRecord>(
                `/${encodeURIComponent(trackingId)}/sync`, { method: "PATCH" }
            ).then(mapShipmentToOperationsShipment),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: opsKeys.shipments() });
        },
    });
}
// ---------------------------------------------------------------------------
// Vendors  -  GET /v1/operations/vendors
// ---------------------------------------------------------------------------
export function useVendors(status: "active" | "inactive" | "all" = "active") {
    const params = status === "all" ? "" : `?status=${status}`;
    return useQuery({
        queryKey: opsKeys.vendors(status),
        queryFn: () => opsFetch<Vendor[]>(`/vendors${params}`),
    });
}

export function useCreateVendor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Vendor>) =>
            opsFetch<Vendor>("/vendors", { method: "POST", body: JSON.stringify(data) }),
        onSuccess: () => qc.invalidateQueries({ queryKey: opsKeys.vendors() }),
    });
}

export function useUpdateVendor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: { id: string } & Partial<Vendor>) =>
            opsFetch<Vendor>(`/vendors/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
        onSuccess: () => qc.invalidateQueries({ queryKey: opsKeys.vendors() }),
    });
}

export function useDeleteVendor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            opsFetch<{ message: string }>(`/vendors/${id}`, { method: "DELETE" }),
        onSuccess: () => qc.invalidateQueries({ queryKey: opsKeys.vendors() }),
    });
}

export function useAddVendorInvestment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, amount, note }: { id: string; amount: number; note?: string }) =>
            opsFetch<Vendor>(`/vendors/${id}/investments`, { 
                method: "POST", 
                body: JSON.stringify({ amount, note }) 
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: opsKeys.vendors() });
            qc.invalidateQueries({ queryKey: opsKeys.transactions() });
        },
    });
}

// ---------------------------------------------------------------------------
// Transactions  -  GET /v1/operations/transactions
// ---------------------------------------------------------------------------
export function useTransactions() {
    return useQuery({
        queryKey: opsKeys.transactions(),
        queryFn: () => opsFetch<Transaction[]>("/transactions"),
    });
}

export function useCreateTransaction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Transaction>) =>
            opsFetch<Transaction>("/transactions", { method: "POST", body: JSON.stringify(data) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: opsKeys.transactions() });
            qc.invalidateQueries({ queryKey: opsKeys.vendors() });
        },
    });
}
// ---------------------------------------------------------------------------
// Audit Logs  -  GET /v1/audit
// ---------------------------------------------------------------------------
export interface AuditLogEntry {
    _id: string;
    actorId: {
        _id: string;
        name: string;
        lastName: string;
        role: string;
    };
    action: string;
    entity: string;
    entityId: string;
    oldMetrics?: any;
    newMetrics?: any;
    ipAddress?: string;
    createdAt: string;
}

export function useAuditLogs(page = 1, limit = 50) {
    return useQuery({
        queryKey: ["audit-logs", page, limit],
        queryFn: () => apiFetch<{ logs: AuditLogEntry[]; total: number; pages: number }>(
            `${API_BASE}/api/v1/audit?page=${page}&limit=${limit}`
        ),
    });
}

// ---------------------------------------------------------------------------
// Vendor Orders — GET /v1/operations/vendor-orders
// ---------------------------------------------------------------------------
export interface VendorOrderItem {
    product: {
        _id: string;
        name: string;
        slug: string;
    };
    productName: string;
    component: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalItemCost: number;
}

export interface VendorOrder {
    _id: string;
    vendorId: Vendor;
    itemsOrdered: VendorOrderItem[];
    powdersOrdered?: VendorOrderItem[]; // Compatibility
    totalCost: number;
    dateOrdered: string;
    remainingBalanceAfterOrder: number;
    status: "pending" | "received";
    createdAt: string;
}

export function useVendorOrders() {
    return useQuery({
        queryKey: ["ops", "vendor-orders"],
        queryFn: () => opsFetch<VendorOrder[]>("/vendor-orders"),
    });
}

export function useCreateVendorOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: any) =>
            opsFetch<VendorOrder>("/vendor-orders", { method: "POST", body: JSON.stringify(data) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["ops", "vendor-orders"] });
            qc.invalidateQueries({ queryKey: opsKeys.vendors() });
        },
    });
}


export function useReceiveVendorOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (orderId: string) =>
            opsFetch<VendorOrder>(`/vendor-orders/${orderId}/receive`, { method: "POST" }),
 onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["ops", "vendor-orders"] });
 qc.invalidateQueries({ queryKey: opsKeys.vendors() });
 qc.invalidateQueries({ queryKey: opsKeys.inventory() });
    },
  });
}

// ---------------------------------------------------------------------------
// Production Batches — GET /v1/operations/batches
// ---------------------------------------------------------------------------
export function useProductionBatches(filters?: any) {
    const params = new URLSearchParams(filters).toString();
    const queryStr = params ? `?${params}` : "";
    return useQuery({
        queryKey: opsKeys.productionBatches(filters),
        queryFn: () => opsFetch<ProductionBatch[]>(`/batches${queryStr}`),
    });
}

export function useCreateProductionBatch() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<ProductionBatch>) =>
            opsFetch<ProductionBatch>("/batches", { method: "POST", body: JSON.stringify(data) }),
        onSuccess: () => qc.invalidateQueries({ queryKey: opsKeys.productionBatches() }),
    });
}

export function useAdvanceBatchStage() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
            opsFetch<ProductionBatch>(`/batches/${id}/advance`, { 
                method: "POST", 
                body: JSON.stringify({ notes }) 
            }),
        onSuccess: () => qc.invalidateQueries({ queryKey: opsKeys.productionBatches() }),
    });
}

export function useReserveBatchInventory() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            opsFetch<ProductionBatch>(`/batches/${id}/reserve-inventory`, { method: "POST" }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: opsKeys.productionBatches() });
            qc.invalidateQueries({ queryKey: opsKeys.vendors() });
        },
    });
}

export function useRunBatchQC() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, outcome, notes }: { id: string; outcome: "pass" | "fail"; notes?: string }) =>
            opsFetch<ProductionBatch>(`/batches/${id}/qc`, { 
                method: "POST", 
                body: JSON.stringify({ outcome, notes }) 
            }),
        onSuccess: () => qc.invalidateQueries({ queryKey: opsKeys.productionBatches() }),
    });
}

export function useDeleteProductionBatch() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            opsFetch<{ message: string }>(`/batches/${id}`, { method: "DELETE" }),
        onSuccess: () => qc.invalidateQueries({ queryKey: opsKeys.productionBatches() }),
    });
}
