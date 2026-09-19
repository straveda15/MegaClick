import { useEffect, useMemo, useState } from 'react';
import { Search, UserRound } from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

/** One line in a KPI popup: the thing itself, and who it is with. */
export interface KpiRow {
  id: string;
  title: string;
  subtitle?: string;
  /** Who is responsible. Empty means nobody yet. */
  assignees: string[];
  badge?: { label: string; cls: string };
  /** Small labelled facts under the title — due date, priority, and so on. */
  meta?: Array<{ label: string; value: string; warn?: boolean }>;
}

const UNASSIGNED = 'Unassigned';

const initialsOf = (name: string) =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';

interface KpiDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** e.g. "Everything still open across the team." */
  description: string;
  rows: KpiRow[];
  emptyText: string;
  /** Column heading for the responsible person — "Assigned to" by default. */
  assigneeLabel?: string;
}

/**
 * The popup behind a dashboard KPI card: every item the number is counting,
 * with who it is assigned to. A search box and a chip per person narrow it down
 * for when the list is long.
 */
export function KpiDetailsDialog({
  open, onOpenChange, title, description, rows, emptyText, assigneeLabel = 'Assigned to',
}: KpiDetailsDialogProps) {
  const [query, setQuery] = useState('');
  const [person, setPerson] = useState<string | null>(null);

  // Every opening starts unfiltered; the dialog stays mounted between cards.
  useEffect(() => {
    if (open) {
      setQuery('');
      setPerson(null);
    }
  }, [open, title]);

  // Who has how much of this list — one chip per person, busiest first.
  const people = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of rows) {
      const names = row.assignees.length > 0 ? row.assignees : [UNASSIGNED];
      for (const name of names) counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const names = row.assignees.length > 0 ? row.assignees : [UNASSIGNED];
      if (person && !names.includes(person)) return false;
      if (!q) return true;
      return row.title.toLowerCase().includes(q)
        || (row.subtitle ?? '').toLowerCase().includes(q)
        || names.some((name) => name.toLowerCase().includes(q));
    });
  }, [rows, query, person]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden flex flex-col max-h-[88vh]">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border shrink-0 pr-12">
          <DialogTitle className="flex items-baseline gap-2">
            {title}
            <span className="text-sm font-medium text-muted-foreground">{rows.length}</span>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>

          {rows.length > 0 && (
            <div className="pt-2 space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, service or person…"
                  className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              {people.length > 1 && (
                <div className="flex flex-wrap gap-1.5">
                  {people.map(([name, count]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setPerson((current) => (current === name ? null : name))}
                      aria-pressed={person === name}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] transition-colors ${
                        person === name
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
                      }`}
                    >
                      {name}
                      <span className="font-semibold">{count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">{emptyText}</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">Nothing matches that search.</p>
          ) : (
            <ul className="space-y-2.5">
              {visible.map((row) => (
                <li key={row.id} className="rounded-lg border border-border bg-card px-4 py-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground break-words">{row.title}</p>
                      {row.subtitle && (
                        <p className="text-xs text-muted-foreground mt-0.5 break-words">{row.subtitle}</p>
                      )}
                    </div>
                    {row.badge && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0 ${row.badge.cls}`}>
                        {row.badge.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-x-4 gap-y-2 flex-wrap mt-2.5 pt-2.5 border-t border-border">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        row.assignees.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'}`}>
                        {row.assignees.length > 0 ? initialsOf(row.assignees[0]) : <UserRound className="w-3 h-3" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground leading-none">
                          {assigneeLabel}
                        </p>
                        <p className={`text-[12.5px] mt-0.5 break-words ${row.assignees.length > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {row.assignees.length > 0 ? row.assignees.join(', ') : UNASSIGNED}
                        </p>
                      </div>
                    </div>

                    {row.meta && row.meta.length > 0 && (
                      <div className="flex items-center gap-x-4 gap-y-1 flex-wrap">
                        {row.meta.map((item) => (
                          <div key={item.label}>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground leading-none">
                              {item.label}
                            </p>
                            <p className={`text-[12.5px] mt-0.5 ${item.warn ? 'text-red-600 font-medium' : 'text-foreground'}`}>
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default KpiDetailsDialog;
