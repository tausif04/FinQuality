import type { Tx } from "../../types";
import { money } from "../../utils/format";

interface TransactionsTableProps {
  transactions: Tx[];
  showCurrency?: boolean;
}

export default function TransactionsTable({
  transactions,
  showCurrency = false,
}: TransactionsTableProps) {
  const columnCount = showCurrency ? 6 : 5;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Merchant</th>
            <th>Category</th>
            {showCurrency && <th>Currency</th>}
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => {
            const amount = Number(transaction.amount);

            return (
              <tr key={transaction.id}>
                <td className="mono">{transaction.external_id}</td>
                <td>{transaction.occurred_on}</td>
                <td>{transaction.merchant || "—"}</td>
                <td>
                  <span className="tag">
                    {transaction.category || "Missing"}
                  </span>
                </td>
                {showCurrency && <td>{transaction.currency}</td>}
                <td className={amount >= 0 ? "positive" : "negative"}>
                  {amount >= 0 ? "+" : "−"}
                  {money(Math.abs(amount))}
                </td>
              </tr>
            );
          })}

          {transactions.length === 0 && (
            <tr>
              <td colSpan={columnCount} className="empty">
                No transactions found. Import a CSV file to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
