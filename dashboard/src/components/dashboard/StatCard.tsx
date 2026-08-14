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
}

const StatCard = ({ label, value, icon: Icon, tone, trend }: StatCardProps) => (
  <div className="kpi-card">
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
  </div>
);

export default StatCard;
