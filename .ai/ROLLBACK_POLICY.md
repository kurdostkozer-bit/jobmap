# ROLLBACK_POLICY.md: Immediate Revert Protocol

Critical policy: When to revert immediately and stop further work.

**Golden Rule:** If build fails, revert. Do not debug on broken code.

---

## Core Principle

```
BROKEN BUILD = IMMEDIATE REVERT

Do not:
✗ Continue debugging
✗ Add more changes
✗ Try quick fixes
✗ Patch the problem

DO:
✓ Revert immediately
✓ Identify root cause
✓ Start fresh if needed
```

---

## When to Rollback

### Automatic Rollback Triggers

**🚨 STOP and REVERT immediately if:**

```
1. ❌ Build fails
   npm run build → "Failed to compile"
   → REVERT IMMEDIATELY

2. ❌ Linting fails
   npm run lint → Any error
   → REVERT IMMEDIATELY

3. ❌ Tests fail
   npm run test → Any test fails
   → REVERT IMMEDIATELY

4. ❌ TypeScript compilation fails
   Compilation error detected
   → REVERT IMMEDIATELY

5. ❌ New errors appear
   Unrelated errors introduced
   → REVERT IMMEDIATELY

6. ❌ Breaking change detected
   Functionality broken
   → REVERT IMMEDIATELY

7. ❌ Deployment fails
   Cannot deploy to environment
   → REVERT IMMEDIATELY

8. ❌ Critical tests fail
   Core functionality broken
   → REVERT IMMEDIATELY
```

**There are no exceptions to these triggers.**

---

## The Rollback Workflow

```
CHANGE MADE
    ↓
RUN: npm run build
    ↓
    ├─ ✅ SUCCESS
    │  ├─ RUN: npm run test
    │  │  ├─ ✅ PASS → Change is good
    │  │  └─ ❌ FAIL → GO TO REVERT (below)
    │  └─ Done
    │
    └─ ❌ FAILURE
       ↓
       REVERT IMMEDIATELY
       ├─ git revert [commit]
       │  OR
       │  git checkout -- [files]
       │
       ├─ Verify revert
       │  └─ npm run build → ✅ Pass
       │
       ├─ Report failure
       │  └─ "Change reverted due to build failure"
       │
       └─ STOP (do not continue)
```

---

## Step-by-Step Rollback Process

### Step 1: Recognize Failure

**When:**
- Build fails
- Tests fail
- Any check fails

**Action:**
STOP immediately. Do not continue.

**Example:**
```
npm run build
[output]
Failed to compile.
error TS2322: Type 'string' is not assignable to type 'number'

→ TRIGGERED: TypeScript compilation failure
```

---

### Step 2: Revert Changes

**Option A: If git commit already made**

```bash
git revert [commit-hash]
```

**Option B: If changes not yet committed**

```bash
git checkout -- [file-path]
# or for all changes
git checkout -- .
```

**Option C: If multiple commits**

```bash
git revert [oldest-commit]..[newest-commit]
```

**Command choice:**
- Use `git revert` if already committed (creates new commit that undoes changes)
- Use `git checkout` if not yet committed (discards changes)

---

### Step 3: Verify Revert

After reverting, verify build passes:

```bash
npm run lint
→ Expected: ✓ PASS

npm run build
→ Expected: ✓ Compiled successfully

npm run test
→ Expected: ✓ All tests pass
```

**If these fail after revert:**
Something is very wrong. Contact team lead immediately.

**Expected output:**
```
✓ Linting passed
✓ Build succeeded
✓ Tests passed

[Previous state restored]
```

---

### Step 4: Report Failure

**Report to user:**

```
❌ ROLLBACK EXECUTED

Reason: Build failure

Error:
[Exact error message]

Action taken:
git revert [commit]

Status: Previous state restored

Next steps:
[Ask what to do]
```

---

### Step 5: Diagnostic

After reverting, analyze:

1. **What went wrong?**
   - Read the error message
   - Understand the failure

2. **Why did it happen?**
   - Was the change too aggressive?
   - Were tests run before commit?
   - Was there a typo?

3. **Can it be fixed?**
   - Is the fix straightforward?
   - Would it require major changes?

4. **Should we try again?**
   - Only if root cause understood
   - Only with different approach
   - Only with explicit user approval

---

## Rollback Scenarios

### Scenario 1: Simple Build Error

```
Made change to Applicants.jsx
Run: npm run build

❌ OUTPUT:
[eslint] src/components/Applicants/Applicants.jsx
Line 10: 'newVariable' is assigned but never used

ROLLBACK:
git checkout -- src/components/Applicants/Applicants.jsx

VERIFY:
npm run build → ✅ SUCCESS

REPORT:
"Change reverted. Unused variable was the issue.

To fix properly:
1. Remove the unused variable
2. OR use it in the code

Ready to try again?"
```

---

### Scenario 2: Test Failure

```
Made change to JobListings.jsx
Run: npm run build → ✅ PASS
Run: npm run test

❌ OUTPUT:
FAIL src/components/JobListings/JobListings.test.jsx
● JobListings › renders correctly

Expected: 42 items
Received: 0 items

ROLLBACK:
git revert abc123

VERIFY:
npm run test → ✅ All pass

REPORT:
"Change reverted. Test failed because...

The change broke the rendering logic.
Root cause: [diagnosis]

Should we fix this differently?"
```

---

### Scenario 3: Incomplete Fix

```
Fixed bug in auth service
Run: npm run build → ✅ PASS
Run: npm run test → 1 FAIL

❌ OUTPUT:
FAIL src/modules/auth/auth.service.spec.ts
● AuthService › loginUser with invalid credentials

Error: Expected error to be thrown

ROLLBACK:
git revert xyz789

VERIFY:
npm run test → ✅ All pass

REPORT:
"Change reverted. Test failure indicates incomplete fix.

The fix addressed one scenario but broke another.
Full test suite must pass before commit.

Would you like to:
1. Try different fix?
2. Debug more before attempting?
3. Escalate to team lead?"
```

---

### Scenario 4: Breaking Change

```
Refactored JobCard component props interface
Run: npm run build

❌ OUTPUT:
[eslint] src/components/JobCard/JobCard.jsx
error: 'title' prop is now required but parent doesn't pass it

ROLLBACK:
git revert def456

VERIFY:
npm run build → ✅ SUCCESS

REPORT:
"Change reverted. Breaking change detected.

The refactor changed the component interface,
which broke parent components.

This is a MEDIUM-HIGH risk change requiring:
1. Update all consumers
2. Full integration testing
3. User approval for breaking change

Should I take different approach?"
```

---

## Rollback Timing

### Immediate Rollback (seconds)

```
❌ Build fails immediately
   → git revert/checkout
   → Takes: ~10 seconds
   → Do it NOW
```

### Fast Rollback (minutes)

```
❌ Tests fail
   → Revert commit
   → Re-run tests
   → Takes: ~2-5 minutes
   → Do it immediately
```

### Coordinated Rollback (hours)

```
❌ Production issue found
   → Alert team
   → Prepare revert
   → Coordinate timing
   → Execute revert
   → Takes: ~30-60 minutes
   → Do it as soon as possible
```

---

## Rollback Prevention Checklist

Before committing, verify:

- [ ] Ran `npm run lint`? ✓ Pass
- [ ] Ran `npm run build`? ✓ Pass
- [ ] Ran `npm run test`? ✓ Pass
- [ ] All checks pass? ✓ Yes
- [ ] Ready to commit? ✓ Yes

**If any is no, DO NOT commit.**

---

## Manual Rollback Commands

### Rollback Last Commit

```bash
# If committed
git revert HEAD

# If not committed
git checkout -- .
```

### Rollback Specific File

```bash
git checkout -- src/file.jsx
```

### Rollback Multiple Commits

```bash
git revert HEAD~3..HEAD
```

### Rollback to Previous State

```bash
git reset --hard [previous-commit]
```

### Check What Will Be Reverted

```bash
git diff
git status
```

---

## Automation: Pre-commit Checks

### Option 1: Manual Verification (Current)

Before every commit:
```bash
npm run lint   # Must pass
npm run build  # Must pass
npm run test   # Must pass
```

### Option 2: Git Hooks (Recommended Future)

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "Running pre-commit checks..."

npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed"
  exit 1
fi

npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

npm run test -- --run
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

echo "✓ All checks passed"
exit 0
```

---

## Rollback Communication

### To User

```
❌ ROLLBACK EXECUTED

Reason: [Build/Test/Lint] failure
Location: [File:Line]
Error: [Exact error message]

Action: git revert [commit]
Status: Reverted successfully
Build: ✓ Now passing

Next: Ready to troubleshoot or try different approach?
```

### To Team (if applicable)

```
Rollback notification

Change: [Description]
Reason: [Why it failed]
Time: [When reverted]
Status: [Verified working]

Team: Please be aware of this issue
Impact: None (reverted before merge)
```

---

## Exception Policy

### When NOT to Rollback

There are NO exceptions to the rollback policy during development.

However, in production:

🚨 **Critical production issue?**

1. Assess severity
2. Is rollback faster than fix?
3. If yes → Rollback immediately
4. If no → Hotfix carefully

**Still:** Always prefer rollback if uncertain.

---

## Rollback Impact

### Positive Impact ✅

- Prevents broken code from spreading
- Maintains clean commit history (with git revert)
- Gives time to think properly
- Reduces technical debt
- Maintains code quality

### Negative Impact ⚠️

- Time investment to revert and retry
- Feels like "wasted work"
- Might be demoralizing

**Perspective:** It's not wasted. It's learning. The broken commit taught you something. The revert prevented problems.

---

## Post-Rollback Process

After rollback, **do not immediately retry.**

### Step 1: Wait and Think (5 minutes)

Don't jump back in. Let the failure sink in.

- What went wrong?
- Why didn't I catch it?
- What would prevent this?

### Step 2: Understand Root Cause

- Read the error again
- Understand the issue
- Could I have prevented it?

### Step 3: Plan Better Approach

- Different strategy?
- More testing first?
- Smaller change size?
- Different files to touch?

### Step 4: Get User Approval

"I'd like to try again with this approach instead..."

Only after approval → FIX mode again

### Step 5: Execute New Plan

With better understanding and plan.

---

## Rollback Mistakes to Avoid

### ❌ Mistake 1: Continuing After Failure

```
Build fails
→ ❌ Tries to debug
→ ❌ Adds more changes
→ ❌ Makes it worse
→ ✅ Should have: Reverted immediately
```

### ❌ Mistake 2: Patching Over Problem

```
Build fails
→ ❌ Adds quick fix
→ ❌ Commits both changes together
→ ❌ Hard to understand what went wrong
→ ✅ Should have: Reverted and started fresh
```

### ❌ Mistake 3: Ignoring Warnings

```
Tests warning
→ ❌ Says "I'll fix it later"
→ ❌ Commits anyway
→ ❌ Later becomes worse problem
→ ✅ Should have: Reverted or fixed immediately
```

### ❌ Mistake 4: Blaming Tests

```
Tests fail
→ ❌ Thinks tests are wrong
→ ❌ Disables test
→ ❌ Ships broken code
→ ✅ Should have: Trusted tests and reverted
```

---

## Rollback Statistics

For team awareness:

```
Track rollbacks over time:
- How many rollbacks per month?
- What causes most rollbacks?
- How long does revert take?
- How often is revert successful?

Goal: Reduce frequency through:
- Better pre-commit checks
- More thorough testing
- Better code review
```

---

## Remember

```
Rollback is not failure.
Rollback is professional responsibility.

Professional developers:
✓ Revert broken changes
✓ Take time to understand
✓ Try again with better approach

Unprofessional developers:
✗ Keep broken code
✗ Layer patches on top
✗ Hope it fixes itself

Be professional.
When build fails: Revert.
No exceptions.
No shortcuts.
```

---

## Quick Reference

```
Build fails?          → git revert HEAD
Tests fail?           → git revert HEAD
Lint fails?           → git revert HEAD
Wrong approach?       → git revert HEAD
Made mistake?         → git revert HEAD

Verify revert works:
  npm run lint   → ✓
  npm run build  → ✓
  npm run test   → ✓

Report failure
Try different approach
Ask for approval
Start again

Simple. Professional. Effective.
```
