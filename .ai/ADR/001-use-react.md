# ADR-001: Use React for Frontend

## Status

**Accepted** (Active)

## Context

JobMap frontend requires:
- **High interactivity:** Real-time job map updates, search filtering, live updates
- **Performance:** Fast page loads, smooth interactions, responsive UI
- **Maintainability:** Small team, need clear component structure
- **Ecosystem:** Access to rich library ecosystem for maps, state management, forms
- **Team expertise:** Existing team knowledge of React

Previous attempts at manual DOM manipulation proved difficult to maintain as features grew.

## Decision

Use **React 18.x** as the primary frontend framework for JobMap dashboard.

Version constraint: `^18.0.0` (18.x and minor upgrades allowed, major versions require new ADR)

## Consequences

### Positive ✅

- **Component Reusability:** JobListings, ApplicantCard, etc. easily reused
- **Large Ecosystem:** Leaflet integration, React Router, form libraries all available
- **Strong Community:** Extensive Stack Overflow answers, npm packages, tutorials
- **Virtual DOM:** Good performance even with frequent re-renders
- **Developer Experience:** Hot module reloading, good debugging tools
- **TSX Support:** Strong TypeScript integration
- **Career Growth:** Team expertise valuable in market

### Negative ⚠️

- **Learning Curve:** New developers need React knowledge
- **Bundle Size:** ~40-50 KB React core (mitigated by code splitting)
- **Hook Mental Model:** Requires understanding of hooks (not obvious at first)
- **Over-engineering Risk:** Temptation to add complex state management for simple needs
- **Package Fatigue:** Too many options for similar problems

### Neutral 🔄

- **Node.js Dependency:** Requires Node.js for development
- **Not Native:** Can't be used for mobile (would need React Native separately)
- **JavaScript:** Browser JavaScript dependency (vs static HTML)

## Alternatives Considered

### Alternative 1: Vue.js

**Pros:**
- Easier learning curve
- Smaller bundle size (~35 KB)
- Excellent single-file components
- Great documentation
- Gentler than React for beginners

**Cons:**
- Smaller community than React
- Fewer enterprise libraries
- Team has minimal Vue experience
- Fewer job market opportunities
- Smaller ecosystem for specialized needs (maps, etc.)

**Decision:** Not chosen because team expertise in React is significant asset, and ecosystem breadth is important for specialized features like mapping.

### Alternative 2: Angular

**Pros:**
- Complete framework (includes routing, HTTP, forms)
- Strong TypeScript integration
- Excellent for large applications
- Used by major enterprises
- Comprehensive tooling

**Cons:**
- Steep learning curve (much steeper than React)
- Opinionated (less flexibility)
- Heavier (~1 MB+)
- Overkill for project scope
- Team has no Angular experience
- Slower development iteration

**Decision:** Not chosen because overhead exceeds our needs. Angular targets much larger applications.

### Alternative 3: Svelte

**Pros:**
- Smallest bundle sizes (compilation approach)
- Excellent performance
- Simple, intuitive syntax
- Less boilerplate than React
- Highly reactive by default

**Cons:**
- Very small community
- Few production apps in wild
- Immature ecosystem
- Fewer libraries and integrations
- Less stable than React/Vue
- Risk of framework being abandoned

**Decision:** Not chosen due to community maturity concerns and ecosystem immaturity for production applications.

### Alternative 4: Vanilla JavaScript

**Pros:**
- No dependencies
- Maximum control
- Smallest possible bundle
- Fastest learning curve for raw JS

**Cons:**
- Manual DOM management (error-prone)
- No component abstraction
- State management is ad-hoc
- Difficult to maintain as complexity grows
- Impossible to share components

**Decision:** Not chosen because previous manual DOM attempts became unmaintainable. Component abstraction is critical.

## Related Decisions

- **ADR-010:** Use Leaflet for Mapping (leverages React ecosystem)
- **ADR-011:** Use TypeScript (works excellently with React)
- **ADR-012:** Use Jest + React Testing Library (React-recommended stack)
- **ADR-003:** Use CRA as build tool (React ecosystem standard)

## Migration Path

If we decide to migrate away from React (estimated effort: **HIGH**, 4-8 weeks):

1. **Setup new framework** (week 1-2)
   - Create new project in chosen framework
   - Set up build pipeline
   - Configure testing

2. **Incremental migration** (week 3-6)
   - Migrate high-value, low-dependency components first
   - Keep React frontend running in parallel
   - Run both simultaneously
   - Gradually replace routes

3. **Final deprecation** (week 7-8)
   - Remove last React routes
   - Deprecate React build pipeline
   - Document migration for team knowledge

## Upgrade Path

**React 18 → React 19+ (future):**

If major React version upgrade needed:

1. Create new ADR for React 19 decision
2. Test with compatibility layer
3. Evaluate breaking changes
4. Plan phased migration
5. Update components as needed

No automatic upgrades without explicit decision.

## Constraints & Requirements

- Must maintain TypeScript strict mode
- Must pass ESLint checks
- Must run in modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness required
- Accessibility (WCAG 2.1 AA) required

## Approval

| Role | Name | Date |
|------|------|------|
| Decision Maker | Project Lead | 2026-03-15 |
| Tech Lead Approval | Senior Dev | 2026-03-15 |
| Status | **Accepted** | Active |

## Review Schedule

- **Next Review:** 2027-03-15
- **Quarterly Check-in:** Q1, Q2, Q3, Q4

## Questions for Review

Each review cycle, assess:

1. **Is React still best choice?**
   - Have new alternatives emerged?
   - Have our needs changed?
   - Is ecosystem still active?

2. **Performance metrics:**
   - Bundle size trending? (Should be < 300 KB gzipped)
   - Core Web Vitals? (Should meet Google targets)
   - Build time? (Should be < 2 minutes)

3. **Team experience:**
   - Is team productive with React?
   - Any major pain points?
   - Training needs?

4. **Market changes:**
   - New frameworks worth evaluating?
   - React 19+ significant improvements?
   - Better alternatives emerged?

## Notes

### For AI Assistants

This ADR explains **why** React is frozen in ARCHITECTURE.md:

✅ **You CANNOT:**
- Replace React with other frameworks
- Upgrade to experimental React versions
- Use non-standard React patterns

✅ **You CAN:**
- Use React 18.x features
- Follow React best practices
- Optimize React performance

**If you want to challenge this decision:**
1. Create ADR-0XX for alternative
2. Document why React is no longer suitable
3. Propose migration path
4. Get explicit approval

### Known Issues

None currently documented.

### Lessons Learned

- React ecosystem larger than anticipated (both good and bad)
- Hook adoption has been smooth with team
- TypeScript + React is excellent combination
- Choose your build tool carefully (CRA has limitations)

### Success Factors

- Team familiarity was critical success factor
- TypeScript + React prevented many bugs
- Component-based approach scaled well
- Ecosystem libraries saved development time

---

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-03-15 | Initial decision |
| - | - | - |

---

## Related Reading

- [React Documentation](https://react.dev/)
- [React Philosophy](https://react.dev/learn)
- [Thinking in React](https://react.dev/learn/thinking-in-react)
