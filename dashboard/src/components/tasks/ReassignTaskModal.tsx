import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { UserPlus, User, Check, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useTeam } from "@/hooks/useTeam";
import { ROLE_CATEGORIES, matchesRoleFilter } from "@/components/tasks/CreateTaskModal";

interface ReassignTaskModalProps {
  taskTitle: string;
  /** User IDs to hide from the picker (e.g. the now-inactive assignee). */
  excludeIds?: Set<string>;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: (assigneeIds: string[]) => void;
}

/**
 * Staff-picker popup used to reassign a task that was cancelled because its
 * assignee went inactive. Mirrors the "Assign To" section of CreateTaskModal so
 * the assigner can hand the work to one or more fresh people.
 */
export function ReassignTaskModal({
  taskTitle,
  excludeIds = new Set(),
  isPending = false,
  onClose,
  onConfirm,
}: ReassignTaskModalProps) {
  useEffect(() => {
    const original = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const { data: team = [] } = useTeam();
  const [roleFilters, setRoleFilters] = useState<string[]>([]);
  const [assignedToIds, setAssignedToIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filteredStaff = useMemo(() => {
    const q = search.trim().toLowerCase();
    return team
      // Never offer deactivated staff or the people we were told to exclude.
      .filter((emp) => emp.status !== "inactive" && emp.userId?.isActive !== false)
      .filter((emp) => !excludeIds.has(String(emp.userId?._id)))
      .filter((emp) => matchesRoleFilter(emp, roleFilters))
      .filter((emp) => {
        if (!q) return true;
        const name = [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ").toLowerCase();
        return name.includes(q) || (emp.designation ?? "").toLowerCase().includes(q);
      });
  }, [team, roleFilters, search, excludeIds]);

  const selectedStaff = useMemo(() => {
    const map = new Map<string, string>();
    team.forEach((emp) => {
      const uid = emp.userId?._id;
      if (uid && assignedToIds.includes(uid)) {
        map.set(uid, [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ") || "Unknown");
      }
    });
    return map;
  }, [team, assignedToIds]);

  const toggleRoleFilter = (role: string) => {
    if (role === "all") return setRoleFilters([]);
    setRoleFilters((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const toggleStaff = (id: string) =>
    setAssignedToIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const handleSubmit = () => {
    if (assignedToIds.length === 0) return toast.error("Select at least one staff member to reassign this task to");
    onConfirm(assignedToIds);
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold leading-tight">Reassign Task</h2>
              <p className="text-xs text-muted-foreground truncate">{taskTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Reassign To <span className="text-red-500">*</span>
            </p>

            {/* Role filter chips */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Filter by Role{" "}
                {roleFilters.length > 0 && <span className="text-primary">({roleFilters.length} selected)</span>}
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleRoleFilter("all")}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                    roleFilters.length === 0
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  All
                </button>
                {ROLE_CATEGORIES.filter((r) => r.value !== "all").map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => toggleRoleFilter(r.value)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                      roleFilters.includes(r.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {r.label.replace(" Staff", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected chips */}
            {assignedToIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {[...selectedStaff.entries()].map(([uid, name]) => (
                  <span
                    key={uid}
                    className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium border border-primary/20"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => toggleStaff(uid)}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary/20"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search + picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Select Staff ({assignedToIds.length} selected)
                </label>
                {assignedToIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAssignedToIds([])}
                    className="text-[10px] text-primary hover:underline font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search staff by name…"
                  className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-background text-xs focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
                />
              </div>

              <div className="bg-background border border-border rounded-lg max-h-44 overflow-y-auto p-1.5 space-y-1">
                {filteredStaff.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground p-3 text-center italic">
                    {search ? "No staff match your search" : "No staff available for this role"}
                  </p>
                ) : (
                  filteredStaff.map((emp) => {
                    const uid = emp.userId?._id;
                    if (!uid) return null;
                    const name = [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ") || "Unknown";
                    const isSelected = assignedToIds.includes(uid);
                    const initials = name
                      .split(" ")
                      .map((n: string) => n[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();

                    return (
                      <div
                        key={uid}
                        onClick={() => toggleStaff(uid)}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors border ${
                          isSelected ? "bg-primary/10 border-primary/20" : "hover:bg-muted/50 border-transparent"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {initials || "?"}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className={`text-xs font-medium truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {name}
                          </span>
                          <span className="text-[9px] text-muted-foreground truncate uppercase tracking-tighter">
                            {emp.designation || emp.department || "Staff"}
                          </span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                            isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 p-4 border-t border-border bg-background">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-border text-sm hover:bg-muted/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || assignedToIds.length === 0}
            className="h-9 px-5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isPending
              ? "Reassigning…"
              : `Reassign to ${assignedToIds.length || ""} ${assignedToIds.length === 1 ? "person" : "people"}`.trim()}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
