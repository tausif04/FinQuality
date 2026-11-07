import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  note: string;
  positive?: boolean;
}

export default function MetricCard({
  title,
  value,
  icon,
  note,
  positive,
}: MetricCardProps) {
  return (
    <div className="metric">
      <div className="metric-top">
        <span>{title}</span>
        <span className="metric-icon">{icon}</span>
      </div>

      <strong>{value}</strong>

      <small className={positive ? "positive" : "muted"}>
        {note}
      </small>
    </div>
  );
}
