# Platform Bug Tracker (`bugs.md`)

This file tracks all bugs, issues, edge-case failures, and regressions discovered during development, testing, and production for the No-Code Website Builder SaaS Platform.

---

## 1. Bug Severity & Status Definitions

### Severity Levels
- 🔴 **Critical (P0):** Platform crash, data loss, publishing failure, security vulnerability, unhandled exception preventing core workflows.
- 🟠 **High (P1):** Major feature broken (e.g., canvas drag drop failing, payment failure, style not saving), no immediate workaround.
- 🟡 **Medium (P2):** Secondary feature malfunction, visual alignment defect, UI glitch with a temporary workaround.
- 🟢 **Low (P3):** Minor styling inconsistency, typo, cosmetic artifact, non-blocking edge case.

### Status Definitions
- `Open`: Logged and awaiting triage/investigation.
- `In Progress`: Under active debugging and fix implementation.
- `Resolved`: Fix committed and verified in local environment.
- `Closed`: Verified in staging/production release.
- `Cannot Reproduce`: Unable to reproduce under reported conditions.

---

## 2. Active Bug List

| Bug ID | Date Logged | Module | Severity | Summary | Status | Assigned / Resolved |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| *None* | - | - | - | *No active bugs currently reported.* | - | - |

---

## 3. Bug Details Template
When reporting a new bug, add an entry using this template below:

```markdown
### [BUG-001] Short description of bug

- **Date Logged:** YYYY-MM-DD
- **Module:** Canvas / Properties / Backend / Publishing / etc.
- **Severity:** Critical / High / Medium / Low
- **Status:** Open / In Progress / Resolved / Closed
- **Reported By:** User / Developer / CI

#### Description
Detailed explanation of what went wrong.

#### Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Drag element '...' to '...'
4. Observe error

#### Expected Behavior
What should have happened.

#### Actual Behavior
What actually happened (include error messages or stack traces if available).

#### Resolution / Fix Details
Explanation of the fix and associated commit/file changes.
```

---

## 4. Resolved Bugs Archive

| Bug ID | Date Resolved | Module | Summary | Resolution Notes |
| :--- | :--- | :--- | :--- | :--- |
| BUG-001 | 2026-11-10 | Dev Environment / Git | Duplicate repository (`DARSH PATEL master*`) and 10k+ changes showing in VS Code | Safely removed root `.git` at `C:\Users\DARSH PATEL\.git`, configured `git.ignoredRepositories: ["C:\\Users\\DARSH PATEL"]` in `.vscode/settings.json` and workspace settings. |


