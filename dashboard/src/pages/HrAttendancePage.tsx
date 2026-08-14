import { useState } from "react";
import GenericPage from "@/components/GenericPage";
import {
  Calendar, Search, User, Clock, CheckCircle2, XCircle,
  AlertCircle, Edit, Trash2, History, Users, Timer, ShieldAlert, AlertTriangle
} from "lucide-react";
import {
  useAttendanceByDate,
  useOverrideAttendance,
  useDeleteAttendance,
  useApproveEarlyPunchOut,
  useApproveHalfDay,
  AttendanceRecord
} from "@/hooks/useAttendance";
import { useTeam } from "@/hooks/useTeam";
import { useAuth } from "@/context/AuthContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";



type Tab = "all" | "pending";

const HrAttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Partial<AttendanceRecord> | null>(null);

  // Lock background scroll while the Manual Override modal is open.
  useBodyScrollLock(isOverrideModalOpen);

  const { data: employees = [] } = useTeam();
  const { data: attendanceList = [], isLoading } = useAttendanceByDate(selectedDate);
  const overrideMutation = useOverrideAttendance();
  const deleteMutation = useDeleteAttendance();
  const approveMutation = useApproveEarlyPunchOut();
  const approveHalfDayMutation = useApproveHalfDay();

  const [deleteId, setDeleteId] = useState<string | null>(null);


  const { user: currentUser } = useAuth();

  // Unified Filtering Logic:
  // - Admin sees everyone.
  // - HR staff only see non-HR staff records.
  const visibleRecords = attendanceList.filter((r) => {
    if (currentUser?.role === "admin") return true;
    const u = r.userId as any;
    return u?.departmentRole !== "hr";
  });

  const pendingRequests = visibleRecords.filter(r => r.earlyPunchOutStatus === "pending" || r.halfDayStatus === "pending");
  
  // Specifically track if there are HR requests that only Admin can see (for the alert banner)
  const hrPendingRequests = attendanceList.filter(r => 
    (r.earlyPunchOutStatus === "pending" || r.halfDayStatus === "pending") && (r.userId as any)?.departmentRole === "hr"
  );


  const filtered = (activeTab === "pending" ? pendingRequests : visibleRecords).filter((record) => {
    const user = record.userId as any;
    const fullName = `${user?.name || ""} ${user?.lastName || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const stats = {
    present: visibleRecords.filter(r => r.status === "present" || r.status === "half-day").length,
    absent: visibleRecords.filter(r => r.status === "absent").length,
    totalHours: Math.round(visibleRecords.reduce((acc, r) => acc + (r.totalHours || 0), 0) * 10) / 10,
    pending: pendingRequests.length,
    hrPending: hrPendingRequests.length,
  };


  const handleDelete = async () => {
    if (!deleteId) return;
    const t = toast.loading("Deleting...");
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Record deleted", { id: t });
      setDeleteId(null);
    } catch (err: any) { toast.error(err.message, { id: t }); }
  };


  const handleApproval = async (id: string, status: "approved" | "rejected") => {
    const t = toast.loading(`${status === "approved" ? "Approving" : "Rejecting"}...`);
    try {
      await approveMutation.mutateAsync({ id, status });
      toast.success(`Request ${status}`, { id: t });
    } catch (err: any) { toast.error(err.message, { id: t }); }
  };

  const handleHalfDayApproval = async (id: string, status: "approved" | "rejected") => {
    const t = toast.loading(`${status === "approved" ? "Approving" : "Rejecting"}...`);
    try {
      await approveHalfDayMutation.mutateAsync({ id, status });
      toast.success(`Request ${status}`, { id: t });
    } catch (err: any) { toast.error(err.message, { id: t }); }
  };

  const openOverride = (record?: AttendanceRecord) => {
    setEditingRecord(record || { date: selectedDate });
    setIsOverrideModalOpen(true);
  };

  const handleOverrideSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const userId = fd.get("userId");
    if (!userId) { toast.error("Select an employee"); return; }

    const date = fd.get("date") as string;
    const status = fd.get("status") as string;
    const punchIn = fd.get("punchIn") as string;
    const punchOut = fd.get("punchOut") as string;

    const todayISO = new Date().toLocaleDateString("en-CA");
    if (date > todayISO) { toast.error("Date cannot be in the future"); return; }

    if (status === "present" || status === "half-day") {
      if (!punchIn || !punchOut) { toast.error("Punch In and Punch Out are required"); return; }
      if (punchOut <= punchIn) { toast.error("Punch Out must be after Punch In"); return; }
    }

    const t = toast.loading("Saving...");
    try {
        await overrideMutation.mutateAsync({
        userId,
        date,
        punchIn: punchIn ? new Date(`${date}T${punchIn}`).toISOString() : undefined,
        punchOut: punchOut ? new Date(`${date}T${punchOut}`).toISOString() : undefined,
        status,
      });
      toast.success("Updated", { id: t });
      setIsOverrideModalOpen(false);
    } catch (err: any) { toast.error(err.message, { id: t }); }
  };

  const statusColor = (s: string) =>
    s === "present" ? "bg-green-100 text-green-700" :
    s === "half-day" ? "bg-amber-100 text-amber-700" :
    s === "on-leave" ? "bg-blue-100 text-blue-700" :
    "bg-red-100 text-red-700";

  return (
    <GenericPage title="Attendance Management" subtitle="Monitor and manage team attendance records and early exit requests.">
      {/* HR Pending Alert Banner — Only for Admins */}
      {currentUser?.role === "admin" && stats.hrPending > 0 && (
        <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">
              {stats.hrPending} HR staff {stats.hrPending === 1 ? "member has" : "members have"} a pending early exit request
            </p>
            <p className="text-xs text-amber-600">Only you (Admin) can approve HR early punch-outs.</p>
          </div>
          <button onClick={() => setActiveTab("pending")} className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 transition-colors">
            Review
          </button>
        </div>
      )}

      {/* KPI Row */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Present Today", value: stats.present, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Absent", value: stats.absent, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Total Hours", value: `${stats.totalHours}h`, icon: Timer, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending Approvals", value: stats.pending, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border border-border p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${bg} ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-foreground">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tabs */}
          <div className="flex bg-muted rounded-lg p-1 gap-1">
            {[
              { key: "all", label: "All Staff" },
              { key: "pending", label: `Pending Approvals ${stats.pending > 0 ? `(${stats.pending})` : ""}` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as Tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === key ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search staff..."
              className="h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/20 outline-none w-48"
            />
          </div>
          {/* Date picker */}
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 h-9 bg-background">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="date"
              className="bg-transparent text-sm outline-none"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={() => openOverride()}
          className="h-9 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />Manual Override
        </button>
      </div>

      {/* Table */}
      <div className="kpi-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/5">
                {["Employee", "Status", "Punch In / Out", "Total Hours", "Requests", "Actions"].map(h => (
                  <th key={h} className="text-left py-4 px-4 text-[11px] font-bold uppercase text-muted-foreground tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr><td colSpan={7} className="py-20 text-center text-muted-foreground italic">Loading attendance...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-muted-foreground">
                    <History className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p>{activeTab === "pending" ? "No pending approval requests." : "No records for this date."}</p>
                  </td>
                </tr>
              ) : filtered.map(record => {
                const user = record.userId as any;
                const profile = (record as any).employeeProfileId as any;
                return (
                  <tr key={record._id} className="hover:bg-muted/20 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                          {(user?.name || "?")[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{user?.name} {user?.lastName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">
                            {profile?.employeeId || "—"} · {profile?.designation || user?.departmentRole || "Staff"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>In: {record.punchIn ? new Date(record.punchIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                        <span>Out: {record.punchOut ? new Date(record.punchOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-bold ${(record.totalHours || 0) >= 8 ? "text-green-600" : record.punchOut ? "text-amber-600" : "text-foreground"}`}>
                        {record.totalHours ? `${record.totalHours}h` : "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      {record.earlyPunchOutStatus === "pending" ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 text-amber-600">
                            <AlertCircle className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">
                              {(record.userId as any)?.departmentRole === "hr" ? "HR Early Exit (Admin Only)" : "Pending Early Exit"}
                            </span>
                          </div>
                          {record.earlyPunchOutReason && (
                            <p className="text-[10px] text-muted-foreground italic line-clamp-2">"{record.earlyPunchOutReason}"</p>
                          )}
                          
                          {(currentUser?.role === "admin" || (currentUser?.departmentRole === "hr" && (record.userId as any)?.departmentRole !== "hr")) && (
                            <div className="flex gap-1.5 mt-1">
                              <button
                                onClick={() => handleApproval(record._id, "approved")}
                                className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-black hover:bg-green-200 transition-colors"
                              >✓ Approve</button>
                              <button
                                onClick={() => handleApproval(record._id, "rejected")}
                                className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-black hover:bg-red-200 transition-colors"
                              >✗ Reject</button>
                            </div>
                          )}
                        </div>

                      ) : record.halfDayStatus === "pending" ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 text-amber-600">
                            <AlertCircle className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">
                              {(record.userId as any)?.departmentRole === "hr" ? "HR Half-Day (Admin Only)" : "Pending Half-Day"}
                            </span>
                          </div>
                          {record.halfDayReason && (
                            <p className="text-[10px] text-muted-foreground italic line-clamp-2">"{record.halfDayReason}"</p>
                          )}
                          
                          {(currentUser?.role === "admin" || (currentUser?.departmentRole === "hr" && (record.userId as any)?.departmentRole !== "hr")) && (
                            <div className="flex gap-1.5 mt-1">
                              <button
                                onClick={() => handleHalfDayApproval(record._id, "approved")}
                                className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-black hover:bg-green-200 transition-colors"
                              >✓ Approve</button>
                              <button
                                onClick={() => handleHalfDayApproval(record._id, "rejected")}
                                className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-black hover:bg-red-200 transition-colors"
                              >✗ Reject</button>
                            </div>
                          )}
                        </div>

                      ) : record.earlyPunchOutStatus === "approved" || record.halfDayStatus === "approved" ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">Approved</span>
                        </div>
                      ) : record.earlyPunchOutStatus === "rejected" || record.halfDayStatus === "rejected" ? (
                        <div className="flex items-center gap-1 text-red-500">
                          <XCircle className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">Rejected</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openOverride(record)} className="text-muted-foreground hover:text-primary" title="Override">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(record._id)} className="text-muted-foreground hover:text-red-600" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Modal */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-bold">Manual Override</h2>
              <button onClick={() => setIsOverrideModalOpen(false)} className="text-muted-foreground hover:text-foreground text-xl">×</button>
            </div>
            <form onSubmit={handleOverrideSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Employee</label>
                <select name="userId" required defaultValue={editingRecord?.userId?._id || ""} disabled={!!(editingRecord?.userId)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none">
                  <option value="">Choose Employee</option>
                  {employees.filter(e => e.userId).map(e => (
                    <option key={e._id} value={e.userId._id}>{e.userId.name} {e.userId.lastName} ({e.employeeId})</option>
                  ))}
                </select>
                {editingRecord?.userId && <input type="hidden" name="userId" value={editingRecord.userId._id} />}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Date</label>
                <input name="date" type="date" required defaultValue={editingRecord?.date || selectedDate}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Punch In</label>
                  <input name="punchIn" type="time"
                    defaultValue={editingRecord?.punchIn ? new Date(editingRecord.punchIn).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }) : ""}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Punch Out</label>
                  <input name="punchOut" type="time"
                    defaultValue={editingRecord?.punchOut ? new Date(editingRecord.punchOut).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" }) : ""}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
                <select name="status" defaultValue={editingRecord?.status || "present"}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none">
                  {["present", "half-day", "absent", "on-leave"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsOverrideModalOpen(false)}
                  className="flex-1 h-10 border border-border rounded-xl text-sm font-bold hover:bg-muted">Cancel</button>
                <button type="submit" disabled={overrideMutation.isPending}
                  className="flex-1 h-10 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50">
                  {overrideMutation.isPending ? "Saving..." : "Apply Override"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl max-w-md border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">Delete record?</AlertDialogTitle>
            <AlertDialogDescription className="text-[14px]">
              Are you sure you want to delete this attendance record? This action will remove the entry from the system and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-none bg-muted hover:bg-muted/80">Keep Record</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </GenericPage>

  );
};

export default HrAttendancePage;
