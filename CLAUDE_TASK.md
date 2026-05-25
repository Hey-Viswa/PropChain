# Claude Autonomous Task: PropChain Ledger Reconciliation Engine

## Objective
Implement a robust, background-running reconciliation engine that ensures the on-chain state (Polygon POS) and the off-chain database (MongoDB) are perfectly synced for all `PropertyNFT` transactions.

## Context
Our current `recoveryWorker.ts` is basic. We need a production-grade system that can handle re-orgs, missed events, and data integrity verification.

## Requirements
1. **Event Backfilling**:
   - The engine must scan the last 10,000 blocks on startup.
   - For every `Transfer`, `PropertyMinted`, and `OracleApproval` event, it must verify if a corresponding entry exists in MongoDB.
   - If missing, it must fetch the IPFS metadata and reconstruct the record.

2. **Integrity Check**:
   - Implement a "Audit Consistency" check that compares the `isApproved` status on-chain with the `status` field in MongoDB.
   - Flag any discrepancies in a new `system_alerts` collection.

3. **Atomic Updates**:
   - Use MongoDB transactions (`session.withTransaction`) to ensure that reconstruction updates are atomic.

4. **Performance**:
   - Use batching for RPC calls (`getLogs`) to avoid hitting rate limits.

## Technical Details
- Contract Address: `process.env.NEXT_PUBLIC_CONTRACT_ADDRESS`
- RPC Provider: `lib/wagmi.ts`
- Target Location: `scripts/reconciliationEngine.ts`

## Handoff Instructions
- Read `docs/MAIN_HANDOVER.md` for orchestral rules.
- Follow the terracotta/cream design system if adding a UI for this (e.g., an Admin Dashboard tab for alerts).
- Implement unit tests for the reconciliation logic.
