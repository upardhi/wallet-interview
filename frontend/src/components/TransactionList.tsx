import { useState, useEffect } from "react";

interface Transaction {
  id: number;
  amount: string;
  transaction_type: string;
  from_address: string;
  to_address: string;
  status: string;
  created_at: string;
  updated_at: string;
  failed_reason: string;
}

export function TransactionList({ walletId }: { walletId: number }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/wallets/${walletId}/transactions`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTransactions();
  }, [walletId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading transactions...
      </div>
    );
  }

  if (error || !walletId || transactions.length === 0) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error || "Transaction not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Transaction List
        </h2>
      </div>

      {/* Balances */}

      {/* TODO: Add Recent Transactions section here */}
      <table className="border-collapse table-fixed w-full text-sm">
        <thead>
          <tr className="bg-gray-100 border font-medium p-4 pl-8 pt-0 pb-3">
            <th className="border-b  font-medium p-4 pl-8 pt-0 pb-3  text-left">
              Transaction Type
            </th>
            <th className="border-b  font-medium p-4 pl-8 pt-0 pb-3  text-left">
              Amount
            </th>
            <th className="border-b  font-medium p-4 pl-8 pt-0 pb-3  text-left">
              From Address
            </th>
            <th className="border-b  font-medium p-4 pl-8 pt-0 pb-3  text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {transaction.transaction_type.toUpperCase()}
              </td>

              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                {transaction.amount}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                {transaction.from_address.slice(0, 10)}...
                {transaction.from_address.slice(-10)}
              </td>

              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                {transaction.status.toUpperCase()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
