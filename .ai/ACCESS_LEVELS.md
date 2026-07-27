# ACCESS_LEVELS.md: AI Assistant Access Modes

Defines what each AI assistant can and cannot do based on the current phase of work.

**Principle:** Progressive access levels prevent premature modifications and enforce systematic workflow.

---

## Access Level System

```
PHASE 1: DIAGNOSE        PHASE 2: REVIEW         PHASE 3: FIX           PHASE 4: REFACTOR
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
│ Read-only mode   │ →  │ Analysis mode    │ →  │ Modification     │ → │ Enhancement      │
│                  │    │                  │    │ mode             │   │ mode             │
│ ✓ Can read       │    │ ✓ Can read       │    │ ✓ Can read       │   │ ✓ Can read       │
│ ✓ Can test       │    │ ✓ Can test       │    │ ✓ Can test       │   │ ✓ Can test       │
│ ✓ Can report     │    │ ✓ Can analyze    │    │ ✓ Can modify     │   │ ✓ Can modify     │
│ ✓ Can ask        │    │ ✓ Can propose    │    │ ✓ Can commit     │   │ ✓ Can commit     │
│ ✗ Cannot modify  │    │ ✗ Cannot modify  │    │ ✗ Limited scope  │   │ ⚠️ Needs approval│
└──────────────────┘    └──────────────────┘    └──────────────────┘   └──────────────────┘
```

---

## Phase 1: DIAGNOSE Mode

**Status:** Read-only investigation phase

**When to use:**
- User reports an issue
- Build is failing
- Tests are failing
- Need to understand the problem

### ✅ ALLOWED in DIAGNOSE

```javascript
✓ Read file content
✓ Read error messages
✓ Run tests (npm run test)
✓ Run build (npm run build)
✓ Run linting (npm run lint)
✓ Check git status
✓ View git history
✓ Run diagnostic commands
✓ Ask clarifying questions
✓ Report findings
✓ Show evidence
✓ Propose solutions
```

### ❌ FORBIDDEN in DIAGNOSE

```javascript
✗ Modify any file
✗ Create new files
✗ Delete files
✗ Rename files
✗ Move files
✗ Install packages
✗ Run destructive commands
✗ Commit changes
✗ Push to repository
✗ Assume the cause (must diagnose)
```

### Workflow in DIAGNOSE

```
1. Read error message
   ↓
2. Identify location
   ↓
3. Read affected file
   ↓
4. Understand root cause
   ↓
5. Report with evidence
   ↓
6. Ask: "Should I fix this?"
   ↓
7. WAIT FOR APPROVAL → Move to FIX mode
```

### Example DIAGNOSE Session

```
User: "Build is failing"

AI in DIAGNOSE mode:
1. Run: npm run build
2. Output: 
   "Failed to compile.
    [eslint] src/components/Applicants/Applicants.jsx
    Line 10: 'selectedApplicant' is assigned but never used"
3. Read: src/components/Applicants/Applicants.jsx
4. Analysis: Variable declared on line 10 but never used
5. Report:
   "Root cause found: Unused variable 'selectedApplicant'
    File: src/components/Applicants/Applicants.jsx:10
    Solution: Remove unused useState hook
    Should I proceed with the fix?"
6. WAIT for user approval
```

---

## Phase 2: REVIEW Mode

**Status:** Analysis and proposal phase

**When to use:**
- After diagnosis confirms the issue
- Before making any modifications
- To review code changes
- To assess impact

### ✅ ALLOWED in REVIEW

```javascript
✓ Read all related files
✓ Analyze code patterns
✓ Trace function calls
✓ Map affected components
✓ Identify dependencies
✓ Propose changes (with code)
✓ Suggest alternatives
✓ Ask for clarification
✓ Request approval
✓ Show before/after code
```

### ❌ FORBIDDEN in REVIEW

```javascript
✗ Modify any file
✗ Run build expecting success (testing only)
✗ Commit code
✗ Proceed without approval
✗ Make assumptions about intent
✗ Skip impact analysis
```

### Workflow in REVIEW

```
1. User approves diagnosis
2. Analyze affected code
3. Show what will change (before/after)
4. Explain why each change is necessary
5. List all files to be modified
6. Assess risk level
7. Propose solution with full context
8. Ask: "Approve this fix?"
9. WAIT FOR APPROVAL → Move to FIX mode
```

### Example REVIEW Session

```
AI in REVIEW mode:

"I've analyzed the issue. Here's what needs to change:

AFFECTED FILE:
src/components/Applicants/Applicants.jsx

BEFORE (Lines 10, 207):
const [selectedApplicant, setSelectedApplicant] = useState(null);
// ... later ...
onClick={() => setSelectedApplicant(applicant)}

AFTER:
// Lines removed - variable not used

IMPACT ANALYSIS:
- Files affected: 1
- Functions affected: 0
- Component behavior: No change
- Risk level: LOW (only removing dead code)
- Rollback: Easy (just add lines back)

TESTING PLAN:
- npm run lint → should pass
- npm run build → should pass
- Component should still work

Approve this fix?"
```

---

## Phase 3: FIX Mode

**Status:** Active modification phase

**When to use:**
- User explicitly approved the fix
- All prerequisites met (diagnosis + review + approval)
- Ready to modify code

### ✅ ALLOWED in FIX

```javascript
✓ Modify only approved files
✓ Make minimal changes
✓ Run build to verify
✓ Run tests to verify
✓ Run linting to verify
✓ Commit changes (with clear message)
✓ Push to branch
✓ Update CHANGELOG_AI.md
✓ Report results
```

### ❌ FORBIDDEN in FIX

```javascript
✗ Modify files not in the plan
✗ Make extra "improvements"
✗ Skip testing
✗ Commit without testing
✗ Continue to next issue
✗ Refactor code
✗ Add new features
✗ Remove tests
✗ Disable linting
```

### Workflow in FIX

```
1. User approves fix
2. Verify all prerequisites ready
3. Read file completely
4. Make minimal changes (EXACTLY as proposed)
5. Run: npm run lint
6. Run: npm run build
7. Run: npm run test
8. Show results to user
9. If all pass: Commit
10. If any fail: Revert immediately
11. Log in CHANGELOG_AI.md
12. STOP (do not continue)
```

### Example FIX Session

```
AI in FIX mode:

✓ User approved the fix
✓ Prerequisites: diagnosis + review + approval

MODIFYING:
src/components/Applicants/Applicants.jsx

Removing line 10:
- const [selectedApplicant, setSelectedApplicant] = useState(null);

Removing line 207:
- onClick={() => setSelectedApplicant(applicant)}

TESTING:
npm run lint
→ ✓ PASS: No errors

npm run build
→ ✓ PASS: Compiled successfully

npm run test
→ ✓ PASS: All tests pass

RESULT: ✅ SUCCESS

COMMITTING:
"Fix: Remove unused selectedApplicant variable causing ESLint error"

LOGGED in CHANGELOG_AI.md: ✓

STOPPING: All done. No further modifications.
```

---

## Phase 4: REFACTOR Mode

**Status:** Enhancement phase (requires explicit approval)

**When to use:**
- Only after explicit user request: "Refactor this"
- All tests passing
- No active bugs
- Clear scope defined

### ✅ ALLOWED in REFACTOR

```javascript
✓ Improve code structure
✓ Extract components
✓ Optimize performance
✓ Clean up code
✓ Update documentation
✓ Improve tests
✓ But ONLY within approved scope
```

### ❌ FORBIDDEN in REFACTOR

```javascript
✗ Without explicit approval
✗ While debugging
✗ While fixing bugs
✗ Cross-module changes
✗ Architectural changes
✗ Dependency updates
✗ Breaking API changes
✗ Without full test suite passing
```

### Requirement for REFACTOR

```
MUST HAVE:

1. Explicit user request
   "Refactor [specific component/file]"

2. Clear scope
   "Only [X, Y, Z]"

3. All tests passing
   npm run test → ✓ PASS

4. No other issues
   No blocking bugs

5. Risk assessment
   Impact: LOW/MEDIUM/HIGH

6. Approval from user
   "Yes, proceed"
```

### Example REFACTOR Session

```
User: "Refactor JobListings component to use hooks"

AI in REFACTOR mode:

✓ Explicit request received
✓ Scope: JobListings component only
✓ Tests: All passing
✓ No blocking issues

RISK ASSESSMENT:
- Complexity: HIGH
- Files affected: 1
- Tests affected: 3
- Rollback difficulty: MEDIUM

PROPOSED CHANGES:
- Convert class component to function component
- Use useState instead of this.state
- Use useEffect instead of lifecycle methods
- Maintain all functionality
- Keep all tests passing

APPROVAL FROM USER: ✓ Yes

PROCEEDING...

[After refactor]
TESTING:
npm run lint → ✓ PASS
npm run build → ✓ PASS
npm run test → ✓ PASS

All original functionality preserved.
Refactor complete.
```

---

## Transitioning Between Modes

### DIAGNOSE → REVIEW

**Triggers:**
- Diagnosis complete
- Root cause identified
- Evidence gathered
- Solution ready to propose

**Requirement:**
- Report findings to user
- Ask for approval to review

**Example:**
```
AI: "I've found the issue and understand what needs to change.
    Can I show you the proposed fix?"

User: "Yes"

[Transition to REVIEW mode]
```

---

### REVIEW → FIX

**Triggers:**
- Review complete
- Solution presented
- User approved

**Requirement:**
- Explicit user approval
- "Yes, proceed" or equivalent

**Example:**
```
AI: "Approve this fix?"

User: "Yes, go ahead"

[Transition to FIX mode]
```

---

### FIX → DONE

**Triggers:**
- All changes complete
- All tests passing
- Everything verified

**Requirement:**
- STOP (do not continue to next issue)
- Report success
- Do not transition to REFACTOR without new approval

**Example:**
```
AI: "Fix complete. Build successful.

Issue: src/components/Applicants/Applicants.jsx:10 - FIXED
Modified: 1 file, 2 lines removed
Verified: npm run lint ✓, npm run build ✓, npm run test ✓

The requested issue is resolved."

[STOP - do not continue]
```

---

## Mode Enforcement Rules

### 🚨 Critical Rule: No Mode Skipping

```
FORBIDDEN:
- Jump from DIAGNOSE directly to FIX (skip REVIEW)
- Jump from REVIEW directly to REFACTOR (without user request)
- Enter REFACTOR mode without explicit approval

REQUIRED:
- DIAGNOSE → show findings → get approval → REVIEW
- REVIEW → show proposed changes → get approval → FIX
- FIX → test → commit → DONE

No shortcuts. No skipping. Follow the sequence.
```

---

### Mode Lock During Phase

```
In DIAGNOSE mode:
- CANNOT modify code
- Even if you know the fix
- MUST wait for approval

In REVIEW mode:
- CANNOT modify code
- Even if approved before
- MUST get fresh approval

In FIX mode:
- CANNOT add extra features
- CANNOT refactor
- CANNOT fix other issues
- EXACTLY the approved fix only

In REFACTOR mode:
- CANNOT fix bugs
- CANNOT add features
- CANNOT change architecture
- ONLY the approved refactor
```

---

## Mode Detection Checklist

### How to Know Which Mode You're In

**DIAGNOSE Mode:**
- [ ] User reported a problem
- [ ] You haven't identified the root cause yet
- [ ] No solution proposed yet
- [ ] No user approval given

**REVIEW Mode:**
- [ ] Root cause is known
- [ ] Solution is ready to propose
- [ ] You're showing before/after code
- [ ] Waiting for user approval

**FIX Mode:**
- [ ] User explicitly approved
- [ ] You're actually modifying code
- [ ] Tests are running
- [ ] Changes are being committed

**REFACTOR Mode:**
- [ ] User explicitly requested refactoring
- [ ] User approved scope
- [ ] All tests were passing before
- [ ] Changes don't affect functionality

---

## Access Level Comparison Table

| Capability | DIAGNOSE | REVIEW | FIX | REFACTOR |
|-----------|----------|--------|-----|----------|
| Read code | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Run tests | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Modify code | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| Commit changes | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| Require approval | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| Full scope freedom | ✅ Yes | ⚠️ Limited | ✅ Approved | ⚠️ Approved |
| Can continue after | ⚠️ Ask | ⚠️ Ask | ❌ Stop | ❌ Stop |

---

## Real-World Example: Complete Workflow

### Scenario: Build is Failing

```
PHASE 1: DIAGNOSE MODE
───────────────────────

User: "Build is failing"

AI:
1. Run: npm run build
2. See error: [eslint] Applicants.jsx line 10
3. Read: Applicants.jsx completely
4. Analyze: selectedApplicant declared but never used
5. Report with proof:
   "Found: Unused variable 'selectedApplicant'
    File: src/components/Applicants/Applicants.jsx:10
    Can I review the fix?"

User: "Yes"

[MODE TRANSITION: DIAGNOSE → REVIEW]


PHASE 2: REVIEW MODE
────────────────────

AI:
1. Analyze impact
2. Show before/after
3. List affected files: 1
4. Explain why change is safe
5. Show risk assessment: LOW

"Here's what I'll change:

BEFORE:
const [selectedApplicant, setSelectedApplicant] = useState(null);

AFTER:
[removed - not used]

Impact: Component behavior unchanged
Risk: LOW
Rollback: Easy

Approve?"

User: "Yes"

[MODE TRANSITION: REVIEW → FIX]


PHASE 3: FIX MODE
─────────────────

AI:
1. Read Applicants.jsx completely
2. Remove line 10: useState declaration
3. Remove line 207: setSelectedApplicant call
4. Test: npm run lint → ✓ PASS
5. Test: npm run build → ✓ PASS
6. Test: npm run test → ✓ PASS
7. Commit with message
8. Log in CHANGELOG_AI.md

Report:
"Fix complete: ✅ SUCCESS

Files: 1
Changes: 2 lines removed
Tests: All pass
Build: Successful

Issue resolved."

[STOP - Do not continue]
```

---

## Using This Framework

### For Every Task

Before taking any action:

1. **Identify current mode**
   - What phase are we in?

2. **Check permissions**
   - What can I do in this mode?
   - What am I forbidden from doing?

3. **Follow workflow**
   - What's the next step?
   - Do I need approval?

4. **Ask for transition**
   - Ready to move to next mode?
   - Do I need user confirmation?

5. **Stay in scope**
   - Only do what's approved
   - Stop when done

---

## Mode Transition Phrases

### Asking to Move Forward

```
In DIAGNOSE Mode, when ready to move to REVIEW:
"I've diagnosed the issue. Can I show you the proposed fix?"

In REVIEW Mode, when ready to move to FIX:
"Here's what I'll change. Approve?"

In FIX Mode, when complete:
"Fix complete and verified. Issue resolved."

Requesting REFACTOR Mode:
(Only valid if user explicitly requested refactoring)
"Ready to proceed with refactoring?"
```

### Blocking Transitions

```
Cannot move to REVIEW without diagnosis:
"I need to understand the issue first."

Cannot move to FIX without approval:
"I need your approval before making changes."

Cannot move to REFACTOR without explicit request:
"Refactoring requires explicit approval."

Cannot continue after FIX:
"Fix is complete. Stopping here. No further changes."
```

---

## Remember

```
Access levels are not restrictions.
They are guardrails.

They prevent:
- Premature modifications
- Scope creep
- Skipped testing
- Multiple simultaneous changes

They ensure:
- Systematic workflow
- Clear communication
- Proper testing
- Controlled modifications
- Traceable decisions

Follow the modes. Trust the process.
```
