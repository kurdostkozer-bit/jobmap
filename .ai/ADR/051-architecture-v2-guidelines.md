# ADR-051: Architecture v2 Guidelines for JobMap Career Platform

## Status

Accepted

## Context

JobMap is transitioning from a map-based job discovery tool into a career platform with intelligent professional profiling, multi-role support, and event-driven recommendation infrastructure.

The architecture must support:
- Job seekers
- Employers
- Recruitment agencies
- Living career profiles with versioning
- Independent intelligence engines
- Policy-driven opportunity filtering
- Generalized recommendation domains
- Observability and analytics
- Long-term extensibility without repeated structural refactoring

## Decision

Adopt `Architecture v2` as the official platform architecture for JobMap, with the following documented guidelines.

### System layers

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
  - Accounts and roles
- **Domain Layer**
  - Business rules
  - Career Profile lifecycle and versioning
  - Status and permissions
  - Role-specific workflows
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
  - File storage
  - Push notifications
  - Maps
  - Payment gateway
  - Event bus / messaging

### User/Role model

- Separate `Account` from `Role`.
- Allow a single account to own multiple roles over time.
- Primary roles:
  - `JOB_SEEKER`
  - `EMPLOYER`
  - `RECRUITMENT_AGENCY`
- Use role selection during onboarding after verification.
- `accountType` becomes an attribute of account identity, while roles remain flexible.

### Career Profile model

- `Career Profile` is the primary living entity.
- It is the source of truth for professional data.
- It is not derived from a CV.
- Generated documents are outputs of the Career Profile.
- Career Profile supports versioning:
  - each update creates a new version
  - previous versions are retained for audit and rollback
- Track `Profile Completeness` and surface improvement suggestions.

### Engine independence and event-driven orchestration

- Intelligence engines must be independent.
- Use events rather than direct calls between engines.
- Example orchestration:
  - `CareerProfileUpdated` → `Profile Engine`
  - `ProfileBuilt` → `Matching Engine`
  - `MatchingCompleted` → `Recommendation Engine`
  - `RecommendationUpdated` → `Opportunity Policy Engine`
  - `OpportunityDecisionMade` → `Notification Engine`
- This decouples the system and makes it extensible.

### Recommendation Engine

- The Recommendation Engine is generic.
- It should support recommendations for:
  - jobs
  - companies
  - courses
  - mentors
  - events
  - certifications
- It should be exposed as a shared service, e.g. `GetRecommendations(accountId)`.

### Opportunity Policy Engine

- Rename to `Opportunity Policy Engine`.
- It enforces platform policies such as:
  - maximum notification volume
  - opportunity prioritization
  - deduplication
  - timing controls
  - user preference respect
- It should decide whether a recommendation becomes a notification.

### Match explanations

- Store detailed match explanations, not only overall score.
- Example breakdown:
  - overall: 94%
  - skills: 96%
  - experience: 88%
  - location: 100%
  - salary: 90%
  - languages: 85%
- These explanations improve transparency for users and employers.

### Recommendation history

- Persist recommendation history records.
- Store why a recommendation was made, when it changed, and how it evolved.
- Support audits and future product improvements.

### Observability

- Add an `Analytics Engine` to capture product telemetry.
- Track metrics such as:
  - number of matches
  - average match score
  - notification open rate
  - application conversion rate
  - time from publish to hire
  - career profile completeness
  - user distribution by status

## Consequences

### Positive

- Clear separation of concerns
- Reduced coupling between intelligence components
- Better extensibility for new recommendation domains
- Support for multi-role accounts and agency workflows
- Transparent matching and recommendation history
- Stronger analytics foundation

### Negative

- Increased architectural overhead initially
- More infrastructure required for event handling
- More coordination between layers
- Requires disciplined implementation

## Alternatives Considered

### Option 1: Monolithic module chaining

Pros:
- Simple to implement
- Fast initial delivery

Cons:
- High coupling
- Hard to extend
- Poor long-term maintainability

Why rejected: This approach would undermine the long-term vision and force later refactors.

### Option 2: Full microservices architecture

Pros:
- Maximal independence
- Clear separation

Cons:
- Too heavy for current scope
- Operational complexity
- High delivery overhead

Why rejected: The current project should remain modular and event-driven without full microservices complexity.

## Related Decisions

- ADR-001: Use React for Frontend
- ADR-002: Use NestJS for Backend
- ADR-003: Use PostgreSQL for Database
- ADR-004: JWT Authentication
- ADR-005: REST API Design
- ADR-050: Career Platform Core Architecture

## Migration Path

1. Record Architecture v2 as the official platform reference.
2. Implement account/role separation.
3. Add Career Profile versioning and completeness tracking.
4. Build event bus / event definitions.
5. Implement independent intelligence engines.
6. Generalize recommendation service.
7. Add Opportunity Policy Engine and notification orchestration.
8. Add Analytics Engine and observability instrumentation.

Estimated effort: Medium

## Approval

- Decision maker: Product / Architecture Committee
- Date approved: 2026-07-27
- Next review: 2027-07-27

## Notes

This ADR defines the Architecture v2 guidelines for JobMap's transformation into an AI-powered career platform.