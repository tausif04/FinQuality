import { RefreshCw } from "lucide-react";
import type { DashboardFilters } from "../../types";

interface FilterBarProps {
  filters: DashboardFilters;
  onChange: (key: keyof DashboardFilters, value: string) => void;
  onRefresh: () => void;
}

export default function FilterBar({
  filters,
  onChange,
  onRefresh,
}: FilterBarProps) {
  return (
    <section className="filters">
      <label>
        Currency
        <select
          value={filters.currency}
          onChange={(event) => onChange("currency", event.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="BDT">BDT</option>
          <option value="">All (not comparable)</option>
        </select>
      </label>

      <label>
        Category
        <input
          placeholder="All categories"
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
        />
      </label>

      <label>
        From
        <input
          type="date"
          value={filters.start}
          onChange={(event) => onChange("start", event.target.value)}
        />
      </label>

      <label>
        To
        <input
          type="date"
          value={filters.end}
          onChange={(event) => onChange("end", event.target.value)}
        />
      </label>

      <button className="btn refresh" onClick={onRefresh}>
        <RefreshCw size={16} />
        Refresh
      </button>
    </section>
  );
}
