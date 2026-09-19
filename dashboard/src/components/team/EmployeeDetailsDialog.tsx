import { useMemo, useState } from 'react';
import {
  AlertTriangle, Briefcase, Building2, CalendarDays, Check,
  Circle, Flag, Mail, MessageSquare, Phone, UserRound,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { STAGE_LABELS, STAGE_STYLES } from '@/data/services';
import type { EmployeeProfile } from '@/hooks/useTeam';
import type { Task } from '@/hooks/useTasks';

/* ── Display helpers ────────────────────────────────────────────────────────── */

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  in_progress: { label: 'In Progress', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  completed: { label: 'Completed', cls: 'bg-green-100 text-green-700 border-green-200' },
  overdue: { label: 'Overdue', cls: 'bg-red-100 text-red-700 border-red-200' },
};

const PRIORITY_STYLES: Record<string, { label: string; cls: string }> = {
  low: { label: 'Low', cls: 'bg-slate-100 text-slate-700' },
  medium: { label: 'Medium', cls: 'bg-blue-100 text-blue-700' },
  high: { label: 'High', cls: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Urgent', cls: 'bg-red-100 text-red-700' },
  critical: { label: 'Critical', cls: 'bg-red-100 text-red-700' },
};

const DEPARTMENT_LABELS: Record<string, string> = {
  hr: 'HR',
  sales: 'Sales',
  business_analyst: 'Business Analyst',
  accountant: 'Accountant',
  manager: 'Manager',
  advocate: 'Advocate',
};

const fullName = (person?: { name?: string; lastName?: string } | null) =>
  [person?.name, person?.lastName].filter(Boolean).join(' ');

const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : `${formatDate(iso)}, ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
};

const formatDuration = (minutes?: number) => {
  if (!minutes || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

/** Past its due date and still open — whatever the stored status says. */
const isOverdue = (task: Task) =>
  task.status === 'overdue'
  || (task.status !== 'completed' && Boolean(task.dueAt) && new Date(task.dueAt).getTime() < Date.now());

const time = (iso?: string | null) => (iso ? new Date(iso).getTime() : 0);

/* ── Task card ──────────────────────────────────────────────────────────────── */

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</p>
      <p className="text-[12.5px] text-foreground mt-0.5 break-words">{value}</p>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const overdue = isOverdue(task);
  const status = STATUS_STYLES[overdue && task.status !== 'completed' ? 'overdue' : task.status] ?? STATUS_STYLES.pending;
  const priority = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium;
  const done = task.status === 'completed';

  const service = task.serviceRequest;
  const steps = [...(service?.steps ?? [])].sort((a, b) => a.order - b.order);
  const stepsDone = steps.filter((step) => step.done).length;
  const openFlags = (task.flags ?? []).filter((flag) => !flag.resolvedAt).length;
  const stage = service?.stage;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <p className="text-sm font-semibold text-foreground min-w-0 break-words">{task.title}</p>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${priority.cls}`}>
            {priority.label}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${status.cls}`}>
            {status.label}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mt-1.5 whitespace-pre-line break-words line-clamp-3">
          {task.description}
        </p>
      )}

      {/* When it is due, and how it went */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-border">
        <Detail
          label="Due"
          value={
            <span className={overdue && !done ? 'text-red-600 font-medium' : undefined}>
              {formatDateTime(task.dueAt)}
            </span>
          }
        />
        <Detail label="Assigned by" value={fullName(task.assignedBy) || 'System'} />
        <Detail label="Assigned on" value={formatDate(task.createdAt)} />
        {done ? (
          <Detail label="Completed" value={formatDateTime(task.completedAt)} />
        ) : (
          <Detail label="Started" value={task.startedAt ? formatDateTime(task.startedAt) : 'Not started'} />
        )}
        {done && <Detail label="Time taken" value={formatDuration(task.timeTakenMinutes)} />}
      </div>

      {/* A client service: what it is, for whom, and how far along */}
      {service?.serviceTitle && (
        <div className="mt-3 pt-3 border-t border-border space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-[12.5px] text-foreground flex items-center gap-1.5 min-w-0">
              <Briefcase className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium truncate">{service.serviceTitle}</span>
              {service.serviceCategory && (
                <span className="text-muted-foreground truncate">· {service.serviceCategory}</span>
              )}
            </p>
            {stage && STAGE_LABELS[stage] && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${STAGE_STYLES[stage].bg} ${STAGE_STYLES[stage].text}`}>
                {STAGE_LABELS[stage]}
              </span>
            )}
          </div>

          {(service.clientName || service.clientCompany || service.clientPhone) && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <UserRound className="w-3.5 h-3.5 shrink-0" />
              {[service.clientName, service.clientCompany].filter(Boolean).join(' · ')}
              {service.clientPhone && <span>· {service.clientPhone}</span>}
            </p>
          )}

          {steps.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center gap-2 text-xs text-foreground">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stepsDone === steps.length ? 'bg-emerald-500' : 'bg-blue-600'}`}
                    style={{ width: `${Math.round((stepsDone / steps.length) * 100)}%` }}
                  />
                </div>
                <span className="shrink-0 text-muted-foreground">
                  {stepsDone}/{steps.length} steps · <span className="underline group-open:no-underline">checklist</span>
                </span>
              </summary>
              <div className="mt-2 space-y-1">
                {steps.map((step, index) => (
                  <div key={step._id ?? index} className="flex items-start gap-2">
                    {step.done
                      ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      : <Circle className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 mt-0.5" />}
                    <span className={`text-[12px] leading-snug ${step.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* Anything that needs a second look */}
      {((task.followUps?.length ?? 0) > 0 || openFlags > 0) && (
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground">
          {(task.followUps?.length ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {task.followUps!.length} follow-up{task.followUps!.length === 1 ? '' : 's'}
            </span>
          )}
          {openFlags > 0 && (
            <span className="inline-flex items-center gap-1 text-orange-700">
              <Flag className="w-3 h-3" />
              {openFlags} open issue{openFlags === 1 ? '' : 's'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function TaskList({ tasks, empty }: { tasks: Task[]; empty: string }) {
  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-10">{empty}</p>;
  }
  return (
    <div className="space-y-3">
      {tasks.map((task) => <TaskCard key={task._id} task={task} />)}
    </div>
  );
}

/* ── Profile ────────────────────────────────────────────────────────────────── */

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value?: string | null }) {
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

/* ── Dialog ─────────────────────────────────────────────────────────────────── */

type TaskView = 'assigned' | 'pending' | 'completed';

interface EmployeeDetailsDialogProps {
  employee: EmployeeProfile | null;
  /** Every task on the board — this dialog picks out the ones that are theirs. */
  tasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * The popup behind an employee's row: who they are, then the work on their
 * plate. Cancelled work is left out, matching the counts on the table — it was
 * called off, so it belongs to neither their pending nor completed work.
 */
export function EmployeeDetailsDialog({ employee, tasks, open, onOpenChange }: EmployeeDetailsDialogProps) {
  // Which list the three cards have selected.
  const [view, setView] = useState<TaskView>('pending');

  const user = employee?.userId;
  const userId = user?._id ? String(user._id) : '';

  const { assigned, pending, completed, overdueCount } = useMemo(() => {
    const mine = tasks.filter(
      (task) => task.status !== 'cancelled' && userId !== '' && String(task.assignedTo?._id ?? '') === userId,
    );

    const open = mine
      .filter((task) => task.status !== 'completed')
      // Soonest deadline first — that is what needs looking at.
      .sort((a, b) => (time(a.dueAt) || Infinity) - (time(b.dueAt) || Infinity));
    const done = mine
      .filter((task) => task.status === 'completed')
      .sort((a, b) => time(b.completedAt) - time(a.completedAt));

    return {
      // Everything on their plate, newest assignment first.
      assigned: [...mine].sort((a, b) => time(b.createdAt) - time(a.createdAt)),
      pending: open,
      completed: done,
      overdueCount: open.filter(isOverdue).length,
    };
  }, [tasks, userId]);

  const name = fullName(user) || 'Employee';
  const initials = `${user?.name?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();
  const active = employee?.status === 'active';

  const summary: Array<{ view: TaskView; label: string; value: number; tone: string }> = [
    { view: 'assigned', label: 'Assigned', value: assigned.length, tone: 'text-blue-600' },
    { view: 'pending', label: 'Pending', value: pending.length, tone: 'text-amber-600' },
    { view: 'completed', label: 'Completed', value: completed.length, tone: 'text-emerald-600' },
  ];

  const LISTS: Record<TaskView, { title: string; tasks: Task[]; empty: string }> = {
    assigned: { title: 'Assigned Tasks', tasks: assigned, empty: 'No tasks have been assigned to this employee yet.' },
    pending: { title: 'Pending Tasks', tasks: pending, empty: 'Nothing pending — all caught up.' },
    completed: { title: 'Completed Tasks', tasks: completed, empty: 'No completed tasks yet.' },
  };
  const list = LISTS[view];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border shrink-0 pr-12">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
              {initials || <UserRound className="w-5 h-5" />}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <DialogTitle className="flex items-center gap-2 flex-wrap">
                {name}
                {employee && (
                  <span className="text-xs font-medium text-muted-foreground font-mono">{employee.employeeId}</span>
                )}
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-2 flex-wrap">
                <span>{employee?.designation || 'No designation'}</span>
                {user?.departmentRole && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground">
                    {DEPARTMENT_LABELS[user.departmentRole] ?? user.departmentRole}
                  </span>
                )}
                {employee && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {active ? 'Active' : 'On Leave'}
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* ── Profile ─────────────────────────────────────────────────── */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 rounded-lg border border-border bg-muted/20 p-4">
              <InfoRow icon={Mail} label="Email" value={user?.email} />
              <InfoRow icon={Phone} label="Phone" value={user?.phone ? `+91 ${String(user.phone).replace('+91', '')}` : ''} />
              <InfoRow
                icon={Building2}
                label="Department"
                value={user?.departmentRole ? (DEPARTMENT_LABELS[user.departmentRole] ?? user.departmentRole) : ''}
              />
              <InfoRow icon={CalendarDays} label="Joined" value={employee?.joiningDate ? formatDate(employee.joiningDate) : ''} />
            </section>

            {/* ── Workload ────────────────────────────────────────────────── */}
            <section>
              <div className="grid grid-cols-3 gap-3">
                {summary.map((item) => (
                  <button
                    key={item.view}
                    type="button"
                    onClick={() => setView(item.view)}
                    aria-pressed={view === item.view}
                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                      view === item.view ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted/40'
                    }`}
                  >
                    <span className={`block text-[10px] font-semibold uppercase tracking-wider ${item.tone}`}>{item.label}</span>
                    <span className="block text-2xl font-bold text-foreground leading-none mt-1">{item.value}</span>
                  </button>
                ))}
              </div>

              {overdueCount > 0 && (
                <p className="flex items-center gap-1.5 text-xs text-red-600 mt-3">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {overdueCount} pending task{overdueCount === 1 ? ' is' : 's are'} past the due date.
                </p>
              )}

              {/* The cards above choose the list; this names it. */}
              <h3 className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mt-5 mb-3">
                {list.title} ({list.tasks.length})
              </h3>
              <TaskList tasks={list.tasks} empty={list.empty} />
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EmployeeDetailsDialog;
