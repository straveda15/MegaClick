/**
 * Staff role filtering, shared by the task modals.
 *
 * Lives here rather than in a modal so the reassign screen can keep its role
 * chips after the create screen dropped them.
 */

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

/**
 * A person a task can be given to. Covers both real employee profiles and the
 * synthetic profiles built for founders/admins, who have no profile of their
 * own but still need to appear in the staff lists.
 */
export interface AssignableStaff {
  _id?: string;
  userId?: {
    _id?: string;
    name?: string;
    lastName?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
  };
  designation?: string;
  department?: string;
  status?: string;
}

export function matchesRoleFilter(emp: AssignableStaff, roles: string | string[]): boolean {
  const roleList = Array.isArray(roles) ? roles : [roles];
  if (roleList.length === 0 || roleList.includes("all")) return true;
  const dept  = (emp.department  ?? "").toLowerCase();
  const desig = (emp.designation ?? "").toLowerCase();
  const uRole = (emp.userId?.role ?? "").toLowerCase();
  return roleList.some(r => dept.includes(r) || desig.includes(r) || uRole.includes(r));
}
