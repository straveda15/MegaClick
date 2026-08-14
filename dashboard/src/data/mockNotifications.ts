export type NotificationType = 'lead' | 'task' | 'client' | 'system' | 'service';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  tag?: string;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1',  title: 'New lead assigned',              body: 'LD-1119 Meridian Group was assigned to you.',                          timestamp: '2026-07-23T09:22:00', read: false, type: 'lead',    tag: 'LD-1119' },
  { id: 'n2',  title: 'Task overdue',                   body: 'TK-4056 File GST return for June is overdue.',                         timestamp: '2026-07-23T08:10:00', read: false, type: 'task',    tag: 'TK-4056' },
  { id: 'n3',  title: 'Client document uploaded',       body: 'Amit Patel uploaded Sale_Deed_Draft for CL-2069.',                     timestamp: '2026-07-22T17:45:00', read: false, type: 'client',  tag: 'CL-2069' },
  { id: 'n4',  title: 'Service status updated',         body: 'SV-3021 Trademark moved to Government Verification.',                  timestamp: '2026-07-22T15:30:00', read: true,  type: 'service', tag: 'SV-3021' },
  { id: 'n5',  title: 'Lead converted',                 body: 'LD-1042 converted to client CL-2069.',                                 timestamp: '2026-07-22T10:24:00', read: true,  type: 'lead',    tag: 'LD-1042' },
  { id: 'n6',  title: 'New task assigned',              body: 'TK-4060 Draft Sale Agreement was assigned to you by Rajesh Sharma.',   timestamp: '2026-07-21T14:05:00', read: true,  type: 'task',    tag: 'TK-4060' },
  { id: 'n7',  title: 'Approval received',              body: 'SV-3005 Patent application received approval from authority.',          timestamp: '2026-07-21T11:00:00', read: true,  type: 'service', tag: 'SV-3005' },
  { id: 'n8',  title: 'Document deadline approaching',  body: 'SV-3006 Marriage Registration — certificate due in 2 days.',           timestamp: '2026-07-21T09:45:00', read: true,  type: 'system'  },
  { id: 'n9',  title: 'New client onboarded',           body: 'Tanvi Malhotra was added as client CL-2074.',                          timestamp: '2026-07-20T16:20:00', read: true,  type: 'client',  tag: 'CL-2074' },
  { id: 'n10', title: 'Task completed',                 body: 'TK-4048 File Trademark Application marked as completed by Neha Desai.',timestamp: '2026-07-20T13:10:00', read: true,  type: 'task',    tag: 'TK-4048' },
];
