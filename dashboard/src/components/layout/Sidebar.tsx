import { NavLink, useLocation } from 'react-router-dom';
import { useSidebarStore, ALL_SECTIONS, getSectionsForRole } from '@/store/sidebarStore';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebarStore();
  const { user } = useAuth();
  const location = useLocation();

  // ── Derive the sections this user may see ──────────────────────────────────
  //
  //  • admin            → every section / item (ALL_SECTIONS)
  //  • employee         → only items allowed for their currentOperationalRole
  //  • unauthenticated  → nothing (sidebar shouldn't render, but safe fallback)
  //
  const sections =
    !user
      ? []
      : user.role === 'admin'
        ? ALL_SECTIONS.filter(s => s.label !== 'Self Service')
        : getSectionsForRole(user.currentOperationalRole, user.departmentRole, user.role, user.allowedPaths);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          ${collapsed ? 'w-14' : 'w-[230px]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200
          fixed lg:sticky top-0 z-50 lg:z-30 shrink-0
        `}
      >
        {/* Brand */}
        <div
          className={`h-[var(--topbar-height)] flex items-center gap-3 border-b border-sidebar-border ${collapsed ? 'justify-center px-2' : 'px-4'
            }`}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold shrink-0">
            M
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-foreground leading-tight">
                MegaClick
              </span>
              <span className="text-[10px] text-muted-foreground -mt-0.5">
                Business Ops
              </span>
            </div>
          )}
        </div>

        {/* Role badge (employees & staff only, non-collapsed) */}
        {!collapsed && 
         (user?.role === 'employee' || ['production_staff', 'dispatch_staff'].includes(user?.role || '')) && (
          <div className="px-4 py-2 border-b border-sidebar-border">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {(user.departmentRole || user.currentOperationalRole || user.role).replace(/_/g, ' ')}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
          {sections.length === 0 ? (
            // Shouldn't happen in practice, but safe fallback
            <p className="px-4 py-3 text-xs text-muted-foreground">
              No navigation available.
            </p>
          ) : (
            sections.map((section) => (
              <div key={section.label}>
                <div className="h-2" />

                {section.items.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== '/' &&
                      location.pathname.startsWith(item.path));

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        flex items-center gap-2.5 h-9 mx-1.5 rounded-md text-[13px] transition-colors
                        ${collapsed ? 'justify-center px-0' : 'px-3'}
                        ${isActive
                          ? 'bg-accent text-accent-foreground font-medium border-l-[3px] border-primary'
                          : 'text-sidebar-foreground hover:bg-muted'
                        }
                      `}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))
          )}
        </nav>

        {/* Footer */}
        <div
          className={`py-3 border-t border-sidebar-border ${collapsed ? 'text-center' : 'px-4'
            }`}
        >
          <span className="text-[10px] text-muted-foreground">
            {collapsed ? '©' : '© 2026 MegaClick'}
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;