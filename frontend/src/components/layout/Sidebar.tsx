import {
  Activity,
  AlertTriangle,
  Database,
} from "lucide-react";
import type { Page } from "../../types";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({
  activePage,
  onNavigate,
}: SidebarProps) {
  const navigation: {
    id: Page;
    label: string;
    icon: typeof Activity;
  }[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "transactions", label: "Transactions", icon: Database },
    { id: "quality", label: "Data Quality", icon: AlertTriangle },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon">
          <Activity size={21} />
        </span>

        <span>
          Fin<span className="accent">Quality</span>
          <small>FINANCIAL INTELLIGENCE</small>
        </span>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`nav ${activePage === id ? "active" : ""}`}
            onClick={() => onNavigate(id)}
            aria-current={activePage === id ? "page" : undefined}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <span className="status-dot" />
        Financial Analytics Platform
        <small>Monitor • Analyze • Improve</small>
      </div>
    </aside>
  );
}
