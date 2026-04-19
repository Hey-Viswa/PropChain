# PropChain Agent Startup Rules

This repository uses docs/MAIN_HANDOVER.md as the primary multi-agent control file.

## Mandatory Startup Sequence

1. Read docs/MAIN_HANDOVER.md first.
2. Use the Agent Assignment Matrix in docs/MAIN_HANDOVER.md to choose ownership.
3. Start implementation immediately after role selection.
4. Before finishing, prepend a Session Log entry in docs/MAIN_HANDOVER.md.
5. For any workspace file change, run `git add`, create a commit, and push to the active remote branch before final completion; if blocked, record the blocker and next command in docs/MAIN_HANDOVER.md.
6. For any workspace file change, update docs/MASTER_CHANGELOG.md with UTC timestamp, summary, files changed, verification status, and commit hash (or push blocker) before final completion.
7. At session end, run `npm run session:end` to auto-regenerate `docs/WORK_HISTORY.md` as the single consolidated start-to-current documentation record, then stage it with the same change set.
8. Never modify `docs/PropChain_System_Plan.md`; it is a protected plan document.

## Scope

These rules are for GPT Codex style agents and any agent that reads AGENTS.md automatically.
