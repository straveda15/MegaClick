export type ServiceStage =
  | 'documents_pending'
  | 'documents_received'
  | 'application_submitted'
  | 'government_verification'
  | 'approval_received'
  | 'certificate_ready'
  | 'completed';

export type ServicePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ServiceStatus   = 'In Progress' | 'Completed' | 'On Hold' | 'Rejected';

export interface Service {
  id: string;
  client: string;
  clientInitials: string;
  name: string;
  assignedTo: string;
  stage: ServiceStage;
  progress: number;        // 0-100
  deadline: string;
  priority: ServicePriority;
  status: ServiceStatus;
}

export const STAGE_LABELS: Record<ServiceStage, string> = {
  documents_pending:      'Documents Pending',
  documents_received:     'Documents Received',
  application_submitted:  'Application Submitted',
  government_verification:'Government Verification',
  approval_received:      'Approval Received',
  certificate_ready:      'Certificate Ready',
  completed:              'Completed',
};

export const STAGE_STYLES: Record<ServiceStage, { bg: string; text: string }> = {
  documents_pending:      { bg: 'bg-amber-100',  text: 'text-amber-700'  },
  documents_received:     { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  application_submitted:  { bg: 'bg-sky-100',    text: 'text-sky-700'    },
  government_verification:{ bg: 'bg-purple-100', text: 'text-purple-700' },
  approval_received:      { bg: 'bg-green-100',  text: 'text-green-700'  },
  certificate_ready:      { bg: 'bg-teal-100',   text: 'text-teal-700'   },
  completed:              { bg: 'bg-emerald-100',text: 'text-emerald-700' },
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

export const MOCK_SERVICES: Service[] = [
  { id: 'SV-3001', client: 'Rahul Singh',    clientInitials: 'RS', name: 'GST Registration',      assignedTo: 'Neha Desai',    stage: 'documents_pending',      progress: 14,  deadline: '2026-08-01', priority: 'Low',    status: 'In Progress' },
  { id: 'SV-3002', client: 'Neha Sharma',    clientInitials: 'NS', name: 'Company Registration',  assignedTo: 'Rohan Singh',   stage: 'documents_received',     progress: 29,  deadline: '2026-08-02', priority: 'Medium', status: 'In Progress' },
  { id: 'SV-3003', client: 'Rohan Joshi',    clientInitials: 'RJ', name: 'Income Tax',            assignedTo: 'Divya Sharma',  stage: 'application_submitted',  progress: 43,  deadline: '2026-08-03', priority: 'High',   status: 'In Progress' },
  { id: 'SV-3004', client: 'Divya Gupta',    clientInitials: 'DG', name: 'Trademark',             assignedTo: 'Arjun Joshi',   stage: 'government_verification',progress: 57,  deadline: '2026-08-04', priority: 'Urgent', status: 'In Progress' },
  { id: 'SV-3005', client: 'Arjun Pandey',   clientInitials: 'AP', name: 'Patent',                assignedTo: 'Pooja Gupta',   stage: 'approval_received',      progress: 71,  deadline: '2026-08-05', priority: 'Low',    status: 'In Progress' },
  { id: 'SV-3006', client: 'Pooja Mehta',    clientInitials: 'PM', name: 'Marriage Registration', assignedTo: 'Rajesh Pandey', stage: 'certificate_ready',      progress: 86,  deadline: '2026-08-06', priority: 'Medium', status: 'In Progress' },
  { id: 'SV-3007', client: 'Rajesh Chopra',  clientInitials: 'RC', name: 'Passport',              assignedTo: 'Nikita Mehta',  stage: 'completed',              progress: 100, deadline: '2026-08-07', priority: 'High',   status: 'Completed'  },
  { id: 'SV-3008', client: 'Nikita Shetty',  clientInitials: 'NK', name: 'Insurance',             assignedTo: 'Harsh Chopra',  stage: 'documents_pending',      progress: 14,  deadline: '2026-08-08', priority: 'Urgent', status: 'In Progress' },
  { id: 'SV-3009', client: 'Harsh Reddy',    clientInitials: 'HR', name: 'Gift Deed',             assignedTo: 'Tanvi Shetty',  stage: 'documents_received',     progress: 29,  deadline: '2026-08-09', priority: 'Low',    status: 'In Progress' },
  { id: 'SV-3010', client: 'Tanvi Malhotra', clientInitials: 'TM', name: 'Rent Agreement',        assignedTo: 'Rahul Reddy',   stage: 'application_submitted',  progress: 43,  deadline: '2026-08-10', priority: 'Medium', status: 'In Progress' },
  { id: 'SV-3011', client: 'Amit Joshi',     clientInitials: 'AJ', name: 'Property Registration', assignedTo: 'Neha Desai',    stage: 'government_verification',progress: 57,  deadline: '2026-08-11', priority: 'High',   status: 'In Progress' },
  { id: 'SV-3012', client: 'Sneha Gupta',    clientInitials: 'SG', name: 'Sale Deed',             assignedTo: 'Rohan Singh',   stage: 'approval_received',      progress: 71,  deadline: '2026-08-12', priority: 'Urgent', status: 'In Progress' },
  { id: 'SV-3013', client: 'Vikas Rao',      clientInitials: 'VR', name: 'GST Registration',      assignedTo: 'Divya Sharma',  stage: 'certificate_ready',      progress: 86,  deadline: '2026-08-13', priority: 'Low',    status: 'In Progress' },
  { id: 'SV-3014', client: 'Priya Desai',    clientInitials: 'PD', name: 'Trademark',             assignedTo: 'Arjun Joshi',   stage: 'completed',              progress: 100, deadline: '2026-08-14', priority: 'Medium', status: 'Completed'  },
];
