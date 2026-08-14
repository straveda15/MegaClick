import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { CalendarPlus, User, Check, Search, X, CalendarClock, AlertCircle, Bell, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useTeam } from "@/hooks/useTeam";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/context/AuthContext";
import { useCreateManualTask, type TaskServiceRequest } from "@/hooks/useTasks";
import { useLeads, type SalesLead } from "@/hooks/useLeads";
import type { CatalogService } from "@/hooks/useServiceCatalog";
import ServiceCatalogPicker from "@/components/ServiceCatalogPicker";

export const ROLE_CATEGORIES = [
  { label: "All Staff", value: "all" },
  { label: "Ops Staff", value: "ops" },
  { label: "Production Staff", value: "production" },
  { label: "Dispatch Staff", value: "dispatch" },
  { label: "HR Staff", value: "hr" },
  { label: "Sales", value: "sales" },
  { label: "BA", value: "business analyst" },
  { label: "Accountant", value: "accountant" },
  { label: "Manager", value: "manager" },
];

const PRIORITIES = [
  { value: "low",    label: "Low",    dot: "bg-slate-400", sel: "border-slate-400 bg-slate-50 text-slate-700" },
  { value: "medium", label: "Medium", dot: "bg-blue-500",  sel: "border-blue-400 bg-blue-50 text-blue-700" },
  { value: "high",   label: "High",   dot: "bg-amber-500", sel: "border-amber-400 bg-amber-50 text-amber-700" },
  { value: "urgent", label: "Urgent", dot: "bg-red-500",   sel: "border-red-400 bg-red-50 text-red-700" },
];

export function matchesRoleFilter(emp: any, roles: string | string[]): boolean {
  const roleList = Array.isArray(roles) ? roles : [roles];
  if (roleList.length === 0 || roleList.includes("all")) return true;
  const dept  = (emp.department  ?? "").toLowerCase();
  const desig = (emp.designation ?? "").toLowerCase();
  const uRole = (emp.userId?.role ?? "").toLowerCase();
  return roleList.some(r => dept.includes(r) || desig.includes(r) || uRole.includes(r));
}

// Format a Date as the local string a <input type="datetime-local"> expects.
const toLocalInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function CreateTaskModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority]     = useState("");
  const [dueAt, setDueAt]           = useState("");
  const [roleFilters, setRoleFilters] = useState<string[]>([]);
  const [assignedToIds, setAssignedToIds] = useState<string[]>([]);
  const [search, setSearch]         = useState("");
  // People tagged for follow-up (not assignees). They get visibility of the task
  // in their "Follow Up" tab and can post follow-up notes, but can't act on it.
  const [followerIds, setFollowerIds] = useState<string[]>([]);
  const [followerSearch, setFollowerSearch] = useState("");

  // A task can be created straight from the service catalog, optionally tied to
  // an existing lead so the client's contact details ride along on the task.
  const [selectedService, setSelectedService] = useState<CatalogService | null>(null);
  const [attachedLead, setAttachedLead] = useState<SalesLead | null>(null);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");

  const { data: team = [] }  = useTeam();
  const { user }             = useAuth();
  const createTask           = useCreateManualTask();
  const { data: leads = [] } = useLeads();

  const leadClientName = (lead: SalesLead) =>
    lead.customer?.name?.trim() || lead.customer?.phone || "Unnamed lead";

  const matchingLeads = useMemo(() => {
    const q = leadSearch.trim().toLowerCase();
    if (!q) return leads.slice(0, 8);
    return leads.filter((l) =>
      leadClientName(l).toLowerCase().includes(q) ||
      (l.productInterest ?? "").toLowerCase().includes(q) ||
      (l.customer?.phone ?? "").includes(q) ||
      (l.customer?.company ?? "").toLowerCase().includes(q)
    ).slice(0, 8);
  }, [leads, leadSearch]);

  /** Picking a service names the task after it. */
  const chooseService = (service: CatalogService | null) => {
    setSelectedService(service);
    if (service) {
      setTitle(service.title);
      setShowServicePicker(false);
    }
  };

  /** Attaching a lead pulls its service across too, when it has one. */
  const chooseLead = (lead: SalesLead | null) => {
    setAttachedLead(lead);
    setLeadSearch("");
    if (lead?.productInterest && !selectedService) {
      setTitle(lead.productInterest);
      setSelectedService({
        title: lead.productInterest,
        slug: lead.serviceSlug ?? "",
        category: lead.serviceCategory ?? "",
        categorySlug: "",
      });
    }
  };

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
      })) as any[];
    return [...adminProfiles, ...team];
  }, [isAdmin, adminUsers, team]);

  // Admins get an extra "Founders" filter chip for the admin/founder pool.
  const roleCategories = useMemo(
    () => (isAdmin ? [...ROLE_CATEGORIES, { label: "Founders", value: "admin" }] : ROLE_CATEGORIES),
    [isAdmin]
  );

  // Earliest selectable deadline = now. Computed once on open.
  const minDateTime = useMemo(() => toLocalInput(new Date()), []);
  const isPastDeadline = dueAt !== "" && new Date(dueAt).getTime() < Date.now();

  const filteredStaff = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assignableStaff
      // Never allow assigning work to deactivated staff/team members.
      .filter((emp) => emp.status !== "inactive" && emp.userId?.isActive !== false)
      .filter((emp) => matchesRoleFilter(emp, roleFilters))
      .filter((emp) => {
        if (!q) return true;
        const name = [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ").toLowerCase();
        return name.includes(q) || (emp.designation ?? "").toLowerCase().includes(q);
      });
  }, [assignableStaff, roleFilters, search]);

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

  const toggleRoleFilter = (role: string) => {
    if (role === "all") { setRoleFilters([]); return; }
    setRoleFilters(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

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
    if (!selectedService && !/^[A-Za-z0-9\s]+$/.test(title.trim()))
      return toast.error("Title can only contain letters, numbers and spaces");
    if (!dueAt) return toast.error("Deadline is required");
    if (new Date(dueAt).getTime() < Date.now()) {
      return toast.error("Deadline can't be in the past — pick a future date and time");
    }
    if (!priority) return toast.error("Priority is required");
    if (assignedToIds.length === 0) return toast.error("Please select at least one staff member to assign this task");

    // Stamp the task with the service + client details so the assignee sees the
    // same "Client Service Request" panel as a lead assigned from the Leads page.
    const serviceRequest: TaskServiceRequest | undefined =
      selectedService || attachedLead
        ? {
            serviceTitle: selectedService?.title || attachedLead?.productInterest || title,
            serviceSlug: selectedService?.slug || attachedLead?.serviceSlug,
            serviceCategory: selectedService?.category || attachedLead?.serviceCategory,
            serviceCategorySlug: selectedService?.categorySlug,
            clientName: attachedLead ? leadClientName(attachedLead) : undefined,
            clientEmail: attachedLead?.customer?.email,
            clientPhone: attachedLead?.customer?.phone,
            clientCompany: attachedLead?.customer?.company,
            clientAddress: attachedLead?.customer?.city,
            notes: description.trim() || undefined,
            stage: attachedLead?.serviceStage ?? "documents_pending",
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
        onError: (e: any) => toast.error(e.message || "Failed to create task"),
      }
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

          {/* Service — create the task straight from the website catalog */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Service <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </label>

            {selectedService ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50/60 px-3 py-2.5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{selectedService.title}</p>
                  {selectedService.category && (
                    <p className="text-[11px] text-muted-foreground truncate">{selectedService.category}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { chooseService(null); setShowServicePicker(false); }}
                  className="shrink-0 p-1 rounded-md hover:bg-blue-100 text-muted-foreground"
                  title="Clear service"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : showServicePicker ? (
              <div className="rounded-lg border border-border p-3">
                <ServiceCatalogPicker
                  selectedSlug=""
                  onSelect={chooseService}
                  height="h-[220px]"
                />
                <button
                  type="button"
                  onClick={() => setShowServicePicker(false)}
                  className="mt-2 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowServicePicker(true)}
                className="w-full h-10 px-3 rounded-lg border border-dashed border-border bg-background text-sm text-muted-foreground hover:border-blue-400 hover:bg-blue-50/40 transition-colors text-left"
              >
                Pick a service from the catalog…
              </button>
            )}
          </div>

          {/* Lead — attach a client so their details ride along on the task */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Client Lead <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </label>

            {attachedLead ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50/60 px-3 py-2.5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{leadClientName(attachedLead)}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {[attachedLead.customer?.phone, attachedLead.customer?.company].filter(Boolean).join(' · ') || 'No contact details'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => chooseLead(null)}
                  className="shrink-0 p-1 rounded-md hover:bg-blue-100 text-muted-foreground"
                  title="Detach lead"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-shadow"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search leads by client, phone or service…"
                  />
                </div>
                {matchingLeads.length > 0 && (
                  <div className="mt-1.5 border border-border rounded-lg divide-y divide-border max-h-[176px] overflow-y-auto">
                    {matchingLeads.map((lead) => (
                      <button
                        key={lead._id}
                        type="button"
                        onClick={() => chooseLead(lead)}
                        className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground truncate">{leadClientName(lead)}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {[lead.productInterest, lead.customer?.phone].filter(Boolean).join(' · ') || 'No service selected'}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              required
              autoFocus
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-shadow"
              value={title}
              // Free-typed titles stay letters/numbers only; a title that came
              // from the catalog keeps its punctuation intact.
              onChange={(e) => {
                setSelectedService(null);
                setTitle(e.target.value.replace(/[^A-Za-z0-9\s]/g, ""));
              }}
              placeholder="E.g., Prepare batch for production"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description <span className="text-muted-foreground font-normal normal-case">(optional)</span>
            </label>
            <textarea
              className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none resize-none h-20 transition-shadow"
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

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map((p) => {
                const active = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`flex items-center justify-center gap-1.5 h-9 rounded-lg border text-xs font-semibold transition-colors ${
                      active ? p.sel : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignment section */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Assign To <span className="text-red-500">*</span>
            </p>

            {/* Role filter — multi-select chips */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                Filter by Role {roleFilters.length > 0 && <span className="text-primary">({roleFilters.length} selected)</span>}
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleRoleFilter("all")}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                    roleFilters.length === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  All
                </button>
                {roleCategories.filter(r => r.value !== "all").map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => toggleRoleFilter(r.value)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                      roleFilters.includes(r.value) ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {r.label.replace(" Staff", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected staff chips */}
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

            {/* Search + person picker */}
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
                    {search ? "No staff match your search" : "No staff found for this role"}
                  </p>
                ) : (
                  filteredStaff.map((emp) => {
                    const uid  = emp.userId?._id;
                    if (!uid) return null;
                    const name = [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ") || "Unknown";
                    const isSelected = assignedToIds.includes(uid);
                    const initials = name.split(" ").map((n: string) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

                    return (
                      <div
                        key={uid}
                        onClick={() => toggleStaffSelection(uid)}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors border ${
                          isSelected ? "bg-primary/10 border-primary/20" : "hover:bg-muted/50 border-transparent"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
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
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <p className="text-[9px] text-muted-foreground italic">
                * At least one staff member must be selected.
              </p>
            </div>
          </div>

          {/* Follow-up tagging section (optional) */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Tag for Follow-up
                <span className="text-muted-foreground font-normal normal-case">(optional)</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Tagged people can track this task and add follow-up notes, but can't start or complete it.
              </p>
            </div>

            {/* Selected follower chips */}
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Followers ({followerIds.length} tagged)
                </label>
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

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  value={followerSearch}
                  onChange={(e) => setFollowerSearch(e.target.value)}
                  placeholder="Search staff to tag…"
                  className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-background text-xs focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
                />
              </div>

              <div className="bg-background border border-border rounded-lg max-h-36 overflow-y-auto p-1.5 space-y-1">
                {followerStaff.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground p-3 text-center italic">
                    {followerSearch ? "No staff match your search" : "No staff available to tag"}
                  </p>
                ) : (
                  followerStaff.map((emp) => {
                    const uid  = emp.userId?._id;
                    if (!uid) return null;
                    const name = [emp.userId?.name, emp.userId?.lastName].filter(Boolean).join(" ") || "Unknown";
                    const isSelected = followerIds.includes(uid);
                    const initials = name.split(" ").map((n: string) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

                    return (
                      <div
                        key={uid}
                        onClick={() => toggleFollowerSelection(uid)}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors border ${
                          isSelected ? "bg-amber-50 border-amber-200" : "hover:bg-muted/50 border-transparent"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isSelected ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                        }`}>
                          {initials || "?"}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className={`text-xs font-medium truncate ${isSelected ? "text-amber-700" : "text-foreground"}`}>
                            {name}
                          </span>
                          <span className="text-[9px] text-muted-foreground truncate uppercase tracking-tighter">
                            {emp.designation || emp.department || "Staff"}
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          isSelected ? "bg-amber-500 border-amber-500" : "border-muted-foreground/30"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
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
