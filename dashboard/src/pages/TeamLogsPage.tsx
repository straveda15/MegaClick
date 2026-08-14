import { useMemo, useState } from "react";
import GenericPage from "@/components/GenericPage";
import { useAuth } from "@/context/AuthContext";
import { useTeamWorkLogs, WorkLog } from "@/hooks/useWorkLogs";
import { useTeam } from "@/hooks/useTeam";
import { useUsers } from "@/hooks/useUsers";
import { format } from "date-fns";
import { ClipboardList, Sparkles, PenLine, ShieldAlert, Users, X, CalendarDays } from "lucide-react";
import { groupByDay, CATEGORY_META, LogTiming } from "@/components/tasks/WorkLogsPanel";

function personName(user: WorkLog["user"]): string {
  if (!user || typeof user === "string") return "Unknown";
  return [user.name, user.lastName].filter(Boolean).join(" ") || user.email || "Unknown";
}

export default function TeamLogsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [userId, setUserId] = useState("");

  const { data: team = [] } = useTeam();
  // Founders/co-founders are seeded as plain `role: "admin"` accounts with no
  // EmployeeProfile record, so they're invisible to /api/v1/team. Fetch admin
  // users directly and merge in whichever ones aren't already covered by a
  // team profile, so they show up as selectable targets in the dropdown.
  const { data: adminUsers = [] } = useUsers("admin");
  const { data: logs = [], isLoading, isError, error } = useTeamWorkLogs(
    { start: start || undefined, end: end || undefined, userId: userId || undefined },
    { enabled: isAdmin }
  );

  const staffOptions = useMemo(() => {
    const inTeam = new Set(team.filter((emp: any) => emp.userId?._id).map((emp: any) => String(emp.userId._id)));
    const founderProfiles = adminUsers
      .filter((au: any) => au._id && au.isActive !== false && !inTeam.has(String(au._id)))
      .map((au: any) => ({ userId: au, designation: "Founder / Admin" }));
    return [...team.filter((emp: any) => emp.userId?._id), ...founderProfiles];
  }, [team, adminUsers]);

  const grouped = useMemo(() => groupByDay(logs), [logs]);
  const hasFilters = !!(start || end || userId);
  const clearFilters = () => { setStart(""); setEnd(""); setUserId(""); };

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
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 pb-4 border-b border-border">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Staff member</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary min-w-[180px]"
          >
            <option value="">All staff</option>
            {staffOptions.map((emp: any) => (
              <option key={emp.userId._id} value={emp.userId._id}>
                {[emp.userId.name, emp.userId.lastName].filter(Boolean).join(" ")}
                {emp.designation ? ` — ${emp.designation}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">From</label>
          <input
            type="date"
            value={start}
            max={end || undefined}
            onChange={(e) => setStart(e.target.value)}
            className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">To</label>
          <input
            type="date"
            value={end}
            min={start || undefined}
            onChange={(e) => setEnd(e.target.value)}
            className="h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 h-9 px-3 rounded-md border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          {logs.length} log{logs.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Day-wise list */}
      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
            <ShieldAlert className="w-10 h-10 opacity-30" />
            <p className="text-sm font-medium">Couldn't load team logs</p>
            <p className="text-xs">{(error as Error)?.message}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground kpi-card">
            <ClipboardList className="w-12 h-12 opacity-25" />
            <p className="text-sm font-medium">No logs found</p>
            <p className="text-xs">
              {hasFilters ? "Try widening the filters." : "Logs appear as staff complete tasks or add entries."}
            </p>
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
                    const name = personName(log.user);
                    const initials = name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
                    return (
                      <div key={log._id} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card">
                        <div className="flex flex-col items-center pt-0.5 shrink-0 w-14">
                          <span className="text-xs font-bold text-foreground">{format(new Date(log.loggedAt), "h:mm")}</span>
                          <span className="text-[9px] font-medium uppercase text-muted-foreground">{format(new Date(log.loggedAt), "a")}</span>
                        </div>
                        <div className="w-px self-stretch bg-border" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center">
                                {initials || "?"}
                              </span>
                              <span className="text-xs font-semibold text-foreground truncate">{name}</span>
                            </div>
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
                          <p className="text-sm text-foreground leading-snug mt-1">{log.activity}</p>
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
    </GenericPage>
  );
}
