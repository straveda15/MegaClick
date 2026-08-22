import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import ListCard from '@/components/dashboard/ListCard';
import ActivityFeedItem from '@/components/dashboard/ActivityFeedItem';
import { useAuth } from '@/context/AuthContext';
import { useTeamWorkLogs, useMyWorkLogs, type WorkLog } from '@/hooks/useWorkLogs';

const initialsFromName = (name?: string) => {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

/**
 * A live feed off the work-log timeline: every logged activity for admins,
 * just the viewer's own for everyone else (the /worklogs/team endpoint is
 * admin-only, same rule the Team Logs page follows).
 */
export default function RecentActivityCard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: teamLogs = [], isLoading: teamLoading } = useTeamWorkLogs(undefined, { enabled: isAdmin });
  const { data: myLogs = [], isLoading: myLoading } = useMyWorkLogs();

  const logs = isAdmin ? teamLogs : myLogs;
  const isLoading = isAdmin ? teamLoading : myLoading;
  const ownInitials = initialsFromName([user?.name, user?.lastName].filter(Boolean).join(' '));

  const items = useMemo(() => {
    const actorLabel = (entry: WorkLog) => {
      if (entry.user && typeof entry.user !== 'string') {
        return initialsFromName([entry.user.name, entry.user.lastName].filter(Boolean).join(' ') || entry.user.email);
      }
      return ownInitials;
    };

    return [...logs]
      .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime())
      .slice(0, 6)
      .map((entry) => ({
        id: entry._id,
        actorInitials: actorLabel(entry),
        text: entry.activity,
        timestamp: format(new Date(entry.loggedAt), 'dd MMM, h:mm a'),
      }));
  }, [logs, ownInitials]);

  if (isLoading) {
    return (
      <div className="kpi-card !p-0 flex flex-col">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <ListCard
      title="Recent Activity"
      emptyLabel="No activity logged yet."
      items={items.map((activity) => (
        <ActivityFeedItem key={activity.id} {...activity} />
      ))}
    />
  );
}
