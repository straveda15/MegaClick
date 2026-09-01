import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ListCard from '@/components/dashboard/ListCard';
import StatusPill from '@/components/dashboard/StatusPill';
import { useMyTasks, type Task } from '@/hooks/useTasks';

const isToday = (iso?: string | null) => {
  if (!iso) return false;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const assigneeName = (task: Task) =>
  [task.assignedTo?.name, task.assignedTo?.lastName].filter(Boolean).join(' ') || task.assignedTo?.email || 'Unassigned';

const meta = (task: Task) => {
  const who = assigneeName(task);
  const what = task.serviceRequest?.serviceTitle || task.type;
  return `${who} • ${what}`;
};

/**
 * The 5 tasks that most need attention today — everything due today first,
 * topped up with whatever's soonest due next so the card is never empty.
 */
export default function TodaysTasksCard() {
  const { data: tasks = [], isLoading } = useMyTasks({ view: 'all' });
  const navigate = useNavigate();

  const items = useMemo(() => {
    const live = tasks.filter((t) => t.status !== 'cancelled');
    const dueToday = live
      .filter((t) => isToday(t.dueAt))
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

    const upcoming = live
      .filter((t) => !isToday(t.dueAt) && t.status !== 'completed' && new Date(t.dueAt).getTime() > Date.now())
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

    const seen = new Set<string>();
    const merged: Task[] = [];
    for (const task of [...dueToday, ...upcoming]) {
      if (seen.has(task._id)) continue;
      seen.add(task._id);
      merged.push(task);
      if (merged.length === 5) break;
    }
    return merged;
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="kpi-card !p-0 flex flex-col">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-foreground">Today's Tasks</h3>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <ListCard
      title="Today's Tasks"
      emptyLabel="No tasks pending right now."
      footerAction={{ label: 'View all', onClick: () => navigate('/tasks') }}
      items={items.map((task) => (
        <div key={task._id} className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-foreground truncate">{task.title}</p>
            <p className="text-xs text-muted-foreground truncate">{meta(task)}</p>
          </div>
          <StatusPill status={task.status} />
        </div>
      ))}
    />
  );
}
