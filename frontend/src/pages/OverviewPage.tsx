import {
  AlertTriangle,
  Database,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { Quality, Summary, Tx } from "../types";
import { money } from "../utils/format";
import MetricCard from "../components/common/MetricCard";
import CashFlowChart from "../components/charts/CashFlowChart";
import SpendingChart from "../components/charts/SpendingChart";
import TransactionsTable from "../components/transactions/TransactionsTable";

interface OverviewPageProps {
  summary: Summary | null;
  quality: Quality | null;
  transactions: Tx[];
  count: number;
  currency: string;
  page: number;
  onPageChange: (page: number) => void;
}

export default function OverviewPage({
  summary,
  quality,
  transactions,
  count,
  currency,
  page,
  onPageChange,
}: OverviewPageProps) {
  const months = (summary?.by_month ?? []).map((item) => ({
    month: item.month,
    income: Number(item.income),
    spending: Math.abs(Number(item.expenses)),
  }));

  const categories = (summary?.by_category ?? [])
    .filter((item) => Number(item.total) < 0)
    .map((item) => ({
      name: item.category,
      spending: Math.abs(Number(item.total)),
    }))
    .sort((a, b) => b.spending - a.spending)
    .slice(0, 7);

  const totalPages = Math.max(1, Math.ceil(count / 25));

  return (
    <>
      <section className="metrics">
        <MetricCard
          title="Total Transactions"
          value={String(summary?.count ?? 0)}
          icon={<Database size={20} />}
          note="Records in current filter"
        />
        <MetricCard
          title="Total Income"
          value={money(Number(summary?.income || 0))}
          icon={<TrendingUp size={20} />}
          note={currency || "Mixed currencies"}
          positive
        />
        <MetricCard
          title="Total Expenses"
          value={money(Math.abs(Number(summary?.expenses || 0)))}
          icon={<TrendingDown size={20} />}
          note="Absolute spending"
        />
        <MetricCard
          title="Net Cash Flow"
          value={money(Number(summary?.net || 0))}
          icon={<Wallet size={20} />}
          note="Income minus expenses"
          positive={Number(summary?.net || 0) >= 0}
        />
      </section>

      <section className="charts">
        <CashFlowChart data={months} />
        <SpendingChart data={categories} />
      </section>

      <section className="bottom-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Recent Transactions</h2>
              <p className="muted">Latest imported records</p>
            </div>
            <span className="pill">{count} records</span>
          </div>

          <TransactionsTable transactions={transactions} />

          <div className="pagination">
            <span>
              Page {page} of {totalPages}
            </span>
            <div>
              <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="panel quality">
          <div className="panel-head">
            <div>
              <h2>Data Quality</h2>
              <p className="muted">Automated validation signals</p>
            </div>
            <AlertTriangle size={20} color="#f59e0b" />
          </div>

          <div className="quality-row">
            <div>
              <small>Records analyzed</small>
              <strong>{quality?.total_records ?? 0}</strong>
            </div>
            <Database size={18} />
          </div>

          <div className="quality-row">
            <div>
              <small>Missing category / merchant</small>
              <strong>{quality?.missing_optional_fields ?? 0}</strong>
            </div>
            <Search size={18} />
          </div>

          <div className="quality-row">
            <div>
              <small>Duplicate ID groups</small>
              <strong>{quality?.duplicate_id_groups ?? 0}</strong>
            </div>
            <AlertTriangle size={18} />
          </div>

          <p className="muted footnote">
            Upload checks also report malformed rows and duplicate IDs.
            See the import result for rejected-record details.
          </p>
        </div>
      </section>
    </>
  );
}
