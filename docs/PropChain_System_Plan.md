# PropChain — Blockchain + AI Property Registry
## System Architecture & Implementation Plan
**Solo Developer Edition · Confidential PoC · Updated: April 2026**

---

## ⚠️ Legal Disclaimer

This is a Proof of Concept. It does not create legal property ownership under Indian law.
The Transfer of Property Act, 1882 and Registration Act, 1908 recognize only physical registration at Sub-Registrar offices. Smart contract transfers in this system are **simulations — NOT legally binding**. Aadhaar KYC is fully mocked.

---

## 1. System Vision

PropChain simulates a tamper-proof, AI-assisted property ownership and document verification system for India, demonstrating how blockchain immutability, NFT-based tokenization, smart contract-enforced transfers, and AI-powered document verification can solve India's land registry problems.

### Problems It Addresses
| Problem | Solution |
|---|---|
| Fake/duplicate documents | AI verifies authenticity before on-chain registration |
| Double-selling same property | Blockchain = single source of truth; re-registration blocked |
| Manual, opaque transfer process | Smart contracts enforce step-by-step oracle-approved transfer |
| No ownership history | Every transaction permanently recorded and publicly auditable |
| Fragmented Sub-Registrar records | Unified on-chain registry indexed by ULPIN (Bhu-Aadhar) |
| Slow bank encumbrance checks | On-chain lien registry enables instant lookup |

---

## 2. System Architecture

### Layer Map (As Implemented)

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js 14 App Router + TailwindCSS + shadcn/ui | UI, wallet connection, property flows |
| Authentication | Clerk (replaces SIWE — simpler DX, same security model) | User identity, sessions, role-based access |
| Backend | Next.js API Routes + MongoDB Atlas | Business logic, role management, KYC, document handling |
| Blockchain | Solidity + Hardhat 2.x + Polygon Mumbai (local Hardhat node in Phase 1) | PropertyNFT.sol ownership tokens, encumbrances |
| Wallet | wagmi v2 + viem + MetaMask | Wallet connect, tx signing |
| AI Layer | OpenAI GPT-4o Vision + Tesseract.js (Phase 3) | Document OCR, field extraction, fraud flags |
| Storage | MongoDB + IPFS via Pinata (Phase 2+) | Metadata + document files |
| Identity | Mock KYC (Aadhaar number + simulated OTP) | Wallet-to-identity linking |
| Oracle | Admin role + Clerk role management + signed backend calls | Government authority approval simulation |
| Design System | Anthropic aesthetic — DM Serif Display + DM Sans, terracotta `#D97757`, cream `#FAF9F6` | Consistent visual language |

### Component Interaction Flow

```
1. User signs in via Clerk (email/OAuth)
2. User connects MetaMask wallet → wagmi captures address → backend links wallet ↔ Clerk user ID
3. User completes Mock KYC (Aadhaar + fake OTP) → /api/kyc/submit stores KYC record in MongoDB
4. User uploads property documents → backend receives files
5. (Phase 2) Backend pins to IPFS via Pinata → stores CID in MongoDB
6. (Phase 3) AI layer processes documents → confidence score + fraud flags returned
7. Frontend calls smart contract → PropertyNFT.sol mints NFT (ULPIN as tokenId, owner wallet, IPFS hash)
8. Oracle (admin with ORACLE_ROLE via Clerk) reviews in /oracle/queue
9. Oracle calls approveProperty() on-chain → property status = 'registered'
10. Transfer: buyer + seller both sign via MetaMask → smart contract validates both parties, checks encumbrances
11. The Graph (Phase 2) indexes on-chain events → frontend queries history in milliseconds
```

---

## 3. Routing Architecture (Next.js App Router)

```
/                          Landing page (Clerk auth, hero, features)
/dashboard                 Main user dashboard (wallet required, KYC banner)
/properties                Property listing / search
/properties/[id]           Property detail page + audit timeline
/mint/upload               Step 1: Document upload
/mint/details              Step 2: Property details form
/mint/review               Step 3: AI review + confirm mint
/settings                  Account settings (profile, wallet, KYC status, notifications)
/audit                     Audit log viewer

/oracle/login              Oracle access code entry (non-Clerk gated)
/oracle/queue              Pending verification queue (Oracle only)
/oracle/users              User monitoring (Oracle only)
/oracle/users/[clerkId]    Individual user detail (Oracle only)
/oracle/analytics          Oracle analytics dashboard (Oracle only)
/oracle/settings           Oracle system settings (Oracle only)

/dev/admin                 Dev admin panel (development only — env-gated)
```

### Auth & Access Control
- **Public**: `/`, `/oracle/login`
- **Clerk-authenticated**: all `/dashboard`, `/properties`, `/mint`, `/settings`, `/audit`
- **Oracle role** (`isOracle: true` in MongoDB + `useAdminRole` hook): all `/oracle/*` routes guarded by `OracleGuard`
- **Oracle mode session**: separate from role — entered via passphrase through `OracleAccessModal`, stored in Zustand `useOracleAccessStore`

---

## 4. Smart Contract Design

### Contracts (Hardhat 2.x, Solidity ^0.8.20, Polygon Mumbai / local node)

| Contract | Inherits | Status | Purpose |
|---|---|---|---|
| `PropertyNFT.sol` | ERC-721, Ownable, Pausable | ✅ Deployed (local) | Core property token — mint, approve, burn |
| `OwnershipTransfer.sol` | — | Phase 2 | Two-party ownership transfer with oracle approval |
| `EncumbranceRegistry.sol` | Ownable | Phase 2 | Bank/lender mortgage and lien management |
| `DisputeRegistry.sol` | — | Phase 2 | Dispute flagging and resolution |
| `FractionalOwnership.sol` | ERC-20, ERC-721Holder | Phase 3 | Fractional shares for a single property |
| `PropChainOracle.sol` | AccessControl | Phase 2 | Role management for oracle approvals |

### PropertyNFT.sol — Core Data Structure
```solidity
struct Property {
  string  ulpin;           // Unique Land Parcel ID (Bhu-Aadhar)
  string  ipfsDocHash;     // IPFS CID of document bundle
  string  physicalAddress; // Human-readable address
  uint256 areaSqFt;        // Area in square feet
  uint256 registeredAt;    // Block timestamp
  bool    isApproved;      // Oracle (govt) approval status
  bool    hasEncumbrance;  // Active mortgage/lien flag
  address registeredBy;    // Wallet that registered
}

mapping(uint256 => Property)  public properties;   // tokenId => Property
mapping(string  => uint256)   public ulpinToToken; // ULPIN => tokenId
mapping(address => uint256[]) public ownerTokens;  // owner => [tokenIds]
```

### Key Functions
- `mintProperty(ulpin, ipfsHash, addr, area)` — Only KYC-verified wallets (backend signature check)
- `approveProperty(tokenId)` — Only `ORACLE_ROLE`
- `transferWithApproval(tokenId, to)` — Checks: approved, no encumbrance, no dispute, both parties signed
- `pause() / unpause()` — Emergency stop (Pausable pattern)

---

## 5. Database Schema (MongoDB)

### Collections

**`users`**
```json
{
  "clerkId": "user_xxxx",
  "walletAddress": "0x...",
  "kycVerified": true,
  "aadhaarLast4": "1234",
  "kycVerifiedAt": "ISODate",
  "role": "user | oracle | bank"
}
```

**`properties`**
```json
{
  "ulpin": "KA-BLR-001-001",
  "ownerClerkId": "user_xxxx",
  "ownerWallet": "0x...",
  "ipfsHash": "Qm...",
  "physicalAddress": "...",
  "areaSqFt": 1200,
  "status": "pending | approved | rejected | transferred",
  "tokenId": 1,
  "aiScore": 0.92,
  "aiFlags": [],
  "submittedAt": "ISODate",
  "approvedAt": "ISODate",
  "approvedBy": "oracle_wallet"
}
```

**`auditLog`**
```json
{
  "propertyId": "ObjectId",
  "action": "REGISTER | APPROVE | TRANSFER | AI_FLAG | LIEN_ADDED | LIEN_RELEASED",
  "actor": "wallet | system",
  "note": "...",
  "timestamp": "ISODate",
  "txHash": "0x..."
}
```

**`kyc`** (linked by walletAddress)
```json
{
  "walletAddress": "0x...",
  "aadhaarLast4": "1234",
  "verifiedAt": "ISODate",
  "status": "verified | pending | failed"
}
```

---

## 6. API Routes (Next.js App Router)

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/kyc/submit` | POST | Clerk | Submit Aadhaar + OTP, link wallet |
| `/api/kyc/status` | GET | Clerk | Get KYC status for current user |
| `/api/oracle/verify-access` | POST | — | Verify oracle passphrase (bcrypt hash check) |
| `/api/oracle/assign-role` | POST | Oracle | Assign oracle role to a user |
| `/api/properties` | GET/POST | Clerk | List / create property submissions |
| `/api/properties/[id]/approve` | POST | Oracle | Approve property on-chain |
| `/api/properties/[id]/reject` | POST | Oracle | Reject submission with reason |
| `/api/audit/[propertyId]` | GET | Clerk | Fetch audit timeline for a property |
| `/api/users` | GET | Oracle | List all users (oracle monitoring) |
| `/api/users/[clerkId]` | GET | Oracle | Get user detail |

---

## 7. Phased Development Plan

> **Golden Rule**: Ship something working at the end of every phase. Phase 1 must be deployable and demonstrable. Never start Phase 2 before Phase 1 is working.

### Phase 1 — MVP (Weeks 1–4) ✅ IN PROGRESS

**Goal**: A working system where a user can connect a wallet, complete mock KYC, register a property with a ULPIN, and an Oracle can approve it. Core blockchain + UI + Oracle workflow.

**Status**: Frontend complete. Smart contracts deployed locally. Backend API routes implemented. Oracle role system working. KYC flow implemented. Design system complete (Anthropic aesthetic, terracotta palette).

**Completed features**:
- [x] Clerk authentication (email/OAuth)
- [x] Wallet connect (wagmi v2 + MetaMask)
- [x] Mock KYC form (Aadhaar number + fake OTP) → MongoDB
- [x] Dashboard with stats, portfolio chart, asset composition
- [x] Oracle access code modal (bcrypt passphrase, rate-limited, lockout)
- [x] Oracle queue — pending property review
- [x] Oracle user monitoring panel
- [x] KYC-gated property workflows (mint wizard UI)
- [x] Audit timeline component
- [x] PropertyNFT.sol (Hardhat 2.x, local node)
- [x] Settings page (profile, wallet, KYC status, notifications, appearance)
- [x] Full design system (DM Serif Display + DM Sans, terracotta `#D97757`, cream `#FAF9F6`, dark mode)
- [x] Responsive layout (mobile-first, 320px–1440px)

**Remaining for Phase 1 completion**:
- [ ] Wire mint wizard to actual smart contract call
- [ ] `/api/properties` CRUD fully integrated
- [ ] Audit log entries written on each state change
- [ ] Deploy to Vercel + connect MongoDB Atlas
- [ ] Deploy PropertyNFT.sol to Polygon Mumbai testnet

**Phase 1 Done-Definition**: User can register a property → Oracle approves it → ownership record visible on-chain. Deployed to Vercel with working URL.

---

### Phase 2 — Intermediate (Weeks 5–10)

**Goal**: Multi-user system with IPFS document storage, full ownership history, encumbrance registry, and production-grade UX.

**Features to add**:
- [ ] IPFS document storage via Pinata (replace MongoDB base64 storage)
- [ ] Full ownership history (The Graph protocol — index on-chain events)
- [ ] `EncumbranceRegistry.sol` — banks register mortgages on-chain
- [ ] Transfer blocked if active lien exists
- [ ] Dispute flag system
- [ ] Property search by ULPIN, address, owner wallet
- [ ] Email notifications (Resend) on key events
- [ ] Role system for Bank users (separate dashboard)
- [ ] `PropChainOracle.sol` — on-chain role management (currently Clerk + MongoDB only)

**New tech**:
| Addition | Purpose |
|---|---|
| Pinata SDK | IPFS pinning for documents |
| The Graph | Index on-chain events for fast history queries |
| Resend | Email alerts for approval, transfer, disputes |
| Zod | Input validation on all API routes |

---

### Phase 3 — Advanced (Weeks 11–16)

**Goal**: AI-powered document verification, fraud detection, audit trail, fractional ownership simulation, public analytics.

**Features to add**:
- [ ] AI document verification: OCR + field extraction from sale deeds (GPT-4o Vision)
- [ ] Fraud detection: cross-reference ULPIN against existing registry, flag duplicates
- [ ] Confidence score UI — show users exactly what AI detected and flagged
- [ ] `FractionalOwnership.sol` — ERC-20 tokens representing ownership percentage (REIT simulation)
- [ ] Inheritance/mutation flow — multi-signature succession
- [ ] Full tamper-evident audit log (SHA-256 hash chain)
- [ ] Public analytics dashboard (total properties, transfers, disputes, AI flags)
- [ ] W3C Verifiable Credential simulation for ownership certificates
- [ ] Export ownership certificate as PDF with QR code → on-chain record

**New tech**:
| Addition | Purpose |
|---|---|
| OpenAI GPT-4o Vision | Document field extraction + authenticity checks |
| Tesseract.js | Local OCR fallback (zero API cost for testing) |
| Sharp.js | Image preprocessing before OCR |
| pdf-parse | Extract text from PDF before AI analysis |
| jsPDF / puppeteer | Generate ownership certificates as PDF |

---

## 8. Key Design Decisions

| Decision | Rationale |
|---|---|
| **Clerk over SIWE** | Clerk handles OAuth, MFA, session management out-of-the-box. SIWE added as a layer on top of Clerk wallet linking is simpler for Phase 1. |
| **Polygon Mumbai** | Testnet is free. Low fees in production. EVM-compatible — all Solidity knowledge transfers. |
| **MongoDB** | Flexible document schema perfect for property metadata. Easy to add fields. MERN-compatible. |
| **IPFS / Pinata** | S3 documents can be deleted/censored. IPFS hashes are content-addressed and permanent. |
| **wagmi v2 + viem** | Modern React-first wallet library. Less boilerplate. Better TypeScript support than ethers.js. |
| **GPT-4o Vision** | Solo dev cannot train custom OCR model. GPT-4o handles multilingual Indian docs (Hindi/English) out of the box. |
| **Hardhat 2.x** | JavaScript-based tests — no Rust tooling required. Easier debugging for solo dev. |
| **Oracle passphrase model** | Passphrase stored as bcrypt hash in env. Rate-limited with lockout. Separate from Clerk role — provides dual-factor Oracle access. |
| **Anthropic design system** | Warm cream + terracotta palette intentionally chosen for a trustworthy government-adjacent UI. DM Serif Display adds authority. |

---

## 9. Security Hardening (Phase 1 Implemented)

- Oracle passphrase: bcrypt hash comparison server-side (`ORACLE_ACCESS_HASH` env var, never client-exposed)
- Oracle lockout: 3 attempts → 30-second lockout (client-side Zustand, server can add rate limiting)
- KYC: only last 4 Aadhaar digits stored, zero real PII
- Smart contract: Pausable pattern for emergency stop
- API routes: Clerk auth middleware on all protected endpoints
- Environment separation: `dev/admin` page env-gated, not accessible in production

---

## 10. Deployment

### Phase 1 Target
- **Frontend + API**: Vercel (Next.js)
- **Database**: MongoDB Atlas (free tier, M0)
- **Smart contract**: Polygon Mumbai testnet (Hardhat deploy script)
- **Environment variables**: `ORACLE_ACCESS_HASH`, `MONGODB_URI`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `HARDHAT_NETWORK_URL`

### Environment Variables Required
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# MongoDB
MONGODB_URI=mongodb+srv://...

# Oracle
ORACLE_ACCESS_HASH=$2b$10$...   # bcrypt hash of the passphrase

# Blockchain
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=80001       # Polygon Mumbai

# Pinata (Phase 2)
PINATA_API_KEY=...
PINATA_API_SECRET=...

# OpenAI (Phase 3)
OPENAI_API_KEY=sk-...
```
