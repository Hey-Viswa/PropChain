# Feature Requests

Capabilities requested by the user.

---

## [FEAT-20260419-001] role-split-dashboard-mapbox

**Logged**: 2026-04-19T11:10:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend

### Requested Capability
Oracle and User should not see the same dashboard, and map interfaces should use Mapbox.

### User Context
User expects strict role-based UX separation and real map integration instead of placeholder visuals.

### Complexity Estimate
medium

### Suggested Implementation
Drive dashboard context from role checks (`useAdminRole`) and replace static map placeholders with a reusable Mapbox component.

### Metadata
- Frequency: first_time
- Related Features: dashboard, map UI

### Resolution
- **Resolved**: 2026-04-19T11:35:00Z
- **Commit/PR**: working tree
- **Notes**: Implemented role-context dashboard split and replaced map placeholders with Mapbox components.

---

## [FEAT-20260419-002] phase-iteration-documentation-discipline

**Logged**: 2026-04-19T11:59:51Z
**Priority**: high
**Status**: resolved
**Area**: docs

### Requested Capability
Always maintain per-phase and per-iteration documentation that tracks what was done, technology used, implementation approach, and lessons learned.

### User Context
User wants continuous self-improvement and compound correctness so agents avoid repeating mistakes and keep PropChain robust.

### Complexity Estimate
medium

### Suggested Implementation
Create a mandatory phase documentation protocol, add a reusable iteration template, add a phase iteration log, and enforce the rule from the main handover contract.

### Metadata
- Frequency: first_time
- Related Features: handover, phase documentation, process quality

### Resolution
- **Resolved**: 2026-04-19T11:59:51Z
- **Commit/PR**: working tree
- **Notes**: Added `docs/PHASE_DOCUMENTATION_PROTOCOL.md`, `docs/templates/PHASE_ITERATION_ENTRY_TEMPLATE.md`, `docs/phase_1_iteration_log.md`, and linked the rule in `docs/MAIN_HANDOVER.md`.

---
