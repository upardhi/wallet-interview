from decimal import Decimal
from datetime import datetime, timedelta
import random
from database import SessionLocal
from models import Transaction, Wallet

def create_transactions():
    """Create transactions for all wallets."""
    db = SessionLocal()
    
    try:
        # Get all wallets
        wallets = db.query(Wallet).all()
        if not wallets:
            print("No wallets found. Please run the main.py first to seed wallets.")
            return
        
        print(f"Found {len(wallets)} wallets")
        
        # Generate transaction addresses
        addresses = [
            "0x1111111111111111111111111111111111111111",
            "0x2222222222222222222222222222222222222222",
            "0x3333333333333333333333333333333333333333",
            "0x4444444444444444444444444444444444444444",
            "0x5555555555555555555555555555555555555555",
            "0x6666666666666666666666666666666666666666",
            "0x7777777777777777777777777777777777777777",
            "0x8888888888888888888888888888888888888888",
        ]
        
        transactions = []
        base_time = datetime.utcnow() - timedelta(days=30)
        
        # Create transactions for each wallet (10-15 transactions per wallet)
        for wallet in wallets:
            num_transactions = random.randint(10, 15)
            print(f"Creating {num_transactions} transactions for wallet {wallet.id}...")
            
            for i in range(num_transactions):
                transaction_type = random.choice(["send", "receive"])
                
                # Generate random amount between 0.001 and 100
                amount = Decimal(str(round(random.uniform(0.001, 100.0), 6)))
                
                # Set from_address and to_address based on transaction type
                if transaction_type == "send":
                    from_address = wallet.address
                    to_address = random.choice([addr for addr in addresses if addr != wallet.address])
                else:  # receive
                    from_address = random.choice([addr for addr in addresses if addr != wallet.address])
                    to_address = wallet.address
                
                # Random status: mostly confirmed, some pending, rarely failed
                status_weights = [("confirmed", 0.8), ("pending", 0.15), ("failed", 0.05)]
                status = random.choices(
                    [s[0] for s in status_weights],
                    weights=[s[1] for s in status_weights]
                )[0]
                
                # Set failed_reason if status is failed, otherwise empty string
                if status == "failed":
                    failed_reason = random.choice([
                        "Insufficient gas",
                        "Transaction reverted",
                        "Network congestion",
                        "Invalid recipient address"
                    ])
                else:
                    failed_reason = ""
                
                # Create transaction with random timestamp in the last 30 days
                created_at = base_time + timedelta(
                    days=random.randint(0, 30),
                    hours=random.randint(0, 23),
                    minutes=random.randint(0, 59)
                )
                
                transaction = Transaction(
                    wallet_id=wallet.id,
                    amount=amount,
                    transaction_type=transaction_type,
                    from_address=from_address,
                    to_address=to_address,
                    status=status,
                    failed_reason=failed_reason,
                    created_at=created_at
                )
                transactions.append(transaction)
        
        # Add all transactions to database
        db.add_all(transactions)
        db.commit()
        
        print(f"\nSuccessfully created {len(transactions)} transactions total!")
        
        # Show summary for each wallet
        print("\nTransaction summary by wallet:")
        for wallet in wallets:
            count = db.query(Transaction).filter(Transaction.wallet_id == wallet.id).count()
            print(f"  Wallet {wallet.id} ({wallet.address[:20]}...): {count} total transactions")
        
    except Exception as e:
        db.rollback()
        print(f"Error creating transactions: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_transactions()

