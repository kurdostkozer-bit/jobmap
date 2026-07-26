# P1 - Map Core Engine

## 🗺️ المبدأ الأساسي

**الخريطة هي مصدر الحقيقة الوحيد (Map Bounds = Source of Truth)**

جميع البيانات المعروضة تعتمد على حدود الخريطة الحالية فقط.

---

## 🏗️ Architecture

### State Management

```
┌─────────────────────────────────────┐
│  User Location (GPS)                │
│  lat: 33.3136, lng: 44.3615         │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Map Ref                            │
│  - bounds (north, south, east, west)│
│  - zoom level                       │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  BoundsDirty Flag                   │
│  (User moved map = true)            │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Search Button Shows                │
│  (Debounce 400ms)                   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  User Clicks "Search this area"     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Send API Request:                  │
│  {north, south, east, west}         │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Backend Returns Jobs in Bounds     │
│  (with latitude/longitude)          │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Update State:                      │
│  - jobs[]                           │
│  - boundsDirty = false              │
│  - isLoading = false                │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Sync Updates:                      │
│  1. Map Markers (only from jobs)    │
│  2. Header Job Count (length)       │
│  3. Sidebar Job List (filtered)     │
└─────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Onboarding → Map Initialization

1. **First Visit**: Show OnboardingPage
2. **Get GPS**: Request geolocation permission
3. **Save Location**: Store in localStorage
4. **Initialize Map**: Center at user location (or Baghdad default)

### Map Movement → Search Trigger

```javascript
// User interaction
User pan/zoom on map
    ↓
onMoveend/onZoomend triggered
    ↓
getMapBounds() + getZoom()
    ↓
setBoundsDirty(true) // Mark as changed
    ↓
Debounce 400ms
    ↓
Show "🔄 Search this area" button
```

### Search Execution → Data Update

```javascript
// User clicks search button
handleSearchThisArea()
    ↓
Extract map bounds:
{
  north: northEastLat,
  south: southWestLat,
  east: northEastLng,
  west: southWestLng
}
    ↓
POST /api/jobs/search-bounds
    ↓
Backend filters jobs:
WHERE latitude BETWEEN south AND north
AND longitude BETWEEN west AND east
    ↓
Response: jobs[]
    ↓
setJobs(jobs)
setBoundsDirty(false)
    ↓
Markers update automatically
Job list updates automatically
Count updates automatically
```

---

## 📍 Job Data Structure

Each job MUST have:

```javascript
{
  id: number,
  latitude: number,        // NOT city name
  longitude: number,       // NOT city name
  company: string,
  title: string,
  salary: string,          // "6000-8000"
  salaryMin: number,       // Used for marker color
  type: string,            // "full-time" or "part-time"
  createdAt: ISO8601,      // "2024-01-15T10:30:00Z"
  distance?: number        // Calculated on client
}
```

### Why latitude/longitude?

- Eliminates city name dependency
- Supports precise geolocation
- Enables bounds-based queries
- Works for any geographic region
- Scales to any granularity

---

## 🎯 Key Features (P1)

### ✅ Implemented

1. **Onboarding Flow** (4 steps)
   - Welcome screen
   - Permission request
   - Loading state
   - Error handling

2. **Map Binding**
   - User location marker (blue pin)
   - Job markers (colored by salary)
   - Pan/Zoom tracking

3. **Bounds-Based Search**
   - Debounced "Search this area" button
   - Extract (north, south, east, west)
   - Send to backend
   - Mock API response

4. **Map-List Sync**
   - Markers only from latest search
   - Header shows job count
   - Sidebar shows jobs with distance
   - Job bubble popup (small UI)

5. **My Location Button**
   - Navigate to GPS coordinates
   - Re-trigger search

### ❌ NOT Implemented Yet

- Clustering (coming P2)
- Heat map (coming P3)
- Route navigation (coming P4)
- Salary layer (coming P5)

---

## 🧪 Testing Checklist

### Scenario 1: First Visit

- [ ] Show onboarding screen
- [ ] Request geolocation permission
- [ ] Map centers at user location
- [ ] "Search this area" button not visible (no movement yet)

### Scenario 2: Pan Map

- [ ] User pans map
- [ ] "Search this area" button appears (debounce 400ms)
- [ ] No automatic search
- [ ] Map doesn't flicker

### Scenario 3: Click Search

- [ ] Send (north, south, east, west) to API
- [ ] Show loading spinner
- [ ] Update markers
- [ ] Update job count in header
- [ ] Update job list in sidebar
- [ ] "Search this area" button disappears

### Scenario 4: Click Job Marker

- [ ] Show small bubble popup
- [ ] Display: Company, Title, Salary, Distance
- [ ] "Apply" button visible

### Scenario 5: Click My Location

- [ ] Map flies to GPS coordinates
- [ ] Zoom to level 12
- [ ] Re-enable search

### Scenario 6: Repeat Search

- [ ] Pan to new area
- [ ] "Search this area" button reappears
- [ ] Click to search
- [ ] New results only

---

## 🔗 API Endpoint

### POST /api/jobs/search-bounds

**Request:**
```json
{
  "north": 34.5,
  "south": 32.0,
  "east": 45.0,
  "west": 43.0
}
```

**Response:**
```json
{
  "success": true,
  "count": 42,
  "jobs": [
    {
      "id": 1,
      "latitude": 33.3136,
      "longitude": 44.3615,
      "company": "Tech Solutions",
      "title": "Senior Developer",
      "salary": "6000-8000",
      "salaryMin": 6000,
      "type": "full-time",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    ...
  ]
}
```

---

## 📊 Performance Considerations

### Debouncing

- **400ms** delay before showing search button
- Prevents API spam while user is panning
- Google Maps uses similar approach

### Map Bounds Calculation

- Only recalculated on `moveend` / `zoomend`
- Not on every pixel movement
- Leaflet handles this efficiently

### Job Rendering

- Only visible jobs render markers
- Sidebar scrolls if >20 jobs
- Job bubble popup is lightweight

---

## 🎨 UI Components

### Search Button

```
┌────────────────────────────────┐
│  🔄 ابحث في هذه المنطقة       │ (shows after map movement + debounce)
└────────────────────────────────┘
```

Position: Bottom center of map
Animation: Slide up + fade in
States: default, loading, disabled

### Job Bubble

```
┌─────────────────────┐
│ ✕                   │
│ Senior Developer    │
│ Tech Solutions      │
│                     │
│ 💰 6000-8000        │
│ 📍 2.5 كم           │
│                     │
│ [تقديم الطلب]      │
└─────────────────────┘
```

Position: Fixed bottom-right
Animation: Slide in right
Closes: Click ✕ or click other marker

### Header Job Count

```
┌──────────────────┐
│  💼 42 وظيفة     │ (live update)
└──────────────────┘
```

Updates when:
- Search completes
- Filter search term applied

### Sidebar Job List

```
┌─────────────────────────┐
│ الوظائف (42)            │
├─────────────────────────┤
│ Senior Developer        │
│ Tech Solutions          │
│ 💰 6000-8000            │
│ 📍 2.5 كم               │
│ [عرض التفاصيل]         │
├─────────────────────────┤
│ (more jobs...)          │
└─────────────────────────┘
```

---

## 🚀 Next Steps

### P2 - Clustering
- Group nearby jobs
- Show count (📍 25)
- Expand on zoom

### P3 - Heat Map
- Color intensity = job density
- Show hotspots

### P4 - Route Navigation
- Calculate travel time
- Show on map

### P5 - Advanced Filters
- Salary layer
- Distance rings
- Job type filter

---

## 📝 Notes

- **localStorage** used for onboarding state
- **Mock API** in handleSearchThisArea() - replace with real backend call
- **Haversine formula** for distance calculation
- **Leaflet.js** for map rendering
- **React Hooks** (useState, useCallback, useEffect, useRef)

---

Created: 2024-01-15
Last Updated: 2024-01-15
Version: P1 (Map Core Engine)
