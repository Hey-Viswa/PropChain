# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice

---

## [LRN-20260419-001] best_practice

**Logged**: 2026-04-19T11:30:00Z
**Priority**: medium
**Status**: resolved
**Area**: tooling

### Summary
Use built-in workspace search tools when ripgrep is unavailable in this Windows shell.

### Details
The `rg` command was not available in the terminal session, so search operations should use `grep_search`, `search_subagent`, or PowerShell-native alternatives.

### Suggested Action
Default to `search_subagent` or `grep_search` first in this workspace.

### Metadata
- Source: error
- Related Files: N/A
- Tags: search, tooling, windows

---
