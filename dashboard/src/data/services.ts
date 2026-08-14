import { SERVICE_STAGES, type ServiceStage } from '@/hooks/useTasks';

export type { ServiceStage };
export { SERVICE_STAGES };

export type ServicePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ServiceStatus = 'In Progress' | 'Completed' | 'On Hold' | 'Rejected';

/** A service request row, projected from the task that carries it. */
export interface ServiceRow {
  /** Human-facing id shown in the table, derived from the task id. */
  id: string;
  taskId: string;
  client: string;
  clientInitials: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  clientAddress: string;
  notes: string;
  name: string;
  category: string;
  assignedTo: string;
  stage: ServiceStage;
  progress: number;
  deadline: string;
  priority: ServicePriority;
  status: ServiceStatus;
}

export const STAGE_LABELS: Record<ServiceStage, string> = {
  documents_pending:       'Documents Pending',
  documents_received:      'Documents Received',
  application_submitted:   'Application Submitted',
  government_verification: 'Government Verification',
  approval_received:       'Approval Received',
  certificate_ready:       'Certificate Ready',
  completed:               'Completed',
};

export const STAGE_STYLES: Record<ServiceStage, { bg: string; text: string }> = {
  documents_pending:       { bg: 'bg-amber-100',   text: 'text-amber-700'   },
  documents_received:      { bg: 'bg-blue-100',    text: 'text-blue-700'    },
  application_submitted:   { bg: 'bg-sky-100',     text: 'text-sky-700'     },
  government_verification: { bg: 'bg-purple-100',  text: 'text-purple-700'  },
  approval_received:       { bg: 'bg-green-100',   text: 'text-green-700'   },
  certificate_ready:       { bg: 'bg-teal-100',    text: 'text-teal-700'    },
  completed:               { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

export const PRIORITY_STYLES: Record<ServicePriority, { bg: string; text: string }> = {
  Low:    { bg: 'bg-gray-100',   text: 'text-gray-600'   },
  Medium: { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  High:   { bg: 'bg-orange-100', text: 'text-orange-600' },
  Urgent: { bg: 'bg-red-100',    text: 'text-red-600'    },
};

export const STATUS_STYLES: Record<ServiceStatus, { bg: string; text: string }> = {
  'In Progress': { bg: 'bg-blue-100',    text: 'text-blue-700'    },
  'Completed':   { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'On Hold':     { bg: 'bg-amber-100',   text: 'text-amber-700'   },
  'Rejected':    { bg: 'bg-red-100',     text: 'text-red-700'     },
};

/**
 * Progress is a straight function of how far along the seven-stage pipeline a
 * request has moved, so the bar and the stage badge can never disagree.
 */
export const stageProgress = (stage: ServiceStage) =>
  Math.round(((SERVICE_STAGES.indexOf(stage) + 1) / SERVICE_STAGES.length) * 100);
