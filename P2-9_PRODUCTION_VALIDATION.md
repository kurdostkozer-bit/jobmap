# P2.9 — Production Validation

**Status:** 🔴 Planning  
**Purpose:** Validate architecture with real data, real load, real scenarios  
**Critical:** Must pass before P3 (Discovery Engine)

---

## Why P2.9 Is Essential

The system has solid architecture (P1 → P1.5 → P2-A → P2-B), but:

❌ **Never tested with real data**  
❌ **Never tested with real load**  
❌ **Never tested with sustained usage**  
❌ **Never tested for memory leaks**  
❌ **Never tested with Iraq's geography**

**Risk:** Launch Discovery Engine on unstable foundation = expensive refactoring later.

---

## Test Matrix

### 1. Backend Performance Testing

**Objective:** Verify `/api/jobs/search/bounds` scales correctly.

#### Test Scenarios

| Scenario | Jobs | Expected Time | Threshold |
|----------|------|----------------|-----------|
| Light | 10 | <50ms | <100ms |
| Medium | 100 | <100ms | <200ms |
| Heavy | 1,000 | <300ms | <500ms |
| Stress | 10,000 | <1000ms | <2000ms |

#### Metrics to Monitor

For each request:
- Response time (total)
- Database query time
- JSON serialization time
- Memory peak
- CPU utilization
- Network latency

#### Test Commands

```bash
# Install load testing tools
npm install -g autocannon

# Light test (10 jobs)
curl -X POST http://localhost:5000/api/jobs/search/bounds \
  -H "Content-Type: application/json" \
  -d '{
    "bounds": {"north": 33.5, "south": 33.0, "east": 44.5, "west": 44.0},
    "zoom": 10,
    "filters": {}
  }' | jq '.stats'

# Monitor backend
# Terminal 1: npm run dev (backend)
# Terminal 2: node monitor-backend.js (custom script)
# Terminal 3: autocannon -c 10 -d 30 http://localhost:5000/api/jobs/search/bounds
```

---

### 2. Database Validation

**Objective:** Ensure queries use indexes correctly.

#### EXPLAIN ANALYZE Queries

```sql
-- Query 1: Basic bounds search
EXPLAIN ANALYZE
SELECT id, title, company, latitude, longitude, salary
FROM jobs
WHERE latitude BETWEEN 33.0 AND 33.5
  AND longitude BETWEEN 44.0 AND 44.5
ORDER BY salary DESC
LIMIT 100;

-- Query 2: With filters
EXPLAIN ANALYZE
SELECT id, title, company, latitude, longitude, salary
FROM jobs
WHERE latitude BETWEEN 33.0 AND 33.5
  AND longitude BETWEEN 44.0 AND 44.5
  AND category = 'IT'
  AND salary_min >= 800000
ORDER BY salary DESC
LIMIT 100;

-- Query 3: Geographic index (PostGIS if available)
EXPLAIN ANALYZE
SELECT id, title, company, latitude, longitude, salary
FROM jobs
WHERE ST_DWithin(
  ST_Point(longitude, latitude)::geography,
  ST_Point(44.25, 33.25)::geography,
  50000  -- 50km radius
)
LIMIT 100;

-- Query 4: Clustering simulation (get job counts per grid cell)
EXPLAIN ANALYZE
SELECT 
  FLOOR(latitude / 0.01) as lat_cell,
  FLOOR(longitude / 0.01) as lng_cell,
  COUNT(*) as count
FROM jobs
WHERE latitude BETWEEN 33.0 AND 33.5
  AND longitude BETWEEN 44.0 AND 44.5
GROUP BY lat_cell, lng_cell;
```

#### Expected Output

✅ **Should see:**
```
Seq Scan ... (if using index)
Index Scan on idx_latitude_longitude
Execution time: X.XXms
```

❌ **Red flags:**
```
Seq Scan on jobs (no index!)
Full Table Scan
Execution time: 5000+ms
```

#### Index Creation (if missing)

```sql
-- Create composite index
CREATE INDEX idx_jobs_bounds 
ON jobs (latitude, longitude) 
WHERE status = 'active';

-- Create BRIN index (for large tables)
CREATE INDEX idx_jobs_brin_geo 
ON jobs USING BRIN (latitude, longitude);

-- Analyze indexes
ANALYZE jobs;
VACUUM ANALYZE jobs;
```

---

### 3. Real Iraq Data Test

**Objective:** Test with realistic Iraqi geography.

#### Dataset Schema

```json
{
  "jobs": [
    {
      "id": "job-001",
      "title": "Senior Developer",
      "company": "Tech Company",
      "latitude": 33.3136,
      "longitude": 44.3615,
      "category": "IT",
      "salary_min": 1000000,
      "salary_max": 1500000,
      "employment_type": "full-time",
      "location_name": "Baghdad"
    }
  ]
}
```

#### Iraqi Cities Distribution

Create realistic dataset:

| City | Latitude | Longitude | Jobs | Density |
|------|----------|-----------|------|---------|
| Baghdad | 33.3136 | 44.3615 | 2000 | Dense |
| Erbil | 36.1914 | 44.0061 | 500 | Medium |
| Sulaymaniyah | 35.5607 | 45.4385 | 300 | Medium |
| Dohuk | 36.8753 | 42.9922 | 200 | Sparse |
| Kirkuk | 35.4733 | 44.0092 | 250 | Medium |
| Basra | 30.4972 | 47.8092 | 400 | Medium |
| Najaf | 31.9429 | 44.3615 | 150 | Sparse |
| Mosul | 36.3429 | 43.1586 | 800 | Dense |

**Total Dataset:** 10,000 jobs spread across cities

#### Test Script

```bash
# Generate Iraq test data
node scripts/generate-iraq-data.js > iraq-jobs.json

# Seed database
psql -U postgres -d jobmap -f scripts/seed-iraq-data.sql

# Verify data
SELECT location_name, COUNT(*) FROM jobs GROUP BY location_name;
```

---

### 4. Navigation Stress Test

**Objective:** Simulate 10 minutes of continuous user interaction.

#### Test Scenario

```
User Location: Baghdad (33.3136, 44.3615)
Action Sequence (repeat 10x over 10 minutes):

1. Initial Search (Zoom 7)
   ↓
2. Zoom In (Zoom 10)
   ↓
3. Pan Left
   ↓
4. Search This Area
   ↓
5. Zoom In (Zoom 13)
   ↓
6. Click Marker
   ↓
7. Close Bubble
   ↓
8. Pan to Mosul
   ↓
9. Search This Area
   ↓
10. Zoom Out (Zoom 7)
    ↓
    [REPEAT]
```

#### Metrics to Monitor

**Frontend (Browser DevTools):**
- Memory: Should not increase continuously (no leak)
- FPS: Should stay 50+ FPS
- Network: Should see cached results for repeated bounds
- DOM nodes: Should not accumulate markers

**Backend:**
- Request count: Should decrease for repeated bounds (cache hit)
- Response time: Should remain consistent
- Database connections: Should stay stable
- CPU/Memory: Should not spike

#### Test Script

```javascript
// frontend/stress-test.js
async function stressTest() {
  const actions = [
    { name: 'zoom', zoom: 7 },
    { name: 'zoom', zoom: 10 },
    { name: 'pan', lat: 33.3, lng: 44.2 },
    { name: 'search' },
    { name: 'zoom', zoom: 13 },
    { name: 'marker', index: 0 },
    { name: 'close' },
    { name: 'pan', lat: 36.34, lng: 43.16 }, // Mosul
    { name: 'search' },
    { name: 'zoom', zoom: 7 }
  ];

  for (let cycle = 0; cycle < 10; cycle++) {
    for (const action of actions) {
      await executeAction(action);
      await sleep(3000); // 3 seconds between actions
    }
  }
}
```

---

### 5. Memory Leak Detection

**Objective:** Ensure no memory leaks in Leaflet + React.

#### Leak Sources to Check

1. **Leaflet Markers**
   - Are old markers removed when search updates?
   - Are event listeners detached?
   - Are layer groups cleared?

2. **React Components**
   - Are useEffect cleanup functions called?
   - Are refs properly cleared?
   - Are cached objects garbage collected?

3. **DOM Nodes**
   - Are popups removed from DOM?
   - Are tile layers cleaned up?
   - Are SVG elements disposed?

#### Detection Method

```javascript
// Browser Console
// Monitor memory every 10 seconds during stress test

setInterval(() => {
  if (performance.memory) {
    console.log({
      jsHeapSize: (performance.memory.jsHeapSize / 1048576).toFixed(2) + ' MB',
      jsHeapLimit: (performance.memory.jsHeapLimit / 1048576).toFixed(2) + ' MB',
      external: (performance.memory.externalMemoryUsage / 1048576).toFixed(2) + ' MB'
    });
  }
}, 10000);

// Expected: Memory should stabilize after initial load
// Should NOT continuously increase
```

#### Chrome DevTools Profiling

```
1. Open DevTools → Memory tab
2. Take heap snapshot (baseline)
3. Run stress test for 5 minutes
4. Take heap snapshot (after)
5. Compare snapshots
6. Look for:
   - Detached DOM nodes
   - Retained objects
   - Growing arrays
```

---

### 6. Cache Validation

**Objective:** Verify caching works correctly.

#### Test Scenario

```
A. Search Baghdad (bounds1) → API call #1
   ↓
B. Pan slightly → Same bounds (within threshold)
   ↓
C. Search Baghdad (bounds1) → Should use cache (NO API call)
   ↓
D. Wait 5+ minutes
   ↓
E. Search Baghdad (bounds1) → Cache expired, API call #2
   ↓
F. Pan to Mosul (bounds2) → API call #3
   ↓
G. Search Mosul (bounds2) → Should use cache
```

#### Verification

Open DevTools → Network tab

Expected:
```
Request 1: POST /api/jobs/search/bounds → 200 (200ms)
Request 2: (none - cache hit)
Request 3: (after 5 min) POST /api/jobs/search/bounds → 200 (200ms)
Request 4: POST /api/jobs/search/bounds → 200 (200ms)
Request 5: (none - cache hit)
```

#### Cache Configuration

```javascript
// Current: 5 minutes
const CACHE_DURATION_MS = 5 * 60 * 1000;

// Should verify this is adequate
// Consider adjusting based on:
// - API response time (how fresh does data need to be?)
// - User behavior (how often do people re-search?)
// - Staleness tolerance (how old is too old?)
```

---

### 7. Marker Selection Lifecycle

**Objective:** Verify marker selection doesn't break under rapid changes.

#### Test Scenario

```
1. Click Marker A
   ↓
2. Bubble shows Job A details
   ↓
3. Pan map
   ↓
4. Search This Area
   ↓
5. New results appear
   ↓
6. Marker A still selected? (should be NO)
   ↓
7. Click Marker B
   ↓
8. Bubble shows Job B details
   ↓
9. Repeat 50x rapidly
```

#### Checks

- [ ] Old bubble closes when new search runs
- [ ] Marker highlights clear when search updates
- [ ] No "zombie" markers stay highlighted
- [ ] Sidebar list updates correctly
- [ ] No console errors
- [ ] Memory doesn't leak

#### Test Script

```javascript
async function markerSelectionTest() {
  for (let i = 0; i < 50; i++) {
    const marker = getRandomMarker();
    marker.click();
    await sleep(500);
    
    const bubble = document.querySelector('.job-bubble');
    assert(bubble !== null, 'Bubble should exist');
    assert(bubble.textContent.includes(marker.title), 'Bubble should show correct job');
    
    panMap();
    await sleep(500);
    
    searchThisArea();
    await sleep(1000);
    
    // Old marker should not be selected anymore
    assert(!marker.classList.contains('selected'), 'Old marker should not be selected');
  }
}
```

---

### 8. Stress Test (Simulated High Load)

**Objective:** Test system under extreme load.

#### Scenario A: Multiple Concurrent Searches

```bash
# Use autocannon to simulate 100 concurrent users
autocannon \
  --connections=100 \
  --duration=30 \
  --requests='[{"path":"/api/jobs/search/bounds","method":"POST","body":"..."}]' \
  http://localhost:5000

# Monitor:
# - Requests/sec
# - Latency (p50, p95, p99)
# - Errors
# - Throughput
```

#### Scenario B: Large Result Sets

```sql
-- Insert 50,000 jobs in Baghdad area
INSERT INTO jobs (title, company, latitude, longitude, ...)
SELECT 
  'Job ' || seq,
  'Company ' || (seq % 100),
  33.31 + (random() * 0.02),
  44.36 + (random() * 0.02),
  ...
FROM generate_series(1, 50000) AS t(seq);

-- Now search
curl -X POST http://localhost:5000/api/jobs/search/bounds \
  -d '{"bounds": {"north": 33.35, "south": 33.29, "east": 44.40, "west": 44.32}}'

# Monitor response time, clustering time
```

#### Scenario C: Pagination Under Load

```bash
# Test pagination with large result sets
for offset in 0 100 200 500 1000; do
  time curl -X POST http://localhost:5000/api/jobs/search/bounds \
    -d "{\"offset\": $offset, \"limit\": 100}"
done

# Should show consistent pagination performance
```

---

## Testing Checklist

### Week 1: Backend Performance

- [ ] 1.1 — Run 4 load tests (10, 100, 1000, 10000 jobs)
- [ ] 1.2 — Document response times
- [ ] 1.3 — Identify bottlenecks
- [ ] 1.4 — Optimize if needed (indexes, queries, caching)

### Week 2: Database Validation

- [ ] 2.1 — Run EXPLAIN ANALYZE on 4 queries
- [ ] 2.2 — Verify indexes are used
- [ ] 2.3 — Check for full table scans
- [ ] 2.4 — Create missing indexes if needed
- [ ] 2.5 — Performance test with indexes

### Week 3: Real Data Testing

- [ ] 3.1 — Generate Iraq dataset (10,000 jobs)
- [ ] 3.2 — Seed database
- [ ] 3.3 — Test clustering at different zooms
- [ ] 3.4 — Test across multiple cities
- [ ] 3.5 — Verify geographic distribution

### Week 4: Navigation Stress

- [ ] 4.1 — 10 minute continuous navigation test
- [ ] 4.2 — Monitor memory (should be stable)
- [ ] 4.3 — Monitor FPS (should be 50+)
- [ ] 4.4 — Check for visual glitches
- [ ] 4.5 — Verify cache is working

### Week 5: Memory & Leaks

- [ ] 5.1 — Run DevTools memory profiler (30 min)
- [ ] 5.2 — Take heap snapshots before/after
- [ ] 5.3 — Analyze retained objects
- [ ] 5.4 — Fix any identified leaks
- [ ] 5.5 — Re-test to confirm fix

### Week 6: Cache & Selection

- [ ] 6.1 — Cache validation test
- [ ] 6.2 — TTL expiration test
- [ ] 6.3 — Marker selection lifecycle test
- [ ] 6.4 — Verify no zombie markers
- [ ] 6.5 — Test rapid selection changes

### Week 7: Stress Testing

- [ ] 7.1 — Concurrent requests test (100 users)
- [ ] 7.2 — Large result set test (50,000 jobs)
- [ ] 7.3 — Pagination performance test
- [ ] 7.4 — Monitor resources (CPU, memory, connections)
- [ ] 7.5 — Document limits and recommendations

### Week 8: Final Validation

- [ ] 8.1 — Re-run all tests with known-good configuration
- [ ] 8.2 — Document results
- [ ] 8.3 — Create performance baseline
- [ ] 8.4 — Identify optimization opportunities
- [ ] 8.5 — Sign-off for P3

---

## Success Criteria

### Must Pass

✅ Backend response: <500ms for 1000 jobs  
✅ Database: Uses indexes (no full table scans)  
✅ Memory: Stable over 30 min (no continuous increase)  
✅ FPS: Maintains 50+ FPS during navigation  
✅ Clustering: Works correctly across Iraqi cities  
✅ Cache: Reduces API calls by 80%+ for repeated searches  
✅ No crashes or console errors  

### Nice to Have

⭐ Response: <300ms for 1000 jobs  
⭐ FPS: Maintains 60 FPS  
⭐ Memory: Uses <100 MB baseline  
⭐ Concurrent users: Handles 1000+ simulated users  

---

## Tools & Infrastructure

### Monitoring

```bash
# Backend monitoring
npm install pm2 pm2-auto-pull
pm2 start backend
pm2 monitor

# Database monitoring
pgAdmin (UI dashboard)
psql: SELECT * FROM pg_stat_statements;

# Frontend monitoring
Chrome DevTools (built-in)
Lighthouse (performance audit)
WebPageTest (real-world simulation)
```

### Load Testing

```bash
autocannon (Node.js HTTP load testing)
k6 (scripted performance testing)
Apache JMeter (complex scenarios)
wrk (HTTP benchmarking)
```

### Profiling

```bash
# Node.js profiling
node --inspect backend/src/main.ts
# Chrome DevTools: chrome://inspect

# Database profiling
EXPLAIN ANALYZE (PostgreSQL)
pgBadger (log analysis)

# Frontend profiling
Chrome DevTools → Performance tab
Lighthouse → Performance audit
```

---

## Output Deliverables

After P2.9, deliver:

1. **Performance Report**
   - Response times at each scale
   - Database query times
   - Memory profiles
   - Cache hit rates

2. **Bottleneck Analysis**
   - Slow queries identified
   - Memory leaks (if any)
   - Optimization recommendations

3. **Capacity Planning**
   - How many jobs can system handle?
   - How many concurrent users?
   - What's the breaking point?

4. **Baseline Metrics**
   - Reference numbers for future optimization
   - Memory baseline
   - CPU baseline
   - Response time baseline

5. **Fixes Applied**
   - Any indexes created
   - Any queries optimized
   - Any leaks fixed

6. **Sign-Off Document**
   - Architecture is validated ✅
   - Ready for P3 ✅

---

## Timeline

**Estimated:** 4-6 weeks  
**Priority:** CRITICAL (blocks P3)  
**Owner:** DevOps + Backend Engineer

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| Full table scan on 10K jobs | High | Medium | Index creation |
| Memory leak in Leaflet | High | Medium | Profiling + fix |
| Cache not working | High | Low | Validation test |
| Clustering too slow | Medium | Low | Optimization |
| Database connection pool exhausted | High | Low | Connection tuning |

---

## Next Phase Gate

**ONLY after P2.9 PASSES can we start P3.**

P3 = Discovery Engine (not just filters)

Will include:
- Filtering (category, salary, employment type, experience, company, date)
- Sorting (salary, distance, date, relevance)
- Ranking (algorithm)
- Saved Searches
- Recommendation

But P3 must be built on validated foundation.

---

## Summary

P2.9 is not about building new features.

It's about **proving the foundation is solid**.

Only then do we build Discovery Engine confidently.

---

**Status:** 🔴 **PLANNING — NOT STARTED**  
**Blocker:** P3 cannot start until P2.9 ✅  
**Timeline:** 4-6 weeks  
**Importance:** ⭐⭐⭐⭐⭐ (CRITICAL)
