import { useMemo, useState } from "react";
import GenericPage from "@/components/GenericPage";
import { useAuth } from "@/context/AuthContext";
import { useTeamWorkLogs, useCreateWorkLog, WorkLog } from "@/hooks/useWorkLogs";
import { useTeam } from "@/hooks/useTeam";
import { useUsers } from "@/hooks/useUsers";
import { format } from "date-fns";
import { toast } from "sonner";
import { ClipboardList, Loader2, Plus, ShieldAlert, Users, X } from "lucide-react";
import DateRangeFilter, { type DateRange } from "@/components/DateRangeFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { groupByDay, CATEGORY_META } from "@/components/tasks/WorkLogsPanel";

function personName(user: WorkLog["user"]): string {
  if (!user || typeof user === "string") return "Unknown";
  return [user.name, user.lastName].filter(Boolean).join(" ") || user.email || "Unknown";
}

/** yyyy-MM-dd, the shape the work-log endpoint filters on. */
const toApiDate = (date?: Date) => (date ? format(date, "yyyy-MM-dd") : undefined);

/** How long a log took, when it says. */
function duration(log: WorkLog): string | null {
  if (log.timeSpentMinutes) {
    const h = Math.floor(log.timeSpentMinutes / 60);
    const m = log.timeSpentMinutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
  if (log.startedAt && log.endedAt) {
    const mins = Math.round(
      (Number(new Date(log.endedAt)) - Number(new Date(log.startedAt))) / 60000
    );
    return mins > 0 ? `${mins}m` : null;
  }
  return null;
}

export default function TeamLogsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [range, setRange] = useState<DateRange | undefined>();
  const [userId, setUserId] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [activity, setActivity] = useState("");
  const [note, setNote] = useState("");

  const { data: team = [] } = useTeam();
  // Founders/co-founders are seeded as plain `role: "admin"` accounts with no
  // EmployeeProfile record, so they're invisible to /api/v1/team. Fetch admin
  // users directly and merge in whichever ones aren't already covered by a
  // team profile, so they show up as selectable targets in the dropdown.
  const { data: adminUsers = [] } = useUsers("admin");
  const { data: logs = [], isLoading, isError, error } = useTeamWorkLogs(
    {
      start: toApiDate(range?.from),
      end: toApiDate(range?.to ?? range?.from),
      userId: userId || undefined,
    },
    { enabled: isAdmin }
  );

  const createLog = useCreateWorkLog();

  const staffOptions = useMemo(() => {
    const inTeam = new Set(team.filter((emp: any) => emp.userId?._id).map((emp: any) => String(emp.userId._id)));
    const founderProfiles = adminUsers
      .filter((au: any) => au._id && au.isActive !== false && !inTeam.has(String(au._id)))
      .map((au: any) => ({ userId: au, designation: "Founder / Admin" }));
    return [...team.filter((emp: any) => emp.userId?._id), ...founderProfiles];
  }, [team, adminUsers]);

  const grouped = useMemo(() => groupByDay(logs), [logs]);
  const hasFilters = Boolean(range?.from || userId);
  const clearFilters = () => { setRange(undefined); setUserId(""); };

  const handleAdd = async () => {
    if (!activity.trim()) {
      toast.error("Say what was done.");
      return;
    }

    try {
      await createLog.mutateAsync({ activity: activity.trim(), note: note.trim() || undefined });
      toast.success("Log added.");
      setActivity("");
      setNote("");
      setShowAdd(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add the log.");
    }
  };

  // Route can be reached by non-admins via the /tasks prefix — hard-gate here.
  if (!isAdmin) {
    return (
      <GenericPage title="Team Logs" subtitle="Every staff member's activity, date & time wise">
        <div className="flex flex-col items-center justify-center min-h-[40vh] px-6 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h2 className="text-lg font-semibold text-foreground">Admins only</h2>
            <p className="text-sm text-muted-foreground">Team Logs is available to founders and co-founders only.</p>
          </div>
        </div>
      </GenericPage>
    );
  }

  return (
    <GenericPage title="Team Logs" subtitle="Every staff member's activity, date & time wise">
      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-border">
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="h-9 px-3 rounded-md border border-border bg-card text-sm outline-none focus:ring-1 focus:ring-ring min-w-[180px]"
        >
          <option value="">All staff</option>
          {staffOptions.map((emp: any) => (
            <option key={emp.userId._id} value={emp.userId._id}>
              {[emp.userId.name, emp.userId.lastName].filter(Boolean).join(" ")}
              {emp.designation ? ` — ${emp.designation}` : ""}
            </option>
          ))}
        </select>

        <DateRangeFilter value={range} onChange={setRange} label="Filter by date" />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            {logs.length} log{logs.length !== 1 ? "s" : ""}
          </span>
          <Button size="sm" variant={showAdd ? "outline" : "default"} onClick={() => setShowAdd((v) => !v)}>
            {showAdd ? <><X className="w-4 h-4" />Close</> : <><Plus className="w-4 h-4" />Add Log</>}
          </Button>
        </div>
      </div>

      {/* ── Manual entry — logs against whoever is signed in ────────────────── */}
      {showAdd && (
        <div className="mt-4 pb-4 border-b border-border space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="log-activity">What did you do?</Label>
              <Input
                id="log-activity"
                placeholder="e.g. Called three GST clients about pending documents"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="log-note">Note (optional)</Label>
              <Input
                id="log-note"
                placeholder="Anything worth remembering"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <Button size="sm" onClick={handleAdd} disabled={createLog.isPending}>
            {createLog.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" />Adding…</>
              : <><Plus className="w-4 h-4" />Add to log</>}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Staff add their own entries from the Tasks page; work finished on a task is logged
            automatically.
          </p>
        </div>
      )}

      {/* ── Day-wise list ──────────────────────────────────────────────────── */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
            <ShieldAlert className="w-10 h-10 opacity-30" />
            <p className="text-sm font-medium">Couldn't load team logs</p>
            <p className="text-xs">{(error as Error)?.message}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
            <ClipboardList className="w-10 h-10 opacity-25" />
            <p className="text-sm font-medium">No logs found</p>
            <p className="text-xs">
              {hasFilters ? "Try widening the filters." : "Logs appear as staff complete tasks or add entries."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map((day) => (
              <div key={day.key}>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{day.label}</h3>
                  <span className="text-[10px] text-muted-foreground">({day.logs.length})</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="divide-y divide-border">
                  {day.logs.map((log) => {
                    const took = duration(log);
                    const category = CATEGORY_META[log.category] ?? CATEGORY_META.other;

                    return (
                      <div key={log._id} className="flex items-baseline gap-3 py-2">
                        <span className="text-[11px] font-mono text-muted-foreground w-16 shrink-0">
                          {format(new Date(log.loggedAt), "h:mm a")}
                        </span>
                        <span className="text-xs font-semibold text-foreground w-36 shrink-0 truncate">
                          {personName(log.user)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-snug">{log.activity}</p>
                          {log.note && (
                            <p className="text-xs text-muted-foreground leading-relaxed">{log.note}</p>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                          {category.label}
                          {took ? ` · ${took}` : ""}
                          {log.source === "manual" ? " · manual" : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GenericPage>
  );
}
