# PropChain 🏠⛓️

> **Blockchain-powered real estate property registry and tokenization platform**  
> Built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, and Zustand

[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Overview

PropChain is a cutting-edge **decentralized property registry** that enables property owners, verifiers, and oracle nodes to tokenize, verify, and manage real estate assets on the blockchain.

### Key Features
- 🏡 **Property Minting** — Multi-step wizard to register and tokenize properties as NFT-backed assets
- 🔍 **AI-Powered Verification** — AI engine extracts metadata from deed documents and assigns confidence scores
- 📊 **Portfolio Dashboard** — Real-time portfolio overview with valuations, yield metrics and telemetry
- 🧾 **Audit History** — Immutable, tamper-proof audit log of all property events
- 🔐 **Oracle Verification Queue** — Institutional validators review and sign pending asset mints
- 🌐 **Network Telemetry** — Live block height, gas metrics, and oracle consensus status

---

## 🎨 Design System

The UI was designed using **[Stitch by Google](https://stitch.withgoogle.com/)** — Google's AI-powered UI generation tool.

### Design Tokens
| Token | Color | Usage |
|---|---|---|
| `primary` | `#0050b2` | CTA buttons, accented text |
| `surface` | `#f9f9ff` | Page backgrounds |
| `on_surface` | `#191c21` | Primary text |
| `on_surface_variant` | `#43474e` | Secondary text |
| `success` | `#006e2c` | Verified / confirmed states |
| `error` | `#ba1a1a` | Failed / conflict states |

### Typography
- **Display / Headings**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (via `font-display`)
- **Body**: [Inter](https://fonts.google.com/specimen/Inter) (via `font-body`)
- Scale: Fluid typography using `clamp()` for all breakpoints

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 15.2.3 | React framework (App Router) |
| [React](https://react.dev) | 19.x | UI library |
| [TypeScript](https://typescriptlang.org) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 3.4.x | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | 4.x | Pre-built accessible components |
| [Radix UI](https://radix-ui.com) | Various | Primitive UI components |
| [Zustand](https://zustand-demo.pmnd.rs) | 5.x | Global state management |
| [Lucide React](https://lucide.dev) | 0.474 | Icon library |
| [React Hook Form](https://react-hook-form.com) | 7.x | Form management |
| [Zod](https://zod.dev) | 3.x | Schema validation |

---

## 📁 Project Structure

```
PropChain/
├── app/                        # Next.js App Router pages
│   ├── dashboard/              # Portfolio Overview dashboard
│   ├── properties/             # Property listing & detail pages
│   │   └── [id]/               # Dynamic property detail
│   ├── mint/                   # Multi-step asset minting flow
│   │   ├── layout.tsx          # Shared stepper layout
│   │   ├── details/            # Step 1: Property identification
│   │   ├── upload/             # Step 2: Document upload + AI review
│   │   ├── ai-check/           # Step 3: AI confidence results
│   │   └── review/             # Step 4: Final review & mint
│   ├── audit/                  # Audit history & verification queue
│   ├── oracle/                 # Oracle node panel
│   │   ├── queue/              # Verification queue
│   │   └── analytics/          # Oracle analytics
│   └── registry/               # Public registry explorer
├── components/
│   ├── layout/                 # AppShell, Sidebar, Navbar
│   ├── shared/                 # Reusable: PropertyCard, StatCard, etc.
│   ├── forms/                  # DocumentUploadZone, form controls
│   └── ui/                     # shadcn/ui primitive components
├── store/                      # Zustand state stores
│   ├── useMintStore.ts         # Minting wizard state
│   ├── usePropertyStore.ts     # Property list state
│   └── useRoleStore.ts         # User role (USER / ORACLE)
├── lib/
│   ├── mockData.ts             # Placeholder data for dev
│   └── utils.ts                # Utility helpers (cn, etc.)
├── types/
│   └── index.ts                # Shared TypeScript interfaces
└── hooks/                      # Custom React hooks
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20.x or higher
- **npm** 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Hey-Viswa/PropChain.git
cd PropChain

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Starts Next.js with Turbopack |
| Production build | `npm run build` | Creates optimized production build |
| Start production | `npm start` | Serves the production build |
| Lint | `npm run lint` | Run ESLint checks |

---

## 🌿 Branch Strategy

This project follows a **two-branch workflow** for safe deployment separation:

| Branch | Purpose | Auto-deploy |
|---|---|---|
| `development` | Active feature development and experiments | Dev/Staging |
| `production` | Stable, tested, release-ready code | Production |

### Workflow
```
feature/* → development → (PR review) → production
```

> ⚠️ **Never commit directly to `production`.** Always merge from `development` via Pull Request after testing.

---

## 🎨 Source & Attribution

| Design Component | Source |
|---|---|
| UI Screens & Mockups | [Stitch by Google DeepMind](https://stitch.withgoogle.com) — AI-generated UI design system |
| Icons | [Lucide React](https://lucide.dev) — Open-source icon library |
| Components | [shadcn/ui](https://ui.shadcn.com) — MIT Licensed component library |
| Property images (demo) | [Unsplash](https://unsplash.com) — Free to use photography |
| Fonts | [Google Fonts](https://fonts.google.com) — Plus Jakarta Sans, Inter |

---

## 📄 Pages Reference

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Redirect to dashboard |
| `/dashboard` | Portfolio Overview | Equity value, yield, verified asset cards |
| `/properties` | My Properties | Grid of tokenized property cards |
| `/properties/[id]` | Property Detail | Full asset detail with audit timeline |
| `/mint/details` | Mint Step 1 | Property identification form |
| `/mint/upload` | Mint Step 2 | Document upload + AI engine processing |
| `/mint/ai-check` | Mint Step 3 | AI confidence results |
| `/mint/review` | Mint Step 4 | Final review and ledger submission |
| `/audit` | Verification Queue | Oracle queue with confidence scoring |
| `/oracle/queue` | Oracle Panel | Node operator verification interface |
| `/oracle/analytics` | Oracle Analytics | Node performance metrics |
| `/registry` | Public Registry | Searchable public property registry |

---

## Known Security Limitations (PoC)

### Oracle JWT Forgeability
Oracle access tokens are JWTs signed by the PropChain API server using ORACLE_JWT_SECRET.
If the server is compromised, an attacker with access to ORACLE_JWT_SECRET can forge
valid Oracle tokens and submit on-chain approval transactions.

Mitigation in production (not implemented in PoC):
- Use a Hardware Security Module (HSM) for JWT signing
- Or: require Oracle actions to be signed by the Oracle's wallet directly (SIWE pattern)
- The on-chain hasRole() check on every approval is a partial mitigation — 
  a forged JWT still cannot bypass on-chain authorization IF the attacker
  doesn't also control the Oracle wallet

This is acceptable for a PoC/portfolio project. Not acceptable for production.

---

## 🔮 Roadmap

- [ ] Wallet connection (MetaMask / WalletConnect)
- [ ] Real blockchain integration (Ethereum / Polygon)
- [ ] IPFS document storage (via Filecoin/NFT.storage)
- [ ] Oracle node smart contract integration
- [ ] PDF parsing AI backend
- [ ] Multi-language support (i18n)
- [ ] Mobile PWA support

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using <a href="https://nextjs.org">Next.js</a> &amp; <a href="https://stitch.withgoogle.com">Stitch by Google</a>
</p>