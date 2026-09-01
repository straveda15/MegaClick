import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/context/AuthContext';
import AdminGuard, { RoleGuard } from '@/components/AdminGuard';
import AppLayout from '@/components/layout/AppLayout';

// ── Login flow ───────────────────────────────────────────────────────────────
import LoginPage from '@/pages/LoginPage';

// ── Business Ops: dashboard, leads, clients ──────────────────────────────────
import DashboardPage from '@/pages/DashboardPage';
import LeadsPage from '@/pages/LeadsPage';
import ClientsPage from '@/pages/ClientsPage';
import FollowUpsPage from '@/pages/FollowUpsPage';
import ServiceStepsPage from '@/pages/ServiceStepsPage';
import AccountsPage from '@/pages/AccountsPage'; // Added AccountsPage

// ── People: employees, attendance, leave ─────────────────────────────────────
import TeamManagementPage from '@/pages/TeamManagementPage';
import HrAttendancePage from '@/pages/HrAttendancePage';
import WorkLocationsPage from '@/pages/WorkLocationsPage';
import HrLeavePage from '@/pages/HrLeavePage';
import MyAttendancePage from '@/pages/MyAttendancePage';
import MyLeavePage from '@/pages/MyLeavePage';

// ── Task management ──────────────────────────────────────────────────────────
import TasksPage from '@/pages/TasksPage';
import TeamLogsPage from '@/pages/TeamLogsPage';

import NotFound from '@/pages/NotFound';

// ─────────────────────────────────────────────────────────────────────────────

const queryClient = new QueryClient();

// `/` lands on the overview dashboard, which every authenticated user can reach.
const HomeRoute = () => <Navigate to="/dashboard" replace />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected — authenticated users (admin + employee).          */}
            {/* AdminGuard redirects unauthenticated visitors to /login.     */}
            {/* RoleGuard on each route enforces per-path RBAC for employees */}
            {/* and is a no-op for admins.                                   */}
            <Route
              path="/*"
              element={
                <AdminGuard>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<HomeRoute />} />

                      {/* ── Business Ops ───────────────────────────────── */}
                      <Route
                        path="/dashboard"
                        element={<RoleGuard><DashboardPage /></RoleGuard>}
                      />
                      <Route
                        path="/leads"
                        element={<RoleGuard><LeadsPage /></RoleGuard>}
                      />
                      {/* The Services page became Leads — keep old links working. */}
                      <Route path="/services" element={<Navigate to="/leads" replace />} />
                      <Route
                        path="/clients"
                        element={<RoleGuard><ClientsPage /></RoleGuard>}
                      />
                      {/* Everything owed a call back, across leads and clients. */}
                      <Route
                        path="/follow-ups"
                        element={<RoleGuard><FollowUpsPage /></RoleGuard>}
                      />
                      {/* Where each service's step checklist is defined —
                          preloaded into the assign screen on the Leads page. */}
                      <Route
                        path="/service-steps"
                        element={<RoleGuard><ServiceStepsPage /></RoleGuard>}
                      />
                      <Route
                        path="/accounts"
                        element={<RoleGuard><AccountsPage /></RoleGuard>}
                      />

                      {/* ── Tasks ──────────────────────────────────────── */}
                      <Route
                        path="/tasks"
                        element={<RoleGuard><TasksPage /></RoleGuard>}
                      />
                      <Route
                        path="/tasks/team-logs"
                        element={<RoleGuard><TeamLogsPage /></RoleGuard>}
                      />

                      {/* ── People ─────────────────────────────────────── */}
                      <Route
                        path="/employees"
                        element={<RoleGuard><TeamManagementPage /></RoleGuard>}
                      />
                      <Route
                        path="/people/hr"
                        element={<RoleGuard><HrLeavePage /></RoleGuard>}
                      />
                      <Route
                        path="/people/attendance"
                        element={<RoleGuard><HrAttendancePage /></RoleGuard>}
                      />
                      <Route
                        path="/people/work-locations"
                        element={<RoleGuard><WorkLocationsPage /></RoleGuard>}
                      />

                      {/* ── Self Service ───────────────────────────────── */}
                      <Route
                        path="/self/attendance"
                        element={<RoleGuard><MyAttendancePage /></RoleGuard>}
                      />
                      <Route
                        path="/self/leaves"
                        element={<RoleGuard><MyLeavePage /></RoleGuard>}
                      />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </AdminGuard>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
