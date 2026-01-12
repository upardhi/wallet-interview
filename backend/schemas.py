from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class WalletBalanceResponse(BaseModel):
    id: int
    token_symbol: str
    balance: Decimal
    updated_at: datetime

    model_config = {"from_attributes": True}

class TransactionResponse(BaseModel):
    id: int
    amount: Decimal
    transaction_type: str
    from_address: str
    to_address: str
    status: str
    created_at: datetime
    updated_at: datetime
    failed_reason: str
    model_config = {"from_attributes": True}


class WalletResponse(BaseModel):
    id: int
    user_id: int
    blockchain: str
    address: str
    created_at: datetime
    balances: list[WalletBalanceResponse]
    transactions: list[TransactionResponse]
    model_config = {"from_attributes": True}


class WalletsByBlockchainResponse(BaseModel):
    blockchain: str
    wallets: list[WalletResponse]
