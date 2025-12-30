import { useState } from 'react';
import { WalletList } from './components/WalletList';
import { WalletDetail } from './components/WalletDetail';

export default function App() {
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-gray-900">Wallet Service</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4">
        {selectedWalletId ? (
          <div>
            <button
              onClick={() => setSelectedWalletId(null)}
              className="mb-4 text-blue-600 hover:text-blue-800"
            >
              &larr; Back to wallets
            </button>
            <WalletDetail walletId={selectedWalletId} />
          </div>
        ) : (
          <WalletList
            userId={1}
            onSelectWallet={(id) => setSelectedWalletId(id)}
          />
        )}
      </main>
    </div>
  );
}
