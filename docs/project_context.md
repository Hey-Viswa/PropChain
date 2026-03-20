# PropChain — Project Context

## Overview
**PropChain** is a blockchain-powered real estate property registry and tokenization platform. It enables property owners, verifiers, and oracle nodes to tokenize, verify, and manage real estate assets on the blockchain.

## Current Project State
*   **Phase 1 (Frontend, UI, and Mock State Wiring):** `COMPLETED`
*   **Next Phase:** Phase 2 (Smart Contracts, Web3 integration, Backend APIs).

## Tech Stack
*   **Framework:** Next.js 15.2.3 (App Router)
*   **UI Library:** React 19.x
*   **Language:** TypeScript 5.x
*   **Styling:** Tailwind CSS 3.4.x, shadcn/ui (Radix UI primitives)
*   **State Management:** Zustand 5.x
*   **Icons:** Lucide React
*   **Forms & Validation:** React Hook Form, Zod
*   **Data Visualization:** Recharts

## Architecture & Data Flow (Phase 1)
Currently, the application is wired up using global Zustand stores (`useMintStore`, `usePropertyStore`, `useRoleStore`) and static mock data (`lib/mockData.ts`). 

### Core Modules
1.  **Mint Wizard (`/mint/*`)**: 
    A multi-step property minting flow (Details → Upload → AI Check → Review). Wired to `useMintStore`.
2.  **Property Registry (`/properties/*`)**:
    Dynamic property detail pages rendering out of `usePropertyStore`.
3.  **Oracle Analytics Dashboard (`/oracle/analytics`)**:
    Visualizes oracle network data (submissions, verification outcomes) using Recharts.
4.  **Audit & Queue (`/audit`, `/oracle/queue`)**:
    Tamper-proof audit history logs and institutional verification queues.

## Design System
*   **Theme:** Custom tokens generated via Google Stitch.
*   **Layout:** Wrapped in an `AppShell` with strict rules (max 3 surface stacking levels, no arbitrary borders for sectioning).
*   **Typography:** Plus Jakarta Sans for headings, Inter for body and labels.
*   **Colors:** Primary (`#0050b2`), Surface (`#f9f9ff`), Success (`#006e2c`), Error (`#ba1a1a`).
