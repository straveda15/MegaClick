import type { KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

export type StatCardTone = 'blue' | 'green' | 'amber' | 'purple' | 'slate' | 'red';

const TONE_CLASSES: Record<StatCardTone, string> = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  purple: 'bg-purple-100 text-purple-700',
  slate: 'bg-slate-100 text-slate-700',
  red: 'bg-red-100 text-red-700',
};

/** What a clickable card looks like — the same lift and focus ring for links and popups. */
const INTERACTIVE_CLASSES =
  'block w-full text-left cursor-pointer transition-all hover:shadow-md hover:border-primary/40 '
  + 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export interface StatCardTrend {
  direction: 'up' | 'down' | 'neutral';
  text: string;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone: StatCardTone;
  trend?: StatCardTrend;
  /** Makes the card a link to another page. */
  to?: string;
  /** Makes the card a button — used to open a popup. Ignored when `to` is set. */
  onClick?: () => void;
}

const StatCard = ({ label, value, icon: Icon, tone, trend, to, onClick }: StatCardProps) => {
  const content = (
    <>
      <div className="flex items-start justify-between">
        <div>
          <div className="kpi-value">{value}</div>
          <div className="kpi-label">{label}</div>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${TONE_CLASSES[tone]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <p
          className={
            trend.direction === 'down'
              ? 'kpi-trend-down mt-2'
              : trend.direction === 'up'
                ? 'kpi-trend-up mt-2'
                : 'text-[13px] font-medium text-muted-foreground mt-2'
          }
        >
          {trend.text}
        </p>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`kpi-card ${INTERACTIVE_CLASSES}`} aria-label={`${label}: ${value}. Open`}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick();
      }
    };

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        aria-label={`${label}: ${value}. View details`}
        className={`kpi-card ${INTERACTIVE_CLASSES}`}
      >
        {content}
      </div>
    );
  }

  return <div className="kpi-card">{content}</div>;
};

export default StatCard;
