import { useState, useMemo } from "react";
import GenericPage from "@/components/GenericPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  MapPin, Plus, Edit2, Users, X, Check, Loader2, Trash2, AlertTriangle
} from "lucide-react";
import {
  useWorkLocations,
  useCreateWorkLocation,
  useUpdateWorkLocation,
  useAssignEmployees,
  useUnassignEmployees,
  useDeleteWorkLocation,
  WorkLocation,
  WorkLocationInput,
} from "@/hooks/useAttendance";
import { useTeam } from "@/hooks/useTeam";
import { useToast } from "@/hooks/use-toast";
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

const emptyForm: WorkLocationInput = {
  name: "",
  lat: 0,
  lng: 0,
  radiusMeters: 100,
  isActive: true,
  assignedDepartments: [],
};

export default function WorkLocationsPage() {
  const { data: locations = [], isLoading } = useWorkLocations();
  const { data: teamData } = useTeam();
  const { toast } = useToast();

  const createMutation = useCreateWorkLocation();
  const updateMutation = useUpdateWorkLocation();
  const assignMutation = useAssignEmployees();
  const unassignMutation = useUnassignEmployees();
  const deleteMutation = useDeleteWorkLocation();

  const [form, setForm] = useState<WorkLocationInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<WorkLocation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [assignSearch, setAssignSearch] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [deptInput, setDeptInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // useTeam returns EmployeeProfile[] directly (array, not wrapped object).
  // Each profile has `.userId` populated as a User object with name/lastName.
  const allEmployees: any[] = Array.isArray(teamData) ? teamData : [];

  const allAssignedIds = useMemo(() => {
    const ids = new Set<string>();
    locations.forEach((loc) => {
      loc.assignedEmployees.forEach((emp) => {
        ids.add(String(emp._id));
      });
    });
    return ids;
  }, [locations]);

  const filteredEmployees = allEmployees.filter((profile: any) => {
    const user = profile.userId ?? {};
    const fullName = `${user.name ?? ""} ${user.lastName ?? ""}`.toLowerCase();
    return fullName.includes(assignSearch.toLowerCase());
  });

  // WorkLocation.assignedEmployees stores User._ids, so compare against emp.userId._id.
  // Derive a live copy from fresh query data so the panel updates after assign/unassign.
  const liveSelectedLocation = useMemo(
    () => locations.find((l) => l._id === selectedLocation?._id) ?? selectedLocation,
    [locations, selectedLocation]
  );
  const assignedIds = new Set(liveSelectedLocation?.assignedEmployees.map((e) => e._id) ?? []);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setDeptInput("");
    setShowForm(true);
  }

  function openEdit(loc: WorkLocation) {
    setForm({
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      radiusMeters: loc.radiusMeters,
      isActive: loc.isActive,
      assignedDepartments: loc.assignedDepartments,
    });
    setEditingId(loc._id);
    setDeptInput(loc.assignedDepartments.join(", "));
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Coordinate range validation — lat ∈ [-90, 90], lng ∈ [-180, 180]. HTML min/max
    // is bypassable, and out-of-range coords silently break GPS geofencing (no punch
    // ever matches), so guard here before hitting the API. Reject the 0,0 fallback
    // (a cleared field coerces to 0) which points at the Gulf of Guinea, not a real site.
    if (form.lat < -90 || form.lat > 90) {
      toast({ title: "Invalid latitude", description: "Latitude must be between -90 and 90.", variant: "destructive" });
      return;
    }
    if (form.lng < -180 || form.lng > 180) {
      toast({ title: "Invalid longitude", description: "Longitude must be between -180 and 180.", variant: "destructive" });
      return;
    }
    if (form.lat === 0 && form.lng === 0) {
      toast({ title: "Coordinates required", description: "Enter a real latitude and longitude for this location.", variant: "destructive" });
      return;
    }

    const payload = {
      ...form,
      assignedDepartments: deptInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
        toast({ title: "Location updated" });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Location created" });
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast({ title: "Location deleted" });
      setDeleteId(null);
      if (selectedLocation?._id === deleteId) {
        setSelectedLocation(null);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  async function handleAssign() {
    if (!selectedLocation || selectedEmployeeIds.length === 0) return;
    try {
      await assignMutation.mutateAsync({ id: selectedLocation._id, employeeIds: selectedEmployeeIds });
      toast({ title: `Assigned ${selectedEmployeeIds.length} employee(s)` });
      setSelectedEmployeeIds([]);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  async function handleUnassign(employeeId: string) {
    if (!selectedLocation) return;
    try {
      await unassignMutation.mutateAsync({ id: selectedLocation._id, employeeIds: [employeeId] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  }

  function toggleEmployeeSelect(id: string) {
    setSelectedEmployeeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <GenericPage
      title="Work Locations"
      subtitle="Define GPS-gated work locations and assign employees for attendance validation."
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold">Locations</h3>
        <Button size="sm" onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Add Location
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Section A: Location List ───────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-4">

          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading locations...
            </div>
          ) : locations.length === 0 ? (
            <div className="kpi-card text-center py-12 text-muted-foreground">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No locations yet</p>
              <p className="text-sm mt-1">Create a location to enable GPS-gated attendance.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {locations.map((loc) => (
                <div
                  key={loc._id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`kpi-card cursor-pointer transition-all hover:shadow-md ${
                    selectedLocation?._id === loc._id ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${loc.isActive ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{loc.name}</p>
                          <Badge variant={loc.isActive ? "default" : "secondary"} className="text-[10px]">
                            {loc.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)} · {loc.radiusMeters}m radius
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {loc.assignedEmployees.length} assigned
                          </span>
                          {loc.assignedDepartments.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              Depts: {loc.assignedDepartments.join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); openEdit(loc); }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); setDeleteId(loc._id); }}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right panel: Form + Assign ─────────────────────────────────── */}
        <div className="space-y-4">

          {/* Section B: Create / Edit Form */}
          {showForm && (
            <div className="kpi-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{editingId ? "Edit Location" : "New Location"}</h3>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
                  <Input
                    required
                    placeholder="e.g. MegaClick HQ"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Latitude</label>
                    <Input
                      type="number"
                      step="any"
                      required
                      min={-90}
                      max={90}
                      placeholder="19.0760"
                      value={form.lat || ""}
                      onChange={(e) => setForm({ ...form, lat: e.target.value === "" ? 0 : parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Longitude</label>
                    <Input
                      type="number"
                      step="any"
                      required
                      min={-180}
                      max={180}
                      placeholder="72.8777"
                      value={form.lng || ""}
                      onChange={(e) => setForm({ ...form, lng: e.target.value === "" ? 0 : parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Radius (metres, min 10)</label>
                  <Input
                    type="number"
                    min={10}
                    required
                    value={form.radiusMeters || ""}
                    onChange={(e) => setForm({ ...form, radiusMeters: e.target.value === "" ? 0 : parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Departments (comma-separated, optional)</label>
                  <Input
                    placeholder="e.g. warehouse, dispatch"
                    value={deptInput}
                    onChange={(e) => setDeptInput(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-t border-border/50">
                  <label className="text-sm font-medium">Active</label>
                  <Switch
                    checked={form.isActive ?? true}
                    onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {editingId ? "Save Changes" : "Create Location"}
                </Button>
              </form>
            </div>
          )}

          {/* Section C: Assign Employees */}
          {selectedLocation && (
            <div className="kpi-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Assign Employees</h3>
                <span className="text-xs text-muted-foreground">{liveSelectedLocation?.name}</span>
              </div>

              {/* Location Info Block */}
              <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Location Details</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Coordinates</p>
                    <p className="text-xs font-mono font-medium">
                      {liveSelectedLocation?.lat.toFixed(6)}<br/>
                      {liveSelectedLocation?.lng.toFixed(6)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Radius</p>
                    <p className="text-xs font-semibold">{liveSelectedLocation?.radiusMeters}m</p>
                    <Badge variant={liveSelectedLocation?.isActive ? "default" : "secondary"} className="h-4 px-1.5 text-[9px] font-bold">
                      {liveSelectedLocation?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                {liveSelectedLocation?.assignedDepartments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-primary/10">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Departments</p>
                    <div className="flex flex-wrap gap-1">
                      {liveSelectedLocation.assignedDepartments.map(d => (
                        <Badge key={d} variant="outline" className="text-[9px] py-0">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Currently assigned — use liveSelectedLocation for fresh data after mutations */}
              {(liveSelectedLocation?.assignedEmployees.length ?? 0) > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Currently Assigned</p>
                  <div className="space-y-1.5">
                    {liveSelectedLocation!.assignedEmployees.map((emp) => (
                      <div key={emp._id} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/40">
                        <span className="text-sm">{emp.name} {emp.lastName}</span>
                        <button
                          onClick={() => handleUnassign(emp._id)}
                          disabled={unassignMutation.isPending}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Employee search + select */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Add Employees</p>
                <Input
                  placeholder="Search by name..."
                  value={assignSearch}
                  onChange={(e) => setAssignSearch(e.target.value)}
                  className="mb-2"
                />
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredEmployees
                    // emp is an EmployeeProfile; emp.userId is the populated User object
                    .filter((emp: any) => {
                      const uid = emp.userId?._id ?? emp.userId;
                      return !allAssignedIds.has(String(uid));
                    })
                    .map((emp: any) => {
                      const user = emp.userId ?? {};
                      const userId = user._id ?? emp.userId;
                      const userIdStr = String(userId);
                      return (
                        <label
                          key={emp._id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedEmployeeIds.includes(userIdStr)}
                            onChange={() => toggleEmployeeSelect(userIdStr)}
                            className="rounded"
                          />
                          <span className="text-sm">
                            {user.name ?? "—"} {user.lastName ?? ""}
                          </span>
                          {emp.designation && (
                            <span className="text-[10px] text-muted-foreground ml-auto">{emp.designation}</span>
                          )}
                        </label>
                      );
                    })}
                  {filteredEmployees.filter((emp: any) => {
                    const uid = emp.userId?._id ?? emp.userId;
                    return !assignedIds.has(String(uid));
                  }).length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">No unassigned employees found</p>
                  )}
                </div>
                <Button
                  className="w-full mt-3"
                  size="sm"
                  onClick={handleAssign}
                  disabled={selectedEmployeeIds.length === 0 || assignMutation.isPending}
                >
                  {assignMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Assign Selected ({selectedEmployeeIds.length})
                </Button>
              </div>
            </div>
          )}

          {!showForm && !selectedLocation && (
            <div className="kpi-card text-center py-12 text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Select a location to assign employees,<br />or click "Add Location" to create one.</p>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl max-w-md border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">Delete location?</AlertDialogTitle>
            <AlertDialogDescription className="text-[14px]">
              Are you sure you want to delete this work location? This action will remove the entry and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-none bg-muted hover:bg-muted/80">Cancel</AlertDialogCancel>
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
}
