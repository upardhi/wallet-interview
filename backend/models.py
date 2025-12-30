from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Wallet(Base):
    __tablename__ = "wallets"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(index=True)
    blockchain: Mapped[str] = mapped_column(String(50))
    address: Mapped[str] = mapped_column(String(255), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    balances: Mapped[list["WalletBalance"]] = relationship(back_populates="wallet")


class WalletBalance(Base):
    __tablename__ = "wallet_balances"

    id: Mapped[int] = mapped_column(primary_key=True)
    wallet_id: Mapped[int] = mapped_column(ForeignKey("wallets.id"), index=True)
    token_symbol: Mapped[str] = mapped_column(String(20))
    balance: Mapped[Decimal] = mapped_column(Numeric(36, 18), default=Decimal("0"))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    wallet: Mapped["Wallet"] = relationship(back_populates="balances")
