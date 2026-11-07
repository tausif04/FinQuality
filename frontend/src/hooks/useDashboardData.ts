import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  DashboardFilters,
  Quality,
  Summary,
  TransactionResponse,
  Tx,
  UploadResponse,
} from "../types";
import { api } from "../utils/api";

const initialFilters: DashboardFilters = {
  currency: "USD",
  category: "",
  start: "",
  end: "",
};

export function useDashboardData() {
  const [filters, setFilters] = useState<DashboardFilters>(initialFilters);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [quality, setQuality] = useState<Quality | null>(null);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();

    if (filters.currency) params.set("currency", filters.currency);
    if (filters.category) params.set("category", filters.category);
    if (filters.start) params.set("start", filters.start);
    if (filters.end) params.set("end", filters.end);

    return params.toString();
  }, [filters]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [summaryData, qualityData, transactionData] = await Promise.all([
        api<Summary>(`/api/summary/?${query}`),
        api<Quality>(`/api/quality/?${query}`),
        api<TransactionResponse>(
          `/api/transactions/?${query}&page=${page}`
        ),
      ]);

      setSummary(summaryData);
      setQuality(qualityData);
      setTransactions(transactionData.results);
      setCount(transactionData.count);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateFilter = (key: keyof DashboardFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const uploadFile = async (file: File) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await api<UploadResponse>("/api/upload/", {
        method: "POST",
        body: formData,
      });

      const issueText = result.issues
        .slice(0, 3)
        .map((issue) => issue.reason)
        .join("; ");

      setMessage(
        `Imported ${result.imported} rows; rejected ${result.rejected}. ${issueText}`
      );

      setPage(1);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
