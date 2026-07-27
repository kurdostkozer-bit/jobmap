# ADR: Architecture Decision Records

Central repository for all major architectural decisions in the JobMap project.

**Purpose:** Document *why* we made architectural choices, not just *what* they are.

---

## What is an ADR?

An Architecture Decision Record (ADR) is a concise document that captures a single architectural decision with:

- **Context:** Why we needed to decide
- **Decision:** What we decided
- **Consequences:** What happens as a result
- **Alternatives:** What we considered but didn't choose
- **Status:** Current status (Proposed, Accepted, Deprecated, Superseded)

**Not** for:**
- Bug fixes
- Feature implementations
- Routine maintenance

**For:**
- Technology choices
- Architectural patterns
- Framework selections
- Major refactors
- Infrastructure changes

---

## Why ADRs Matter

### For AI Assistants

- Clear justification for why tools are frozen
- Path forward if tools need to change
- Evidence-based decisions, not arbitrary rules

### For Teams

- Institutional memory
- Why decisions were made
- What alternatives were considered
- When/how to revisit decisions

### For Future Changes

- Don't repeat past discussions
- Understand trade-offs
- Know when to deviate
- Enable informed migrations

---

## ADR Format

```
# ADR-[NUMBER]: [TITLE]

## Status

[Proposed | Accepted | Deprecated | Superseded]

## Context

[Situation that motivated this decision]

[Why we needed to decide]

[Constraints and requirements]

## Decision

[What we decided to do]

[The architectural choice made]

## Consequences

### Positive

- [Benefit 1]
- [Benefit 2]

### Negative

- [Trade-off 1]
- [Trade-off 2]

### Neutral

- [Other impact 1]

## Alternatives Considered

### Option 1: [Alternative Name]

Pros:
- [Pro 1]

Cons:
- [Con 1]

Why rejected: [Reason]

### Option 2: [Alternative Name]

[Same structure]

## Related Decisions

- ADR-XXX: [Related decision]

## Migration Path

If we decide to change this:

1. [First step]
2. [Second step]
3. [Third step]

Estimated effort: [Low | Medium | High]

## Approval

- Decision maker: [Name/Role]
- Date approved: [YYYY-MM-DD]
- Next review: [YYYY-MM-DD]

## Notes

[Any additional context]
```

---

## Current ADRs

### Core Architecture Decisions

- **ADR-001:** Use React for Frontend
- **ADR-002:** Use NestJS for Backend
- **ADR-003:** Use PostgreSQL for Database
- **ADR-004:** JWT Authentication
- **ADR-005:** REST API Design
- **ADR-050:** Career Platform Core Architecture

### Tool Choices

- **ADR-010:** Use Leaflet for Mapping
- **ADR-011:** Use TypeScript
- **ADR-012:** Use Jest for Testing

### Patterns & Practices

- **ADR-020:** Modular Backend Structure
- **ADR-021:** Component-based Frontend

### Process Decisions

- **ADR-030:** AI Governance Framework
- **ADR-031:** Code Review Standards

---

## When to Create an ADR

Create an ADR when:

✅ **Choosing a technology/framework**
- "Should we use Redux or Context?"
- "Should we migrate to Vite?"

✅ **Making architectural choices**
- "How should we structure modules?"
- "Should we use monolith or microservices?"

✅ **Setting patterns**
- "Error handling approach?"
- "Testing strategy?"

✅ **Major changes**
- "Should we upgrade major version?"
- "Should we refactor this system?"

### Don't create ADR for:

❌ Bug fixes
❌ Feature implementations
❌ Minor code changes
❌ Temporary workarounds
❌ Routine maintenance

---

## ADR Naming Convention

```
ADR-[NUMBER]: [Decision]

001-use-react.md
002-use-nestjs.md
010-use-leaflet.md
020-modular-backend.md
030-ai-governance.md

Grouping:
001-009: Core framework decisions
010-019: Tool selections
020-029: Architectural patterns
030-039: Process decisions
040+:    Project-specific decisions
```

---

## ADR Lifecycle

### 1. Proposed

```
Status: Proposed

Context: Team discussing whether to upgrade React version

Decision: [Waiting for discussion]

Status: Someone creates ADR-XXX with context and options
```

### 2. Accepted

```
Status: Accepted

Decision: Upgrade to React 18

Consequences: [Documented]

Status: Team agrees, decision is made
```

### 3. Living Document

```
Updated over time as:
- Implementation provides more data
- Consequences become clear
- New context emerges
```

### 4. Deprecated or Superseded

```
Status: Superseded by ADR-YYY

Reason: New decision replaces this one

Migration: [Path to new approach]
```

---

## Example: ADR-001 - Use React

Here's a complete real-world example:

```
# ADR-001: Use React for Frontend

## Status

Accepted

## Context

JobMap frontend needs to be:
- Highly interactive (real-time job map, search, filtering)
- Fast and responsive
- Maintainable by small team
- Deployable to modern browsers

Team had experience with React. Project requirements favor component-based architecture.

## Decision

Use React 18.x as the frontend framework.

## Consequences

### Positive

- Large ecosystem of libraries
- Strong community support
- Excellent tooling (CRA, Vite integrations)
- JSX makes UI code readable
- Component reusability high
- Virtual DOM provides good performance

### Negative

- React learning curve for newcomers
- Bundle size can grow if not monitored
- Requires understanding of hooks
- Many package options available (paralysis of choice)

### Neutral

- Requires Node.js for development
- JavaScript dependency (not native mobile)

## Alternatives Considered

### Option 1: Vue

Pros:
- Easier learning curve
- Smaller bundle size
- Great documentation

Cons:
- Smaller community than React
- Fewer enterprise libraries
- Less team familiarity

Why rejected: Team expertise in React, ecosystem breadth important

### Option 2: Angular

Pros:
- Full-featured framework
- Strong typing (TypeScript built-in)
- Large enterprise adoption

Cons:
- Steeper learning curve
- Overkill for this project size
- Heavier than React

Why rejected: Too heavy for project needs

### Option 3: Svelte

Pros:
- Smallest bundle sizes
- Excellent performance
- Simpler syntax

Cons:
- Smaller community
- Fewer production apps
- Less mature ecosystem

Why rejected: Risk with small community, less proven

## Related Decisions

- ADR-010: Use Leaflet for Mapping (influenced by React ecosystem)
- ADR-012: Use Jest for Testing (React-recommended)

## Migration Path

If we decide to change from React:

1. Create new frontend in chosen framework
2. Parallel run with React frontend
3. Migrate routes incrementally
4. Deprecate React code
5. Remove React build pipeline

Estimated effort: High (4-8 weeks)

## Approval

- Decision maker: Project Lead
- Date approved: 2026-03-15
- Next review: 2027-03-15

## Notes

This decision should be revisited annually to assess:
- Is React still best for our needs?
- Are there better alternatives?
- Is the ecosystem still healthy?
- How's performance tracking?

Keep an eye on:
- New frameworks (Qwik, Astro, Remix)
- React 19+ major features
- Performance improvements needed
```

---

## Using ADRs to Guide Change

### Scenario: "Should we migrate to Vite?"

```
Step 1: Check existing ADRs
→ Found: ADR-005 "Use Create React App (CRA)"
→ Status: Accepted
→ Migration Path: Not documented

Step 2: Read ADR-005
→ Understand: Why CRA was chosen
→ Constraints: Zero-config, team familiarity
→ Consequences: Trade-off was bundle size for simplicity

Step 3: Create ADR-035
→ Context: CRA build times increasing
→ Decision: Evaluate Vite migration
→ Alternatives: Keep CRA, try other build tools
→ Consequences: Faster dev, faster build, new tool to learn

Step 4: Make decision
→ Accept ADR-035 if migration approved
→ Supersede ADR-005 with migration path
→ Document the transition process
```

---

## Integration with AI Governance

### When AI Wants to Change Architecture

**Before:** "I think we should upgrade React"

**With ADR:** 

```
AI: "I see React 18 has new features.

Before changing, I checked ADR-001.

Status: Accepted (React 18 already in use)
Next review: 2027-03-15

If you want to consider React 19:
1. I'll create ADR-040: Consider React 19
2. Document context and alternatives
3. Analysis of consequences
4. Your decision whether to proceed

Should I create the ADR?"
```

---

## ADR Checklist

Before creating an ADR:

- [ ] Is this an architectural decision?
- [ ] Will it impact multiple systems?
- [ ] Is there likely to be future re-evaluation?
- [ ] Are there significant trade-offs?
- [ ] Should this be documented for future reference?

Before accepting an ADR:

- [ ] Is the context clear?
- [ ] Are alternatives properly analyzed?
- [ ] Are consequences realistic?
- [ ] Has the team discussed?
- [ ] Is there buy-in?
- [ ] Is the migration path (if needed) clear?

---

## Review Cycle

### Quarterly Review

Every 3 months, review active ADRs:

- [ ] Are decisions still valid?
- [ ] Are consequences as expected?
- [ ] Need to update any?
- [ ] New decisions needed?

### Annual Review

Every year, comprehensive review:

- [ ] Which ADRs should be revisited?
- [ ] Any deprecated decisions?
- [ ] New alternatives emerged?
- [ ] New challenges?

---

## Tools

For managing ADRs:

- **Simple approach:** Markdown files in `.ai/ADR/`
- **Medium approach:** GitHub/GitLab with issues and PRs
- **Advanced approach:** Dedicated ADR management tools

This project uses the **simple approach**: Markdown files.

---

## Getting Started

1. Read this README
2. Look at existing ADRs for examples
3. When making architectural decision, create ADR
4. Follow the format
5. Share for discussion
6. Document decision

---

## Questions?

When uncertain:

- Is this an architecture decision? → Create ADR
- Is this routine work? → Just do it
- Is this a tech choice? → Create ADR
- Is this a bug fix? → No ADR needed
- Is this a pattern/process? → Consider ADR

**When in doubt, creating an ADR is rarely wrong.**

It documents thinking and helps future decisions.
