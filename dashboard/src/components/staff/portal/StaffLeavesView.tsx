import { useState } from "react";
import { useMyLeaves, useMyLeaveBalance, useApplyLeaveSelf, useCancelMyLeave } from "@/hooks/useLeave";
import { format, differenceInDays } from "date-fns";
import { Plus, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
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

const FILTERS = ["All", "Pending", "Approved", "Rejected"] as const;

// Parse a yyyy-MM-dd / ISO string as a LOCAL calendar date (avoids the UTC
// off-by-one that `new Date("2026-07-05")` causes in negative-offset zones).
const toLocalDate = (s: string) => {
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
};

interface Props {
  // Optional — when rendered inside the staff portal a back button is shown.
  // On the standalone /leaves page it's omitted and the page provides the title.
  onBack?: () => void;
}

export function StaffLeavesView({ onBack }: Props) {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [showApply, setShowApply] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);

  // Controlled apply-leave form state
  const [leaveType, setLeaveType] = useState("earned");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  // A half day covers one date only, so picking it collapses the range.
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDaySession, setHalfDaySession] = useState<"first_half" | "second_half">("first_half");

  const { data: leaves = [], isLoading: loadingLeaves } = useMyLeaves();
  const { data: balance } = useMyLeaveBalance();
  const applyMutation = useApplyLeaveSelf();
  const cancelMutation = useCancelMyLeave();

  const filtered = leaves.filter((l) =>
    filter === "All" ? true : l.status === filter.toLowerCase()
  );

  const todayISO = new Date().toLocaleDateString("en-CA");

  const LEAVE_TYPE_LABELS: Record<string, string> = {
    earned: "earned leave",
    sick: "sick leave",
    casual: "casual leave",
    unpaid: "unpaid leave",
  };

  // Remaining balance for the selected leave type. `null` means unlimited (e.g. unpaid).
  const remainingForType = (() => {
    if (leaveType === "unpaid" || !balance) return null;
    const b = (balance as any)[leaveType];
    if (!b) return null;
    return Math.max((b.total ?? 0) - (b.used ?? 0), 0);
  })();

  // Dates already covered by an active (pending/approved) leave — highlighted
  // and blocked in the calendar so the user can't apply over an existing leave.
  const bookedRanges = leaves
    .filter((l) => l.status === "pending" || l.status === "approved")
    .filter((l) => l.fromDate && l.toDate)
    .map((l) => ({ from: toLocalDate(l.fromDate), to: toLocalDate(l.toDate) }));

  const today = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();

  const selectedRange: DateRange | undefined = fromDate
    ? { from: toLocalDate(fromDate), to: toDate ? toLocalDate(toDate) : undefined }
    : undefined;

  // Past dates and any booked ranges are non-selectable. `excludeDisabled` on the
  // calendar resets the range if a user tries to drag across a blocked date.
  const disabledDays = [{ before: today }, ...bookedRanges];

  /** Half day is one date — selecting a range in that mode keeps only the start. */
  const handleHalfDayToggle = (next: boolean) => {
    setIsHalfDay(next);
    if (next && fromDate) setToDate(fromDate);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (isHalfDay && range?.from) {
      const day = format(range.from, "yyyy-MM-dd");
      setFromDate(day);
      setToDate(day);
      return;
    }
    if (!range || !range.from) {
      setFromDate("");
      setToDate("");
      return;
    }
    // Cap the selected span at the remaining balance for the chosen type.
    if (range.from && range.to && remainingForType !== null) {
      const selectedDays = differenceInDays(range.to, range.from) + 1;
      if (remainingForType === 0) {
        toast.error(`No ${LEAVE_TYPE_LABELS[leaveType]} remaining`);
        return;
      }
      if (selectedDays > remainingForType) {
        toast.error(`Only ${remainingForType} day${remainingForType !== 1 ? "s" : ""} of ${LEAVE_TYPE_LABELS[leaveType]} remaining`);
        return;
      }
    }
    setFromDate(format(range.from, "yyyy-MM-dd"));
    setToDate(range.to ? format(range.to, "yyyy-MM-dd") : "");
  };

  const openApply = () => {
    setLeaveType("earned");
    setFromDate("");
    setToDate("");
    setReason("");
    setShowApply(true);
  };

  const handleLeaveTypeChange = (value: string) => {
    setLeaveType(value);
    // Clear an end date that no longer fits the newly selected type's balance.
    if (value !== "unpaid" && balance && fromDate && toDate) {
      const b = (balance as any)[value];
      const remaining = b ? Math.max((b.total ?? 0) - (b.used ?? 0), 0) : null;
      if (remaining !== null) {
        const selectedDays = differenceInDays(new Date(toDate), new Date(fromDate)) + 1;
        if (selectedDays > remaining) setToDate("");
      }
    }
  };

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fromDate || !toDate) { toast.error("Please select both dates"); return; }
    if (fromDate < todayISO) { toast.error("Cannot apply leave for past dates"); return; }
    if (toDate < fromDate) { toast.error("End date must be on or after start date"); return; }

    if (remainingForType !== null) {
      const requestedDays = isHalfDay
        ? 0.5
        : differenceInDays(new Date(toDate), new Date(fromDate)) + 1;
      if (remainingForType === 0) {
        toast.error(`No ${LEAVE_TYPE_LABELS[leaveType]} remaining`);
        return;
      }
      if (requestedDays > remainingForType) {
        toast.error(`Only ${remainingForType} day${remainingForType !== 1 ? "s" : ""} of ${LEAVE_TYPE_LABELS[leaveType]} remaining`);
        return;
      }
    }

    const t = toast.loading("Submitting leave...");
    try {
      await applyMutation.mutateAsync({
        leaveType,
        fromDate,
        // A half day is a single date, whatever the calendar last held.
        toDate: isHalfDay ? fromDate : toDate,
        reason,
        isHalfDay,
        halfDaySession: isHalfDay ? halfDaySession : undefined,
      });
      toast.success("Leave request submitted!", { id: t });
      setShowApply(false);
      setIsHalfDay(false);
    } catch (err: any) {
      toast.error(err.message, { id: t });
    }
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await cancelMutation.mutateAsync(cancelId);
      toast.success("Leave cancelled");
      setCancelId(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const balanceCards = [
    { key: "earned", label: "Earned Leave", color: "blue" },
    { key: "sick", label: "Sick Leave", color: "red" },
    { key: "casual", label: "Casual Leave", color: "amber" },
  ];

  return (
    <div className="space-y-5">
      {onBack && (
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">My Leaves</h2>
        </div>
      )}

      {/* Balance cards */}
      <div className="grid grid-cols-3 gap-3">
        {balanceCards.map(({ key, label, color }) => {
          const b = balance ? (balance as any)[key] : { total: 0, used: 0 };
          const remaining = (b?.total ?? 0) - (b?.used ?? 0);
          return (
            <div key={key} className={`rounded-2xl p-4 bg-${color}-50 border border-${color}-100`}>
              <p className={`text-[10px] font-bold uppercase text-${color}-600 mb-1`}>{label}</p>
              <p className={`text-2xl font-black text-${color}-700`}>{remaining}</p>
              <div className={`mt-2 h-1 w-full bg-${color}-100 rounded-full overflow-hidden`}>
                <div
                  className={`h-full bg-${color}-400 rounded-full`}
                  style={{ width: b?.total ? `${Math.min((b.used / b.total) * 100, 100)}%` : "0%" }}
                />
              </div>
              <p className={`text-[9px] text-${color}-500 mt-1`}>{b?.used ?? 0} of {b?.total ?? 0} used</p>
            </div>
          );
        })}
      </div>

      {/* Apply button */}
      <button
        onClick={openApply}
        className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Apply for Leave
      </button>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Leave list */}
      {loadingLeaves ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">No leave records found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((leave) => {
            const days = leave.days ?? (differenceInDays(new Date(leave.toDate), new Date(leave.fromDate)) + 1);
            return (
              <div key={leave._id} className="bg-background border border-border rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        leave.leaveType === "earned" ? "bg-blue-100 text-blue-700" :
                        leave.leaveType === "sick" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {leave.leaveType}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        leave.status === "approved" ? "bg-green-100 text-green-700" :
                        leave.status === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {leave.status}
                      </span>
                      {leave.isHalfDay && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-700 uppercase">
                          Half day
                          {leave.halfDaySession === "second_half" ? " · PM" : " · AM"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold">
                      {leave.fromDate ? format(new Date(leave.fromDate), "d MMM") : "—"} – {leave.toDate ? format(new Date(leave.toDate), "d MMM yyyy") : "—"} · {days} day{days !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{leave.reason}</p>
                  </div>
                  {leave.status === "pending" && (
                    <button
                      onClick={() => setCancelId(leave._id)}
                      className="text-xs font-bold text-red-500 hover:underline shrink-0 ml-3"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply modal */}
      {showApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-bold">Apply for Leave</h3>
              <button onClick={() => setShowApply(false)} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleApply} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-1.5">Leave Type</label>
                <select
                  name="leaveType"
                  required
                  value={leaveType}
                  onChange={(e) => handleLeaveTypeChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm outline-none"
                >
                  <option value="earned">Earned Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                </select>
                {remainingForType !== null && (
                  <p className={`text-[11px] font-semibold mt-1.5 ${remainingForType === 0 ? "text-red-500" : "text-muted-foreground"}`}>
                    {remainingForType} day{remainingForType !== 1 ? "s" : ""} of {LEAVE_TYPE_LABELS[leaveType]} remaining
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block">
                    Select Dates
                  </label>
                  {fromDate && (
                    <span className="text-[11px] font-semibold text-foreground">
                      {format(toLocalDate(fromDate), "d MMM")}
                      {toDate && ` – ${format(toLocalDate(toDate), "d MMM yyyy")}`}
                      {toDate && ` · ${differenceInDays(toLocalDate(toDate), toLocalDate(fromDate)) + 1} day${
                        differenceInDays(toLocalDate(toDate), toLocalDate(fromDate)) + 1 !== 1 ? "s" : ""
                      }`}
                    </span>
                  )}
                </div>
                <div className="rounded-xl border border-border flex justify-center">
                  <Calendar
                    mode="range"
                    selected={selectedRange}
                    onSelect={handleRangeSelect}
                    disabled={disabledDays}
                    excludeDisabled
                    fromDate={today}
                    modifiers={{ booked: bookedRanges }}
                    modifiersClassNames={{ booked: "!bg-red-100 !text-red-500 line-through rounded-none" }}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
                  <span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block shrink-0" />
                  Dates already on leave are blocked and can't be selected.
                </div>
              </div>

              {/* Half day — costs 0.5 from the balance and covers one date */}
              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHalfDay}
                    onChange={(e) => handleHalfDayToggle(e.target.checked)}
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm font-semibold text-foreground">Half day</span>
                  <span className="text-[11px] text-muted-foreground">
                    Counts as 0.5 day
                  </span>
                </label>

                {isHalfDay && (
                  <div className="mt-2.5">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-1.5">
                      Which half
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { value: "first_half", label: "First half (morning)" },
                        { value: "second_half", label: "Second half (afternoon)" },
                      ] as const).map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setHalfDaySession(option.value)}
                          className={`h-9 rounded-lg text-xs font-semibold border transition-colors ${
                            halfDaySession === option.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      Pick a single date on the calendar above.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-1.5">Reason</label>
                <textarea
                  name="reason"
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-background text-sm outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowApply(false)} className="flex-1 h-10 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-colors">
                  Discard
                </button>
                <button type="submit" disabled={applyMutation.isPending} className="flex-1 h-10 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertDialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Leave Request?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove your pending leave request. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Discard</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleCancel}
            >
              Cancel Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
