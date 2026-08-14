import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface AreaTrendSeries {
  key: string;
  label: string;
  color: string;
}

export interface AreaTrendChartProps {
  data: Record<string, string | number>[];
  series: AreaTrendSeries[];
  xKey?: string;
  height?: number;
}

const AreaTrendChart = ({ data, series, xKey = 'month', height = 280 }: AreaTrendChartProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
      <defs>
        {series.map((s) => (
          <linearGradient key={s.key} id={`areaFill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={s.color} stopOpacity={0.03} />
          </linearGradient>
        ))}
      </defs>
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
        <Area
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.label}
          stroke={s.color}
          strokeWidth={2}
          fill={`url(#areaFill-${s.key})`}
        />
      ))}
    </AreaChart>
  </ResponsiveContainer>
);

export default AreaTrendChart;
