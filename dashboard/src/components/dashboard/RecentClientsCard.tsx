import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ListCard from '@/components/dashboard/ListCard';
import StatusPill from '@/components/dashboard/StatusPill';
import { useClients } from '@/hooks/useClients';
import { isWithinRange, type DateRange } from '@/components/DateRangeFilter';

interface RecentClientsCardProps {
  dateRange?: DateRange;
}

const initialsFromName = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

/** The clients board's own newest-first order, trimmed to a handful for the dashboard. */
export default function RecentClientsCard({ dateRange }: RecentClientsCardProps) {
  const { data: clients = [], isLoading } = useClients();
  const navigate = useNavigate();

  const recent = useMemo(() => {
    return clients
      .filter((client) => isWithinRange(client.createdAt, dateRange))
      .slice()
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .slice(0, 5)
      .map((client) => {
        const activeService = client.services.find((s) => s.stage !== 'completed') ?? client.services[0];
        return {
          id: client._id,
          initials: initialsFromName(client.name),
          name: client.name,
          company: client.company || client.email || client.phone,
          status: activeService?.stage ?? 'completed',
        };
      });
  }, [clients, dateRange]);

  if (isLoading) {
    return (
      <div className="kpi-card !p-0 flex flex-col">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Clients</h3>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <ListCard
      title="Recent Clients"
      emptyLabel="No clients yet."
      footerAction={{ label: 'View all', onClick: () => navigate('/clients') }}
      items={recent.map((client) => (
        <div key={client.id} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 rounded-full bg-accent text-primary text-xs font-semibold flex items-center justify-center shrink-0">
              {client.initials}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-foreground truncate">{client.name}</p>
              <p className="text-xs text-muted-foreground truncate">{client.company}</p>
            </div>
          </div>
          <StatusPill status={client.status} />
        </div>
      ))}
    />
  );
}
