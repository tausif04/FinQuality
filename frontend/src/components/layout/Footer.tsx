interface FooterProps {
  loading: boolean;
}

export default function Footer({ loading }: FooterProps) {
  return (
    <footer className="footer">
      {loading ? (
        "Updating data…"
      ) : (
        <div className="footer-content">
          <span>© {new Date().getFullYear()} FinQuality</span>
          <span>Financial Data Analytics &amp; Quality Dashboard</span>
        </div>
      )}
    </footer>
  );
}
