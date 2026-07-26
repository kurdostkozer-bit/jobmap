# P2-B — Manual Testing Guide

**Status:** Ready for Testing  
**Date:** 2026-07-26

---

## Prerequisites

1. **Backend Running**
   - Start backend: `cd backend && npm run dev`
   - Verify `/api/jobs/search/bounds` responds at http://localhost:5000/api/jobs/search/bounds
   
2. **Database Seeded**
   - Jobs table has 100+ jobs with valid `latitude` and `longitude`
   - Run migration if needed: `npm run migrate`

3. **Frontend Build**
   - `npm run build` completed successfully ✅
   - Or run dev: `npm run start` at http://localhost:3000

---

## Test Scenarios

### Test 1: Clustering at Low Zoom (7-11)

**Steps:**
1. Open http://localhost:3000
2. Complete onboarding (grant location)
3. Zoom out to level 7-8 (use mouse wheel or `-` button)
4. Press "Search this area" button
5. Observe map

**Expected Results:**
- ✅ Multiple cluster markers appear (purple circles with numbers)
- ✅ Cluster count varies by zoom level
- ✅ No console errors
- ✅ Job count in header matches sidebar

**Example at Zoom 7:**
```
Expected: 5-15 clusters (depending on job distribution)
Example visual: "47", "23", "15", "8", "3" (cluster job counts)
```

**Console Check:**
```javascript
// Open DevTools (F12) → Console
// Should see: "Clustering results: { clusters: [...], unclustered: [...], stats: {...} }"
// Should NOT see any errors like "clusteringEngine is not defined"
```

---

### Test 2: Cluster Click → Zoom To Bounds

**Steps:**
1. At zoom 7-10, click any cluster marker
2. Observe map behavior

**Expected Results:**
- ✅ Map zooms in to show cluster bounds
- ✅ Cluster popup appears (Arabic text with job count, salary range, categories)
- ✅ All jobs in cluster become visible as individual markers
- ✅ No jarring jumps or animation glitches

**Popup Content Example:**
```
47 وظيفة
IT, Finance
800,000-1,200,000
اضغط لتكبير (disappears after zoom)
```

---

### Test 3: No Clustering at High Zoom (16+)

**Steps:**
1. Zoom in to level 16-18 (fully zoomed)
2. Press "Search this area"

**Expected Results:**
- ✅ No cluster markers appear
- ✅ Only individual job markers visible
- ✅ Each job shows as individual pin (salary-colored)
- ✅ Sidebar shows 100+ individual jobs

**Console Check:**
```javascript
console.log('Clustering stats:', clustering.stats);
// Should show: { total: 150, clustered: 0, unclustered: 150, clusterCount: 0 }
```

---

### Test 4: Pan & Re-search

**Steps:**
1. At zoom 10, search area
2. Observe clusters
3. Pan map (drag) slightly
4. "Search this area" button appears
5. Click button

**Expected Results:**
- ✅ New search results appear
- ✅ Clusters update based on new bounds
- ✅ Cluster IDs may change (different grid cells)
- ✅ No duplicate clusters

**Grid Cell ID Format:**
```javascript
// Open DevTools → Console
clusteredResults.clusters.forEach(c => console.log(c.id));
// Example output: "10-256-512", "10-256-513", "10-257-512"
// Format: {zoom}-{cellX}-{cellY}
```

---

### Test 5: Cluster Statistics

**Steps:**
1. Search at zoom 10
2. Open DevTools → Console
3. Type:
```javascript
// In browser console:
const clusters = clusteredResults.clusters;
clusters[0] && console.table({
  id: clusters[0].id,
  count: clusters[0].count,
  avgSalaryMin: clusters[0].averageSalaryMin,
  avgSalaryMax: clusters[0].averageSalaryMax,
  categories: clusters[0].categories.join(', '),
  latitude: clusters[0].latitude,
  longitude: clusters[0].longitude,
  jobIds: clusters[0].jobIds.length,
});
```

**Expected Output:**
```
┌──────────────────┬───────────────────┐
│ id               │ "10-256-512"      │
│ count            │ 47                │
│ avgSalaryMin     │ 850000            │
│ avgSalaryMax     │ 1250000           │
│ categories       │ "IT, Finance, HR" │
│ latitude         │ 33.315            │
│ longitude        │ 44.361            │
│ jobIds           │ 47                │
└──────────────────┴───────────────────┘
```

---

### Test 6: Sidebar Job Count

**Steps:**
1. Search at zoom 13
2. Compare sidebar count with stats

**Expected Results:**
- ✅ Sidebar shows: "الوظائف (N)" where N = total unclustered + all jobs in clusters
- ✅ Matches API response total
- ✅ Filters by search term work correctly

**Example:**
```
Sidebar: الوظائف (150)
Stats: { total: 150, clustered: 120, unclustered: 30 }
Reasoning: 30 unclustered + (120 in clusters) = 150 total
```

---

### Test 7: Marker Selection (Unclustered)

**Steps:**
1. Zoom to 15-16 (individual markers visible)
2. Click any job marker
3. Observe

**Expected Results:**
- ✅ Marker changes color (highlight)
- ✅ Job bubble appears (bottom right or overlay)
- ✅ Sidebar job card also highlights
- ✅ Bubble shows job details: title, company, salary, distance

---

### Test 8: Performance - 1000 Jobs

**Precondition:** Backend returns 1000+ jobs

**Steps:**
1. Create test data: 1000 jobs spread across map
2. At zoom 10, search area
3. Open DevTools → Performance tab
4. Measure clustering time

**Expected Results:**
- ✅ Clustering completes < 100ms
- ✅ Render completes < 500ms
- ✅ Map remains interactive (60 FPS during zoom)
- ✅ No memory leaks

**Console Benchmark:**
```javascript
// In browser console:
const start = performance.now();
const result = clusteringEngine.cluster(jobs, 10);
const end = performance.now();
console.log(`Clustering 1000 jobs: ${end - start}ms`);
// Expected: < 100ms
```

---

### Test 9: Cache Behavior

**Steps:**
1. Search area → observe jobs
2. Pan slightly → "Search this area" button appears
3. Do NOT click; wait 2 seconds → button disappears
4. Wait 5+ minutes
5. Pan same area again
6. Click "Search this area"

**Expected Results:**
- ✅ First search: API called, results cached
- ✅ Second search (within 5 min): Uses cache, no API call
- ✅ After 5 min: Cache expires, new API call
- ✅ Browser DevTools Network tab shows correct requests

**Network Tab Check:**
```
1st Search: POST /api/jobs/search/bounds → 200 (new)
2nd Search (2 sec later): No request (cached)
3rd Search (5+ min later): POST /api/jobs/search/bounds → 200 (expired cache)
```

---

### Test 10: Error Handling

**Steps:**
1. Kill backend while app is running
2. Click "Search this area"
3. Observe error handling

**Expected Results:**
- ✅ Error banner appears: "تعذر تحميل الوظائف في هذه المنطقة"
- ✅ Retry button appears with counter
- ✅ Old results still visible (not wiped)
- ✅ Can click retry to try again
- ✅ Restart backend and retry succeeds

---

## Visual Verification Checklist

- [ ] Cluster icons display correctly (purple, with count)
- [ ] Cluster icons are sized proportionally to job count
- [ ] Job markers are salary-colored (low=red, high=green, mid=yellow)
- [ ] Selected marker has blue highlight
- [ ] Cluster popup text is in Arabic
- [ ] Map panning is smooth
- [ ] Zoom transitions are smooth
- [ ] No flickering or re-rendering glitches
- [ ] Search button appears/disappears at correct times
- [ ] Loading spinner animates while searching

---

## Console Debugging Commands

```javascript
// Open DevTools (F12) → Console, paste these:

// 1. View all clusters
console.table(clusteredResults.clusters);

// 2. View clustering statistics
console.log('Stats:', clusteredResults.stats);

// 3. Get largest cluster
const largest = clusteredResults.clusters.sort((a, b) => b.count - a.count)[0];
console.log('Largest cluster:', largest);

// 4. Get average cluster size
const avgSize = clusteredResults.clusters.reduce((sum, c) => sum + c.count, 0) / clusteredResults.clusters.length;
console.log('Avg cluster size:', avgSize);

// 5. Manually zoom to cluster
clusteringUtils.zoomToCluster(mapRef.current, clusteredResults.clusters[0]);

// 6. View clustering algorithm decision
console.log('Should cluster at zoom 10?', clusteringEngine.shouldCluster(jobs, 10));
console.log('Pixel radius at zoom 10:', clusteringEngine.getPixelRadius(10));

// 7. Simulate different zoom
const clustersAtZoom7 = clusteringEngine.cluster(jobs, 7);
const clustersAtZoom15 = clusteringEngine.cluster(jobs, 15);
console.log(`Zoom 7: ${clustersAtZoom7.clusters.length} clusters`);
console.log(`Zoom 15: ${clustersAtZoom15.clusters.length} clusters`);
```

---

## Performance Profiling

### Option 1: Chrome DevTools

1. Open DevTools → Performance tab
2. Click "Record" (Ctrl+Shift+E)
3. Perform action (zoom, pan, search)
4. Click "Stop"
5. Analyze flame chart

**Look for:**
- ✅ `cluster()` method duration < 100ms
- ✅ React render < 500ms
- ✅ No long tasks > 50ms
- ✅ Consistent frame rate (60 FPS during interaction)

### Option 2: Console Timing

```javascript
// Measure clustering time
console.time('clustering');
const result = clusteringEngine.cluster(jobs, 10);
console.timeEnd('clustering');
// Output: clustering: 45.23ms

// Measure render time
console.time('render');
// [trigger React re-render]
console.timeEnd('render');
// Output: render: 234.12ms
```

---

## Known Issues (to address in P3)

1. **Search button sometimes slow to appear**
   - Fix: Reduce debounce timer from 400ms to 300ms
   
2. **Cluster popup text not in Arabic on first click**
   - Fix: Ensure `dangerouslySetInnerHTML` properly handles RTL

3. **Sidebar not updating on fast zoom**
   - Fix: Debounce sidebar updates

---

## Rollout Checklist

Before merging to production:

- [ ] All 10 test scenarios pass ✅
- [ ] No console errors
- [ ] Build succeeds with no new warnings
- [ ] Performance benchmark complete (clustering < 100ms)
- [ ] Cache behavior verified
- [ ] Error handling tested (network failure)
- [ ] Code review completed
- [ ] Unit tests passing (if added)
- [ ] Documentation complete
- [ ] Backend API `/api/jobs/search/bounds` is stable

---

## Regression Testing (If You Modify Clustering)

If you make changes to `clusteringEngine.js`, verify:

1. **Algorithm remains zoom-aware**
   - Cluster count should decrease as zoom increases
   - No clustering at zoom 16+

2. **Cluster IDs remain stable**
   - Same job location → same cluster ID across renders
   - Different zoom → different cluster IDs (expected)

3. **Statistics accuracy**
   - `averageSalaryMin/Max` correctly calculated
   - `categories` unique and correct
   - `bounds` contain all cluster jobs

4. **Performance**
   - Still < 100ms for 1000 jobs
   - No memory leaks (check DevTools memory tab)

---

## Questions to Answer After Testing

1. **How many clusters appear at zoom 10 for your city?**
   Expected: 20-50 (varies by job density)

2. **What's the largest cluster size?**
   Expected: 100+ (if 1000+ jobs exist)

3. **How fast does clicking a cluster zoom?**
   Expected: < 500ms total (smooth animation)

4. **Does sidebar count always match total jobs?**
   Expected: Yes, 100% of the time

5. **Any visual glitches during pan/zoom?**
   Expected: No flickering, smooth transitions

---

## Next Steps After Testing

If testing succeeds:
1. ✅ Merge P2-B into main
2. ✅ Create release notes
3. ✅ Plan P3 (filters)

If issues found:
1. Document issue
2. Create bug issue
3. Fix in followup PR
4. Re-test

---

**Happy testing! 🚀**
