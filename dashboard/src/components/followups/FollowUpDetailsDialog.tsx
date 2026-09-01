import { CalendarClock, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import FollowUpTimeline from './FollowUpTimeline';
import { BUCKET_LABELS, BUCKET_STYLES, formatDateTime } from '@/data/followUp';
import { TEMPERATURE_LABELS, TEMPERATURE_STYLES } from '@/data/leadTemperature';
import type { FollowUpRow } from '@/hooks/useFollowUps';
import type { LeadTemperature } from '@/hooks/useLeads';

interface FollowUpDetailsDialogProps {
  row: FollowUpRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Opens the log/reschedule dialog for this lead. */
  onLog: (row: FollowUpRow) => void;
}

/**
 * Everything known about one lead's follow-ups, in a popup rather than an
 * inline dropdown — a timeline that has to share a table row with six columns
 * ends up unreadable at exactly the moment someone needs to read it.
 */
export default function FollowUpDetailsDialog({ row, open, onOpenChange, onLog }: FollowUpDetailsDialogProps) {
  if (!row) return null;

  const bucketStyle = BUCKET_STYLES[row.bucket];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            {row.client.name}
            <span className="text-xs font-medium text-muted-foreground">{row.reference}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${bucketStyle.bg} ${bucketStyle.text}`}>
              {BUCKET_LABELS[row.bucket]}
            </span>
          </DialogTitle>
          <DialogDescription>
            {row.followUpCount} follow-up{row.followUpCount === 1 ? '' : 's'} logged
            {row.owner ? ` · owned by ${row.owner}` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* ── How to reach them ──────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {row.client.phone && (
              <a href={`tel:${row.client.phone}`} className="text-[13px] text-blue-700 hover:underline flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {row.client.phone}
              </a>
            )}
            {row.client.email && (
              <a href={`mailto:${row.client.email}`} className="text-[13px] text-blue-700 hover:underline flex items-center gap-1.5 min-w-0">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{row.client.email}</span>
              </a>
            )}
            {row.client.company && (
              <span className="text-[13px] text-muted-foreground">{row.client.company}</span>
            )}
          </div>

          {/* ── What they asked for ────────────────────────────────────────── */}
          {row.services.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground mb-1.5">
                Services
              </p>
              <div className="flex flex-wrap gap-1.5">
                {row.services.map((service) => {
                  const style = TEMPERATURE_STYLES[service.temperature as LeadTemperature]
                    ?? TEMPERATURE_STYLES.WARM;
                  return (
                    <span
                      key={service._id}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${style.bg} ${style.text}`}
                    >
                      {service.title}
                      <span className="opacity-70">
                        · {TEMPERATURE_LABELS[service.temperature as LeadTemperature] ?? service.temperature}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── The record itself ──────────────────────────────────────────── */}
          <div>
            <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground mb-1.5">
              Follow-up history — newest first
            </p>
            <FollowUpTimeline
              history={row.history}
              nextFollowUpAt={row.followUpAt}
              bucket={row.bucket}
              emptyLabel={row.followUpNote || 'Nothing logged yet.'}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={() => { onOpenChange(false); onLog(row); }}>
            <CalendarClock className="w-3.5 h-3.5" />
            {row.followUpAt ? `Log / Reschedule (${formatDateTime(row.followUpAt)})` : 'Log follow-up'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
