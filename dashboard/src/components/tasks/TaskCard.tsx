import {
  CheckCircle, Circle, Clock, Calendar, Timer, XCircle,
  User, UserCheck, Info, AlertTriangle, Bell, MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import type { Task } from "@/hooks/useTasks";
import ServiceRequestPanel from "./ServiceRequestPanel";

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
  const assignedByName = [task.assignedBy?.name,  task.assignedBy?.lastName].filter(Boolean).join(" ") || "System";

  return (
    <div
      className={`flex flex-col h-full min-h-[340px] p-5 rounded-2xl border transition-all shadow-sm ${
        needsAttention
          ? "bg-amber-50/60 border-amber-300 ring-1 ring-amber-200"
          : isCompleted || isCancelled
          ? "bg-muted/20 border-transparent opacity-70 hover:opacity-90"
          : "bg-card border-border hover:shadow-md hover:border-primary/20"
      }`}
    >
      {/* Status icon — shown to the assignee (the doer) */}
      {isAssignee && !oversight && isCompleted && (
        <button
          onClick={() => onComplete(task)}
          className="mt-0.5 shrink-0 text-green-500"
        >
          <CheckCircle className="w-5 h-5 fill-green-50" />
        </button>
      )}
      {isAssignee && !oversight && !isCompleted && !isCancelled && (
        <div className="mt-0.5 shrink-0 text-muted-foreground/40">
          <Circle className="w-5 h-5" />
        </div>
      )}
      {isAssignee && !oversight && isCancelled && (
        <div className="mt-0.5 shrink-0 text-gray-400">
          <XCircle className="w-5 h-5" />
        </div>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-semibold leading-snug ${
                isCompleted || isCancelled
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {task.title}
            </h3>
          </div>
          {/* Badges */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            {/* Assignee deactivated — task auto-cancelled, needs reassign/confirm */}
            {showInactiveAlert && (
              <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-red-100 text-red-700 border-red-300 ${needsAttention ? "animate-pulse" : ""}`}>
                <AlertTriangle className="w-3 h-3" />
                Assignee Inactive
              </span>
            )}
            {/* Open issue — visible to assigner and to admin/founder oversight */}
            {(task.flags?.some(f => !f.resolvedAt) ?? false) && !isCompleted && !isCancelled && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-red-100 text-red-700 border-red-300 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                Issue Open
              </span>
            )}
            {/* Priority */}
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${priorityCls}`}
            >
              {task.priority}
            </span>
            {/* Status */}
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                STATUS_COLORS[task.status] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>
        </div>
        {/* Meta Information */}
        <div className="flex flex-col gap-3 mb-4">
          {/* From */}
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-wide">
              <UserCheck className="w-3.5 h-3.5" />
              <span>From</span>
            </div>
            <span className="text-[12px] font-semibold text-foreground text-right">
              {assignedByName}
            </span>
          </div>
          {/* To */}
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-wide">
              <User className="w-3.5 h-3.5" />
              <span>To</span>
            </div>
            <span className="text-[12px] font-semibold text-foreground text-right">
              {assignedToName}
            </span>
          </div>
          {/* Assigned */}
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5" />
              <span>Assigned</span>
            </div>
            <span className="text-[12px] font-medium text-foreground text-right">
              {fmtDate(task.createdAt)}
            </span>
          </div>
          {/* Followers (tagged for follow-up) */}
          {(task.followers?.length ?? 0) > 0 && (
            <div className="flex items-start justify-between border-b border-border/40 pb-2 gap-2">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-wide shrink-0">
                <Bell className="w-3.5 h-3.5" />
                <span>Follow-up</span>
              </div>
              <span className="text-[12px] font-medium text-foreground text-right">
                {task.followers!.map((f) => [f.name, f.lastName].filter(Boolean).join(" ")).join(", ")}
              </span>
            </div>
          )}
          {/* Service request details — replaces the description, which just
              restates the same client/service in prose. */}
          {task.serviceRequest?.clientName ? (
            <div className="pt-1">
              <ServiceRequestPanel request={task.serviceRequest} variant="compact" />
            </div>
          ) : task.description ? (
            <div className="pt-1">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                Description
              </p>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/40">
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  {task.description}
                </p>
              </div>
            </div>
          ) : null}

        </div>

        {/* Footer: deadline + time taken + action */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-[10px] font-medium">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className={pastDue ? "text-red-500 font-bold" : "text-muted-foreground"}>
                Deadline: {task.dueAt ? fmtDate(task.dueAt) : "—"}
              </span>
            </div>

            {/* Time taken — shown to both admin and staff when completed */}
            {isCompleted && task.timeTakenMinutes != null && (
              <div className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                <Timer className="w-3 h-3" />
                Done in {fmtTimeTaken(task.timeTakenMinutes)}
              </div>
            )}

            {/* Follow-up notes count */}
            {(task.followUps?.length ?? 0) > 0 && (
              <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                <MessageSquare className="w-3 h-3" />
                {task.followUps!.length} note{task.followUps!.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Assignee actions */}
          {canAct && task.status === "pending" && (
            <button
              onClick={(e) => { e.stopPropagation(); onStart(task); }}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm hover:bg-blue-700 transition-colors"
            >
              Start Task
            </button>
          )}
          {canAct && task.status === "in_progress" && (
            <button
              onClick={(e) => { e.stopPropagation(); onComplete(task); }}
              className="flex items-center gap-1.5 px-3 py-1 bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Mark Complete
            </button>
          )}
          {/* Assigner cancel action */}
          {canManage && (task.status === "pending" || task.status === "in_progress" || task.status === "overdue") && onCancel && (
            <button
              onClick={(e) => { e.stopPropagation(); onCancel(task); }}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded shadow-sm hover:bg-red-100 transition-colors border border-red-200"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel Task
            </button>
          )}
          {/* View details action */}
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetail(task); }}
            className="flex items-center gap-1.5 px-3 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider rounded shadow-sm hover:bg-secondary/80 transition-colors border border-border"
          >
            <Info className="w-3.5 h-3.5" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
