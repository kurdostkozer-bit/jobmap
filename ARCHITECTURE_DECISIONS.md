# Architecture Decisions - JobMap

## ADR-001: Map-First Architecture

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** JobMap is fundamentally different from traditional job boards - the map IS the app, not a feature.

### Decision

The application uses **Map-First Architecture** where:

1. **Map Bounds = Source of Truth for Jobs**
   - All job listings are determined by current map view
   - No background queries or pre-loaded data
   - Zero state: empty map until user searches

2. **No City/Region Selection**
   - GPS location is primary
   - Map bounds (north, south, east, west) are used, never city names
   - Enables precise geolocation at any scale

3. **Debounced Search Pattern**
   - User pans/zooms → bounds change
   - 400ms debounce → "Search this area" button appears
   - No automatic requests (avoids API spam)
   - Gives users control over search timing

4. **Duplicate Request Prevention**
   - Track previous bounds
   - Only search if bounds changed significantly (>~1km threshold)
   - Cache previous results during re-centering

### Consequences

**Positive:**
- Clear mental model: map = data source
- Efficient API usage (user-triggered searches only)
- Intuitive UX (similar to Google Maps)
- Scales well (no pre-loading)

**Negative:**
- Requires educating users ("use the button")
- Edge case: users expect real-time updates
- No background data fetching during idle

**Mitigations:**
- P7 adds real-time updates via WebSocket
- Onboarding explains the interaction pattern
- Analytics track user behavior

---

## ADR-002: Extended Job Data Model

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** Initial P1 data model was minimal. Adding fields later breaks API contracts.

### Decision

Job objects include all fields needed through P8:

```javascript
{
  // Core (P1)
  id, latitude, longitude,
  company, title,
  salary, salaryMin, salaryMax,
  
  // Classification (P3)
  employmentType, category, status,
  
  // Extended (P4+)
  createdAt, updatedAt, description,
  skills, applicants
}
```

### Consequences

**Positive:**
- No API migrations needed for P2-P8
- Filters ready for implementation (P3)
- Backend scales naturally
- Clear extension points

**Negative:**
- Initial payload slightly larger
- More database fields to manage

**Mitigations:**
- Payload size is negligible (~2KB per job)
- Unused fields don't affect P1 UI
- Documentation explains future usage

---

## ADR-003: Bounds-Based API Over Spatial Indexing

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** Two approaches: client-side filtering vs server-side spatial queries.

### Decision

Use server-side spatial queries:

```sql
WHERE latitude BETWEEN south AND north
AND longitude BETWEEN west AND east
```

### Rationale

| Approach | Pros | Cons |
|----------|------|------|
| **Server bounds** | ✅ Scales to millions of jobs | ❌ API required |
| | ✅ Accurate filtering | |
| | ✅ Database optimization possible | |
| **Client filtering** | ✅ No backend needed | ❌ Transfer all data |
| | ✅ Instant results | ❌ Scales poorly |
| | | ❌ Battery drain (mobile) |

### Consequences

- Backend must implement spatial queries
- Database needs lat/lng indexes
- Client is "dumb" (good for separation of concerns)

---

## ADR-004: React Hooks Over Class Components

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** State management in MapHomePage

### Decision

Use React Hooks (useState, useCallback, useEffect, useRef) exclusively.

### Consequences

**Positive:**
- Modern React patterns
- Easier testing
- Code reusability
- Clear dependency management

**Negative:**
- Rules of Hooks must be followed strictly
- Conditional logic must be careful

**Enforcement:**
- ESLint `react-hooks/rules-of-hooks`
- Pre-commit hooks check for violations

---

## ADR-005: Leaflet.js + OpenStreetMap Over Commercial Maps

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** Map library choice

### Decision

Use **Leaflet.js** with **OpenStreetMap** tiles (free, open-source).

### Trade-offs

| Library | Pros | Cons |
|---------|------|------|
| **Leaflet + OSM** | Free, lightweight | Less detailed tiles |
| | Open source | Community maintenance |
| | Full control | No real-time traffic |
| **Google Maps API** | Detailed, professional | $$$$ per request |
| | Real-time traffic | Vendor lock-in |
| | Clustering built-in | Rate limits |
| **Mapbox GL** | High performance | Custom pricing |
| | Beautiful tiles | Requires API key |

### Future Migration Path

If needed, can replace Leaflet with:
- Mapbox GL (1:1 API replacement, mostly)
- Google Maps API (requires refactoring)

---

## ADR-006: localStorage for Onboarding State

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** Remembering user's geolocation permission choice

### Decision

Store in `localStorage`:
- `jobmap_location_granted` (boolean)
- `jobmap_last_location` (lat, lng)

### Consequences

**Positive:**
- Zero backend required
- Instant availability
- Works offline

**Negative:**
- Not synced across devices
- Cleared on browser clear
- Data limited to ~5-10MB

**Future:**
- P7 will sync to backend
- Enable cross-device sync
- Server-side backup

---

## ADR-007: Mock API in P1, Real Backend in P2

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** Development speed vs. integration timing

### Decision

P1 uses mock API (`setTimeout(...)`). Real API integration in P2.

### Consequences

- P1 ships quickly
- API contract well-defined (JOBS_API_SPEC.md)
- No backend dependency during P1 development
- P2 can plug in real backend seamlessly

---

## ADR-008: No Clustering in P1

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** Feature prioritization

### Decision

Clustering implemented in P2, not P1.

### Rationale

- P1 focuses on core map interaction
- Clustering adds complexity
- Better with stable data flow
- P2 can improve marker density handling

---

## ADR-009: Job Bubble vs. Modal

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** Job detail UI

### Decision

Use small **Bubble popup** (fixed position, bottom-right) instead of modal.

### Consequences

**Bubble Advantages:**
- ✅ Map remains visible
- ✅ User can pan around
- ✅ Lightweight UI
- ✅ Mobile-friendly

**Modal Disadvantages:**
- ❌ Blocks map
- ❌ Interrupts exploration
- ❌ Heavy on mobile

---

## ADR-010: Roadmap Phases

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** Feature prioritization for sustainable growth

### Decision

Follow this phase order:

| Phase | Focus | Timeline |
|-------|-------|----------|
| P1 | Core map engine | ✅ Done |
| P2 | Clustering | 2 weeks |
| P3 | Advanced filters | 2 weeks |
| P4 | Route navigation | 1 week |
| P5 | Heat map | 1 week |
| P6 | Salary layer | 1 week |
| P7 | Real-time updates | 2 weeks |
| P8 | AI recommendations | 3 weeks |

### Rationale

- Each phase builds on previous
- No rework needed
- Clear milestones
- Sustainable pace

---

## ADR-011: Extensible API Design

**Status:** Accepted  
**Date:** 2024-01-15  
**Context:** API endpoint design

### Decision

Use **nested objects** in API requests/responses:

```json
{
  "bounds": {...},
  "filters": {...},
  "pagination": {...}
}
```

Instead of flat structure:

```json
{
  "north", "south", "east", "west",
  "filterType1", "filterType2", ...,
  "limit", "offset"
}
```

### Consequences

- ✅ Easy to extend
- ✅ Grouped semantically
- ✅ No naming conflicts
- ✅ Version-safe

---

## Decision Framework

When making architectural decisions, prioritize:

1. **User Experience** - Jobs should be discoverable
2. **Code Maintainability** - Easy to understand and modify
3. **Performance** - Should be fast, but not at cost of UX
4. **Scalability** - Design for growth, not just current scale
5. **Cost** - Prefer free/open-source when viable

---

## Document Maintenance

| Document | Responsibility | Review Frequency |
|----------|-----------------|-----------------|
| MAP_CORE_ENGINE.md | Frontend Team | Weekly |
| JOBS_API_SPEC.md | Backend Team | Weekly |
| ARCHITECTURE_DECISIONS.md | Tech Lead | Monthly |

---

## Appendix: Rejected Alternatives

### A. City-Based Search
- **Rejected:** Doesn't support precise location-based hiring
- **Alternative:** GPS + map bounds (chosen)

### B. Multiple Markers as Separate Objects
- **Rejected:** Performance issues with 1000+ markers
- **Alternative:** Clustering in P2 (chosen)

### C. Full-Page Modal for Job Details
- **Rejected:** Blocks map visibility
- **Alternative:** Small bubble popup (chosen)

### D. Auto-Search on Map Movement
- **Rejected:** API spam, poor UX
- **Alternative:** Debounced search button (chosen)

