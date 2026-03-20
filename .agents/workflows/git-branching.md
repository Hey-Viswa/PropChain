---
description: Git branching strategy - develop in dev branch, push to production after testing
---

# Git Branching Strategy

## Rules

1. **All development work must happen on the `development` branch**, never directly on `main` or `production`.
2. **Never commit or push directly to `main`/`production`**.
3. Only after code is tested and confirmed working, merge `development` → `main`/`production`.

## Workflow Steps

// turbo-all

1. Before starting any feature or fix, ensure you are on the `development` branch:
```
git checkout development
```
If it does not exist, create it:
```
git checkout -b development
```

2. Make code changes and test locally using `npm run dev`.

3. Run the production build to verify no compilation errors:
```
npm run build
```

4. Once tested, commit your changes on `development`:
```
git add .
git commit -m "feat: <description>"
```

5. Push `development` to remote:
```
git push origin development
```

6. Only after full testing, merge into `main`/`production`:
```
git checkout main
git merge development
git push origin main
```

## Notes

- Never skip step 3 (`npm run build`) before merging to `main`.
- Hotfixes may use a `hotfix/<name>` branch, then merge into both `development` and `main`.
