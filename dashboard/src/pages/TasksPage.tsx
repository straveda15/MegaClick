import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import GenericPage from "@/components/GenericPage";
import { useMyTasks, useUpdateTaskStatus, useCreateManualTask, useCancelTask, Task, useAdminRespondToFlag, useExtendTaskDue, useReassignTask, useAssignMoreToTask, useAcknowledgeCancelAlert, useAddFollowUp, useUpdateFollowers, useDeleteTask } from "@/hooks/useTasks";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { ROLE_CATEGORIES } from "@/components/tasks/roleFilter";
import { ReassignTaskModal } from "@/components/tasks/ReassignTaskModal";
import { TaskCard } from "@/components/tasks/TaskCard";
import ServiceRequestPanel from "@/components/tasks/ServiceRequestPanel";
import { WorkLogsPanel } from "@/components/tasks/WorkLogsPanel";
import { useTeam, EmployeeProfile } from "@/hooks/useTeam";
import { useAbsentTodayUserIds } from "@/hooks/useAttendance";
import { useAuth } from "@/context/AuthContext";
import {
  CheckCircle, Clock, AlertCircle, Plus, CalendarPlus,
  User, UserCheck, Calendar, ChevronDown, XCircle, X,
  Tag, Info, MessageSquareWarning, Send, AlertTriangle, CalendarRange, UserPlus, Eye, Bell, MessageSquare, ClipboardList, Trash2
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
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

// ── Constants ────────────────────────────────────────────────────────────────

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  urgent: "bg-red-100 text-red-700 border-red-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  overdue: "bg-red-50 text-red-600",
  cancelled: "bg-gray-50 text-gray-600",
};

function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return format(d, "MMM d, h:mm a");
}

function fmtTimeTaken(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function isPastDue(iso: string, status: string) {
  return new Date(iso) < new Date() && status !== "completed";
}

// Format a Date as the local string a <input type="datetime-local"> expects.
function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ── Group Task Card (Admin view — one card per group) ──────────────────────────

interface GroupTaskCardProps {
  group: Task[];
  isAdmin: boolean;
  onCancel?: (task: Task) => void;
  onViewDetail: (task: Task) => void;
}

const GroupTaskCard = ({ group, isAdmin, onCancel, onViewDetail }: GroupTaskCardProps) => {
  const primary = group.find(t => String(t._id) === String(t.taskGroup)) || group[0];
  // First task that is still cancellable (not done/cancelled)
  const cancelTarget = group.find(t => !["completed", "cancelled"].includes(t.status));
  const hasIssue = group.some(t => t.flags?.some(f => !f.resolvedAt));
  const allCompleted = group.every(t => t.status === "completed");
  const allCancelled = group.every(t => t.status === "cancelled");
  const hasOverdue = group.some(t => t.status === "overdue");
  const pastDue = !allCompleted && !allCancelled && primary.dueAt && isPastDue(primary.dueAt, primary.status);
  const priorityCls = PRIORITY_COLORS[primary.priority] ?? PRIORITY_COLORS.medium;

  const statusDot: Record<string, string> = {
    pending: "bg-amber-400",
    in_progress: "bg-blue-500",
    completed: "bg-green-500",
    overdue: "bg-red-500",
    cancelled: "bg-gray-300",
  };

  return (
    <div
      className={`flex flex-col gap-2.5 p-4 rounded-xl border transition-all ${allCompleted || allCancelled
        ? "bg-muted/20 border-transparent opacity-60 hover:opacity-80"
        : "bg-card border-border hover:shadow-md hover:border-primary/20"
        }`}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground leading-snug flex-1 min-w-0 truncate">{primary.title}</h3>
        <div className="flex shrink-0 items-center gap-1.5">
          {hasOverdue && (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
              <AlertCircle className="w-3 h-3" /> Overdue
            </span>
          )}
          {hasIssue && (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">
              <AlertTriangle className="w-3 h-3" /> Issue
            </span>
          )}
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${STATUS_COLORS[primary.status] ?? "bg-gray-100 text-gray-600"}`}>
            {primary.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Assignees row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {group.map(task => {
          const name = [task.assignedTo?.name, task.assignedTo?.lastName].filter(Boolean).join(" ") || "?";
          const dot = statusDot[task.status] ?? "bg-gray-400";
          return (
            <div key={task._id} className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-0.5 border border-border">
              <div className={`w-1.5 h-1.5 rounded-full ${dot} ${task.status === 'in_progress' ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-medium">{name}</span>
            </div>
          );
        })}
        {group.length > 1 && (
          <span className="text-[9px] text-muted-foreground ml-1">({group.length} people)</span>
        )}
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${priorityCls}`}>
          {primary.priority}
        </span>
        {primary.dueAt && (
          <span className={`flex items-center gap-1 text-[9px] font-medium ${pastDue ? "text-red-500" : "text-muted-foreground"}`}>
            <Calendar className="w-3 h-3" /> Due {fmtDate(primary.dueAt)}
          </span>
        )}
        {primary.assignedBy && (
          <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <UserCheck className="w-3 h-3" /> By {[primary.assignedBy.name, primary.assignedBy.lastName].filter(Boolean).join(" ")}
          </span>
        )}
        {isAdmin && cancelTarget && onCancel && (
          <button
            onClick={(e) => { e.stopPropagation(); onCancel(cancelTarget); }}
            className="ml-auto flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100"
          >
            <XCircle className="w-3 h-3" /> Cancel
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onViewDetail(primary); }}
          className={`${!(isAdmin && cancelTarget && onCancel) ? 'ml-auto ' : ''}flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase text-secondary-foreground bg-secondary border border-border rounded hover:bg-secondary/80`}
        >
          <Info className="w-3 h-3" /> View Details
        </button>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────

type TabKey = "mine" | "assign" | "following" | "logs" | "oversight";

export default function TasksPage() {
  const { user } = useAuth();
  // Founders & co-founders are seeded with role "admin", so this covers all three.
  const isAdmin = user?.role === "admin";
  const myId = String(user?._id || "");

  const [filterStatus, setFilterStatus] = useState("all");
  // Tabs: "mine" = tasks assigned to me (I act on them); "assign" = create &
  // manage tasks I assigned to others; "oversight" = admin-only read-only view
  // of every task (admins include founders/co-founders).
  const [tab, setTab] = useState<TabKey>("mine");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToCancel, setTaskToCancel] = useState<Task | null>(null);
  const [taskToReassign, setTaskToReassign] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tabs: { value: TabKey; label: string }[] = [
    { value: "mine", label: "My Tasks" },
    { value: "assign", label: "Assign Task" },
    { value: "following", label: "Follow Up" },
    { value: "logs", label: "Logs" },
    ...(isAdmin ? [{ value: "oversight" as TabKey, label: "Oversight" }] : []),
  ];

  // Guard against a stale "oversight" selection if the user isn't an admin.
  const activeTab: TabKey = tab === "oversight" && !isAdmin ? "mine" : tab;
  const oversight = activeTab === "oversight";

  const { data: tasks = [], isLoading } = useMyTasks({
    status: filterStatus,
    view: activeTab === "oversight" ? "all"
      : activeTab === "assign" ? "assigned_by_me"
        : activeTab === "following" ? "following"
          : "assigned_to_me",
  });

  // Tasks auto-cancelled because their assignee went inactive, still awaiting a
  // reassign-or-confirm decision. These drive the "needs attention" badges so
  // the assigner (and admin oversight) are nudged even from the default tab.
  const needsAttention = (t: Task) => t.cancelReason === "assignee_inactive" && !t.cancelAlertAck;
  const { data: assignedByMeCancelled = [] } = useMyTasks({ view: "assigned_by_me", status: "cancelled" });
  const assignAttention = assignedByMeCancelled.filter(needsAttention).length;
  const { data: allCancelled = [] } = useMyTasks({ view: "all", status: "cancelled" }, { enabled: isAdmin });
  const oversightAttention = isAdmin ? allCancelled.filter(needsAttention).length : 0;
  const attentionByTab: Record<TabKey, number> = { mine: 0, assign: assignAttention, following: 0, logs: 0, oversight: oversightAttention };

  const updateStatus = useUpdateTaskStatus();
  const cancelTask = useCancelTask();
  const deleteTask = useDeleteTask();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const { data: team = [] } = useTeam();
  const absentTodayIds = useAbsentTodayUserIds();

  // Compute all tasks in the same group as the selected task
  const relatedTasks = useMemo(() => {
    if (!selectedTask) return [];
    if (selectedTask.taskGroup) {
      // Modern: use taskGroup
      const gId = String(selectedTask.taskGroup);
      return tasks.filter(t => String(t.taskGroup || t._id) === gId);
    }
    // Legacy fallback: match by title + assignedBy (tasks created together before taskGroup existed)
    return tasks.filter(t =>
      !t.taskGroup &&
      t.title === selectedTask.title &&
      String(t.assignedBy?._id) === String(selectedTask.assignedBy?._id)
    );
  }, [selectedTask, tasks]);

  // Build the set of user IDs who already have this task (to exclude from Assign More)
  const alreadyAssignedIds = useMemo(
    () => new Set(relatedTasks.map(t => String(t.assignedTo?._id)).filter(Boolean)),
    [relatedTasks]
  );

  // New Admin Mutations
  const { mutate: respondToIssue } = useAdminRespondToFlag();
  const { mutate: extendDue } = useExtendTaskDue();
  const { mutate: reassignTask, isPending: isReassigning } = useReassignTask();
  const { mutate: assignMore } = useAssignMoreToTask();
  const { mutate: ackCancel } = useAcknowledgeCancelAlert();
  const { mutate: addFollowUp } = useAddFollowUp();
  const { mutate: updateFollowers } = useUpdateFollowers();

  const handleAckCancel = (task: Task) => {
    ackCancel({ id: task._id }, {
      onSuccess: (updated: Task) => {
        toast.success("Cancellation confirmed");
        setSelectedTask(updated);
      },
      onError: (e: any) => toast.error(e.message || "Failed to confirm cancellation"),
    });
  };

  const handleStatusUpdate = (task: Task, newStatus: string) => {
    updateStatus.mutate(
      { id: task._id, status: newStatus },
      {
        onSuccess: () => toast.success(`Task marked as ${newStatus.replace("_", " ")}`),
        onError: (e: any) => toast.error(e.message || "Failed to update task"),
      }
    );
  };

  const handleComplete = (task: Task) => {
    handleStatusUpdate(task, "completed");
  };

  const handleStart = (task: Task) => {
    handleStatusUpdate(task, "in_progress");
  };

  const handleCancel = (task: Task) => {
    setTaskToCancel(task);
  };

  // All copies of the task being cancelled (same logic as relatedTasks, but for taskToCancel).
  const cancelGroup = useMemo(() => {
    if (!taskToCancel) return [];
    if (taskToCancel.taskGroup) {
      const gId = String(taskToCancel.taskGroup);
      return tasks.filter(t => String(t.taskGroup || t._id) === gId);
    }
    return tasks.filter(t =>
      !t.taskGroup &&
      t.title === taskToCancel.title &&
      String(t.assignedBy?._id) === String(taskToCancel.assignedBy?._id)
    );
  }, [taskToCancel, tasks]);

  // Only count copies that can still be cancelled — already cancelled/completed
  // copies shouldn't keep the "all vs just this person" choice alive.
  const activeCancelGroup = useMemo(
    () => cancelGroup.filter(t => !["completed", "cancelled"].includes(t.status)),
    [cancelGroup]
  );

  // Only offer the "all vs just this person" choice when the task really has multiple active assignees.
  const isMultiCancel = activeCancelGroup.length > 1;
  const cancelAssigneeName = taskToCancel?.assignedTo?.name || "this staff member";

  const confirmCancel = (scope: "all" | "single") => {
    if (!taskToCancel) return;
    cancelTask.mutate({ id: taskToCancel._id, scope }, {
      onSuccess: () => {
        toast.success(
          scope === "single"
            ? `Task cancelled for ${cancelAssigneeName}`
            : "Task cancelled for all assigned staff"
        );
        setTaskToCancel(null);
        setSelectedTask(null); // also close detail modal
      },
      onError: (e: any) => {
        toast.error(e.message || "Failed to cancel task");
        setTaskToCancel(null);
      },
    });
  };

  const taskStats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    active: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  }), [tasks]);

  return (
    <GenericPage
      title=""
      subtitle={
        activeTab === "oversight" ? "Oversight of every assigned task across the team — view only"
          : activeTab === "assign" ? "Create and manage the tasks you've assigned to others"
            : activeTab === "following" ? "Tasks you're tagged on for follow-up — track progress and add notes"
              : activeTab === "logs" ? "Your day-wise work log — completed tasks plus anything you log manually"
                : "Tasks assigned to you for action"}
    >
      {/* Top bar */}
      <div className="space-y-8 mb-8">
        <div className="flex items-center justify-between gap-3 flex-wrap">

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full mb-5">

            <div className="rounded-2xl border bg-card p-4 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Total Tasks
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {taskStats.total}
                </h2>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 flex items-center gap-5 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Pending
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {taskStats.pending}
                </h2>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 flex items-center gap-5 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  In Progress
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {taskStats.active}
                </h2>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 flex items-center gap-5 shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Completed
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {taskStats.completed}
                </h2>
              </div>
            </div>

          </div>
          {/* Tabs */}
          {/* Module Navigation */}
          <div className="w-full rounded-2xl border bg-card overflow-hidden">

            <div className="grid grid-cols-[1.15fr_1.15fr_1.15fr_0.9fr_1fr]">

              {tabs.map((t) => {

                const Icon =
                  t.value === "mine"
                    ? User
                    : t.value === "assign"
                      ? UserPlus
                      : t.value === "following"
                        ? Bell
                        : t.value === "logs"
                          ? ClipboardList
                          : Eye;

                const subtitle =
                  t.value === "mine"
                    ? "Tasks assigned to you"
                    : t.value === "assign"
                      ? "Create and assign tasks"
                      : t.value === "following"
                        ? "Tasks needing follow up"
                        : t.value === "logs"
                          ? "Work logs and time"
                          : "Overview and reports";

                return (

                  <button
                    key={t.value}
                    onClick={() => setTab(t.value)}
                    className={`
            relative
            flex
            items-center
            gap-4
            px-8
            py-6
            text-left
            transition-all
            hover:bg-muted/40
            ${activeTab === t.value ? "" : ""}
          `}
                  >

                    <Icon
                      className={`flex-shrink-0 w-6 h-6 mt-1 ${activeTab === t.value
                        ? "text-primary"
                        : "text-muted-foreground"
                        }`}
                    />

                    <div className="min-w-0 flex flex-col justify-center">

                      <h3
                        className={`text-lg font-semibold leading-tight ${activeTab === t.value
                          ? "text-primary"
                          : "text-foreground"
                          }`}
                      >
                        {t.label}
                      </h3>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {subtitle}
                      </p>

                    </div>

                    {attentionByTab[t.value] > 0 && (
                      <span className="absolute top-5 right-5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {attentionByTab[t.value]}
                      </span>
                    )}

                    {activeTab === t.value && (
                      <div className="absolute bottom-0 left-8 right-8 h-[3px] rounded-full bg-primary" />
                    )}

                  </button>

                );

              })}

            </div>

          </div>

          {/* Create lives on the Assign tab — anyone can assign a task */}
          {activeTab === "assign" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          )}
        </div>

        {/* Status filters — hidden on the Logs tab, which isn't a task list */}
        {activeTab !== "logs" && (
          <div className="flex items-center gap-2 border-b pb-4 flex-wrap">
            {["all", "pending", "in_progress", "completed", "overdue", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-full transition-colors ${filterStatus === s
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
                  }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Logs tab — the current user's day-wise work log */}
      {activeTab === "logs" ? (
        <WorkLogsPanel />
      ) : (
        /* Task list */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {isLoading ? (
            <div className="text-center py-12 text-sm text-muted-foreground">Loading tasks…</div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground kpi-card">
              <CheckCircle className="w-12 h-12 opacity-25" />
              <p className="text-sm font-medium">No tasks found</p>
              <p className="text-xs">
                {activeTab === "oversight" ? "No tasks have been assigned yet"
                  : activeTab === "assign" ? "You haven't assigned any tasks yet — create one"
                    : activeTab === "following" ? "You're not tagged on any tasks for follow-up"
                      : "You're all caught up!"}
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                myId={myId}
                oversight={oversight}
                assigneeAbsentToday={absentTodayIds.has(String(task.assignedTo?._id))}
                onComplete={handleComplete}
                onStart={handleStart}
                onCancel={handleCancel}
                onViewDetail={setSelectedTask}
              />
            ))
          )}
        </div>
      )}

      {isModalOpen && <CreateTaskModal onClose={() => setIsModalOpen(false)} />}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          myId={myId}
          oversight={oversight}
          onClose={() => setSelectedTask(null)}
          onStart={handleStart}
          onComplete={handleComplete}
          onCancel={handleCancel}
          onDelete={(task) => setTaskToDelete(task)}
          onSelectTask={setSelectedTask}
          team={team}
          absentTodayIds={absentTodayIds}
          relatedTasks={relatedTasks}
          alreadyAssignedIds={alreadyAssignedIds}
          onRespond={(id, flagId, response) => {
            respondToIssue({ id, flagId, response }, {
              onSuccess: (updated: Task) => {
                toast.success("Response sent");
                setSelectedTask(updated);
              },
              onError: (e: any) => toast.error(e.message)
            });
          }}
          onExtendDue={(id, dueAt) => {
            extendDue({ id, dueAt }, {
              onSuccess: (updated: Task) => {
                toast.success("Due date extended for the assigned team");
                setSelectedTask(updated);
              },
              onError: (e: any) => toast.error(e.message)
            });
          }}
          onReassign={(id, assignedTo) => {
            reassignTask({ id, assignedTo }, {
              onSuccess: (updated: Task) => {
                toast.success("Task reassigned");
                setSelectedTask(updated);
              },
              onError: (e: any) => toast.error(e.message)
            });
          }}
          onAssignMore={(id, assigneeIds) => {
            assignMore({ id, assigneeIds }, {
              onSuccess: () => toast.success("Task assigned to more people"),
              onError: (e: any) => toast.error(e.message)
            });
          }}
          onOpenReassign={(t) => setTaskToReassign(t)}
          onAckCancel={handleAckCancel}
          onAddFollowUp={(id, message) => {
            addFollowUp({ id, message }, {
              onSuccess: (updated: Task) => {
                toast.success("Follow-up added");
                setSelectedTask(updated);
              },
              onError: (e: any) => toast.error(e.message || "Failed to add follow-up"),
            });
          }}
          onUpdateFollowers={(id, followerIds) => {
            updateFollowers({ id, followerIds }, {
              onSuccess: (updated: Task) => {
                toast.success("Follow-up tags updated");
                setSelectedTask(updated);
              },
              onError: (e: any) => toast.error(e.message || "Failed to update follow-up tags"),
            });
          }}
        />
      )}

      {taskToReassign && (
        <ReassignTaskModal
          taskTitle={taskToReassign.title}
          isPending={isReassigning}
          excludeIds={new Set([String(taskToReassign.assignedTo?._id)].filter(Boolean))}
          onClose={() => setTaskToReassign(null)}
          onConfirm={(assigneeIds) => {
            reassignTask(
              { id: taskToReassign._id, assignedTo: assigneeIds },
              {
                onSuccess: () => {
                  toast.success(
                    assigneeIds.length > 1
                      ? `Task reassigned to ${assigneeIds.length} people`
                      : "Task reassigned"
                  );
                  setTaskToReassign(null);
                  setSelectedTask(null);
                },
                onError: (e: any) => toast.error(e.message || "Failed to reassign task"),
              }
            );
          }}
        />
      )}

      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              {taskToDelete?.taskGroup
                ? `"${taskToDelete?.title}" was assigned to several people. Deleting removes every copy from all boards.`
                : `"${taskToDelete?.title}" will be removed from all boards. This can't be undone from here.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTask.isPending}>Keep Task</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (!taskToDelete) return;
                deleteTask.mutate(
                  { id: taskToDelete._id, scope: "all" },
                  {
                    onSuccess: () => {
                      toast.success("Task deleted");
                      setTaskToDelete(null);
                    },
                    onError: (err: Error) => toast.error(err.message || "Failed to delete task"),
                  }
                );
              }}
              disabled={deleteTask.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteTask.isPending ? "Deleting..." : "Delete Task"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!taskToCancel} onOpenChange={(open) => !open && setTaskToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Task</AlertDialogTitle>
            <AlertDialogDescription>
              {isMultiCancel
                ? `This task is assigned to ${activeCancelGroup.length} people. Do you want to cancel it for everyone, or only for ${cancelAssigneeName}?`
                : "Are you sure you want to cancel this task?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelTask.isPending}>Close</AlertDialogCancel>
            {isMultiCancel && (
              <AlertDialogAction
                onClick={(e) => { e.preventDefault(); confirmCancel("single"); }}
                disabled={cancelTask.isPending}
                className="bg-amber-600 text-white hover:bg-amber-700"
              >
                {cancelTask.isPending ? "Cancelling..." : `Only ${cancelAssigneeName}`}
              </AlertDialogAction>
            )}
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); confirmCancel(isMultiCancel ? "all" : "single"); }}
              disabled={cancelTask.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {cancelTask.isPending ? "Cancelling..." : (isMultiCancel ? "Cancel for everyone" : "Confirm Cancel")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </GenericPage>
  );
}

// ── Task Detail Modal ────────────────────────────────────────────────────────

interface TaskDetailModalProps {
  task: Task;
  myId: string;
  oversight: boolean;
  onClose: () => void;
  onStart: (task: Task) => void;
  onComplete: (task: Task) => void;
  onCancel: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onRespond?: (taskId: string, flagId: string, response: string) => void;
  onExtendDue?: (taskId: string, dueAt: string) => void;
  onReassign?: (taskId: string, assignedTo: string) => void;
  onAssignMore?: (taskId: string, assigneeIds: string[]) => void;
  onOpenReassign?: (task: Task) => void;
  onAckCancel?: (task: Task) => void;
  onAddFollowUp?: (taskId: string, message: string) => void;
  onUpdateFollowers?: (taskId: string, followerIds: string[]) => void;
  onSelectTask?: (task: Task) => void;
  team?: EmployeeProfile[];
  absentTodayIds?: Set<string>;
  relatedTasks?: Task[];
  alreadyAssignedIds?: Set<string>;
}

const PRIORITY_LABELS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  low: { label: "Low", bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" },
  medium: { label: "Medium", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  high: { label: "High", bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  urgent: { label: "Urgent", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  critical: { label: "Critical", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-600" },
};

function TaskDetailModal({
  task, myId, oversight, onClose, onStart, onComplete, onCancel, onDelete,
  onRespond, onExtendDue, onReassign, onAssignMore, onOpenReassign, onAckCancel,
  onAddFollowUp, onUpdateFollowers, onSelectTask, team = [], absentTodayIds = new Set(),
  relatedTasks = [], alreadyAssignedIds = new Set()
}: TaskDetailModalProps) {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const [adminResponse, setAdminResponse] = useState("");
  // Pre-fill with the current deadline so the picker opens on (and highlights)
  // the last expected date/time, giving a clear baseline to push forward from.
  const [newDueAt, setNewDueAt] = useState(task.dueAt ? toLocalInput(new Date(task.dueAt)) : "");
  const nowLocal = toLocalInput(new Date());
  const [showResForm, setShowResForm] = useState<string | null>(null);
  const [showExtend, setShowExtend] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [showAssignMore, setShowAssignMore] = useState(false);
  const [targetAssignee, setTargetAssignee] = useState("");
  const [extraAssignees, setExtraAssignees] = useState<string[]>([]);
  const [followUpText, setFollowUpText] = useState("");
  const [showManageFollowers, setShowManageFollowers] = useState(false);
  const [followerSelection, setFollowerSelection] = useState<string[]>(
    (task.followers ?? []).map((f) => String(f._id))
  );
  const isCompleted = task.status === "completed";
  const isCancelled = task.status === "cancelled";
  const isOverdue = task.status === "overdue";
  const isProgress = task.status === "in_progress";
  const isPending = task.status === "pending";

  // A service request is finished by working its checklist, not by declaring it
  // done — so while steps remain, the footer's complete button stays shut and
  // the panel's own step buttons are the way through.
  const checklist = task.serviceRequest?.steps ?? [];
  const stepsLeft = checklist.filter((step) => !step.done).length;
  const blockedByChecklist = checklist.length > 0 && stepsLeft > 0;
  const pastDue = !isCompleted && !isCancelled && task.dueAt && isPastDue(task.dueAt, task.status);

  // The assignee (doer) can start/complete; the assigner manages (cancel, extend,
  // reassign, respond). Oversight mode keeps everything read-only.
  const canAct = !oversight && String(task.assignedTo?._id) === myId;
  const canManage = !oversight && String(task.assignedBy?._id) === myId;
  // Reported issues are visible to everyone viewing the task; the assigner and
  // admins (oversight) can also respond to / resolve them.
  const canRespond = canManage || oversight;

  // Follow-up: any stakeholder (assignee, assigner, tagged follower) or admin
  // oversight can post follow-up notes. Only the assigner / admin can change tags.
  const followers = task.followers ?? [];
  const isFollower = followers.some((f) => String(f._id) === myId);
  const canFollowUp = canAct || canManage || isFollower || oversight;
  const canManageFollowers = canManage || oversight;

  // Task cancelled because its assignee was deactivated — the assigner and admin
  // oversight can reassign it to fresh staff or confirm the cancellation.
  const inactiveCancelled = isCancelled && task.cancelReason === "assignee_inactive";
  const canHandleInactive = inactiveCancelled && (canManage || oversight);

  const assignedToName = [task.assignedTo?.name, task.assignedTo?.lastName].filter(Boolean).join(" ") || "Unassigned";
  const assignedByName = [task.assignedBy?.name, task.assignedBy?.lastName].filter(Boolean).join(" ") || "System";

  const prio = PRIORITY_LABELS[task.priority] ?? PRIORITY_LABELS.medium;

  const statusConfig: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-700 border-amber-200" },
    in_progress: { label: "In Progress", cls: "bg-blue-100 text-blue-700 border-blue-200" },
    completed: { label: "Completed", cls: "bg-green-100 text-green-700 border-green-200" },
    overdue: { label: "Overdue", cls: "bg-red-100 text-red-700 border-red-200" },
    cancelled: { label: "Cancelled", cls: "bg-gray-100 text-gray-600 border-gray-200" },
  };
  const sc = statusConfig[task.status] ?? statusConfig.pending;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${prio.dot} mt-1.5`} />
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Task Details</p>
              <h2 className="text-base font-bold text-foreground leading-snug">{task.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 ml-3 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh] custom-scrollbar">

          {/* Status + Priority row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.cls}`}>
              {sc.label}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${prio.bg} ${prio.text} border-transparent`}>
              <Tag className="w-3 h-3" />
              {prio.label} Priority
            </span>
            {(isOverdue || pastDue) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                <AlertCircle className="w-3 h-3" /> Overdue
              </span>
            )}
          </div>

          {/* ── Assignee deactivated — auto-cancelled task ── */}
          {canHandleInactive && (
            <div className="border-l-2 border-amber-400 pl-3 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-800">Assignee is inactive — task cancelled</p>
                  <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                    <span className="font-semibold">{assignedToName}</span> has been deactivated, so this task was
                    automatically cancelled{task.cancelledAt ? ` on ${fmtDate(task.cancelledAt)}` : ""}. Reassign it to
                    keep the work going, or confirm the cancellation.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onOpenReassign?.(task)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Reassign Task
                </button>
                {!task.cancelAlertAck && (
                  <button
                    onClick={() => onAckCancel?.(task)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-red-100 transition-colors border border-red-200"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel Task
                  </button>
                )}
              </div>
              {task.cancelAlertAck && (
                <p className="text-[10px] text-amber-600 italic">Cancellation confirmed — no further action needed.</p>
              )}
            </div>
          )}

          {/* Who and when — written down rather than boxed up */}
          <div className="flex flex-col">
            {[
              { label: "From", value: assignedByName },
              { label: "To", value: assignedToName },
              { label: "Assigned", value: fmtDate(task.createdAt) },
              {
                label: "Deadline",
                value: task.dueAt ? fmtDate(task.dueAt) : "—",
                tone: pastDue ? "text-red-500" : undefined,
              },
              ...(isCompleted
                ? [{
                    label: "Completed",
                    value: `${task.completedAt ? fmtDate(task.completedAt) : "—"}${
                      task.timeTakenMinutes != null ? ` · took ${fmtTimeTaken(task.timeTakenMinutes)}` : ""
                    }`,
                    tone: "text-green-700",
                  }]
                : []),
            ].map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-3 py-1.5 border-b border-border/50">
                <span className="text-[11px] text-muted-foreground uppercase tracking-wide shrink-0">
                  {row.label}
                </span>
                <span className={`text-[13px] font-semibold text-right min-w-0 ${row.tone ?? "text-foreground"}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Service request — the client and service this task is actually for */}
          {task.serviceRequest?.clientName && (
            <ServiceRequestPanel
              request={task.serviceRequest}
              taskId={task._id}
              locked={isCompleted || isCancelled || !canAct}
            />
          )}

          {/* Description — skipped for service requests, where the panel above
              already carries the same client/service details in full. */}
          {!task.serviceRequest?.clientName && (
            <div>
              <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground mb-0.5">
                Description
              </p>
              {task.description ? (
                <p className="text-sm text-foreground leading-relaxed">{task.description}</p>
              ) : (
                <p className="text-xs text-muted-foreground italic">No description provided.</p>
              )}
            </div>
          )}

          {/* ── Reported Issues (visible to assigner, assignee AND admins) ── */}
          {task.flags && task.flags.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Reported Issues
              </p>
              <div className="flex flex-col">
                {task.flags.map((flag) => (
                  <div key={flag._id} className="py-3 border-b border-border/40 last:border-b-0 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{flag.raisedBy?.name} Raised:</p>
                        <p className="text-sm font-medium text-slate-800">{flag.message}</p>
                      </div>
                      <span className="text-[9px] text-muted-foreground">{fmtDate(flag.raisedAt)}</span>
                    </div>

                    {flag.adminResponse ? (
                      <div className="pl-3 border-l-2 border-emerald-300 bg-emerald-50/50 p-2 rounded-r-lg">
                        <p className="text-[9px] font-bold text-emerald-600 uppercase">Response Sent:</p>
                        <p className="text-xs text-slate-700">{flag.adminResponse}</p>
                      </div>
                    ) : canRespond ? (
                      showResForm === flag._id ? (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                          <textarea
                            className="w-full p-2 text-xs rounded border border-amber-300 focus:ring-1 focus:ring-amber-500 outline-none h-16"
                            placeholder="Type your response..."
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setShowResForm(null)} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Cancel</button>
                            <button
                              onClick={() => { onRespond?.(task._id, flag._id, adminResponse); setShowResForm(null); setAdminResponse(""); }}
                              className="px-3 py-1 bg-amber-600 text-white text-[10px] font-bold rounded hover:bg-amber-700"
                            >
                              Send Response
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowResForm(flag._id)}
                          className="w-full py-2 bg-amber-100 text-amber-700 text-[10px] font-bold rounded hover:bg-amber-200 transition-colors"
                        >
                          RESPOND TO ISSUE
                        </button>
                      )
                    ) : (
                      <p className="text-[9px] font-medium text-amber-500 italic">Awaiting response from the assigner…</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Follow-up: tagged followers + notes ── */}
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground flex items-center gap-1">
                <Bell className="w-3 h-3" /> Follow-up {followers.length > 0 && `(${followers.length} tagged)`}
              </p>
              {canManageFollowers && onUpdateFollowers && (
                <button
                  onClick={() => setShowManageFollowers((v) => !v)}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" /> {showManageFollowers ? "Done" : "Manage tags"}
                </button>
              )}
            </div>

            {/* Follower chips */}
            {followers.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {followers.map((f) => (
                  <span
                    key={f._id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-medium border border-amber-200"
                  >
                    {[f.name, f.lastName].filter(Boolean).join(" ") || "Unknown"}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground italic">No one tagged for follow-up.</p>
            )}

            {/* Manage followers picker (assigner / admin) */}
            {showManageFollowers && canManageFollowers && onUpdateFollowers && (
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2 animate-in fade-in slide-in-from-top-1">
                <div className="max-h-40 overflow-y-auto bg-background border border-border rounded p-2 space-y-1">
                  {team
                    .filter((emp) => emp.status !== "inactive" && emp.userId?.isActive !== false)
                    .filter((emp) => String(emp.userId?._id) !== String(task.assignedTo?._id))
                    .map((emp) => {
                      const empName = [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ");
                      const empRole = emp.designation || emp.department || "Staff";
                      const empId = String(emp.userId?._id || "");
                      return (
                        <label key={empId} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={followerSelection.includes(empId)}
                            onChange={(e) => {
                              if (!empId) return;
                              setFollowerSelection((prev) => e.target.checked ? [...prev, empId] : prev.filter((i) => i !== empId));
                            }}
                            className="shrink-0"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold truncate">{empName}</span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-tighter">{empRole}</span>
                          </div>
                        </label>
                      );
                    })}
                </div>
                <button
                  onClick={() => { onUpdateFollowers(task._id, followerSelection); setShowManageFollowers(false); }}
                  className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90"
                >
                  Save Follow-up Tags
                </button>
              </div>
            )}

            {/* Follow-up notes thread */}
            {(task.followUps?.length ?? 0) > 0 && (
              <div className="space-y-2 pt-1">
                {task.followUps!.map((note) => (
                  <div key={note._id} className="py-2 border-b border-border/40 last:border-b-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold text-foreground flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-muted-foreground" />
                        {[note.author?.name, note.author?.lastName].filter(Boolean).join(" ") || "Someone"}
                      </span>
                      <span className="text-[9px] text-muted-foreground">{fmtDate(note.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{note.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add follow-up note */}
            {canFollowUp && onAddFollowUp ? (
              <div className="flex items-start gap-2 pt-1">
                <textarea
                  className="flex-1 p-2 text-xs rounded-lg border border-border bg-background focus:ring-1 focus:ring-primary outline-none resize-none h-14"
                  placeholder="Add a follow-up note…"
                  value={followUpText}
                  onChange={(e) => setFollowUpText(e.target.value)}
                />
                <button
                  onClick={() => {
                    const text = followUpText.trim();
                    if (!text) return toast.error("Follow-up note cannot be empty");
                    onAddFollowUp(task._id, text);
                    setFollowUpText("");
                  }}
                  className="shrink-0 flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Post
                </button>
              </div>
            ) : (
              (task.followUps?.length ?? 0) === 0 && (
                <p className="text-[10px] text-muted-foreground italic">No follow-up notes yet.</p>
              )
            )}
          </div>

          {/* ── View-only notice (oversight) ── */}
          {oversight && (
            <p className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <Eye className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Oversight view — task actions stay with the assigner and assignee, but you can respond to any reported issues above.
            </p>
          )}

          {/* ── Assigner Management Panel ── */}
          {canManage && !inactiveCancelled && (
            <div className="pt-4 border-t border-border space-y-4">
              <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5" /> Manage Task
              </p>

              {/* Management Tabs/Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setShowExtend(!showExtend); setShowReassign(false); }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${showExtend ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted text-muted-foreground"
                    }`}
                >
                  <CalendarRange className="w-3.5 h-3.5" />
                  Extend Deadline
                </button>
                <button
                  onClick={() => { setShowReassign(!showReassign); setShowExtend(false); setShowAssignMore(false); }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${showReassign ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted text-muted-foreground"
                    }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Reassign Task
                </button>
                <button
                  onClick={() => { setShowAssignMore(!showAssignMore); setShowExtend(false); setShowReassign(false); }}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all col-span-2 ${showAssignMore ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted text-muted-foreground"
                    }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Assign to More People
                </button>
              </div>

              {/* Extension Form */}
              {showExtend && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase text-primary">Extend Due Date</p>
                    <button onClick={() => setShowExtend(false)} className="text-muted-foreground hover:text-foreground">×</button>
                  </div>
                  {task.dueAt && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>Currently due <span className="font-bold text-foreground">{fmtDate(task.dueAt)}</span> — pick a later time.</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="datetime-local"
                      min={new Date().toISOString().slice(0, 16)}
                      className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-xs outline-none focus:ring-1 focus:ring-primary"
                      value={newDueAt}
                      onChange={(e) => setNewDueAt(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        if (!newDueAt) return toast.error("Deadline is required");
                        if (new Date(newDueAt) < new Date()) return toast.error("Deadline cannot be in the past");
                        onExtendDue?.(task._id, new Date(newDueAt).toISOString());
                        setShowExtend(false);
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90"
                    >
                      Update
                    </button>
                  </div>
                </div>
              )}

              {/* Reassignment Form */}
              {showReassign && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase text-primary">Reassign to Other</p>
                    <button onClick={() => setShowReassign(false)} className="text-muted-foreground hover:text-foreground">×</button>
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-xs outline-none focus:ring-1 focus:ring-primary"
                      value={targetAssignee}
                      onChange={(e) => setTargetAssignee(e.target.value)}
                    >
                      <option value="">Select Staff to Reassign to...</option>
                      {team
                        .filter(emp => emp.status !== "inactive" && emp.userId?.isActive !== false)
                        .filter(emp => !absentTodayIds.has(String(emp.userId?._id)))
                        .filter(emp => String(emp.userId?._id) !== String(task.assignedTo?._id))
                        .map(emp => (
                          <option key={emp.userId?._id} value={emp.userId?._id}>
                            {[emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ")} ({emp.designation || emp.department})
                          </option>
                        ))
                      }
                    </select>
                    <button
                      onClick={() => { if (targetAssignee) { onReassign?.(task._id, targetAssignee); setShowReassign(false); } }}
                      disabled={!targetAssignee || targetAssignee === task.assignedTo?._id}
                      className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              )}

              {/* Assign More Form */}
              {showAssignMore && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase text-primary">Assign to Additional People</p>
                    <button onClick={() => setShowAssignMore(false)} className="text-muted-foreground hover:text-foreground">×</button>
                  </div>
                  <div className="space-y-2">
                    <div className="max-h-40 overflow-y-auto bg-background border border-border rounded p-2 space-y-1">
                      {team
                        .filter(emp => emp.status !== "inactive" && emp.userId?.isActive !== false)
                        .filter(emp => !absentTodayIds.has(String(emp.userId?._id)))
                        .filter(emp => !alreadyAssignedIds.has(String(emp.userId?._id)))
                        .map(emp => {
                          const empName = [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ");
                          const empRole = emp.designation || emp.department || "Staff";
                          const empId = emp.userId?._id || "";
                          return (
                            <label key={empId} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={extraAssignees.includes(empId)}
                                onChange={(e) => {
                                  if (!empId) return;
                                  setExtraAssignees(prev => e.target.checked ? [...prev, empId] : prev.filter(i => i !== empId));
                                }}
                                className="shrink-0"
                              />
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold truncate">{empName}</span>
                                <span className="text-[9px] text-muted-foreground uppercase tracking-tighter">{empRole}</span>
                              </div>
                            </label>
                          );
                        })
                      }
                      {team
                        .filter(emp => emp.status !== "inactive" && emp.userId?.isActive !== false)
                        .filter(emp => !absentTodayIds.has(String(emp.userId?._id)))
                        .filter(emp => !alreadyAssignedIds.has(String(emp.userId?._id))).length === 0 && (
                        <p className="text-[10px] text-muted-foreground text-center italic py-2">All active team members already have this task.</p>
                      )}
                    </div>
                    <button
                      onClick={() => { if (extraAssignees.length > 0) { onAssignMore?.(task._id, extraAssignees); setShowAssignMore(false); setExtraAssignees([]); } }}
                      disabled={extraAssignees.length === 0}
                      className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                      Assign to {extraAssignees.length} Additional Staff
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer actions ── */}
        {!isCancelled && !isCompleted && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-muted/20">
            {canAct && isPending && (
              <button
                onClick={() => { onStart(task); onClose(); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
              >
                Start Task
              </button>
            )}
            {canAct && isProgress && (
              <button
                onClick={() => { onComplete(task); onClose(); }}
                disabled={blockedByChecklist}
                title={blockedByChecklist
                  ? `Tick off the remaining ${stepsLeft} step${stepsLeft === 1 ? "" : "s"} first`
                  : undefined}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-green-600"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {blockedByChecklist ? `${stepsLeft} Steps Left` : "Mark Complete"}
              </button>
            )}
            {canManage && (isPending || isProgress || isOverdue) && (
              <button
                onClick={() => { onCancel(task); onClose(); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-red-100 transition-colors border border-red-200"
              >
                <XCircle className="w-3.5 h-3.5" /> Cancel Task
              </button>
            )}
            {/* Delete removes the task from every board, whatever its status —
                cancelling only marks it cancelled and leaves it listed. */}
            {(canManage || oversight) && onDelete && (
              <button
                onClick={() => { onDelete(task); onClose(); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        )}
        {(isCancelled || isCompleted) && (
          <div className="flex justify-end px-6 py-4 border-t border-border bg-muted/20">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ── Create Task Modal ────────────────────────────────────────────────────────


