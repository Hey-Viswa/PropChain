# Master Changelog

Canonical change history for all workspace-changing tasks.
Update this file for every implementation task before final completion.

## Entry Template
- UTC timestamp:
- Summary:
- Files changed:
- Verification:
- Commit:
- Push status:
- Notes/blockers:

---

## 2026-04-19T17:31:30Z | Master rule + UI fixes
- Summary:
  Enforced strict changelog-plus-push governance and completed pending UI fixes (sidebar footer control grouping, modal grey-box overlay fix, and user-monitoring filter button sizing normalization).
- Files changed:
  - AGENTS.md
  - docs/MAIN_HANDOVER.md
  - docs/MASTER_CHANGELOG.md
  - app/oracle/settings/page.tsx
  - app/oracle/users/page.tsx
  - app/page.tsx
  - components/layout/AppShell.tsx
  - components/layout/Sidebar.tsx
- Verification:
  - get_errors on edited UI files: no errors found.
  - npm run lint: pass with warnings only; no lint errors.
- Commit:
  pending
- Push status:
  pending
- Notes/blockers:
  None so far.
