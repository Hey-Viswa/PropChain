# Phase 2 & 3 Status Report

Last updated: 2026-06-14
Branch: `claude/adoring-planck-ionwg4`
Scope: Phase 2 (intermediate) + Phase 3 (advanced) backbone — free services only.

## Summary

Phase 1 (MVP) was feature-complete. This work delivers the tested backbone of
Phase 2 and Phase 3 using **only free-tier services** (no paid plans).

## Verification gate (all green)

| Check | Command | Result |
|---|---|---|
| Types | `npx tsc --noEmit` | PASS (0 errors) |
| Lint | `npm run lint` | PASS (0 errors) |
| Production build | `npm run build` | PASS (44 routes) |
| Contract tests | `cd blockchain && npx hardhat test` | PASS (27/27) |
| Unit tests | `npm run test:unit` | PASS (24/24) |

> The HEAD UI-overhaul commit had regressed `tsc`; a green baseline was restored
> first (7 type fixes, Solidity compiler bump to 0.8.28, retarget to Polygon
> Amoy, removal of the paid Mapbox dependency).

## Phase 2 — delivered

- `EncumbranceRegistry.sol` — `BANK_ROLE` lien add/release + `hasActiveLien`.
- `DisputeRegistry.sol` — open disputes + `RESOLVER_ROLE` resolution.
- `lib/services/ipfsService.ts` — Pinata pinning (sim CID fallback).
- `lib/services/historyService.ts` — free on-chain history via `getLogs`
  (replaces the paid The Graph).
- `lib/services/emailService.ts` — Resend notifications (logged fallback).
- API: `/api/properties/search`, `/api/properties/[id]/history`,
  `/api/encumbrance`, `/api/dispute`.
- DB models: `Encumbrance`, `Dispute`. Zod schemas for all payloads.

## Phase 3 — delivered

- `FractionalOwnership.sol` — ERC-20 share vault over a PropertyNFT.
- `lib/services/auditChain.ts` — SHA-256 tamper-evident hash chain.
- `lib/services/fraudDetection.ts` — deterministic fraud rules.
- `lib/services/aiService.ts` — OCR (optional free Tesseract.js) → extraction →
  fraud → confidence score + decision. No paid LLM.
- API: `/api/ai/verify`, `/api/analytics/public`.
- UI: `/analytics` public dashboard.
- `npm run test:unit` runner (24 tests).

## Free-service decisions (no paid plan)

| Original plan (paid) | Free replacement used |
|---|---|
| The Graph (decentralized network) | `viem.getLogs` direct indexing |
| GPT-4o Vision | Tesseract.js (local) + heuristics; optional free Gemini hook |
| Mapbox tiles | OpenStreetMap deep-link location card |
| Polygon Mumbai (sunset) | Polygon Amoy (free testnet, 80002) |

## Completion wave — remaining plan items delivered

Everything previously listed under "not yet wired" is now built, plus the
remaining Phase 2/3 stretch bullets from `PropChain_System_Plan.md`:

- **CI** — `.github/workflows/ci.yml`: web job (tsc · lint · unit · build) +
  contracts job (compile · test). Runs on every push/PR.
- **`PropChainOracle.sol`** — standalone on-chain governance-role registry
  (ORACLE_ROLE / BANK_ROLE) with grant/revoke + events. Deployed by
  `deploy.ts`, ABI in `lib/contracts/PropChainOracle.abi.ts`, 6 contract tests.
- **Bank Desk** (`/bank`) — BANK/ORACLE wallets register & release liens via
  `/api/encumbrance`. Linked in the sidebar under "Institutions".
- **Fractional ownership** — `Fractionalization` model + `/api/fractional` +
  `FractionalCard` on the property page (issue ERC-20 shares / redeem).
- **Succession / inheritance** — `Nomination` model + `/api/succession` +
  `SuccessionCard` (nominate heirs with a 100%-split, registrar executes).
- **W3C Verifiable Credential + certificate** — `credentialService.ts`
  (HMAC-SHA256 data-integrity proof), `/api/credential/[tokenId]`, and a
  printable `/certificate/[tokenId]` page with an embedded, dependency-free
  **QR code** (`lib/qrcode.ts`, byte-mode ECC-M v1–6, hand-rolled per ISO 18004).
- **Role bug fix** — `lib/auth/roles.ts` merges `User.role` with the `AdminRole`
  collection; `/api/encumbrance` + `/api/dispute` no longer always-403.
- **Tests** — `npm run test:unit` now 35 (credential + QR added); contracts 33.
- `AIReviewPanel` is wired to `/api/ai/verify` (already done in an earlier pass).

Verification gate (all green): `tsc --noEmit` · `next lint` · `next build`
(48 routes) · `test:unit` 35/35 · `hardhat test` 33/33.

## Still requires live keys

Live integration testing needs the external keys in `.env.local`
(see `docs/PHASE_2_3_SETUP.md`). This environment has no DB/RPC, so live flows
were validated by build + unit/contract tests, not by a running server.

## What to connect

See `docs/PHASE_2_3_SETUP.md` and `.env.example` — every service has a free tier.
