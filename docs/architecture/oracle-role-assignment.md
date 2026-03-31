# PropChain — Oracle Role Assignment Flow (NEW)

```mermaid
sequenceDiagram
  participant AdminClient as Admin Client 🔴
  participant APIRoute as API Route
  participant SmartContract as Smart Contract ⚡
  participant MongoDB as MongoDB ~
  participant AuditService

  AdminClient->>APIRoute: POST /api/admin/assign-oracle { targetClerkId, targetWallet }
  Note over APIRoute: Guard: Caller has AdminRole{ role: SUPER_ADMIN } in MongoDB
  Note over APIRoute: Validate targetWallet format: /^0x[a-fA-F0-9]{40}$/
  APIRoute->>SmartContract: hasRole(ORACLE_ROLE, targetWallet) ⚡
  SmartContract-->>APIRoute: false (not yet granted)
  Note over APIRoute: If already true → 409 CONFLICT (already Oracle)
  APIRoute->>SmartContract: grantRole(ORACLE_ROLE, targetWallet) ⚡ [server wallet = DEFAULT_ADMIN_ROLE holder]
  SmartContract-->>APIRoute: { txHash }
  Note over APIRoute,SmartContract: ⚡ waitForTransactionReceipt(txHash, confirmations=1, timeout=30s)<br/>ASSERT receipt.status === 1<br/>If fails → 500, do NOT write to MongoDB
  APIRoute->>MongoDB: AdminRole.create{ clerkId, role: ORACLE, walletAddress, active: true } ~
  MongoDB-->>APIRoute: OK
  APIRoute->>AuditService: ActivityLog.create{ type: ORACLE_ROLE_GRANTED } ~
  AuditService-->>APIRoute: OK
  APIRoute-->>AdminClient: 200 OK
```

> ⚡ MongoDB AdminRole write happens ONLY AFTER on-chain grantRole receipt confirms.
> If on-chain grant fails → MongoDB is NOT written. On-chain is always first.
> DB is a trailing cache — it never leads the on-chain state.

## Failure Paths

| # | Scenario | Outcome |
|---|---|---|
| [1] | `grantRole` tx reverts | 500 returned, MongoDB untouched |
| [2] | `waitForTransactionReceipt` timeout (30s) | 500 returned, MongoDB untouched |
| [3] | MongoDB write fails after on-chain success | Log error, return 200 with warning — on-chain role IS granted, DB cache failure does not undo on-chain state |

## Legend

| Symbol | Meaning |
|---|---|
| Solid arrow `──►` | mandatory / trusted call |
| Dashed arrow `- -►` | cache write / best-effort |
| ⚡ | On-chain verification (never skip) |
| `~` | MongoDB mirror (not authoritative) |
| `[AUTHORITY]` | Source of truth |
| `[CACHE ONLY]` | Display layer only |
