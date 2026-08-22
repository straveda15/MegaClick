import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import DottedLineChart from '@/components/dashboard/DottedLineChart';
import { useLeads } from '@/hooks/useLeads';
import { buildTrendWindow } from '@/lib/timeBuckets';
import type { DateRange } from '@/components/DateRangeFilter';

interface LeadsConversionsCardProps {
  dateRange?: DateRange;
}

/** When a lead most recently flipped to CONVERTED — falls back to updatedAt for older records without history. */
function convertedAt(lead: { status: string; updatedAt: string; statusHistory?: Array<{ status: string; changedAt?: string }> }) {
  if (lead.status !== 'CONVERTED') return null;
  const entry = [...(lead.statusHistory ?? [])].reverse().find((h) => h.status === 'CONVERTED');
  return entry?.changedAt ?? lead.updatedAt;
}

/**
 * Leads captured vs. how many of them converted, plotted as a dotted line so
 * the trend reads at a glance. The X axis's granularity follows how wide a
 * window is being looked at; the Y axis is always just a count.
 */
export default function LeadsConversionsCard({ dateRange }: LeadsConversionsCardProps) {
  const { data: leads = [], isLoading } = useLeads();

  const { data, granularityLabel } = useMemo(() => {
    const { buckets, granularityLabel: label } = buildTrendWindow(dateRange);
    const counted = buckets.map((b) => ({ ...b, leads: 0, conversions: 0 }));

    for (const lead of leads) {
      const createdAt = new Date(lead.createdAt);
      const createdBucket = counted.find((b) => createdAt >= b.start && createdAt <= b.end);
      if (createdBucket) createdBucket.leads += 1;

      const convertedIso = convertedAt(lead);
      if (convertedIso) {
        const convertedDate = new Date(convertedIso);
        const convertedBucket = counted.find((b) => convertedDate >= b.start && convertedDate <= b.end);
        if (convertedBucket) convertedBucket.conversions += 1;
      }
    }

    return {
      data: counted.map(({ label: x, leads: l, conversions }) => ({ x, leads: l, conversions })),
      granularityLabel: label,
    };
  }, [leads, dateRange]);

  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">Monthly Leads vs Conversions</h3>
        <span className="text-xs text-muted-foreground">{granularityLabel}</span>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[280px]">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <DottedLineChart
          data={data}
          xKey="x"
          series={[
            { key: 'leads', label: 'Leads', color: 'hsl(217 91% 60%)' },
            { key: 'conversions', label: 'Conversions', color: 'hsl(142 64% 24%)' },
          ]}
        />
      )}
    </div>
  );
}
