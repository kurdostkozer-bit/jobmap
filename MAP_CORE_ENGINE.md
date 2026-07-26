# P1 - Map Core Engine (Enhanced)

## 🗺️ المبدأ الأساسي

**الخريطة هي مصدر الحقيقة للوظائف المعروضة (Map Bounds = Source of Truth for Jobs)**

جميع البيانات المعروضة من الوظائف تعتمد على حدود الخريطة الحالية فقط.

ملاحظة: بيانات أخرى (ملف شخصي، إشعارات، شركات) لا تعتمد على الخريطة.

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

## 📍 Job Data Structure (Extended Model)

Each job MUST have:

```javascript
{
  // Core Identifiers
  id: number,
  
  // Geolocation (NO city names!)
  latitude: number,
  longitude: number,
  
  // Primary Info
  company: string,
  title: string,
  
  // Compensation
  salary: string,              // "6000-8000" (display)
  salaryMin: number,           // 6000 (for calculations)
  salaryMax: number,           // 8000 (for calculations)
  
  // Classification (ready for P3 filters)
  employmentType: string,      // "full-time", "part-time", "contract"
  category: string,            // "IT", "Design", "Healthcare", "Engineering"
  status: string,              // "active", "expired", "filled"
  
  // Timestamps
  createdAt: ISO8601,          // "2024-01-15T10:30:00Z"
  updatedAt: ISO8601,          // "2024-01-15T10:30:00Z"
  
  // Extended Info
  description: string,         // Job description
  skills: string[],           // Required skills
  applicants: number,         // Applicant count
  
  // Client-calculated
  distance?: number           // Calculated using Haversine
}
```

### Why This Structure?

- **salaryMin/Max**: Separate from display for filtering (P3)
- **employmentType**: Replaces simple "type" for future filters
- **category**: Enables advanced filtering and recommendations (P3, P8)
- **status**: Prevents showing expired/filled jobs
- **timestamps**: For sorting by latest, expiry checks
- **skills[]**: For future AI matching (P8)

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

**Request Structure (v1 - Ready for future expansions):**
```json
{
  "bounds": {
    "north": 34.5,
    "south": 32.0,
    "east": 45.0,
    "west": 43.0
  },
  "zoom": 12,
  "center": {
    "lat": 33.3136,
    "lng": 44.3615
  },
  "filters": {
    "employmentType": ["full-time"],
    "category": ["IT", "Design"],
    "salaryMin": 3000,
    "salaryMax": 10000
  }
}
```

**Response:**
```json
{
  "success": true,
  "count": 42,
  "stats": {
    "total": 42,
    "filtered": 42
  },
  "jobs": [
    {
      "id": 1,
      "latitude": 33.3136,
      "longitude": 44.3615,
      "company": "Tech Solutions",
      "title": "Senior Developer",
      "salary": "6000-8000",
      "salaryMin": 6000,
      "salaryMax": 8000,
      "employmentType": "full-time",
      "category": "IT",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "description": "نبحث عن مطور React خبير",
      "skills": ["React", "Node.js", "TypeScript"],
      "applicants": 12
    },
    ...
  ]
}
```

### API Design Rationale

- **Single `bounds` object**: Easy to extend with new fields
- **Optional `zoom` & `center`**: For client-side debugging/analytics
- **`filters` object**: Ready for P3 without API restructuring
- **Empty filters**: Still works, returns all jobs in bounds
- **`stats` response**: Separate from jobs for easy UI updates

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

## 🚀 Next Steps (Roadmap)

### ✅ P1 — Map Core Engine
- Onboarding with GPS
- Bounds-based search (north/south/east/west)
- Duplicate request prevention
- Job bubble (enhanced)
- My Location button

### P2 — Marker Clustering
- Group nearby jobs
- Show count badge (📍 25)
- Expand on zoom level increase

### P3 — Advanced Filters
- Filter by employmentType
- Filter by category
- Filter by salary range
- Filter UI in sidebar
- Update markers in real-time

### P4 — Route Navigation
- Calculate travel time (by car/walk)
- Show on map
- Open in Google Maps

### P5 — Heat Map
- Color intensity = job density
- Show hotspots
- Toggle on/off

### P6 — Salary Layer
- Color map by average salary
- Show salary ranges
- Toggle on/off

### P7 — Real-time Job Updates
- WebSocket for new jobs
- Animation on new marker
- Notification badge

### P8 — AI Recommendations
- Profile-based job matching
- Smart sorting
- Personalized search hints

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
