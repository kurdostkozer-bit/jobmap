# BUILD_RULES.md: Build Pipeline Policy

Mandatory rules for build, test, and deployment processes.

**Principle:** Every change must pass the complete build pipeline before declaring success.

---

## 🛑 STOP ON FIRST FAILURE RULE

**Critical Rule:** If ANY step fails, STOP immediately. Do not continue.

```
Step 1: npm run lint
   ↓
❌ FAILS?
   → STOP
   → Fix this error
   → Restart from Step 1
   
✅ PASSES?
   → Continue to Step 2

Step 2: npm run build
   ↓
❌ FAILS?
   → STOP
   → Fix this error
   → Restart from Step 1
   
✅ PASSES?
   → Continue to Step 3

[Same for all steps]
```

### Why Stop on First Failure?

**Problem with continuing:**
- Layers errors on top of each other
- Makes debugging harder
- Multiple failures hide root cause
- Time wasted on wrong fixes

**Correct approach:**
```
Build fails
↓
Fix that error
↓
Re-run from beginning
↓
Next error appears
↓
Fix that one
↓
Repeat until all pass
```

### Example: Stop on First Failure

```
❌ WRONG APPROACH:

1. npm run lint
   [Error at line 10]
   → Ignores it, continues

2. npm run build
   [Error at line 25]
   → Now has 2 errors

3. npm run test
   [5 tests fail]
   → Now has 7 problems
   → Very hard to debug

Result: Confused and frustrated


✅ CORRECT APPROACH:

1. npm run lint
   [Error at line 10]
   → STOP immediately
   → Fix error at line 10
   → Run npm run lint again
   → ✅ Pass

2. npm run build
   [Now working because lint passed]
   → ✅ Pass

3. npm run test
   [All tests pass]
   → ✅ Done

Result: Clean progression, clear debugging
```

### When to Stop

Stop immediately if:

- [ ] `npm run lint` reports any error
- [ ] `npm run build` fails to compile
- [ ] `npm run test` has any failing test
- [ ] `npm run test:integration` has any failure
- [ ] `npm run test:e2e` has any failure
- [ ] Any TypeScript compilation error
- [ ] Any new warning appears

**There are NO exceptions.**

---

## The Build Pipeline

All projects must execute this sequence **in order**:

```
┌──────────────────┐
│  1. LINT CHECK   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ 2. COMPILE/TYPE  │
└────────┬─────────┘
         ↓
┌──────────────────┐
│   3. BUILD       │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  4. UNIT TESTS   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│ 5. INTEGRATION   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│    SUCCESS ✓     │
└──────────────────┘

FAIL AT ANY STEP → STOP AND FIX → RESTART FROM STEP 1
```

---

## Frontend Build Pipeline (React)

### Step 1: Linting
**Command:** `npm run lint`

**What it does:**
- Checks ESLint rules
- Validates code style
- Detects unused variables
- Finds type issues

**Expected output:**
```
✓ No ESLint errors
✓ All files pass linting
```

**If it fails:**
```
❌ [eslint] src/file.jsx
   Line X: error message
   
ACTION: Fix the error, do not disable the rule
```

**Rules:**
- [ ] Must pass completely
- [ ] Cannot disable warnings
- [ ] Cannot use `@ts-ignore`
- [ ] Cannot use `// eslint-disable`
- [ ] Cannot add `noUnusedLocals: false` to tsconfig

---

### Step 2: TypeScript Check
**Command:** `npm run type-check` (if available) or built into build

**What it does:**
- TypeScript compilation
- Type checking
- Interface validation

**Expected output:**
```
✓ No TypeScript errors
✓ Successfully compiled
```

**If it fails:**
```
❌ src/file.tsx:10
   error TS2322: Type 'string' is not assignable to type 'number'

ACTION: Fix the type error
```

**Rules:**
- [ ] Must pass completely
- [ ] Cannot use `any` type
- [ ] Cannot use `as any` cast
- [ ] Cannot disable `strict` mode

---

### Step 3: Build
**Command:** `npm run build`

**What it does:**
- Creates optimized production build
- Minifies code (Terser)
- Bundles assets
- Generates source maps
- Compresses CSS

**Expected output:**
```
Compiled successfully.
File sizes after gzip:
  274.1 kB  build/static/js/main.*.js
  15.29 kB  build/static/css/main.*.css

The build folder is ready to be deployed.
```

**If it fails:**
```
❌ Failed to compile.
   [eslint] src/file.jsx
   error at line X
   
ACTION: Go back to Step 1 (linting), fix the issue, restart
```

**Rules:**
- [ ] Must complete without errors
- [ ] Cannot skip optimization
- [ ] Cannot disable minification
- [ ] Build output must go to `build/` folder
- [ ] Source maps must be generated

---

### Step 4: Unit Tests
**Command:** `npm run test -- --run` or `npm test`

**What it does:**
- Runs Jest tests
- Tests individual components
- Tests utilities and helpers
- Checks code coverage

**Expected output:**
```
PASS  src/components/Button.test.jsx
PASS  src/utils/helpers.test.js
Test Suites: 5 passed, 5 total
Tests:       42 passed, 42 total
```

**If it fails:**
```
❌ FAIL  src/components/Button.test.jsx
   ● Button › renders correctly
   
ACTION: Fix the failing test
```

**Rules:**
- [ ] All tests must pass
- [ ] Cannot skip tests with `xdescribe` or `xit`
- [ ] Cannot use `.only` to skip tests
- [ ] Cannot comment out failing tests
- [ ] Cannot lower coverage thresholds

---

### Step 5: Integration Tests (if applicable)
**Command:** `npm run test:integration` (if configured)

**What it does:**
- Tests component interaction
- Tests API integration
- Tests user workflows
- Tests form submissions

**Rules:**
- [ ] Must pass completely
- [ ] Cannot skip integration tests

---

## Backend Build Pipeline (NestJS)

### Step 1: Linting
**Command:** `npm run lint`

**Expected output:**
```
✓ No ESLint errors
```

**Rules:** Same as frontend

---

### Step 2: Type Check
**Command:** Built into build or `npm run build`

**What it does:**
- TypeScript compilation
- Type checking
- Interface validation

**Expected output:**
```
✓ Successfully compiled
```

---

### Step 3: Build
**Command:** `npm run build`

**What it does:**
- Compiles TypeScript to JavaScript
- Creates dist/ folder
- Generates source maps

**Expected output:**
```
✓ Build complete
dist/ folder ready
```

---

### Step 4: Tests
**Command:** `npm run test` or `npm test`

**What it does:**
- Runs unit tests
- Tests services
- Tests controllers
- Tests guards and interceptors

**Expected output:**
```
Test Suites: X passed, X total
Tests:       X passed, X total
```

---

### Step 5: E2E Tests (if applicable)
**Command:** `npm run test:e2e`

**What it does:**
- Tests API endpoints
- Tests complete workflows
- Tests database integration

---

## Success Criteria

### ✅ BUILD SUCCESS

Change is ready when:

```
✓ npm run lint        PASS
✓ npm run build       PASS (Compiled successfully)
✓ npm run test        PASS (All tests pass)
✓ npm run test:e2e    PASS (if applicable)
✓ No new warnings     YES
✓ No performance      
  degradation         YES
```

**Report to user:**

```
Build Pipeline: ✅ SUCCESS

Linting:       ✓ All files pass
Build:         ✓ Compiled successfully
Tests:         ✓ 42 tests pass
E2E:           ✓ All workflows pass

Changes verified and ready for deployment.
```

---

### ❌ BUILD FAILURE

If any step fails:

```
1. Show exact error message
2. Show which step failed
3. Explain the error
4. Fix the issue
5. RESTART FROM STEP 1
```

**Report to user:**

```
Build Pipeline: ❌ FAILED

Failed at:     Linting (Step 1)
File:          src/components/Applicants/Applicants.jsx
Error:         Line 10: unused variable 'selectedApplicant'

Fixing now...

After fix: Rerunning full pipeline...
[Running npm run lint...]
```

---

## Rules for AI During Build

### 🟢 GREEN Light Rules

**These are safe:**

- [ ] Run `npm run lint`
- [ ] Run `npm run build`
- [ ] Run `npm run test -- --run`
- [ ] Show build output
- [ ] Report success/failure

---

### 🟡 YELLOW Light Rules

**Ask before doing:**

- [ ] Modify test configuration
- [ ] Change build scripts
- [ ] Modify webpack config
- [ ] Change tsconfig

---

### 🔴 RED Light Rules

**Never do:**

- [ ] Skip linting
- [ ] Disable ESLint rules
- [ ] Skip tests
- [ ] Add `@ts-ignore`
- [ ] Add `// eslint-disable`
- [ ] Downgrade packages
- [ ] Modify lock files
- [ ] Change node version

---

## Build Failure Workflow

**When build fails, follow this sequence:**

```
1. Read Error Message
   ↓
2. Identify Which Step Failed
   ↓
3. Extract Error Details
   ↓
4. Diagnose Root Cause
   ↓
5. Fix Issue (one at a time)
   ↓
6. Restart Pipeline From Step 1
   ↓
7. Show New Error (if any)
   ↓
8. Repeat Until Success
```

**Example:**

```
Build Failed - Step 1 (Linting)

Error:
[eslint] src/components/Applicants/Applicants.jsx
Line 10: 'selectedApplicant' is assigned but never used

Fixing...
- Removing unused useState hook
- Removing unused setState call

Rerunning pipeline:
npm run lint     ✓ PASS
npm run build    ✓ PASS
npm run test     ✓ PASS

SUCCESS: Build complete
```

---

## Build Performance

### Expected Build Times

**Frontend (React):**
- Linting: < 30 seconds
- Build: < 2 minutes
- Tests: < 1 minute
- Total: < 4 minutes

**Backend (NestJS):**
- Linting: < 20 seconds
- Build: < 1 minute
- Tests: < 1 minute
- Total: < 3 minutes

**If build takes longer:**
- Check for cache issues: `npm ci`
- Check for hanging processes
- Check disk space
- Report to user

---

## Build Caching

**How to handle cache:**

```
If build seems stuck:

1. Clear cache:
   npm run clean (if available)
   rm -rf node_modules build
   npm ci

2. Rebuild:
   npm run build

3. If still slow:
   Report to user with times
```

---

## Continuous Integration Checklist

Before declaring change done:

- [ ] Linting passes
- [ ] TypeScript compiles
- [ ] Build succeeds
- [ ] All tests pass
- [ ] E2E tests pass (if applicable)
- [ ] No new warnings
- [ ] No performance regression
- [ ] Output shown to user
- [ ] Time recorded in CHANGELOG_AI.md

---

## Build Documentation

### Frontend Build Structure

```
web/dashboard/
├── public/              (Static files)
├── src/                 (Source code)
├── build/               (Output after npm run build)
│   ├── static/
│   │   ├── js/         (Minified JS)
│   │   ├── css/        (Minified CSS)
│   │   └── media/      (Images, fonts)
│   └── index.html
├── package.json
└── .env                (Environment variables)
```

---

### Backend Build Structure

```
backend/
├── src/                 (TypeScript source)
├── dist/                (Output after npm run build)
│   └── **/*.js         (Compiled JavaScript)
├── package.json
└── .env                (Environment variables)
```

---

## Build Troubleshooting

### Common Issues

#### Issue: "npm ERR! code EACCES"

**Cause:** Permission error  
**Fix:**
```
sudo npm ci
or
npm config set unsafe-perm true
```

---

#### Issue: "npm ERR! Out of memory"

**Cause:** Not enough RAM  
**Fix:**
```
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

#### Issue: Build hangs at "Creating optimized production build..."

**Cause:** Build process stuck  
**Fix:**
```
Kill process (Ctrl+C)
npm ci (clean install)
npm run build again
```

---

#### Issue: "Module not found"

**Cause:** Missing dependency  
**Fix:**
```
npm ci (reinstall all)
npm run build
```

---

## Build Reporting Format

Always report build status in this format:

```
BUILD REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status:            [✓ SUCCESS | ✗ FAILED]
Module:            [Frontend | Backend]
Step:              [Linting | Build | Test | etc]
Duration:          [X minutes]

Results:
  Linting:         [✓ PASS | ✗ FAIL]
  Build:           [✓ PASS | ✗ FAIL]
  Tests:           [✓ PASS | ✗ FAIL]
  E2E:             [✓ PASS | ✗ FAIL]

Error (if any):
  File:            [path/to/file]
  Line:            [number]
  Message:         [error message]

Output:
[Relevant build log section]

Action Taken:
[What was fixed]

Next Steps:
[What happens next]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

---

## 🛑 Stop on First Failure: Enforcement Rules

### The Core Principle

```
ONE FAILURE = STOP IMMEDIATELY

Do not layer errors.
Do not continue building.
Do not hope next step passes.

STOP. FIX. RESTART.
```

### When to Stop (Mandatory)

Stop immediately if:

- [ ] Linting reports ANY error
- [ ] TypeScript compilation fails
- [ ] Build fails to compile
- [ ] ANY test fails (unit, integration, E2E)
- [ ] New warning appears
- [ ] Unexpected error occurs
- [ ] Build behavior changes

**No exceptions. No "I'll fix it later."**

### Correct Sequence

```
Make change
    ↓
npm run lint
    ├─ ❌ FAIL → FIX → Restart from beginning
    └─ ✅ PASS → Continue
    ↓
npm run build
    ├─ ❌ FAIL → FIX → Restart from beginning
    └─ ✅ PASS → Continue
    ↓
npm run test
    ├─ ❌ FAIL → FIX → Restart from beginning
    └─ ✅ PASS → Done
```

### Example: Progressive Failures

```
WRONG (stacking errors):

npm run lint
❌ Error at line 10

npm run build (ignoring lint error)
❌ Error at line 25
❌ Error at line 40

npm run test (ignoring build errors)
❌ 5 tests fail

Result: 8+ errors to diagnose
        Very confusing
        Hard to find root cause

CORRECT (stop on first):

npm run lint
❌ Error at line 10
→ STOP
→ Fix error at line 10
→ npm run lint again
✅ PASS

npm run build
✅ PASS

npm run test
✅ PASS

Result: Fixed one error at a time
        Clear progression
        Easy to understand each step
```

### During Development

**Before committing:**

```
Make change → npm run lint → npm run build → npm run test

If ANY fails at ANY point:
1. STOP immediately
2. Do not proceed to next command
3. Fix the failing step
4. Restart the sequence from beginning
5. Do not skip to next step
```

### Prevention: Pre-Commit Checklist

Before running build:

- [ ] Have I changed ONLY what's needed?
- [ ] Have I read my changes?
- [ ] Do my changes look correct?
- [ ] Am I ready for any errors?

### During Build Failures

- [ ] Did I stop at the FIRST error?
- [ ] Did I read the error message?
- [ ] Did I understand it?
- [ ] Am I fixing the root cause?
- [ ] Will I restart from Step 1?

### Integration with ROLLBACK_POLICY.md

```
If you cannot fix the error:

1. Try a simple fix
2. If that doesn't work
3. See ROLLBACK_POLICY.md
4. Revert the change
5. Start over with better approach
```

---

## Final Rule

```
NO BUILD STEP EXCEPTION.

STOP ON FIRST FAILURE.

If any step of the pipeline fails:
  ✗ DO NOT proceed to next step
  ✗ DO NOT skip the failing step
  ✗ DO NOT hope it fixes itself

FIX THE ISSUE AND RESTART FROM BEGINNING.

The build pipeline is sacred.
It is the final verification that code is correct.

One failure = Complete halt.
No exceptions.
No shortcuts.
```
