interface NotificationsProps {
  error: string;
  message: string;
  currency: string;
}

export default function Notifications({
  error,
  message,
  currency,
}: NotificationsProps) {
  return (
    <>
      {error && <div className="notice error">{error}</div>}
      {message && <div className="notice">{message}</div>}
      {!currency && (
        <div className="notice error">
          Select a currency for meaningful financial totals. Aggregating
          different currencies is not financially valid.
        </div>
      )}
    </>
  );
}
