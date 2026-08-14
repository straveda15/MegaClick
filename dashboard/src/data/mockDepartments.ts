export interface Department {
  id: string;
  name: string;
  iconName: string;
  headcount: number;
  activeTasks: number;
  completedTasks: number;
  members: string[]; // Initials of team members
}

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'dept-sales',    name: 'Sales',                iconName: 'Landmark',      headcount: 3, activeTasks: 6, completedTasks: 3, members: ['NC', 'RR', 'TP'] },
  { id: 'dept-legal',    name: 'Legal',                iconName: 'Scale',         headcount: 3, activeTasks: 7, completedTasks: 2, members: ['RS', 'NM', 'RK'] },
  { id: 'dept-finance',  name: 'Finance',              iconName: 'Wallet',        headcount: 3, activeTasks: 8, completedTasks: 1, members: ['DS', 'RN', 'NB'] },
  { id: 'dept-property', name: 'Property',             iconName: 'Home',          headcount: 3, activeTasks: 8, completedTasks: 1, members: ['AJ', 'DN', 'RV'] },
  { id: 'dept-gov',      name: 'Government Services',  iconName: 'Building2',     headcount: 3, activeTasks: 7, completedTasks: 2, members: ['PG', 'AK', 'DD'] },
  { id: 'dept-marketing',name: 'Marketing',            iconName: 'Megaphone',     headcount: 3, activeTasks: 6, completedTasks: 3, members: ['RP', 'PB', 'AS'] },
  { id: 'dept-support',  name: 'Support',              iconName: 'LifeBuoy',      headcount: 2, activeTasks: 5, completedTasks: 1, members: ['SJ', 'TK'] },
  { id: 'dept-admin',    name: 'Administration',       iconName: 'ClipboardList', headcount: 2, activeTasks: 6, completedTasks: 0, members: ['MN', 'OP'] },
  { id: 'dept-mgmt',     name: 'Management',           iconName: 'Crown',         headcount: 2, activeTasks: 5, completedTasks: 1, members: ['XY', 'ZA'] },
];
