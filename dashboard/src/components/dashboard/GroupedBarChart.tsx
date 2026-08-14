import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface GroupedBarSeries {
  key: string;
  label: string;
  color: string;
}

export interface GroupedBarChartProps {
  data: Record<string, string | number>[];
  series: GroupedBarSeries[];
  xKey?: string;
  height?: number;
}

const GroupedBarChart = ({ data, series, xKey = 'name', height = 260 }: GroupedBarChartProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
      <XAxis dataKey={xKey} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
      <Tooltip
        contentStyle={{
          borderRadius: 8,
          border: '1px solid hsl(var(--border))',
          fontSize: 13,
        }}
      />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      {series.map((s) => (
        <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

export default GroupedBarChart;
