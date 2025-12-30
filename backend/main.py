from collections import defaultdict
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from database import Base, engine, get_db
from models import Wallet, WalletBalance
from schemas import WalletResponse, WalletsByBlockchainResponse

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wallet Service")


@app.on_event("startup")
def seed_data():
    """Seed some test data on startup."""
    db = next(get_db())

    if db.query(Wallet).count() > 0:
        return

    # Create test wallets
    wallets = [
        Wallet(user_id=1, blockchain="ethereum", address="0xabc123..."),
        Wallet(user_id=1, blockchain="ethereum", address="0xdef456..."),
        Wallet(user_id=1, blockchain="polygon", address="0xpoly789..."),
        Wallet(user_id=2, blockchain="ethereum", address="0xuser2eth..."),
    ]
    db.add_all(wallets)
    db.commit()

    # Add balances
    balances = [
        WalletBalance(wallet_id=1, token_symbol="ETH", balance="1.5"),
        WalletBalance(wallet_id=1, token_symbol="USDC", balance="1000.00"),
        WalletBalance(wallet_id=2, token_symbol="ETH", balance="0.25"),
        WalletBalance(wallet_id=3, token_symbol="MATIC", balance="500.0"),
        WalletBalance(wallet_id=3, token_symbol="USDC", balance="250.00"),
        WalletBalance(wallet_id=4, token_symbol="ETH", balance="2.0"),
    ]
    db.add_all(balances)
    db.commit()
    db.close()


@app.get("/users/{user_id}/wallets", response_model=list[WalletsByBlockchainResponse])
def get_user_wallets(user_id: int, db: Session = Depends(get_db)):
    """Get all wallets for a user, grouped by blockchain."""
    wallets = (
        db.query(Wallet)
        .options(joinedload(Wallet.balances))
        .filter(Wallet.user_id == user_id)
        .all()
    )

    if not wallets:
        raise HTTPException(status_code=404, detail="No wallets found for user")

    # Group by blockchain
    by_blockchain = defaultdict(list)
    for wallet in wallets:
        by_blockchain[wallet.blockchain].append(wallet)

    return [
        WalletsByBlockchainResponse(blockchain=bc, wallets=ws)
        for bc, ws in by_blockchain.items()
    ]


@app.get("/wallets/{wallet_id}", response_model=WalletResponse)
def get_wallet(wallet_id: int, db: Session = Depends(get_db)):
    """Get a single wallet with its balances."""
    wallet = (
        db.query(Wallet)
        .options(joinedload(Wallet.balances))
        .filter(Wallet.id == wallet_id)
        .first()
    )

    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    return wallet


# TODO: Add GET /wallets/{wallet_id}/transactions endpoint


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
