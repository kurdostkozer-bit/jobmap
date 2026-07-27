# WORKFLOW.md: Complete AI Development Workflow

End-to-end workflow from issue reporting to commit, integrating all governance policies.

**This is the master workflow that ties everything together.**

---

## The Complete Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 0: ISSUE REPORTED                                         │
│ User: "Build is failing" OR "Feature needed" OR "Bug found"    │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: DIAGNOSE MODE (ACCESS_LEVELS.md)                      │
│ ✓ Read code                                                      │
│ ✓ Run tests                                                      │
│ ✓ Find root cause                                                │
│ ✗ Modify code                                                    │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: REVIEW MODE (ACCESS_LEVELS.md)                        │
│ ✓ Show findings                                                  │
│ ✓ Propose solution                                               │
│ ✓ Risk assessment (RISK_ASSESSMENT.md)                          │
│ ✗ Modify code                                                    │
│ → Ask for approval                                               │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
          ┌──────────────────────┐
          │ User approves?       │
          │ YES / NO / ASK TEAM  │
          └──────────┬───────────┘
                     ↓
         ┌─────────────────────────┐
         │ If approved:            │
         │ Continue to FIX mode    │
         │                         │
         │ If not approved:        │
         │ Back to DIAGNOSE mode   │
         └──────────┬──────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: FIX MODE (ACCESS_LEVELS.md)                           │
│ ✓ Read code completely (RULES.md #15)                           │
│ ✓ Make minimal changes                                           │
│ ✓ Run BUILD_RULES.md pipeline                                   │
│   → npm run lint (stop on failure)                               │
│   → npm run build (stop on failure)                              │
│   → npm run test (stop on failure)                               │
│ ✓ If fails: ROLLBACK_POLICY.md                                  │
│ ✗ If succeeds: Continue                                         │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: COMMIT & LOG                                           │
│ ✓ Write clear commit message                                    │
│ ✓ Log in CHANGELOG_AI.md                                        │
│ ✓ Include risk assessment                                       │
│ ✓ Push to branch                                                │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 5: DONE                                                   │
│ ✓ Issue resolved                                                │
│ ✓ Code committed                                                │
│ ✓ Changes logged                                                │
│ ✗ Do NOT continue to next issue                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 0: Issue Reported

**What happens:**
- User reports a problem
- User gives context (or AI asks for it)
- AI is ready to investigate

**Example inputs:**
```
"Build is failing"
"Fix the MapHomePage error"
"Applicants component has unused variable"
"Add authentication"
```

**AI Response:**
```
Issue received: [Description]

I'll now enter DIAGNOSE mode to investigate.
```

---

## Phase 1: DIAGNOSE Mode

**Reference:** `ACCESS_LEVELS.md` → DIAGNOSE Mode

**What AI can do:**
```
✓ Read files
✓ Run tests
✓ Run build
✓ Run linting
✓ Ask questions
✓ Report findings
```

**What AI cannot do:**
```
✗ Modify code
✗ Create files
✗ Delete files
✗ Assume the cause
```

### Step 1: Gather Evidence

```
1. Ask user for context
   "When did this start?"
   "What's the error message?"

2. Run diagnostic commands
   npm run build
   npm run lint
   npm run test (if applicable)

3. Read relevant files
   (Follow code to understand problem)

4. Collect evidence
   - Exact error message
   - File path and line number
   - Stack trace (if available)
   - Related code
```

### Step 2: Analyze Root Cause

```
1. Understand what failed
   "Why is this error happening?"

2. Trace the cause
   Follow imports, check types, understand logic

3. Identify impact
   "What depends on this?"
   "How many files are affected?"

4. Assess severity
   "Is this blocking?"
   "How many users impacted?"
```

### Step 3: Report Findings

**Format:**

```
ROOT CAUSE FOUND: [Title]

Location:
- File: [path/to/file.jsx]
- Line: [N]
- Type: [ESLint | TypeScript | Runtime | etc]

Evidence:
[Exact error message quoted]

Analysis:
[Why this is happening]

Impact:
- Scope: [1 file | multiple files | multiple modules]
- Severity: [Low | Medium | High]
- Breaking: [Yes | No | Potential]

Files affected:
- file1.jsx
- file2.ts

Ready to proceed?
```

**Example:**

```
ROOT CAUSE FOUND: Unused Variable

Location:
- File: src/components/Applicants/Applicants.jsx
- Line: 10
- Type: ESLint error

Evidence:
"[eslint] src/components/Applicants/Applicants.jsx
 Line 10: 'selectedApplicant' is assigned a value but never used"

Analysis:
Line 10 declares selectedApplicant with useState hook.
Line 207 sets it with setSelectedApplicant(applicant).
But it's never read anywhere in the component.
ESLint correctly identifies this as dead code.

Impact:
- Scope: 1 component
- Severity: Low (blocking compilation, not functionality)
- Breaking: No

Files affected:
- src/components/Applicants/Applicants.jsx (1 file only)

Ready to proceed to analysis?
```

**Transition:**
```
Findings complete. Ready to show you the fix proposal?
```

---

## Phase 2: REVIEW Mode

**Reference:** `ACCESS_LEVELS.md` → REVIEW Mode, `RISK_ASSESSMENT.md`

**What AI does:**
```
1. Analyze impact
2. Propose solution
3. Show before/after code
4. Assess risk
5. Ask for approval
```

### Step 1: Detailed Analysis

```
"Here's what I understand:

Problem: [Description]
Root cause: [Why it happens]
Impact: [What changes]
Scope: [Files affected]"
```

### Step 2: Propose Solution

```
"Here's my proposed fix:

BEFORE:
[Code snippet showing problem]

AFTER:
[Code snippet showing solution]

Why this works:
[Explanation]

Why it's safe:
[Safety analysis]"
```

### Step 3: Risk Assessment

**Reference:** `RISK_ASSESSMENT.md`

```
RISK ASSESSMENT: 🟢 LOW

Files affected: 1
Functions affected: 0
Dependencies: None
Breaking changes: No
Rollback: Easy (< 5 minutes)

Risk score: 3 points → LOW RISK

Approval needed: Standard
```

### Step 4: Request Approval

```
"This change is safe and isolated.

Should I proceed with the fix?"

Possible responses:
- "Yes" → Move to FIX mode
- "No" → Back to DIAGNOSE mode
- "Ask team" → Escalate for approval
```

**Transition to FIX mode:**
```
User: "Yes, proceed"

AI: "Entering FIX mode now..."
```

---

## Phase 3: FIX Mode

**Reference:** `ACCESS_LEVELS.md` → FIX Mode, `RULES.md` #15, `BUILD_RULES.md`

**Critical Rule:** Read code completely before modifying

### Step 1: Read Code Completely

**Before making ANY change:**

```
Read the ENTIRE file:
✓ Read function declarations
✓ Read imports
✓ Read state management
✓ Read all usages
✓ Understand the flow

Do NOT assume. Read completely.
```

### Step 2: Modify Minimal Code

```
Make EXACTLY the changes discussed in REVIEW phase:
✓ Only approved files
✓ Only approved lines
✓ Minimal scope
✓ No extra improvements
✗ Do not refactor
✗ Do not optimize
✗ Do not add features
```

**Example:**

```
APPROVED: Remove selectedApplicant variable

File: src/components/Applicants/Applicants.jsx
- Remove line 10
- Remove line 207

Making changes...
✓ Line 10 removed
✓ Line 207 removed

Done.
```

### Step 3: Run Build Pipeline

**Reference:** `BUILD_RULES.md` → Stop on First Failure

```
Step 1: npm run lint
        Output: ✓ PASS
        
Step 2: npm run build
        Output: ✓ PASS
        
Step 3: npm run test
        Output: ✓ PASS

All steps passed!
```

### Step 4: Handle Failures

**If build fails:**

**Reference:** `ROLLBACK_POLICY.md`

```
❌ Build failure detected

npm run lint

[eslint] src/file.jsx:10
Error message...

IMMEDIATELY REVERTING:
git checkout -- src/components/Applicants/Applicants.jsx

Verifying revert:
npm run lint → ✓ PASS
npm run build → ✓ PASS

Revert successful. Previous state restored.

Would you like to:
1. Try different approach?
2. Debug more?
3. Escalate to team lead?
```

---

## Phase 4: Commit & Log

**After all tests pass:**

### Step 1: Write Commit Message

```
Format:
Fix/Feature: [Brief description]

[Optional detailed explanation]

Related to: [Issue/ADR if applicable]
```

**Example:**

```
Fix: Remove unused selectedApplicant variable causing ESLint error

Removed unused useState hook and setter that were causing
ESLint "assigned but never used" error in production build.

- Removed line 10: selectedApplicant useState declaration
- Removed line 207: setSelectedApplicant callback

Build: ✓ Pass
Tests: ✓ Pass
```

### Step 2: Log in CHANGELOG_AI.md

**Reference:** `CHANGELOG_AI.md`

```
### 2026-07-27 - Fix ESLint Error in Applicants Component

**AI Assistant:** Kiro

**Status:** ✅ Success

**Change Type:** Bug Fix

**Files Modified:**
- `src/components/Applicants/Applicants.jsx` (lines 10, 207)

**Reason:** 
Production build was failing with ESLint error

**What Changed:**
Removed unused useState hook

**Before:**
const [selectedApplicant, setSelectedApplicant] = useState(null);

**After:**
// Removed - variable was not used

**Testing:**
- [x] Linting passed
- [x] Build passed
- [x] Tests passed

**Violations:** None

**Notes:** Issue resolved successfully
```

### Step 3: Commit

```
git add [files]
git commit -m "Fix: Remove unused selectedApplicant variable"

Output:
[commit abc123]
 1 file changed
 2 lines removed
```

### Step 4: Push

```
git push origin [branch-name]

Output:
Counting objects: 3, done.
Compressing objects: 100% (1/1), done.
Writing objects: 100% (3/3), done.
```

---

## Phase 5: Done

**After successful commit:**

```
✅ ISSUE RESOLVED

Change: [Description]
Status: Committed and pushed
Files: [count] file(s)
Tests: ✓ All pass
Build: ✓ Success

Logged in: CHANGELOG_AI.md

Ready for code review.

STOPPING NOW - No further modifications.
```

**Important:** Do NOT continue to next issue automatically.

---

## Real-World Example: Complete Workflow

### Issue: "Build failing with ESLint error"

---

### PHASE 1: DIAGNOSE

```
USER: "Build is failing"

AI: "Let me investigate...

Running: npm run build

Output:
Failed to compile.
[eslint] src/components/Applicants/Applicants.jsx
Line 10: 'selectedApplicant' is assigned a value but never used

Found the issue!

File: src/components/Applicants/Applicants.jsx:10
Type: ESLint error
Problem: Unused variable

Root cause analysis:
Line 10: const [selectedApplicant, setSelectedApplicant] = useState(null);
Line 207: onClick={() => setSelectedApplicant(applicant)}

Variable is set but never read. Dead code.

Files affected: 1 (Applicants.jsx)
Severity: Low (blocks build, not functionality)
Scope: Isolated to one component

Ready for fix proposal?"
```

---

### PHASE 2: REVIEW

```
AI: "Here's my proposal:

BEFORE:
const [selectedApplicant, setSelectedApplicant] = useState(null);
// ... later in component ...
onClick={() => setSelectedApplicant(applicant)}

AFTER:
[Both lines removed]

Why it's safe:
- selectedApplicant is never read
- Component functionality unchanged
- ApplicantModal handles details view separately
- No dependencies on this state

RISK ASSESSMENT: 🟢 LOW
- Files affected: 1
- Complexity: Minimal
- Rollback: Very easy
- Breaking changes: None

Approve this fix?"

USER: "Yes"

AI: "Entering FIX mode..."
```

---

### PHASE 3: FIX

```
AI: "Reading file completely...

[Reading Applicants.jsx]
- Line 1-9: imports ✓
- Line 10: selectedApplicant useState ← TO REMOVE
- Lines 11-200: other state ✓
- Line 207: setSelectedApplicant callback ← TO REMOVE
- Lines 208-end: rest of component ✓

Modifications:
- Removing line 10 useState declaration
- Removing setSelectedApplicant callback

Making changes...
✓ Line 10 removed
✓ Line 207 removed

Running build pipeline:

Step 1: npm run lint
Output: ✓ No ESLint errors

Step 2: npm run build
Output: ✓ Compiled successfully

Step 3: npm run test
Output: ✓ All tests pass

SUCCESS! All checks passed."
```

---

### PHASE 4: COMMIT & LOG

```
AI: "Committing changes...

Commit message:
Fix: Remove unused selectedApplicant variable causing ESLint error

Logging in CHANGELOG_AI.md:
✓ Added entry with:
  - Change type: Bug Fix
  - Files: 1 (Applicants.jsx)
  - Testing results: All pass
  - Risk level: 🟢 LOW
  - Status: ✅ Success

Pushing to branch...
✓ Committed successfully

ISSUE RESOLVED

Summary:
- ESLint error: FIXED ✓
- Build: PASSING ✓
- Tests: ALL PASS ✓
- Code: COMMITTED ✓

Ready for code review and merge."
```

---

## Integration with Other Policies

This workflow uses:

- **ACCESS_LEVELS.md** → Mode transitions (DIAGNOSE → REVIEW → FIX)
- **DIAGNOSE_FIRST.md** → Diagnosis process
- **DEBUG.md** → Debugging sequence
- **SAFE_EDIT_POLICY.md** → What can be modified
- **FILE_OWNERS.md** → Which files can be edited
- **BUILD_RULES.md** → Build pipeline (stop on first failure)
- **RISK_ASSESSMENT.md** → Risk evaluation
- **ROLLBACK_POLICY.md** → Reverting on failure
- **TESTING.md** → Testing requirements
- **CHANGELOG_AI.md** → Logging changes
- **ARCHITECTURE.md** → Tech constraints

**All these policies work together in this workflow.**

---

## Workflow Checklist

Before starting work:

- [ ] Read WORKFLOW.md
- [ ] Understand current phase
- [ ] Check permissions for this phase
- [ ] Follow the sequence
- [ ] Don't skip phases
- [ ] Get approvals needed
- [ ] Stop when complete

During work:

- [ ] Follow phase rules
- [ ] Read code completely (FIX phase)
- [ ] Run full build pipeline
- [ ] Handle failures with rollback
- [ ] Log everything

After completion:

- [ ] Commit with clear message
- [ ] Log in CHANGELOG_AI.md
- [ ] Push to branch
- [ ] STOP (do not continue)
- [ ] Report done

---

## Workflow Violations

If AI violates workflow:

```
❌ Jumped to FIX mode without DIAGNOSE
❌ Modified code without approval
❌ Continued after test failure
❌ Skipped rollback when needed
❌ Continued to next issue after fix

Consequences:
- Changes will be rejected
- Code review will fail
- Must be redone properly
- Logged as violation in CHANGELOG_AI.md
```

---

## Remember

```
This workflow is not restrictive.
It's protective.

It ensures:
✓ Problems are understood before fixing
✓ Solutions are safe before implementing
✓ Code is tested before committing
✓ Changes are tracked
✓ Mistakes are caught early

Follow the workflow.
Trust the process.
Success will follow.

DIAGNOSE → REVIEW → FIX → COMMIT → DONE.

Not complex. Just disciplined.
```
