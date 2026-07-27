# DIAGNOSE FIRST: The Golden Rule

**AI MUST NEVER GUESS. DIAGNOSIS BEFORE MODIFICATION.**

This is the most critical rule in the entire AI Governance framework.

---

## The Problem With Guessing

When AI modifies code without diagnosis:

```
❌ WRONG WORKFLOW

User: "Build is failing"
     ↓
AI guesses: "Maybe it's Node version"
     ↓
AI upgrades Node
     ↓
Wastes 2 hours
     ↓
Real problem: unused variable in ESLint
```

---

## The Right Workflow

```
✅ CORRECT WORKFLOW

User: "Build is failing"
     ↓
AI: Collect Evidence
     ↓
AI: Show Errors (exact messages)
     ↓
AI: Explain Root Cause (with proof)
     ↓
AI: Ask Permission (propose fix)
     ↓
AI: Modify Code (minimal change)
     ↓
AI: Verify (run build/tests)
```

---

## Mandatory Diagnostic Steps

### Step 1: Collect Evidence
**Before doing anything, gather facts:**

- [ ] Read error messages **completely**
- [ ] Note exact file paths
- [ ] Note exact line numbers
- [ ] Note exact error type (ESLint, TypeScript, Runtime, etc.)
- [ ] Show build logs to user
- [ ] Ask: "What was the last change?"

❌ **Wrong**: "Build is failing, I'll upgrade React"  
✅ **Right**: Read the build output first

---

### Step 2: Explain Root Cause
**Prove what's wrong:**

- [ ] State the problem clearly
- [ ] Quote the error message
- [ ] Show affected file and line
- [ ] Explain why it's happening
- [ ] Never proceed without 100% certainty

Example:
```
Root Cause Found:

File: src/components/Applicants/Applicants.jsx
Line: 10
Error: 'selectedApplicant' is assigned a value but never used
Reason: Variable is declared with useState but never referenced in render
```

❌ **Wrong**: "I think the issue is in the build system"  
✅ **Right**: Quote exact error and prove it

---

### Step 3: Show Affected Files
**List exactly what needs changing:**

- [ ] Which files will be modified?
- [ ] Which lines will change?
- [ ] Show before/after snippets
- [ ] Explain why each change is necessary

Example:
```
Files to Modify:
1. src/components/Applicants/Applicants.jsx
   - Line 10: Remove unused selectedApplicant declaration
   - Line 207: Remove setSelectedApplicant callback

Changes: 2 lines affected
```

❌ **Wrong**: Start changing code immediately  
✅ **Right**: Show the plan first

---

### Step 4: Propose Fix (Ask Permission)
**Before modifying, present the solution:**

- [ ] Explain your proposed fix
- [ ] Why this fix solves the problem
- [ ] Confirm it won't break anything else
- [ ] Wait for approval (or explicit permission)

Example:
```
Proposed Fix:

Remove the unused useState hook for selectedApplicant.
This is safe because:
- selectedApplicant is never read
- setSelectedApplicant is only set but never used
- ApplicantModal component handles details separately
- No other component depends on this state

Risk: None
Alternative: Keep it commented out (not recommended - violates ESLint rules)
```

---

### Step 5: Modify Code (Minimal)
**Only after approval:**

- [ ] Modify only what was diagnosed
- [ ] Do not add anything extra
- [ ] Do not refactor while fixing
- [ ] Change only the lines specified

---

### Step 6: Verify Fix
**After modification:**

- [ ] Run `npm run lint`
- [ ] Run `npm run build`
- [ ] Run relevant tests
- [ ] Show output to user
- [ ] Confirm no new errors

---

## The Diagnostic Checklist

Before **EVER** touching code, answer these:

### Evidence Collection
- [ ] What is the exact error message?
- [ ] What file and line number?
- [ ] Is this a new error or existing?
- [ ] Did the user report this or did I find it?
- [ ] What changed before this error appeared?

### Root Cause Analysis
- [ ] Have I identified the root cause?
- [ ] Can I explain it in one sentence?
- [ ] Do I have proof from error messages?
- [ ] Could it be caused by something else?
- [ ] Have I ruled out other possibilities?

### Solution Planning
- [ ] What exactly needs to change?
- [ ] How many files need modification?
- [ ] What are the exact lines?
- [ ] Will this break anything?
- [ ] Is there a safer alternative?

### Decision Gate
- [ ] Am I 100% certain of the fix?
- [ ] Have I shown the plan to the user?
- [ ] Did the user approve?
- [ ] Can I explain the fix clearly?

**If ANY checkbox is unchecked, STOP and ask questions.**

---

## Real World Example: Build Failing

### ❌ WRONG APPROACH

```
User: "Build is failing"

AI Response:
"I see. This could be Node version, webpack config, 
React version, or build cache. Let me try upgrading 
Node to 24 and clear cache..."

Result: 2 hours wasted, real problem still there
```

---

### ✅ CORRECT APPROACH

```
User: "Build is failing"

AI Response:
"Let me check the build output. Running npm run build now..."

[Output shows]
"Failed to compile.
[eslint] src/components/Applicants/Applicants.jsx
Line 10: 'selectedApplicant' is assigned a value but never used"

AI Analysis:
"Found it! The issue is:
- File: src/components/Applicants/Applicants.jsx
- Problem: Unused variable 'selectedApplicant' declared on line 10
- Cause: Variable is created but never used in the component
- Fix: Remove the unused useState hook and the setter call

This is NOT a build system issue, Node issue, or webpack issue.
It's an ESLint validation error preventing compilation.

Should I remove these unused lines?"

User: "Yes"

AI: [Makes minimal change] [Runs build] ✅ Success
```

---

## Red Flags (Stop Immediately)

If you encounter these, **STOP and ask questions**:

🚩 **"I'm not sure what the error is"**  
→ Stop. Don't guess. Read the full error.

🚩 **"This might be caused by multiple things"**  
→ Stop. Diagnose which one it actually is.

🚩 **"Let me try upgrading something"**  
→ Stop. Did you diagnose first?

🚩 **"Maybe if I refactor this..."**  
→ Stop. That's not diagnosis, that's guessing.

🚩 **"I'll modify multiple files to be safe"**  
→ Stop. Only modify what's necessary.

---

## When to Ask Questions

**Always ask before modifying if:**

- [ ] Error message is unclear
- [ ] Root cause is uncertain
- [ ] Multiple files need changing
- [ ] Changes affect multiple modules
- [ ] Change has side effects
- [ ] You have multiple options
- [ ] Fix involves dependencies

**Example questions:**

- "Should I remove this or comment it out?"
- "Is this intentionally unused or a bug?"
- "Will removing this affect other components?"
- "Should I fix this differently?"

---

## Golden Rules of Diagnosis

1. **Read, Don't Guess**
   - Read full error messages
   - Collect all evidence first
   - Never assume

2. **Prove Your Case**
   - Quote error messages
   - Show line numbers
   - Reference code sections

3. **Show Your Work**
   - Explain the root cause
   - List affected files
   - Propose minimal fix

4. **Get Permission**
   - Ask before modifying
   - Wait for user confirmation
   - Explain the risk/benefit

5. **Verify Success**
   - Run tests after change
   - Show output to user
   - Confirm fix works

---

## Remember

```
DIAGNOSIS > MODIFICATION

A 5-minute diagnosis saves 2 hours of wrong fixes.

When in doubt, ask the user.

Never modify code when you're unsure.

The slowest fix is the one that's wrong.
```
