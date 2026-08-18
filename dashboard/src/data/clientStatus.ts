/**
 * How a service request's work is going, from the employee's side.
 *
 * Mirrors a task's status, plus "unassigned" for a service nobody has been
 * given yet — that state has no task behind it, so it can't come from the task
 * model itself.
 */

export const TASK_STATUS_LABELS: Record<string, string> = {
  unassigned: 'Not assigned',
  pending: 'Not started',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  overdue: 'Overdue',
};

export const TASK_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  unassigned:  { bg: 'bg-gray-100',    text: 'text-gray-600'    },
  pending:     { bg: 'bg-slate-100',   text: 'text-slate-600'   },
  in_progress: { bg: 'bg-blue-100',    text: 'text-blue-700'    },
  completed:   { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  cancelled:   { bg: 'bg-red-100',     text: 'text-red-700'     },
  overdue:     { bg: 'bg-orange-100',  text: 'text-orange-700'  },
};
