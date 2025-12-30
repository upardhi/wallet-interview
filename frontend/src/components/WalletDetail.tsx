import { useState, useEffect } from 'react';
import { Wallet } from '../types';

interface WalletDetailProps {
  walletId: number;
}

export function WalletDetail({ walletId }: WalletDetailProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWallet() {
      try {
        const response = await fetch(`/api/wallets/${walletId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch wallet');
        }
        const data = await response.json();
        setWallet(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchWallet();
  }, [walletId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading wallet...</div>
    );
  }

  if (error || !wallet) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error || 'Wallet not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Info */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Wallet Details
        </h2>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-gray-500">Blockchain</dt>
          <dd className="text-gray-900 capitalize">{wallet.blockchain}</dd>
          <dt className="text-gray-500">Address</dt>
          <dd className="text-gray-900 font-mono truncate">{wallet.address}</dd>
        </dl>
      </div>

      {/* Balances */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Balances</h2>
        {wallet.balances.length === 0 ? (
          <p className="text-gray-500 text-sm">No balances</p>
        ) : (
          <div className="space-y-2">
            {wallet.balances.map((balance) => (
              <div
                key={balance.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span className="font-medium">{balance.token_symbol}</span>
                <span className="font-mono">{balance.balance}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TODO: Add Recent Transactions section here */}
    </div>
  );
}
