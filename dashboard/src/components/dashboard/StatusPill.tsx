export type StatusKey =
  | 'documents_pending'
  | 'documents_received'
  | 'in_progress'
  | 'application_submitted'
  | 'government_verification'
  | 'approval_received'
  | 'completed'
  | 'pending'
  | 'waiting_review'
  | 'rejected';

export const STATUS_LABELS: Record<StatusKey, string> = {
  documents_pending: 'Documents Pending',
  documents_received: 'Documents Received',
  in_progress: 'In Progress',
  application_submitted: 'Application Submitted',
  government_verification: 'Government Verification',
  approval_received: 'Approval Received',
  completed: 'Completed',
  pending: 'Pending',
  waiting_review: 'Waiting Review',
  rejected: 'Rejected',
};

const STATUS_TONE: Record<StatusKey, string> = {
  documents_pending: 'bg-amber-100 text-amber-800',
  documents_received: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-blue-100 text-blue-800',
  application_submitted: 'bg-blue-100 text-blue-800',
  government_verification: 'bg-purple-100 text-purple-800',
  approval_received: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-gray-100 text-gray-700',
  waiting_review: 'bg-amber-100 text-amber-800',
  rejected: 'bg-red-100 text-red-800',
};

const StatusPill = ({ status }: { status: StatusKey }) => (
  <span className={`status-badge ${STATUS_TONE[status]}`}>
    {STATUS_LABELS[status]}
  </span>
);

export default StatusPill;
