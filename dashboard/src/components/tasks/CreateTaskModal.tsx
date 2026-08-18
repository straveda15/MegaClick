import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { CalendarPlus, User, Check, Search, X, CalendarClock, AlertCircle, Bell, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useTeam } from "@/hooks/useTeam";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/context/AuthContext";
import { useCreateManualTask, type TaskServiceRequest } from "@/hooks/useTasks";
import { useClients, type Client, type ClientService } from "@/hooks/useClients";
import { TEMPERATURE_LABELS, TEMPERATURE_STYLES } from "@/data/leadTemperature";
import type { AssignableStaff } from "@/components/tasks/roleFilter";

/** Format a Date as the local string a <input type="datetime-local"> expects. */
const toLocalInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/**
 * Priority is not asked for — it follows the service's own hot/warm/cold, which
 * is the judgement the team already made when the client booked it. Two places
 * to set the same thing would only let them drift apart.
 */
const PRIORITY_FROM_TEMPERATURE: Record<string, string> = {
  HOT: "high",
  WARM: "medium",
  COLD: "low",
};

const PRIORITY_LABELS: Record<string, string> = {
  low: "Low", medium: "Medium", high: "High", urgent: "Urgent",
};

export function CreateTaskModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Client first, then the service — everything below is filled in from those.
  const [client, setClient] = useState<Client | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [service, setService] = useState<ClientService | null>(null);

  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt]           = useState("");
  const [assignedToIds, setAssignedToIds] = useState<string[]>([]);
  const [search, setSearch]         = useState("");
  // People tagged for follow-up (not assignees). They get visibility of the task
  // in their "Follow Up" tab and can post follow-up notes, but can't act on it.
  const [followerIds, setFollowerIds] = useState<string[]>([]);
  const [followerSearch, setFollowerSearch] = useState("");

  const { data: team = [] }  = useTeam();
  const { user }             = useAuth();
  const createTask           = useCreateManualTask();
  const { data: clients = [] } = useClients();

  const matchingClients = useMemo(() => {
    const q = clientSearch.trim().toLowerCase();
    if (!q) return clients.slice(0, 6);
    return clients.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.clientId.toLowerCase().includes(q) ||
      c.services.some((s) => s.title.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [clients, clientSearch]);

  /** Picking a service names the task after it. */
  const chooseService = (next: ClientService) => {
    setService(next);
    setTitle(next.title);
  };

  const chooseClient = (next: Client | null) => {
    setClient(next);
    setService(null);
    setClientSearch("");
    setTitle("");
    // With a single service there is nothing to choose — fill it straight in.
    if (next?.services.length === 1) chooseService(next.services[0]);
  };

  const priority = service ? PRIORITY_FROM_TEMPERATURE[service.temperature] ?? "medium" : "medium";

  // Founders / co-founders / admins are seeded with role "admin" and usually
  // don't have an EmployeeProfile, so they're absent from the team list. When
  // the assigner is themselves an admin, surface other admins as assignable
  // targets so founders/co-founders can delegate work to each other.
  const isAdmin = user?.role === "admin";
  const { data: adminUsers = [] } = useUsers("admin");
  const assignableStaff = useMemo(() => {
    if (!isAdmin) return team;
    const inTeam = new Set(team.map((emp) => String(emp.userId?._id)));
    const adminProfiles = adminUsers
      .filter((au) => au._id && !inTeam.has(String(au._id)))
      .map((au) => ({
        _id: `admin-${au._id}`,
        userId: au,
        designation: "Founder / Admin",
        department: "management",
        status: au.isActive === false ? "inactive" : "active",
      }));
    return [...adminProfiles, ...team] as AssignableStaff[];
  }, [isAdmin, adminUsers, team]);

  // Earliest selectable deadline = now. Computed once on open.
  const minDateTime = useMemo(() => toLocalInput(new Date()), []);
  const isPastDeadline = dueAt !== "" && new Date(dueAt).getTime() < Date.now();

  const filteredStaff = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assignableStaff
      // Never allow assigning work to deactivated staff/team members.
      .filter((emp) => emp.status !== "inactive" && emp.userId?.isActive !== false)
      .filter((emp) => {
        if (!q) return true;
        const name = [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ").toLowerCase();
        return name.includes(q) || (emp.designation ?? "").toLowerCase().includes(q);
      });
  }, [assignableStaff, search]);

  // Map of selected userId -> display name, for the summary chips.
  const selectedStaff = useMemo(() => {
    const map = new Map<string, string>();
    assignableStaff.forEach((emp) => {
      const uid = emp.userId?._id;
      if (uid && assignedToIds.includes(uid)) {
        map.set(uid, [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ") || "Unknown");
      }
    });
    return map;
  }, [assignableStaff, assignedToIds]);

  const toggleStaffSelection = (id: string) => {
    setAssignedToIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    // An assignee can't also be a follow-up tag on the same task.
    setFollowerIds((prev) => prev.filter((i) => i !== id));
  };

  // Follow-up candidates: active staff not already picked as an assignee.
  const followerStaff = useMemo(() => {
    const q = followerSearch.trim().toLowerCase();
    return assignableStaff
      .filter((emp) => emp.status !== "inactive" && emp.userId?.isActive !== false)
      .filter((emp) => !assignedToIds.includes(emp.userId?._id))
      .filter((emp) => {
        if (!q) return true;
        const name = [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ").toLowerCase();
        return name.includes(q) || (emp.designation ?? "").toLowerCase().includes(q);
      });
  }, [assignableStaff, assignedToIds, followerSearch]);

  const selectedFollowers = useMemo(() => {
    const map = new Map<string, string>();
    assignableStaff.forEach((emp) => {
      const uid = emp.userId?._id;
      if (uid && followerIds.includes(uid)) {
        map.set(uid, [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ") || "Unknown");
      }
    });
    return map;
  }, [assignableStaff, followerIds]);

  const toggleFollowerSelection = (id: string) => {
    setFollowerIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Quick deadline presets.
  const setPreset = (compute: (now: Date) => Date) => setDueAt(toLocalInput(compute(new Date())));
  const presets = [
    { label: "In 1 hour", fn: (n: Date) => new Date(n.getTime() + 60 * 60 * 1000) },
    { label: "Today 6 PM", fn: (n: Date) => { const d = new Date(n); d.setHours(18, 0, 0, 0); return d; } },
    { label: "Tomorrow 9 AM", fn: (n: Date) => { const d = new Date(n); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0, 0); return d; } },
    { label: "Next week", fn: (n: Date) => { const d = new Date(n); d.setDate(d.getDate() + 7); return d; } },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Task Title is required");
    // Catalog service names legitimately carry punctuation ("Govt. Gazette –
    // Name / DOB Change"), so the letters-and-numbers rule only applies to
    // titles the user typed themselves.
    if (!service && !/^[A-Za-z0-9\s]+$/.test(title.trim()))
      return toast.error("Title can only contain letters, numbers and spaces");
    if (!dueAt) return toast.error("Deadline is required");
    if (new Date(dueAt).getTime() < Date.now()) {
      return toast.error("Deadline can't be in the past — pick a future date and time");
    }
    if (assignedToIds.length === 0) return toast.error("Please select at least one staff member to assign this task");

    // Stamp the task with the service + client details so the assignee sees the
    // same "Client Service Request" panel as a service assigned from the
    // Clients board.
    const serviceRequest: TaskServiceRequest | undefined =
      client || service
        ? {
            serviceTitle: service?.title || title,
            serviceSlug: service?.slug,
            serviceCategory: service?.category,
            clientName: client?.name,
            clientEmail: client?.email,
            clientPhone: client?.phone,
            clientCompany: client?.company,
            clientAddress: client?.address,
            notes: description.trim() || undefined,
            stage: service?.stage ?? "documents_pending",
          }
        : undefined;

    createTask.mutate(
      {
        title,
        description,
        priority,
        dueAt: new Date(dueAt).toISOString(),
        assignedTo: assignedToIds,
        followers: followerIds,
        type: "manual",
        serviceRequest,
      },
      {
        onSuccess: () => {
          toast.success("Task created and assigned");
          onClose();
        },
        onError: (e: Error) => toast.error(e.message || "Failed to create task"),
      }
    );
  };

  /** One selectable person. Deliberately plain — name, role, tick. */
  const staffRow = (
    emp: AssignableStaff,
    isSelected: boolean,
    onToggle: (id: string) => void,
    tone: "primary" | "amber"
  ) => {
    const uid = emp.userId?._id;
    if (!uid) return null;
    const name = [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ") || "Unknown";
    const selectedClasses = tone === "primary"
      ? "bg-primary/10 border-primary/20 text-primary"
      : "bg-amber-50 border-amber-200 text-amber-700";
    const boxClasses = tone === "primary"
      ? "bg-primary border-primary"
      : "bg-amber-500 border-amber-500";

    return (
      <div
        key={uid}
        onClick={() => onToggle(uid)}
        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors border ${
          isSelected ? selectedClasses : "hover:bg-muted/50 border-transparent"
        }`}
      >
        <div className="flex flex-col min-w-0 flex-1">
          <span className={`text-xs font-medium truncate ${isSelected ? "" : "text-foreground"}`}>
            {name}
          </span>
          <span className="text-[9px] text-muted-foreground truncate">
            {emp.designation || emp.department || "Staff"}
          </span>
        </div>
        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
          isSelected ? boxClasses : "border-muted-foreground/30"
        }`}>
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <CalendarPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Create &amp; Assign Task</h2>
              <p className="text-xs text-muted-foreground">Delegate work to one or more staff members</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">

          {/* Client — everything below is filled in from whoever is picked here */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Client
            </label>

            {client ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50/60 px-3 py-2.5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{client.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {[client.clientId, client.phone, client.company].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => chooseClient(null)}
                  className="shrink-0 p-1 rounded-md hover:bg-blue-100 text-muted-foreground"
                  title="Change client"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    autoFocus
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-shadow"
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Search clients by name, phone or service…"
                  />
                </div>
                {matchingClients.length > 0 && (
                  <div className="mt-1.5 border border-border rounded-lg divide-y divide-border max-h-[176px] overflow-y-auto">
                    {matchingClients.map((c) => (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => chooseClient(c)}
                        className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {[c.phone, `${c.totalServices} service${c.totalServices === 1 ? "" : "s"}`]
                            .filter(Boolean).join(" · ")}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Service — the client's own services, filled in from their record */}
          {client && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Service <span className="text-red-500">*</span>
              </label>

              {client.services.length === 0 ? (
                <p className="text-xs text-muted-foreground rounded-lg border border-dashed border-border px-3 py-4 text-center">
                  This client has no services on their record yet.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {client.services.map((s) => {
                    const active = service?._id === s._id;
                    const tempStyle = TEMPERATURE_STYLES[s.temperature];

                    return (
                      <button
                        key={s._id}
                        type="button"
                        onClick={() => chooseService(s)}
                        className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${
                          active ? "border-blue-400 bg-blue-50" : "border-border bg-card hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground truncate">{s.title}</span>
                          <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${tempStyle.bg} ${tempStyle.text}`}>
                            {TEMPERATURE_LABELS[s.temperature]}
                          </span>
                        </div>
                        {s.category && (
                          <span className="block text-[11px] text-muted-foreground truncate">{s.category}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Title — named after the service, still editable */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-shadow"
              value={title}
              // Free-typed titles stay letters/numbers only; a title that came
              // from a service keeps its punctuation intact.
              onChange={(e) => {
                setService(null);
                setTitle(e.target.value.replace(/[^A-Za-z0-9\s]/g, ""));
              }}
              placeholder="Pick a service above, or type a title"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </label>
            <textarea
              className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none resize-none h-14 transition-shadow"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context or instructions…"
            />
          </div>

          {/* Deadline */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5" /> Deadline <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="datetime-local"
              min={minDateTime}
              className={`w-full h-10 px-3 rounded-lg border bg-background text-sm outline-none transition-shadow focus:ring-2 ${
                isPastDeadline
                  ? "border-red-400 focus:ring-red-300"
                  : "border-border focus:ring-primary/40 focus:border-primary"
              }`}
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
            />
            {isPastDeadline ? (
              <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> Deadline must be in the future.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setPreset(p.fn)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-muted-foreground border border-border bg-card hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority follows the service's status — shown, not asked for */}
          {service && (
            <p className="text-[11px] text-muted-foreground">
              Priority <span className="font-semibold text-foreground">{PRIORITY_LABELS[priority]}</span>,
              from this service's {TEMPERATURE_LABELS[service.temperature].toLowerCase()} status.
            </p>
          )}

          {/* Assign to */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Assign To <span className="text-red-500">*</span>
              </p>
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
                      onClick={() => toggleStaffSelection(uid)}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary/20"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff by name…"
                className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-background text-xs focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
            </div>

            {/* Two rows tall — search to reach anyone further down the list. */}
            <div className="max-h-[88px] overflow-y-auto space-y-1">
              {filteredStaff.length === 0 ? (
                <p className="text-[10px] text-muted-foreground p-3 text-center italic">
                  {search ? "No staff match your search" : "No staff found"}
                </p>
              ) : (
                filteredStaff.map((emp) =>
                  staffRow(emp, assignedToIds.includes(emp.userId?._id), toggleStaffSelection, "primary")
                )
              )}
            </div>
          </div>

          {/* Follow-up tagging (optional) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Tag for Follow-up
              </p>
              {followerIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFollowerIds([])}
                  className="text-[10px] text-primary hover:underline font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {followerIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {[...selectedFollowers.entries()].map(([uid, name]) => (
                  <span
                    key={uid}
                    className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-medium border border-amber-200"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => toggleFollowerSelection(uid)}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-amber-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={followerSearch}
                onChange={(e) => setFollowerSearch(e.target.value)}
                placeholder="Search staff to tag…"
                className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-background text-xs focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
              />
            </div>

            <div className="max-h-[88px] overflow-y-auto space-y-1">
              {followerStaff.length === 0 ? (
                <p className="text-[10px] text-muted-foreground p-3 text-center italic">
                  {followerSearch ? "No staff match your search" : "No staff available to tag"}
                </p>
              ) : (
                followerStaff.map((emp) =>
                  staffRow(emp, followerIds.includes(emp.userId?._id), toggleFollowerSelection, "amber")
                )
              )}
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
              type="submit"
              disabled={createTask.isPending}
              className="h-9 px-5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {createTask.isPending ? "Creating…" : "Assign Task"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
