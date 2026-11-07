import { Download, Upload } from "lucide-react";
import type { Page } from "../../types";

interface HeaderProps {
  page: Page;
  query: string;
  onUpload: (file: File) => void;
}

const pageContent: Record<Page, { title: string; subtitle: string; eyebrow: string }> = {
  overview: {
    eyebrow: "ANALYTICS / OVERVIEW",
    title: "Financial Overview",
    subtitle: "Monitor transactions, cash flow, and data quality in one place.",
  },
  transactions: {
    eyebrow: "FINANCIAL DATA / TRANSACTIONS",
    title: "Transaction Management",
    subtitle: "Search, inspect, and review imported financial records.",
  },
  quality: {
    eyebrow: "DATA GOVERNANCE / QUALITY",
    title: "Data Quality",
    subtitle: "Monitor completeness, duplicate identifiers, and validation signals.",
  },
};

export default function Header({ page, query, onUpload }: HeaderProps) {
  const content = pageContent[page];

  return (
    <header className="app-header">
      <div>
        <div className="eyebrow">{content.eyebrow}</div>
        <h1>{content.title}</h1>
        <p className="muted">{content.subtitle}</p>
      </div>

      <div className="header-actions">
        <label className="btn primary">
          <Upload size={16} />
          Import CSV
          <input
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(file);
              event.target.value = "";
            }}
          />
        </label>

        <a className="btn" href={`/api/export/?${query}`}>
          <Download size={16} />
          Export CSV
        </a>
      </div>
    </header>
  );
}
