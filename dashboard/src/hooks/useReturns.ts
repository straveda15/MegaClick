import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "./api-config";

export interface ReturnRequest {
  _id: string;
  orderId: {
    _id: string;
    orderNumber: string;
    items: any[];
    pricing: any;
    payment: any;
    createdAt: string;
    shippingAddress: {
      firstName: string;
      lastName: string;
      phone: string;
      addressLine1: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    userId: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productId: any;
    quantity: number;
    reason: string;
  }>;
  status: "REQUESTED" | "APPROVED" | "REJECTED" | "PICKED_UP" | "REFUNDED";
  comment?: string;
  adminComment?: string;
  requestedPickupDate?: string;
  pickupDate?: string;
  pickedUpAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt: string;
}

const BASE = API_BASE + "/api/v1/returns";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const useReturns = () => {
  return useQuery<ReturnRequest[]>({
    queryKey: ["returns"],
    queryFn: async () => {
      const res = await fetch(BASE, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch returns");
      return data.data ?? [];
    },
  });
};

export const useUpdateReturnStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      action,
      adminComment,
      pickupDate,
    }: {
      id: string;
      action: "approve" | "reject" | "pickup";
      adminComment?: string;
      pickupDate?: string;
    }) => {
      const url = `${BASE}/${id}/${action}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ adminComment, pickupDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${action} return`);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["returns"] });
      qc.invalidateQueries({ queryKey: ["refunds"] });
    },
  });
};
