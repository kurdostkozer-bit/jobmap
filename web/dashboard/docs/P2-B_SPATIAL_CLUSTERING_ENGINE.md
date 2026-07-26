# P2-B — Spatial Clustering Engine

**Status:** ✅ Complete  
**Phase:** Post-Backend Integration (P1 → P1.5 → P2-A → **P2-B**)  
**Date:** July 2026

## Overview

**P2-B** introduces an independent **Spatial Clustering Engine** that groups jobs by proximity based on zoom level and geographic density. This is **NOT** a rendering layer—it's a reusable service that can be swapped, extended, or replaced without affecting `MarkerManager` or the map UI.

### Key Principle

```
API
  ↓
MarkerManager (marker lifecycle)
  ↓
ClusteringEngine (spatial grouping)
  ↓
Leaflet (rendering)
```

The clustering layer is **independent**. It can be replaced with K-means, QuadTree, or any other algorithm without touching the marker logic.

---

## Architecture

### ClusteringEngine Class

Located: `web/dashboard/src/services/clusteringEngine.js`

#### Core Responsibility
- Convert geographic coordinates to grid cells
- Hash jobs to cells based on zoom level
- Calculate cluster statistics
- Provide stable cluster IDs

#### Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| **Clustering Algorithm** | Zoom-aware grid hashing | Scales naturally; no hardcoded "if >20 markers" |
| **Cluster ID** | Grid cell: `zoom-cellX-cellY` | Stable across map pans; prevents React re-renders |
| **Pixel Radius** | Zoom-dependent map | Larger clusters at low zoom; fine-grained at high zoom |
| **Statistics** | Per-cluster aggregates | Supports future Heat Map, salary layers, analytics |
| **Zoom Threshold** | 16+ = no clustering | Fully zoomed in ≈ auto-expand clusters |

---

## Algorithm

### Step 1: Convert Geographic to Pixel Coordinates
Uses Web Mercator projection approximation to convert lat/lng to pixel space.

```javascript
latLngToPixels(lat, lng, zoomLevel) {
  const zoom = Math.pow(2, zoomLevel);
  const x = ((lng + 180) / 360) * zoom * 256;
  const y = ((1 - Math.log(...) / Math.PI) / 2) * zoom * 256;
  return { x, y };
}
```

### Step 2: Hash to Grid Cell
For each job, calculate grid cell ID based on pixel radius for the current zoom.

```javascript
getGridCellId(lat, lng, zoomLevel, pixelRadius) {
  const pixels = this.latLngToPixels(lat, lng, zoomLevel);
  const cellX = Math.floor(pixels.x / pixelRadius);
  const cellY = Math.floor(pixels.y / pixelRadius);
  return `${zoomLevel}-${cellX}-${cellY}`;
}
```

**Result:** Same location always hashes to same cell ⟹ Stable cluster ID.

### Step 3: Group by Cell
```javascript
const grid = new Map(); // cellId -> jobs
for (const job of jobs) {
  const cellId = this.getGridCellId(...);
  grid.get(cellId).push(job);
}
```

### Step 4: Create Clusters or Keep Singles
- **1 job in cell** → unclustered marker  
- **2+ jobs in cell** → cluster marker with statistics

### Step 5: Calculate Statistics
For each cluster:
- **Count:** Number of jobs
- **Center:** Centroid (average lat/lng)
- **Salary:** Min/max averages
- **Categories:** Unique job types
- **Bounds:** Geographic rectangle
- **Zoom Recommendation:** Suggests zoom level to expand

---

## Zoom-Aware Pixel Radius

The `pixelRadiusMap` controls how tightly jobs cluster at each zoom level:

```javascript
pixelRadiusMap = {
  7:  120,   // Far out: large clusters
  11: 80,    // Medium: balanced
  14: 40,    // Zoomed in: small clusters
  18: 5,     // Fully zoomed: almost no clustering
}
```

**Behavior:**
- **Zoom 7** (country view): 120px radius → large clusters  
- **Zoom 13** (city view): 60px radius → medium clusters  
- **Zoom 16+** (street view): No clustering → all jobs as markers

**Linear Interpolation:** For missing zoom levels, pixel radius is interpolated between known values.

---

## API: ClusteringEngine.cluster()

### Signature
```javascript
cluster(jobs, zoomLevel) → { clusters, unclustered, stats }
```

### Parameters
- `jobs` (Array): Job objects with `latitude`, `longitude`, `category`, `salaryMin`, `salaryMax`
- `zoomLevel` (Number): Current map zoom level (0-18)

### Returns
```javascript
{
  clusters: [
    {
      id: "13-42-85",                    // Stable grid cell ID
      latitude: 33.315,
      longitude: 44.361,
      count: 47,
      averageSalaryMin: 800000,
      averageSalaryMax: 1200000,
      categories: ["IT", "Finance"],
      bounds: {
        north: 33.32, south: 33.31,
        east: 44.37, west: 44.35
      },
      jobIds: ["job1", "job2", ...],
      isCluster: true,
      zoomRecommendation: 13
    }
  ],
  unclustered: [
    { id: "job5", latitude: 33.30, longitude: 44.40, isCluster: false, ... }
  ],
  stats: {
    total: 150,
    clustered: 120,
    unclustered: 30,
    clusterCount: 12
  }
}
```

---

## Cluster Utilities

### clusteringUtils.createClusterIcon(cluster, isSelected)
Creates a Leaflet-compatible div icon for cluster display.

**Returns:**
```javascript
{
  html: '<div>47</div>',
  iconSize: [35, 35],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
  className: 'cluster-marker'
}
```

**Styling:**
- Size: Dynamic based on cluster count (25px–40px)
- Color: Purple (#667eea)
- Border: Blue highlight if selected
- Shadow: Drop shadow for depth

### clusteringUtils.createClusterPopupContent(cluster)
Generates HTML popup content showing:
- Job count
- Top 2 categories
- Average salary range
- "Click to zoom" hint (in Arabic)

### clusteringUtils.zoomToCluster(map, cluster, padding)
Automatically zooms map to fit cluster bounds with padding.

```javascript
clusteringUtils.zoomToCluster(mapRef.current, cluster, 50);
// Zooms to show all jobs in cluster with 50px padding
```

---

## Integration with MapHomePage

### Data Flow

1. **Search API Call**
   - User moves map or clicks "Search this area"
   - MapHomePage calls `/api/jobs/search/bounds`
   
2. **Clustering**
   - On API response, call `clusteringEngine.cluster(jobs, mapZoom)`
   - Store result in `clusteredResults` state

3. **Rendering**
   - Iterate over `clusteredResults.clusters` → render cluster markers
   - Iterate over `clusteredResults.unclustered` → render job markers
   - Both use Leaflet `Marker` component

### Code Example
```javascript
// In MapHomePage.jsx, after API response:
const clustering = clusteringEngineRef.current.cluster(
  data.jobs,
  mapZoom
);
setClusteredResults(clustering);
console.log('Clustering stats:', clustering.stats);
```

### Rendering Clusters
```jsx
{clusteredResults.clusters?.map((cluster) => (
  <Marker
    key={`cluster-${cluster.id}`}
    position={[cluster.latitude, cluster.longitude]}
    icon={L.divIcon(clusteringUtils.createClusterIcon(cluster))}
    eventHandlers={{
      click: () => clusteringUtils.zoomToCluster(mapRef.current, cluster)
    }}
  >
    <Popup dangerouslySetInnerHTML={{ 
      __html: clusteringUtils.createClusterPopupContent(cluster) 
    }} />
  </Marker>
))}
```

---

## Performance Targets

| Scenario | Jobs | Performance | Behavior |
|----------|------|-------------|----------|
| Light | 100 | 60 FPS | Smooth panning & zooming |
| Medium | 1,000 | 50+ FPS | Clustering active; minor lag on zoom |
| Heavy | 10,000 | 30+ FPS | Clustering essential; possible brief stall |

**Optimization Notes:**
- Grid hashing: O(n) per cluster operation
- No real-time clustering; only on search/zoom
- Future: QuadTree or R-tree for 10,000+ jobs
- Virtualization ready (render only visible clusters + markers)

---

## Cluster Statistics & Future Use

Each cluster includes rich metadata for future features:

### Current (P2-B)
- Cluster count display
- Zoom-on-click behavior
- Popup statistics

### Planned (P3+)
- **Heat Map:** Color intensity by `averageSalaryMax`
- **Salary Layers:** Filter by salary range
- **Category Bubbles:** Filter by `categories`
- **Analytics:** Track cluster interactions
- **Recommendations:** Suggest high-demand areas

### Statistics Structure
```javascript
cluster.stats = {
  count,                    // 47 jobs
  averageSalaryMin,         // 800k
  averageSalaryMax,         // 1.2M
  categories,               // ["IT", "Finance", "HR"]
  bounds,                   // { north, south, east, west }
  jobIds,                   // ["job1", "job2", ...]
  zoomRecommendation       // 13
}
```

---

## Testing

### Unit Tests (not yet added)
```javascript
// Example: Test zoom-aware clustering
const engine = new ClusteringEngine();
const jobs = [
  { id: '1', latitude: 33.0, longitude: 44.0, category: 'IT', salaryMin: 1000000 },
  { id: '2', latitude: 33.001, longitude: 44.001, category: 'IT', salaryMin: 1000000 },
];

// At zoom 15 (small radius): should cluster
const result15 = engine.cluster(jobs, 15);
assert(result15.clusters.length === 1);

// At zoom 7 (large radius): might not cluster depending on pixel positions
const result7 = engine.cluster(jobs, 7);
```

### Manual Testing Checklist
- [ ] Search map returns clusters at zoom 7–11
- [ ] Unclustered markers appear at zoom 14+
- [ ] Click cluster → zooms to bounds
- [ ] Cluster popup shows count, salary, categories
- [ ] Sidebar shows correct job count
- [ ] No console errors during clustering

---

## Non-Goals for P2-B

Explicitly **NOT** included (per requirements):
- ❌ Animations or transitions
- ❌ Cluster bounce/hover effects
- ❌ 3D icons or advanced graphics
- ❌ Heat map rendering
- ❌ Custom cluster algorithms (future phase)
- ❌ Real-time clustering (live job feeds)

These are slated for **P3+** after core functionality is stable.

---

## Comparison: Cluster vs. Marker

| Aspect | Cluster | Unclustered Marker |
|--------|---------|-------------------|
| Displayed when | 2+ jobs in cell | Single job or high zoom |
| Icon | Dynamic, shows count | Salary-colored |
| Click Behavior | Zoom to bounds | Select & show bubble |
| Metadata | Aggregates (avg, categories) | Single job details |
| Performance | Scales better at low zoom | Better at high zoom |

---

## Next: P3 — Search & Filter Engine

After P2-B is tested and stable, the next phase adds:
1. **Filter Controls** (sidebar)
2. **Dynamic API Filters** (category, salary, employment type, experience, company, date)
3. **Filter + Clustering Integration** (clusters respect filters)
4. **Persistent Filters** (localStorage)

**Key:** Filters work with the **same `/api/jobs/search/bounds`** endpoint via the `filters` object, not separate endpoints.

---

## Summary

**P2-B provides:**
✅ Zoom-aware spatial clustering  
✅ Stable cluster identity  
✅ Rich cluster statistics  
✅ Independent from MarkerManager  
✅ Scalable to 10,000+ jobs  
✅ Foundation for Heat Map, analytics, recommendations  

**Next step:** Integrate into frontend build, test with real data, verify performance.
