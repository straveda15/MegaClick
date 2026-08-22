import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import GroupedBarChart from '@/components/dashboard/GroupedBarChart';
import { useMyTasks } from '@/hooks/useTasks';
import { buildTrendWindow } from '@/lib/timeBuckets';
import type { DateRange } from '@/components/DateRangeFilter';

interface TaskCompletionCardProps {
  dateRange?: DateRange;
}

/**
 * Tasks assigned vs. how many of them got completed, bucketed over time —
 * the same dynamic window as Monthly Leads vs Conversions (by hour/day/week/
 * month, depending on how wide the picked range is), just as bars instead of
 * a line. The Y axis is always just a count.
 */
export default function TaskCompletionCard({ dateRange }: TaskCompletionCardProps) {
  const { data: tasks = [], isLoading } = useMyTasks({ view: 'all' });

  const { data, granularityLabel, total, completed } = useMemo(() => {
    const { buckets, granularityLabel: label } = buildTrendWindow(dateRange);
    const counted = buckets.map((b) => ({ ...b, assigned: 0, completed: 0 }));

    let totalCount = 0;
    let completedCount = 0;

    for (const task of tasks) {
      const createdAt = new Date(task.createdAt);
      const assignedBucket = counted.find((b) => createdAt >= b.start && createdAt <= b.end);
      if (assignedBucket) {
        assignedBucket.assigned += 1;
        totalCount += 1;
        if (task.status === 'completed') completedCount += 1;
      }

      if (task.completedAt) {
        const completedAt = new Date(task.completedAt);
        const completedBucket = counted.find((b) => completedAt >= b.start && completedAt <= b.end);
        if (completedBucket) completedBucket.completed += 1;
      }
    }

    return {
      data: counted.map(({ label: x, assigned, completed: c }) => ({ x, assigned, completed: c })),
      granularityLabel: label,
      total: totalCount,
      completed: completedCount,
    };
  }, [tasks, dateRange]);

  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">Task Completion</h3>
        <span className="text-xs text-muted-foreground">
          {total > 0 ? `${completed}/${total} completed (${rate}%) · ${granularityLabel}` : 'No tasks yet'}
        </span>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[260px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <GroupedBarChart
          data={data}
          xKey="x"
          series={[
            { key: 'assigned', label: 'Assigned', color: 'hsl(217 91% 60%)' },
            { key: 'completed', label: 'Completed', color: 'hsl(262 52% 55%)' },
          ]}
        />
      )}
    </div>
  );
}
