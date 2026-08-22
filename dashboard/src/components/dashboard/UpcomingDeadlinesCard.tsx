import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ListCard from '@/components/dashboard/ListCard';
import StatusPill from '@/components/dashboard/StatusPill';
import { useClients } from '@/hooks/useClients';
import type { ServiceStage } from '@/hooks/useTasks';

/**
 * The soonest live deadlines across every client's active services — pulled
 * straight from the Clients board so a date here always matches that board.
 */
export default function UpcomingDeadlinesCard() {
  const { data: clients = [], isLoading } = useClients();
  const navigate = useNavigate();

  const items = useMemo(() => {
    const rows: Array<{ id: string; title: string; meta: string; status: ServiceStage; dueAt: number }> = [];

    for (const client of clients) {
      for (const service of client.services) {
        if (!service.dueAt || service.stage === 'completed') continue;
        const due = new Date(service.dueAt).getTime();
        if (Number.isNaN(due)) continue;
        rows.push({
          id: service._id,
          title: service.title,
          meta: `${client.name} • Due ${new Date(service.dueAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`,
          status: service.stage,
          dueAt: due,
        });
      }
    }

    return rows.sort((a, b) => a.dueAt - b.dueAt).slice(0, 5);
  }, [clients]);

  if (isLoading) {
    return (
      <div className="kpi-card !p-0 flex flex-col">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-foreground">Upcoming Deadlines</h3>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <ListCard
      title="Upcoming Deadlines"
      emptyLabel="No upcoming deadlines."
      footerAction={{ label: 'View all', onClick: () => navigate('/clients') }}
      items={items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-foreground truncate">{item.title}</p>
            <p className="text-xs text-muted-foreground truncate">{item.meta}</p>
          </div>
          <StatusPill status={item.status} />
        </div>
      ))}
    />
  );
}
