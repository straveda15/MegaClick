import { useEffect, useMemo, useState } from 'react';
import { IndianRupee, Loader2, Plus, Trash2, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sanitizeAmountInput } from '@/lib/amount';
import {
  useAddLedgerEntry, useDeleteLedgerEntry,
  PAYMENT_METHODS, PAYMENT_METHOD_LABELS,
  type LedgerEntry, type PaymentMode, type QuotationItem,
} from '@/hooks/useLeads';

/** One service inside the client's ledger. */
export interface LedgerService {
  _id: string;
  title: string;
  quotation: number;
  quotationItems: QuotationItem[];
  ledger: LedgerEntry[];
  paid: number;
}

export interface LedgerTarget {
  leadId: string;
  clientName: string;
  clientRef: string;
  services: LedgerService[];
  /**
   * The customer's advance on this account: what they handed over up front, and
   * how much of it has not been put against any service yet.
   */
  advance: {
    amount: number;
    unallocated: number;
    mode: PaymentMode;
    recordedAt: string | null;
  } | null;
}

interface CustomerLedgerDialogProps {
  target: LedgerTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const rupees = (value: number) =>
  value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const todayInput = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** One line of the statement: money received, whatever it was against. */
interface Receipt {
  key: string;
  date: string | null;
  description: string;
  service: string;
  method: PaymentMode;
  amount: number;
  /** Only real ledger entries can be removed; the advance is not one. */
  removable: { serviceId: string; entryId: string } | null;
}

/**
 * The customer's ledger — one per client, covering every service they have with
 * us. Payments arrive against an account rather than against a line item, so
 * the record is kept the same way.
 *
 * Three separate things, in order: what the client owes (quotation and its
 * breakdown), what has actually come in (payment history), and what is left.
 * The advance is money received, so it appears in the history; the part of it
 * not yet put against a service shows separately as customer credit.
 */
export default function CustomerLedgerDialog({ target, open, onOpenChange }: CustomerLedgerDialogProps) {
  const [serviceId, setServiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMode>('cash');
  const [note, setNote] = useState('');
  const [paidAt, setPaidAt] = useState(todayInput());
  /** True while the form is spending the customer's credit rather than new money. */
  const [fromCredit, setFromCredit] = useState(false);

  const addEntry = useAddLedgerEntry();
  const deleteEntry = useDeleteLedgerEntry();

  const services = useMemo(() => target?.services ?? [], [target]);

  // Default the form to the first service that still owes something — that is
  // almost always what a payment coming in is for.
  useEffect(() => {
    if (!open) return;
    const owing = services.find((service) => service.quotation - service.paid > 0);
    setServiceId(owing?._id ?? services[0]?._id ?? '');
  }, [open, services]);

  const quoted = services.reduce((sum, service) => sum + service.quotation, 0);
  const credit = target?.advance?.unallocated ?? 0;

  /**
   * Everything received, newest first.
   *
   * Credit allocations are deliberately left out: applying the advance moves
   * money that was already banked when the advance arrived, so listing it again
   * would double the total the statement adds up to.
   */
  const receipts = useMemo(() => {
    const rows: Receipt[] = [];

    if (target?.advance && target.advance.amount > 0) {
      rows.push({
        key: 'advance',
        date: target.advance.recordedAt,
        description: 'Advance Payment',
        service: 'Whole engagement',
        method: target.advance.mode,
        amount: target.advance.amount,
        removable: null,
      });
    }

    for (const service of services) {
      for (const entry of service.ledger) {
        if (entry.source === 'credit') continue;
        rows.push({
          key: entry._id,
          date: entry.paidAt ?? null,
          description: entry.note?.trim() || 'Payment received',
          service: service.title,
          method: entry.mode,
          amount: entry.amount,
          removable: { serviceId: service._id, entryId: entry._id },
        });
      }
    }

    return rows.sort((a, b) => Number(new Date(b.date ?? 0)) - Number(new Date(a.date ?? 0)));
  }, [services, target]);

  const received = receipts.reduce((sum, row) => sum + row.amount, 0);
  const due = Math.max(0, quoted - received);

  const resetForm = () => {
    setAmount('');
    setNote('');
    setMethod('cash');
    setPaidAt(todayInput());
    setFromCredit(false);
  };

  /** Prefills the form to spend the credit, capped at what is actually owed. */
  const startCreditApplication = () => {
    setFromCredit(true);
    setAmount(String(Math.min(credit, due || credit)));
    setNote('Advance applied');
  };

  const handleAdd = () => {
    if (!target) return;

    if (!serviceId) {
      toast.error('Pick the service this payment is against.');
      return;
    }

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Enter a payment amount greater than zero.');
      return;
    }
    if (fromCredit && value > credit) {
      toast.error(`Only ${rupees(credit)} of unallocated advance is available.`);
      return;
    }

    const service = services.find((candidate) => candidate._id === serviceId);

    addEntry.mutate(
      {
        leadId: target.leadId,
        serviceId,
        amount: value,
        mode: method,
        note: note.trim() || undefined,
        paidAt: paidAt || undefined,
        source: fromCredit ? 'credit' : 'direct',
      },
      {
        onSuccess: () => {
          toast.success(
            fromCredit
              ? `${rupees(value)} of advance applied to ${service?.title ?? 'the service'}.`
              : `${rupees(value)} recorded against ${service?.title ?? 'the service'}.`
          );
          resetForm();
        },
        onError: (err: Error) => toast.error(err.message || 'Could not record the payment.'),
      }
    );
  };

  const handleDelete = (removable: NonNullable<Receipt['removable']>) => {
    if (!target) return;
    deleteEntry.mutate(
      { leadId: target.leadId, serviceId: removable.serviceId, entryId: removable.entryId },
      {
        onSuccess: () => toast.success('Payment removed.'),
        onError: (err: Error) => toast.error(err.message || 'Could not remove the payment.'),
      }
    );
  };

  const th = 'px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{target?.clientName} — Customer Ledger</DialogTitle>
          <DialogDescription>
            {target?.clientRef}
            {services.length > 0 && ` · ${services.length} service${services.length === 1 ? '' : 's'}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-1">
          {/* ── 1. Where the account stands ────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Quotation', value: quoted, tone: 'text-foreground' },
              { label: 'Received', value: received, tone: 'text-emerald-700' },
              { label: 'Due Payment', value: due, tone: due > 0 ? 'text-orange-600' : 'text-emerald-700' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card px-3 py-2.5">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
                <span className={`block text-lg font-bold leading-tight mt-0.5 ${stat.tone}`}>
                  {rupees(stat.value)}
                </span>
              </div>
            ))}
          </div>

          {/* ── Money held, not yet against any one service ────────────────── */}
          {credit > 0 && (
            <div className="flex items-center gap-3 flex-wrap rounded-lg border border-blue-200 bg-blue-50/60 px-3 py-2.5">
              <Wallet className="w-4 h-4 text-blue-700 shrink-0" />
              <span className="text-[13px] text-blue-900 min-w-0">
                <span className="font-semibold">Customer Credit — {rupees(credit)}</span>
                <span className="block text-[11px] text-blue-700/80">
                  Unallocated advance held on this account. Apply it to a service to set that
                  service's balance against it.
                </span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={startCreditApplication}
                disabled={fromCredit || services.length === 0}
                className="ml-auto shrink-0 h-7 text-[11px] border-blue-300 bg-white text-blue-800 hover:bg-blue-100"
              >
                Apply credit
              </Button>
            </div>
          )}

          {/* ── 2. What makes up the quotation ─────────────────────────────── */}
          {services.length > 0 && (
            <section>
              <h3 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                Quotation Breakdown
              </h3>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className={th}>Particular</th>
                      <th className={`${th} text-right`}>Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {services.map((service) => {
                      const allocated = service.paid;
                      const serviceDue = Math.max(0, service.quotation - allocated);

                      return [
                        <tr key={`${service._id}-head`} className="bg-muted/20">
                          <td className="px-3 py-1.5">
                            <span className="text-[13px] font-semibold text-foreground">{service.title}</span>
                            <span className="block text-[10px] text-muted-foreground">
                              {rupees(allocated)} allocated · {rupees(serviceDue)} due
                            </span>
                          </td>
                          <td className="px-3 py-1.5 text-[13px] font-semibold text-foreground text-right whitespace-nowrap">
                            {rupees(service.quotation)}
                          </td>
                        </tr>,
                        ...service.quotationItems.map((item, i) => (
                          <tr key={`${service._id}-${item._id ?? i}`}>
                            <td className="px-3 py-1.5 pl-6 text-[13px] text-muted-foreground">{item.name}</td>
                            <td className="px-3 py-1.5 text-[13px] text-muted-foreground text-right whitespace-nowrap">
                              {rupees(item.amount)}
                            </td>
                          </tr>
                        )),
                      ];
                    })}
                    <tr className="bg-muted/40 font-bold border-t-2 border-border">
                      <td className="px-3 py-2 text-[13px] text-foreground">Total</td>
                      <td className="px-3 py-2 text-[13px] text-foreground text-right whitespace-nowrap">
                        {rupees(quoted)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── 3. What has actually come in ───────────────────────────────── */}
          <section>
            <h3 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
              Payment History
            </h3>

            {receipts.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                No payments recorded yet. Add the first payment below.
              </p>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className={th}>Date</th>
                      <th className={th}>Description</th>
                      <th className={th}>Service</th>
                      <th className={th}>Payment Method</th>
                      <th className={`${th} text-right`}>Amount</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {receipts.map((row) => (
                      <tr key={row.key} className="hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-2 text-[13px] text-foreground whitespace-nowrap">
                          {formatDate(row.date)}
                        </td>
                        <td className="px-3 py-2 text-[13px] text-foreground">{row.description}</td>
                        <td className="px-3 py-2 text-[13px] text-muted-foreground">{row.service}</td>
                        <td className="px-3 py-2 text-[13px] text-muted-foreground whitespace-nowrap">
                          {PAYMENT_METHOD_LABELS[row.method] ?? row.method}
                        </td>
                        <td className="px-3 py-2 text-[13px] font-semibold text-foreground text-right whitespace-nowrap">
                          {rupees(row.amount)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {row.removable && (
                            <button
                              type="button"
                              onClick={() => handleDelete(row.removable!)}
                              disabled={deleteEntry.isPending}
                              title="Remove this payment"
                              aria-label="Remove this payment"
                              className="inline-flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:bg-muted hover:text-destructive transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── 4. Record a payment ────────────────────────────────────────── */}
          <section className="pt-4 border-t border-border">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                {fromCredit ? 'Apply Customer Credit' : 'Record a Payment'}
              </h3>
              {fromCredit && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Record new payment instead
                </button>
              )}
            </div>

            {services.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This client has no confirmed services yet, so there is nothing to record a payment
                against.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="ledger-service">Against</Label>
                    <select
                      id="ledger-service"
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {services.map((service) => {
                        const serviceDue = Math.max(0, service.quotation - service.paid);
                        return (
                          <option key={service._id} value={service._id}>
                            {service.title}
                            {serviceDue > 0 ? ` — ${rupees(serviceDue)} due` : ' — settled'}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="ledger-amount">Amount</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        id="ledger-amount"
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(sanitizeAmountInput(e.target.value))}
                        className="pl-7"
                      />
                    </div>
                    {fromCredit && (
                      <p className="text-[11px] text-blue-700">{rupees(credit)} of credit available.</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="ledger-date">Received On</Label>
                    <Input
                      id="ledger-date"
                      type="date"
                      value={paidAt}
                      onChange={(e) => setPaidAt(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="ledger-method">Payment Method</Label>
                    <select
                      id="ledger-method"
                      value={method}
                      onChange={(e) => setMethod(e.target.value as PaymentMode)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {PAYMENT_METHODS.map((value) => (
                        <option key={value} value={value}>{PAYMENT_METHOD_LABELS[value]}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="ledger-note">Note (optional)</Label>
                    <Input
                      id="ledger-note"
                      placeholder="e.g. Second instalment"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={handleAdd} disabled={addEntry.isPending} className="mt-3 w-full sm:w-auto">
                  {addEntry.isPending
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Recording…</>
                    : <><Plus className="w-4 h-4" />{fromCredit ? 'Apply Credit' : 'Add Payment'}</>}
                </Button>
              </>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
