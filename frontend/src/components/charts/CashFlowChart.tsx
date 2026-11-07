import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CashFlowPoint {
  month: string;
  income: number;
  spending: number;
}

interface CashFlowChartProps {
  data: CashFlowPoint[];
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h2>Cash Flow Trend</h2>
          <p className="muted">Monthly income and expenses</p>
        </div>
        <span className="pill">Monthly</span>
      </div>

      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#12b886" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#12b886" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#edf0f3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#0aa87e"
              fill="url(#income)"
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="spending"
              stroke="#64748b"
              fill="transparent"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
