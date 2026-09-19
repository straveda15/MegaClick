import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, FileDown, Loader2, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { buildInvoiceHtml, generateInvoicePdf, type InvoiceData } from '@/lib/invoicePdf';

/* ── Page geometry ──────────────────────────────────────────────────────────── */

// The invoice sheet is A4 (210mm wide) with a 295mm page box, at 96 CSS px/inch.
const PAGE_WIDTH_PX = 794;
const PAGE_HEIGHT_PX = 1116;

/**
 * Roughly how many line items the sheet holds before the body runs into the
 * totals. The page is fixed-height and clips anything past it, so past this the
 * editor warns rather than letting lines vanish silently.
 */
const MAX_FITTING_ITEMS = 12;

/* ── Editor state ───────────────────────────────────────────────────────────── */

/** A line item while it is being edited — the amount stays text so "12." and "" are typeable. */
interface EditableItem {
  id: number;
  name: string;
  amount: string;
}

type Fields = Omit<InvoiceData, 'particulars'>;

const toFields = ({ particulars: _particulars, ...fields }: InvoiceData): Fields => fields;

let nextItemId = 0;
const toItems = (particulars: InvoiceData['particulars']): EditableItem[] =>
  particulars.map((p) => ({ id: nextItemId++, name: p.name, amount: String(p.amount) }));

/** A row left completely blank is dropped rather than printed as an empty line. */
const toInvoice = (fields: Fields, items: EditableItem[]): InvoiceData => ({
  ...fields,
  particulars: items
    .filter((item) => item.name.trim() !== '' || (Number(item.amount) || 0) !== 0)
    .map((item) => ({ name: item.name.trim(), amount: Number(item.amount) || 0 })),
});

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function Field({ label, children, className }: {
  label: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`space-y-1 ${className ?? ''}`}>
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

const inputCls = 'h-8 text-[13px] md:text-[13px]';

/** The A4 sheet, scaled down to whatever width the dialog has to give it. */
function InvoiceSheet({ html }: { html: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const fit = () => setScale(Math.min(1, box.clientWidth / PAGE_WIDTH_PX));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="w-full flex justify-center">
      <div
        className="shadow-md border border-border bg-white shrink-0"
        style={{ width: PAGE_WIDTH_PX * scale, height: PAGE_HEIGHT_PX * scale }}
      >
        <iframe
          title="Invoice preview"
          srcDoc={html}
          // The invoice is static markup — nothing in it needs to run.
          sandbox=""
          scrolling="no"
          style={{
            width: PAGE_WIDTH_PX,
            height: PAGE_HEIGHT_PX,
            border: 0,
            display: 'block',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
    </div>
  );
}

/* ── Dialog ─────────────────────────────────────────────────────────────────── */

interface InvoicePreviewDialogProps {
  /** The invoice as first generated. Editing works on a copy; this is what "Reset" returns to. */
  invoice: InvoiceData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Shows the invoice as it will print, lets the office correct any of it, and
 * only then downloads. The preview is the same markup the PDF is rendered from.
 */
export function InvoicePreviewDialog({ invoice, open, onOpenChange }: InvoicePreviewDialogProps) {
  const [editing, setEditing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [fields, setFields] = useState<Fields | null>(null);
  const [items, setItems] = useState<EditableItem[]>([]);

  // Each time an invoice is opened, start from it fresh and in preview mode.
  useEffect(() => {
    if (!open || !invoice) return;
    setFields(toFields(invoice));
    setItems(toItems(invoice.particulars));
    setEditing(false);
  }, [open, invoice]);

  const draft = useMemo(() => (fields ? toInvoice(fields, items) : null), [fields, items]);
  const html = useDeferredValue(useMemo(() => (draft ? buildInvoiceHtml(draft) : ''), [draft]));

  const edited = useMemo(
    () => Boolean(draft && invoice && JSON.stringify(draft) !== JSON.stringify(toInvoice(toFields(invoice), toItems(invoice.particulars)))),
    [draft, invoice],
  );

  const total = draft?.particulars.reduce((sum, p) => sum + p.amount, 0) ?? 0;
  const tooManyItems = (draft?.particulars.length ?? 0) > MAX_FITTING_ITEMS;

  const setField = <K extends keyof Fields>(key: K, value: Fields[K]) =>
    setFields((current) => (current ? { ...current, [key]: value } : current));

  const setItem = (id: number, patch: Partial<EditableItem>) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const reset = () => {
    if (!invoice) return;
    setFields(toFields(invoice));
    setItems(toItems(invoice.particulars));
  };

  const copyConsigneeToBuyer = () =>
    setFields((current) => current && ({
      ...current,
      buyerName: current.consigneeName,
      buyerAddress: current.consigneeAddress,
      buyerState: current.consigneeState,
      buyerCode: current.consigneeCode,
    }));

  const handleDownload = async () => {
    if (!draft) return;
    if (draft.particulars.length === 0) {
      toast.error('Add at least one line item before downloading.');
      return;
    }
    setDownloading(true);
    try {
      await generateInvoicePdf(draft);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not build the invoice.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[92vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-5 pb-4 pr-12 border-b border-border shrink-0">
          <DialogTitle>Invoice {draft?.invoiceNumber ? `· ${draft.invoiceNumber}` : 'preview'}</DialogTitle>
          <DialogDescription>
            {editing
              ? 'Change any field — the preview updates as you type. Download when it reads right.'
              : 'This is how the invoice will look. Edit it first if anything needs changing.'}
          </DialogDescription>
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <Button
              variant={editing ? 'default' : 'outline'}
              size="sm"
              onClick={() => setEditing((value) => !value)}
              disabled={!fields}
            >
              <Pencil className="w-3.5 h-3.5" />
              {editing ? 'Done editing' : 'Edit'}
            </Button>
            {edited && (
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="w-3.5 h-3.5" />
                Reset changes
              </Button>
            )}
            <Button size="sm" onClick={handleDownload} disabled={!draft || downloading}>
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
              Download PDF
            </Button>
            {edited && <span className="text-[11px] text-amber-700">Edited — differs from the generated invoice</span>}
          </div>
        </DialogHeader>

        {/* minmax(0, …) tracks matter: a bare 1fr won't shrink below the sheet's
            own 794px, so the preview would never scale down on a narrow screen. */}
        <div
          className={`flex-1 min-h-0 grid grid-cols-[minmax(0,1fr)] ${
            editing
              ? 'grid-rows-[auto_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]'
              : 'grid-rows-[minmax(0,1fr)]'
          }`}
        >
          {/* ── Editor ─────────────────────────────────────────────────────── */}
          {editing && fields && (
            <div className="min-h-0 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border p-5 space-y-6 max-h-[45vh] lg:max-h-none">
              <section className="space-y-3">
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Invoice</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Invoice No.">
                    <Input className={inputCls} value={fields.invoiceNumber} onChange={(e) => setField('invoiceNumber', e.target.value)} />
                  </Field>
                  <Field label="Dated">
                    <Input className={inputCls} value={fields.invoiceDate} onChange={(e) => setField('invoiceDate', e.target.value)} />
                  </Field>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Consignee (Ship to)</h3>
                <Field label="Name">
                  <Input className={inputCls} value={fields.consigneeName} onChange={(e) => setField('consigneeName', e.target.value)} />
                </Field>
                <Field label="Address">
                  <Textarea rows={3} className="text-[13px] md:text-[13px] min-h-0" value={fields.consigneeAddress} onChange={(e) => setField('consigneeAddress', e.target.value)} />
                </Field>
                <div className="grid grid-cols-[1fr_88px] gap-3">
                  <Field label="State">
                    <Input className={inputCls} value={fields.consigneeState} onChange={(e) => setField('consigneeState', e.target.value)} />
                  </Field>
                  <Field label="Code">
                    <Input className={inputCls} value={fields.consigneeCode} onChange={(e) => setField('consigneeCode', e.target.value)} />
                  </Field>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Buyer (Bill to)</h3>
                  <button type="button" onClick={copyConsigneeToBuyer} className="text-[11px] text-blue-700 hover:underline">
                    Copy from consignee
                  </button>
                </div>
                <Field label="Name">
                  <Input className={inputCls} value={fields.buyerName} onChange={(e) => setField('buyerName', e.target.value)} />
                </Field>
                <Field label="Address">
                  <Textarea rows={3} className="text-[13px] md:text-[13px] min-h-0" value={fields.buyerAddress} onChange={(e) => setField('buyerAddress', e.target.value)} />
                </Field>
                <div className="grid grid-cols-[1fr_88px] gap-3">
                  <Field label="State">
                    <Input className={inputCls} value={fields.buyerState} onChange={(e) => setField('buyerState', e.target.value)} />
                  </Field>
                  <Field label="Code">
                    <Input className={inputCls} value={fields.buyerCode} onChange={(e) => setField('buyerCode', e.target.value)} />
                  </Field>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Particulars</h3>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Input
                        className={`${inputCls} flex-1 min-w-0`}
                        placeholder="Description"
                        aria-label={`Line ${index + 1} description`}
                        value={item.name}
                        onChange={(e) => setItem(item.id, { name: e.target.value })}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        className={`${inputCls} w-28 text-right`}
                        placeholder="0.00"
                        aria-label={`Line ${index + 1} amount`}
                        value={item.amount}
                        onChange={(e) => setItem(item.id, { amount: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setItems((current) => current.filter((row) => row.id !== item.id))}
                        aria-label={`Remove line ${index + 1}`}
                        title="Remove line"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-border text-muted-foreground hover:text-destructive hover:bg-muted transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setItems((current) => [...current, { id: nextItemId++, name: '', amount: '' }])}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add line
                  </Button>
                  <span className="text-xs text-foreground">
                    Total{' '}
                    <span className="font-semibold">
                      {total.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })}
                    </span>
                  </span>
                </div>
                {tooManyItems && (
                  <p className="flex items-start gap-1.5 text-[11px] text-amber-700">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
                    More than {MAX_FITTING_ITEMS} lines won't fit on the single invoice page — check the preview before downloading.
                  </p>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Remarks</h3>
                <Textarea
                  rows={3}
                  placeholder="Optional note printed in the Remarks box"
                  className="text-[13px] md:text-[13px] min-h-0"
                  value={fields.remarks ?? ''}
                  onChange={(e) => setField('remarks', e.target.value)}
                />
              </section>
            </div>
          )}

          {/* ── Preview ────────────────────────────────────────────────────── */}
          <div className="min-h-0 min-w-0 overflow-auto bg-muted/40 p-4 sm:p-6">
            {html ? <InvoiceSheet html={html} /> : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InvoicePreviewDialog;
