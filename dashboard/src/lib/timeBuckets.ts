import type { DateRange } from '@/components/DateRangeFilter';

/**
 * Shared time-bucketing for the dashboard's trend charts (Monthly Leads vs
 * Conversions, Task Completion): the X axis's granularity follows how wide
 * the global date filter is — a single day reads by the hour, a multi-day
 * pick by the day, a month-ish window by the week, and a year-ish (or wider)
 * window by the month. The Y axis is always just a plain count.
 */

export type Granularity = 'hour' | 'day' | 'week' | 'month';

const DAY_MS = 86_400_000;
const MAX_BUCKETS = 60;

export const GRANULARITY_LABEL: Record<Granularity, string> = {
  hour: 'By hour',
  day: 'By day',
  week: 'By week',
  month: 'By month',
};

export interface TimeBucket {
  label: string;
  start: Date;
  end: Date;
}

export function pickGranularity(spanDays: number): Granularity {
  if (spanDays <= 1) return 'hour';
  if (spanDays <= 31) return 'day';
  if (spanDays <= 366) return 'week';
  return 'month';
}

function buildBuckets(from: Date, to: Date, granularity: Granularity): TimeBucket[] {
  const buckets: TimeBucket[] = [];

  if (granularity === 'hour') {
    const dayStart = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    for (let h = 0; h < 24; h += 1) {
      const start = new Date(dayStart.getTime() + h * 3_600_000);
      const end = new Date(start.getTime() + 3_599_999);
      buckets.push({ label: start.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true }), start, end });
    }
    return buckets;
  }

  if (granularity === 'month') {
    const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
    const last = new Date(to.getFullYear(), to.getMonth(), 1);
    const spansYears = from.getFullYear() !== to.getFullYear();
    while (cursor <= last) {
      const start = new Date(cursor);
      const end = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59, 999);
      buckets.push({
        label: start.toLocaleDateString('en-IN', spansYears ? { month: 'short', year: '2-digit' } : { month: 'short' }),
        start,
        end,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return buckets;
  }

  // day or week — step through in fixed-size chunks from the range's start.
  const stepDays = granularity === 'week' ? 7 : 1;
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const last = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  while (cursor <= last && buckets.length < MAX_BUCKETS) {
    const start = new Date(cursor);
    const end = new Date(cursor);
    end.setDate(end.getDate() + stepDays - 1);
    end.setHours(23, 59, 59, 999);
    buckets.push({
      label: start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      start,
      end,
    });
    cursor.setDate(cursor.getDate() + stepDays);
  }
  return buckets;
}

export interface TrendWindow {
  buckets: TimeBucket[];
  granularity: Granularity;
  granularityLabel: string;
}

/**
 * Turns the dashboard's global date filter into a set of time buckets. With
 * no filter picked, defaults to a trailing `defaultMonthsBack`-month window
 * shown by month.
 */
export function buildTrendWindow(dateRange: DateRange | undefined, defaultMonthsBack = 6): TrendWindow {
  const now = new Date();
  const from = dateRange?.from ?? new Date(now.getFullYear(), now.getMonth() - (defaultMonthsBack - 1), 1);
  const to = dateRange?.to ?? (dateRange?.from ? dateRange.from : now);

  const spanDays = Math.max(0, (to.getTime() - from.getTime()) / DAY_MS);
  let granularity: Granularity = dateRange?.from ? pickGranularity(spanDays) : 'month';

  let buckets = buildBuckets(from, to, granularity);
  // A pathologically wide day/week pick (e.g. a multi-year custom range)
  // coarsens further rather than rendering hundreds of points.
  while (buckets.length >= MAX_BUCKETS && granularity !== 'month') {
    granularity = granularity === 'day' ? 'week' : 'month';
    buckets = buildBuckets(from, to, granularity);
  }

  return { buckets, granularity, granularityLabel: GRANULARITY_LABEL[granularity] };
}
