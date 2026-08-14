import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const KPI_DATA = [
  { label: 'Lead Conversion', value: '45%', change: '+6% MoM', up: true },
  { label: 'Avg Service Time', value: '8.2d', change: '-1.4d', up: true },
  { label: 'Tasks / Employee', value: '14', change: '+2', up: true },
  { label: 'On-time Delivery', value: '87%', change: '+3%', up: true },
];

const LEAD_TREND_DATA = [
  { month: 'Feb', value1: 62, value2: 22 },
  { month: 'Mar', value1: 75, value2: 30 },
  { month: 'Apr', value1: 85, value2: 34 },
  { month: 'May', value1: 92, value2: 40 },
  { month: 'Jun', value1: 105, value2: 45 },
  { month: 'Jul', value1: 120, value2: 53 },
];

const EMPLOYEE_PERFORMANCE_DATA = [
  { name: 'Neha', value: 20 },
  { name: 'Rohan', value: 27 },
  { name: 'Divya', value: 34 },
  { name: 'Arjun', value: 41 },
  { name: 'Pooja', value: 48 },
  { name: 'Rajesh', value: 55 },
  { name: 'Nikita', value: 62 },
  { name: 'Harsh', value: 70 },
];

const WEEKLY_TASK_DATA = [
  { day: 'Mon', tasksA: 8, tasksB: 3 },
  { day: 'Tue', tasksA: 12, tasksB: 4 },
  { day: 'Wed', tasksA: 9, tasksB: 5 },
  { day: 'Thu', tasksA: 14, tasksB: 2 },
  { day: 'Fri', tasksA: 11, tasksB: 6 },
  { day: 'Sat', tasksA: 7, tasksB: 3 },
];

const DEPARTMENT_REPORT_DATA = [
  { name: 'Sales', val1: 2.8, val2: 6.2 },
  { name: 'Finance', val1: 1.0, val2: 8.0 },
  { name: 'Government', val1: 2.0, val2: 7.0 },
  { name: 'Support', val1: 1.0, val2: 6.0 },
  { name: 'Management', val1: 1.0, val2: 6.0 },
];

const ReportsPage = () => {
  return (
    <div className="py-4 space-y-6">
      
      {/* ── KPI Row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_DATA.map((kpi, idx) => (
          <div key={idx} className="bg-card border border-border rounded-[14px] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
            <h3 className="text-[13px] font-medium text-muted-foreground mb-2">{kpi.label}</h3>
            <div className="text-[26px] font-bold text-foreground leading-tight mb-1">{kpi.value}</div>
            <div className={`text-[13px] font-medium ${kpi.up ? 'text-emerald-500' : 'text-red-500'}`}>
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts Row 1 ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Lead Conversion Trend */}
        <div className="bg-card border border-border rounded-[14px] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-6">Lead Conversion Trend</h3>
          <div className="flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LEAD_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} ticks={[0, 30, 60, 90, 120]} domain={[0, 120]} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="value1" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="value2" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Performance */}
        <div className="bg-card border border-border rounded-[14px] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-6">Employee Performance</h3>
          <div className="flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EMPLOYEE_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} ticks={[0, 20, 40, 60, 80]} domain={[0, 80]} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} contentStyle={{ borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── Charts Row 2 ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Weekly Task Completion */}
        <div className="bg-card border border-border rounded-[14px] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-6">Weekly Task Completion</h3>
          <div className="flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_TASK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} ticks={[0, 4, 8, 12, 16]} domain={[0, 16]} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} contentStyle={{ borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="tasksA" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="tasksB" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Report */}
        <div className="bg-card border border-border rounded-[14px] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col">
          <h3 className="text-sm font-semibold text-foreground mb-6">Department Report</h3>
          <div className="flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={DEPARTMENT_REPORT_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} ticks={[0, 3, 6, 9, 12]} domain={[0, 12]} dy={5} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={80} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} contentStyle={{ borderRadius: 8, fontSize: 12, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="val1" stackId="a" fill="#34d399" barSize={18} />
                <Bar dataKey="val2" stackId="a" fill="#fbbf24" barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReportsPage;
