import { Search, Bell, Menu, LogOut, ChevronDown, AlertCircle, CheckCircle2, Plus, FileText, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useSidebarStore } from "@/store/sidebarStore";
import { useAuth } from "@/context/AuthContext";
import { MOCK_NOTIFICATIONS } from "@/data/mockNotifications";

const Topbar = () => {
  const { toggleSidebar, toggleMobileSidebar } = useSidebarStore();
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const hasUnreadNotifications = MOCK_NOTIFICATIONS.some((n) => !n.read);

  const initials = user
    ? `${user.name?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const isEmployee = user?.role === "employee";
  const hasRoles = isEmployee && user.operationalRoles.length > 0;
  const currentRole = user?.currentOperationalRole;
  const needsRoleSelection = isEmployee && hasRoles && !currentRole;

  const handleRoleSwitch = async (role: string) => {
    if (role === currentRole || switchingRole) return;
    setRoleError(null);
    setSwitchingRole(role);
    try {
      await switchRole(role);
      setRoleMenuOpen(false);
    } catch (err: unknown) {
      setRoleError(err instanceof Error ? err.message : "Failed to switch role.");
    } finally {
      setSwitchingRole(null);
    }
  };

  const getPageTitle = () => {
    const routeMap: Record<string, string> = {
      '/': 'Dashboard',
      '/clients': 'Clients',
      '/leads': 'Leads',
      '/tasks': 'Tasks',
      '/employees': 'Employees',
      '/departments': 'Departments',
      '/reports': 'Reports',
      '/notifications': 'Notifications',
      '/settings': 'Settings',
      '/attendance': 'Attendance',
      '/leave': 'Leave',
    };
    const exact = routeMap[location.pathname];
    if (exact) return exact;
    const seg = location.pathname.split('/')[1];
    return seg ? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ') : '';
  };

  return (
    <header className="h-[var(--topbar-height)] border-b border-border bg-card flex items-center px-4 gap-4 sticky top-0 z-30">

      {/* Sidebar Toggles */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (window.innerWidth < 1024) {
              toggleMobileSidebar();
            } else {
              toggleSidebar();
            }
          }}
          className="p-1.5 rounded-md hover:bg-muted transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground hidden sm:block shrink-0">{getPageTitle()}</h1>
      </div>

      {/* Search — UI-only stub; no unified search API exists yet */}
      <div className="flex-1 max-w-xl hidden sm:block ml-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads, clients, tasks, employees..."
            className="w-full h-9 pl-9 pr-4 rounded-md border border-border bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Mobile Search — stub, matches desktop */}
      <button
        onClick={() => toast.info("Search is coming soon.")}
        className="sm:hidden p-2 rounded-md hover:bg-muted transition-colors ml-auto"
      >
        <Search className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Context-aware CTA button */}
      <div className="hidden sm:flex items-center gap-2">
        {location.pathname === '/leads' && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openAddLeadModal'))}
            className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        )}
        {location.pathname === '/clients' && (
          <button
            onClick={() => toast.info('Add Client is coming soon.')}
            className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Client
          </button>
        )}
        {location.pathname === '/employees' && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openAddEmployeeModal'))}
            className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        )}
        {location.pathname === '/reports' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info('Export PDF coming soon.')}
              className="flex items-center gap-1.5 h-9 px-4 rounded-full border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={() => toast.info('Export Excel coming soon.')}
              className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">

        {/* ── Active Role Switcher (employees only if they have operational roles) ── */}
        {isEmployee && hasRoles && (
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setRoleMenuOpen((v) => !v);
                setRoleError(null);
              }}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs font-medium transition-colors ${needsRoleSelection
                  ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 animate-pulse"
                  : "border-border bg-muted/40 text-foreground hover:bg-muted"
                }`}
            >
              {needsRoleSelection ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Select Role
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <span className="capitalize">{currentRole}</span>
                </>
              )}
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {roleMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setRoleMenuOpen(false)} />
                <div className="absolute left-0 top-full mt-1 w-52 bg-card border border-border rounded-lg shadow-md z-20 py-1">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Active Operational Role
                    </p>
                    {needsRoleSelection && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                        Please select a role to continue.
                      </p>
                    )}
                  </div>

                  {hasRoles ? (
                    user.operationalRoles.map((role) => {
                      const isActive = role === currentRole;
                      const isLoading = switchingRole === role;
                      return (
                        <button
                          key={role}
                          onClick={() => handleRoleSwitch(role)}
                          disabled={!!switchingRole}
                          className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors disabled:opacity-60 ${isActive
                              ? "bg-primary/5 text-primary font-medium"
                              : "text-foreground hover:bg-muted"
                            }`}
                        >
                          <span className="capitalize">{role}</span>
                          {isLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                          ) : isActive ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : null}
                        </button>
                      );
                    })
                  ) : (
                    <p className="px-3 py-3 text-xs text-muted-foreground">
                      No operational roles assigned.
                    </p>
                  )}

                  {roleError && (
                    <div className="px-3 py-2 border-t border-border">
                      <p className="text-xs text-destructive">{roleError}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-md hover:bg-muted transition-colors"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {hasUnreadNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md hover:bg-muted px-2 py-1 transition-colors"
          >
            {/* Avatar: amber ring if employee needs to select a role */}
            <div
              className={`w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0 ${needsRoleSelection ? "ring-2 ring-amber-400 ring-offset-1" : ""
                }`}
            >
              {initials}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-xs font-medium text-foreground">
                {user?.name} {user?.lastName}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize">
                {(user?.departmentRole || user?.role || "").replace(/_/g, " ")}
                {currentRole && ` · ${currentRole}`}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-lg shadow-md z-20 py-1">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-medium text-foreground">
                    {user?.name} {user?.lastName}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {user?.email || user?.phone}
                  </p>
                  <p className="text-[11px] text-muted-foreground capitalize mt-0.5">
                    {(user?.departmentRole || user?.role || "").replace(/_/g, " ")}
                    {currentRole && (
                      <span className="ml-1 font-medium text-primary">· {currentRole}</span>
                    )}
                  </p>
                </div>

                {/* Mobile-only role switcher */}
                {isEmployee && hasRoles && (
                  <div className="sm:hidden border-b border-border">
                    <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Switch Role
                    </p>
                    {user.operationalRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          handleRoleSwitch(role);
                          setMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-sm transition-colors ${role === currentRole
                            ? "text-primary font-medium"
                            : "text-foreground hover:bg-muted"
                          }`}
                      >
                        <span className="capitalize">{role}</span>
                        {role === currentRole && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
