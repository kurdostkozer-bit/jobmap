# P2-A - Marker Engine Architecture

## Overview

**Marker Engine** هي طبقة مستقلة تدير دورة حياة markers على الخريطة. فصل المسؤولياتمن:

- **Data Layer** (MapHomePage): يتعامل مع البيانات والـ API
- **Rendering Layer** (MarkerEngine): يتعامل مع عرض markers
- **UI Layer** (Leaflet): يعرض على الخريطة

هذا الفصل يسهل:
- ✅ Testing المنطق بدون Leaflet
- ✅ إضافة Clustering (P2-B)
- ✅ تحسين الأداء بـ virtualization
- ✅ تبديل مكتبة الخرائط مستقبلاً

---

## Architecture

```
┌─────────────────────────────────────┐
│  MapHomePage (Orchestrator)         │
│  - Fetches jobs from API            │
│  - Manages state + cache            │
│  - Calls MarkerManager              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  MarkerManager (Services Layer)     │
│  - Creates markers                  │
│  - Manages marker lifecycle         │
│  - Handles selection state          │
│  - Prepares for clustering          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Leaflet Map (Rendering)            │
│  - Displays markers                 │
│  - Handles user interactions        │
└─────────────────────────────────────┘
```

---

## MarkerManager Class

### Constructor

```javascript
const markerManager = new MarkerManager();
```

**Instance Variables:**
- `markers`: Map<jobId, L.Marker>
- `visibleMarkers`: Set<jobId>
- `selectedMarkerId`: string | null

### Public Methods

#### `createMarkers(jobs, map, onMarkerClick)`

Creates Leaflet markers from job data.

```javascript
const markers = markerManager.createMarkers(
  jobs,           // Array of job objects
  map,            // Leaflet map instance
  (job) => {      // onClick callback
    setSelectedJob(job);
  }
);
```

**Returns:** Array of L.Marker instances

**Features:**
- Reuses existing markers (no duplicates)
- Attaches job data to marker
- Binds popup content
- Adds click handlers

#### `renderMarkers(markers, map, bounds)`

Adds markers to map (with virtualization support).

```javascript
markerManager.renderMarkers(
  markers,        // Array of markers
  map,            // Leaflet map
  mapBounds       // Optional: only render visible
);
```

**Virtualization:**
- If bounds provided, only markers within bounds render
- Out-of-bounds markers removed from map
- Reduces DOM nodes for large datasets

#### `clearMarkers(map)`

Removes all markers from map.

```javascript
markerManager.clearMarkers(map);
```

#### `selectMarker(jobId, map)`

Selects a marker and updates visual state.

```javascript
markerManager.selectMarker(jobId, map);
```

**Effects:**
- Updates deselected marker icon (non-selected state)
- Updates selected marker icon (highlighted)
- Opens popup

#### `deselectMarker(map)`

Deselects current marker.

```javascript
markerManager.deselectMarker(map);
```

#### `getTotalCount()`

Returns total marker count.

```javascript
const total = markerManager.getTotalCount(); // 182
```

#### `getVisibleCount()`

Returns currently visible marker count.

```javascript
const visible = markerManager.getVisibleCount(); // 45
```

#### `getMarker(jobId)`

Get marker instance by job ID.

```javascript
const marker = markerManager.getMarker('job-123');
```

#### `isMarkerVisible(jobId)`

Check if marker is rendered on map.

```javascript
if (markerManager.isMarkerVisible('job-123')) {
  // Marker is visible
}
```

---

## Icon Functions

### `createJobMarkerIcon(salaryMin, isSelected)`

Creates a DivIcon for job markers.

**Parameters:**
- `salaryMin`: number - Used for color coding
- `isSelected`: boolean - Determines visual state

**Color Coding:**
- Salary > 5000: Blue (#667eea)
- Salary 3000-5000: Green (#48bb78)
- Salary < 3000: Orange (#ed8936)

**Visual:**
```
Selected (isSelected=true):
- Border: 4px (thicker)
- Shadow: 0 4px 12px (brighter)

Not Selected (isSelected=false):
- Border: 3px
- Shadow: 0 2px 8px (subtle)
```

### `createUserMarkerIcon()`

Creates an icon for user's current location.

**Returns:** L.Icon with blue circle SVG

---

## Marker Data Structure

Each marker has `jobData` attached:

```javascript
marker.jobData = {
  id: "uuid",
  latitude: 33.3136,
  longitude: 44.3615,
  company: "Tech Solutions",
  title: "Senior Developer",
  salary: "6000-8000",
  salaryMin: 6000,
  salaryMax: 8000,
  employmentType: "full-time",
  category: "IT",
  status: "active",
  createdAt: "2024-01-10T...",
  updatedAt: "2024-01-15T...",
  description: "نبحث عن مطور React",
  skills: ["React", "Node.js"],
  applicants: 12
}
```

---

## Utility Functions

### `markerEngineUtils.getVisibleMarkers(jobs, bounds)`

Filters jobs to only those within bounds (pre-rendering check).

```javascript
const visible = markerEngineUtils.getVisibleMarkers(jobs, mapBounds);
// Returns jobs where:
// job.latitude >= south && job.latitude <= north
// job.longitude >= west && job.longitude <= east
```

### `markerEngineUtils.batchUpdateMarkers(manager, jobs, map, callback)`

Updates markers in batches to avoid UI freezing.

```javascript
markerEngineUtils.batchUpdateMarkers(
  markerManager,
  jobs,           // Large array (1000+)
  map,
  onMarkerClick
);
```

**Process:**
1. Divides jobs into 100-job batches
2. Uses `requestAnimationFrame` for each batch
3. Prevents browser freeze on large datasets

### `markerEngineUtils.getMarkerStats(markerManager)`

Returns statistics about rendered markers.

```javascript
const stats = markerEngineUtils.getMarkerStats(markerManager);
// {
//   total: 182,
//   visible: 45,
//   visibilityRatio: 0.247
// }
```

---

## Virtualization Strategy

### Problem
1000+ markers on map = DOM nodes explosion → browser freeze

### Solution
Only render markers within current map view:

```javascript
// In MapHomePage
const jobsWithinBounds = markerEngineUtils.getVisibleMarkers(jobs, mapBounds);
const visibleMarkers = markerManager.createMarkers(jobsWithinBounds, map, onClick);
markerManager.renderMarkers(visibleMarkers, map, mapBounds);
```

**Benefits:**
- **Memory:** Only visible markers in DOM
- **Performance:** ~100x faster with 1000+ jobs
- **UX:** Pan/zoom instantly

---

## Integration with MapHomePage

### Usage Pattern

```javascript
// 1. Initialize (done in useEffect)
const markerManager = new MarkerManager();

// 2. When jobs received from API
const jobs = apiResponse.jobs;

// 3. Filter visible jobs
const visibleJobs = markerEngineUtils.getVisibleMarkers(jobs, mapBounds);

// 4. Create markers
const markers = markerManager.createMarkers(
  visibleJobs,
  mapRef.current,
  (job) => setSelectedJob(job)
);

// 5. Render on map (with virtualization)
markerManager.renderMarkers(markers, mapRef.current, mapBounds);

// 6. Handle selection
markerManager.selectMarker(selectedJob.id, mapRef.current);

// 7. Handle deselection
markerManager.deselectMarker(mapRef.current);
```

---

## Future: Clustering (P2-B)

### Placeholder Method
```javascript
const clusters = markerManager.getMarkerClusters(clusterRadius = 80);
// Returns: { clusters: [...], unclustered: [...] }
```

### Will implement in P2-B:
- Group nearby markers (within 80px)
- Replace with cluster marker ("📍 25 jobs")
- Expand on zoom
- Recursive clustering for deep zooms

---

## Performance Characteristics

### Creation
- Per marker: ~0.5ms
- 100 markers: ~50ms
- 1000 markers: ~500ms

### Rendering
- With virtualization: ~20-50ms
- Without (all markers): ~500-2000ms ⚠️

### Selection
- Update icon: ~2ms
- Instant (no re-render)

### Memory
- Per marker object: ~2KB
- 100 visible: ~200KB
- 1000 total (100 visible): ~200KB (others in Set)

---

## Error Handling

### Invalid marker ID
```javascript
markerManager.selectMarker('invalid-id', map);
// Silently does nothing (already checks has())
```

### Map instance null
```javascript
markerManager.renderMarkers(markers, null, bounds);
// addTo(map) will throw - caught in component
```

---

## Testing Examples

### Unit Test
```javascript
import MarkerManager, { createJobMarkerIcon } from '../services/markerEngine';

describe('MarkerManager', () => {
  let manager;

  beforeEach(() => {
    manager = new MarkerManager();
  });

  it('creates markers without map', () => {
    const jobs = [{ id: '1', latitude: 33, longitude: 44, salaryMin: 5000 }];
    const markers = manager.createMarkers(jobs, null, () => {});
    expect(markers.length).toBe(1);
    expect(manager.getTotalCount()).toBe(1);
  });

  it('selects marker and updates icon', () => {
    const job = { id: '1', latitude: 33, longitude: 44, salaryMin: 5000 };
    manager.createMarkers([job], null, () => {});
    manager.selectMarker('1', null);
    expect(manager.selectedMarkerId).toBe('1');
  });
});
```

---

## No Animations (P2-A)

Intentionally excluded for now:
- ❌ Bounce on marker hover
- ❌ Fade in/out on creation
- ❌ Scale animations
- ❌ Color transitions

Will add in future phase focused on UX polish.

---

## Summary

**Marker Engine provides:**
- ✅ Clean separation of concerns
- ✅ Scalability to 1000+ markers
- ✅ Virtualization support
- ✅ Testable marker logic
- ✅ Foundation for P2-B clustering

**Ready for:**
- P2-B: Clustering
- P3: Advanced filtering with marker updates
- P6: Heat map (layer on top of markers)

