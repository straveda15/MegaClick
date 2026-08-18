import { useState } from 'react';
import {
  Building2, CalendarClock, CalendarDays, Check, Circle, History, Mail, MapPin, Phone, User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { STAGE_LABELS, STAGE_STYLES } from '@/data/services';
import { TASK_STATUS_LABELS, TASK_STATUS_STYLES } from '@/data/clientStatus';
import { TEMPERATURE_LABELS, TEMPERATURE_STYLES } from '@/data/leadTemperature';
import FollowUpHistoryDialog from '@/components/followups/FollowUpHistoryDialog';
import LogFollowUpDialog from '@/components/followups/LogFollowUpDialog';
import type { Client, ClientService } from '@/hooks/useClients';

/* ── Display constants ──────────────────────────────────────────────────────── */

const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
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

/** One service: who's doing it, how far along, and the checklist behind that. */
function ServiceCard({ service }: { service: ClientService }) {
  const stageStyle = STAGE_STYLES[service.stage] ?? STAGE_STYLES.documents_pending;
  const statusStyle = TASK_STATUS_STYLES[service.taskStatus] ?? TASK_STATUS_STYLES.pending;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{service.title}</p>
          {service.category && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{service.category}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
            TEMPERATURE_STYLES[service.temperature].bg} ${TEMPERATURE_STYLES[service.temperature].text}`}>
            {TEMPERATURE_LABELS[service.temperature]}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusStyle.bg} ${statusStyle.text}`}>
            {TASK_STATUS_LABELS[service.taskStatus] ?? service.taskStatus}
          </span>
        </div>
      </div>

      {/* Who's on it, and by when */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-border">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Handled by</p>
          <p className="text-[13px] text-foreground mt-0.5">{service.assignedTo?.name ?? 'Unassigned'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Start / Target</p>
          <p className="text-[13px] text-foreground mt-0.5">
            {formatDate(service.startAt)} → {formatDate(service.dueAt)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Stage</p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium mt-0.5 ${stageStyle.bg} ${stageStyle.text}`}>
            {STAGE_LABELS[service.stage] ?? service.stage}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${service.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
            style={{ width: `${service.progress}%` }}
          />
        </div>
        <span className="text-[11px] text-muted-foreground shrink-0 w-10 text-right">{service.progress}%</span>
      </div>

      {/* The checklist behind the number */}
      {service.steps.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
            Steps · {service.stepsDone} of {service.stepsTotal} done
          </p>
          <div className="space-y-1">
            {[...service.steps].sort((a, b) => a.order - b.order).map((step) => (
              <div key={step._id} className="flex items-start gap-2">
                {step.done
                  ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  : <Circle className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 mt-0.5" />}
                <span className={`text-[12px] leading-snug ${step.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ClientDetailsDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * The "i" popup on the Clients board: the client's details, then every service
 * they've opted for — who is doing it, how far along it is, and what state it's
 * currently in.
 */
export function ClientDetailsDialog({ client, open, onOpenChange }: ClientDetailsDialogProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            {client?.name ?? 'Client'}
            {client && (
              <span className="text-xs font-medium text-muted-foreground">{client.clientId}</span>
            )}
          </DialogTitle>
          <DialogDescription>
            {client
              ? `${client.totalServices} service${client.totalServices === 1 ? '' : 's'} · ${client.completedServices} completed · ${client.progress}% overall`
              : 'Client details'}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto">
          {client && (
            <div className="p-6 space-y-6">
              {/* ── Contact ───────────────────────────────────────────────── */}
              <section>
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
                  Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 rounded-lg border border-border bg-muted/20 p-4">
                  <InfoRow icon={User} label="Name" value={client.name} />
                  <InfoRow icon={Phone} label="Phone" value={client.phone} />
                  <InfoRow icon={Mail} label="Email" value={client.email} />
                  <InfoRow icon={Building2} label="Business" value={client.company} />
                  <InfoRow icon={MapPin} label="Address" value={client.address} />
                  <InfoRow icon={CalendarDays} label="Next deadline" value={formatDate(client.nextDeadline)} />
                </div>

                {/* Follow-ups live on the same record — reach them from here */}
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-amber-800 flex items-center gap-1.5">
                    <CalendarClock className="w-3 h-3" />
                    Next follow-up — {formatDate(client.followUpAt)}
                  </p>
                  {client.followUpNote && (
                    <p className="text-[13px] text-foreground mt-1.5 whitespace-pre-line">{client.followUpNote}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2.5">
                    <Button variant="outline" size="sm" onClick={() => setLogOpen(true)}>
                      <CalendarClock className="w-3.5 h-3.5" />
                      Log follow-up
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setHistoryOpen(true)}>
                      <History className="w-3.5 h-3.5" />
                      Follow-up history
                      {client.followUpHistory.length > 0 && (
                        <span className="ml-1 text-[10px] text-muted-foreground">
                          ({client.followUpHistory.length})
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </section>

              {/* ── Services in flight ────────────────────────────────────── */}
              <section>
                <h3 className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
                  Services ({client.services.length})
                </h3>
                <div className="space-y-3">
                  {client.services.map((service) => (
                    <ServiceCard key={service._id} service={service} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </DialogContent>

      <FollowUpHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        clientName={client?.name}
        history={client?.followUpHistory ?? []}
        nextFollowUpAt={client?.followUpAt}
      />

      <LogFollowUpDialog
        leadId={client?.leadId ?? null}
        clientName={client?.name}
        currentFollowUpAt={client?.followUpAt}
        open={logOpen}
        onOpenChange={setLogOpen}
      />
    </Dialog>
  );
}

export default ClientDetailsDialog;
