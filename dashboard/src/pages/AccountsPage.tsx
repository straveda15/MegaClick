import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Loader2, Search, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DateRangeFilter, { isWithinRange, type DateRange } from '@/components/DateRangeFilter';
import CustomerLedgerDialog, { type LedgerTarget } from '@/components/accounts/CustomerLedgerDialog';
import { useClients, type ClientService } from '@/hooks/useClients';

const PAGE_SIZE = 15;

const rupees = (value: number) =>
  value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

/**
 * The accounts board: what each service was quoted for, broken down into the
 * fields agreed when the lead was confirmed, and what is still due. The ledger
 * behind each service is where payments get added, and it is the only thing the
 * dashboard's revenue card counts.
 */
export default function AccountsPage() {
  const { data: clients = [], isLoading } = useClients();
  const [query, setQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);
  const [ledgerClientId, setLedgerClientId] = useState<string | null>(null);

  const accounts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return clients
      .filter((client) => {
        const matchQ =
          !q
          || client.name.toLowerCase().includes(q)
          || client.company.toLowerCase().includes(q)
          || client.phone.includes(q)
          || client.clientId.toLowerCase().includes(q)
          || client.services.some((s) => s.title.toLowerCase().includes(q));

        return matchQ && isWithinRange(client.createdAt, dateRange);
      })
      .map((client) => {
        const quoted = client.services.reduce((sum, s) => sum + (s.quotation ?? 0), 0);
        // The advance covers the engagement as a whole, so it belongs to the
        // account rather than to any single service's ledger. Only NEW money is
        // added to it — a service ledger entry funded by the advance itself
        // would otherwise bank the same rupee twice.
        const advance = client.advancePayment?.amount ?? 0;
        const received = client.services.reduce((sum, s) => sum + s.directPaid, 0) + advance;
        const credit = client.advancePayment?.unallocated ?? 0;

        return { client, quoted, advance, credit, due: Math.max(0, quoted - received) };
      });
  }, [clients, query, dateRange]);

  const totalPages = Math.max(1, Math.ceil(accounts.length / PAGE_SIZE));
  const pagedAccounts = accounts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [query, dateRange]);

  // Resolved from the live list rather than held in state, so the dialog keeps
  // showing the truth after a payment is recorded.
  const activeLedger: LedgerTarget | null = useMemo(() => {
    const client = clients.find((c) => c._id === ledgerClientId);
    if (!client) return null;

    return {
      leadId: client.leadId,
      clientName: client.name,
      clientRef: client.clientId,
      services: client.services.map((service) => ({
        _id: service._id,
        title: service.title,
        quotation: service.quotation ?? 0,
        quotationItems: service.quotationItems ?? [],
        ledger: service.ledger ?? [],
        paid: service.paid,
      })),
      advance: client.advancePayment
        ? {
            amount: client.advancePayment.amount,
            unallocated: client.advancePayment.unallocated ?? client.advancePayment.amount,
            mode: client.advancePayment.mode,
            recordedAt: client.advancePayment.recordedAt ?? null,
          }
        : null,
    };
  }, [clients, ledgerClientId]);

  const thBase =
    'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap select-none';

  return (
    <div className="space-y-5">
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search accounts by client, business, phone, service…"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Narrows the board to the accounts opened between two dates. */}
        <DateRangeFilter value={dateRange} onChange={setDateRange} label="Filter by date opened" />
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-card border-dashed">
          <Wallet className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No accounts found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-[420px]">
            {clients.length === 0
              ? 'Once leads have been captured and confirmed, their accounts appear here.'
              : 'No accounts match your search or the dates you picked.'}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className={thBase} style={{ minWidth: 190 }}>Client</th>
                  <th className={thBase}>Contact</th>
                  <th className={thBase} style={{ minWidth: 400 }}>Services &amp; Quotations</th>
                  <th className={`${thBase} text-right`} style={{ minWidth: 160 }}>Account</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {pagedAccounts.map(({ client, quoted, advance, credit, due }) => (
                  <tr key={client._id} className="hover:bg-muted/20 transition-colors align-top">
                    <td className="px-4 py-3 align-top">
                      <span className="block font-medium text-foreground">{client.name}</span>
                      <span className="block text-xs text-muted-foreground">{client.company || 'Individual'}</span>
                      <span className="block text-[10px] text-muted-foreground mt-0.5">{client.clientId}</span>
                    </td>

                    <td className="px-4 py-3 align-top text-xs">
                      <span className="block text-foreground">{client.phone || '—'}</span>
                      <span className="block text-muted-foreground">{client.email || 'No email provided'}</span>
                    </td>

                    {/* Every service written straight down: its fields, then its
                        quotation — and what it was quoted at before, if it moved. */}
                    <td className="px-4 py-3 align-top">
                      {client.services.length === 0 ? (
                        <span className="text-xs text-muted-foreground">No services</span>
                      ) : (
                        <div className="space-y-3">
                          {client.services.map((service) => (
                            <ServiceLines key={service._id} service={service} />
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top text-right">
                      <div className="inline-block text-xs space-y-1 min-w-[150px]">
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">Quoted</span>
                          <span className="font-medium text-foreground">{rupees(quoted)}</span>
                        </div>
                        {advance > 0 && (
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Advance Payment</span>
                            <span className="font-medium text-blue-700">{rupees(advance)}</span>
                          </div>
                        )}
                        {/* Advance still held on the account, not yet put
                            against any one service. */}
                        {credit > 0 && (
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Customer Credit</span>
                            <span className="font-medium text-blue-700">{rupees(credit)}</span>
                          </div>
                        )}
                        <div className="flex justify-between gap-4 pt-1 mt-1 border-t border-dashed border-border font-semibold">
                          <span className="text-foreground">Due Payment</span>
                          <span className={due > 0 ? 'text-orange-600' : 'text-emerald-700'}>
                            {rupees(due)}
                          </span>
                        </div>

                        {/* One ledger per client, covering every service they
                            have with us — payments are rarely made service by
                            service, so the record isn't kept that way either. */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLedgerClientId(client._id)}
                          className="mt-2 w-full h-7 text-[11px]"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Customer Ledger
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing {accounts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, accounts.length)} of {accounts.length} accounts
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 w-7 flex items-center justify-center rounded border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-muted-foreground px-2">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 w-7 flex items-center justify-center rounded border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomerLedgerDialog
        target={activeLedger}
        open={Boolean(activeLedger)}
        onOpenChange={(open) => !open && setLedgerClientId(null)}
      />
    </div>
  );
}

/** One service written out: name, its agreed fields, and what it comes to. */
function ServiceLines({ service }: { service: ClientService }) {
  const items = service.quotationItems ?? [];
  const quotation = service.quotation ?? 0;
  const previous = service.initialQuotation;

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-foreground">{service.title}</span>
        {!service.quotationConfirmed && (
          <span className="text-[10px] font-medium text-amber-700">Not confirmed</span>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-1 max-w-[340px]">
          {items.map((item, i) => (
            <div key={item._id ?? i} className="flex justify-between text-xs py-0.5">
              <span className="text-muted-foreground truncate pr-3">{item.name}</span>
              <span className="text-foreground whitespace-nowrap">{rupees(item.amount)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-1 max-w-[340px] flex justify-between text-xs font-semibold">
        <span className="text-foreground">Final quotation</span>
        <span className="text-foreground whitespace-nowrap">{rupees(quotation)}</span>
      </div>

      {previous != null && previous !== quotation && (
        <div className="max-w-[340px] flex justify-between text-[11px]">
          <span className="text-muted-foreground">Previous quotation</span>
          <span className="text-muted-foreground line-through whitespace-nowrap">{rupees(previous)}</span>
        </div>
      )}
    </div>
  );
}
