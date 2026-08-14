import type { StatusKey } from '@/components/dashboard/StatusPill';

export interface Client {
  id: string;
  initials: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  serviceTag: string;
  status: StatusKey;
  joinedAt: string;
  city: string;
  assigned: string;
  pendingDocs: number | 'All received';
}

export const MOCK_CLIENTS: Client[] = [
  { id: 'CL-2001', initials: 'RS', name: 'Rahul Singh',   company: 'Zenith Group',      email: 'rahul.singh0@gmail.com',      phone: '+91 9805431600', serviceTag: 'Income Tax',              status: 'documents_pending',      joinedAt: '2026-06-02', city: 'Hyderabad', assigned: 'Neha Desai',    pendingDocs: 'All received' },
  { id: 'CL-2002', initials: 'NS', name: 'Neha Sharma',   company: 'Orbit Traders',     email: 'neha.sharma1@outlook.com',    phone: '+91 9805445179', serviceTag: 'Trademark',               status: 'documents_received',     joinedAt: '2026-06-10', city: 'Chennai',   assigned: 'Rohan Singh',   pendingDocs: 1 },
  { id: 'CL-2003', initials: 'RJ', name: 'Rohan Joshi',   company: 'Bright Ventures',   email: 'rohan.joshi2@yahoo.in',       phone: '+91 9805458758', serviceTag: 'Patent',                  status: 'application_submitted',  joinedAt: '2026-06-18', city: 'Delhi',     assigned: 'Divya Sharma',  pendingDocs: 2 },
  { id: 'CL-2004', initials: 'DG', name: 'Divya Gupta',   company: 'Ideal Associates',  email: 'divya.gupta3@hotmail.com',    phone: '+91 9805472337', serviceTag: 'Marriage Registration',   status: 'government_verification',joinedAt: '2026-06-25', city: 'Ahmedabad', assigned: 'Arjun Joshi',   pendingDocs: 3 },
  { id: 'CL-2005', initials: 'AP', name: 'Arjun Pandey',  company: 'Zenith Holdings',   email: 'arjun.pandey4@gmail.com',     phone: '+91 9805485916', serviceTag: 'Passport',                status: 'approval_received',      joinedAt: '2026-07-01', city: 'Kolkata',   assigned: 'Pooja Gupta',   pendingDocs: 4 },
  { id: 'CL-2006', initials: 'PM', name: 'Pooja Mehta',   company: 'Orbit Group',       email: 'pooja.mehta5@outlook.com',    phone: '+91 9805499495', serviceTag: 'Insurance',               status: 'documents_received',     joinedAt: '2026-07-08', city: 'Jaipur',    assigned: 'Rajesh Pandey', pendingDocs: 'All received' },
  { id: 'CL-2007', initials: 'RC', name: 'Rajesh Chopra', company: 'Bright Traders',    email: 'rajesh.chopra6@yahoo.in',     phone: '+91 9805513074', serviceTag: 'Property Registration',  status: 'completed',              joinedAt: '2026-07-10', city: 'Nagpur',    assigned: 'Nikita Mehta',  pendingDocs: 1 },
  { id: 'CL-2008', initials: 'NK', name: 'Nikita Shetty', company: 'Ideal Ventures',    email: 'nikita.shetty7@hotmail.com',  phone: '+91 9805526653', serviceTag: 'Sale Deed',               status: 'documents_pending',      joinedAt: '2026-07-12', city: 'Surat',     assigned: 'Harsh Chopra',  pendingDocs: 2 },
  { id: 'CL-2009', initials: 'HR', name: 'Harsh Reddy',   company: 'Zenith Associates', email: 'harsh.reddy8@gmail.com',      phone: '+91 9805510232', serviceTag: 'Gift Deed',               status: 'documents_received',     joinedAt: '2026-07-14', city: 'Kochi',     assigned: 'Tanvi Shetty',  pendingDocs: 3 },
  { id: 'CL-2010', initials: 'TM', name: 'Tanvi Malhotra',company: 'Orbit Holdings',    email: 'tanvi.malhotra9@outlook.com', phone: '+91 9805555...',  serviceTag: 'Rent Agreement',          status: 'application_submitted',  joinedAt: '2026-07-16', city: 'Mumbai',    assigned: 'Rahul Reddy',   pendingDocs: 4 },
];
