import { useEffect, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OUTCOME_LABELS, formatDateTime, toLocalInput } from '@/data/followUp';
import {
  FOLLOW_UP_OUTCOMES,
  useLogFollowUp,
  type FollowUpOutcome,
} from '@/hooks/useFollowUps';

/** Quick reschedule presets — the dates a rep actually picks. */
const PRESETS = [
  { label: 'Tomorrow 10 AM', fn: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0); return d; } },
  { label: 'In 3 days', fn: () => { const d = new Date(); d.setDate(d.getDate() + 3); d.setHours(10, 0, 0, 0); return d; } },
  { label: 'Next week', fn: () => { const d = new Date(); d.setDate(d.getDate() + 7); d.setHours(10, 0, 0, 0); return d; } },
  { label: 'In 2 weeks', fn: () => { const d = new Date(); d.setDate(d.getDate() + 14); d.setHours(10, 0, 0, 0); return d; } },
];

interface LogFollowUpDialogProps {
  leadId: string | null;
  clientName?: string;
  /** The follow-up currently scheduled, shown for context. */
  currentFollowUpAt?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Records one follow-up: what happened, and when to come back to it.
 *
 * Both halves are optional individually but at least one is required — a note
 * with no new date closes the loop, a date with no note is a plain reschedule.
 */
export function LogFollowUpDialog({
  leadId, clientName, currentFollowUpAt, open, onOpenChange,
}: LogFollowUpDialogProps) {
  const [note, setNote] = useState('');
  const [outcome, setOutcome] = useState<FollowUpOutcome>('contacted');
  const [nextAt, setNextAt] = useState('');
  const logFollowUp = useLogFollowUp();

  useEffect(() => {
    if (!open) return;
    setNote('');
    setOutcome('contacted');
    setNextAt('');
  }, [open, leadId]);

  /**
   * The earliest date a new follow-up may be booked for: later than the one
   * already on the books, and never in the past. Rescheduling to the same slot
   * is what leaves a lead permanently "due today".
   */
  const earliest = (() => {
    const now = new Date();
    if (!currentFollowUpAt) return now;

    const current = new Date(currentFollowUpAt);
    if (Number.isNaN(current.getTime())) return now;

    // One minute past the current booking — the smallest step the input allows.
    const afterCurrent = new Date(current.getTime() + 60_000);
    return afterCurrent > now ? afterCurrent : now;
  })();

  const handleSubmit = () => {
    if (!leadId) return;

    if (!note.trim() && !nextAt) {
      toast.error('Add a note, a next follow-up date, or both.');
      return;
    }

    if (nextAt) {
      const picked = new Date(nextAt);
      if (Number.isNaN(picked.getTime())) {
        toast.error('Pick a valid date and time for the next follow-up.');
        return;
      }
      if (currentFollowUpAt && picked <= new Date(currentFollowUpAt)) {
        toast.error(
          `The next follow-up has to be after ${formatDateTime(currentFollowUpAt)}.`
        );
        return;
      }
      if (picked < new Date(Date.now() - 60_000)) {
        toast.error('The next follow-up cannot be in the past.');
        return;
      }
    }

    logFollowUp.mutate(
      {
        leadId,
        note: note.trim() || undefined,
        outcome,
        nextFollowUpAt: nextAt ? new Date(nextAt).toISOString() : null,
      },
      {
        onSuccess: () => {
          toast.success(
            nextAt
              ? `Follow-up logged — next on ${formatDateTime(new Date(nextAt).toISOString())}.`
              : 'Follow-up logged.'
          );
          onOpenChange(false);
        },
        onError: (err: Error) => toast.error(err?.message || 'Failed to log the follow-up.'),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Log Follow-up</DialogTitle>
          <DialogDescription>
            {clientName ? `Record what happened with ${clientName}` : 'Record what happened'}
            {currentFollowUpAt ? ` — currently due ${formatDateTime(currentFollowUpAt)}.` : '.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>What happened?</Label>
            <div className="flex flex-wrap gap-1.5">
              {FOLLOW_UP_OUTCOMES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setOutcome(value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    outcome === value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {OUTCOME_LABELS[value]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="follow-up-note">Note</Label>
            <textarea
              id="follow-up-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What was discussed, what they asked for, what to do next…"
              className="w-full min-h-[80px] rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="follow-up-next" className="flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5" />
              Next follow-up
            </Label>
            <Input
              id="follow-up-next"
              type="datetime-local"
              min={toLocalInput(earliest)}
              value={nextAt}
              onChange={(e) => setNextAt(e.target.value)}
            />
            <div className="flex flex-wrap gap-1.5">
              {PRESETS
                .filter((preset) => preset.fn() > earliest)
                .map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setNextAt(toLocalInput(preset.fn()))}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-muted-foreground border border-border bg-card hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              {nextAt && (
                <button
                  type="button"
                  onClick={() => setNextAt('')}
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {currentFollowUpAt
                ? `Must be after the one already booked (${formatDateTime(currentFollowUpAt)}). Leave empty to close this off — the lead drops out of the due list.`
                : 'Leave empty to close this off — the lead drops out of the due list.'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={logFollowUp.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={logFollowUp.isPending}>
            {logFollowUp.isPending ? 'Saving…' : 'Save Follow-up'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LogFollowUpDialog;
