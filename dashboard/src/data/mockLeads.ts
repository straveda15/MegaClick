export type LeadStatus =
  | 'new_lead'
  | 'contacted'
  | 'follow_up'
  | 'documents_requested'
  | 'documents_received'
  | 'quotation_shared'
  | 'interested'
  | 'converted'
  | 'not_interested'
  | 'lost';

export type LeadPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Lead {
  id: string;
  initials: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  source: string;
  assignedTo: string;
  priority: LeadPriority;
  status: LeadStatus;
  followUp: string;
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new_lead:             'New Lead',
  contacted:            'Contacted',
  follow_up:            'Follow-up',
  documents_requested:  'Documents Requested',
  documents_received:   'Documents Received',
  quotation_shared:     'Quotation Shared',
  interested:           'Interested',
  converted:            'Converted',
  not_interested:       'Not Interested',
  lost:                 'Lost',
};

export const LEAD_STATUS_STYLES: Record<LeadStatus, { bg: string; text: string }> = {
  new_lead:             { bg: 'bg-blue-100',    text: 'text-blue-700'    },
  contacted:            { bg: 'bg-teal-100',    text: 'text-teal-700'    },
  follow_up:            { bg: 'bg-orange-100',  text: 'text-orange-700'  },
  documents_requested:  { bg: 'bg-purple-100',  text: 'text-purple-700'  },
  documents_received:   { bg: 'bg-green-100',   text: 'text-green-700'   },
  quotation_shared:     { bg: 'bg-cyan-100',    text: 'text-cyan-700'    },
  interested:           { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  converted:            { bg: 'bg-green-100',   text: 'text-green-700'   },
  not_interested:       { bg: 'bg-gray-100',    text: 'text-gray-600'    },
  lost:                 { bg: 'bg-red-100',     text: 'text-red-700'     },
};

export const PRIORITY_STYLES: Record<LeadPriority, { bg: string; text: string }> = {
  Low:    { bg: 'bg-gray-100',   text: 'text-gray-600'  },
  Medium: { bg: 'bg-blue-100',   text: 'text-blue-700'  },
  High:   { bg: 'bg-orange-100', text: 'text-orange-600'},
  Urgent: { bg: 'bg-red-100',    text: 'text-red-600'   },
};

export const MOCK_LEADS: Lead[] = [
  { id: 'LD-1001', initials: 'RP', name: 'Rahul Pandey',   company: 'Zenith Traders',       phone: '+91 9800000000', email: 'rahul.pandey0@gmail.com',    city: 'Mumbai',    service: 'GST Registration',     source: 'Website',   assignedTo: 'Neha Desai',    priority: 'Low',    status: 'new_lead',            followUp: '2026-08-06' },
  { id: 'LD-1002', initials: 'NM', name: 'Neha Mehta',     company: 'Orbit Ventures',       phone: '+91 9800013579', email: 'neha.mehta1@outlook.com',    city: 'Pune',      service: 'Company Registration', source: 'WhatsApp', assignedTo: 'Rohan Singh',   priority: 'Medium', status: 'contacted',           followUp: '2026-08-07' },
  { id: 'LD-1003', initials: 'RC', name: 'Rohan Chopra',   company: 'Bright Associates',    phone: '+91 9800027158', email: 'rohan.chopra2@yahoo.in',     city: 'Bengaluru', service: 'Income Tax',           source: 'Facebook',  assignedTo: 'Divya Sharma',  priority: 'High',   status: 'follow_up',           followUp: '2026-08-08' },
  { id: 'LD-1004', initials: 'DS', name: 'Divya Shetty',   company: 'Ideal Holdings',       phone: '+91 9800040737', email: 'divya.shetty3@hotmail.com',  city: 'Hyderabad', service: 'Trademark',            source: 'Instagram', assignedTo: 'Arjun Joshi',   priority: 'Urgent', status: 'documents_requested', followUp: '2026-08-09' },
  { id: 'LD-1005', initials: 'AR', name: 'Arjun Reddy',    company: 'Zenith Group',         phone: '+91 9800054316', email: 'arjun.reddy4@gmail.com',     city: 'Chennai',   service: 'Patent',               source: 'Google',    assignedTo: 'Pooja Gupta',   priority: 'Low',    status: 'documents_received',  followUp: '2026-08-10' },
  { id: 'LD-1006', initials: 'PM', name: 'Pooja Malhotra', company: 'Orbit Traders',        phone: '+91 9800067895', email: 'pooja.malhotra5@outlook.com',city: 'Delhi',     service: 'Marriage Registration',source: 'Reference', assignedTo: 'Rajesh Pandey', priority: 'Medium', status: 'quotation_shared',    followUp: '2026-08-11' },
  { id: 'LD-1007', initials: 'RM', name: 'Rajesh Menon',   company: 'Bright Ventures',      phone: '+91 9800081474', email: 'rajesh.menon6@yahoo.in',     city: 'Ahmedabad', service: 'Passport',             source: 'Walk In',   assignedTo: 'Nikita Mehta',  priority: 'High',   status: 'interested',          followUp: '2026-08-12' },
  { id: 'LD-1008', initials: 'NS', name: 'Nikita Singh',   company: 'Ideal Ventures',       phone: '+91 9800095053', email: 'nikita.singh7@hotmail.com',  city: 'Jaipur',    service: 'GST Registration',     source: 'Website',   assignedTo: 'Harsh Chopra',  priority: 'Urgent', status: 'new_lead',            followUp: '2026-08-13' },
  { id: 'LD-1009', initials: 'HC', name: 'Harsh Chandra',  company: 'Zenith Associates',    phone: '+91 9800108632', email: 'harsh.chandra8@gmail.com',   city: 'Kolkata',   service: 'Sale Deed',            source: 'WhatsApp', assignedTo: 'Tanvi Shetty',  priority: 'Low',    status: 'contacted',           followUp: '2026-08-14' },
  { id: 'LD-1010', initials: 'TK', name: 'Tanvi Kapoor',   company: 'Orbit Holdings',       phone: '+91 9800122211', email: 'tanvi.kapoor9@outlook.com',  city: 'Surat',     service: 'Rent Agreement',       source: 'Facebook',  assignedTo: 'Rahul Reddy',   priority: 'Medium', status: 'follow_up',           followUp: '2026-08-15' },
  { id: 'LD-1011', initials: 'AJ', name: 'Amit Joshi',     company: 'Bright Group',         phone: '+91 9800135790', email: 'amit.joshi10@yahoo.in',      city: 'Nagpur',    service: 'Company Registration', source: 'Instagram', assignedTo: 'Neha Desai',    priority: 'High',   status: 'documents_requested', followUp: '2026-08-16' },
  { id: 'LD-1012', initials: 'SG', name: 'Sneha Gupta',    company: 'Zenith Traders',       phone: '+91 9800149369', email: 'sneha.gupta11@hotmail.com',  city: 'Kochi',     service: 'Income Tax',           source: 'Google',    assignedTo: 'Rohan Singh',   priority: 'Urgent', status: 'documents_received',  followUp: '2026-08-17' },
  { id: 'LD-1013', initials: 'VR', name: 'Vikas Rao',      company: 'Ideal Traders',        phone: '+91 9800162948', email: 'vikas.rao12@gmail.com',      city: 'Mumbai',    service: 'Trademark',            source: 'Reference', assignedTo: 'Divya Sharma',  priority: 'Low',    status: 'quotation_shared',    followUp: '2026-08-18' },
  { id: 'LD-1014', initials: 'PD', name: 'Priya Desai',    company: 'Orbit Group',          phone: '+91 9800176527', email: 'priya.desai13@outlook.com',  city: 'Pune',      service: 'Patent',               source: 'Walk In',   assignedTo: 'Arjun Joshi',   priority: 'Medium', status: 'interested',          followUp: '2026-08-19' },
  { id: 'LD-1015', initials: 'KM', name: 'Karan Mehta',    company: 'Bright Holdings',      phone: '+91 9800190106', email: 'karan.mehta14@yahoo.in',     city: 'Bengaluru', service: 'Passport',             source: 'Website',   assignedTo: 'Pooja Gupta',   priority: 'High',   status: 'new_lead',            followUp: '2026-08-20' },
];
