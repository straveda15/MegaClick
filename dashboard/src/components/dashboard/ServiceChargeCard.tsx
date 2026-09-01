import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { isWithinRange, type DateRange } from '@/components/DateRangeFilter';

const SERVICE_CHARGE_NAME = 'Service Fees';

const rupees = (value: number) =>
  value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

interface ServiceChargeCardProps {
  dateRange?: DateRange;
}

/**
 * Total service charges collected — summed from the "Service Fees" named
 * quotation item across every confirmed service. Filtered by the dashboard's
 * date range picker when one is active.
 */
export default function ServiceChargeCard({ dateRange }: ServiceChargeCardProps) {
  const { data: clients = [], isLoading } = useClients();

  const { total, breakdown } = useMemo(() => {
    let sum = 0;
    const rows: Array<{ id: string; client: string; service: string; amount: number; at: number }> = [];

    for (const client of clients) {
      // Apply the date range filter — same pattern as ClientsPage / RevenueCard.
      if (!isWithinRange(client.createdAt, dateRange)) continue;

      for (const service of client.services) {
        if (!service.quotationConfirmed) continue;

        const chargeItem = service.quotationItems.find(
          (item) => item.name === SERVICE_CHARGE_NAME
        );
        if (!chargeItem || chargeItem.amount <= 0) continue;

        sum += chargeItem.amount;
        const at = Number(new Date(client.createdAt ?? 0)) || 0;
        rows.push({
          id: `${service._id}-charge`,
          client: client.name,
          service: service.title,
          amount: chargeItem.amount,
          at,
        });
      }
    }

    return {
      total: sum,
      breakdown: rows.sort((a, b) => b.at - a.at).slice(0, 5),
    };
  }, [clients, dateRange]);

  return (
    <div className="kpi-card">
      <h3 className="text-sm font-semibold text-foreground">Service Charges</h3>

      {isLoading ? (
        <div className="flex items-center justify-center h-[240px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold text-foreground leading-tight mt-1">
            {rupees(total)}
          </p>

          <div className="mt-4 divide-y divide-border">
            {breakdown.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No service charges recorded yet.
              </p>
            ) : (
              breakdown.map((row) => (
                <div key={row.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{row.client}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{row.service}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                    {rupees(row.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
