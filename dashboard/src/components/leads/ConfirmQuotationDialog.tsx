import { useEffect, useMemo, useState } from 'react';
import { Banknote, CheckCircle2, CreditCard, IndianRupee, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useConfirmLeadQuotation, type PaymentMode, type SalesLead,
} from '@/hooks/useLeads';

interface ConfirmQuotationDialogProps {
  lead: SalesLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** One editable line of a service's quotation. */
interface DraftItem {
  /** Local only — React needs a stable key while the name is still empty. */
  key: string;
  name: string;
  amount: string;
}

const rupees = (value: number) =>
  value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

const newItem = (name = '', amount = ''): DraftItem => ({
  key: Math.random().toString(36).slice(2),
  name,
  amount,
});

const itemsTotal = (items: DraftItem[]) =>
  items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

/**
 * Confirming a lead: what each service actually covers, what each of those
 * fields costs, and what the client has already handed over.
 *
 * Everything is confirmed in one call rather than service by service — the
 * advance payment is common to the whole engagement, so it has no meaning until
 * every service's figure is settled.
 */
export default function ConfirmQuotationDialog({ lead, open, onOpenChange }: ConfirmQuotationDialogProps) {
  const [draft, setDraft] = useState<Record<string, DraftItem[]>>({});
  const [advance, setAdvance] = useState('');
  const [advanceMode, setAdvanceMode] = useState<PaymentMode>('cash');
  const confirmQuotation = useConfirmLeadQuotation();

  const services = useMemo(() => lead?.services ?? [], [lead]);

  // Reopen on what was agreed last time — a re-confirmation edits the previous
  // numbers rather than starting from a blank sheet.
  useEffect(() => {
    if (!open || !lead) return;

    const initial: Record<string, DraftItem[]> = {};
    for (const service of lead.services ?? []) {
      const existing = service.quotationItems ?? [];
      // Only real line items come back as editable rows. The figure quoted when
      // the lead was captured is shown alongside as reference text — it was an
      // estimate, not a breakdown, so it has nothing to edit.
      initial[service._id] = existing.length > 0
        ? existing.map((item) => newItem(item.name, String(item.amount ?? '')))
        : [newItem()];
    }
    setDraft(initial);
    setAdvance(lead.advancePayment?.amount ? String(lead.advancePayment.amount) : '');
    setAdvanceMode(lead.advancePayment?.mode ?? 'cash');
  }, [open, lead]);

  const updateItem = (serviceId: string, key: string, patch: Partial<DraftItem>) =>
    setDraft((current) => ({
      ...current,
      [serviceId]: (current[serviceId] ?? []).map((item) =>
        item.key === key ? { ...item, ...patch } : item
      ),
    }));

  const addItem = (serviceId: string) =>
    setDraft((current) => ({ ...current, [serviceId]: [...(current[serviceId] ?? []), newItem()] }));

  const removeItem = (serviceId: string, key: string) =>
    setDraft((current) => {
      const remaining = (current[serviceId] ?? []).filter((item) => item.key !== key);
      // Never leave a service with nothing to type into.
      return { ...current, [serviceId]: remaining.length > 0 ? remaining : [newItem()] };
    });

  const grandTotal = services.reduce((sum, service) => sum + itemsTotal(draft[service._id] ?? []), 0);
  const advanceAmount = Number(advance) || 0;

  const handleConfirm = () => {
    if (!lead) return;

    const payload = services.map((service) => {
      const items = (draft[service._id] ?? [])
        .filter((item) => item.name.trim())
        .map((item) => ({ name: item.name.trim(), amount: Number(item.amount) || 0 }));

      return { serviceId: service._id, items, quotation: itemsTotal(draft[service._id] ?? []) };
    });

    const missing = payload.find((entry) => entry.items.length === 0);
    if (missing) {
      const service = services.find((s) => s._id === missing.serviceId);
      toast.error(`Add at least one field for “${service?.title ?? 'this service'}”.`);
      return;
    }

    // A field with no price is fine (it reads as zero); one with a broken or
    // negative price is not.
    const badAmount = (Object.entries(draft) as Array<[string, DraftItem[]]>).some(([, items]) =>
      items.some((item) => {
        if (!item.name.trim() || item.amount === '') return false;
        const amount = Number(item.amount);
        return !Number.isFinite(amount) || amount < 0;
      })
    );
    if (badAmount) {
      toast.error('Every field needs a valid amount of 0 or more.');
      return;
    }

    if (advance !== '' && (!Number.isFinite(Number(advance)) || Number(advance) < 0)) {
      toast.error('Enter a valid advance payment amount.');
      return;
    }
    if (advanceAmount > grandTotal) {
      toast.error('The advance payment cannot be more than the total quotation.');
      return;
    }

    confirmQuotation.mutate(
      {
        leadId: lead._id,
        services: payload,
        advancePayment: advanceAmount > 0 ? { amount: advanceAmount, mode: advanceMode } : undefined,
      },
      {
        onSuccess: () => {
          toast.success('Quotation confirmed.');
          onOpenChange(false);
        },
        onError: (err: Error) => toast.error(err.message || 'Failed to confirm the quotation.'),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirm — {lead?.customer?.name?.trim() || lead?.customer?.phone || 'Lead'}</DialogTitle>
          <DialogDescription>
            List what each service covers and what each field costs. The final quotation for a
            service is the sum of its fields.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {services.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No services on this lead yet — add one before confirming.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {services.map((service) => {
                const items = draft[service._id] ?? [];
                const total = itemsTotal(items);

                return (
                  <div key={service._id} className="py-4 first:pt-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{service.title}</span>
                      {service.category && (
                        <span className="text-[11px] text-muted-foreground">· {service.category}</span>
                      )}
                      {service.quotationConfirmed && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                      {/* What the client was quoted when the lead was captured —
                          reference only, so it is text rather than a field. */}
                      {service.initialQuotation != null && (
                        <span className="ml-auto text-[11px] text-muted-foreground">
                          Previous quotation: {rupees(service.initialQuotation)}
                        </span>
                      )}
                    </div>

                    {items.map((item) => (
                      <div key={item.key} className="flex items-center gap-2">
                        <Input
                          placeholder="Field (e.g. Stamp Duty)"
                          value={item.name}
                          onChange={(e) => updateItem(service._id, item.key, { name: e.target.value })}
                          className="flex-1 h-9"
                        />
                        <div className="relative w-36 shrink-0">
                          <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={item.amount}
                            onChange={(e) => updateItem(service._id, item.key, { amount: e.target.value })}
                            className="pl-7 h-9"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(service._id, item.key)}
                          title="Remove this field"
                          aria-label={`Remove field ${item.name || 'row'}`}
                          className="inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-md text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => addItem(service._id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add field
                      </button>

                      <span className="text-sm">
                        <span className="text-muted-foreground">Final quotation </span>
                        <span className="font-bold text-foreground">{rupees(total)}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {services.length > 0 && (
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Total quotation</span>
                <span className="text-lg font-bold text-foreground">{rupees(grandTotal)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="advance-payment">Advance payment (optional)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      id="advance-payment"
                      type="number"
                      min="0"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={advance}
                      onChange={(e) => setAdvance(e.target.value)}
                      className="pl-7 h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Paid by</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { value: 'cash', label: 'Cash', icon: Banknote },
                      { value: 'online', label: 'Online', icon: CreditCard },
                    ] as const).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setAdvanceMode(option.value)}
                        className={`h-9 rounded-md border text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                          advanceMode === option.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-card text-foreground hover:bg-muted'
                        }`}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {advanceAmount > 0 && (
                <p className="text-[11px] text-muted-foreground">
                  Balance after advance: {rupees(Math.max(0, grandTotal - advanceAmount))}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            disabled={services.length === 0 || confirmQuotation.isPending}
          >
            {confirmQuotation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" />Confirming…</>
              : <><CheckCircle2 className="w-4 h-4" />Confirm</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
