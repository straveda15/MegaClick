import { CalendarClock, MessageSquare, User } from 'lucide-react';
import { BUCKET_LABELS, BUCKET_STYLES, OUTCOME_LABELS, OUTCOME_STYLES, formatDateTime } from '@/data/followUp';
import type { FollowUpBucket, FollowUpEntry } from '@/hooks/useFollowUps';

interface FollowUpTimelineProps {
  history: FollowUpEntry[];
  /** The next follow-up currently on the books, shown above the history. */
  nextFollowUpAt?: string | null;
  bucket?: FollowUpBucket;
  emptyLabel?: string;
}

/**
 * The follow-up history: every logged interaction, newest first, each showing
 * what happened, who logged it, when, and the date it pushed the next one to.
 *
 * Shared by the Follow-ups board and the lead/client popups so the same record
 * reads identically wherever it is opened.
 */
export function FollowUpTimeline({
  history,
  nextFollowUpAt,
  bucket,
  emptyLabel = 'No follow-ups logged yet.',
}: FollowUpTimelineProps) {
  return (
    <div className="space-y-3">
      {/* What's next */}
      {(nextFollowUpAt || bucket) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2.5 flex items-center gap-2 flex-wrap">
          <CalendarClock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-800">
            Next follow-up
          </span>
          <span className="text-[13px] font-medium text-foreground">
            {formatDateTime(nextFollowUpAt)}
          </span>
          {bucket && (
            <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${BUCKET_STYLES[bucket].bg} ${BUCKET_STYLES[bucket].text}`}>
              {BUCKET_LABELS[bucket]}
            </span>
          )}
        </div>
      )}

      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground rounded-lg border border-dashed border-border px-4 py-8 text-center">
          {emptyLabel}
        </p>
      ) : (
        <ol className="relative border-l border-border ml-1.5 space-y-3">
          {history.map((entry) => {
            const style = OUTCOME_STYLES[entry.outcome] ?? OUTCOME_STYLES.note;

            return (
              <li key={entry._id} className="ml-4">
                {/* Timeline dot */}
                <span className="absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full bg-border border-2 border-background" />

                <div className="rounded-lg border border-border bg-card px-3 py-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${style.bg} ${style.text}`}>
                      {OUTCOME_LABELS[entry.outcome] ?? entry.outcome}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDateTime(entry.createdAt)}
                    </span>
                    {entry.createdBy && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 ml-auto">
                        <User className="w-3 h-3" />
                        {entry.createdBy}
                      </span>
                    )}
                  </div>

                  {entry.note && (
                    <p className="text-[13px] text-foreground leading-relaxed mt-1.5 whitespace-pre-line flex items-start gap-1.5">
                      <MessageSquare className="w-3 h-3 text-muted-foreground shrink-0 mt-1" />
                      {entry.note}
                    </p>
                  )}

                  {entry.followUpAt && (
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      Rescheduled to <span className="font-medium text-foreground">{formatDateTime(entry.followUpAt)}</span>
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

export default FollowUpTimeline;
