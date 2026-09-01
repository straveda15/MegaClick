import { useMemo } from 'react';
import {
  Briefcase, CalendarClock, CheckCircle2, Clock, ListChecks, TrendingUp, UserPlus, Users,
} from 'lucide-react';
import StatCard, { type StatCardTone } from '@/components/dashboard/StatCard';
import StatCardGrid from '@/components/dashboard/StatCardGrid';
import { useLeads } from '@/hooks/useLeads';
import { useClients } from '@/hooks/useClients';
import { useMyTasks } from '@/hooks/useTasks';

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

/**
 * The eight headline numbers, read off the same endpoints the boards use so
 * they can never drift from what those boards show.
 */
export default function KpiStrip() {
  const { data: leads = [] } = useLeads();
  const { data: clients = [] } = useClients();
  // Company-wide, to match the other headline numbers on this strip — these
  // are org totals, not the viewer's personal queue.
  const { data: tasks = [] } = useMyTasks({ view: 'all' });

  const stats = useMemo(() => {
    const services = clients.flatMap((client) => client.services);

    // A client is active while any of their services is still being worked on.
    const activeClients = clients.filter((client) =>
      client.services.some(
        (service) => service.taskStatus !== 'completed' && service.stage !== 'completed'
      )
    ).length;

    return [
      {
        label: 'Total Leads',
        value: leads.length,
        icon: UserPlus,
        tone: 'blue' as StatCardTone,
      },
      {
        label: 'New Leads',
        value: leads.filter((lead) => lead.status === 'NEW').length,
        icon: TrendingUp,
        tone: 'purple' as StatCardTone,
      },
      {
        label: 'Converted',
        value: leads.filter((lead) => lead.status === 'CONVERTED').length,
        icon: CheckCircle2,
        tone: 'green' as StatCardTone,
      },
      {
        label: 'Active Clients',
        value: activeClients,
        icon: Users,
        tone: 'green' as StatCardTone,
      },
      {
        label: 'Running Services',
        value: services.filter(
          (service) => service.assignedTo && !TERMINAL_TASK_STATUSES.includes(service.taskStatus)
        ).length,
        icon: Briefcase,
        tone: 'purple' as StatCardTone,
      },
      {
        label: 'Pending Tasks',
        value: tasks.filter((task) => ['pending', 'in_progress', 'overdue'].includes(task.status)).length,
        icon: Clock,
        tone: 'amber' as StatCardTone,
      },
      {
        label: 'Completed Tasks',
        value: tasks.filter((task) => task.status === 'completed').length,
        icon: ListChecks,
        tone: 'green' as StatCardTone,
      },
      {
        label: "Today's Follow-ups",
        value: leads.filter((lead) => isToday(lead.followUpAt)).length,
        icon: CalendarClock,
        tone: 'red' as StatCardTone,
      },
    ];
  }, [leads, clients, tasks]);

  return (
    <StatCardGrid>
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </StatCardGrid>
  );
}
