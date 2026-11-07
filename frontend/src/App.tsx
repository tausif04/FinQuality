import { useState } from "react";
import type { Page } from "./types";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import FilterBar from "./components/common/FilterBar";
import Notifications from "./components/common/Notifications";

import OverviewPage from "./pages/OverviewPage";
import TransactionsPage from "./components/transactions/TransactionsPage";
import DataQualityPage from "./components/quality/DataQualityPage";

import { useDashboardData } from "./hooks/useDashboardData";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("overview");

  const {
    filters,
    updateFilter,
    query,
    summary,
    quality,
    transactions,
    count,
    page,
    setPage,
    loading,
    message,
    error,
    refresh,
    uploadFile,
  } = useDashboardData();

  return (
    <div className="layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="main">
        <Header
          page={activePage}
          query={query}
          onUpload={(file) => void uploadFile(file)}
        />

        <FilterBar
          filters={filters}
          onChange={updateFilter}
          onRefresh={() => void refresh()}
        />

        <Notifications
          error={error}
          message={message}
          currency={filters.currency}
        />

        {activePage === "overview" && (
          <OverviewPage
            summary={summary}
            quality={quality}
            transactions={transactions}
            count={count}
            currency={filters.currency}
            page={page}
            onPageChange={setPage}
          />
        )}

        {activePage === "transactions" && (
          <TransactionsPage
            summary={summary}
            transactions={transactions}
            count={count}
            page={page}
            onPageChange={setPage}
            currency={filters.currency}
          />
        )}

        {activePage === "quality" && (
          <DataQualityPage
            quality={quality}
            onRefresh={() => void refresh()}
          />
        )}

        <Footer loading={loading} />
      </main>
    </div>
  );
}
