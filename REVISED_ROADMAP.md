# JobMap — Revised Roadmap

**Updated:** 2026-07-26  
**Philosophy:** Validate before building. Foundation first.

---

## Completed ✅

- ✅ **P1** — Map Core Engine
  - Map bounds-based search
  - Debounced interactions
  - "Search This Area" button
  
- ✅ **P1.5** — Production Backend Integration
  - Real API endpoint
  - Caching (5 min TTL)
  - Error handling + retry
  
- ✅ **P2-A** — Marker Engine
  - Independent marker service
  - Salary-colored icons
  - Selection state
  
- ✅ **P2-B** — Spatial Clustering Engine
  - Zoom-aware grid hashing
  - Stable cluster IDs
  - Rich statistics

---

## In Progress ⏳

- ⏳ **P2.9** — Production Validation ⭐ NEW & CRITICAL
  - Backend performance testing (10 to 10,000 jobs)
  - Database EXPLAIN ANALYZE (verify indexes work)
  - Real Iraq data testing
  - 10-minute navigation stress test
  - Memory leak detection
  - Cache validation
  - Marker selection lifecycle
  - Concurrent load testing
  
  **Timeline:** 4-6 weeks  
  **Blocker:** P3 CANNOT start until P2.9 ✅

---

## Planned 🔮

- ⏳ **P3** — Discovery Engine (NOT just filters)
  - Filter controls (category, salary, employment, experience, company, date)
  - Sorting (salary, distance, date, relevance)
  - Ranking algorithm
  - Saved searches
  - Recommendations
  - Integration with clustering
  
  **Prerequisite:** P2.9 must PASS ✅

- ⏳ **P4** — Saved Jobs
  - Bookmark functionality
  - Saved job list
  - Sync with backend

- ⏳ **P5** — Real-time Updates
  - WebSocket integration
  - Live job notifications
  - Live cluster updates

- ⏳ **P6** — Heat Map
  - Color intensity by salary
  - Overlay mode
  - Toggle on/off

- ⏳ **P7** — Route Navigation
  - Directions between jobs
  - Commute time estimation
  - Route optimization

- ⏳ **P8** — AI Recommendations
  - Job suggestions
  - High-demand area detection
  - Personalized feed

---

## Critical Gate: P2.9

### Why It Matters

The architecture is sound (P1-P2B), but **UNVALIDATED**.

**Risk:** Launch P3 on unstable foundation → expensive refactoring later

### What P2.9 Tests

1. **Can the backend handle 10,000 jobs?**
2. **Does the database use indexes correctly?**
3. **Does the frontend leak memory?**
4. **Does clustering perform at scale?**
5. **Does caching actually work?**
6. **What's the breaking point?**

### Pass/Fail Criteria

| Test | Must Pass | Nice to Have |
|------|-----------|-------------|
| Response time (1K jobs) | <500ms | <300ms |
| Database | Uses index | Uses BRIN |
| Memory | Stable | <100MB |
| FPS | 50+ | 60 |
| No crashes | ✅ | — |

### If P2.9 Fails

1. Diagnose issue
2. Fix (optimize, refactor, redesign)
3. Re-test
4. THEN move to P3

---

## Architecture Evolution

```
P1 (Map)
  ↓
P1.5 (Real API)
  ↓
P2-A (Marker Engine)
  ↓
P2-B (Clustering)
  ↓
P2.9 (Validation) ⭐ YOU ARE HERE
  ↓
  IF PASS:
    P3 (Discovery Engine)
    ↓
    P4-P8 (Extensions)
  ↓
  IF FAIL:
    [Debug] → [Fix] → [Re-test P2.9]
```

---

## Key Decisions

### Decision 1: Validate Before Innovate

**Previous:** "Add features as we go"  
**Now:** "Prove it works first"

**Rationale:** 
- P3 is complex (filters + ranking + recommendations)
- Built on foundation of P1-P2B
- If foundation is shaky, P3 will be shaky

### Decision 2: Real Data, Not Mock

**Previous:** "Test with synthetic data"  
**Now:** "Test with Iraq geography + real job distribution"

**Rationale:**
- Synthetic data hides real patterns
- Iraq has dense (Baghdad) and sparse (Najaf) areas
- Clustering needs to handle both

### Decision 3: Stress > Happy Path

**Previous:** "Test normal usage"  
**Now:** "Test extreme usage + edge cases"

**Rationale:**
- System might work with 1 user
- Will it work with 10,000 concurrent searches?
- Will memory leak after 1 hour?

---

## Timeline Estimate

| Phase | Weeks | Status |
|-------|-------|--------|
| P1-P2B | ✅ Done | Completed |
| **P2.9** | **4-6** | **IN PROGRESS** |
| P3 | 4-6 | Blocked on P2.9 ✅ |
| P4-P8 | 2-3 each | After P3 |

**Total to MVP:** ~12-15 weeks (P1-P3)

---

## Resource Allocation

### P2.9 Needs

- **1 Backend Engineer** (database optimization, load testing)
- **1 DevOps Engineer** (monitoring, infrastructure)
- **1 QA Engineer** (test automation, stress testing)
- **1 Architect** (design decisions, bottleneck analysis)

**Part-time:** AI Agent (documentation, test scripts)

---

## Success Metrics

### P2.9 Success

✅ All tests pass  
✅ No memory leaks  
✅ Performance baseline documented  
✅ Optimization recommendations identified  
✅ Ready for P3 ✅  

### P3 Success

✅ Filters reduce result set by 80%+  
✅ Sorting maintains cluster logic  
✅ Ranking improves job relevance  
✅ Saved searches work correctly  

### Overall MVP Success

✅ 100+ jobs visible on map  
✅ Clustering at any zoom level  
✅ Filtering + sorting works  
✅ <500ms response time  
✅ No memory leaks over 1 hour  
✅ Handles 100 concurrent users  

---

## Dependencies

**P2.9 requires:**
- ✅ Backend running (P1.5)
- ✅ Database populated (test data)
- ✅ API stable (P1.5)
- ✅ Monitoring tools (Prometheus, DataDog, etc.)

**P3 requires:**
- ✅ P2.9 PASSED
- ✅ Architecture validated
- ✅ Performance baseline established

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|-----------|
| P2.9 finds critical issues | High | Fix before P3; extend timeline |
| Load testing shows 10K too slow | High | Optimize DB/API; consider sharding |
| Memory leak discovered | High | Fix; re-test; validate |
| Database can't scale | High | Migrate to better index strategy |
| Clustering degrades at scale | Medium | Switch algorithm (QuadTree) |

---

## Communication Plan

### Weekly Status

- Monday: Test plan + resource needs
- Wednesday: Initial results
- Friday: Full report + recommendations

### Escalation

If test shows breaking issue:
1. Notify stakeholders immediately
2. Assess fix complexity
3. Re-plan timeline
4. Update roadmap

---

## Next Steps (Immediate)

1. **Assemble P2.9 team**
   - Backend engineer
   - DevOps engineer
   - QA engineer

2. **Prepare test environment**
   - Staging server
   - Test database (separate from production)
   - Monitoring tools set up

3. **Generate Iraq dataset**
   - 10,000 jobs across 8 cities
   - Realistic salary ranges
   - Realistic category distribution

4. **Run first test (Week 1)**
   - Backend performance with 100 jobs
   - Establish baseline

5. **Iterate through matrix**
   - 10 → 100 → 1,000 → 10,000 jobs
   - Document each level
   - Identify bottlenecks

---

## Open Questions (To Be Answered by P2.9)

1. **How many jobs can API handle?**
   - Answer: X jobs @ <500ms response

2. **How much memory does frontend use?**
   - Answer: Y MB baseline; Z MB peak

3. **Does caching work as designed?**
   - Answer: X% cache hit rate

4. **What's the optimal cluster size?**
   - Answer: 10-50 jobs per cluster

5. **Can system handle 100 concurrent users?**
   - Answer: Yes/No; if no, what's limit?

6. **Are there memory leaks?**
   - Answer: Yes/No; if yes, locations identified

---

## Closing Note

**P2.9 is not glamorous.**

No new features. No UI changes. No product announcements.

**But P2.9 is the difference between:**

❌ Building P3 on sand  
✅ Building P3 on rock

**Only after P2.9 PASSES do we have confidence in the foundation.**

Then P3 becomes feasible. Then P4-P8 become possible.

---

**Status:** 🟠 **PLANNING COMPLETE — READY TO EXECUTE**  
**Next:** Execute P2.9 test matrix  
**Timeline:** 4-6 weeks  
**Criticality:** ⭐⭐⭐⭐⭐ (BLOCKS P3)
