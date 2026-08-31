import { useState } from "react";
import GenericPage from "@/components/GenericPage";
import { CalendarCheck, UserCheck, XCircle, CheckCircle, Clock } from "lucide-react";
import { useTodayAttendance, useApproveEarlyPunchOut, usePendingAttendance } from "@/hooks/useAttendance";
import { useAllLeaves, useApproveLeave, useRejectLeave } from "@/hooks/useLeave";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const tabs = ["Attendance (Today)", "Leave Approvals"];

const HrLeavePage = () => {
  const [tab, setTab] = useState(0);

  const { data: attendanceList = [], isLoading: loadingAttendance } = useTodayAttendance();
  const { data: allPending = [] } = usePendingAttendance();
  const { data: leaveList = [], isLoading: loadingLeaves } = useAllLeaves();
  const { user: currentUser } = useAuth();

  const approveLeave = useApproveLeave();
  const rejectLeave = useRejectLeave();
  const approveAttendance = useApproveEarlyPunchOut();

  const otherDatePendingCount = allPending.filter(ap => 
    new Date(ap.date).toDateString() !== new Date().toDateString() && 
    (currentUser?.role === 'admin' || (ap.userId as any)?.departmentRole !== 'hr')
  ).length;

  const handleApprove = async (id: string) => {
    const t = toast.loading("Approving leave...");
    try {
      await approveLeave.mutateAsync(id);
      toast.success("Leave approved", { id: t });
    } catch (err: any) {
      toast.error(err.message, { id: t });
    }
  };

  const handleReject = async (id: string) => {
    const t = toast.loading("Rejecting leave...");
    try {
      await rejectLeave.mutateAsync({ id, rejectionReason: "Rejected by HR" });
      toast.success("Leave rejected", { id: t });
    } catch (err: any) {
      toast.error(err.message, { id: t });
    }
  };

  const handleAttendanceApproval = async (id: string, status: "approved" | "rejected") => {
    const t = toast.loading(`${status === "approved" ? "Approving" : "Rejecting"} punch-out...`);
    try {
      await approveAttendance.mutateAsync({ id, status });
      toast.success(`Punch-out ${status}`, { id: t });
    } catch (err: any) {
      toast.error(err.message, { id: t });
    }
  };

  return (
    <GenericPage>
      <div className="flex gap-1 border-b border-border mb-6">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-6 py-3 text-sm font-bold border-b-2 -mb-px transition-all ${
              tab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Global Attendance Alert */}
      {otherDatePendingCount > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-800">
                {otherDatePendingCount} pending early punch-out{otherDatePendingCount === 1 ? "" : "s"} from other dates
              </p>
              <p className="text-xs text-blue-600">These require your review to finalize previous attendance logs.</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = "/people/attendance?tab=pending"} 
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Review All
          </button>
        </div>
      )}

      {tab === 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Today's Live Attendance Dashboard</h3>
          </div>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/5">
                    {["Employee", "Status", "Punch In", "Punch Out", "Actions"].map((h) => (
                      <th key={h} className="text-left py-4 px-5 text-[11px] font-bold uppercase text-muted-foreground tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
              <tbody>
                {loadingAttendance ? (
                  <tr><td colSpan={5} className="py-10 text-center text-muted-foreground italic">Syncing daily pulses...</td></tr>
                ) : attendanceList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <UserCheck className="w-12 h-12 opacity-25" />
                        <p className="text-sm font-medium">No log-ins detected today.</p>
                      </div>
                    </td>
                  </tr>
                ) : attendanceList.map((record) => {
                  const user = record.userId;
                  return (
                    <tr key={record._id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-4 px-5 font-medium">
                        {user?.name} {user?.lastName}
                      </td>
                      <td className="py-4 px-5 capitalize">
                        <span className={`status-badge ${record.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-mono text-xs text-muted-foreground">
                        {record.punchIn ? new Date(record.punchIn).toLocaleTimeString() : "—"}
                      </td>
                      <td className="py-4 px-5 font-mono text-xs text-muted-foreground">
                        {record.punchOut ? new Date(record.punchOut).toLocaleTimeString() : "—"}
                      </td>
                      <td className="py-4 px-5">
                        {record.earlyPunchOutStatus === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleAttendanceApproval(record._id, "approved")}
                              className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors border border-green-100"
                              title="Approve Early Exit"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleAttendanceApproval(record._id, "rejected")}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors border border-red-100"
                              title="Reject Early Exit"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : record.earlyPunchOutStatus === 'approved' ? (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">APPROVED</span>
                        ) : record.earlyPunchOutStatus === 'rejected' ? (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">REJECTED</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Leave Requests Log</h3>
          </div>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/5">
                    {["Employee", "Type", "Timeframe", "Status", "Reason", "Actions"].map((h) => (
                      <th key={h} className="text-left py-4 px-5 text-[11px] font-bold uppercase text-muted-foreground tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
              <tbody>
                {loadingLeaves ? (
                  <tr><td colSpan={6} className="py-10 text-center text-muted-foreground italic">Fetching leave requests...</td></tr>
                ) : leaveList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <CalendarCheck className="w-12 h-12 opacity-25" />
                        <p className="text-sm font-medium">Clear queue!</p>
                        <p className="text-xs">No leave requests to show yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : leaveList.map((leave) => {
                  const user = leave.userId;
                  return (
                    <tr key={leave._id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-5 font-medium">
                        {user?.name} {user?.lastName}
                      </td>
                      <td className="py-3 px-5 capitalize">
                        <span className="status-badge bg-primary/10 text-primary">
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-xs">
                        <div className="text-foreground">{new Date(leave.fromDate).toLocaleDateString()}</div>
                        {/* A half day covers one date, so a "to" line would just repeat it. */}
                        {leave.isHalfDay ? (
                          <div className="text-violet-700 font-semibold">
                            Half day · {leave.halfDaySession === "second_half" ? "Afternoon" : "Morning"}
                          </div>
                        ) : (
                          <div className="text-muted-foreground">to {new Date(leave.toDate).toLocaleDateString()}</div>
                        )}
                        <div className="text-muted-foreground">
                          {leave.days} day{leave.days === 1 ? "" : "s"}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          leave.status === "approved" ? "bg-green-100 text-green-700" :
                          leave.status === "pending" ? "bg-amber-100 text-amber-700" :
                          leave.status === "cancelled" ? "bg-slate-100 text-slate-600" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-muted-foreground text-xs max-w-xs truncate">{leave.reason}</td>
                        <td className="py-4 px-5">
                          {leave.status === "pending" ? (
                            <div className="flex items-center gap-2">
                               <button
                                 onClick={() => handleApprove(leave._id)}
                                 className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                                 title="Approve"
                               >
                                 <CheckCircle className="w-5 h-5" />
                               </button>
                               <button
                                 onClick={() => handleReject(leave._id)}
                                 className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                 title="Reject"
                               >
                                 <XCircle className="w-5 h-5" />
                               </button>
                            </div>
                          ) : leave.status === "cancelled" ? (
                            <span className="text-xs font-semibold text-slate-500">
                              Leave cancelled by employee
                              {leave.cancelledAt && ` · ${new Date(leave.cancelledAt).toLocaleDateString()}`}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground capitalize">{leave.status}</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </GenericPage>
  );
};

export default HrLeavePage;
