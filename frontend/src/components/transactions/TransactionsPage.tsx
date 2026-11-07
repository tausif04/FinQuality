import { useMemo, useState } from "react";
import {
  Database,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { Summary, Tx } from "../../types";
import { money } from "../../utils/format";
import MetricCard from "../common/MetricCard";
import TransactionsTable from "./TransactionsTable";

interface TransactionsPageProps {
  summary: Summary | null;
  transactions: Tx[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  currency: string;
}

export default function TransactionsPage({
  summary,
  transactions,
  count,
  page,
  onPageChange,
  currency,
}: TransactionsPageProps) {
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return transactions;

    return transactions.filter((transaction) =>
      [
        transaction.external_id,
        transaction.merchant,
        transaction.category,
      ].some((value) => (value || "").toLowerCase().includes(term))
    );
  }, [transactions, search]);

  const totalPages = Math.max(1, Math.ceil(count / 25));

  return (
    <section className="page-content">
      <div className="metrics">
        <MetricCard
          title="Total Transactions"
          value={String(summary?.count ?? 0)}
          icon={<Database size={20} />}
          note="Current filter"
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
      </div>

      <div className="panel transaction-panel">
        <div className="panel-head">
          <div>
            <h2>All Transactions</h2>
            <p className="muted">
              Search the transactions loaded on the current page.
            </p>
          </div>
          <span className="pill">{count} records</span>
        </div>

        <label className="transaction-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search transaction ID, merchant or category..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <TransactionsTable
          transactions={filteredTransactions}
          showCurrency
        />

        <div className="pagination">
          <span>
            Page {page} of {totalPages} · {filteredTransactions.length} shown
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
    </section>
  );
}
