# RULE_LEVELS.md: Enforceability Hierarchy

Not all rules are equally mandatory. This document defines three levels of enforceability.

**Principle:** Clear hierarchy prevents unnecessary rigidity while maintaining critical safeguards.

---

## Three Levels of Rules

```
🔴 MUST
├─ Non-negotiable
├─ Never override
├─ Violation = rejection
└─ Examples: DIAGNOSE_FIRST, STOP_ON_FIRST_FAILURE

🟡 SHOULD
├─ Strongly recommended
├─ Can override with documentation
├─ Override requires logging
└─ Examples: Code formatting, style preferences

🟢 MAY
├─ Best practices
├─ Optional guidance
├─ Follow when possible
└─ Examples: Performance optimization tips, style suggestions
```

---

## Level 1: MUST (Mandatory)

**These rules CANNOT be broken. Ever.**

### Characteristics

```
✓ Non-negotiable
✓ Protect core integrity
✓ Prevent serious problems
✓ No exceptions (see EXCEPTIONS.md for rare cases)
```

### Violation Consequence

```
Violation → Code rejected
         → Changes reverted
         → Issue documented
         → Logged in CHANGELOG_AI.md
```

### MUST Rules in This Framework

| Rule | Source | Why MUST |
|------|--------|---------|
| **Read code completely before modifying** | RULES.md #0 | Prevents wrong fixes, breaking code |
| **Diagnose before modifying** | DIAGNOSE_FIRST.md | Prevents guessing, wasted time |
| **One change at a time** | RULES.md #1 | Prevents scope creep |
| **Stop on first failure** | BUILD_RULES.md | Prevents error stacking |
| **Revert on build failure** | ROLLBACK_POLICY.md | Prevents broken code in repo |
| **Pass all tests before commit** | TESTING.md | Prevents broken deployments |
| **Run full build pipeline** | BUILD_RULES.md | Ensures code quality |
| **No disabling ESLint** | RULES.md #7 | Maintains code standards |
| **No @ts-ignore** | RULES.md #7 | Maintains type safety |
| **Atomic commits (1 fix = 1 commit)** | RULES.md #11 | Enables easy revert |
| **Log all changes in CHANGELOG_AI.md** | CHANGELOG_AI.md | Maintains audit trail |

---

## Level 2: SHOULD (Strongly Recommended)

**These rules are strongly encouraged but can be overridden with justification.**

### Characteristics

```
✓ Best practices
✓ Improve code quality
✓ Prevent common mistakes
✓ Can be waived if documented
```

### Override Process

```
Want to override?

1. Document why
   "I'm overriding [rule] because [reason]"

2. Log the exception
   Note in commit message or CHANGELOG_AI.md

3. Continue with work

4. Include in code review
   Mark: "Exception: [rule name]"
```

### Example: Override SHOULD Rule

```
SHOULD Rule: "Refactor only when explicitly requested"

Situation: While fixing a bug, find badly named variable

Override:
"Renaming variable X to Y to clarify what it does.
 This improves the fix readability.
 Exception logged."

Result: Allowed, but documented
```

### SHOULD Rules in This Framework

| Rule | Source | Why SHOULD | When to Override |
|------|--------|-----------|-----------------|
| **Optimize code** | SAFE_EDIT_POLICY.md | Better performance | If critical for fix |
| **Add comments** | TESTING.md | Better maintainability | If time-limited |
| **Check all related code** | RULES.md #10 | Catch side effects | If isolated change |
| **Prefer new commits over amend** | GIT_SAFETY | Cleaner history | If unpushed commit |
| **Test in multiple browsers** | TESTING.md | Cross-browser compat | If desktop-only feature |
| **Update documentation** | SAFE_EDIT_POLICY.md | Keep docs current | If docs in flux |

---

## Level 3: MAY (Optional Guidance)

**These are helpful suggestions but completely optional.**

### Characteristics

```
✓ Nice to have
✓ Best practices
✓ Improve quality if followed
✓ No consequence if skipped
```

### When to Follow

```
If you have time: Follow it
If you're in a rush: Skip it
If unsure: It's optional
```

### Examples

```
MAY: Add extra logging for debugging
MAY: Optimize CSS selectors
MAY: Add inline documentation comments
MAY: Extract helper functions
MAY: Group related code together
MAY: Use more descriptive variable names
```

### MAY Rules in This Framework

| Suggestion | Source | Benefit |
|-----------|--------|---------|
| **Add performance notes** | TESTING.md | Future optimization |
| **Document trade-offs** | RISK_ASSESSMENT.md | Future decisions |
| **Add examples in comments** | CODE_QUALITY | Helps maintainers |
| **Group related lines** | CODE_STYLE | Better readability |
| **Use meaningful variable names** | CODE_STYLE | Easier to understand |

---

## Quick Reference: Rule Levels by Topic

### Diagnosis & Analysis

| Rule | Level | Details |
|------|-------|---------|
| Diagnose before modifying | 🔴 MUST | Read DIAGNOSE_FIRST.md |
| Read code completely | 🔴 MUST | Read RULES.md #0 |
| Document root cause | 🟡 SHOULD | Aid future debugging |
| Ask clarifying questions | 🟢 MAY | If needed |

### Modification & Testing

| Rule | Level | Details |
|------|-------|---------|
| Single change at a time | 🔴 MUST | RULES.md #1 |
| Pass all tests | 🔴 MUST | TESTING.md |
| Run full build pipeline | 🔴 MUST | BUILD_RULES.md |
| Stop on first failure | 🔴 MUST | BUILD_RULES.md |
| Optimize code | 🟡 SHOULD | If not rushing |
| Check side effects | 🟡 SHOULD | Prevents bugs |
| Add comments | 🟢 MAY | If helpful |

### Commit & Documentation

| Rule | Level | Details |
|------|-------|---------|
| Clear commit message | 🔴 MUST | RULES.md #8 |
| Log in CHANGELOG_AI.md | 🔴 MUST | CHANGELOG_AI.md |
| Atomic commits | 🔴 MUST | RULES.md #11 |
| Document exceptions | 🟡 SHOULD | Audit trail |
| Add performance notes | 🟢 MAY | Future optimization |

---

## Enforcing Rule Levels

### For AI Assistants

**Check rule level before deciding:**

```
Is this a MUST rule?
├─ Yes → NEVER break it
│        Even if inconvenient
│        Even if slow
│        No exceptions
│
└─ No → Is this a SHOULD rule?
         ├─ Yes → Follow it unless:
         │        ├─ Document why override
         │        ├─ Log the exception
         │        └─ Continue
         │
         └─ No → Is this a MAY rule?
                 ├─ Yes → Follow if you can
                 │        Skip if busy
                 │        Either is fine
                 └─ No → Unknown rule, ask

```

### For Code Review

**Review checklist by level:**

```
🔴 MUST violations: REJECT immediately
   └─ Cannot merge until fixed

🟡 SHOULD violations: REVIEW with author
   └─ Usually accepted if documented
   └─ Can merge if exception logged

🟢 MAY violations: Acknowledge, no action needed
   └─ Informational only
   └─ Can merge as-is
```

---

## When to Upgrade a Rule Level

A rule might change levels over time:

```
NEW PROJECT:
Many rules start as SHOULD
(Team still learning)

MATURE PROJECT:
Core rules become MUST
(Process is stable)

CRISIS (emergency fix):
Rules temporarily downgraded
(See EXCEPTIONS.md)
```

---

## Examples by Scenario

### Scenario 1: Regular Bug Fix

```
Situation: Fix ESLint error in component

MUST Rules to follow:
✓ Read code completely first
✓ Diagnose the root cause
✓ Make one change only
✓ Run full build pipeline
✓ Stop if build fails
✓ Revert if broken
✓ Log in CHANGELOG_AI.md

SHOULD Rules to follow:
✓ Document why error happened
✓ Check for side effects
(Optional to override)

MAY Rules:
✓ Add helpful comments
(Nice to have, not required)
```

### Scenario 2: Performance Optimization

```
Situation: Optimize slow component rendering

MUST Rules to follow:
✓ One change at a time
✓ Diagnose before changing
✓ Run full tests
✓ Log changes

SHOULD Rules:
✓ Document performance improvement metrics
✓ Check for regressions
(Can override if time-limited)

MAY Rules:
✓ Add inline comments explaining optimization
(Optional)

Result: Faster, documented, testable
```

### Scenario 3: Urgent Security Fix

```
Situation: Critical security vulnerability in production

MUST Rules to follow:
✓ Still must diagnose
✓ Still must test
✓ Still must log

Can OVERRIDE (see EXCEPTIONS.md):
✓ Might skip some SHOULD rules
✓ Document the emergency
✓ Must still be reversible

Result: Fixed quickly, properly documented
```

---

## Rule Level Summary

```
🔴 MUST = 15-20% of rules (core integrity)
   Examples: diagnosis, testing, commit logging
   
🟡 SHOULD = 60-70% of rules (best practices)
   Examples: documentation, optimization, review
   
🟢 MAY = 10-20% of rules (nice to have)
   Examples: comments, naming, suggestions
```

---

## Using This Document

### Step 1: Before Following Any Rule

```
Ask: What is its level?

Rule: "Add helpful comments"
Level: 🟢 MAY
Decision: Optional, do if time allows
```

### Step 2: If Considering Overriding

```
Ask: Can I override?

Rule: "Diagnose before modifying"
Level: 🔴 MUST
Decision: NO, never override
```

### Step 3: If Emergency Situation

```
Ask: Is this an exception?

See: EXCEPTIONS.md
Process: Document, approve, log
```

---

## Remember

```
Clear levels prevent confusion.

🔴 MUST rules protect core integrity.
   Never compromise on these.

🟡 SHOULD rules improve quality.
   Follow them, but can document exceptions.

🟢 MAY rules are helpful hints.
   Follow if convenient, skip if not.

This hierarchy means:
✓ Core protection remains strong
✓ Some flexibility for practicality
✓ Clear boundaries prevent ambiguity

Know your rule levels.
Follow MUST always.
Override SHOULD with documentation.
Use MAY as guidance.
```
