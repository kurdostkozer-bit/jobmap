# RISK_ASSESSMENT.md: Pre-Modification Risk Evaluation

Framework for assessing the risk level of proposed changes before any modification begins.

**Principle:** Evaluate risk systematically before modifying code, not after.

---

## Risk Assessment Purpose

**When:** Before starting FIX mode  
**Who:** AI assistant (with user approval)  
**Why:** Prevent high-risk changes without explicit awareness  
**Output:** Risk level + approval requirement

---

## Risk Levels

```
┌─────────────────────────────────────────┐
│ 🟢 GREEN: Low Risk                      │
│ ✓ Isolated change                       │
│ ✓ Minimal dependencies                  │
│ ✓ Easy rollback                         │
│ ✓ No breaking changes                   │
│ → Can proceed with normal approval      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🟡 YELLOW: Medium Risk                  │
│ ⚠️ Multiple file changes                │
│ ⚠️ Some dependencies affected           │
│ ⚠️ Moderate rollback effort             │
│ ⚠️ Possible side effects                │
│ → Requires explicit user confirmation   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🔴 RED: High Risk                       │
│ 🚨 Architecture changes                 │
│ 🚨 Multiple modules affected            │
│ 🚨 Difficult rollback                   │
│ 🚨 Breaking API changes                 │
│ → BLOCKED: Requires pre-approval        │
└─────────────────────────────────────────┘
```

---

## Risk Assessment Template

Use this template for every proposed change:

```markdown
## Risk Assessment for [Change Name]

**Proposed Change:** [Brief description]

### 1. Scope Analysis

**Files Affected:** [N] files

List:
- file1.jsx
- file2.ts
- file3.css

**Functions/Components Affected:** [N]

List:
- function1()
- Component1
- Service1.method()

**Dependencies:** [N] modules depend on this

List:
- Module A
- Module B

### 2. Impact Analysis

**Risk Level:** 🟢 LOW | 🟡 MEDIUM | 🔴 HIGH

**Justification:** [Why this risk level]

### 3. Dependency Mapping

**What depends on this code?**
- [ ] Other components
- [ ] Services
- [ ] Tests
- [ ] External modules

List affected: [items]

**What does this code depend on?**
- [ ] Other components
- [ ] External libraries
- [ ] APIs
- [ ] Database

### 4. Breaking Changes

**Will this break anything?**
- [ ] No breaking changes (LOW RISK)
- [ ] Potentially breaking, needs testing (MEDIUM RISK)
- [ ] Definitely breaking, needs mitigation (HIGH RISK)

Explain: [Details]

### 5. Test Coverage

**Existing tests for this code:**
- [ ] Unit tests: [count]
- [ ] Integration tests: [count]
- [ ] E2E tests: [count]

**Tests that might fail:**
- [ ] Affected unit tests: [count]
- [ ] Affected integration tests: [count]
- [ ] Affected E2E tests: [count]

### 6. Rollback Difficulty

**How easy to rollback?**

- 🟢 Very Easy (< 5 minutes)
  - Single file, simple change
  - Just revert one commit

- 🟡 Moderate (5-30 minutes)
  - Multiple files, but isolated
  - Clear rollback procedure
  - Database migrations reversible

- 🔴 Difficult (> 30 minutes)
  - Multiple modules affected
  - Complex rollback steps
  - Database changes irreversible
  - Coordinated rollback needed

Rollback steps: [List steps]

### 7. Risk Mitigation

**How to reduce risk?**

- [ ] Run specific test subset first
- [ ] Deploy to staging first
- [ ] Create backup before change
- [ ] Have rollback plan ready
- [ ] Monitor after deployment
- [ ] Other: [explain]

### 8. Approval Requirements

**Risk Level:** 🟢 LOW | 🟡 MEDIUM | 🔴 HIGH

**Approval needed?**
- 🟢 LOW: Normal approval sufficient
- 🟡 MEDIUM: Explicit user confirmation required
- 🔴 HIGH: Must be pre-approved before starting

**Who should approve:**
- [ ] User/Product Owner
- [ ] Tech Lead
- [ ] Security Team (if applicable)
- [ ] Other: [explain]

### Final Decision

**Proceed?** [ ] YES | [ ] NO | [ ] ASK FOR APPROVAL

**Conditions:** [Any conditions on proceeding]
```

---

## Risk Scoring System

Use this matrix to determine risk level:

### Scoring Criteria

| Factor | Points | Calculation |
|--------|--------|-------------|
| **Files affected** | | |
| 1 file | 1 | Low |
| 2-5 files | 3 | Medium |
| 6+ files | 5 | High |
| **Functions affected** | | |
| 1 | 1 | Low |
| 2-5 | 2 | Medium |
| 6+ | 3 | High |
| **Dependencies** | | |
| 0 modules depend | 0 | Low |
| 1-2 modules depend | 2 | Medium |
| 3+ modules depend | 4 | High |
| **Breaking changes** | | |
| None | 0 | Low |
| Potential | 2 | Medium |
| Definite | 4 | High |
| **Rollback difficulty** | | |
| Very easy | 1 | Low |
| Moderate | 2 | Medium |
| Difficult | 4 | High |

### Risk Calculation

```
Total Points = Sum of all factors

0-3 points   → 🟢 LOW RISK
4-7 points   → 🟡 MEDIUM RISK
8+ points    → 🔴 HIGH RISK
```

---

## Real-World Examples

### Example 1: Fix Unused Variable

```
## Risk Assessment: Remove Unused Variable

**Proposed Change:** Remove selectedApplicant from Applicants.jsx

### 1. Scope Analysis
- Files Affected: 1 (Applicants.jsx)
- Functions Affected: 1 (component)
- Dependencies: 0 modules

### 2. Impact Analysis
**Risk Level:** 🟢 LOW

**Justification:**
- Only removing dead code
- No component functionality changes
- No API changes
- No test changes needed

### 3. Dependency Mapping
- No other components import selectedApplicant
- No services depend on it
- No external usage

### 4. Breaking Changes
- No breaking changes
- Component behavior unchanged

### 5. Test Coverage
- Existing tests: 3 unit tests
- Affected tests: 0 (no functional change)

### 6. Rollback Difficulty
🟢 Very Easy (< 5 minutes)
- Just add the lines back
- One git commit revert

### 7. Risk Mitigation
- Run npm run lint ✓
- Run npm run build ✓
- Run npm run test ✓

### 8. Approval Requirements
**Risk Level:** 🟢 LOW

Approval: Normal approval sufficient

### Final Decision
✅ Proceed with normal approval

### Risk Score Calculation
- Files: 1
- Functions: 1
- Dependencies: 0
- Breaking changes: 0
- Rollback: 1
Total: 3 points → 🟢 LOW RISK
```

---

### Example 2: Refactor Component to Hooks

```
## Risk Assessment: Refactor JobListings to Hooks

**Proposed Change:** Convert JobListings class component to function with hooks

### 1. Scope Analysis
- Files Affected: 2 (JobListings.jsx, JobListings.test.jsx)
- Functions Affected: 8 (lifecycle methods → hooks)
- Dependencies: 3 modules depend on JobListings

### 2. Impact Analysis
**Risk Level:** 🟡 MEDIUM

**Justification:**
- Multiple functions affected
- Other components import this
- Tests need update
- But: clear 1:1 mapping of lifecycle → hooks

### 3. Dependency Mapping
- Depends on: 2 modules
- Depended by: 3 components
- Import graph complexity: Medium

### 4. Breaking Changes
- No API breaking changes
- Component props unchanged
- Component behavior should be identical
- Potential: async/useEffect timing differences

### 5. Test Coverage
- Existing unit tests: 12
- Existing integration tests: 3
- Affected tests: 12 (might need updates)

### 6. Rollback Difficulty
🟡 Moderate (5-30 minutes)
- Revert commit
- Run tests
- Might need manual verification
- Check parent components still work

Steps:
1. `git revert [commit]`
2. `npm run test` (verify tests pass)
3. `npm run build` (verify build)
4. Manual test in browser

### 7. Risk Mitigation
- Run full test suite before shipping
- Test in staging environment
- Have rollback prepared
- Document changes clearly

### 8. Approval Requirements
**Risk Level:** 🟡 MEDIUM

Approval: Explicit user confirmation required

**Message:**
"This is a refactor affecting 3 dependent modules.
Estimated effort to revert: 15 minutes.
Approve before I proceed?"

### Final Decision
⚠️ Proceed ONLY with explicit user confirmation

### Risk Score Calculation
- Files: 2 → 3 points
- Functions: 8 → 3 points
- Dependencies: 3 modules depend → 4 points
- Breaking changes: Potential → 2 points
- Rollback: Moderate → 2 points
Total: 14 points → 🔴 Actually HIGH RISK!

**Revision:** This is HIGH RISK, should be pre-approved
```

---

### Example 3: Add New Dependency

```
## Risk Assessment: Add Authentication Library

**Proposed Change:** Add JWT decode library for token parsing

### 1. Scope Analysis
- Files Affected: 5 (auth.service, multiple components)
- Functions Affected: 3 services
- Dependencies: All auth-dependent features affected

### 2. Impact Analysis
**Risk Level:** 🔴 HIGH

**Justification:**
- Authentication is critical system
- Affects all user interactions
- Complex dependency (security implications)
- Breaking changes likely

### 3. Dependency Mapping
- Depends on: 2 external packages
- Depended by: 10+ components
- Import graph complexity: High

### 4. Breaking Changes
- Might change auth token format
- Might change auth flow
- Definitely breaking if library incompatible

### 5. Test Coverage
- Existing unit tests: 20
- Existing integration tests: 8
- Existing E2E tests: 5
- Affected: All (33 total)

### 6. Rollback Difficulty
🔴 Difficult (> 30 minutes)
- Multiple module rollback needed
- Might need database/token reset
- All tests must pass
- Users might be logged out

### 7. Risk Mitigation
- Pre-test in isolated environment
- Have backup of current implementation
- Prepare rollback scripts
- Test complete auth flow
- Staging environment test first

### 8. Approval Requirements
**Risk Level:** 🔴 HIGH

**Approval:** MUST be pre-approved before starting

**Blockers:**
- [ ] Tech lead approval
- [ ] Security review
- [ ] Testing plan documented
- [ ] Rollback plan ready

### Final Decision
🚫 BLOCKED: Requires pre-approval

"This change affects critical authentication system.
Risk score: 16 points (HIGH).

Before I proceed:
1. Get tech lead approval
2. Get security review
3. Create detailed rollback plan
4. Test with backup auth system

Once approved, I can proceed."

### Risk Score Calculation
- Files: 5 → 5 points
- Functions: 3+ services → 4 points
- Dependencies: 10+ → 5 points
- Breaking changes: Definite → 4 points
- Rollback: Difficult → 4 points
Total: 22 points → 🔴 HIGH RISK
```

---

## Risk Assessment Workflow

### Before Modification

```
1. Propose change
   ↓
2. Perform risk assessment
   ↓
3. Calculate risk score
   ↓
4. Determine risk level (🟢/🟡/🔴)
   ↓
5. Check approval requirements
   ↓
6. GREEN (🟢)?
   → Proceed with normal approval
   ↓
7. YELLOW (🟡)?
   → Get explicit confirmation
   → Then proceed
   ↓
8. RED (🔴)?
   → Block modification
   → Request pre-approval
   → If approved, proceed
   ↓
9. Begin modification (FIX mode)
```

---

## Approval Matrix

```
🟢 LOW RISK
├─ Approval: Standard ✓
├─ Time to approve: Minutes
└─ Can proceed: After normal approval

🟡 MEDIUM RISK
├─ Approval: Explicit confirmation ✓
├─ Time to approve: Usually minutes
├─ Message: Show risk assessment
└─ Can proceed: After explicit "yes"

🔴 HIGH RISK
├─ Approval: Pre-approval REQUIRED ✓
├─ Time to approve: May be hours/days
├─ Message: Full risk assessment + blockers
├─ Conditions: May require additional steps
└─ Can proceed: Only after pre-approval received
```

---

## Risk Assessment Checklist

Before entering FIX mode:

- [ ] Read proposed changes completely
- [ ] Identified all affected files
- [ ] Counted all affected functions
- [ ] Mapped all dependencies
- [ ] Assessed breaking changes
- [ ] Checked test coverage
- [ ] Evaluated rollback difficulty
- [ ] Calculated risk score
- [ ] Determined risk level
- [ ] Got required approval
- [ ] Prepared rollback plan
- [ ] Ready to modify code

**If ANY unchecked, NOT READY TO PROCEED.**

---

## Risk Communication Template

When presenting risk assessment:

### 🟢 LOW RISK

```
Risk Assessment: LOW (🟢)

Change: [Description]
Files: [Count] isolated
Dependencies: None
Breaking: No
Rollback: Easy (< 5 min)

Score: [Points] → LOW

Ready to proceed with standard approval.
```

### 🟡 MEDIUM RISK

```
Risk Assessment: MEDIUM (🟡)

Change: [Description]
Files: [Count] files
Functions: [Count] functions
Dependencies: [Modules]
Breaking: Potential
Rollback: Moderate (5-30 min)

Score: [Points] → MEDIUM

This change affects multiple areas.
Need your explicit confirmation before proceeding.

Approve?
```

### 🔴 HIGH RISK

```
⚠️ Risk Assessment: HIGH (🔴)

Change: [Description]
Files: [Count] files
Functions: [Count] functions
Dependencies: [Modules]
Breaking: Definite
Rollback: Difficult (> 30 min)

Score: [Points] → HIGH

This is a high-risk change affecting critical systems.

Blockers:
- [ ] Pre-approval required
- [ ] Tech lead sign-off
- [ ] Additional testing planned
- [ ] Rollback plan documented

I cannot proceed until these are addressed.

What should I do?
```

---

## Special Risk Cases

### Case 1: Changes to Shared Utils

**Risk:** HIGH
**Reason:** Everything depends on utils
**Mitigation:** Full test suite must pass
**Approval:** Always pre-approve

### Case 2: Database Schema Changes

**Risk:** HIGH
**Reason:** Hard to rollback
**Mitigation:** Backup required
**Approval:** Always pre-approve

### Case 3: Authentication/Security

**Risk:** HIGH
**Reason:** Critical to system
**Mitigation:** Security review needed
**Approval:** Always pre-approve

### Case 4: API Endpoint Changes

**Risk:** MEDIUM-HIGH
**Reason:** Breaking for clients
**Mitigation:** Version endpoints
**Approval:** Pre-approve for breaking changes

### Case 5: Performance Changes

**Risk:** MEDIUM
**Reason:** Might degrade UX
**Mitigation:** Benchmark before/after
**Approval:** Pre-approve if perf degrades

---

## Risk Tracking

### In CHANGELOG_AI.md

Log risk assessment:

```
## Risk Assessment

Level: 🟢 LOW | 🟡 MEDIUM | 🔴 HIGH

Score: [N] points

Factors:
- Files: 1
- Functions: 1
- Dependencies: 0
- Breaking: No
- Rollback: Easy

Approval: ✓ Received
```

---

## Remember

```
Risk assessment is not optional.

It protects:
- Your code from bad changes
- Users from broken features
- Your sanity from emergency rollbacks

Take risk seriously.
If uncertain about risk level, escalate to RED.
Better to over-estimate than under-estimate.

Assessment before modification.
Always.
```
