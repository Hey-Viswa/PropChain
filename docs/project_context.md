# PROPCHAIN — COMPLETE PROJECT CONTEXT
# Drop this file in the root of the repo.
# Read this entire file before touching any code.
# This is the single source of truth for everything.

---

## 1. WHAT THIS PROJECT IS

PropChain is a Proof-of-Concept Blockchain + AI Property Registry
platform for India. It demonstrates how blockchain immutability,
NFT-based tokenization, smart contract-enforced transfers, and
AI-powered document verification can solve India's land registry
problems.

### Problems It Solves
- Fake/duplicate property documents
  → AI verifies document authenticity before on-chain registration
- Double-selling the same property
  → Blockchain is single source of truth — cannot re-register
- Manual and opaque transfer process
  → Smart contracts enforce step-by-step ownership transfer
- No visible ownership history
  → Every transaction permanently recorded and publicly auditable
- Fragmented records across Sub-Registrar offices
  → Unified on-chain registry indexed by ULPIN (Bhu-Aadhar)
- Delayed encumbrance checks by banks
  → On-chain lien registry enables instant lookup

### Legal Disclaimer
This is a PoC. It does NOT create legal property ownership under
Indian law. The Transfer of Property Act 1882 and Registration Act
1908 recognize only physical Sub-Registrar office registration.
Smart contract transfers here are simulations — NOT legally binding.

### What It Does NOT Solve
- Does not replace Sub-Registrar office registration
- Does not resolve existing property disputes
- Does not handle rural land with undigitized records
- Does not provide legal advice or title insurance
- Does not guarantee real Aadhaar integration (mocked in PoC)

---

## 2. SYSTEM ARCHITECTURE

### Layer Overview

| Layer       | Technology                             | Responsibility                             |
|-------------|----------------------------------------|--------------------------------------------|
| Frontend    | Next.js 15 + TailwindCSS + shadcn/ui  | UI, wallet connection, property flows       |
| Backend API | Node.js + Express + MongoDB Atlas      | Business logic, roles, document handling    |
| Blockchain  | Solidity + Hardhat + Polygon Mumbai    | Ownership NFTs, transfers, encumbrances     |
| Wallet Auth | wagmi + viem + MetaMask                | User identity via wallet address            |
| AI Layer    | OpenAI GPT-4o Vision + Tesseract.js   | Document OCR, field extraction, fraud flags |
| Storage     | IPFS (Pinata) + MongoDB                | Document files + metadata                   |
| Identity    | Mock KYC (DigiLocker-style)            | Aadhaar-to-wallet linking simulation        |
| Oracle      | Admin panel + signed backend calls     | Government authority approval simulation    |

### Component Interaction Flow (Full Registration)

1. User connects MetaMask → wagmi hooks capture wallet address
2. User completes Mock KYC (Aadhaar + OTP simulation)
   → backend links wallet address to KYC record in MongoDB
3. User uploads property documents (sale deed, ID, survey map)
   → files sent to backend
4. Backend sends documents to AI layer
   → OCR extracts text, validates patterns,
     returns confidence score + fraud flags
5. If AI passes → backend pins documents to IPFS via Pinata
   → stores IPFS hash in MongoDB
6. Frontend calls smart contract
   → PropertyNFT.sol mints NFT with ULPIN as token ID,
     owner wallet, IPFS document hash
7. Oracle (admin) reviews → calls approveProperty() on-chain
   → property officially registered in PoC system
8. For transfers: buyer + seller both sign via MetaMask
   → smart contract validates both parties, checks encumbrances,
     emits OwnershipTransferred event
9. The Graph indexes all on-chain events
   → Frontend queries property history in milliseconds

### Technology Choice Rationale

| Choice | Why |
|---|---|
| Polygon Mumbai | Free testnet. Low production fees. EVM-compatible. |
| MongoDB | MERN familiarity. Document model fits property metadata. |
| IPFS/Pinata | S3 can be deleted or censored. IPFS is content-addressed and permanent. |
| wagmi + viem | React-first with hooks. Less boilerplate than ethers.js. |
| GPT-4o Vision | Handles multilingual Indian docs (Hindi/English). No custom model needed. |
| Hardhat | JS-based tests — no new tooling vs Foundry. |
| Next.js App Router | Server Components for faster loads. API routes avoid separate server in MVP. |

---

## 3. PHASED DEVELOPMENT PLAN

Golden Rule: Ship something working at the end of every phase.
Never start Phase 2 before Phase 1 is deployed and working.

### Phase 1 — Frontend Shell (CURRENT PHASE)
Weeks 1-4. Static mock UI. No blockchain. No APIs. No auth.
All data from lib/mockData.ts via Zustand stores.

Features in scope:
- Wallet connect UI (MetaMask via wagmi — UI only in Phase 1)
- Mock KYC form (Aadhaar number + fake OTP)
- Property registration wizard (3 steps)
- Document upload zones
- AI verification simulation (mock confidence scores)
- View owned properties page
- Admin/Oracle panel (approve/reject)
- Audit history timeline
- Public registry search UI

Phase 1 Done Definition:
- All 11 routes compile and render
- Mint wizard carries data across all 3 steps
- Each property card links to correct detail page
- Oracle analytics charts render (recharts)
- All screens match Stitch UI references
- Deployed on Vercel with shareable URL
- npm run build exits 0
- Audit score: 86/86

### Phase 2 — Intermediate (Weeks 5-10)
NOT STARTED. Do not suggest Phase 2 features yet.

Features to add:
- JWT + wallet signature auth (Sign-In With Ethereum / SIWE)
- IPFS document storage via Pinata
- Full ownership history via The Graph Protocol
- EncumbranceRegistry.sol — banks register mortgages on-chain
- Encumbrance check before transfer
- Dispute flag system
- Role system: User, Bank, Oracle — different dashboards
- Property search by ULPIN, address, owner wallet
- Email notifications (Resend / Nodemailer)
- Polished wizard UI
- Separate Express.js backend

New tech for Phase 2:
- SIWE (Sign-In With Ethereum)
- Pinata SDK
- The Graph Protocol
- Express.js server
- Redis (Upstash) — rate limiting, session caching
- Resend / Nodemailer
- Zod (backend validation)

### Phase 3 — Advanced (Weeks 11-16)
NOT STARTED. Do not suggest Phase 3 features.

Features to add:
- AI document verification: OCR + GPT-4o Vision field extraction
- Fraud detection signals
- Confidence score UI with field breakdown
- FractionalOwnership.sol (ERC-20 shares)
- Inheritance/mutation flow (multi-sig)
- Full hash-chained audit log
- Public dashboard with real-time stats
- Verifiable Credential (W3C VC format)
- PDF ownership certificate with QR code

New tech for Phase 3:
- OpenAI GPT-4o Vision API
- Tesseract.js (local OCR fallback)
- Sharp.js (image preprocessing)
- pdf-parse
- jsPDF / puppeteer
- FractionalOwnership.sol (ERC-20)
- SHA-256 audit hash chain

---

## 4. SMART CONTRACT DESIGN

### Contracts Overview

| Contract                | Inherits                   | Purpose                                     |
|-------------------------|----------------------------|---------------------------------------------|
| PropertyNFT.sol         | ERC-721, Ownable, Pausable | Core property token — mint, approve, burn   |
| OwnershipTransfer.sol   | —                          | Two-party transfer with oracle approval     |
| EncumbranceRegistry.sol | Ownable                    | Bank/lender mortgage and lien management    |
| DisputeRegistry.sol     | —                          | Dispute flagging and resolution tracking    |
| FractionalOwnership.sol | ERC-20, ERC-721Holder      | Fractional shares per property (Phase 3)    |
| PropChainOracle.sol     | AccessControl              | Role management for oracle approvals        |

### PropertyNFT.sol — Core Data Structure

```solidity
struct Property {
  string  ulpin;           // Unique Land Parcel ID (Bhu-Aadhar)
  string  ipfsDocHash;     // IPFS CID of document bundle
  string  physicalAddress; // Human-readable address
  uint256 areaSqFt;        // Area in square feet
  uint256 registeredAt;    // Block timestamp
  bool    isApproved;      // Oracle approval status
  bool    hasEncumbrance;  // Active mortgage/lien flag
  address registeredBy;    // Wallet that registered
}

mapping(uint256 => Property)  public properties;   // tokenId => Property
mapping(string  => uint256)   public ulpinToToken; // ULPIN => tokenId
mapping(address => uint256[]) public ownerTokens;  // owner => [tokenIds]

event PropertyRegistered(uint256 tokenId, string ulpin, address owner, uint256 timestamp);
event PropertyApproved(uint256 tokenId, address oracle);
event OwnershipTransferred(uint256 tokenId, address from, address to, uint256 timestamp);
event PropertyFlagged(uint256 tokenId, address flaggedBy, string reason);
```

### Key Functions

- mintProperty(ulpin, ipfsHash, addr, area)
  Only KYC-verified wallets (checked via backend signature)
- approveProperty(tokenId)
  Only ORACLE_ROLE — makes property transferable
- transferWithApproval(tokenId, to)
  Checks: approved, no encumbrance, no dispute, both signed
- pause() / unpause()
  Emergency stop — Pausable pattern

### Security Considerations

| Threat | Mitigation |
|---|---|
| Reentrancy on transfer | OpenZeppelin ReentrancyGuard. CEI pattern. |
| Front-running on transfer | Commit-reveal or signed oracle approval with nonce |
| Oracle goes rogue | Multi-sig oracle (2-of-3). AccessControl with timelocks. |
| Fake ULPIN registration | Backend validates ULPIN + uniqueness before contract call. |
| Gas griefing on arrays | Use EnumerableSet instead of plain arrays. |
| Contract upgrade risk | OpenZeppelin UUPS Transparent Proxy pattern. |

---

## 5. AI SYSTEM DESIGN

### Documents Verified

| Document Type            | What AI Checks                                    | Confidence Target |
|--------------------------|---------------------------------------------------|-------------------|
| Sale Deed (Vikray Patra) | Seller/buyer names, ULPIN, stamp duty, date       | > 80%             |
| Government ID            | Name, ID number, photo, expiry, format            | > 85%             |
| Survey / Mutation Record | Plot number, area, owner name, tehsil, seal       | > 75%             |
| Power of Attorney        | Grantor/grantee, scope, notary seal, date         | > 70%             |
| Encumbrance Certificate  | Property address, period covered, history         | > 75%             |

### AI Pipeline (Phase 3)

1. RECEIVE: User uploads PDF or image (max 10MB, pdf/jpg/png)
2. PREPROCESS: Sharp.js contrast + denoise → PNG at 300 DPI
3. OCR PASS 1: Tesseract.js local OCR → extract raw text
4. OCR PASS 2 (if confidence < 70%): Send to GPT-4o Vision
5. EXTRACTION: AI returns JSON with extracted fields
6. VALIDATION: Backend cross-references against submitted form data
7. FRAUD FLAGS: Check for known fraud patterns
8. SCORE: Composite confidence score (0-100) + per-field breakdown
9. DECISION: > 75 auto-pass. 50-75 oracle review. < 50 reject.

### GPT-4o Vision System Prompt

```
You are a property document verification expert for Indian land records.
Extract the following fields as JSON. If a field is not found, return null.
Fields: { seller_name, buyer_name, property_address, ulpin, area_sqft,
          stamp_duty_value, registration_date, sub_registrar_name,
          document_type, language_detected, confidence_per_field }
Flag potential fraud if: dates are inconsistent, amounts seem altered,
signatures/seals appear digitally inserted, document structure is unusual.
Return ONLY valid JSON. No explanation.
```

### Fraud Detection Signals

- ULPIN already registered on-chain → immediate block
- Name mismatch between document and KYC (> 30% Levenshtein distance)
- Extracted date is in the future
- Stamp duty suspiciously low for area x local circle rate
- EXIF shows document was recently created/modified
- Resolution inconsistency (digitally edited sections)
- Same IP submitting multiple ULPINs in short window

---

## 6. BACKEND API STRUCTURE (Phase 2)

```
POST   /api/auth/nonce               Generate SIWE nonce
POST   /api/auth/verify              Verify signature, issue JWT
POST   /api/kyc/submit               Submit mock KYC, link wallet
GET    /api/kyc/:wallet              Check KYC status
POST   /api/properties/register      Validate form, process docs, prep tx
GET    /api/properties/:ulpin        Get property metadata from MongoDB
GET    /api/properties/owner/:wallet List properties for wallet
POST   /api/properties/search        Full-text search
POST   /api/documents/upload         Receive file, run AI pipeline, IPFS
GET    /api/documents/:cid           Get document metadata by IPFS CID
POST   /api/transfer/initiate        Validate buyer/seller, check liens
POST   /api/transfer/confirm         Second party confirmation
POST   /api/oracle/approve/:tokenId  Oracle approves (requires ORACLE_ROLE JWT)
POST   /api/oracle/reject/:tokenId   Oracle rejects with reason
GET    /api/audit/:tokenId           Full audit log for a property
```

### Role Management

| Role        | Access                              | How Assigned           |
|-------------|-------------------------------------|------------------------|
| USER        | Register, transfer, view public     | Auto after KYC         |
| BANK        | Register/release liens              | Manual by ORACLE       |
| ORACLE      | Approve/reject, assign BANK role    | Set manually at setup  |
| SUPER_ADMIN | Full access, pause contracts        | Deployer wallet + env  |

### Audit Chain (Hash-Chained Log)

Every significant action creates an audit entry. Each entry's hash
includes the previous entry's hash — tamper-evident without on-chain cost.

```ts
interface AuditEntry {
  id:        string   // UUID
  action:    string   // REGISTER | APPROVE | TRANSFER | AI_FLAG
  actor:     string   // wallet address
  tokenId:   number
  data:      object   // action-specific payload
  timestamp: number
  prevHash:  string   // SHA-256 of previous entry
  hash:      string   // SHA-256 of this entry
}
```

---

## 7. USER ISOLATION MODEL

Each user is completely isolated by their wallet address.
Wallet address is the universal primary key across all layers.

On-chain (automatic):
  ownerOf(tokenId) enforced at protocol level.
  User A cannot call transferFrom on User B's token — reverts.

MongoDB (query-scoped):
  db.properties.find({ walletAddress: req.user.wallet })
  User A never receives User B's documents.

Session (JWT):
  SIWE sign-in issues a JWT containing the wallet address.
  Backend extracts wallet from token, scopes all queries.

IPFS (content-addressed):
  Each document gets a unique CID.
  No shared storage between users.

Public data (no login required):
  Verified on-chain properties
  Ownership history / audit trail
  Public registry search by ULPIN

Private data (wallet-scoped):
  KYC records
  Draft/unverified submissions
  Document files

---

## 8. CURRENT BUILD STATUS

Phase 1 Audit Score: 71/86

Task 1 — Mint Wizard Wiring:    12/12  COMPLETE
Task 2 — Dynamic Property Page: 11/11  COMPLETE
Task 3 — Oracle Analytics:      12/13  1 FAIL
Task 4 — Visual Audit:          33/47  14 FAILS
Build checks:                    3/3   COMPLETE

### All Failing Items — Fix These Now

TASK 3 FAIL:
  recharts imported in oracle/analytics but missing from package.json
  FIX: npm install recharts --save

TASK 4 FAILS:

  FILE: components/layout/Sidebar.tsx
  FOUND:   border-r border-outline_variant/20 on aside element
  FIX:     Remove both classes entirely from the aside

  FILE: components/ui/button.tsx
  FOUND:   rounded-lg on button variants
  FIX:     Replace ALL rounded-lg with rounded-md on buttons
  FOUND:   text-white on primary button
  FIX:     Replace text-white with text-on_primary
  FOUND:   Secondary variant missing exact tokens
  FIX:     bg-primary_fixed text-on_primary_fixed rounded-md
  FOUND:   Ghost/outline using shadcn defaults
  FIX:     text-primary bg-transparent border-0 rounded-md

  FILE: app/properties/page.tsx — filter chips
  FOUND:   border-b-2 underline indicators
  FIX:     Active:   bg-primary text-on_primary rounded-full px-4 py-1.5
           Inactive: bg-surface_container text-on_surface_variant rounded-full px-4 py-1.5

  FILE: app/audit/page.tsx — filter chips
  SAME FIX as properties page

  FILE: app/oracle/queue/page.tsx — filter chips
  SAME FIX as properties page

  FILE: app/oracle/queue/page.tsx — table rows
  FOUND:   border border-outline_variant/20 wrapping rows
  FIX:     Remove border wrapper, use py-3 vertical spacing only

  FILE: app/dashboard/page.tsx — stats grid
  FOUND:   sm:grid-cols-2 lg:grid-cols-4
  FIX:     grid-cols-2 md:grid-cols-4

  FILE: app/properties/page.tsx — properties grid
  FOUND:   lg:grid-cols-3
  FIX:     xl:grid-cols-3

  FILE: app/properties/[id]/page.tsx — detail layout
  FOUND:   lg:grid-cols-2
  FIX:     xl:grid-cols-[1fr_380px]

  FILE: app/mint/details/page.tsx — form field pairs
  FOUND:   sm:grid-cols-2
  FIX:     md:grid-cols-2

  FILE: components/layout/AppShell.tsx — main padding
  FOUND:   Missing full responsive padding scale
  FIX:     px-6 py-6 md:px-8 md:py-8 xl:px-12 xl:py-10 2xl:px-16 2xl:py-12
           Add inner wrapper: w-full max-w-screen-2xl mx-auto

  GLOBAL: Any remaining button with rounded-lg or text-white
  SEARCH: grep -r "rounded-lg" app/ components/ --include="*.tsx"
          grep -r "text-white" app/ components/ --include="*.tsx"
  FIX:    Replace on all Button elements found only

---

## 9. FOLDER STRUCTURE

```
propchain/
├── app/
│   ├── globals.css              shadcn overrides + base styles
│   ├── layout.tsx               Root layout: fonts, providers, Toaster
│   ├── page.tsx                 Landing page — NO AppShell
│   ├── dashboard/page.tsx
│   ├── properties/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── mint/
│   │   ├── layout.tsx           AppShell + StepperHeader
│   │   ├── details/page.tsx     Step 1: Property Details
│   │   ├── upload/page.tsx      Step 2: Document Upload + AI
│   │   └── review/page.tsx      Step 3: Review and Sign
│   ├── audit/page.tsx
│   ├── oracle/
│   │   ├── queue/page.tsx
│   │   └── analytics/page.tsx
│   └── registry/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx         Sidebar + Navbar + fluid wrapper
│   │   ├── AppShellWrapper.tsx  Skips shell on /
│   │   ├── Sidebar.tsx
│   │   └── Navbar.tsx
│   ├── ui/                      shadcn/ui auto-generated + overridden
│   └── shared/
│       ├── PropertyCard.tsx
│       ├── StatusBadge.tsx
│       ├── StepperHeader.tsx
│       ├── ConfidenceBar.tsx
│       ├── AuditTimeline.tsx
│       ├── StatCard.tsx
│       ├── PageHeader.tsx
│       └── EmptyState.tsx
│
├── store/
│   ├── useMintStore.ts
│   ├── usePropertyStore.ts
│   └── useRoleStore.ts
│
├── lib/
│   ├── mockData.ts
│   └── utils.ts
│
├── hooks/
│   └── useMediaQuery.ts
│
└── types/
    └── index.ts
```

---

## 10. ROUTE MAP

| Route                | Page                  | AppShell |
|----------------------|-----------------------|----------|
| /                    | Landing Page          | NO       |
| /dashboard           | User Dashboard        | YES      |
| /properties          | My Properties         | YES      |
| /properties/[id]     | Property Detail       | YES      |
| /mint/details        | Mint Step 1           | YES      |
| /mint/upload         | Mint Step 2           | YES      |
| /mint/review         | Mint Step 3           | YES      |
| /audit               | Audit History         | YES      |
| /oracle/queue        | Verification Queue    | YES      |
| /oracle/analytics    | Analytics             | YES      |
| /registry            | Public Registry       | YES      |

---

## 11. DESIGN SYSTEM

### Color Tokens — tailwind.config.ts

```ts
colors: {
  primary:                   '#0050b2',
  primary_container:         '#1868db',
  on_primary:                '#ffffff',
  primary_fixed:             '#d6e3ff',
  on_primary_fixed:          '#001a43',
  secondary:                 '#835500',
  secondary_fixed:           '#ffddb4',
  on_secondary_fixed:        '#2a1700',
  surface:                   '#f9f9ff',
  surface_container_low:     '#f3f3fa',
  surface_container:         '#ededf5',
  surface_container_high:    '#e7e8ef',
  surface_container_highest: '#e2e2e9',
  surface_container_lowest:  '#ffffff',
  surface_bright:            '#f9f9ff',
  on_surface:                '#191c21',
  on_surface_variant:        '#43474e',
  outline_variant:           '#c3c6cf',
  error:                     '#ba1a1a',
  error_container:           '#ffdad6',
  on_error_container:        '#410002',
  success:                   '#006e2c',
  success_container:         '#98f5b0',
}
```

### Surface Layering — 3 Levels MAX. Never exceed.

Level 1 Page:    bg-surface (#f9f9ff)
Level 2 Section: bg-surface_container_low (#f3f3fa)
Level 3 Card:    bg-surface_container_lowest (#ffffff)

### THE NO-LINE RULE (ABSOLUTE)

ZERO border, divide, or separator utilities for layout structure.
Structure = background color shifts + spacing ONLY.
Only permitted borders:
  Input bottom:     border-b border-outline_variant/20
  Data table cell:  border border-outline_variant/15

### Typography

Headlines/Display: Plus Jakarta Sans (font-display class)
Body/Labels:       Inter (default font)

Fluid scale via clamp():
  display:      clamp(2.5rem, 4vw, 3.5rem)     bold     -0.02em
  headline-lg:  clamp(1.5rem, 2.5vw, 2rem)     semibold -0.01em
  headline-md:  clamp(1.25rem, 2vw, 1.5rem)    semibold
  title-md:     clamp(1rem, 1.5vw, 1.125rem)   medium
  body-md:      clamp(0.8rem, 1.2vw, 0.875rem) regular
  label-sm:     clamp(0.7rem, 1vw, 0.75rem)    medium   0.01em

### Elevation

Static card:            NO shadow — background contrast only
Interactive card hover: shadow-[0_12px_32px_rgba(0,26,67,0.06)]
Floating elements:      shadow-[0_12px_32px_rgba(0,26,67,0.06)]
Navbar:                 bg-surface_container_low/80 backdrop-blur-[12px]

### Button Variants — EXACT

Primary:     bg-primary text-on_primary rounded-md
             hover:opacity-90 transition px-5 py-2.5

Secondary:   bg-primary_fixed text-on_primary_fixed rounded-md
             hover:bg-primary_fixed/80 px-5 py-2.5

Ghost:       bg-transparent text-primary rounded-md
             hover:bg-surface_container_high px-5 py-2.5

Outline:     bg-transparent text-primary border-0 rounded-md
             hover:bg-surface_container_high px-5 py-2.5

Destructive: bg-error text-on_primary rounded-md
             hover:bg-error/90 px-5 py-2.5

NEVER: text-white on any button
NEVER: rounded-lg or rounded-full on any button
ALWAYS: rounded-md on every button

### Status Badge Variants — ALL use rounded-full

verified:         bg-success_container text-success
awaiting_oracle:  bg-primary_fixed text-on_primary_fixed
needs_review:     bg-secondary_fixed text-on_secondary_fixed
rejected:         bg-error_container text-on_error_container
transferred:      bg-surface_container text-on_surface_variant
ai_parsing:       bg-surface_container_high text-on_surface_variant
pending_kyc:      bg-secondary_fixed text-on_secondary_fixed

### Filter Chips

Active:   bg-primary text-on_primary rounded-full
          px-4 py-1.5 text-[0.75rem] font-medium

Inactive: bg-surface_container text-on_surface_variant rounded-full
          px-4 py-1.5 text-[0.75rem] font-medium
          hover:bg-surface_container_high transition-colors

NEVER: border-b-2, underline, or any border on chips

### Input Style

bg-surface_container_highest rounded-md
border-0 border-b border-outline_variant/20
focus:border-primary focus-visible:ring-0
px-4 py-3 text-on_surface placeholder:text-on_surface_variant/60

### Card Styles

Static:      bg-surface_container_lowest rounded-xl p-5 xl:p-6
Interactive: hover:shadow-[0_12px_32px_rgba(0,26,67,0.06)]
             hover:bg-surface_bright transition-all duration-200

---

## 12. GLOBAL LAYOUT

### AppShell

```tsx
<div className="flex h-screen bg-surface overflow-hidden">
  <Sidebar />
  <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
    <Navbar />
    <main className="flex-1 overflow-y-auto
                     px-6 py-6 md:px-8 md:py-8
                     xl:px-12 xl:py-10 2xl:px-16 2xl:py-12">
      <div className="w-full max-w-screen-2xl mx-auto">
        {children}
      </div>
    </main>
  </div>
</div>
```

### Sidebar

Width:      w-[240px] xl:w-[260px] 2xl:w-[280px]
Background: bg-surface_container_low
Right edge: NO border — background contrast only

Active:   bg-primary_fixed text-primary rounded-lg font-medium
Inactive: text-on_surface_variant hover:bg-surface_container
          hover:text-on_surface rounded-lg transition-colors

USER role nav:
  Dashboard        /dashboard      icon: LayoutDashboard
  My Properties    /properties     icon: Building2
  Mint Asset       /mint/details   icon: PlusCircle (text-primary always)
  Audit History    /audit          icon: ClipboardList
  Public Registry  /registry       icon: Globe

ORACLE role nav:
  Dashboard            /dashboard         icon: LayoutDashboard
  Verification Queue   /oracle/queue      icon: ClipboardCheck
  Analytics            /oracle/analytics  icon: BarChart2
  Audit History        /audit             icon: ClipboardList

Bottom: wallet strip — bg-surface_container rounded-lg
        green dot + font-mono text-xs truncated address

### Navbar

Height:   h-16
Style:    bg-surface_container_low/80 backdrop-blur-[12px]
Shadow:   shadow-[0_12px_32px_rgba(0,26,67,0.06)]
Position: sticky top-0 z-40

Left:  Breadcrumbs from usePathname()
Right: Network badge (bg-primary_fixed text-primary rounded-full)
       Wallet address (font-mono bg-surface_container rounded-md)
       Role badge (bg-secondary_fixed text-on_secondary_fixed rounded-full)

---

## 13. RESPONSIVE BREAKPOINT RULES

Stats row:        grid-cols-2 md:grid-cols-4 gap-4 xl:gap-6
Properties grid:  grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6
Detail page:      grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 xl:gap-8
Mint form pairs:  grid-cols-1 md:grid-cols-2 gap-4
Card padding:     p-5 xl:p-6 2xl:p-8
Section spacing:  space-y-6 xl:space-y-8

NEVER use sm: for layout grids — minimum is md:
NEVER use lg: for two-column splits — minimum is xl:

---

## 14. ZUSTAND STORES

### useMintStore.ts

```ts
interface MintState {
  step: 1 | 2 | 3
  details: {
    ulpin: string
    address: string
    state: string
    district: string
    area: number | null
    type: 'Residential' | 'Commercial' | 'Agricultural' | ''
    description: string
  }
  uploadedDocs: {
    name: string
    size: number
    docType: 'sale_deed' | 'gov_id' | 'survey'
  }[]
  aiResults: {
    overallScore: number
    documents: { name: string; score: number; fields: Record<string, string> }[]
  } | null
  setStep:      (step: 1 | 2 | 3) => void
  setDetails:   (data: Partial<MintState['details']>) => void
  addDoc:       (doc: MintState['uploadedDocs'][0]) => void
  removeDoc:    (name: string) => void
  setAIResults: (results: MintState['aiResults']) => void
  reset:        () => void
}
```

Mint flow navigation:
  Step 1 → setDetails() → router.push('/mint/upload')
  Step 2 → addDoc() + setAIResults() → router.push('/mint/review')
  Step 3 → reset() → router.push('/properties') + toast

StepperHeader reads active step from usePathname() — NOT the store.

### usePropertyStore.ts

5 mock properties:
  id:1  MH0123456789  Pune, Maharashtra         Residential  verified
  id:2  MH9876543210  Bandra Kurla, Mumbai       Commercial   awaiting_oracle
  id:3  KA1122334455  Indiranagar, Bengaluru     Residential  needs_review
  id:4  DL5544332211  Dwarka, New Delhi           Residential  rejected
  id:5  GJ6677889900  Satellite, Ahmedabad        Agricultural transferred

### useRoleStore.ts

role: 'USER' | 'ORACLE'
toggleRole: () => void
Sidebar uses this to switch between USER and ORACLE nav items.

---

## 15. TYPES (types/index.ts)

```ts
type PropertyStatus =
  | 'pending_kyc' | 'ai_parsing' | 'needs_review'
  | 'awaiting_oracle' | 'verified' | 'rejected' | 'transferred'

type AuditAction =
  | 'REGISTER' | 'APPROVE' | 'TRANSFER'
  | 'AI_FLAG' | 'LIEN_ADDED' | 'LIEN_RELEASED'

type UserRole = 'USER' | 'BANK' | 'ORACLE' | 'SUPER_ADMIN'

interface Property {
  id: string
  ulpin: string
  address: string
  area: number
  type: 'Residential' | 'Commercial' | 'Agricultural'
  status: PropertyStatus
  owner: string
  registeredAt: string
  ipfsCid: string
  aiConfidence: number
  hasEncumbrance: boolean
}

interface AuditEntry {
  id: string
  action: AuditAction
  actor: string
  timestamp: string
  note: string
}

interface WalletUser {
  address: string
  role: UserRole
  kycVerified: boolean
  name: string
}

interface AIResult {
  overallScore: number
  documents: {
    name: string
    score: number
    fields: Record<string, string>
    fraudFlags: string[]
  }[]
}
```

---

## 16. COMPONENT RULES

### PropertyCard
- Link: /properties/${property.id} — NEVER hardcoded
- View Details → ghost button
- Initiate Transfer → secondary button
- StatusBadge top-right of card
- ULPIN in font-mono label-sm
- Hover: shadow-[0_12px_32px_rgba(0,26,67,0.06)] + bg-surface_bright

### ConfidenceBar
- score > 80  → bg-success  (#006e2c)
- score 50-80 → bg-secondary (#835500)
- score < 50  → bg-error    (#ba1a1a)
- Container: bg-surface_container rounded-full h-2
- No borders on bar container

### AuditTimeline
- Vertical connector: w-px bg-surface_container
- NEVER use border-l for the line
- No horizontal dividers between entries
- Icon dot on left + content on right per entry

### StepperHeader
- Step 1 → /mint/details
- Step 2 → /mint/upload
- Step 3 → /mint/review
- Connector: bg-outline_variant/30 h-[2px] — NEVER border-t
- Active:    bg-primary text-on_primary filled circle
- Completed: bg-success text-white checkmark circle
- Upcoming:  border-2 border-outline_variant outline circle

---

## 17. ABSOLUTE PROHIBITIONS

NEVER use #000000 for text — only text-on_surface (#191c21)
NEVER use border utilities for layout sectioning
NEVER use divider lines between list items
NEVER stack more than 3 surface levels
NEVER use rounded-full on buttons
NEVER use rounded-lg on buttons
NEVER use text-white on buttons
NEVER hardcode property routes — always use property.id
NEVER use sm: breakpoint for layout grids — minimum md:
NEVER use lg: for two-column splits — minimum xl:
NEVER add Phase 2 or Phase 3 features to current code
NEVER add blockchain calls, API calls, or auth logic in Phase 1

---

## 18. RISKS AND CHALLENGES

| Risk | Category | Severity | Mitigation |
|---|---|---|---|
| Blockchain not legal ownership | Legal | HIGH | Clear disclaimers. Frame as PoC. |
| Bad data permanently encoded | Data | HIGH | Strict validation + AI + Oracle gate |
| Oracle approves fraudulent registrations | Trust | HIGH | Multi-sig oracle. All approvals logged. |
| GPT-4o misreads regional language docs | AI | MEDIUM | Tesseract fallback. Manual review. |
| MetaMask UX confusing for non-crypto users | UX | MEDIUM | Good onboarding. Use Privy/Dynamic in production. |
| Mumbai testnet instability | Technical | LOW | Event-driven retry. Fail gracefully in UI. |
| Pinata free tier IPFS limits | Cost | LOW | Compress documents. Use Filebase as backup. |
| Over-engineering stalls completion | Execution | HIGH | Strict phase gates. Ship Phase 1 first. |

---

## 19. PORTFOLIO POSITIONING

### For Software Engineering Interviews
I designed a 6-layer distributed system integrating blockchain, AI,
and traditional web infrastructure. I made architecture decisions
around data consistency — what belongs on-chain vs off-chain.
I implemented security patterns like reentrancy guards, multi-sig
oracles, and a hash-chained audit log.

### For Product / Startup Interviews
I identified a $2T+ problem in Indian real estate — 45% of
properties lack clear titles. I designed a phased MVP strategy
to validate the technical approach before scaling. I chose
GPT-4o Vision over a custom model to reduce build time by 80%,
and Polygon over Ethereum mainnet to eliminate gas cost barriers.

### For Web3 / Blockchain Interviews
I designed 5 Solidity contracts using OpenZeppelin standards
(ERC-721, ERC-20, AccessControl, Pausable, UUPS proxy).
I implemented an oracle pattern to bridge off-chain government
approvals with on-chain state transitions. I used The Graph
for indexed event queries to avoid expensive on-chain reads.

---

## 20. GITHUB AND DEPLOYMENT

Repository: https://github.com/Hey-Viswa/PropChain.git
Branch:     main
Commit format: feat: / fix: / chore: / docs:

Deployment: Vercel (auto-deploy from main)
Requirement: All 11 routes live on Vercel URL before Phase 2 begins.

---

## 21. IMMEDIATE NEXT ACTIONS (FIX ORDER)

1. npm install recharts --save
2. components/layout/Sidebar.tsx    remove border-r from aside
3. components/ui/button.tsx         fix all 4 variant token sets
4. app/properties/page.tsx          fix filter chips + xl: grid
5. app/audit/page.tsx               fix filter chips
6. app/oracle/queue/page.tsx        fix filter chips + row borders
7. app/dashboard/page.tsx           fix md: grid breakpoints
8. app/properties/[id]/page.tsx     fix xl:grid-cols-[1fr_380px]
9. app/mint/details/page.tsx        fix md:grid-cols-2
10. components/layout/AppShell.tsx  fix full padding scale + max-w wrapper

After all fixes:
  npx tsc --noEmit   must exit 0
  npm run build      must exit 0 with 11 routes
  Target score: 86/86
  Only then begin Phase 2.