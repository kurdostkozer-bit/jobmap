# DEBUG.md: Debugging Best Practices

A step-by-step guide for AI to debug issues systematically without guessing or scope creep.

---

## The Debugging Workflow

**Follow this exact sequence. Do not skip steps.**

```
┌─────────────────────┐
│ 1. IDENTIFY PROBLEM │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 2. ROOT CAUSE PROOF │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 3. SHOW EVIDENCE    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 4. LIST AFFECTED    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 5. PROPOSE FIX      │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 6. MODIFY CODE      │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 7. RUN TESTS        │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 8. VERIFY RESULT    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ 9. STOP (CRITICAL)  │
└─────────────────────┘

DO NOT CONTINUE FIXING OTHER ISSUES.
```

---

## Step 1: Identify Problem

**What to do:**
- Read the error message completely
- Note exact location (file:line)
- Note error type (ESLint, TypeScript, Runtime, etc.)
- Note when it occurs (build, runtime, test, etc.)

**Example:**
```
Error in: npm run build
File: src/components/Applicants/Applicants.jsx
Line: 10
Type: ESLint (unused variable)
Message: 'selectedApplicant' is assigned a value but never used
```

**Deliverable to user:**
```
I found the issue:

Location: src/components/Applicants/Applicants.jsx:10
Type: ESLint validation error
Problem: Unused variable 'selectedApplicant'
```

---

## Step 2: Prove Root Cause

**What to do:**
- Understand WHY the error exists
- Quote the error message
- Show the code causing it
- Explain the logic

**Example:**
```
Root Cause Explanation:

Line 10: const [selectedApplicant, setSelectedApplicant] = useState(null);

This variable is declared but:
- Never read in any render
- Never passed as prop
- Only written to (never read)
- ESLint detects dead code

Declaration: ✓ exists
Usage: ✗ missing
```

**Deliverable to user:**
```
Line 10 declares selectedApplicant but it's never used.
It's set on line 207 but never read anywhere.
This is dead code that ESLint correctly flags.
```

**Do NOT say:**
```
❌ "Maybe it's a React issue"
❌ "Could be a build problem"
❌ "Might need to upgrade"

Only state what you can PROVE.
```

---

## Step 3: Show Evidence

**What to do:**
- Quote exact code sections
- Show line numbers
- Highlight the problem
- Reference the error message

**Example:**
```
Declaration (line 10):
const [selectedApplicant, setSelectedApplicant] = useState(null);

Usage in onClick (line 207):
onClick={() => setSelectedApplicant(applicant)}

Reading in render: [NOT FOUND]

Conclusion: Variable is set but never read → ESLint error
```

**Deliverable to user:**

Show the exact problematic code with line numbers and explain why it's a problem.

---

## Step 4: List Affected Files

**What to do:**
- List all files that need modification
- Show exact lines that will change
- Explain why each file needs change
- Calculate total changes

**Example:**
```
Files to Modify: 1

File: src/components/Applicants/Applicants.jsx
  Lines to remove:
    - Line 10: useState declaration
    - Line 207: setSelectedApplicant call
  Total changes: 2 lines
```

**Never say:**
```
❌ "I'll need to modify several files"

Always be specific:
✅ "I'll modify 1 file (Applicants.jsx), removing 2 lines"
```

---

## Step 5: Propose Fix

**What to do:**
- Explain your proposed solution
- Why this solves the problem
- Why it's safe
- Alternative options (if any)

**Example:**
```
Proposed Solution:

Remove the unused useState hook for selectedApplicant.

Why this works:
- Eliminates the dead code
- ESLint error disappears
- No functional change to component

Is it safe?
- selectedApplicant is never read
- setSelectedApplicant is only called but value never used
- ApplicantModal component handles detail views separately
- No other files depend on this state

Risk Assessment: ZERO
```

**Always ask:**
```
Should I proceed with this fix?
```

**Do NOT proceed without approval.**

---

## Step 6: Modify Code

**What to do:**
- Make ONLY the changes you proposed
- Do not add anything extra
- Do not refactor
- Do not improve unrelated code

**Example:**

Change FROM:
```jsx
const [applicants, setApplicants] = useState([]);
const [filteredApplicants, setFilteredApplicants] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('all');
const [currentPage, setCurrentPage] = useState(1);
const [selectedApplicant, setSelectedApplicant] = useState(null);  // ← REMOVE THIS
const [itemsPerPage] = useState(10);
```

Change TO:
```jsx
const [applicants, setApplicants] = useState([]);
const [filteredApplicants, setFilteredApplicants] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('all');
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10);
```

Also remove the onClick that calls setSelectedApplicant.

**Rule:** Only change what's necessary. Nothing more.

---

## Step 7: Run Tests

**What to do:**
- Run linting: `npm run lint`
- Run build: `npm run build`
- Run tests: `npm run test` (if applicable)
- Stop if any fails

**Example:**
```
npm run lint
→ No errors ✓

npm run build
→ Compiled successfully ✓

npm run test
→ All tests pass ✓
```

**If test fails:**
- Show the failure message
- Ask user what to do
- Do NOT continue automatically

---

## Step 8: Verify Result

**What to do:**
- Confirm the error is gone
- Confirm no new errors appeared
- Show the build output
- Declare success

**Example:**
```
Result:

✅ ESLint error resolved
   src/components/Applicants/Applicants.jsx:10 - FIXED

✅ Build succeeds
   Compiled successfully
   File sizes: main.js (274.1 kB), main.css (15.29 kB)

✅ No new errors introduced
```

---

## Step 9: STOP (CRITICAL!)

**What to do:**
- **DO NOT continue fixing other issues**
- **DO NOT look for related problems**
- **DO NOT refactor code**
- **DO NOT optimize**
- **DO NOT update documentation**

**Say:**
```
Fix complete. Build successful.

Issue: src/components/Applicants/Applicants.jsx:10 - FIXED
Modified: 1 file, 2 lines removed
Verified: npm run lint ✓, npm run build ✓

The requested issue is resolved.
```

**Do NOT say:**
```
❌ "Now let me check MapHomePage for similar issues..."
❌ "While I'm at it, let me optimize the component..."
❌ "Should I update the documentation?"

Only fix what was asked. Nothing more.
```

---

## Common Mistakes

### ❌ Mistake 1: Continuing After the Fix

```
Bad Workflow:
1. Fix Applicants.jsx
2. Build succeeds
3. "Now let me check other components..."
4. Modify 3 more files
5. Break something
```

```
Good Workflow:
1. Fix Applicants.jsx
2. Build succeeds
3. STOP - Report success
```

---

### ❌ Mistake 2: Guessing Root Cause

```
Bad:
Build fails → "Maybe Node version" → Upgrade Node → Wastes time

Good:
Build fails → Read error → "ESLint error in line 10" → Fix line 10
```

---

### ❌ Mistake 3: Modifying Extra Files

```
Bad:
Fix Applicants.jsx AND:
  - Refactor ApplicantModal
  - Optimize JobListings
  - Update CSS
  Result: Multiple changes, higher risk

Good:
Fix Applicants.jsx only
  Result: Single change, low risk
```

---

### ❌ Mistake 4: Not Running Tests

```
Bad:
Fix code → Say it's done → Tests fail later

Good:
Fix code → Run tests → Show results → Say it's done
```

---

### ❌ Mistake 5: Fixing Related Issues

```
Bad:
Fix Applicants.jsx error
See MapHomePage has similar error
Fix MapHomePage too
  Result: Scope creep

Good:
Fix Applicants.jsx error
See MapHomePage has similar error
Report: "Found another error in MapHomePage"
Wait for approval
```

---

## The Debugging Checklist

Before saying "fixed", verify:

### Evidence Phase
- [ ] Error message is clear
- [ ] File path is exact
- [ ] Line number is noted
- [ ] Error type is identified

### Analysis Phase
- [ ] Root cause is understood
- [ ] Evidence is quoted
- [ ] Explanation is clear
- [ ] No guessing involved

### Planning Phase
- [ ] Affected files listed
- [ ] Lines to change noted
- [ ] Fix is minimal
- [ ] No refactoring involved

### Modification Phase
- [ ] Only proposed changes made
- [ ] No extra code added
- [ ] No refactoring done
- [ ] Code unchanged elsewhere

### Verification Phase
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Tests pass (if applicable)
- [ ] Error is gone
- [ ] No new errors

### Completion Phase
- [ ] Success reported to user
- [ ] Changes documented
- [ ] No additional fixes attempted
- [ ] STOPPED (did not continue)

---

## When to Stop and Ask

Stop debugging if:

- [ ] Multiple issues found (ask which to fix first)
- [ ] Root cause is unclear (ask for clarification)
- [ ] Fix affects multiple modules (ask for approval)
- [ ] Trade-off exists (ask user preference)
- [ ] Test fails (ask what to do)
- [ ] New error appears (ask if this is expected)

**Example:**

```
I fixed the first error, but now I see:
- MapHomePage has a similar issue
- NotificationCenter has a warning
- ApplicantModal has a type error

Which should I fix next?
```

---

## Remember: One Bug = One Fix

```
Single Issue Workflow:

✓ Identify problem
✓ Find root cause
✓ List affected files
✓ Propose solution
✓ Make minimal change
✓ Run tests
✓ Verify success
✓ STOP

Do not continue to next issue automatically.
Wait for next request.
```

This keeps changes atomic, testable, and reversible.
