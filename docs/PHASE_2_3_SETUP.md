# PropChain — Phase 2 & 3 Connection / Setup Guide

> **Everything here uses a FREE tier. No paid plan is required.**
> Every external service degrades gracefully when its key is missing, so you can
> bring the system up incrementally.

This guide covers what was added in Phase 2 + Phase 3 and exactly what you need
to connect to run it end‑to‑end.

---

## 0. TL;DR — the free stack

| Concern | Service | Free tier | Required? | Without it… |
|---|---|---|---|---|
| Auth | **Clerk** | 10k MAU | Yes (login) | App can't authenticate users |
| Database | **MongoDB Atlas M0** | 512 MB | Yes (data) | API routes return 500 |
| Chain | **Polygon Amoy** testnet | Free + free RPC | Yes (on‑chain) | Mint/approve/transfer can't run |
| Faucet | **Polygon faucet** | Free test POL | Yes (gas) | No gas to send txs |
| Wallet | **WalletConnect / Reown** | Free | Optional | MetaMask still works |
| IPFS | **Pinata** | 1 GB | Optional | Simulated CID is stored instead |
| Email | **Resend** | 100/day | Optional | Notifications are logged, not sent |
| Explorer key | **PolygonScan** | Free | Optional | Only needed to verify contracts |
| Maps | **(none)** | — | No | Free OpenStreetMap card is shown |
| AI / OCR | **Tesseract.js** (local) | Free, offline | No | Pass OCR text directly to the API |

> The Graph is intentionally **not** used — its decentralized network is paid.
> On‑chain history is read directly with `viem.getLogs` (free) in
> `lib/services/historyService.ts`.
>
> GPT‑4o Vision is intentionally **not** used — it is paid. The AI pipeline
> (`lib/services/aiService.ts`) runs free local heuristics + optional
> Tesseract.js OCR. A free‑tier LLM (e.g. Google Gemini) can be plugged in later
> via the same interface.

---

## 1. One‑time local setup

```bash
# install deps (the repo pins versions that need legacy peer resolution)
npm install --legacy-peer-deps
cd blockchain && npm install --legacy-peer-deps && cd ..

cp .env.example .env.local   # then fill in values as you go
```

### Verify everything locally (no external services needed)

```bash
npx tsc --noEmit                 # types
npm run lint                     # lint
npm run test:unit                # 24 pure-logic unit tests (audit chain, fraud, AI)
cd blockchain && npx hardhat test && cd ..   # 27 contract tests
```

> Note: Hardhat downloads the Solidity compiler from `binaries.soliditylang.org`.
> If your network blocks it, the compiler can be fetched from the GitHub mirror
> `raw.githubusercontent.com/ethereum/solc-bin` into
> `~/.cache/hardhat-nodejs/compilers-v2/linux-amd64/`.

---

## 2. Connect each service (free)

### 2.1 Clerk (auth) — required
1. Create an app at <https://dashboard.clerk.com>.
2. **API Keys** → copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. **Webhooks** → add endpoint `https://<your-domain>/api/webhooks/clerk`,
   subscribe to `user.*`, copy the **Signing Secret** → `CLERK_WEBHOOK_SECRET`.

### 2.2 MongoDB Atlas (database) — required
1. Create a free **M0** cluster at <https://cloud.mongodb.com>.
2. **Database Access** → add a user/password.
3. **Network Access** → allow your IP (or `0.0.0.0/0` for a demo).
4. **Connect → Drivers** → copy the connection string → `MONGODB_URI`
   (add the db name, e.g. `/propchain`).

### 2.3 Polygon Amoy (blockchain) — required
1. Set the RPC envs (the public RPC is fine to start):
   - `NEXT_PUBLIC_CHAIN_ID=80002`
   - `BLOCKCHAIN_RPC_URL=https://rpc-amoy.polygon.technology`
   - `NEXT_PUBLIC_AMOY_RPC_URL=https://rpc-amoy.polygon.technology`
   - `AMOY_RPC_URL=https://rpc-amoy.polygon.technology`
   - *(optional, higher limits)* a free Alchemy/Infura Amoy URL instead.
2. Create a **throwaway** wallet, put its private key in `DEPLOYER_PRIVATE_KEY`
   and `ADMIN_WALLET_PRIVATE_KEY`. **Never use a real funded key.**
3. Get free test POL from a faucet (e.g. <https://faucet.polygon.technology>,
   select **Amoy**).
4. Deploy the contracts:
   ```bash
   cd blockchain
   npx hardhat run scripts/deploy.ts --network amoy
   ```
   Copy the printed addresses into `.env.local`:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_ENCUMBRANCE_ADDRESS`
   - `NEXT_PUBLIC_DISPUTE_ADDRESS`
5. Set `HISTORY_START_BLOCK` to the deploy block (printed by the explorer) so
   history scans start there instead of block 0.
6. Regenerate the typed ABIs if you changed contracts:
   ```bash
   node scripts/genAbis.js
   ```

### 2.4 WalletConnect / Reown (wallet) — optional
1. <https://cloud.reown.com> → create a project → copy **Project ID**.
2. `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...`
   (MetaMask + Coinbase connectors work without this.)

### 2.5 Pinata (IPFS) — optional
1. <https://app.pinata.cloud> → **API Keys** → create → copy the **JWT**.
2. `PINATA_JWT=...` and optionally `PINATA_GATEWAY=https://gateway.pinata.cloud`.
   Without a JWT, `ipfsService` returns a deterministic simulated CID so the
   flow still works.

### 2.6 Resend (email) — optional
1. <https://resend.com> → **API Keys** → copy → `RESEND_API_KEY`.
2. Until you verify a domain, leave `EMAIL_FROM=PropChain <onboarding@resend.dev>`
   (only delivers to your own account email). Without a key, emails are logged.

### 2.7 Oracle access — required for the Oracle panel
Generate a bcrypt hash of your Oracle passphrase and set `ORACLE_ACCESS_HASH`.
Set `DEV_ADMIN_PASSWORD` to gate `/dev/admin` in development.

---

## 3. Deploy the app (free) — Vercel

1. Push to GitHub and import the repo at <https://vercel.com> (Hobby = free).
2. Add every variable from `.env.local` to **Project → Settings → Environment
   Variables**.
3. Deploy. Update the Clerk webhook URL to the Vercel domain.

> Background workers (`npm run listener`, `npm run recovery`) are long‑running
> Node processes and do **not** run on Vercel's serverless functions. Run them
> on any always‑on free host (e.g. a Render/Railway free worker) or locally.

---

## 4. What Phase 2 / Phase 3 added

### Smart contracts (`blockchain/contracts/`)
- `EncumbranceRegistry.sol` — bank liens (`BANK_ROLE`): add / release / query.
- `DisputeRegistry.sol` — open disputes; `RESOLVER_ROLE` resolves.
- `FractionalOwnership.sol` — ERC‑20 share vault over one PropertyNFT
  (fractionalize / redeem).
- 27 Hardhat tests total.

### Services (`lib/services/`)
- `ipfsService.ts` — Pinata pin (JSON/file) + gateway URL, sim fallback.
- `emailService.ts` — Resend send + branded templates, logged fallback.
- `historyService.ts` — on‑chain timeline via `getLogs` (free, no Graph).
- `auditChain.ts` — SHA‑256 hash‑chained, tamper‑evident audit log.
- `fraudDetection.ts` — Indian‑deed fraud rules (pure, deterministic).
- `aiService.ts` — OCR → field extraction → fraud rules → confidence score.
- `txVerify.ts` — best‑effort receipt check for sync routes.

### API routes (`app/api/`)
| Method | Route | Auth |
|---|---|---|
| GET | `/api/properties/search` | public |
| GET | `/api/properties/[id]/history` | public |
| GET | `/api/analytics/public` | public |
| POST | `/api/ai/verify` | Clerk |
| POST | `/api/encumbrance` | BANK/ORACLE |
| POST | `/api/dispute` | Clerk (resolve = ORACLE) |

### UI
- `/analytics` — public network analytics dashboard.

---

## 5. Quick API smoke test (after deploy)

```bash
# public — no auth
curl https://<domain>/api/analytics/public
curl "https://<domain>/api/properties/search?q=MH&status=approved"
curl https://<domain>/api/properties/0/history
```

The authenticated routes (`/api/ai/verify`, `/api/encumbrance`, `/api/dispute`)
require a Clerk session cookie.
