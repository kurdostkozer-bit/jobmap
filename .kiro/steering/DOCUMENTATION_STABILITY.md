# Documentation Stability Rules

**Version:** 1.0  
**Last Updated:** 2026-07-26  
**Owner:** Solo Developer

Documentation structure is now stable. This file documents when to update each file.

---

## Core Principle

❌ **Don't update documentation with every feature**

✅ **Update documentation only when fundamentals change**

---

## Update Rules

### README.md
Update ONLY if:
- Project setup steps change
- Tech stack fundamentally changes
- Project purpose/scope changes

**Frequency:** Rare (every 3-6 months)

---

### START_HERE.md
Update ONLY if:
- Initial development workflow changes
- New critical dependency added
- Onboarding path changes

**Frequency:** Rare (every 3-6 months)

---

### JOBMAP_PRODUCT_VISION.md
Update ONLY if:
- Product vision/purpose changes
- User flows fundamentally change
- Core features redefined

**Frequency:** Very rare (every 6+ months)

---

### COMPREHENSIVE_ROADMAP.md
Update ONLY if:
- Milestone completed → move to "Done" section
- New milestone added (justified by user research/feedback)
- Track priorities shift

**Frequency:** After each milestone completion (~1 month)

---

### ARCHITECTURE_DECISIONS.md
Update ONLY if:
- New architectural decision made (ADR-N added)
- Existing decision becomes obsolete
- Major refactoring justified

**Frequency:** Per architectural change (2-4 per year)

---

### TECH_STACK.md
Update ONLY if:
- Major library/framework upgraded
- New platform/technology added
- Technology deprecated

**Frequency:** When dependency versions significantly change

---

### ENGINEERING_STANDARDS.md
Update ONLY if:
- New coding rule adopted
- Performance threshold changes
- Security requirement added

**Frequency:** When standards fundamentally shift (2-4 per year)

---

## What NOT to Document

❌ Daily progress or sprint updates → Use GitHub Issues  
❌ Bug reports or temporary fixes → Use commit messages  
❌ Code review notes → Keep in PR descriptions  
❌ Session notes or meeting minutes → Use GitHub Discussions  
❌ Temporary feature flags → Document in code comments  

---

## 6-Month Retention Rule

Before creating a new MD file, ask:

> **Will I need this file 6 months from now?**

- Yes → Create it
- No → Use GitHub Issues, PRs, or commit messages instead

---

## Current Status

✅ Documentation stable  
✅ 7 files, each with clear responsibility  
✅ No temporary or report files  
✅ Ready for 6+ months without major updates  

Focus now: **Code and product development**
