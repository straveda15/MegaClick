import {
  CheckCircle, Check, Clock, XCircle, User, UserCheck, Info, AlertTriangle, Briefcase, Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useUpdateServiceStep, type Task, type TaskServiceStep } from "@/hooks/useTasks";

// ── Shared visual constants ───────────────────────────────────────────────────

export const PRIORITY_COLORS: Record<string, string> = {
  low:      "bg-slate-100 text-slate-700 border-slate-200",
  medium:   "bg-blue-100 text-blue-700 border-blue-200",
  high:     "bg-orange-100 text-orange-700 border-orange-200",
  urgent:   "bg-red-100 text-red-700 border-red-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

export const STATUS_COLORS: Record<string, string> = {
  pending:     "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed:   "bg-green-50 text-green-700",
  overdue:     "bg-red-50 text-red-600",
  cancelled:   "bg-gray-50 text-gray-600",
};

export function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return format(d, "MMM d, h:mm a");
}

export function fmtTimeTaken(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function isPastDue(iso: string, status: string) {
  return new Date(iso) < new Date() && status !== "completed";
}

/** Steps in the order they are meant to be worked. */
export function orderedSteps(task: Task): TaskServiceStep[] {
  return [...(task.serviceRequest?.steps ?? [])].sort((a, b) => a.order - b.order);
}

// ── Stepper ───────────────────────────────────────────────────────────────────

/**
 * The checklist at a glance: a tick for everything done, an outlined marker for
 * the step in hand, and hollow ones for what is still to come.
 */
export function TaskStepper({ steps, compact = false }: { steps: TaskServiceStep[]; compact?: boolean }) {
  if (steps.length === 0) return null;

  const currentIndex = steps.findIndex((step) => !step.done);

  return (
    <div className="flex items-start">
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <div key={step._id ?? index} className="flex-1 min-w-0 flex flex-col items-center">
            <div className="flex items-center w-full">
              {/* The line into this marker — nothing before the first. */}
              <span
                className={`h-[2px] flex-1 ${index === 0 ? "opacity-0" : steps[index - 1].done ? "bg-emerald-500" : "bg-border"}`}
              />
              <span
                className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 ${
                  step.done
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isCurrent
                      ? "bg-background border-blue-500 text-blue-600"
                      : "bg-background border-border text-muted-foreground"
                }`}
              >
                {step.done ? <Check className="w-3 h-3" /> : index + 1}
              </span>
              <span
                className={`h-[2px] flex-1 ${isLast ? "opacity-0" : step.done ? "bg-emerald-500" : "bg-border"}`}
              />
            </div>

            {!compact && (
              <span
                title={step.title}
                className={`mt-1 text-[9px] leading-tight text-center px-0.5 line-clamp-2 ${
                  step.done ? "text-muted-foreground" : isCurrent ? "text-blue-700 font-semibold" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Task Card ─────────────────────────────────────────────────────────────────
// Shared between the admin Tasks dashboard and every staff portal's Tasks tab so
// the two render identically.

export interface TaskCardProps {
  task: Task;
  myId: string;
  oversight: boolean;
  onComplete: (task: Task) => void;
  onStart: (task: Task) => void;
  onCancel?: (task: Task) => void;
  onViewDetail: (task: Task) => void;
}

export const TaskCard = ({ task, myId, oversight, onComplete, onStart, onCancel, onViewDetail }: TaskCardProps) => {
  const updateStep = useUpdateServiceStep();

  const isCompleted = task.status === "completed";
  const isCancelled = task.status === "cancelled";
  const pastDue     = !isCompleted && !isCancelled && task.dueAt && isPastDue(task.dueAt, task.status);
  const priorityCls = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.medium;

  // The assignee (doer) can start/complete; the assigner can cancel what they
  // assigned. In oversight mode (admin / founder / co-founder) everything is
  // read-only — they can only view.
  const isAssignee = String(task.assignedTo?._id) === myId;
  const isAssigner = String(task.assignedBy?._id) === myId;
  const canAct     = !oversight && isAssignee;
  const canManage  = !oversight && isAssigner;

  // Task auto-cancelled because its assignee was deactivated. The assigner and
  // admin/founder oversight get a "cancelled" alert and can reassign or confirm.
  const inactiveCancelled = isCancelled && task.cancelReason === "assignee_inactive";
  const showInactiveAlert = inactiveCancelled && (isAssigner || oversight);
  const needsAttention    = showInactiveAlert && !task.cancelAlertAck;

  const assignedToName = [task.assignedTo?.name, task.assignedTo?.lastName].filter(Boolean).join(" ") || "Unassigned";

  // Reassigning hands this SAME task on to someone else rather than spinning
  // up a duplicate — a former holder still finds it here, but locked: no
  // actions, just who has it now. Handing it back to them later reactivates
  // this very card instead of creating another one.
  const wasTransferredAway = !isAssignee && (task.previousAssignees ?? []).some((p) => String(p.user?._id) === myId);
  const assignedByName = [task.assignedBy?.name,  task.assignedBy?.lastName].filter(Boolean).join(" ") || "System";

  // The checklist is the work: the card's main button walks it one step at a
  // time, so nobody has to open the details to move a task along.
  const steps = orderedSteps(task);
  const nextStep = steps.find((step) => !step.done);

  const markStepDone = (stepId?: string) => {
    if (!stepId) return;
    updateStep.mutate(
      { id: task._id, stepId, done: true },
      { onError: (err: Error) => toast.error(err?.message || "Failed to update the checklist.") }
    );
  };

  const rows = [
    { icon: UserCheck, label: "From", value: assignedByName },
    { icon: User, label: "To", value: assignedToName },
    {
      icon: Clock,
      label: "Deadline",
      value: task.dueAt ? fmtDate(task.dueAt) : "—",
      tone: pastDue ? "text-red-600 font-bold" : undefined,
    },
    { icon: User, label: "Client", value: task.serviceRequest?.clientName || "—" },
    { icon: Briefcase, label: "Service", value: task.serviceRequest?.serviceTitle || task.title },
  ];

  return (
    <div
      className={`flex flex-col h-full p-5 rounded-2xl border transition-all shadow-sm ${
        needsAttention
          ? "bg-amber-50/60 border-amber-300 ring-1 ring-amber-200"
          : isCompleted || isCancelled || wasTransferredAway
          ? "bg-muted/20 border-transparent opacity-70 hover:opacity-90"
          : "bg-card border-border hover:shadow-md hover:border-primary/20"
      }`}
    >
      {/* ── Badges ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span
          className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            STATUS_COLORS[task.status] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {task.status.replace("_", " ")}
        </span>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${priorityCls}`}>
          {task.priority}
        </span>

        {showInactiveAlert && (
          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-red-100 text-red-700 border-red-300 ${needsAttention ? "animate-pulse" : ""}`}>
            <AlertTriangle className="w-3 h-3" />
            Assignee Inactive
          </span>
        )}
        {wasTransferredAway && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-300">
            <UserCheck className="w-3 h-3" />
            Transferred
          </span>
        )}
        {(task.flags?.some((f) => !f.resolvedAt) ?? false) && !isCompleted && !isCancelled && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-red-100 text-red-700 border-red-300 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            Issue Open
          </span>
        )}
      </div>

      {wasTransferredAway && (
        <p className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-3">
          Task transferred to {assignedToName}.
        </p>
      )}

      {/* ── The five things worth seeing without opening anything ──────────── */}
      <div className="flex flex-col">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3 py-1.5 border-b border-border/40">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wide shrink-0">
              <row.icon className="w-3.5 h-3.5" />
              {row.label}
            </span>
            <span className={`text-[12px] font-semibold text-right min-w-0 ${row.tone ?? "text-foreground"}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Where the work has got to ──────────────────────────────────────── */}
      {steps.length > 0 && (
        <div className="pt-4">
          <TaskStepper steps={steps} />
        </div>
      )}

      {/* ── Actions ────────────────────────────────────────────────────────── */}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {canAct && task.status === "pending" && (
          <button
            onClick={(e) => { e.stopPropagation(); onStart(task); }}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          >
            Start Task
          </button>
        )}

        {/* Mid-checklist: the button IS the next step. Pressing it ticks that
            step off — no need to open the task to move it along. */}
        {canAct && task.status === "in_progress" && nextStep?._id && (
          <button
            onClick={(e) => { e.stopPropagation(); markStepDone(nextStep._id); }}
            disabled={updateStep.isPending}
            title={`Mark "${nextStep.title}" done`}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {updateStep.isPending
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Check className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">{nextStep.title}</span>
          </button>
        )}

        {/* Checklist clear (or none to begin with) — the task can be closed. */}
        {canAct && task.status === "in_progress" && !nextStep && (
          <button
            onClick={(e) => { e.stopPropagation(); onComplete(task); }}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Mark Complete
          </button>
        )}

        {canManage && !wasTransferredAway && ["pending", "in_progress", "overdue"].includes(task.status) && onCancel && (
          <button
            onClick={(e) => { e.stopPropagation(); onCancel(task); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-red-100 transition-colors border border-red-200"
          >
            <XCircle className="w-3.5 h-3.5" />
            Cancel
          </button>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onViewDetail(task); }}
          className="flex items-center gap-1.5 px-3 py-2 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-secondary/80 transition-colors border border-border"
        >
          <Info className="w-3.5 h-3.5" />
          Details
        </button>
      </div>
    </div>
  );
};
