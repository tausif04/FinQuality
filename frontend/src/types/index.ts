export type Page = "overview" | "transactions" | "quality";

export interface Summary {
  count: number;
  income: string;
  expenses: string;
  net: string;
  by_category: {
    category: string;
    total: string;
    count: number;
  }[];
  by_month: {
    month: string;
    income: string;
    expenses: string;
  }[];
}

export interface Quality {
  total_records: number;
  missing_optional_fields: number;
  duplicate_id_groups: number;
  duplicate_samples: {
    external_id: string;
    n: number;
  }[];
}

export interface Tx {
  id: number;
  external_id: string;
  occurred_on: string;
  amount: string;
  currency: string;
  category: string;
  merchant: string;
}

export interface TransactionResponse {
  count: number;
  results: Tx[];
}

export interface UploadResponse {
  imported: number;
  rejected: number;
  issues: {
    row: number | null;
    reason: string;
  }[];
}

export interface DashboardFilters {
  currency: string;
  category: string;
  start: string;
  end: string;
}

export interface ApiError {
  error?: string;
}
