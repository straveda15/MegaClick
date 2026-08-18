import type { FollowUpBucket, FollowUpOutcome } from '@/hooks/useFollowUps';

/** What happened on a logged follow-up. */
export const OUTCOME_LABELS: Record<FollowUpOutcome, string> = {
  contacted: 'Contacted',
  no_answer: 'No answer',
  rescheduled: 'Rescheduled',
  meeting_set: 'Meeting set',
  note: 'Note',
};

export const OUTCOME_STYLES: Record<FollowUpOutcome, { bg: string; text: string }> = {
  contacted:   { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  no_answer:   { bg: 'bg-orange-100',  text: 'text-orange-700'  },
  rescheduled: { bg: 'bg-blue-100',    text: 'text-blue-700'    },
  meeting_set: { bg: 'bg-violet-100',  text: 'text-violet-700'  },
  note:        { bg: 'bg-slate-100',   text: 'text-slate-600'   },
};

/** How urgent the next scheduled follow-up is. */
export const BUCKET_LABELS: Record<FollowUpBucket, string> = {
  overdue: 'Overdue',
  today: 'Due today',
  this_week: 'This week',
  later: 'Later',
  unscheduled: 'Not scheduled',
};

export const BUCKET_STYLES: Record<FollowUpBucket, { bg: string; text: string }> = {
  overdue:     { bg: 'bg-red-100',    text: 'text-red-700'    },
  today:       { bg: 'bg-amber-100',  text: 'text-amber-700'  },
  this_week:   { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  later:       { bg: 'bg-slate-100',  text: 'text-slate-600'  },
  unscheduled: { bg: 'bg-gray-100',   text: 'text-gray-500'   },
};

/** Date and time together — a follow-up at 10am is not the same as one at 6pm. */
export const formatDateTime = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

/** The local string a <input type="datetime-local"> expects. */
export const toLocalInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
