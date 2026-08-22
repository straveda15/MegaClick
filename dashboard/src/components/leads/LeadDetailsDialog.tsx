import {
  Building2, CalendarClock, CalendarDays, FileDown, History, Loader2, Mail, MapPin,
  MessageSquare, Phone, Tag, User,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { STAGE_LABELS, STAGE_STYLES, stageProgress } from '@/data/services';
import { TEMPERATURE_LABELS, TEMPERATURE_STYLES } from '@/data/leadTemperature';
import { sourceLabel } from '@/data/leadSource';
import { generateInvoicePdf, invoiceNumber, type InvoiceData } from '@/lib/invoicePdf';
import { useLead, type LeadService, type SalesLead } from '@/hooks/useLeads';
import { buildParticulars } from '@/lib/invoiceParticulars';
import FollowUpHistoryDialog from '@/components/followups/FollowUpHistoryDialog';
import LogFollowUpDialog from '@/components/followups/LogFollowUpDialog';
import type { FollowUpEntry } from '@/hooks/useFollowUps';

/* ── Display constants ──────────────────────────────────────────────────────── */

const rupees = (value: number) =>
  value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const TASK_STATUS_LABELS: Record<string, string> = {
  pending: 'Not started', in_progress: 'In progress', completed: 'Completed',
  cancelled: 'Cancelled', overdue: 'Overdue',
};

/** Progress for one service — from its checklist when it has one, else the stage. */
const serviceProgress = (service: LeadService) => {
  const task = typeof service.taskId === 'object' ? service.taskId : null;
  const steps = task?.serviceRequest?.steps ?? [];
  if (steps.length > 0) {
    return Math.round((steps.filter((s) => s.done).length / steps.length) * 100);
  }
  return stageProgress(service.stage ?? 'documents_pending');
};

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function InfoRow({ icon: Icon, label, value }: {
  icon: typeof User; label: string; value?: string | null;
}) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-[3px]" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</p>
        <p className="text-[13px] text-foreground break-words">{value?.trim() || '—'}</p>
      </div>
    </div>
  );
}

// Removed PDF service mappers

interface LeadDetailsDialogProps {
  leadId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * The "i" popup on the Leads board: everything the client told us, and every
 * service they asked for, each downloadable as a PDF.
 *
 * Read-only by design — handing work to an employee happens on the Clients
 * board, where the client's whole engagement is in view.
 */
export function LeadDetailsDialog({ leadId, open, onOpenChange }: LeadDetailsDialogProps) {
  const { data: lead, isLoading, isError, error } = useLead(open ? leadId : undefined);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const customer = lead?.customer;
  const clientName = customer?.name?.trim() || customer?.phone || 'Unnamed client';
  const services = lead?.services ?? [];

  const handleDownload = async (service?: LeadService) => {
    if (!lead) return;
    setDownloading(service?._id ?? 'all');
    try {
      const address = [lead.customer?.addressLine1, lead.customer?.addressLine2, lead.customer?.city, lead.customer?.state]
        .filter(Boolean).join(', ');

      // The Particulars are the fields agreed when the lead was confirmed.
      const particulars = service
        ? buildParticulars(service)
        : services.flatMap(s => buildParticulars(s));

      const data: InvoiceData = {
        invoiceNumber: invoiceNumber(lead._id.slice(-5)),
        invoiceDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-'),
        consigneeName: clientName,
        consigneeAddress: address || 'N/A',
        consigneeState: lead.customer?.state || 'N/A',
        consigneeCode: 'N/A',
        buyerName: clientName,
        buyerAddress: address || 'N/A',
        buyerState: lead.customer?.state || 'N/A',
        buyerCode: 'N/A',
        particulars
      };

      await generateInvoicePdf(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not build the invoice.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            {clientName}
            {lead && (
              <span className="text-xs font-medium text-muted-foreground">
                LD-{lead._id.slice(-5).toUpperCase()}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Everything this client shared, and the services they asked for.
          </DialogDescription>

          {services.length > 0 && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload()}
                disabled={downloading !== null}
              >
                {downloading === 'all'
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <FileDown className="w-3.5 h-3.5" />}
                Download Invoice
              </Button>
            </div>
          )}
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto">
          {isLoading ? (
            <div className="py-20 text-center text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Loading lead…
            </div>
          ) : isError ? (
            <div className="py-20 text-center text-sm text-destructive">
              {error instanceof Error ? error.message : 'Failed to load this lead.'}
            </div>
          ) : lead ? (
            <div className="p-6 space-y-6">
              {/* ── Client information ────────────────────────────────────── */}
              <section>
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
                  Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 rounded-lg border border-border bg-muted/20 p-4">
                  <InfoRow icon={User} label="Name" value={customer?.name} />
                  <InfoRow icon={Phone} label="Phone" value={customer?.phone} />
                  <InfoRow icon={Mail} label="Email" value={customer?.email} />
                  <InfoRow icon={Building2} label="Company" value={customer?.company} />
                  <InfoRow
                    icon={MapPin}
                    label="City / State"
                    value={[customer?.city, customer?.state, customer?.postalCode].filter(Boolean).join(', ')}
                  />
                  <InfoRow icon={Tag} label="Source" value={sourceLabel(lead.source)} />
                  <InfoRow icon={CalendarDays} label="Captured" value={formatDate(lead.createdAt)} />
                </div>

                {/* The one follow-up that covers the whole lead */}
                {(lead.followUpAt || lead.followUpNote) && (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 p-4 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-amber-800 flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3 shrink-0" />
                      Follow up{lead.followUpAt ? ` — ${formatDate(lead.followUpAt)}` : ''}
                    </p>
                    {lead.followUpNote && (
                      <p className="text-[13px] text-foreground whitespace-pre-line leading-relaxed mt-1.5 break-words [overflow-wrap:anywhere]">
                        {lead.followUpNote}
                      </p>
                    )}
                  </div>
                )}

                {/* The follow-up record lives on the lead, so reach it here */}
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => setLogOpen(true)}>
                    <CalendarClock className="w-3.5 h-3.5" />
                    Log follow-up
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setHistoryOpen(true)}>
                    <History className="w-3.5 h-3.5" />
                    Follow-up history
                    {(lead.followUpHistory?.length ?? 0) > 0 && (
                      <span className="ml-1 text-[10px] text-muted-foreground">
                        ({lead.followUpHistory?.length})
                      </span>
                    )}
                  </Button>
                </div>

                {lead.message && (
                  <div className="mt-3 rounded-lg border border-border bg-muted/20 p-4">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
                      <MessageSquare className="w-3 h-3" />
                      What they told us
                    </p>
                    <p className="text-[13px] text-foreground whitespace-pre-line leading-relaxed">
                      {lead.message}
                    </p>
                  </div>
                )}
              </section>

              {/* ── Services, each with its own assign button ──────────────── */}
              <section>
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
                  Services Requested ({services.length})
                </h3>

                {services.length === 0 ? (
                  <p className="text-sm text-muted-foreground rounded-lg border border-dashed border-border px-4 py-8 text-center">
                    No service recorded on this lead yet.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {services.map((service) => {
                      const stage = service.stage ?? 'documents_pending';
                      const stageStyle = STAGE_STYLES[stage];
                      const task = typeof service.taskId === 'object' ? service.taskId : null;
                      const assigned = Boolean(service.assignedTo?._id);
                      const assigneeName = [service.assignedTo?.name, service.assignedTo?.lastName]
                        .filter(Boolean).join(' ');
                      const progress = serviceProgress(service);
                      const steps = task?.serviceRequest?.steps ?? [];

                      return (
                        <div key={service._id} className="rounded-lg border border-border bg-card p-3.5">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground">{service.title}</p>
                              {service.category && (
                                <p className="text-[11px] text-muted-foreground mt-0.5">{service.category}</p>
                              )}
                              {/* What this service costs. Payments are made
                                  against the account as a whole, so they are
                                  shown on the client's ledger, not here. */}
                              <p className="text-xs font-medium text-foreground mt-1">
                                {service.quotation != null ? rupees(service.quotation) : 'Quotation not set'}
                              </p>
                            </div>

                          </div>

                          <div className="flex items-center gap-2 flex-wrap mt-2.5">
                            {/* This service's own hot/warm/cold */}
                            {service.temperature && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                TEMPERATURE_STYLES[service.temperature].bg} ${TEMPERATURE_STYLES[service.temperature].text}`}>
                                {TEMPERATURE_LABELS[service.temperature]}
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${stageStyle.bg} ${stageStyle.text}`}>
                              {STAGE_LABELS[stage]}
                            </span>
                            {assigned ? (
                              <span className="text-[11px] text-foreground">
                                {assigneeName || 'Assigned'}
                                {task?.status && ` · ${TASK_STATUS_LABELS[task.status] ?? task.status}`}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                                Unassigned
                              </span>
                            )}
                          </div>

                          {/* The dates promised when the service was captured */}
                          {(service.startAt || service.dueAt) && (
                            <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                              <span>Start: <span className="text-foreground">{formatDate(service.startAt)}</span></span>
                              <span>Target: <span className="text-foreground">{formatDate(service.dueAt)}</span></span>
                            </div>
                          )}

                          {assigned && (
                            <div className="flex items-center gap-2 mt-2.5">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-muted-foreground shrink-0">
                                {steps.length > 0
                                  ? `${steps.filter((s) => s.done).length}/${steps.length} steps`
                                  : `${progress}%`}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          ) : null}
        </div>
      </DialogContent>

      <FollowUpHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        clientName={clientName}
        history={(lead?.followUpHistory ?? []) as FollowUpEntry[]}
        nextFollowUpAt={lead?.followUpAt}
      />

      <LogFollowUpDialog
        leadId={lead?._id ?? null}
        clientName={clientName}
        currentFollowUpAt={lead?.followUpAt}
        open={logOpen}
        onOpenChange={setLogOpen}
      />
    </Dialog>
  );
}

export default LeadDetailsDialog;
