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

## Not yet wired (follow-ups)

- Front-end wallet calls for encumbrance/dispute/fractional contracts (API +
  contracts are ready; the mint/property UIs still need buttons wired).
- `AIReviewPanel` still renders mock docs; `/api/ai/verify` is ready to back it.
- Live integration testing requires the external keys in `.env.local`
  (see `docs/PHASE_2_3_SETUP.md`). This environment has no DB/RPC, so live flows
  were validated by build + unit/contract tests, not by a running server.

## What to connect

See `docs/PHASE_2_3_SETUP.md` and `.env.example` — every service has a free tier.
