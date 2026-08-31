import { useState } from "react";
import GenericPage from "@/components/GenericPage";
import {
  Clock,
  MapPin,
  History,
  CheckCircle2,
  Play,
  Square,
  Calendar,
  Home,
  AlertCircle,
  ShieldAlert
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  useMyTodayAttendance,
  useMyAttendance,
  useSelfPunchIn,
  useSelfPunchOut
} from "@/hooks/useAttendance";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

import { format } from "date-fns";

const MyAttendancePage = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayReason, setHalfDayReason] = useState("");
  // Where today's shift is being worked from. Office punches are checked
  // against the assigned geofence; site punches have none, so the employee
  // says where they are instead; working from home has no location at all.
  const [workMode, setWorkMode] = useState<"office" | "site" | "home">("office");
  const [siteName, setSiteName] = useState("");
  const [siteLat, setSiteLat] = useState("");
  const [siteLng, setSiteLng] = useState("");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showPunchOutConfirm, setShowPunchOutConfirm] = useState(false);
  const [showEarlyReason, setShowEarlyReason] = useState(false);
  const [earlyReason, setEarlyReason] = useState("");

  const { data: todayRecord, isLoading: loadingToday } = useMyTodayAttendance();
  const { data: history, isLoading: loadingHistory } = useMyAttendance(selectedMonth);

  const punchInMutation = useSelfPunchIn();
  const punchOutMutation = useSelfPunchOut();

  /** Fills the site coordinates from the device, so nobody types them by hand. */
  const useMyLocationForSite = async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      setSiteLat(String(pos.coords.latitude));
      setSiteLng(String(pos.coords.longitude));
      toast.success("Filled in your current coordinates.");
    } catch {
      toast.error("Could not read your location. Enter the coordinates manually.");
    }
  };

  const handlePunchIn = async () => {
    if (workMode === "site") {
      if (!siteName.trim()) return toast.error("Enter the name of the site.");
      const lat = Number(siteLat);
      const lng = Number(siteLng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return toast.error("Enter valid latitude and longitude for the site.");
      }
      if (lat < -90 || lat > 90) return toast.error("Latitude must be between -90 and 90.");
      if (lng < -180 || lng > 180) return toast.error("Longitude must be between -180 and 180.");
    }

    const t = toast.loading("Punching in...");
    let gpsLocation: { lat: number; lng: number } | null = null;

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      gpsLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setLocationError(null);
    } catch {
      setLocationError(
        "Location access denied. If your workplace requires GPS, punch-in may be rejected."
      );
    }

    try {
      await punchInMutation.mutateAsync({
        gpsLocation,
        source: "dashboard",
        isHalfDay,
        halfDayReason: isHalfDay ? halfDayReason : undefined,
        workMode,
        site: workMode === "site"
          ? { name: siteName.trim(), lat: Number(siteLat), lng: Number(siteLng) }
          : undefined,
      });
      toast.success("Successfully punched in!", { id: t });
      setIsHalfDay(false);
      setHalfDayReason("");
      setSiteName("");
      setSiteLat("");
      setSiteLng("");
    } catch (err: any) {
      toast.error(err.message, { id: t });
    }
  };

  const handlePunchOut = async (earlyConfirmed = false) => {
    const t = toast.loading("Punching out...");
    let gpsLocation: { lat: number; lng: number } | null = null;

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      gpsLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setLocationError(null);
    } catch {
      setLocationError("Location access denied. GPS is required for assigned work locations.");
    }

    try {
      const result = await punchOutMutation.mutateAsync({ 
        confirmed: true,
        earlyPunchOutReason: earlyReason,
        earlyPunchOutConfirmed: earlyConfirmed,
        gpsLocation,
      });
      if ((result as any).requiresConfirmation) {
        setShowPunchOutConfirm(true);
        toast.dismiss(t);
        return;
      }
      if ((result as any).requiresEarlyPunchOutReason) {
        setShowEarlyReason(true);
        setShowPunchOutConfirm(false);
        toast.dismiss(t);
        return;
      }
      setShowPunchOutConfirm(false);
      setShowEarlyReason(false);
      setEarlyReason("");
      toast.success("Successfully punched out!", { id: t });
    } catch (err: any) {
      toast.error(err.message, { id: t });
    }
  };

  return (
    <GenericPage
      title="My Attendance"
      subtitle="Track your daily work hours and check-in status."
    >
      {user?.role === "admin" ? (
        <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl font-bold text-foreground">Admin Mode</h2>
            <p className="text-muted-foreground mt-2">
              As an administrator, you have full access to the system. Attendance tracking (punch-in/out) is disabled for your account.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


        {/* Left Col: Punch Card & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Card */}
          <div className="kpi-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-24 h-24 rotate-12" />
            </div>

            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Current Status</h3>

            {loadingToday ? (
              <div className="py-8 flex justify-center"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
            ) : todayRecord ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    todayRecord.status === "absent"
                      ? "bg-red-500/10 text-red-600"
                      : todayRecord.status === "on-leave"
                      ? "bg-blue-500/10 text-blue-600"
                      : "bg-green-500/10 text-green-600"
                  }`}>
                    {todayRecord.status === "absent"
                      ? <AlertCircle className="w-6 h-6" />
                      : <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground capitalize">{todayRecord.status}</p>
                    <p className="text-xs text-muted-foreground">Punched in at {todayRecord.punchIn ? format(new Date(todayRecord.punchIn), "hh:mm a") : "—"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Punch In</p>
                    <p className="text-sm font-mono">{todayRecord.punchIn ? format(new Date(todayRecord.punchIn), "hh:mm:ss a") : "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Punch Out</p>
                    <p className="text-sm font-mono">{todayRecord.punchOut ? format(new Date(todayRecord.punchOut), "hh:mm:ss a") : "—"}</p>
                  </div>
                </div>

                {/* Where this shift is being worked from */}
                {todayRecord.workMode === "home" && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-violet-50 border border-violet-200">
                    <Home className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-violet-800">Working from home</p>
                  </div>
                )}
                {todayRecord.workMode === "site" && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-blue-800">
                        On site — {todayRecord.site?.name || "unnamed site"}
                      </p>
                      {Number.isFinite(todayRecord.site?.lat) && Number.isFinite(todayRecord.site?.lng) && (
                        <p className="text-xs text-blue-600">
                          {todayRecord.site?.lat}, {todayRecord.site?.lng}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Early exit pending notice */}
                {todayRecord.punchOut && todayRecord.earlyPunchOutStatus === "pending" && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-800">Awaiting HR Approval</p>
                      <p className="text-xs text-amber-600">Your early punch-out request has been submitted and is pending approval.</p>
                    </div>
                  </div>
                )}
                {todayRecord.punchOut && todayRecord.earlyPunchOutStatus === "approved" && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <p className="text-sm font-bold">Early exit approved by HR</p>
                  </div>
                )}
                {todayRecord.punchOut && todayRecord.earlyPunchOutStatus === "rejected" && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-700">Early exit not approved</p>
                      <p className="text-xs text-red-500">Your request was rejected. Please speak to HR.</p>
                    </div>
                  </div>
                )}

                {/* An HR override to absent/on-leave clears punchIn, so there is no
                    live session to punch out of even though punchOut is still empty. */}
                {todayRecord.punchIn && !todayRecord.punchOut ? (
                  showEarlyReason ? (
                    <div className="p-4 rounded-xl border border-red-200 bg-red-50 space-y-3">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm font-bold">Early Punch Out</p>
                      </div>
                      <p className="text-xs text-red-600">
                        You're leaving before completing 8 hours. Please provide a reason for HR approval (optional).
                      </p>
                      <Input
                        placeholder="Reason for leaving early..."
                        value={earlyReason}
                        onChange={(e) => setEarlyReason(e.target.value)}
                        className="bg-white border-red-300"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePunchOut(true)}
                          disabled={punchOutMutation.isPending}
                          className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                        >
                          Submit & Punch Out
                        </button>
                        <button
                          onClick={() => { setShowEarlyReason(false); setEarlyReason(""); }}
                          className="flex-1 h-9 border border-border rounded-lg text-sm font-semibold bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : !showPunchOutConfirm ? (
                    <button
                      onClick={() => setShowPunchOutConfirm(true)}
                      disabled={punchOutMutation.isPending}
                      className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20 active:scale-[0.98]"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      Punch Out
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl border border-red-200 bg-red-50 space-y-3">
                      <p className="text-sm font-medium text-red-800">
                        Confirm punch-out? This will end your shift for today.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePunchOut()}
                          disabled={punchOutMutation.isPending}
                          className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold"
                        >
                          Yes, Punch Out
                        </button>
                        <button
                          onClick={() => setShowPunchOutConfirm(false)}
                          className="flex-1 h-9 border border-border rounded-lg text-sm font-semibold bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )
                ) : todayRecord.punchOut ? (
                  <div className="p-3 bg-muted/50 rounded-lg text-center text-xs text-muted-foreground border border-dashed border-border">
                    Day completed. Great work!
                  </div>
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg text-center text-xs text-muted-foreground border border-dashed border-border">
                    Marked <span className="font-semibold capitalize">{todayRecord.status}</span> for today.
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center py-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Clock className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-semibold">Not Punched In</p>
                  <p className="text-sm text-muted-foreground">Start your workday session now.</p>
                </div>

                {/* Where are you working from? Asked before anything else,
                    because it decides whether the geofence applies at all. */}
                <div className="space-y-2 py-2 border-t border-border/50">
                  <p className="text-sm font-medium text-foreground">Working from</p>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: "office", label: "Office", hint: "Checked against your work location" },
                      { value: "site", label: "Site", hint: "Tell us where you are" },
                      { value: "home", label: "Work From Home", hint: "No location check" },
                    ] as const).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setWorkMode(option.value)}
                        className={`rounded-lg border p-2.5 text-left transition-colors ${
                          workMode === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:bg-muted"
                        }`}
                      >
                        <span className={`block text-sm font-semibold ${
                          workMode === option.value ? "text-primary" : "text-foreground"
                        }`}>
                          {option.label}
                        </span>
                        <span className="block text-[10px] text-muted-foreground leading-tight mt-0.5">
                          {option.hint}
                        </span>
                      </button>
                    ))}
                  </div>

                  {workMode === "site" && (
                    <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
                      <Input
                        placeholder="Site name (e.g. Acme Pvt Ltd, Baner)"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Latitude"
                          inputMode="decimal"
                          value={siteLat}
                          onChange={(e) => setSiteLat(e.target.value)}
                        />
                        <Input
                          placeholder="Longitude"
                          inputMode="decimal"
                          value={siteLng}
                          onChange={(e) => setSiteLng(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={useMyLocationForSite}
                        className="w-full h-8 rounded-md border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Use my current location
                      </button>
                      <p className="text-[10px] text-muted-foreground">
                        Site punches aren't distance-checked — the site you enter is recorded as-is.
                      </p>
                    </div>
                  )}

                  {workMode === "home" && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/20 p-3">
                      <Home className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-muted-foreground">
                        Working from home isn't distance-checked — your shift is recorded as remote
                        and shows as Work From Home on the attendance register.
                      </p>
                    </div>
                  )}
                </div>

                {/* Half-day toggle */}
                <div className="flex items-center justify-between py-2 border-t border-border/50">
                  <label htmlFor="half-day-toggle" className="text-sm font-medium text-foreground cursor-pointer">
                    Half Day
                  </label>
                  <Switch
                    id="half-day-toggle"
                    checked={isHalfDay}
                    onCheckedChange={(v) => { setIsHalfDay(v); if (!v) setHalfDayReason(""); }}
                  />
                </div>

                {isHalfDay && (
                  <Input
                    placeholder="Reason for half-day (required)"
                    value={halfDayReason}
                    onChange={(e) => setHalfDayReason(e.target.value)}
                  />
                )}

                {locationError && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {locationError}
                  </p>
                )}

                <button
                  onClick={handlePunchIn}
                  disabled={punchInMutation.isPending || (isHalfDay && !halfDayReason.trim())}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-60"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Punch In Now
                </button>
              </div>
            )}
          </div>

          {/* Monthly Summary Card */}
          <div className="kpi-card">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Monthly Summary</h3>
            {history?.summary ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                  <p className="text-[10px] text-green-600 font-bold uppercase">Present</p>
                  <p className="text-xl font-bold">{history.summary.present}</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <p className="text-[10px] text-amber-600 font-bold uppercase">Half Days</p>
                  <p className="text-xl font-bold">{history.summary.halfDay}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <p className="text-[10px] text-red-600 font-bold uppercase">Absent</p>
                  <p className="text-xl font-bold">{history.summary.absent}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <p className="text-[10px] text-blue-600 font-bold uppercase">Total Hours</p>
                  <p className="text-xl font-bold">{history.summary.totalHours}h</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No data for selected month.</p>
            )}
          </div>
        </div>

        {/* Right Col: Attendance History */}
        <div className="lg:col-span-2">
          <div className="kpi-card h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <h3 className="text-base font-semibold">Attendance History</h3>
              </div>

              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 border border-border">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-sm font-medium outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="table-header text-left pb-3 pr-4">Date</th>
                    <th className="table-header text-left pb-3 pr-4">Status</th>
                    <th className="table-header text-left pb-3 pr-4">In / Out</th>
                    <th className="table-header text-left pb-3 pr-4">Hours</th>
                    <th className="table-header text-left pb-3 pr-4">Exit Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingHistory ? (
                    <tr><td colSpan={5} className="py-20 text-center text-muted-foreground italic">Loading history...</td></tr>
                  ) : !history?.records?.length ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <AlertCircle className="w-10 h-10" />
                          <p>No records found for {selectedMonth ? format(new Date(selectedMonth), "MMMM yyyy") : "this month"}</p>
                        </div>
                      </td>
                    </tr>
                  ) : history.records.map((record: any) => (
                    <tr key={record._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 font-medium">
                        {record.date ? format(new Date(record.date), "EEE, MMM dd") : "—"}
                      </td>
                      <td className="py-4">
                        <span className={`status-badge capitalize ${
                          record.status === 'present' ? 'bg-green-100 text-green-700' :
                          record.status === 'half-day' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-[11px] text-muted-foreground">
                        {record.punchIn ? format(new Date(record.punchIn), "hh:mm a") : "—"} — {record.punchOut ? format(new Date(record.punchOut), "hh:mm a") : "—"}
                      </td>
                      <td className="py-4 font-semibold">
                        {record.totalHours || 0} hrs
                      </td>
                      <td className="py-4">
                        {record.earlyPunchOutStatus === "pending" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⏳ Pending HR</span>
                        )}
                        {record.earlyPunchOutStatus === "approved" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">✓ Approved</span>
                        )}
                        {record.earlyPunchOutStatus === "rejected" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">✗ Not Approved</span>
                        )}
                        {(!record.earlyPunchOutStatus || record.earlyPunchOutStatus === "none") && (
                          <span className="text-muted-foreground text-xs">Full shift</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        </div>
      )}
    </GenericPage>
  );
};

export default MyAttendancePage;
