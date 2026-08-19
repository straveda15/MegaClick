import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE } from './api-config';
import { toast } from 'sonner';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("opsos_access_token");
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export interface FeeItem {
  name: string;
  amount: number;
}

export interface ServiceFee {
  _id?: string;
  serviceSlug: string;
  fees: FeeItem[];
  updatedAt?: string;
  updatedBy?: string;
}

export function useServiceFees() {
  return useQuery({
    queryKey: ['service-fees'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/v1/service-fees`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch service fees');
      return (data.data as ServiceFee[]) || [];
    },
  });
}

export function useSaveServiceFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fee: ServiceFee) => {
      const res = await fetch(`${API_BASE}/api/v1/service-fees/${fee.serviceSlug}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(fee),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update fee');
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-fees'] });
      toast.success('Service fees updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update service fees');
    },
  });
}
