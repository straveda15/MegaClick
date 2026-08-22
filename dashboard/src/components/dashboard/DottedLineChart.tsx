import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface DottedLineSeries {
  key: string;
  label: string;
  color: string;
}

export interface DottedLineChartProps {
  data: Record<string, string | number>[];
  series: DottedLineSeries[];
  xKey?: string;
  height?: number;
}

/** A dotted/dashed line per series, with a marker at every point — the count
 * (Y axis) stays plain numbers; only the X axis's own granularity changes. */
const DottedLineChart = ({ data, series, xKey = 'x', height = 280 }: DottedLineChartProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
      <XAxis
        dataKey={xKey}
        tick={{ fontSize: 11 }}
        axisLine={false}
        tickLine={false}
        interval="preserveStartEnd"
        minTickGap={16}
      />
      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
      <Tooltip
        contentStyle={{
          borderRadius: 8,
          border: '1px solid hsl(var(--border))',
          fontSize: 13,
        }}
      />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      {series.map((s) => (
        <Line
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.label}
          stroke={s.color}
          strokeWidth={2}
          strokeDasharray="3 5"
          strokeLinecap="round"
          dot={{ r: 3, strokeWidth: 0, fill: s.color }}
          activeDot={{ r: 5 }}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

export default DottedLineChart;
