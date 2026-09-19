import { useMemo, useState } from 'react';
import {
  Briefcase, CalendarClock, CheckCircle2, Clock, ListChecks, TrendingUp, UserPlus, Users,
} from 'lucide-react';
import StatCard, { type StatCardTone } from '@/components/dashboard/StatCard';
import StatCardGrid from '@/components/dashboard/StatCardGrid';
import KpiDetailsDialog, { type KpiRow } from '@/components/dashboard/KpiDetailsDialog';
import { STAGE_LABELS } from '@/data/services';
import { TASK_STATUS_LABELS, TASK_STATUS_STYLES } from '@/data/clientStatus';
import { useLeads, type SalesLead } from '@/hooks/useLeads';
import { useClients } from '@/hooks/useClients';
import { useMyTasks, type Task } from '@/hooks/useTasks';

const TERMINAL_TASK_STATUSES = ['completed', 'cancelled'];

const isToday = (iso?: string | null) => {
  if (!iso) return false;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
};

/* ── Row builders ───────────────────────────────────────────────────────────── */

type Person = { name?: string; lastName?: string } | null | undefined;

const personName = (person: Person) => [person?.name, person?.lastName].filter(Boolean).join(' ');

const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const time = (iso?: string | null) => (iso ? new Date(iso).getTime() || 0 : 0);

const TASK_BADGES: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  in_progress: { label: 'In Progress', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  completed: { label: 'Completed', cls: 'bg-green-100 text-green-700 border-green-200' },
  overdue: { label: 'Overdue', cls: 'bg-red-100 text-red-700 border-red-200' },
};

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent', critical: 'Critical',
};

const isOverdue = (task: Task) =>
  task.status === 'overdue'
  || (task.status !== 'completed' && Boolean(task.dueAt) && time(task.dueAt) < Date.now());

/** A task, for the Pending / Completed popups. */
const taskRow = (task: Task): KpiRow => {
  const overdue = isOverdue(task);
  const done = task.status === 'completed';
  const service = task.serviceRequest;

  return {
    id: task._id,
    title: task.title,
    // A client's service task says whose it is; a plain task has no more to add.
    subtitle: service?.serviceTitle
      ? [service.serviceTitle, service.clientName].filter(Boolean).join(' · ')
      : undefined,
    assignees: [personName(task.assignedTo)].filter(Boolean),
    badge: TASK_BADGES[overdue && !done ? 'overdue' : task.status] ?? TASK_BADGES.pending,
    meta: [
      ...(done
        ? [{ label: 'Completed', value: formatDate(task.completedAt) }]
        : [{ label: 'Due', value: formatDate(task.dueAt), warn: overdue }]),
      { label: 'Priority', value: PRIORITY_LABELS[task.priority] ?? task.priority },
    ],
  };
};

/** A lead that became a client — who is handling what they signed up for. */
const convertedRow = (lead: SalesLead): KpiRow => {
  const services = lead.services ?? [];
  // Whoever has been given one of the services; failing that, the lead's owner.
  const handlers = [...new Set(services.map((service) => personName(service.assignedTo)).filter(Boolean))];
  const owner = personName(lead.assignedTo);
  const convertedAt = [...(lead.statusHistory ?? [])].reverse().find((entry) => entry.status === 'CONVERTED')?.changedAt;

  const name = lead.customer?.name?.trim() || lead.customer?.phone || 'Unnamed client';

  return {
    id: lead._id,
    title: lead.customer?.company ? `${name} · ${lead.customer.company}` : name,
    subtitle: services.length > 0 ? services.map((service) => service.title).join(', ') : lead.productInterest,
    assignees: handlers.length > 0 ? handlers : owner ? [owner] : [],
    meta: [
      { label: 'Phone', value: lead.customer?.phone || '—' },
      { label: 'Converted', value: formatDate(convertedAt ?? lead.updatedAt) },
    ],
  };
};

/* ── Strip ──────────────────────────────────────────────────────────────────── */

type PopupKey = 'pending' | 'completed' | 'running' | 'converted';

/**
 * The eight headline numbers, read off the same endpoints the boards use so
 * they can never drift from what those boards show. Each card is clickable:
 * four open a popup listing exactly what the number counts and who it is with,
 * and four go to the page that number belongs to.
 */
export default function KpiStrip() {
  const { data: leads = [] } = useLeads();
  const { data: clients = [] } = useClients();
  // Company-wide, to match the other headline numbers on this strip — these
  // are org totals, not the viewer's personal queue.
  const { data: tasks = [] } = useMyTasks({ view: 'all' });

  const [popup, setPopup] = useState<PopupKey | null>(null);
  // The last popup stays put while the dialog fades, so its title doesn't blank.
  const [lastPopup, setLastPopup] = useState<PopupKey>('pending');

  const openPopup = (key: PopupKey) => {
    setLastPopup(key);
    setPopup(key);
  };

  const data = useMemo(() => {
    // A client is active while any of their services is still being worked on.
    const activeClients = clients.filter((client) =>
      client.services.some(
        (service) => service.taskStatus !== 'completed' && service.stage !== 'completed'
      )
    ).length;

    const pendingTasks = tasks
      .filter((task) => ['pending', 'in_progress', 'overdue'].includes(task.status))
      // Whatever is due soonest — that is what needs looking at.
      .sort((a, b) => (time(a.dueAt) || Infinity) - (time(b.dueAt) || Infinity));
    const completedTasks = tasks
      .filter((task) => task.status === 'completed')
      .sort((a, b) => time(b.completedAt) - time(a.completedAt));

    const runningServices = clients
      .flatMap((client) => client.services.map((service) => ({ client, service })))
      .filter(({ service }) => service.assignedTo && !TERMINAL_TASK_STATUSES.includes(service.taskStatus))
      .sort((a, b) => (time(a.service.dueAt) || Infinity) - (time(b.service.dueAt) || Infinity));

    const convertedLeads = leads
      .filter((lead) => lead.status === 'CONVERTED')
      .sort((a, b) => time(b.updatedAt) - time(a.updatedAt));

    const rows: Record<PopupKey, KpiRow[]> = {
      pending: pendingTasks.map(taskRow),
      completed: completedTasks.map(taskRow),
      running: runningServices.map(({ client, service }) => {
        const status = TASK_STATUS_STYLES[service.taskStatus];
        return {
          id: `${client._id}-${service._id}`,
          title: service.title,
          subtitle: [client.name, client.company].filter(Boolean).join(' · '),
          assignees: [personName(service.assignedTo)].filter(Boolean),
          badge: {
            label: TASK_STATUS_LABELS[service.taskStatus] ?? service.taskStatus,
            cls: `border-transparent ${status?.bg ?? 'bg-slate-100'} ${status?.text ?? 'text-slate-600'}`,
          },
          meta: [
            { label: 'Stage', value: STAGE_LABELS[service.stage] ?? service.stage },
            { label: 'Due', value: formatDate(service.dueAt) },
            { label: 'Progress', value: `${service.progress}%` },
          ],
        };
      }),
      converted: convertedLeads.map(convertedRow),
    };

    return { activeClients, rows };
  }, [leads, clients, tasks]);

  const stats: Array<{
    label: string;
    value: number;
    icon: typeof UserPlus;
    tone: StatCardTone;
    to?: string;
    popup?: PopupKey;
  }> = [
    { label: 'Total Leads', value: leads.length, icon: UserPlus, tone: 'blue', to: '/leads' },
    { label: 'New Leads', value: leads.filter((lead) => lead.status === 'NEW').length, icon: TrendingUp, tone: 'purple', to: '/leads' },
    { label: 'Converted', value: data.rows.converted.length, icon: CheckCircle2, tone: 'green', popup: 'converted' },
    { label: 'Active Clients', value: data.activeClients, icon: Users, tone: 'green', to: '/clients' },
    { label: 'Running Services', value: data.rows.running.length, icon: Briefcase, tone: 'purple', popup: 'running' },
    { label: 'Pending Tasks', value: data.rows.pending.length, icon: Clock, tone: 'amber', popup: 'pending' },
    { label: 'Completed Tasks', value: data.rows.completed.length, icon: ListChecks, tone: 'green', popup: 'completed' },
    {
      label: "Today's Follow-ups",
      value: leads.filter((lead) => isToday(lead.followUpAt)).length,
      icon: CalendarClock,
      tone: 'red',
      to: '/follow-ups',
    },
  ];

  const POPUPS: Record<PopupKey, { title: string; description: string; emptyText: string; assigneeLabel?: string }> = {
    pending: {
      title: 'Pending Tasks',
      description: 'Every task still open across the team, soonest deadline first.',
      emptyText: 'No pending tasks — everything is done.',
    },
    completed: {
      title: 'Completed Tasks',
      description: 'Every task the team has finished, most recent first.',
      emptyText: 'No tasks have been completed yet.',
    },
    running: {
      title: 'Running Services',
      description: 'Services currently being worked on, and who is working on each.',
      emptyText: 'No services are running right now.',
    },
    converted: {
      title: 'Converted Leads',
      description: 'Leads that became clients, and who is handling their services.',
      emptyText: 'No leads have been converted yet.',
      assigneeLabel: 'Handled by',
    },
  };

  const current = POPUPS[lastPopup];

  return (
    <>
      <StatCardGrid>
        {stats.map(({ popup: popupKey, ...stat }) => (
          <StatCard
            key={stat.label}
            {...stat}
            onClick={popupKey ? () => openPopup(popupKey) : undefined}
          />
        ))}
      </StatCardGrid>

      <KpiDetailsDialog
        open={popup !== null}
        onOpenChange={(open) => !open && setPopup(null)}
        title={current.title}
        description={current.description}
        rows={data.rows[lastPopup]}
        emptyText={current.emptyText}
        assigneeLabel={current.assigneeLabel}
      />
    </>
  );
}
