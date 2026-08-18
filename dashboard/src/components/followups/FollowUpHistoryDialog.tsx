import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import FollowUpTimeline from './FollowUpTimeline';
import type { FollowUpBucket, FollowUpEntry } from '@/hooks/useFollowUps';

interface FollowUpHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName?: string;
  history: FollowUpEntry[];
  nextFollowUpAt?: string | null;
  bucket?: FollowUpBucket;
}

/**
 * The follow-up history on its own, opened from the lead and client popups so
 * the timeline is reachable without leaving whichever board you are on.
 */
export function FollowUpHistoryDialog({
  open, onOpenChange, clientName, history, nextFollowUpAt, bucket,
}: FollowUpHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Follow-up History</DialogTitle>
          <DialogDescription>
            {clientName
              ? `Every follow-up logged for ${clientName}, newest first.`
              : 'Every follow-up logged, newest first.'}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          <FollowUpTimeline history={history} nextFollowUpAt={nextFollowUpAt} bucket={bucket} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FollowUpHistoryDialog;
