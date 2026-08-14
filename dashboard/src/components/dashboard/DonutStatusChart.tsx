import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface DonutStatusDatum {
  key: string;
  label: string;
  value: number;
  color: string;
}

const DonutStatusChart = ({ data, height = 200 }: { data: DonutStatusDatum[]; height?: number }) => (
  <div>
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius="60%"
          outerRadius="90%"
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((d) => (
            <Cell key={d.key} fill={d.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid hsl(var(--border))',
            fontSize: 13,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
      {data.map((d) => (
        <div key={d.key} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
          <span className="text-muted-foreground truncate">{d.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default DonutStatusChart;
