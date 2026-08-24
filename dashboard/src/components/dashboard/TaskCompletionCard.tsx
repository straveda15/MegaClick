import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useMyTasks } from '@/hooks/useTasks';
import { isWithinRange, type DateRange } from '@/components/DateRangeFilter';

interface TaskCompletionCardProps {
  dateRange?: DateRange;
}

interface EmployeeRow {
  id: string;
  name: string;
  tasks: number;
  completed: number;
  progress: number;
}

/**
 * Per-employee breakdown of tasks assigned vs. completed, so a manager can
 * see at a glance who's keeping up. Progress is completed / assigned.
 */
export default function TaskCompletionCard({ dateRange }: TaskCompletionCardProps) {
  const { data: tasks = [], isLoading } = useMyTasks({ view: 'all' });

  const rows = useMemo<EmployeeRow[]>(() => {
    const byEmployee = new Map<string, { name: string; tasks: number; completed: number }>();

    for (const task of tasks) {
      if (!isWithinRange(task.createdAt, dateRange)) continue;
      if (!task.assignedTo) continue;

      const id = task.assignedTo._id;
      const name = [task.assignedTo.name, task.assignedTo.lastName].filter(Boolean).join(' ');
      const entry = byEmployee.get(id) ?? { name, tasks: 0, completed: 0 };
      entry.tasks += 1;
      if (task.status === 'completed') entry.completed += 1;
      byEmployee.set(id, entry);
    }

    return Array.from(byEmployee.entries())
      .map(([id, { name, tasks: t, completed }]) => ({
        id,
        name,
        tasks: t,
        completed,
        progress: t > 0 ? Math.round((completed / t) * 100) : 0,
      }))
      .sort((a, b) => b.tasks - a.tasks);
  }, [tasks, dateRange]);

  const totalTasks = rows.reduce((sum, r) => sum + r.tasks, 0);
  const totalCompleted = rows.reduce((sum, r) => sum + r.completed, 0);

  return (
    <div className="kpi-card !p-0 flex flex-col">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-sm font-semibold text-foreground">Task Completion</h3>
        <span className="text-xs text-muted-foreground">
          {totalTasks > 0 ? `${totalCompleted}/${totalTasks} completed` : 'No tasks yet'}
        </span>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[260px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <p className="px-5 pb-6 text-sm text-muted-foreground text-center">No tasks yet</p>
      ) : (
        <div className="max-h-[280px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead className="text-right">Tasks</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="w-[140px]">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-foreground">{row.name}</TableCell>
                  <TableCell className="text-right">{row.tasks}</TableCell>
                  <TableCell className="text-right">{row.completed}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={row.progress} className="h-2" />
                      <span className="text-xs text-muted-foreground w-9 shrink-0 text-right">
                        {row.progress}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
