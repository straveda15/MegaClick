import { useMemo, useState } from 'react';
import {
  CalendarClock, ChevronDown, ChevronRight, History, Loader2, Phone, RefreshCcw, Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExportMenu from '@/components/ExportMenu';
import FollowUpTimeline from '@/components/followups/FollowUpTimeline';
import LogFollowUpDialog from '@/components/followups/LogFollowUpDialog';
import {
  BUCKET_LABELS, BUCKET_STYLES, OUTCOME_LABELS, formatDateTime,
} from '@/data/followUp';
import { TEMPERATURE_LABELS, TEMPERATURE_STYLES } from '@/data/leadTemperature';
import { useFollowUps, type FollowUpBucket, type FollowUpRow } from '@/hooks/useFollowUps';
import type { LeadTemperature } from '@/hooks/useLeads';
import type { SheetColumn } from '@/lib/sheet';

/* ── Spreadsheet columns ────────────────────────────────────────────────────── */

const FOLLOW_UP_COLUMNS = [
  { key: 'reference',  header: 'Lead ID',      value: (r: FollowUpRow) => r.reference },
  { key: 'client',     header: 'Client',       value: (r: FollowUpRow) => r.client.name },
  { key: 'phone',      header: 'Phone',        value: (r: FollowUpRow) => r.client.phone },
  { key: 'services',   header: 'Services',     value: (r: FollowUpRow) => r.services.map((s) => s.title).join(', ') },
  { key: 'followUpAt', header: 'Next Follow Up', value: (r: FollowUpRow) => formatDateTime(r.followUpAt) },
  { key: 'bucket',     header: 'Due',          value: (r: FollowUpRow) => BUCKET_LABELS[r.bucket] },
  { key: 'note',       header: 'Latest Note',  value: (r: FollowUpRow) => r.history[0]?.note ?? r.followUpNote },
  { key: 'count',      header: 'Follow Ups',   value: (r: FollowUpRow) => String(r.followUpCount) },
  { key: 'owner',      header: 'Owner',        value: (r: FollowUpRow) => r.owner ?? '' },
] as const satisfies ReadonlyArray<SheetColumn<FollowUpRow> & { key: string }>;

/* ── Page ───────────────────────────────────────────────────────────────────── */

const BUCKET_ORDER: FollowUpBucket[] = ['overdue', 'today', 'this_week', 'later', 'unscheduled'];

const FollowUpsPage = () => {
  const [query, setQuery] = useState('');
  const [bucketFilter, setBucketFilter] = useState<FollowUpBucket | ''>('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [logTarget, setLogTarget] = useState<FollowUpRow | null>(null);

  const { data: rows = [], isLoading, isError, error, refetch } = useFollowUps();

  const counts = useMemo(() => {
    const tally = { overdue: 0, today: 0, this_week: 0, later: 0, unscheduled: 0 } as Record<FollowUpBucket, number>;
    rows.forEach((row) => { tally[row.bucket] += 1; });
    return tally;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchQ = !q
        || row.client.name.toLowerCase().includes(q)
        || row.client.phone.includes(q)
        || row.client.company.toLowerCase().includes(q)
        || row.reference.toLowerCase().includes(q)
        || row.services.some((s) => s.title.toLowerCase().includes(q));

      return matchQ && (!bucketFilter || row.bucket === bucketFilter);
    });
  }, [rows, query, bucketFilter]);

  const toggleRow = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const thBase =
    'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap select-none';

  return (
    <div className="space-y-5">
      {/* ── KPIs — clicking one filters the table ──────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {BUCKET_ORDER.map((bucket) => {
          const style = BUCKET_STYLES[bucket];
          const active = bucketFilter === bucket;

          return (
            <button
              key={bucket}
              type="button"
              onClick={() => setBucketFilter(active ? '' : bucket)}
              className={`bg-card border rounded-lg px-4 py-3 text-left transition-all hover:shadow-sm ${
                active ? 'border-primary ring-1 ring-primary' : 'border-border'
              }`}
            >
              <span className={`block text-[10px] font-semibold leading-tight ${style.text}`}>
                {BUCKET_LABELS[bucket]}
              </span>
              <span className="block text-2xl font-bold text-foreground leading-none mt-1">
                {counts[bucket]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
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

        {bucketFilter && (
          <Button variant="outline" size="sm" onClick={() => setBucketFilter('')}>
            Clear filter — {BUCKET_LABELS[bucketFilter]}
          </Button>
        )}

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
                <th className={thBase} style={{ width: 40 }} />
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
                <tr><td colSpan={7} className="text-center py-16 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading follow-ups…
                </td></tr>
              ) : isError ? (
                <tr><td colSpan={7} className="text-center py-16">
                  <p className="text-sm text-destructive mb-3">
                    {error instanceof Error ? error.message : 'Failed to load follow-ups.'}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCcw className="w-4 h-4" />Retry
                  </Button>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-muted-foreground text-sm">
                  {rows.length === 0
                    ? 'Nothing to follow up. Set a follow-up date on a lead and it will show here.'
                    : 'No follow-ups match your filters.'}
                </td></tr>
              ) : (
                filtered.map((row) => {
                  const isOpen = expanded.has(row._id);
                  const bucketStyle = BUCKET_STYLES[row.bucket];
                  const latest = row.history[0];

                  return [
                    <tr key={row._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleRow(row._id)}
                          title={isOpen ? 'Hide history' : 'Show follow-up history'}
                          aria-expanded={isOpen}
                          aria-label={`${isOpen ? 'Hide' : 'Show'} follow-up history for ${row.client.name}`}
                          className="inline-flex items-center justify-center w-6 h-6 rounded border border-border bg-card text-muted-foreground hover:bg-muted transition-colors"
                        >
                          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      </td>

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
                        <Button size="sm" onClick={() => setLogTarget(row)}>
                          <CalendarClock className="w-3.5 h-3.5" />
                          Log / Reschedule
                        </Button>
                      </td>
                    </tr>,

                    isOpen ? (
                      <tr key={`${row._id}-history`} className="bg-muted/20">
                        <td />
                        <td colSpan={6} className="px-4 py-4">
                          <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2.5 flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5" />
                            Follow-up history
                          </p>
                          <FollowUpTimeline
                            history={row.history}
                            nextFollowUpAt={row.followUpAt}
                            bucket={row.bucket}
                          />
                          {row.services.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {row.services.map((service) => {
                                const style = TEMPERATURE_STYLES[service.temperature as LeadTemperature]
                                  ?? TEMPERATURE_STYLES.WARM;
                                return (
                                  <span
                                    key={service._id}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${style.bg} ${style.text}`}
                                  >
                                    {service.title}
                                    <span className="opacity-70">
                                      · {TEMPERATURE_LABELS[service.temperature as LeadTemperature] ?? service.temperature}
                                    </span>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : null,
                  ];
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
