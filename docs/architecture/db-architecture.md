# PropChain — Database Architecture (Corrected)

```mermaid
erDiagram
  USERS {
    string clerkId PK "unique"
    string walletAddress "unique sparse - IMMUTABLE after KYC"
    boolean kycVerified
    date walletBoundAt
    date createdAt
  }

  KYC_RECORDS {
    string clerkId PK "unique"
    string aadhaarLast4
    boolean verified
    date verifiedAt
  }

  PROPERTIES {
    string ulpin PK "unique"
    string ownerClerkId FK
    string ownerWallet
    string address
    string area
    string docUrls "array"
    string status "PENDING_MINT|MINTED|APPROVED|REJECTED|MINT_FAILED"
    number tokenId "null until minted"
    string txHash
    string oracleTxHash
    string approvedBy
    number recoveryAttempts
  }

  TRANSFERS {
    string propertyId FK
    string sellerClerkId FK
    string buyerClerkId FK
    string status "PENDING_SELLER_SIGN|PENDING_BUYER_ACCEPT|COMPLETED|CANCELLED"
    string sellerTxHash
    string buyerTxHash
  }

  ACTIVITY_LOGS {
    string clerkId FK
    string type "KYC_COMPLETE|PROPERTY_SUBMITTED|MINT_CONFIRMED|ORACLE_APPROVED|ORACLE_REJECTED|TRANSFER_COMPLETE|ORACLE_ROLE_GRANTED"
    string description
    date createdAt "TTL: 90 days auto-delete"
  }

  ADMIN_ROLES {
    string clerkId PK "unique"
    string role "ORACLE|SUPER_ADMIN"
    boolean active
    string walletAddress
  }

  USERS ||--o{ PROPERTIES : "ownerClerkId"
  USERS ||--o{ KYC_RECORDS : "clerkId"
  PROPERTIES ||--o{ TRANSFERS : "propertyId"
  USERS ||--o{ ACTIVITY_LOGS : "clerkId"
  USERS ||--o| ADMIN_ROLES : "clerkId"
```

## ⚡ TRUST BOUNDARY

> Everything above = MongoDB collections (CACHE ONLY)
>
> ════════════════════════════════════
> TRUST BOUNDARY — On-chain is authority
> ════════════════════════════════════
>
> **PropertyNFT.sol (ERC-721) — Source of Truth**
> - `mintProperty(ulpin, ipfsHash, address, areaSqFt)`
> - `approveProperty(tokenId)` → ORACLE_ROLE only ⚡
> - `rejectProperty(tokenId)` → ORACLE_ROLE only ⚡
> - `transferProperty(tokenId, to)`
> - `hasRole(ORACLE_ROLE, wallet)` → bool ⚡
>
> CANONICAL for: role grants, property ownership, approval state
> MongoDB MIRRORS for: querying, display, filtering only

## Index Strategy

| Collection | Field | Type |
|---|---|---|
| users | clerkId | unique |
| users | walletAddress | unique sparse |
| kyc_records | clerkId | unique |
| properties | ulpin | unique |
| properties | status | standard |
| properties | ownerClerkId | standard |
| properties | tokenId | unique sparse |
| activity_logs | clerkId | standard |
| activity_logs | createdAt | TTL (90 days) |
| admin_roles | clerkId | unique |
| admin_roles | role | standard |
| transfers | propertyId | standard |
| transfers | sellerClerkId | standard |

## Legend

| Symbol | Meaning |
|---|---|
| Solid arrow `──►` | mandatory / trusted call |
| Dashed arrow `- -►` | cache write / best-effort |
| ⚡ | On-chain verification (never skip) |
| `~` | MongoDB mirror (not authoritative) |
| `[AUTHORITY]` | Source of truth |
| `[CACHE ONLY]` | Display layer only |
