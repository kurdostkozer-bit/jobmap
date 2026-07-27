# ADR-050: Career Platform Core Architecture

## Status

Accepted

## Context

JobMap is evolving from a map-based job discovery tool into a career platform that connects professionals with the right opportunities through an intelligent profile-driven experience.

The current project already has a strong map-first foundation, but this new direction requires an explicit architectural foundation for:

- Living Career Profiles
- independent intelligence engines
- account/role separation
- multi-role support
- event-driven orchestration
- long-term recommendation and analytics capability

This is a major architectural vision, not a single feature.

## Decision

We adopt `Architecture v2` as the official platform reference.

### Core architectural layers

- **Presentation Layer**
  - Flutter mobile app
  - React dashboard

- **Application Layer**
  - Auth
  - Jobs
  - Companies
  - Career Profile
  - Notifications
  - Payments

- **Domain Layer**
  - Business rules
  - Career Profile lifecycle
  - User status and permissions
  - Employer/agency workflows

- **Intelligence Layer**
  - Profile Engine
  - Matching Engine
  - Recommendation Engine
  - Opportunity Policy Engine
  - Notification Engine
  - Analytics Engine

- **Infrastructure Layer**
  - PostgreSQL
  - Redis
  - Storage
  - Push Notifications
  - Maps
  - Payment Gateway

### User and role model

- Separate `Account` from `Role`
- Support multiple roles on the same account
- Primary roles:
  - `JOB_SEEKER`
  - `EMPLOYER`
  - `RECRUITMENT_AGENCY`

### Career Profile model

- Career Profile is the central living entity
- It is not derived from a CV
- It is the source of truth for the professional model
- Generated documents (PDF, Word, ATS, Europass) are outputs of the Career Profile
- Career Profile versions are retained for history and audit
- Profile completeness is tracked and surfaced to the user

### Architectural principles

- Use a layered architecture to separate concerns:
  - Presentation Layer
  - Application Layer
  - Domain Layer
  - Intelligence Layer
  - Infrastructure Layer
- Engines should be independent and communicate via events, not direct calls.
- The Recommendation Engine must be generic and support multiple domains beyond jobs.
- The Opportunity Policy Engine must enforce policy, not just rank opportunities.
- The Career Profile is the source of truth for generated documents.
- Persist rich match explanations and recommendation history for transparency.
- Provide a shared recommendation service used by UI, email, and notifications.
- Add an Analytics Engine for observability and product metrics.

### Engine orchestration

Use event-driven orchestration rather than direct module chaining.

Suggested event flow:

- `CareerProfileUpdated`
  - triggers `Profile Engine`
- `ProfileBuilt`
  - triggers `Matching Engine`
- `MatchingCompleted`
  - triggers `Recommendation Engine`
- `RecommendationUpdated`
  - triggers `Opportunity Policy Engine`
- `OpportunityDecisionMade`
  - triggers `Notification Engine`

### Recommendation engine

- Should be generic, not job-specific
- Must support recommendations for:
  - jobs
  - companies
  - courses
  - mentors
  - events
  - certifications

### Opportunity Policy Engine

- Applies policy over opportunities
- Enforces:
  - notification caps
  - deduplication
  - timing rules
  - user preferences
  - priority and quality filters

### Match scoring

- Store detailed match explanations, not only an overall score
- Example breakdown:
  - overall: 94%
  - skills: 96%
  - experience: 88%
  - location: 100%
  - salary: 90%
  - languages: 85%

### Recommendation history

- Persist recommendation history records
- Capture why a recommendation was made
- Capture when ranking changed
- Capture how results evolved

### Service contract

- Expose a shared recommendations service:
  - `GetRecommendations(accountId)`
- This service is reused by:
  - homepage
  - mobile app
  - dashboard
  - email
  - notification delivery

### Observability

Add an independent Analytics Engine to measure:

- number of matches
- average match score
- notification open rate
- application conversion rate
- time from job publish to hire
- career profile completeness
- user distribution by status

## Consequences

### Positive

- Clear architectural boundaries
- Reduced coupling between intelligence engines
- Better future extensibility
- Easier support for new recommendation domains
- Stronger support for multi-role accounts
- Better observability and product telemetry
- More transparent match results for users and employers

### Negative

- More architectural overhead to implement
- Requires event infrastructure and coordination
- Higher initial complexity than a simple feature-based design

## Alternatives Considered

### Option 1: Keep current module-driven design

Pros:
- Simpler implementation
- Faster short-term delivery

Cons:
- High coupling between engines
- Harder to extend to new recommendation domains
- Poor support for long-term evolution

Why rejected: This architecture would likely require significant refactor later and does not support the Living Career Profile vision cleanly.

### Option 2: Microservices from day one

Pros:
- Maximum independence
- Clear separation of concerns

Cons:
- Too heavy for current scope
- Requires distributed systems operational maturity
- Increased deployment complexity

Why rejected: The current project should remain within a monolith / modular architecture while using event-driven orchestration, not full microservices.

## Related Decisions

- ADR-001: Use React for Frontend
- ADR-002: Use NestJS for Backend
- ADR-003: Use PostgreSQL for Database
- ADR-004: JWT Authentication
- ADR-005: REST API Design

## Migration Path

1. Document `Architecture v2` as the official reference.
2. Add `accountType` / role separation to the user model.
3. Add Career Profile versioning and completeness fields.
4. Introduce event definitions and event bus infrastructure.
5. Implement `Profile Engine` and `Matching Engine` as event-driven components.
6. Generalize the recommendation service.
7. Add `Opportunity Policy Engine` and `Notification Engine` integration.
8. Add Analytics Engine and tracking.

Estimated effort: Medium

## Approval

- Decision maker: Product / Architecture Committee
- Date approved: 2026-07-27
- Next review: 2027-07-27

## Notes

This ADR defines the long-term architecture for JobMap's transformation from a map-based jobs tool into an AI-powered career platform.
