import { useState } from 'react';
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
  useAddPayment, useDeletePayment,
  PAYMENT_METHODS, PAYMENT_METHOD_LABELS,
  type LedgerEntry, type PaymentMode, type QuotationItem,
} from '@/hooks/useLeads';

/** One service on the account, for the quotation breakdown. */
export interface LedgerService {
  _id: string;
  title: string;
  quotation: number;
  quotationItems: QuotationItem[];
}

export interface LedgerTarget {
  leadId: string;
  clientName: string;
  clientRef: string;
  services: LedgerService[];
  /** Every receipt on the account, newest first. */
  payments: LedgerEntry[];
  quoted: number;
  received: number;
  due: number;
  /** Paid past the total quoted — held for whatever they ask for next. */
  credit: number;
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

/**
 * The customer's ledger — one per client, covering everything they have with us.
 *
 * Money arrives against the account, not against a line item: on a ₹30,000
 * engagement the accountant records ₹5,000 today and ₹8,000 next month, and the
 * outstanding balance falls each time. The quotation breakdown below explains
 * what the ₹30,000 is made of; it has nothing to do with how payments land.
 */
export default function CustomerLedgerDialog({ target, open, onOpenChange }: CustomerLedgerDialogProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMode>('cash');
  const [note, setNote] = useState('');
  const [paidAt, setPaidAt] = useState(todayInput());

  const addPayment = useAddPayment();
  const deletePayment = useDeletePayment();

  const services = target?.services ?? [];
  const payments = target?.payments ?? [];
  const quoted = target?.quoted ?? 0;
  const received = target?.received ?? 0;
  const due = target?.due ?? 0;
  const credit = target?.credit ?? 0;

  // Live check as the amount is typed, so the "exceeds due" warning shows up
  // right where the mistake is instead of only after clicking Add Payment.
  const enteredAmount = Number(amount);
  const amountExceedsDue = amount.trim() !== '' && Number.isFinite(enteredAmount) && enteredAmount > due;

  const resetForm = () => {
    setAmount('');
    setNote('');
    setMethod('cash');
    setPaidAt(todayInput());
  };

  const handleAdd = () => {
    if (!target) return;

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error('Enter a payment amount greater than zero.');
      return;
    }
    if (value > due) {
      toast.error(
        due > 0
          ? `Payment can't exceed the ${rupees(due)} still due.`
          : 'This account has nothing due — there is no balance left to record a payment against.'
      );
      return;
    }

    addPayment.mutate(
      {
        leadId: target.leadId,
        amount: value,
        mode: method,
        note: note.trim() || undefined,
        paidAt: paidAt || undefined,
      },
      {
        onSuccess: () => {
          toast.success(`${rupees(value)} recorded for ${target.clientName}.`);
          resetForm();
        },
        onError: (err: Error) => toast.error(err.message || 'Could not record the payment.'),
      }
    );
  };

  const handleDelete = (paymentId: string) => {
    if (!target) return;
    deletePayment.mutate(
      { leadId: target.leadId, paymentId },
      {
        onSuccess: () => toast.success('Payment removed.'),
        onError: (err: Error) => toast.error(err.message || 'Could not remove the payment.'),
      }
    );
  };

  const th = 'px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

          {/* Paid past the total — money we are holding for them. */}
          {credit > 0 && (
            <div className="flex items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-50/60 px-3 py-2.5">
              <Wallet className="w-4 h-4 text-blue-700 shrink-0" />
              <span className="text-[13px] text-blue-900">
                <span className="font-semibold">Customer Credit — {rupees(credit)}</span>
                <span className="block text-[11px] text-blue-700/80">
                  Paid beyond the total quoted. It carries forward against whatever they ask for next.
                </span>
              </span>
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
                    {services.map((service) => [
                      <tr key={`${service._id}-head`} className="bg-muted/20">
                        <td className="px-3 py-1.5 text-[13px] font-semibold text-foreground">
                          {service.title}
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
                    ])}
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

            {payments.length === 0 ? (
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
                      <th className={th}>Payment Method</th>
                      <th className={`${th} text-right`}>Amount</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.map((entry) => (
                      <tr key={entry._id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-2 text-[13px] text-foreground whitespace-nowrap">
                          {formatDate(entry.paidAt)}
                        </td>
                        <td className="px-3 py-2 text-[13px] text-foreground">
                          {entry.note?.trim() || 'Payment received'}
                        </td>
                        <td className="px-3 py-2 text-[13px] text-muted-foreground whitespace-nowrap">
                          {PAYMENT_METHOD_LABELS[entry.mode] ?? entry.mode}
                        </td>
                        <td className="px-3 py-2 text-[13px] font-semibold text-foreground text-right whitespace-nowrap">
                          {rupees(entry.amount)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {entry.removable !== false && (
                            <button
                              type="button"
                              onClick={() => handleDelete(entry._id)}
                              disabled={deletePayment.isPending}
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
                    <tr className="bg-muted/30 font-semibold">
                      <td className="px-3 py-2 text-[13px] text-foreground" colSpan={3}>Total Received</td>
                      <td className="px-3 py-2 text-[13px] text-emerald-700 text-right whitespace-nowrap">
                        {rupees(received)}
                      </td>
                      <td className="px-3 py-2" />
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── 4. Record a payment ────────────────────────────────────────── */}
          <section className="pt-4 border-t border-border">
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <h3 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Record a Payment
              </h3>
              {due > 0 ? (
                <span className="text-[11px] text-muted-foreground">
                  {rupees(due)} still due
                </span>
              ) : (
                <span className="text-[11px] text-emerald-700">Fully paid — nothing due</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    disabled={due <= 0}
                    aria-invalid={amountExceedsDue}
                    className={`pl-7 ${amountExceedsDue ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                </div>
                {amountExceedsDue && (
                  <p className="text-[11px] text-destructive">
                    That's more than the {rupees(due)} still due.
                  </p>
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

            <Button
              onClick={handleAdd}
              disabled={addPayment.isPending || due <= 0 || !amount.trim() || amountExceedsDue}
              className="mt-3 w-full sm:w-auto"
            >
              {addPayment.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" />Recording…</>
                : <><Plus className="w-4 h-4" />Add Payment</>}
            </Button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
