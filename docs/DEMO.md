# PropChain — Demo Guide (showable to teachers)

A clean, **fully free**, fully local way to run the complete MVP and show the
real flow: connect wallet → KYC → mint a property → oracle approves it →
view it on-chain → (optional) transfer.

Two free cloud accounts are needed (both have generous free tiers):
**Clerk** (login) and **MongoDB Atlas M0** (database). Everything else runs
locally on a free Hardhat blockchain — no testnet, no faucet, no gas costs.

---

## 1. Install

```bash
npm install --legacy-peer-deps
cd blockchain && npm install --legacy-peer-deps && cd ..
cp .env.example .env.local
```

## 2. Fill in `.env.local` (free accounts)

- **Clerk** → <https://dashboard.clerk.com> → API Keys:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- **MongoDB Atlas** → free M0 cluster → connection string → `MONGODB_URI`
- **Local chain**:
  ```env
  NEXT_PUBLIC_CHAIN_ID=31337
  BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
  # Account #0 from `npx hardhat node` (admin/oracle). Used server-side to grant
  # on-chain KYC and assign the oracle role. Local test key only.
  ADMIN_WALLET_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  ```
  > `0xac0974…ff80` is Hardhat's well-known Account #0 key — safe for local demos
  > only, never for real funds.
- Oracle passphrase gate (any value, then hash it):
  - `ORACLE_ACCESS_HASH=` a bcrypt hash of your chosen passphrase.

## 3. Start the local blockchain (terminal 1)

```bash
cd blockchain
npx hardhat node
```
This prints 20 funded test accounts with private keys. **Account #0 is the admin
and the Oracle** (the deploy script grants it `ORACLE_ROLE`).

## 4. Deploy the contracts (terminal 2)

```bash
cd blockchain
npx hardhat run scripts/deploy.ts --network localhost
```
Copy the three printed addresses into `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=...
NEXT_PUBLIC_ENCUMBRANCE_ADDRESS=...
NEXT_PUBLIC_DISPUTE_ADDRESS=...
```

## 5. Add the local network + account to MetaMask

- Add network: **RPC** `http://127.0.0.1:8545`, **Chain ID** `31337`,
  **Currency** `ETH`.
- Import **Account #0**'s private key (from terminal 1). This account is your
  admin/oracle and your property owner for the demo.

## 6. (Optional) keep the DB in sync with the chain (terminal 3)

```bash
npm run listener
```
This watches contract events and updates MongoDB automatically (mint → confirmed,
approve → approved, etc.). You can skip it; the app also confirms via API.

## 7. Run the app (terminal 4)

```bash
npm run dev
```
Open <http://localhost:3000>.

---

## The live demo flow

1. **Sign in** with Clerk (email).
2. **Connect wallet** (MetaMask, Account #0). The dashboard shows real stats
   (all zero to start).
3. **Complete KYC** — click the banner, enter any Aadhaar-style number + the
   mock OTP. The banner clears.
4. **Register a property** → "Register a property":
   - Step 1: fill ULPIN (e.g. `MH0123456789`), address, area, type.
   - Step 2: attach any file.
   - Step 3: the **AI verification** runs on your entered details and shows a
     real confidence score + extracted fields (try an already-used ULPIN to see
     it flag a duplicate).
   - Step 4: **Sign & submit** → MetaMask prompts → the property is minted
     on-chain and appears under **My Properties** as *Awaiting Oracle*.
5. **Approve as Oracle**:
   - Open the Oracle access card on the dashboard, enter your passphrase to
     enter Oracle mode (the sidebar switches to the Oracle nav).
   - Go to **Verification Queue** → your submission is listed → **Approve** →
     MetaMask prompts → status becomes *Verified*.
6. **View it**: open the property → the **Audit Trail** shows the real on-chain
   events (registered, approved) with tx hashes. **Public Registry** search
   finds it. **Analytics** counts update.

---

## Optional: pre-populate sample data for a fuller-looking overview

```bash
npm run seed -- 0xYourMetaMaskAddress
```
Adds five sample properties (plus one encumbrance and one dispute) tied to your
wallet so the dashboard, registry and analytics look populated immediately.

> Note: seeded rows are for **display only** — they are not minted on-chain, so
> run the live flow in step 4–5 above to demonstrate actual on-chain actions.

---

## Deploying for a shareable link (free)

Push to GitHub, import on **Vercel (Hobby = free)**, add the same env vars, and
for a public chain use **Polygon Amoy** instead of local Hardhat
(see `docs/PHASE_2_3_SETUP.md`). The local flow above is enough for a classroom
demo and needs no testnet.
