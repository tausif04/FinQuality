import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SpendingPoint {
  name: string;
  spending: number;
}

interface SpendingChartProps {
  data: SpendingPoint[];
}

export default function SpendingChart({ data }: SpendingChartProps) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h2>Spending by Category</h2>
          <p className="muted">Top expense categories</p>
        </div>
        <span className="pill">Breakdown</span>
      </div>

      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 8, right: 15 }}
          >
            <CartesianGrid stroke="#edf0f3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              width={90}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            <Bar
              dataKey="spending"
              fill="#0ebc8d"
              radius={[0, 5, 5, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
