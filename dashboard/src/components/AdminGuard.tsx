import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isPathAllowedForRole } from '@/store/sidebarStore';

// ─── AuthGuard ────────────────────────────────────────────────────────────────
//
// Replaces the old AdminGuard.  Gates the entire app shell:
//   • Unauthenticated users  → /login
//   • Admins                 → always allowed through
//   • Employees              → allowed through (per-route access is handled by
//                              RoleGuard further down the tree)
//   • Any other role         → /login  (future-proof)
//
// Keep the component name "AdminGuard" so existing imports in App.tsx don't
// need to change, but it now handles both admins and employees.

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!user || !['admin', 'employee', 'production_staff', 'dispatch_staff'].includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;

// ─── RoleGuard ────────────────────────────────────────────────────────────────
//
// Wraps individual routes inside the app shell.
// Usage in App.tsx:
//
//   <Route
//     path="/orders"
//     element={
//       <RoleGuard>
//         <OrdersPage />
//       </RoleGuard>
//     }
//   />
//
// Behaviour:
//   • Admin              → always allowed
//   • Employee with matching currentOperationalRole → allowed
//   • Employee without permission → "Access Denied" screen (no redirect,
//     so the URL stays visible and they understand what happened)
//
// The allowed-path logic lives entirely in sidebarStore so the nav and the
// guard always stay in sync — one source of truth.

export const RoleGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Parent AuthGuard already shows the spinner

  // Admins are never blocked
  if (user?.role === 'admin' || location.pathname === '/') return <>{children}</>;

  // Employees & Staff: check their currentOperationalRole against the current path
  const isAllowedRole = ['employee', 'production_staff', 'dispatch_staff'].includes(user?.role || '');
  if (
    isAllowedRole &&
    isPathAllowedForRole(location.pathname, user?.currentOperationalRole, user?.departmentRole, user?.role, user?.allowedPaths)
  ) {
    return <>{children}</>;
  }

  // ── Access Denied UI ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6">
      {/* Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-destructive"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        {/* Decorative ring */}
        <div className="absolute -inset-1.5 rounded-[18px] border border-destructive/20 pointer-events-none" />
      </div>

      {/* Copy */}
      <div className="space-y-2 max-w-sm">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Access Denied
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your current role does not have permission to view this page.
        </p>
        <p className="text-xs text-muted-foreground">
          Contact your administrator if you believe this is a mistake.
        </p>
      </div>
    </div>
  );
};