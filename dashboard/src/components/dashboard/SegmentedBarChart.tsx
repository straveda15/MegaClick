import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface SegmentedBarDatum {
  name: string;
  main: number;
  cap: number;
}

export interface SegmentedBarChartProps {
  data: SegmentedBarDatum[];
  mainColor: string;
  capColor: string;
  height?: number;
}

const SegmentedBarChart = ({ data, mainColor, capColor, height = 260 }: SegmentedBarChartProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
      <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
      <Tooltip
        contentStyle={{
          borderRadius: 8,
          border: '1px solid hsl(var(--border))',
          fontSize: 13,
        }}
      />
      <Bar dataKey="main" stackId="a" fill={mainColor} radius={[0, 0, 4, 4]} />
      <Bar dataKey="cap" stackId="a" fill={capColor} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default SegmentedBarChart;
