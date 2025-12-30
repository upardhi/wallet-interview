from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class WalletBalanceResponse(BaseModel):
    id: int
    token_symbol: str
    balance: Decimal
    updated_at: datetime

    model_config = {"from_attributes": True}


class WalletResponse(BaseModel):
    id: int
    user_id: int
    blockchain: str
    address: str
    created_at: datetime
    balances: list[WalletBalanceResponse]

    model_config = {"from_attributes": True}


class WalletsByBlockchainResponse(BaseModel):
    blockchain: str
    wallets: list[WalletResponse]
