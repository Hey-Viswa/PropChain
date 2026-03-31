# PropChain — Oracle Approval Flow (Corrected)

```mermaid
sequenceDiagram
  participant OracleClient as Oracle Client 🟡
  participant APIRoute as API Route
  participant MongoDB as MongoDB ~
  participant SmartContract as Smart Contract ⚡
  participant AuditService

  Note over OracleClient,AuditService: STEP 1 — Authentication
  OracleClient->>APIRoute: POST /oracle/verify-access { passphrase }
  Note over APIRoute: Server: hash(passphrase) === process.env.ORACLE_ACCESS_HASH (server-only, NOT NEXT_PUBLIC)
  APIRoute->>SmartContract: hasRole(ORACLE_ROLE, wallet) ⚡
  SmartContract-->>APIRoute: true / false
  Note over APIRoute: If false → 403 FORBIDDEN
  APIRoute-->>OracleClient: { oracleJWT (30min TTL) }

  Note over OracleClient,AuditService: STEP 2 — Fetch Queue
  OracleClient->>APIRoute: GET /oracle/queue (oracleJWT)
  APIRoute->>MongoDB: Query: status=MINTED AND tokenId != null
  MongoDB-->>APIRoute: [ properties list ]
  Note over APIRoute: Properties with tokenId=null shown as DB-PENDING (not approvable)
  APIRoute-->>OracleClient: [ properties ]

  Note over OracleClient,AuditService: STEP 3 — Approve
  OracleClient->>APIRoute: POST /oracle/approve/[propertyId] (oracleJWT)
  Note over APIRoute: Guards: oracleJWT valid | tokenId != null | status === MINTED
  APIRoute->>SmartContract: hasRole(ORACLE_ROLE, wallet) ⚡ [RE-CHECKED EVERY CALL]
  SmartContract-->>APIRoute: true
  APIRoute->>SmartContract: approveProperty(tokenId)
  SmartContract-->>APIRoute: { txHash }
  Note over APIRoute,SmartContract: ⚡ waitForTransactionReceipt(txHash, confirmations=1, timeout=30s)<br/>ASSERT receipt.status === 1<br/>If reverted → 500, do NOT update MongoDB
  APIRoute->>MongoDB: UPDATE Property{status: APPROVED, oracleTxHash, approvedBy, approvedAt} ~
  MongoDB-->>APIRoute: OK
  APIRoute->>AuditService: ActivityLog.create{ type: ORACLE_APPROVED } ~
  AuditService-->>APIRoute: OK
  APIRoute-->>OracleClient: 200 OK
```

## Critical Guards

| # | Guard |
|---|---|
| [1] | `ORACLE_ACCESS_HASH` is server-only env var (NOT `NEXT_PUBLIC_`) |
| [2] | `hasRole(ORACLE_ROLE, wallet)` called on EVERY approval — never trust DB cache |
| [3] | `tokenId === null` blocks on-chain call — shown as DB-PENDING |
| [4] | MongoDB update happens AFTER `receipt.status===1` — never on txHash alone |
| [5] | `oracleJWT` expires 30min — Oracle must re-authenticate |

## Legend

| Symbol | Meaning |
|---|---|
| Solid arrow `──►` | mandatory / trusted call |
| Dashed arrow `- -►` | cache write / best-effort |
| ⚡ | On-chain verification (never skip) |
| `~` | MongoDB mirror (not authoritative) |
| `[AUTHORITY]` | Source of truth |
| `[CACHE ONLY]` | Display layer only |
