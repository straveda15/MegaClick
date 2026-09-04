import { useState, useMemo, useEffect } from "react";
import GenericPage from "@/components/GenericPage";
import { useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/useUsers";
import { useMyTasks } from "@/hooks/useTasks";
import {
  useTeam,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  EmployeeProfile,
} from "@/hooks/useTeam";
import { toast } from "sonner";
import { DASHBOARD_PAGES } from "@/store/sidebarStore";
import ModalPortal from "@/components/ui/ModalPortal";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type DeptValue = "hr" | "sales" | "business_analyst" | "accountant" | "manager" | "advocate";

interface FormState {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  // Designation
  departmentRole: DeptValue | "";
  designation: string;
  joiningDate: string;
  status: "Active" | "Inactive";
  // Permissions
  allowedPaths: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPT_OPTIONS: { value: DeptValue; label: string }[] = [
  { value: "hr", label: "HR" },
  { value: "sales", label: "Sales" },
  { value: "business_analyst", label: "Business Analyst" },
  { value: "accountant", label: "Accountant" },
  { value: "manager", label: "Manager" },
  { value: "advocate", label: "Advocate" },
];

// Fragment tabs — "ALL" plus one per department
const DEPT_TABS = [
  "ALL",
  "HR",
  "SALES",
  "BUSINESS ANALYST",
  "ACCOUNTANT",
  "MANAGER",
  "ADVOCATE",
] as const;
type DeptTab = (typeof DEPT_TABS)[number];

// Map tab label → departmentRole value for filtering
const TAB_TO_ROLE: Record<DeptTab, DeptValue | null> = {
  ALL: null,
  HR: "hr",
  SALES: "sales",
  "BUSINESS ANALYST": "business_analyst",
  ACCOUNTANT: "accountant",
  MANAGER: "manager",
  ADVOCATE: "advocate",
};

const DEPT_TO_PATHS: Record<DeptValue, string[]> = {
  advocate: [
    "/",
    "/dashboard",
    "/self/attendance",
    "/self/leaves",
    "/tasks",
    "/clients",
  ],
  hr: [
    "/",
    "/dashboard",
    "/self/attendance",
    "/self/leaves",
    "/people/hr",
    "/people/attendance",
    "/tasks",
  ],
  sales: [
    "/",
    "/dashboard",
    "/self/attendance",
    "/self/leaves",
    "/tasks",
    "/orders",
    "/returns",
    "/marketing/overview",
    "/masters/customers",
  ],
  business_analyst: [
    "/",
    "/dashboard",
    "/self/attendance",
    "/self/leaves",
    "/tasks",
    "/analytics/overview",
    "/analytics/pnl",
    "/analytics/pnl-inputs",
  ],
  accountant: [
    "/",
    "/dashboard",
    "/self/attendance",
    "/self/leaves",
    "/tasks",
    "/operations/transactions",
    "/operations/vendors",
    "/refunds",
    "/ecommerce/website",
    "/ecommerce/coupons",
    "/masters/products",
  ],
  manager: [
    "/",
    "/dashboard",
    "/self/attendance",
    "/self/leaves",
    "/tasks",
    "/orders",
    "/packaging",
    "/dispatch",
    "/returns",
    "/refunds",
    "/operations/batches",
    "/operations/inventory",
    "/operations/vendors",
    "/operations/vendor-orders",
    "/operations/transactions",
    "/analytics/overview",
    "/analytics/product-costs",
    "/analytics/pnl",
    "/analytics/pnl-inputs",
    "/people/team",
    "/people/hr",
    "/people/attendance",
    "/people/work-locations",
  ],
};

const todayStr = new Date().toISOString().split("T")[0];

// Default pages pre-selected for a new team member. All permissions are freely
// toggleable — these are only a sensible starting set, not a hard requirement.
const DEFAULT_PATHS = ["/", "/dashboard", "/self/attendance", "/self/leaves", "/tasks"];

const emptyForm = (): FormState => ({
  name: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  departmentRole: "",
  designation: "",
  joiningDate: todayStr,
  status: "Active",
  allowedPaths: [...DEFAULT_PATHS],
});

// ─── Grouped page permissions ─────────────────────────────────────────────────

const PAGE_SECTIONS = Array.from(
  DASHBOARD_PAGES.reduce((map, page) => {
    if (!map.has(page.section)) map.set(page.section, []);
    map.get(page.section)!.push(page);
    return map;
  }, new Map<string, typeof DASHBOARD_PAGES>()),
);

// ─── Permissions Checkbox Panel ───────────────────────────────────────────────

const PermissionsPanel = ({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (paths: string[]) => void;
}) => {
  const toggle = (path: string) => {
    onChange(
      selected.includes(path)
        ? selected.filter((p) => p !== path)
        : [...selected, path],
    );
  };

  const toggleSection = (paths: string[]) => {
    const allSelected = paths.every((p) => selected.includes(p));
    if (allSelected) {
      onChange(selected.filter((p) => !paths.includes(p)));
    } else {
      const newPaths = paths.filter((p) => !selected.includes(p));
      onChange([...selected, ...newPaths]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {PAGE_SECTIONS.map(([section, pages]) => {
        const paths = pages.map((p) => p.path);
        const allChecked = paths.every((p) => selected.includes(p));
        const someChecked = paths.some((p) => selected.includes(p));
        return (
          <div key={section}>
            {/* Section header + "select all" toggle */}
            <label className="flex items-center gap-2 mb-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="accent-primary w-3.5 h-3.5"
                checked={allChecked}
                ref={(el) => {
                  if (el) el.indeterminate = someChecked && !allChecked;
                }}
                onChange={() => toggleSection(paths)}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {section}
              </span>
            </label>
            <div className="grid grid-cols-2 gap-1.5 pl-2">
              {pages.map((page) => {
                const checked = selected.includes(page.path);
                return (
                  <label
                    key={page.path}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs transition-colors cursor-pointer
                      ${
                        checked
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border bg-muted/20 text-foreground hover:bg-muted/50"
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-primary w-3 h-3"
                      checked={checked}
                      onChange={() => toggle(page.path)}
                    />
                    <span className="flex-1">{page.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalSection = "account" | "designation" | "permissions";

interface ModalProps {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  isEditing: boolean;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

const EmployeeModal = ({
  title,
  onClose,
  onSubmit,
  isEditing,
  form,
  setForm,
}: ModalProps) => {
  const [activeSection, setActiveSection] = useState<ModalSection>("account");
  const [showPassword, setShowPassword] = useState(false);

  const field = (
    key: keyof FormState,
    label: string,
    type = "text",
    placeholder?: string,
    opts: { maxLength?: number; sanitize?: (v: string) => string; required?: boolean; max?: string } = {},
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label} {opts.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        maxLength={opts.maxLength}
        max={opts.max}
        className="h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        value={(form[key] as string) || ""}
        placeholder={placeholder}
        onChange={(e) => {
          const raw = e.target.value;
          const next = opts.sanitize ? opts.sanitize(raw) : raw;
          setForm((prev) => ({ ...prev, [key]: next }));
        }}
      />
    </div>
  );

  // Local-time YYYY-MM-DD (avoids the UTC shift that toISOString() introduces).
  const _t = new Date();
  const todayISO = `${_t.getFullYear()}-${String(_t.getMonth() + 1).padStart(2, "0")}-${String(_t.getDate()).padStart(2, "0")}`;
  // Sanitisers
  const onlyName = (v: string) => v.replace(/[^A-Za-z\s]/g, "");
  // Designation: letters and spaces only. Digits, punctuation and symbols are stripped.
  const onlyDesignation = (v: string) => v.replace(/[^A-Za-z\s]/g, "");

  const TABS: { id: ModalSection; label: string; step: string }[] = [
    { id: "account", label: "Account Information", step: "1" },
    { id: "designation", label: "Designation", step: "2" },
    { id: "permissions", label: "Permissions", step: "3" },
  ];

  // Runs all client-side validations, jumps back to the failing section, and
  // only invokes the parent's onSubmit when everything passes.
  const validateAndSubmit = () => {
    const fail = (section: ModalSection, message: string) => {
      setActiveSection(section);
      toast.error(message);
      return false;
    };

    const name = form.name.trim();
    if (!name) return fail("account", "First name is required");
    if (name.length < 2) return fail("account", "First name must be at least 2 characters");
    if (!/^[A-Za-z\s]+$/.test(name)) return fail("account", "First name can only contain letters");

    const lastName = form.lastName.trim();
    if (lastName && !/^[A-Za-z\s]+$/.test(lastName))
      return fail("account", "Last name can only contain letters");

    if (!form.email && !form.phone)
      return fail("account", "Either an email or phone number is required");

    if (form.email && !/^(?=.*[A-Za-z0-9])[A-Za-z0-9._+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(form.email.trim()))
      return fail("account", "Please enter a valid email address");

    if (form.phone) {
      const digits = form.phone.replace("+91", "");
      if (digits.length !== 10) return fail("account", "Phone number must be exactly 10 digits");
      if (!/^[6-9]\d{9}$/.test(digits))
        return fail("account", "Indian mobile must start with 6, 7, 8 or 9");
      if (/^(\d)\1{9}$/.test(digits))
        return fail("account", "Phone number cannot be all the same digit");
    }

    if (!isEditing) {
      if (!form.password || form.password.length < 6)
        return fail("account", "Password must be at least 6 characters");
    } else if (form.password && form.password.length < 6) {
      return fail("account", "Password must be at least 6 characters");
    }

    if (!form.departmentRole) return fail("designation", "Department is required");

    const designation = form.designation.trim();
    if (!designation) return fail("designation", "Designation is required");
    if (designation.length < 2)
      return fail("designation", "Designation must be at least 2 characters");
    if (designation.length > 80)
      return fail("designation", "Designation must be 80 characters or fewer");
    if (/[^A-Za-z\s]/.test(designation))
      return fail("designation", "Designation can only contain letters");

    if (!form.joiningDate) return fail("designation", "Joining date is required");
    if (form.joiningDate > todayISO)
      return fail("designation", "Joining date cannot be in the future");

    if (form.allowedPaths.length === 0)
      return fail("permissions", "At least one page permission must be selected");

    onSubmit();
    return true;
  };

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Step tabs */}
        <div className="flex border-b border-border shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold transition-colors
                ${
                  activeSection === tab.id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                ${activeSection === tab.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {tab.step}
              </span>
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto flex-1">
          {/* ── Section 1: Account Information */}
          {activeSection === "account" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-primary">
                Account Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {field("name", "First Name", "text", undefined, { maxLength: 50, sanitize: onlyName, required: true })}
                {field("lastName", "Last Name", "text", undefined, { maxLength: 50, sanitize: onlyName })}
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Email
                  </label>

                  <input
                    type="email"
                    autoComplete="off"
                    maxLength={100}
                    className="h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    value={form.email || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        // Allow valid email characters only: letters, digits,
                        // dot, underscore, @, plus and hyphen are valid per RFC.
                        // Garbage like spaces, #, $, *, parentheses, etc. is stripped.
                        email: e.target.value.replace(/[^A-Za-z0-9._@+\-]/g, "").toLowerCase(),
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Phone
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                      +91
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={10}
                      value={form.phone?.replace("+91", "") || ""}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);

                        setForm((prev) => ({
                          ...prev,
                          phone: value ? `+91${value}` : "",
                        }));
                      }}
                      className="w-full h-12 pl-14 pr-4 rounded-xl border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>
              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Password {!isEditing && <span className="text-red-500">*</span>}
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    maxLength={64}
                    placeholder={
                      isEditing ? "Leave blank to keep current" : "Set password"
                    }
                    className="h-9 w-full pl-3 pr-10 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    value={form.password || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {isEditing ? "Leave blank to keep current; otherwise min 6 characters" : "Min 6 characters"}
                </span>
              </div>
            </div>
          )}

          {/* ── Section 2: Designation */}
          {activeSection === "designation" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-primary">
                Designation
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Department dropdown */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    value={form.departmentRole}
                    onChange={(e) => {
                      const dept = e.target.value as DeptValue;
                      setForm((prev) => ({
                        ...prev,
                        departmentRole: dept,
                        allowedPaths: dept ? DEPT_TO_PATHS[dept] : [...DEFAULT_PATHS],
                      }));
                    }}
                  >
                    <option value="">Select department…</option>
                    {DEPT_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                {field("designation", "Designation", "text", undefined, { maxLength: 80, sanitize: onlyDesignation, required: true })}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {field("joiningDate", "Joining Date", "date", undefined, { required: true, max: todayISO })}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    className="h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as "Active" | "Inactive",
                      }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── Section 3: Permissions */}
          {activeSection === "permissions" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary">
                  Page Permissions
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        allowedPaths: DASHBOARD_PAGES.map((p) => p.path),
                      }))
                    }
                    className="text-[11px] px-2.5 py-1 rounded border border-border hover:bg-muted/50 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() =>
                      setForm((prev) => ({ ...prev, allowedPaths: [] }))
                    }
                    className="text-[11px] px-2.5 py-1 rounded border border-border hover:bg-muted/50 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Select the pages this team member can see and access after
                login. Unselected pages will be hidden and inaccessible.
              </p>
              <div className="mt-2">
                <PermissionsPanel
                  selected={form.allowedPaths}
                  onChange={(paths) =>
                    setForm((prev) => ({ ...prev, allowedPaths: paths }))
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20 shrink-0">
          <div className="flex gap-2">
            {activeSection !== "account" && (
              <button
                onClick={() =>
                  setActiveSection(
                    activeSection === "permissions" ? "designation" : "account",
                  )
                }
                className="h-9 px-4 rounded-md border border-border text-sm hover:bg-muted/50 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded-md border border-border text-sm hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
            {activeSection !== "permissions" ? (
              <button
                onClick={() =>
                  setActiveSection(
                    activeSection === "account" ? "designation" : "permissions",
                  )
                }
                className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={validateAndSubmit}
                className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Save Member
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const TeamManagementPage = () => {
  const { data: employees = [], isLoading } = useTeam();
  const { data: tasks = [] } = useMyTasks({ view: "all" });

  /**
   * Assigned / completed / pending per person, off the task board itself.
   * Cancelled work is left out of all three — it was called off, so counting it
   * as assigned would permanently depress everyone's completion figures.
   */
  const taskCounts = useMemo(() => {
    const counts = new Map<string, { assigned: number; completed: number; pending: number }>();

    for (const task of tasks) {
      if (task.status === "cancelled") continue;

      const id = String(task.assignedTo?._id ?? "");
      if (!id) continue;

      const entry = counts.get(id) ?? { assigned: 0, completed: 0, pending: 0 };
      entry.assigned += 1;
      if (task.status === "completed") entry.completed += 1;
      else entry.pending += 1;
      counts.set(id, entry);
    }

    return counts;
  }, [tasks]);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lock background page scroll while the Add/Edit Team Member modal is open.
  useEffect(() => {
    if (!isModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isModalOpen]);

  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [activeTab, setActiveTab] = useState<DeptTab>("ALL");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    profileId: string;
    userId: string;
    name: string;
  } | null>(null);

  // Filter: only team members (have a departmentRole)
  const team = employees.filter((e) => {
    const u = e.userId;
    if (!u) return false;
    return u.departmentRole && u.departmentRole !== "";
  });

  // Fragment filtering by tab
  const filtered = useMemo(() => {
    const roleFilter = TAB_TO_ROLE[activeTab];
    if (!roleFilter) return team;
    return team.filter((e) => e.userId?.departmentRole === roleFilter);
  }, [team, activeTab]);

  const openCreate = () => {
    setEditingProfileId(null);
    setEditingUserId(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEdit = (emp: EmployeeProfile) => {
    setEditingProfileId(emp._id);
    const u = emp.userId;
    setEditingUserId(u?._id || null);
    setForm({
      name: u?.name ?? "",
      lastName: u?.lastName ?? "",
      email: u?.email ?? "",
      phone: u?.phone ?? "",
      password: "",
      departmentRole: (u?.departmentRole as DeptValue) || "",
      designation: emp.designation ?? "",
      joiningDate: emp.joiningDate
        ? new Date(emp.joiningDate).toISOString().split("T")[0]
        : "",
      status: emp.status === "active" ? "Active" : "Inactive",
      allowedPaths: u?.allowedPaths && u.allowedPaths.length > 0
        ? (u.allowedPaths as string[])
        : (u?.departmentRole ? DEPT_TO_PATHS[u.departmentRole as DeptValue] : [...DEFAULT_PATHS]),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProfileId(null);
    setEditingUserId(null);
  };

  const handleSubmit = async () => {
    const loadingToast = toast.loading(
      editingProfileId ? "Updating member…" : "Adding member…",
    );

    try {
      const userPayload = {
        name: form.name.trim(),
        lastName: form.lastName.trim() || undefined,
        email: form.email.trim().toLowerCase() || undefined,
        phone: form.phone.trim() || undefined,
        password: form.password?.trim() || undefined,
        role: "employee" as const,
        departmentRole: form.departmentRole || undefined,
        operationalRoles: [],
        allowedPaths: form.allowedPaths,
        isActive: form.status === "Active",
      };

      if (editingProfileId && editingUserId) {
        await updateUser.mutateAsync({ id: editingUserId, body: userPayload });
        await updateEmployee.mutateAsync({
          id: editingProfileId,
          body: {
            designation: form.designation,
            joiningDate: form.joiningDate,
            status: form.status === "Active" ? "active" : "inactive",
          },
        });
        toast.success("Member updated successfully", { id: loadingToast });
      } else {
        if (!form.password)
          throw new Error("Password is required for new accounts");
        if (!form.email && !form.phone)
          throw new Error("Either an email or phone number is required");
        if (!form.departmentRole) throw new Error("Department is required");
        if (!form.designation) throw new Error("Designation is required");
        if (!form.joiningDate) throw new Error("Joining date is required");
        if (form.allowedPaths.length === 0)
          throw new Error("At least one page permission must be selected");
        if (form.phone) {
          const phoneDigits = form.phone.replace("+91", "");
            if (phoneDigits.length < 10) {throw new Error("Phone number must be exactly 10 digits");}
        }

        const newUser = await createUser.mutateAsync(userPayload);
        await createEmployee.mutateAsync({
          userId: newUser._id,
          designation: form.designation,
          joiningDate: form.joiningDate,
          department:
            DEPT_OPTIONS.find((d) => d.value === form.departmentRole)?.label ||
            form.departmentRole,
        });
        toast.success("Member added successfully", { id: loadingToast });
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to save changes", {
        id: loadingToast,
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const { profileId, userId } = deleteConfirm;
    const loadingToast = toast.loading("Deleting member…");
    try {
      if (profileId) await deleteEmployee.mutateAsync(profileId);
      if (userId) await deleteUser.mutateAsync(userId);
      toast.success("Member removed", { id: loadingToast });
      setDeleteConfirm(null);
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  const deptLabel = (role: string) =>
    DEPT_OPTIONS.find((d) => d.value === role)?.label ?? role;

  useEffect(() => {
    const handleOpen = () => openCreate();
    window.addEventListener('openAddEmployeeModal', handleOpen);
    return () => window.removeEventListener('openAddEmployeeModal', handleOpen);
  }, []);

  return (
    <div className="space-y-5">
      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap">Employee ID</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap">Department</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap">Designation</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap">Contact</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap">Joined</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap">Assigned</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap">Completed</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap">Pending</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-muted-foreground italic">Fetching employee data…</td>
                </tr>
              ) : team.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-muted-foreground italic">No employees found.</td>
                </tr>
              ) : (
                team.map((e) => {
                  const u = e.userId;
                  if (!u) return null;
                  
                  // Their real task counts, off the same board the Tasks page reads.
                  const counts = taskCounts.get(String(u._id)) ?? { assigned: 0, completed: 0, pending: 0 };
                  const initial = `${u.name?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase();

                  return (
                    <tr key={e._id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => openEdit(e)}>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{e.employeeId}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {initial}
                          </div>
                          <span className="font-semibold text-foreground text-sm">{u.name} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-sm capitalize">{u.departmentRole ? deptLabel(u.departmentRole) : "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-sm">{e.designation || "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs font-medium text-foreground">{u.phone ? `+91 ${u.phone.replace('+91', '')}` : '—'}</div>
                        <div className="text-[11px] text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                        {e.joiningDate ? e.joiningDate.split('T')[0] : "—"}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap font-medium text-blue-600">{counts.assigned}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap font-medium text-emerald-600">{counts.completed}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap font-medium text-amber-600">{counts.pending}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${e.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          {e.status === 'active' ? 'Active' : 'On Leave'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <EmployeeModal
          title={editingProfileId ? "Edit Employee" : "Add Employee"}
          isEditing={!!editingProfileId}
          form={form}
          setForm={setForm}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent className="rounded-3xl max-w-md border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-2">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              Remove employee?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[14px]">
              Remove {deleteConfirm?.name}? This will delete their profile and
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl font-bold border-none bg-muted hover:bg-muted/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamManagementPage;
