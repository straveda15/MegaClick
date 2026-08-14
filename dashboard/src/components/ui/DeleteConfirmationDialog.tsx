import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface DeleteConfirmationDialogProps {
  open: boolean;
  /** Called with `false` when the dialog should close (Cancel, Escape, outside click). Ignored while `isDeleting`. */
  onOpenChange: (open: boolean) => void;
  /** Runs the actual delete request. The caller owns loading state and closes the dialog on success. */
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
  /** The `Are you sure you want to delete "<name>"?` line — composed by the caller so wording can vary per entity. */
  question: string;
  /** Lead-in for the bullet list, e.g. "This action will permanently delete:" */
  removalIntro: string;
  bullets: string[];
  /** Label on the destructive button in its resting state, e.g. "Delete Staff" / "Delete Customer" */
  confirmLabel: string;
  deletingLabel?: string;
}

/** Shared destructive-delete confirmation used across the admin (Staff Management, Customer Master, …). */
export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
  title,
  question,
  removalIntro,
  bullets,
  confirmLabel,
  deletingLabel = "Deleting...",
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next && isDeleting) return;
        onOpenChange(next);
      }}
    >
      <AlertDialogContent className="rounded-3xl max-w-md border-none shadow-2xl">
        <AlertDialogHeader>
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          <AlertDialogTitle className="text-xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-[14px] space-y-2">
              <p>{question}</p>
              <p>{removalIntro}</p>
              <ul className="list-disc pl-5 space-y-0.5">
                {bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="font-medium text-foreground">This action cannot be undone.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel
            disabled={isDeleting}
            className="rounded-xl font-bold border-none bg-muted hover:bg-muted/80"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 disabled:opacity-70"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {deletingLabel}
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {confirmLabel}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
