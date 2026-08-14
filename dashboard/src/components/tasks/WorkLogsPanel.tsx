import { useMemo, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";
import {
  ClipboardList, Plus, Clock, Sparkles, PenLine, CalendarDays, X, ArrowRight,
} from "lucide-react";
import { useMyWorkLogs, useCreateWorkLog, WorkLog, WorkLogCategory } from "@/hooks/useWorkLogs";

// Format a Date as the local string a <input type="datetime-local"> expects.
function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fmtDuration(minutes?: number): string | null {
  if (minutes == null || isNaN(minutes)) return null;
  if (minutes === 0) return "0m";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function dayHeading(iso: string): string {
  const d = new Date(iso);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "EEEE, MMM d, yyyy");
}

export const CATEGORY_META: Record<WorkLogCategory, { label: string; cls: string }> = {
  task:       { label: "Task",       cls: "bg-slate-100 text-slate-600 border-slate-200" },
  lead:       { label: "Lead",       cls: "bg-purple-50 text-purple-600 border-purple-200" },
  production: { label: "Production", cls: "bg-amber-50 text-amber-600 border-amber-200" },
  dispatch:   { label: "Dispatch",   cls: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  warehouse:  { label: "Warehouse",  cls: "bg-orange-50 text-orange-600 border-orange-200" },
  packaging:  { label: "Packaging",  cls: "bg-teal-50 text-teal-600 border-teal-200" },
  order:      { label: "Order",      cls: "bg-blue-50 text-blue-600 border-blue-200" },
  return:     { label: "Return",     cls: "bg-rose-50 text-rose-600 border-rose-200" },
  manual:     { label: "Manual",     cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  other:      { label: "Activity",   cls: "bg-slate-100 text-slate-600 border-slate-200" },
};

// Group logs (already sorted newest-first) into day buckets, preserving order.
export function groupByDay(logs: WorkLog[]): { key: string; label: string; logs: WorkLog[] }[] {
  const buckets: { key: string; label: string; logs: WorkLog[] }[] = [];
  const byKey = new Map<string, { key: string; label: string; logs: WorkLog[] }>();
  for (const log of logs) {
    const key = format(new Date(log.loggedAt), "yyyy-MM-dd");
    let bucket = byKey.get(key);
    if (!bucket) {
      bucket = { key, label: dayHeading(log.loggedAt), logs: [] };
      byKey.set(key, bucket);
      buckets.push(bucket);
    }
    bucket.logs.push(log);
  }
  return buckets;
}

/** Renders a "started → ended (duration)" line, or a single stamp for point events. */
export function LogTiming({ log }: { log: WorkLog }) {
  const dur = fmtDuration(log.timeSpentMinutes);
  if (log.startedAt && log.endedAt) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1 flex-wrap">
        <Clock className="w-3 h-3" />
        <span>Started {format(new Date(log.startedAt), "h:mm a")}</span>
        <ArrowRight className="w-3 h-3" />
        <span>Ended {format(new Date(log.endedAt), "h:mm a")}</span>
        {dur && <span className="font-medium text-foreground">· {dur}</span>}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
      <Clock className="w-3 h-3" /> {format(new Date(log.loggedAt), "h:mm a")}
      {dur && <span className="font-medium text-foreground">· {dur}</span>}
    </span>
  );
}

/**
 * WorkLogsPanel — the personal "Logs" fragment shown on a staff member's Tasks
 * page. Lists their activity day-wise (auto entries from completed tasks, leads
 * worked, returns closed, etc. + anything they log manually) and lets them add
 * a manual entry with an explicit start/end window.
 */
export function WorkLogsPanel() {
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const { data: logs = [], isLoading } = useMyWorkLogs({
    start: filterStart || undefined,
    end: filterEnd || undefined,
  });
  const createLog = useCreateWorkLog();

  const [showAdd, setShowAdd] = useState(false);
  const [activity, setActivity] = useState("");
  const [startedAt, setStartedAt] = useState(() => toLocalInput(new Date()));
  const [endedAt, setEndedAt] = useState(() => toLocalInput(new Date()));
  const [note, setNote] = useState("");

  const grouped = useMemo(() => groupByDay(logs), [logs]);
  const hasDateFilters = !!(filterStart || filterEnd);
  const clearDateFilters = () => { setFilterStart(""); setFilterEnd(""); };

  const resetForm = () => {
    setActivity("");
    setStartedAt(toLocalInput(new Date()));
    setEndedAt(toLocalInput(new Date()));
    setNote("");
  };

  const handleAdd = async () => {
    const text = activity.trim();
    if (!text) return toast.error("Describe what you did");
    if (startedAt && endedAt && new Date(endedAt) < new Date(startedAt)) {
      return toast.error("End time can't be before start time");
    }
    try {
      await createLog.mutateAsync({
        activity: text,
        startedAt: startedAt ? new Date(startedAt).toISOString() : undefined,
        endedAt: endedAt ? new Date(endedAt).toISOString() : undefined,
        note: note.trim() || undefined,
      });
      toast.success("Log added");
      resetForm();
      setShowAdd(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to add log");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ClipboardList className="w-4 h-4" />
          <span>Your work log — tasks, leads, returns &amp; workflow steps appear here automatically, plus anything you add.</span>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-2 h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdd ? "Close" : "Add Log"}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 animate-in fade-in slide-in-from-top-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <PenLine className="w-3.5 h-3.5" /> New Log Entry
          </p>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">What did you do?</label>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="e.g. Packed 40 orders, called 5 leads…"
              className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Started</label>
              <input
                type="datetime-local"
                value={startedAt}
                max={toLocalInput(new Date())}
                onChange={(e) => setStartedAt(e.target.value)}
                className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ended</label>
              <input
                type="datetime-local"
                value={endedAt}
                min={startedAt || undefined}
                max={toLocalInput(new Date())}
                onChange={(e) => setEndedAt(e.target.value)}
                className="mt-1 w-full h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any extra detail…"
              className="mt-1 w-full p-2.5 rounded-md border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary resize-none h-16"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { resetForm(); setShowAdd(false); }}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={createLog.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {createLog.isPending ? "Saving…" : "Save Log"}
            </button>
          </div>
        </div>
      )}

      {/* Date filter */}
      <div className="flex flex-wrap items-end gap-3 pb-4 border-b border-border">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">From</label>
          <input
            type="date"
            value={filterStart}
            max={filterEnd || undefined}
            onChange={(e) => setFilterStart(e.target.value)}
            className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">To</label>
          <input
            type="date"
            value={filterEnd}
            min={filterStart || undefined}
            onChange={(e) => setFilterEnd(e.target.value)}
            className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        {hasDateFilters && (
          <button
            onClick={clearDateFilters}
            className="flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Day-wise list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground kpi-card">
          <ClipboardList className="w-12 h-12 opacity-25" />
          <p className="text-sm font-medium">No logs yet</p>
          <p className="text-xs">Complete a task, work a lead, or add a log to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((day) => (
            <div key={day.key} className="space-y-2">
              <div className="flex items-center gap-2 sticky top-0 bg-background/95 backdrop-blur py-1 z-[1]">
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{day.label}</h3>
                <span className="text-[10px] text-muted-foreground">({day.logs.length})</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-2">
                {day.logs.map((log) => {
                  const cat = CATEGORY_META[log.category] ?? CATEGORY_META.other;
                  return (
                    <div key={log._id} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card">
                      <div className="flex flex-col items-center pt-0.5 shrink-0 w-14">
                        <span className="text-xs font-bold text-foreground">{format(new Date(log.loggedAt), "h:mm")}</span>
                        <span className="text-[9px] font-medium uppercase text-muted-foreground">{format(new Date(log.loggedAt), "a")}</span>
                      </div>
                      <div className="w-px self-stretch bg-border" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground leading-snug">{log.activity}</p>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <span className={`inline-flex items-center text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${cat.cls}`}>
                              {cat.label}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                                log.source === "auto"
                                  ? "bg-blue-50 text-blue-600 border-blue-200"
                                  : "bg-emerald-50 text-emerald-600 border-emerald-200"
                              }`}
                            >
                              {log.source === "auto" ? <Sparkles className="w-2.5 h-2.5" /> : <PenLine className="w-2.5 h-2.5" />}
                              {log.source === "auto" ? "Auto" : "Manual"}
                            </span>
                          </div>
                        </div>
                        {log.note && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{log.note}</p>}
                        <LogTiming log={log} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkLogsPanel;
