import {
  UserPlus,
  TrendingUp,
  CheckCircle2,
  Users,
  Briefcase,
  Clock,
  ListChecks,
  CalendarClock,
  type LucideIcon,
} from 'lucide-react';
import type { StatCardTone, StatCardTrend } from '@/components/dashboard/StatCard';
import type { StatusKey } from '@/components/dashboard/StatusPill';

export interface KpiStat {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: StatCardTone;
  trend: StatCardTrend;
}

export const MOCK_KPI_STATS: KpiStat[] = [
  { label: 'Total Leads', value: 120, icon: UserPlus, tone: 'blue', trend: { direction: 'up', text: '+12 this week' } },
  { label: 'New Leads', value: 18, icon: TrendingUp, tone: 'purple', trend: { direction: 'neutral', text: 'Today' } },
  { label: 'Converted', value: 54, icon: CheckCircle2, tone: 'green', trend: { direction: 'up', text: '45% conversion' } },
  { label: 'Active Clients', value: 68, icon: Users, tone: 'green', trend: { direction: 'up', text: '+4 this month' } },
  { label: 'Running Services', value: 97, icon: Briefcase, tone: 'purple', trend: { direction: 'neutral', text: '22 due this week' } },
  { label: 'Pending Tasks', value: 18, icon: Clock, tone: 'amber', trend: { direction: 'down', text: '6 overdue' } },
  { label: 'Completed Tasks', value: 54, icon: ListChecks, tone: 'green', trend: { direction: 'neutral', text: 'This week' } },
  { label: "Today's Follow-ups", value: 12, icon: CalendarClock, tone: 'red', trend: { direction: 'neutral', text: '3 pending' } },
];

export const MOCK_LEADS_VS_CONVERSIONS: { month: string; leads: number; conversions: number }[] = [
  { month: 'Feb', leads: 62, conversions: 24 },
  { month: 'Mar', leads: 78, conversions: 30 },
  { month: 'Apr', leads: 84, conversions: 33 },
  { month: 'May', leads: 92, conversions: 38 },
  { month: 'Jun', leads: 108, conversions: 46 },
  { month: 'Jul', leads: 120, conversions: 54 },
];

export const MOCK_SERVICE_STATUS_DONUT: { key: string; label: string; value: number; color: string }[] = [
  { key: 'documents_pending', label: 'Documents Pending', value: 22, color: 'hsl(217 91% 60%)' },
  { key: 'in_progress', label: 'In Progress', value: 38, color: 'hsl(142 64% 24%)' },
  { key: 'verification', label: 'Verification', value: 20, color: 'hsl(38 92% 50%)' },
  { key: 'completed', label: 'Completed', value: 17, color: 'hsl(262 52% 55%)' },
];

export const MOCK_EMPLOYEE_PRODUCTIVITY: { name: string; main: number; cap: number }[] = [
  { name: 'Neha', main: 18, cap: 4 },
  { name: 'Rohan', main: 22, cap: 5 },
  { name: 'Divya', main: 28, cap: 6 },
  { name: 'Arjun', main: 34, cap: 6 },
  { name: 'Pooja', main: 40, cap: 7 },
  { name: 'Rajesh', main: 48, cap: 8 },
  { name: 'Nikita', main: 54, cap: 8 },
  { name: 'Harsh', main: 60, cap: 9 },
];

export const MOCK_TASK_COMPLETION_WEEK: { day: string; assigned: number; completed: number }[] = [
  { day: 'Mon', assigned: 9, completed: 4 },
  { day: 'Tue', assigned: 13, completed: 5 },
  { day: 'Wed', assigned: 9, completed: 6 },
  { day: 'Thu', assigned: 15, completed: 4 },
  { day: 'Fri', assigned: 12, completed: 6 },
  { day: 'Sat', assigned: 8, completed: 5 },
];

export interface DashboardTaskItem {
  id: string;
  title: string;
  meta: string;
  status: StatusKey;
}

export const MOCK_TODAYS_TASKS: DashboardTaskItem[] = [
  { id: 't1', title: 'Collect PAN & Aadhaar copies', meta: 'Neha Desai • Sales', status: 'pending' },
  { id: 't2', title: 'Draft partnership agreement', meta: 'Rohan Singh • Legal', status: 'in_progress' },
  { id: 't3', title: 'File GST return for June', meta: 'Divya Sharma • Finance', status: 'waiting_review' },
  { id: 't4', title: 'Submit trademark application form', meta: 'Arjun Joshi • Property', status: 'completed' },
  { id: 't5', title: 'Verify property title documents', meta: 'Pooja Gupta • Government Services', status: 'rejected' },
];

export interface DashboardDeadlineItem {
  id: string;
  title: string;
  meta: string;
  status: StatusKey;
}

export const MOCK_UPCOMING_DEADLINES: DashboardDeadlineItem[] = [
  { id: 'd1', title: 'GST Registration', meta: 'Rahul Singh • Due 2026-08-01', status: 'documents_pending' },
  { id: 'd2', title: 'Company Registration', meta: 'Neha Sharma • Due 2026-08-02', status: 'documents_received' },
  { id: 'd3', title: 'Income Tax', meta: 'Rohan Joshi • Due 2026-08-03', status: 'application_submitted' },
  { id: 'd4', title: 'Trademark', meta: 'Divya Gupta • Due 2026-08-04', status: 'government_verification' },
  { id: 'd5', title: 'Patent', meta: 'Arjun Pandey • Due 2026-08-05', status: 'approval_received' },
];

export interface DashboardActivityItem {
  id: string;
  actorInitials: string;
  text: string;
  timestamp: string;
}

export const MOCK_RECENT_ACTIVITY: DashboardActivityItem[] = [
  { id: 'a1', actorInitials: 'PS', text: 'Priya Sharma converted LD-1042 → CL-2069', timestamp: '10:24 AM' },
  { id: 'a2', actorInitials: 'AP', text: 'Amit Patel uploaded document Sale_Deed_Draft', timestamp: '10:11 AM' },
  { id: 'a3', actorInitials: 'NI', text: 'Neha Iyer updated stage SV-3021 → Government Verification', timestamp: '09:58 AM' },
  { id: 'a4', actorInitials: 'VR', text: 'Vikram Reddy completed task TK-4056 File GST return', timestamp: '09:40 AM' },
  { id: 'a5', actorInitials: 'RV', text: 'Rahul Verma created lead LD-1119 Meridian Group', timestamp: '09:22 AM' },
  { id: 'a6', actorInitials: 'SM', text: 'Sneha Mehta assigned task TK-4072 to Rohan Joshi', timestamp: '09:05 AM' },
];

export interface RecentClient {
  id: string;
  initials: string;
  name: string;
  company: string;
  serviceTag: string;
  status: StatusKey;
}

export const MOCK_RECENT_CLIENTS: RecentClient[] = [
  { id: 'c1', initials: 'RS', name: 'Rahul Singh', company: 'Zenith Group', serviceTag: 'Income Tax', status: 'documents_pending' },
  { id: 'c2', initials: 'NS', name: 'Neha Sharma', company: 'Orbit Traders', serviceTag: 'Trademark', status: 'documents_received' },
  { id: 'c3', initials: 'RJ', name: 'Rohan Joshi', company: 'Bright Ventures', serviceTag: 'Patent', status: 'application_submitted' },
  { id: 'c4', initials: 'DG', name: 'Divya Gupta', company: 'Ideal Associates', serviceTag: 'Marriage Registration', status: 'government_verification' },
];
