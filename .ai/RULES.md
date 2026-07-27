# AI Development Rules for JobMap

This document defines mandatory rules for all AI-assisted development in the JobMap project.

## Core Principles

Every AI interaction **must** follow these rules without exception.

---

## 0. CRITICAL: Read Code First (NEW)

**Before ANY modification, read the code completely.**

```
RULE: Never modify code you haven't read.

Violation:
❌ AI modifies file without reading it first
❌ AI assumes what code does
❌ AI makes changes based on error message alone
❌ AI skips reading dependencies

Correct:
✅ Read entire file before modifying
✅ Understand the context
✅ Check for dependencies
✅ Understand side effects
✅ Then modify
```

### Why This Rule Exists

**Problem with not reading first:**

```
AI sees error: "navigate is undefined"
AI thinks: "Just add import"
AI adds: import { useNavigate } from 'react-router-dom'
AI doesn't read: This function is in a non-React-Router context
Result: Wrong fix, breaks code
```

**Correct approach:**

```
AI sees error: "navigate is undefined"
AI reads entire file: [Reading MapHomePage.jsx]
AI understands: It's a React component with routing
AI checks imports: [Checking what's imported]
AI sees: useNavigate is not imported
AI adds: import { useNavigate } from 'react-router-dom'
Result: Correct fix, code works
```

### When to Read Code

**Before FIX mode:**
- [ ] Read the entire file
- [ ] Read all imports
- [ ] Read all functions
- [ ] Read all state
- [ ] Read all dependencies
- [ ] Understand the full picture

**Reading Process:**

```
1. Open file
2. Read from top to bottom
3. Note all imports
4. Note all state/props
5. Note all functions
6. Understand flow
7. Identify where to change
8. Then make change
```

### Reading Checklist

Before modifying file, verify:

- [ ] Read the entire file?
- [ ] Understood all imports?
- [ ] Found all state declarations?
- [ ] Traced all function calls?
- [ ] Identified dependencies?
- [ ] Understood the logic?
- [ ] Checked for side effects?
- [ ] Ready to modify?

**If any is unchecked, keep reading.**

### Example: Reading Process

```
Task: Remove unused variable in Applicants.jsx

Step 1: Read the file
[Reading from line 1...]

Import section:
- React, useState, useEffect from react ✓
- CSS imports ✓
- External libraries ✓

State declarations (reading lines 1-15):
- applicants: array ✓
- filteredApplicants: array ✓
- searchTerm: string ✓
- statusFilter: string ✓
- currentPage: number ✓
- selectedApplicant: [THIS IS THE ONE] ← To remove
- itemsPerPage: number ✓
- isLoading: boolean ✓

Component body (reading lines 16-end):
- Various functions ✓
- Return JSX ✓
- selectedApplicant used in: [Check...]
  Line 207: onClick={() => setSelectedApplicant(applicant)}
  Other usages: [Search...]
  Found: NONE

Conclusion:
- Variable declared: Line 10 ✓
- Variable set: Line 207 ✓
- Variable read: NOWHERE ✓
- Safe to remove: YES ✓

Ready to modify.
```

### After Reading, Then Modify

Only after reading completely:

```
✓ Read complete
✓ Understood flow
✓ Identified dependencies
✓ Confirmed safe to change
→ NOW modify
```

---

## 1. Single Feature Rule
- **Never** modify more than one feature at a time
- If fixing Feature A causes issues in Feature B, stop immediately
- Report the secondary issue separately

✅ **Allowed**: Fix login bug in AuthService  
❌ **Forbidden**: Fix login bug AND refactor dashboard simultaneously

---

## 2. No Automatic Refactoring
- **Never** refactor code unless explicitly requested
- Even if code looks "improvable", leave it alone
- Refactoring during bug fixes causes scope creep

✅ **Allowed**: Change variable name if it's causing the bug  
❌ **Forbidden**: Restructure a function while fixing an unrelated bug

---

## 3. Dependency Freeze
- **Never** upgrade packages automatically
- **Never** add new packages without explicit approval
- **Never** modify package.json unless requested
- Even security updates require approval

✅ **Allowed**: Use existing dependencies  
❌ **Forbidden**: Auto-upgrade React from 18.0 to 18.2

---

## 4. Architecture Immutability
- **Never** change project architecture
- **Never** reorganize folder structure
- **Never** move files between modules without approval
- **Never** rename folders or core modules

✅ **Allowed**: Add file to existing module  
❌ **Forbidden**: Create new module structure or rename src/modules

---

## 5. Configuration Protection
- **Never** modify environment variables
- **Never** change .env files
- **Never** modify build configuration (webpack, tsconfig, etc.)
- **Never** change ESLint or TypeScript settings

✅ **Allowed**: Reference existing env variables  
❌ **Forbidden**: Add new env variables or modify .eslintrc

---

## 6. Routing Immutability
- **Never** add new routes without specification
- **Never** modify existing route paths
- **Never** change route parameters or structure

✅ **Allowed**: Fix bug in existing route handler  
❌ **Forbidden**: Add new route or change /users/:id to /users/:userId

---

## 7. Code Quality Standards
- **Never** disable ESLint warnings
- **Never** disable TypeScript checks
- **Never** add `@ts-ignore` or `// eslint-disable`
- **Never** ignore type errors

✅ **Allowed**: Fix code to pass linting  
❌ **Forbidden**: Disable a rule instead of fixing the violation

---

## 8. Reasoning Requirement
- **Every** code change must have a documented reason
- Include rationale in commit messages
- Explain why, not just what changed

✅ **Allowed**: "Fix: Remove unused selectedApplicant variable causing ESLint error"  
❌ **Forbidden**: "Fix: Clean up code"

---

## 9. Focused Fixes
- Fix **only** the requested issue
- Do not fix related issues automatically
- Do not improve code while fixing bugs

✅ **Allowed**: Fix the one ESLint error reported  
❌ **Forbidden**: Fix that error PLUS optimize the component

---

## 10. Issue Discovery Protocol
If another issue is found during work:

1. **Stop** immediately
2. **Report** the issue with evidence
3. **Do not** continue fixing it
4. **Wait** for approval

✅ **Allowed**: "Found: MapHomePage also has navigate error"  
❌ **Forbidden**: Continue fixing the navigate error in MapHomePage

---

## 11. Atomic Changes
- One issue = One fix = One commit
- No chaining unrelated fixes
- Each change must be independently verifiable

✅ **Allowed**: Commit A fixes LoginPage, Commit B fixes Dashboard  
❌ **Forbidden**: One commit fixing both unrelated issues

---

## 12. No Silent Modifications
- **Never** modify files not directly related to the fix
- **Never** touch unrelated code while fixing
- **Never** update comments or documentation without approval

✅ **Allowed**: Change variable in LoginService  
❌ **Forbidden**: Also update related components

---

## 13. Test Before Declaring Success
- Run `npm run lint` before committing
- Run `npm run build` before committing
- Run relevant tests before committing
- If tests fail, fix them, do not skip

✅ **Allowed**: Fix failing test related to your change  
❌ **Forbidden**: Skip test or disable it

---

## 14. Module Boundaries
Respect file ownership rules defined in `FILE_OWNERS.md`:
- Do not edit files outside your allowed scope
- Ask permission before crossing module boundaries

✅ **Allowed**: Edit auth module files  
❌ **Forbidden**: Edit auth files AND map files in same change

---

## 15. Read Code First (Enforcement)
**This is the most important rule. Enforce it in every FIX mode.**

In FIX mode, BEFORE ANY MODIFICATION:

```
[ ] Have I read the entire file?
[ ] Do I understand all imports?
[ ] Do I understand all state?
[ ] Do I understand all functions?
[ ] Do I understand dependencies?
[ ] Am I ready to modify?

If any NO: Keep reading. Do not modify.
```

**This prevents:**
- Making wrong assumptions
- Breaking code unexpectedly
- Missing side effects
- Creating new bugs while fixing old ones

---

## Violation Consequences

If any rule is violated:
- Changes will be rejected
- Code review will fail
- Human developer must re-do the work
- Document violation in CHANGELOG_AI.md

---

## Quick Reference Checklist

Before making any change, answer:

- [ ] Is this a single, focused fix?
- [ ] Am I only modifying required files?
- [ ] Did I run linting and build?
- [ ] Did I check FILE_OWNERS.md?
- [ ] Is my change atomic and reversible?
- [ ] Can I explain the reason clearly?
- [ ] Are there no secondary issues to fix?
- [ ] Did I verify the fix works?

If **any** answer is "no", reconsider the change.
