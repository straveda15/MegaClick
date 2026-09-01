import { Check, Circle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateServiceStep, type TaskServiceRequest } from '@/hooks/useTasks';

const STAGE_LABELS: Record<string, string> = {
  documents_pending:       'Documents Pending',
  documents_received:      'Documents Received',
  application_submitted:   'Application Submitted',
  government_verification: 'Government Verification',
  approval_received:       'Approval Received',
  certificate_ready:       'Certificate Ready',
  completed:               'Completed',
};

interface ServiceRequestPanelProps {
  request: TaskServiceRequest;
  /** `compact` fits the task card; `full` is for the detail modal. */
  variant?: 'compact' | 'full';
  /**
   * The task these steps belong to. Passing it makes the checklist tickable —
   * omit it (as the task card does) to render the steps read-only.
   */
  taskId?: string;
  /** True once the task is finished; the checklist stops accepting changes. */
  locked?: boolean;
}

/**
 * Everything the assignee needs to act on a client service request: which
 * service was requested, how to reach the client who asked for it, and the
 * checklist that defines what finishing it means.
 *
 * Ticking the last step does NOT close the task — completing it stays an
 * explicit act, so nobody finishes an engagement by accident on their last tick.
 */
export function ServiceRequestPanel({
  request, variant = 'full', taskId, locked = false,
}: ServiceRequestPanelProps) {
  const updateStep = useUpdateServiceStep();

  const steps = [...(request.steps ?? [])].sort((a, b) => a.order - b.order);
  const doneCount = steps.filter((step) => step.done).length;
  const interactive = Boolean(taskId) && !locked;

  // Work happens in order: the first unticked step is the one being done now,
  // everything after it is still waiting its turn.
  const currentIndex = steps.findIndex((step) => !step.done);
  const lastDoneIndex = doneCount > 0 ? doneCount - 1 : -1;

  const setStep = (stepId: string | undefined, done: boolean) => {
    if (!taskId || !stepId) return;
    updateStep.mutate(
      { id: taskId, stepId, done },
      { onError: (err: Error) => toast.error(err?.message || 'Failed to update the checklist.') }
    );
  };

  const contactRows = [
    { label: 'Phone', value: request.clientPhone, href: request.clientPhone ? `tel:${request.clientPhone}` : undefined },
    { label: 'Email', value: request.clientEmail, href: request.clientEmail ? `mailto:${request.clientEmail}` : undefined },
    { label: 'Company', value: request.clientCompany },
    { label: 'Address', value: request.clientAddress },
  ].filter((row) => row.value);

  const compact = variant === 'compact';

  return (
    <div className="space-y-3">
      {/* ── What, and who for ─────────────────────────────────────────────── */}
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3 py-1.5 border-b border-border/50">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wide shrink-0">Service</span>
          <span className="text-[13px] font-semibold text-foreground text-right min-w-0">
            {request.serviceTitle || '—'}
            {request.serviceCategory && (
              <span className="block text-[11px] font-normal text-muted-foreground">
                {request.serviceCategory}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3 py-1.5 border-b border-border/50">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wide shrink-0">Client</span>
          <span className="text-[13px] font-semibold text-foreground text-right min-w-0">
            {request.clientName || '—'}
          </span>
        </div>

        {contactRows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3 py-1.5 border-b border-border/50">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide shrink-0">{row.label}</span>
            {row.href ? (
              <a href={row.href} className="text-[12px] text-blue-700 hover:underline text-right min-w-0 break-words">
                {row.value}
              </a>
            ) : (
              <span className="text-[12px] text-foreground text-right min-w-0 break-words">{row.value}</span>
            )}
          </div>
        ))}

        {request.stage && (
          <div className="flex items-start justify-between gap-3 py-1.5 border-b border-border/50">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wide shrink-0">Stage</span>
            <span className="text-[12px] font-medium text-foreground text-right">
              {STAGE_LABELS[request.stage] ?? request.stage}
            </span>
          </div>
        )}
      </div>

      {/* ── The checklist — what "done" actually means for this service ────── */}
      {steps.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">Steps</p>
            <span className="text-[11px] text-muted-foreground">{doneCount} of {steps.length} done</span>
          </div>

          <div className={compact ? 'max-h-[160px] overflow-y-auto pr-1' : ''}>
            {steps.map((step, index) => {
              const isCurrent = interactive && index === currentIndex;
              const canUndo = interactive && step.done && index === lastDoneIndex;
              const waiting = interactive && !step.done && index > currentIndex;
              const Icon = step.done ? Check : Circle;

              return (
                <div
                  key={step._id ?? index}
                  className="flex items-start gap-2 py-1.5 border-b border-border/40 last:border-b-0"
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 mt-[3px] ${
                      step.done ? 'text-emerald-600' : isCurrent ? 'text-blue-600' : 'text-muted-foreground/50'
                    }`}
                  />

                  <span className="min-w-0 flex-1">
                    <span className={`block text-[12px] leading-snug ${
                      step.done ? 'text-muted-foreground line-through'
                        : waiting ? 'text-muted-foreground'
                        : 'text-foreground font-medium'
                    }`}>
                      {index + 1}. {step.title}
                    </span>
                    {!compact && step.description && (
                      <span className="block text-[10px] text-muted-foreground">{step.description}</span>
                    )}
                  </span>

                  {/* Only the step in hand is actionable, and only the last tick
                      can be taken back — the checklist has to reflect the order
                      the work actually happened in. */}
                  {isCurrent && (
                    <button
                      type="button"
                      onClick={() => setStep(step._id, true)}
                      disabled={updateStep.isPending}
                      className="shrink-0 h-6 px-2 rounded bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors disabled:opacity-60"
                    >
                      Done
                    </button>
                  )}

                  {canUndo && (
                    <button
                      type="button"
                      onClick={() => setStep(step._id, false)}
                      disabled={updateStep.isPending}
                      title="Undo this step"
                      className="shrink-0 h-6 px-2 rounded text-[10px] font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-60"
                    >
                      Undo
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {interactive && (
            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
              {updateStep.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
              {currentIndex === -1
                ? 'Every step is done — the task can be marked complete.'
                : `${steps.length - doneCount} step${steps.length - doneCount === 1 ? '' : 's'} left before this can be completed.`}
            </p>
          )}
        </div>
      )}

      {/* ── Anything else the assigner wanted them to know ─────────────────── */}
      {request.notes && (
        <div>
          <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground mb-0.5">Notes</p>
          <p className="text-[12px] text-foreground leading-relaxed whitespace-pre-line">{request.notes}</p>
        </div>
      )}
    </div>
  );
}

export default ServiceRequestPanel;
