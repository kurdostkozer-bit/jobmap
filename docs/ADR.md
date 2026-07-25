# 📋 Architecture Decision Records (ADR)

**Purpose:** Document all major architectural decisions made for KJF project.  
**Format:** One decision per section. Status: Accepted/Rejected/Superseded.  
**Version:** 1.0  
**Last Updated:** July 25, 2026

---

## ADR-001: Use NestJS Monolith Instead of Microservices

**Status:** ✅ ACCEPTED

**Date:** July 25, 2026

**Context:**
- Startup phase with small team (4-5 developers)
- Quick MVP needed (6-8 weeks)
- Limited DevOps resources
- Potential to scale later

**Decision:**
Use **NestJS Modular Monolith** that can evolve into microservices.

**Reasoning:**
1. **Simpler Development** — Single codebase, no distributed complexity
2. **Faster Iteration** — No inter-service communication overhead
3. **Team Size** — Perfect for 1-2 backend developers
4. **Scalability** — Can split modules into services later when traffic justifies
5. **Proven Pattern** — Many successful startups (Stripe, Slack) started monolithic

**Consequences:**
- ✅ Faster development
- ✅ Easier debugging
- ✅ Lower operational overhead
- ⚠️ May need refactoring if traffic exceeds 10K concurrent users
- ⚠️ Cannot scale independent components

**When to Revisit:**
- User base > 100K
- API response time > 1 second
- Any single module is 40%+ of total traffic

---

## ADR-002: Use Flutter for Mobile Instead of React Native

**Status:** ✅ ACCEPTED

**Date:** July 25, 2026

**Context:**
- Need iOS + Android coverage
- Team skilled in TypeScript/JavaScript
- Performance critical (mapping, real-time)
- User expectations high (native feel)

**Decision:**
Use **Flutter** with Riverpod state management.

**Reasoning:**
1. **Native Performance** — True native code, not JS bridge
2. **Single Codebase** — Better code sharing than React Native
3. **Fast Development** — Hot reload, excellent developer experience
4. **Growing Ecosystem** — Strong in MENA region
5. **UI Quality** — Built-in Material Design and Cupertino
6. **Better Maps** — Google Maps integration smoother than React Native

**Consequences:**
- ✅ Better performance for complex features
- ✅ Native UI feel
- ✅ Easier to hire (growing demand)
- ⚠️ Team needs to learn Dart
- ⚠️ Smaller ecosystem than React Native

**Validation:**
- Tested on iOS simulator and Android emulator
- Maps integration verified
- Performance acceptable for location updates

---

## ADR-003: Use PostgreSQL + PostGIS for Spatial Queries

**Status:** ✅ ACCEPTED

**Date:** July 25, 2026

**Context:**
- Core feature is location-based job search
- Need efficient spatial queries (jobs near user)
- Cannot rely on external GIS service
- Data must be self-contained

**Decision:**
Use **PostgreSQL with PostGIS extension** as single source of truth for location data.

**Reasoning:**
1. **Built-in Spatial Support** — No separate GIS service needed
2. **Efficient Queries** — Native spatial indexing (GiST, BRIN)
3. **Single Database** — Simpler operations, no data sync issues
4. **Mature & Proven** — Used by Uber, Grab, etc.
5. **Cost Effective** — No third-party GIS licensing
6. **Privacy** — All location data stays on our infrastructure

**Consequences:**
- ✅ Powerful spatial queries (distance, clustering, polygon)
- ✅ Single source of truth
- ✅ No dependency on third-party APIs
- ⚠️ Need PostGIS expertise on team
- ⚠️ Vertical scaling limit (~500K concurrent users)

**When to Revisit:**
- Need sub-millisecond query response
- Need redundant GIS infrastructure
- Scale beyond single database capability

---

## ADR-004: Use Redux Toolkit for React State, Not MobX or Context API

**Status:** ✅ ACCEPTED

**Date:** July 25, 2026

**Context:**
- Web dashboard has complex state (jobs, companies, applications, notifications)
- Team familiar with Redux pattern
- Need predictable state management
- Debugging must be straightforward

**Decision:**
Use **Redux Toolkit** (modern Redux with less boilerplate).

**Reasoning:**
1. **Industry Standard** — Most popular for enterprise React
2. **DevTools** — Excellent time-travel debugging
3. **Middleware** — Easy to intercept actions (logging, analytics)
4. **Testability** — Pure reducers easy to test
5. **Performance** — Selector memoization prevents re-renders
6. **Less Boilerplate** — Redux Toolkit removes Redux ceremony

**Not Chosen:**
- ❌ Context API — Fine for simple state, not for complex dashboards
- ❌ MobX — More magical, harder to debug
- ❌ Recoil — Too new, unproven for production
- ❌ Zustand — Good, but Redux tooling better for teams

**Consequences:**
- ✅ Predictable state flow
- ✅ Great debugging with Redux DevTools
- ✅ Easy to add middleware (logging, error tracking)
- ⚠️ More verbose than Context API
- ⚠️ Steeper learning curve for beginners

---

## ADR-005: Use Riverpod for Flutter State, Not Provider or GetX

**Status:** ✅ ACCEPTED

**Date:** July 25, 2026

**Context:**
- Flutter app needs reactive state management
- Multiple features need state sharing (auth, jobs, map, applications)
- Team values testability and compile-time safety
- Real-time updates needed (map changes, notifications)

**Decision:**
Use **Riverpod** (successor to Provider, functional approach).

**Reasoning:**
1. **Functional Approach** — No inheritance, easier to test
2. **Type Safe** — Dart generics at compile time
3. **Powerful** — Async support, invalidation, scoping built-in
4. **Testable** — No mocking framework needed
5. **Performance** — Fine-grained reactivity
6. **Modern** — Actively maintained, regular updates

**Not Chosen:**
- ❌ GetX — Too magical, harder to test, large bundle
- ❌ Provider (old) — Works, but Riverpod is better
- ❌ BLoC — More boilerplate, overkill for this project
- ❌ MobX — Too many runtime surprises

**Consequences:**
- ✅ Excellent for testability
- ✅ Fine-grained reactivity prevents over-rendering
- ✅ Clean separation of concerns
- ⚠️ Learning curve (functional programming concepts)
- ⚠️ Smaller community than Provider/GetX

---

## ADR-006: Use JWT for Stateless Authentication, Not Sessions

**Status:** ✅ ACCEPTED

**Date:** July 25, 2026

**Context:**
- API is RESTful and stateless
- Need to support both mobile and web clients
- Tokens must work across multiple servers (for future scaling)
- Need refresh token mechanism

**Decision:**
Use **JWT (JSON Web Tokens)** with refresh token rotation.

**Reasoning:**
1. **Stateless** — Server doesn't store session data
2. **Scalable** — Works with load balancers, no session affinity needed
3. **Mobile Friendly** — Standard for API-based apps
4. **Claims** — Can include user data in token (roles, permissions)
5. **Refresh Pattern** — Separate short-lived access tokens, longer-lived refresh tokens

**Not Chosen:**
- ❌ Sessions — Requires session store, session affinity, not ideal for APIs
- ❌ API Keys — Not suitable for user authentication
- ❌ OAuth 2.0 — Overkill for first release, add later

**Security Measures:**
- ✅ Tokens signed with strong secret (256-bit)
- ✅ Access token expiry: 7 days
- ✅ Refresh token expiry: 30 days
- ✅ HTTPS only (production requirement)
- ✅ HttpOnly cookies for refresh tokens (no JavaScript access)

**When to Revisit:**
- Need OAuth 2.0 for third-party integrations
- Need role-based access control (more complex than current)

---

## ADR-007: Location Anonymization (Coordinates Randomization)

**Status:** ✅ ACCEPTED

**Date:** July 25, 2026

**Context:**
- Privacy concern: job seekers should not know exact company location
- Security concern: competitors could identify company hiring
- Business concern: maintain mystery around opportunities

**Decision:**
Randomize job coordinates within district bounds (1-5 km radius).

**Implementation:**
1. Store real coordinates in database
2. Apply random offset using Haversine formula
3. Return anonymized coordinates to job seekers
4. Show only district-level information

**Reasoning:**
1. **Privacy** — Company location never exposed
2. **Competition** — Harder for competitors to track hiring patterns
3. **User Experience** — Still relevant distance information
4. **Scalability** — No additional services needed

**Consequences:**
- ✅ Strong privacy protection
- ✅ Prevents location tracking
- ⚠️ Adds slight complexity to search algorithm
- ⚠️ Users cannot see exact workplace location

**Testing Required:**
- [ ] Randomization uniform within district
- [ ] No coordinates outside district bounds
- [ ] Performance acceptable for clustering

---

## ADR-008: Use Docker Compose for Local Development, Not Kubernetes

**Status:** ✅ ACCEPTED

**Date:** July 25, 2026

**Context:**
- Team size: 4-5 developers
- MVP phase, no production scaling needed yet
- Need simple local development environment
- Database + Redis needed for development

**Decision:**
Use **Docker Compose** for local development. Defer Kubernetes until production scale.

**Reasoning:**
1. **Simple** — Single compose file for all services
2. **Fast Setup** — New developers: `docker-compose up -d`
3. **Low Overhead** — Runs on any machine with Docker
4. **When Ready** — Can move to Kubernetes later without major refactoring

**Not Chosen:**
- ❌ Kubernetes (K8s) — Overkill for MVP, steep learning curve
- ❌ Manual Docker — No orchestration, harder for team
- ❌ Minikube — Runs Kubernetes locally, too complex

**When to Migrate to Kubernetes:**
- Deployed to production
- Multiple service instances needed
- Auto-scaling required
- Blue-green deployments needed

---

## ADR-009: API Versioning Strategy

**Status:** ✅ ACCEPTED

**Date:** July 25, 2026

**Context:**
- May need to evolve API without breaking existing clients
- Mobile apps may lag behind API updates
- Web dashboard can be deployed simultaneously

**Decision:**
Use **URL path versioning** (`/api/v1/...`). Only one version during MVP.

**Reasoning:**
1. **Explicit** — Version visible in URL
2. **Easy to Support** — Can run v1 and v2 simultaneously
3. **Clear for Clients** — Mobile apps know which version to use
4. **No Query Params** — Cleaner than `/api/users?version=1`

**Versioning Rules:**
- Breaking changes → new version (`v2`)
- New endpoints → can add to current version
- Deprecated features → mark with warning, remove in next version
- Deprecation period → minimum 6 months notice

**Example:**
```
/api/v1/users          (current)
/api/v1/jobs/search    (current)
/api/v2/users          (future - breaking changes)
```

---

## ADR-010: Reject: AI/ML for MVP

**Status:** ❌ REJECTED

**Date:** July 25, 2026

**Context:**
Initial design included AI salary prediction and job recommendations.

**Decision:**
**Remove AI/ML from MVP. Add in v2.0.** Focus on core features first.

**Reasoning:**
1. **Complexity** — Adds 3-4 weeks development time
2. **Data** — Need historical data for ML models to be accurate
3. **Maintenance** — ML models need monitoring, retraining
4. **Time to Market** — MVP would be delayed significantly
5. **Risk** — Unproven ROI for startup phase

**When to Revisit:**
- v1.0 launched and getting user traction
- Have 6+ months of job posting data
- Clear business value of personalization
- Dedicated ML engineer available

**Future Path:**
- Phase 2 (v1.5): Job recommendations (simple collaborative filtering)
- Phase 3 (v2.0): AI salary prediction, career path suggestions
- Phase 4 (v2.5): Heat maps, skill demand analysis

---

## ADR-011: Reject: Microservices for MVP

**Status:** ❌ REJECTED

**Date:** July 25, 2026

**Context:**
Initial design considered splitting into multiple microservices (Auth, Jobs, Companies, etc).

**Decision:**
**Use modular monolith instead.** Microservices adds unnecessary complexity.

**Reasoning:**
1. **Operational Overhead** — Need service discovery, inter-service communication
2. **Team Size** — Too many moving parts for 4-5 developers
3. **Debugging Difficulty** — Distributed tracing, logging harder
4. **Deployment Complexity** — Each service has separate CI/CD
5. **Testing** — Integration tests become very complex

**When to Consider Microservices:**
- User base > 100K
- Revenue justifies ops team
- Different teams own different services
- Scaling requirements demand independent deployment

**Current Architecture:**
- Single monolith with clear module boundaries
- Easy to extract modules into services later
- No vendor lock-in to specific service mesh

---

## ADR-012: Reject: GraphQL for MVP

**Status:** ❌ REJECTED

**Date:** July 25, 2026

**Context:**
Considered using GraphQL instead of REST API.

**Decision:**
**Stick with REST API.** GraphQL adds unnecessary complexity for MVP.

**Reasoning:**
1. **Learning Curve** — Team not familiar with GraphQL best practices
2. **Caching** — HTTP caching less effective with GraphQL
3. **Monitoring** — REST endpoints easier to monitor than GraphQL
4. **Client Support** — Flutter/React libraries more mature for REST
5. **Debugging** — REST errors clearer than GraphQL errors

**When to Consider GraphQL:**
- Need flexible data fetching from frontend
- Have multiple client types with different data needs
- Dedicated GraphQL expert on team
- Operational maturity to debug GraphQL issues

**For Now:**
- REST API with clear naming
- Pagination built-in
- Can add GraphQL layer later if needed

---

## Summary of Decisions

| ADR | Decision | Status | Type |
|-----|----------|--------|------|
| 001 | NestJS Monolith | ✅ | Architecture |
| 002 | Flutter Mobile | ✅ | Technology |
| 003 | PostgreSQL + PostGIS | ✅ | Database |
| 004 | Redux Toolkit | ✅ | State Mgmt |
| 005 | Riverpod | ✅ | State Mgmt |
| 006 | JWT Authentication | ✅ | Security |
| 007 | Location Anonymization | ✅ | Privacy |
| 008 | Docker Compose | ✅ | DevOps |
| 009 | REST API Versioning | ✅ | API Design |
| 010 | No AI/ML for MVP | ❌ | Feature |
| 011 | No Microservices MVP | ❌ | Architecture |
| 012 | No GraphQL for MVP | ❌ | API Design |

---

## How to Use This Document

**For New Team Members:**
- Read ADRs relevant to your area
- Understand the "why" behind decisions
- Don't ask "why didn't we use X?" — check here first

**For Future Decisions:**
- Create a new ADR for any architectural decision
- Reference existing ADRs if changing approach
- Update status (Accepted/Superseded) when decisions change

**For Retrospectives:**
- Review ADRs quarterly
- Validate decisions still make sense
- Update ADRs if circumstances changed

---

**Document Owner:** Tech Lead  
**Last Reviewed:** July 25, 2026  
**Next Review:** After Sprint 3 (September 2026)

---

## Appendix: Decision Template

When creating new ADRs:

```markdown
## ADR-XXX: [Decision Title]

**Status:** [ACCEPTED/REJECTED/SUPERSEDED]

**Date:** [Date]

**Context:**
[Why did we need to make this decision?]

**Decision:**
[What did we decide?]

**Reasoning:**
[Why this is the best option]

**Consequences:**
[Positive and negative outcomes]

**When to Revisit:**
[Conditions that would make us reconsider]
```

---
