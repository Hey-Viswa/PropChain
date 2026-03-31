# PropChain — Mint Flow + Failure Handling (Corrected)

```mermaid
sequenceDiagram
  participant Client
  participant APIRoute as API Route
  participant MongoDB as MongoDB ~
  participant MetaMask
  participant SmartContract as Smart Contract ⚡

  Client->>APIRoute: POST /api/properties (form data)
  Note over APIRoute: Guards: KYC ✓ | Wallet bound ✓ | ULPIN unique (findOneAndUpdate upsert)
  APIRoute->>MongoDB: Transaction: CREATE Property{status: PENDING_MINT, tokenId: null} + ActivityLog
  MongoDB-->>APIRoute: { propertyId }
  APIRoute-->>Client: 200 { propertyId }
  Note over Client: Client opens MetaMask
  Client->>SmartContract: mintProperty(ulpin, ipfsHash, addr, area)
  SmartContract-->>Client: { txHash, tokenId }
  Note over Client,APIRoute: --- SUCCESS PATH ---
  Client->>APIRoute: POST /api/properties/[id]/confirm-mint { txHash, tokenId } [IDEMPOTENT]
  Note over APIRoute,SmartContract: RPC: getTransactionReceipt(txHash)<br/>status===1 + to===CONTRACT + MintedProperty event parsed
  APIRoute->>MongoDB: UPDATE Property{status: MINTED, tokenId, txHash} + ActivityLog{MINT_CONFIRMED}
  MongoDB-->>APIRoute: OK
  APIRoute-->>Client: 200 OK → show "Awaiting Oracle"

  Note over Client,SmartContract: FAILURE SCENARIOS<br/>[1] MetaMask REJECTED:<br/>    Property stays PENDING_MINT | No chain state | User retries from My Properties<br/>[2] Chain confirms but confirm-mint fails:<br/>    Path A: Client retries confirm-mint (IDEMPOTENT — safe to retry)<br/>    Path B: RecoveryWorker auto-recovery runs in 5min cron<br/>[3] Wallet disconnects mid-transaction:<br/>    60s client timeout | Property stays PENDING_MINT | RecoveryWorker scans<br/>[4] ULPIN duplicate simultaneous submit:<br/>    MongoDB unique index rejects second insert atomically | 409 CONFLICT returned
```

## Legend

| Symbol | Meaning |
|---|---|
| Solid arrow `──►` | mandatory / trusted call |
| Dashed arrow `- -►` | cache write / best-effort |
| ⚡ | On-chain verification (never skip) |
| `~` | MongoDB mirror (not authoritative) |
| `[AUTHORITY]` | Source of truth |
| `[CACHE ONLY]` | Display layer only |
