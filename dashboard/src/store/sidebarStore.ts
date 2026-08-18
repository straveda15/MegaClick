import { create } from 'zustand';
import {
  LayoutDashboard, Target, Users, ListTodo, ClipboardList, ListChecks, PhoneCall,
  UsersRound, CalendarCheck, MapPin, Building2, BarChart3, Bell, Settings,
  type LucideIcon,
} from 'lucide-react';

// ─── Nav Shape ────────────────────────────────────────────────────────────────

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

// ─── Master Nav (admin sees ALL of this) ──────────────────────────────────────
//
// Rendered as a flat list (no visible section headers — see Sidebar.tsx) except
// for 'Self Service', which stays its own section for employees only.

export const ALL_SECTIONS: NavSection[] = [
  {
    label: 'Main',
    items: [
      { title: 'Dashboard',       path: '/dashboard',             icon: LayoutDashboard },
      { title: 'Leads',           path: '/leads',                  icon: Target },
      { title: 'Clients',         path: '/clients',                icon: Users },
      { title: 'Follow Ups',      path: '/follow-ups',             icon: PhoneCall },
      { title: 'Tasks',           path: '/tasks',                  icon: ListTodo },
      { title: 'Service Steps',   path: '/service-steps',          icon: ListChecks },
      // Admin/founder/cofounder only — stripped for other roles in getSectionsForRole.
      { title: 'Team Logs',       path: '/tasks/team-logs',        icon: ClipboardList },
      { title: 'Employees',       path: '/employees',              icon: UsersRound },
      { title: 'HR & Leave',      path: '/people/hr',              icon: UsersRound },
      { title: 'Attendance',      path: '/people/attendance',      icon: CalendarCheck },
      { title: 'Work Locations',  path: '/people/work-locations',  icon: MapPin },
      { title: 'Departments',     path: '/departments',            icon: Building2 },
      { title: 'Reports',         path: '/reports',                icon: BarChart3 },
      { title: 'Notifications',   path: '/notifications',          icon: Bell },
      { title: 'Settings',        path: '/settings',               icon: Settings },
    ],
  },
  {
    label: 'Self Service',
    items: [
      { title: 'My Attendance', path: '/self/attendance', icon: CalendarCheck },
      { title: 'My Leaves',     path: '/self/leaves',     icon: UsersRound },
    ],
  },
];

// ─── Flat page list for Permissions checkboxes ───────────────────────────────
//
// Used in Team/Staff Management modals to render the permission checkboxes.
// DASHBOARD_PAGES = every page a team member can be granted.

export interface PagePermission {
  label: string;
  path: string;
  section: string;
}

export const DASHBOARD_PAGES: PagePermission[] = [
  { section: 'Business Ops', label: 'Dashboard',        path: '/dashboard' },
  { section: 'Business Ops', label: 'Leads',            path: '/leads' },
  { section: 'Business Ops', label: 'Clients',          path: '/clients' },
  { section: 'Business Ops', label: 'Follow Ups',       path: '/follow-ups' },
  { section: 'Business Ops', label: 'Service Steps',    path: '/service-steps' },
  { section: 'Business Ops', label: 'Departments',      path: '/departments' },
  { section: 'Business Ops', label: 'Reports',          path: '/reports' },
  { section: 'Business Ops', label: 'Notifications',    path: '/notifications' },
  { section: 'Business Ops', label: 'Settings',         path: '/settings' },
  { section: 'Tasks',        label: 'Tasks',            path: '/tasks' },
  { section: 'Tasks',        label: 'Team Logs',        path: '/tasks/team-logs' },
  { section: 'People',       label: 'Employees',        path: '/employees' },
  { section: 'People',       label: 'HR & Leave',       path: '/people/hr' },
  { section: 'People',       label: 'Attendance',       path: '/people/attendance' },
  { section: 'People',       label: 'Work Locations',   path: '/people/work-locations' },
  { section: 'Self Service', label: 'My Attendance',    path: '/self/attendance' },
  { section: 'Self Service', label: 'My Leaves',        path: '/self/leaves' },
];

export const OPERATIONAL_PORTAL_PAGES: PagePermission[] = [
  { section: 'Self Service', label: 'My Attendance', path: '/self/attendance' },
  { section: 'Self Service', label: 'My Leaves',     path: '/self/leaves' },
  { section: 'Tasks',        label: 'Tasks',         path: '/tasks' },
];

// ─── Role → Allowed Paths ─────────────────────────────────────────────────────
//
// Each key is a value of `user.currentOperationalRole` / `user.departmentRole`
// / `user.role` (must match exactly what the backend sets). The value is the SET
// of paths that role may access.
//
// Rules:
//  • Always include '/dashboard' and '/self/attendance' — every authenticated
//    user lands on the dashboard and can punch in.
//  • Paths are prefix-matched: '/sales' also grants '/sales/123', etc.

export const ROLE_ALLOWED_PATHS: Record<string, string[]> = {
  // ── HR ──────────────────────────────────────────────────────────────────────
  hr: [
    '/',
    '/dashboard',
    '/self/attendance',
    '/self/leaves',
    '/employees',
    '/people/hr',
    '/people/attendance',
    '/people/work-locations',
    '/tasks',
  ],

  // ── Sales ───────────────────────────────────────────────────────────────────
  sales: [
    '/',
    '/dashboard',
    '/self/attendance',
    '/self/leaves',
    '/tasks',
  ],

  // ── Manager ─────────────────────────────────────────────────────────────────
  manager: [
    '/',
    '/dashboard',
    '/self/attendance',
    '/self/leaves',
    '/tasks',
    '/employees',
    '/people/hr',
    '/people/attendance',
    '/people/work-locations',
  ],

  // ── Roles with self-service + task board only ───────────────────────────────
  accountant:       ['/', '/dashboard', '/self/attendance', '/self/leaves', '/tasks'],
  business_analyst: ['/', '/dashboard', '/self/attendance', '/self/leaves', '/tasks'],
  ops_staff:        ['/', '/dashboard', '/self/attendance', '/self/leaves', '/tasks'],
  production:       ['/', '/dashboard', '/self/attendance', '/self/leaves', '/tasks'],
  production_staff: ['/', '/dashboard', '/self/attendance', '/self/leaves', '/tasks'],
  dispatch:         ['/', '/dashboard', '/self/attendance', '/self/leaves', '/tasks'],
  dispatch_staff:   ['/', '/dashboard', '/self/attendance', '/self/leaves', '/tasks'],
};

/**
 * Returns the subset of ALL_SECTIONS visible to a given user.
 * allowedPaths: per-user explicit permissions (from DB). When non-empty,
 * takes precedence over the role-based defaults.
 */
export function getSectionsForRole(
  currentOperationalRole?: string | null,
  departmentRole?: string | null,
  primaryRole?: string | null,
  allowedPaths?: string[] | null
): NavSection[] {
  let sections: NavSection[] = [];

  // Per-user explicit paths take highest priority when set
  if (allowedPaths && allowedPaths.length > 0) {
    const allowed = [...allowedPaths];
    sections = ALL_SECTIONS
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          allowed.some((ap) =>
            item.path === ap ||
            (ap !== '/' && item.path.startsWith(ap + '/'))
          )
        ),
      }))
      .filter((section) => section.items.length > 0);
  } else {
    // Fall back to role-based defaults
    const allowedOps = currentOperationalRole ? (ROLE_ALLOWED_PATHS[currentOperationalRole] ?? []) : [];
    const allowedDept = departmentRole ? (ROLE_ALLOWED_PATHS[departmentRole] ?? []) : [];
    const allowedPrimary = primaryRole ? (ROLE_ALLOWED_PATHS[primaryRole] ?? []) : [];

    const allowed = Array.from(new Set([...allowedOps, ...allowedDept, ...allowedPrimary]));

    // If no roles are assigned and not an admin, they only get self-service.
    if (allowed.length === 0) {
      sections = ALL_SECTIONS
        .map((s) => ({ ...s, items: s.items.filter((i) => i.path.startsWith('/self/')) }))
        .filter((s) => s.items.length > 0);
    } else {
      sections = ALL_SECTIONS
        .map((section) => ({
          ...section,
          items: section.items.filter((item) =>
            allowed.some((allowedPath) =>
              item.path === allowedPath || item.path.startsWith(allowedPath + '/')
            )
          ),
        }))
        .filter((section) => section.items.length > 0);
    }
  }

  // Put 'Self Service' (with attendance) at the top for all non-admin staff
  if (primaryRole !== 'admin') {
    const selfServiceIdx = sections.findIndex((s) => s.label === 'Self Service');
    if (selfServiceIdx > 0) {
      const [selfService] = sections.splice(selfServiceIdx, 1);
      sections.unshift(selfService);
    }
  }

  // Team Logs is founders/co-founders (admin) only. getSectionsForRole is only
  // ever called for non-admins (admins get ALL_SECTIONS directly in Sidebar),
  // so unconditionally strip it here even for roles that carry the /tasks prefix.
  sections = sections
    .map((s) => ({ ...s, items: s.items.filter((i) => i.path !== '/tasks/team-logs') }))
    .filter((s) => s.items.length > 0);

  return sections;
}

/**
 * Returns true when a user with the given roles is permitted to access `pathname`.
 * allowedPaths: per-user explicit permissions (from DB). When non-empty,
 * takes precedence over the role-based defaults.
 */
export function isPathAllowedForRole(
  pathname: string,
  currentOperationalRole?: string | null,
  departmentRole?: string | null,
  primaryRole?: string | null,
  allowedPaths?: string[] | null
): boolean {
  // Per-user explicit paths take highest priority when set
  if (allowedPaths && allowedPaths.length > 0) {
    return allowedPaths.some(
      (ap) =>
        pathname === ap ||
        (ap !== '/' && pathname.startsWith(ap + '/'))
    );
  }

  const allowedOps = currentOperationalRole ? (ROLE_ALLOWED_PATHS[currentOperationalRole] ?? []) : [];
  const allowedDept = departmentRole ? (ROLE_ALLOWED_PATHS[departmentRole] ?? []) : [];
  const allowedPrimary = primaryRole ? (ROLE_ALLOWED_PATHS[primaryRole] ?? []) : [];

  const allowed = Array.from(new Set([...allowedOps, ...allowedDept, ...allowedPrimary]));

  return allowed.some(
    (allowedPath) =>
      pathname === allowedPath ||
      (allowedPath !== '/' && pathname.startsWith(allowedPath + '/')) ||
      pathname.startsWith(allowedPath)
  );
}

// ─── Zustand Store ────────────────────────────────────────────────────────────

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  mobileOpen: false,
  toggleSidebar: () => set((s) => ({ collapsed: !s.collapsed })),
  setSidebarCollapsed: (collapsed) => set({ collapsed }),
  toggleMobileSidebar: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
  setMobileOpen: (open) => set({ mobileOpen: open }),
}));
