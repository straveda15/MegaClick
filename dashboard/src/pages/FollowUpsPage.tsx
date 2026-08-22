import { useMemo, useState } from 'react';
import { CalendarClock, Info, Loader2, Phone, RefreshCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExportMenu from '@/components/ExportMenu';
import DateRangeFilter, { isWithinRange, type DateRange } from '@/components/DateRangeFilter';
import FollowUpDetailsDialog from '@/components/followups/FollowUpDetailsDialog';
import LogFollowUpDialog from '@/components/followups/LogFollowUpDialog';
import { BUCKET_LABELS, BUCKET_STYLES, OUTCOME_LABELS, formatDateTime } from '@/data/followUp';
import { useFollowUps, type FollowUpRow } from '@/hooks/useFollowUps';
import type { SheetColumn } from '@/lib/sheet';

/* ── Spreadsheet columns ────────────────────────────────────────────────────── */

const FOLLOW_UP_COLUMNS = [
  { key: 'reference',  header: 'Lead ID',        value: (r: FollowUpRow) => r.reference },
  { key: 'client',     header: 'Client',         value: (r: FollowUpRow) => r.client.name },
  { key: 'phone',      header: 'Phone',          value: (r: FollowUpRow) => r.client.phone },
  { key: 'services',   header: 'Services',       value: (r: FollowUpRow) => r.services.map((s) => s.title).join(', ') },
  { key: 'followUpAt', header: 'Next Follow Up', value: (r: FollowUpRow) => formatDateTime(r.followUpAt) },
  { key: 'bucket',     header: 'Due',            value: (r: FollowUpRow) => BUCKET_LABELS[r.bucket] },
  { key: 'note',       header: 'Latest Note',    value: (r: FollowUpRow) => r.history[0]?.note ?? r.followUpNote },
  { key: 'count',      header: 'Follow Ups',     value: (r: FollowUpRow) => String(r.followUpCount) },
  { key: 'owner',      header: 'Owner',          value: (r: FollowUpRow) => r.owner ?? '' },
] as const satisfies ReadonlyArray<SheetColumn<FollowUpRow> & { key: string }>;

/* ── Page ───────────────────────────────────────────────────────────────────── */

type Scope = 'all' | 'overdue';

/**
 * When a row last saw activity — the most recent logged follow-up, or failing
 * that the date it is booked for. This is what "newest on top" sorts on: the
 * board should open on what just happened, not on the oldest thing in the pile.
 */
const activityAt = (row: FollowUpRow) =>
  Number(new Date(row.lastFollowUpAt ?? row.followUpAt ?? 0)) || 0;

const FollowUpsPage = () => {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<Scope>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [detailsRow, setDetailsRow] = useState<FollowUpRow | null>(null);
  const [logTarget, setLogTarget] = useState<FollowUpRow | null>(null);

  const { data: rows = [], isLoading, isError, error, refetch } = useFollowUps();

  const overdueCount = useMemo(() => rows.filter((row) => row.bucket === 'overdue').length, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows
      .filter((row) => {
        const matchQ = !q
          || row.client.name.toLowerCase().includes(q)
          || row.client.phone.includes(q)
          || row.client.company.toLowerCase().includes(q)
          || row.reference.toLowerCase().includes(q)
          || row.services.some((s) => s.title.toLowerCase().includes(q));

        const matchScope = scope === 'all' || row.bucket === 'overdue';
        // The calendar narrows on when the next follow-up falls due.
        const matchDate = isWithinRange(row.followUpAt, dateRange);

        return matchQ && matchScope && matchDate;
      })
      // Newest activity first.
      .sort((a, b) => activityAt(b) - activityAt(a));
  }, [rows, query, scope, dateRange]);

  const thBase =
    'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap select-none';

  return (
    <div className="space-y-5">
      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* All / Overdue */}
        <div className="flex bg-muted rounded-lg p-1 gap-1">
          {([
            { key: 'all' as const, label: 'All', count: rows.length },
            { key: 'overdue' as const, label: 'Overdue', count: overdueCount },
          ]).map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              onClick={() => setScope(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                scope === key ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
              <span className={`ml-1.5 ${key === 'overdue' && count > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client, phone or service…"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Narrows to follow-ups falling due between two dates. */}
        <DateRangeFilter value={dateRange} onChange={setDateRange} label="Filter by follow-up date" />

        <div className="ml-auto">
          <ExportMenu rows={filtered} columns={[...FOLLOW_UP_COLUMNS]} baseName="follow-ups" />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className={thBase}>Lead ID</th>
                <th className={thBase}>Client</th>
                <th className={thBase} style={{ width: 200 }}>Services</th>
                <th className={thBase}>Next Follow Up</th>
                <th className={thBase}>Latest Note</th>
                <th className={`${thBase} text-right`}>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading follow-ups…
                </td></tr>
              ) : isError ? (
                <tr><td colSpan={6} className="text-center py-16">
                  <p className="text-sm text-destructive mb-3">
                    {error instanceof Error ? error.message : 'Failed to load follow-ups.'}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCcw className="w-4 h-4" />Retry
                  </Button>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                  {rows.length === 0
                    ? 'Nothing to follow up. Set a follow-up date on a lead and it will show here.'
                    : 'No follow-ups match your filters.'}
                </td></tr>
              ) : (
                filtered.map((row) => {
                  const bucketStyle = BUCKET_STYLES[row.bucket];
                  const latest = row.history[0];

                  return (
                    <tr key={row._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground text-xs font-medium whitespace-nowrap">
                        {row.reference}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="block font-semibold text-foreground text-sm">{row.client.name}</span>
                        {row.client.phone && (
                          <a
                            href={`tel:${row.client.phone}`}
                            className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />{row.client.phone}
                          </a>
                        )}
                      </td>

                      <td className="px-4 py-3" style={{ width: 200, maxWidth: 200 }}>
                        <div style={{ maxWidth: 200 }}>
                          <span
                            className="block text-sm text-foreground truncate"
                            title={row.services.map((s) => s.title).join(', ')}
                          >
                            {row.services.map((s) => s.title).join(', ') || '—'}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="block text-sm text-foreground">{formatDateTime(row.followUpAt)}</span>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium mt-0.5 ${bucketStyle.bg} ${bucketStyle.text}`}>
                          {BUCKET_LABELS[row.bucket]}
                        </span>
                      </td>

                      <td className="px-4 py-3" style={{ maxWidth: 240 }}>
                        {latest ? (
                          <div style={{ maxWidth: 240 }}>
                            <span className="block text-[13px] text-foreground truncate" title={latest.note}>
                              {latest.note || OUTCOME_LABELS[latest.outcome]}
                            </span>
                            <span className="block text-[10px] text-muted-foreground">
                              {row.followUpCount} logged · last {formatDateTime(row.lastFollowUpAt)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            {row.followUpNote || 'Nothing logged yet'}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Button size="sm" onClick={() => setLogTarget(row)}>
                            <CalendarClock className="w-3.5 h-3.5" />
                            Log / Reschedule
                          </Button>
                          <button
                            type="button"
                            onClick={() => setDetailsRow(row)}
                            title="View follow-up history"
                            aria-label={`View follow-up history for ${row.client.name}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Showing {filtered.length} of {rows.length} follow-ups
            </span>
          </div>
        )}
      </div>

      {/* ── Everything about one lead's follow-ups ─────────────────────────── */}
      <FollowUpDetailsDialog
        row={detailsRow}
        open={Boolean(detailsRow)}
        onOpenChange={(open) => !open && setDetailsRow(null)}
        onLog={(row) => setLogTarget(row)}
      />

      {/* ── Log / reschedule ───────────────────────────────────────────────── */}
      <LogFollowUpDialog
        leadId={logTarget?.leadId ?? null}
        clientName={logTarget?.client.name}
        currentFollowUpAt={logTarget?.followUpAt}
        open={Boolean(logTarget)}
        onOpenChange={(open) => !open && setLogTarget(null)}
      />
    </div>
  );
};

export default FollowUpsPage;
