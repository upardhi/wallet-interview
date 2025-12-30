# Wallet Service - Interview Exercise

A simplified wallet service for the technical interview.

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
Backend runs at http://localhost:8000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

---

## Interview Task: Add "Recent Transactions" Feature

### Requirements

**1. Backend - Transaction Model & API**

Design and implement a `Transaction` model. Consider what fields are needed for a crypto transaction.

Create endpoint: `GET /wallets/{wallet_id}/transactions`
- Pagination (your choice: cursor-based or offset-based, explain why)
- Filter by transaction type (e.g., send, receive, swap)
- Filter by date range
- Proper response schema

**2. Frontend - Transactions Component**

Add a "Recent Transactions" section to the wallet detail view:
- Display transactions in a table
- Show loading and empty states
- Use existing patterns (TypeScript, Tailwind)

**3. Testing**

Write ONE test that you think is most valuable. Explain why you chose that test.

### Guidelines

- Use any tools you normally use (AI assistants, docs, etc.)
- Talk through your design decisions as you work
- Quality over completion - I care more about your reasoning than finishing everything
- Feel free to ask clarifying questions

### Time: ~60 minutes
