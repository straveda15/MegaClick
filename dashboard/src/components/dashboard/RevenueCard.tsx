import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';

const rupees = (value: number) =>
  value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

/**
 * Revenue actually received — each service's customer ledger plus the advance
 * taken at confirmation. A ₹10,000 quotation against which ₹2,000 has been paid
 * contributes ₹2,000; the rest lands here on its own as the ledger is updated
 * on the Accounts page.
 */
export default function RevenueCard() {
  const { data: clients = [], isLoading } = useClients();

  const { received, quotations } = useMemo(() => {
    let total = 0;
    const confirmed: Array<{ id: string; client: string; service: string; amount: number; at: number }> = [];

    for (const client of clients) {
      // Everything actually received from this client, advance included.
      total += client.received;

      for (const service of client.services) {
        if (service.quotationConfirmed && service.quotation != null) {
          // Newest first needs a date; a service confirmed before the client
          // record carries one falls back to when the client was created.
          const at = Number(new Date(client.createdAt ?? 0)) || 0;
          confirmed.push({
            id: service._id,
            client: client.name,
            service: service.title,
            amount: service.quotation,
            at,
          });
        }
      }
    }

    return {
      received: total,
      quotations: confirmed.sort((a, b) => b.at - a.at).slice(0, 5),
    };
  }, [clients]);

  return (
    <div className="kpi-card">
      <h3 className="text-sm font-semibold text-foreground">Revenue</h3>

      {isLoading ? (
        <div className="flex items-center justify-center h-[240px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold text-foreground leading-tight mt-1">{rupees(received)}</p>

          <div className="mt-4 divide-y divide-border">
            {quotations.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No confirmed quotations yet.
              </p>
            ) : (
              quotations.map((row) => (
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
