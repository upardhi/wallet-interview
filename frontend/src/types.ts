export interface WalletBalance {
  id: number;
  token_symbol: string;
  balance: string;
  updated_at: string;
}

export interface Wallet {
  id: number;
  user_id: number;
  blockchain: string;
  address: string;
  created_at: string;
  balances: WalletBalance[];
}

export interface WalletsByBlockchain {
  blockchain: string;
  wallets: Wallet[];
}

// TODO: Add Transaction types
