import StatusPill, { type StatusKey } from './StatusPill';

export interface RecentClientCardProps {
  initials: string;
  name: string;
  company: string;
  serviceTag: string;
  status: StatusKey;
}

const RecentClientCard = ({ initials, name, company, serviceTag, status }: RecentClientCardProps) => (
  <div className="kpi-card flex-1 min-w-[220px]">
    <div className="flex items-center gap-3 mb-3">
      <span className="w-9 h-9 rounded-full bg-accent text-primary text-sm font-semibold flex items-center justify-center shrink-0">
        {initials}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{company}</p>
      </div>
    </div>
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground truncate">{serviceTag}</span>
      <StatusPill status={status} />
    </div>
  </div>
);

export default RecentClientCard;
