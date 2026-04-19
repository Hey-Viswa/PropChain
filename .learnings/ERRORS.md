# Errors

Command failures and integration errors.

---

## [ERR-20260419-001] rg-command

**Logged**: 2026-04-19T11:12:00Z
**Priority**: medium
**Status**: resolved
**Area**: tooling

### Summary
`rg` is not installed in the terminal environment.

### Error
```
rg: The term 'rg' is not recognized as a name of a cmdlet, function, script file, or executable program.
```

### Context
- Command attempted: `rg -n ...`
- Environment: PowerShell on Windows workspace

### Suggested Fix
Use `grep_search`, `search_subagent`, or install ripgrep globally.

### Metadata
- Reproducible: yes
- Related Files: N/A

### Resolution
- **Resolved**: 2026-04-19T11:13:00Z
- **Commit/PR**: working tree
- **Notes**: Switched to built-in search tools.

---

## [ERR-20260419-002] npm-install-peer-resolution

**Logged**: 2026-04-19T11:15:00Z
**Priority**: medium
**Status**: resolved
**Area**: dependencies

### Summary
Installing Mapbox packages failed under strict npm peer resolution because existing `next` and `@clerk/nextjs` versions are out of peer range.

### Error
```
npm ERR! ERESOLVE could not resolve
peer next from @clerk/nextjs
```

### Context
- Command attempted: `npm install mapbox-gl react-map-gl`
- Existing dependency state produced peer conflict before new packages were added.

### Suggested Fix
Use `--legacy-peer-deps` for incremental dependency installs in this repo unless core versions are upgraded together.

### Metadata
- Reproducible: yes
- Related Files: package.json, package-lock.json

### Resolution
- **Resolved**: 2026-04-19T11:17:00Z
- **Commit/PR**: working tree
- **Notes**: Install succeeded with `npm install mapbox-gl react-map-gl --legacy-peer-deps`.

---
