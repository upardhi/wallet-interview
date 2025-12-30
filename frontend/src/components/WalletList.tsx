import { useState, useEffect } from 'react';
import { WalletsByBlockchain } from '../types';

interface WalletListProps {
  userId: number;
  onSelectWallet: (walletId: number) => void;
}

export function WalletList({ userId, onSelectWallet }: WalletListProps) {
  const [walletGroups, setWalletGroups] = useState<WalletsByBlockchain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWallets() {
      try {
        const response = await fetch(`/api/users/${userId}/wallets`);
        if (!response.ok) {
          throw new Error('Failed to fetch wallets');
        }
        const data = await response.json();
        setWalletGroups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchWallets();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading wallets...</div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
    );
  }

  if (walletGroups.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No wallets found</div>
    );
  }

  return (
    <div className="space-y-6">
      {walletGroups.map((group) => (
        <div key={group.blockchain} className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 capitalize mb-3">
            {group.blockchain}
          </h2>
          <div className="space-y-2">
            {group.wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => onSelectWallet(wallet.id)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="font-mono text-sm text-gray-600 truncate">
                  {wallet.address}
                </div>
                <div className="mt-1 flex gap-2">
                  {wallet.balances.map((bal) => (
                    <span
                      key={bal.id}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                    >
                      {bal.balance} {bal.token_symbol}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
