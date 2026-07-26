# Jobs API Specification

## Overview

API specification للبحث عن الوظائف حسب الموقع الجغرافي. مصمم ليكون قابلاً للتوسع من البداية.

---

## Endpoints

### 1. Search Jobs by Map Bounds

**Endpoint:** `POST /api/v1/jobs/search-bounds`

**Purpose:** Search for jobs within geographic bounds

**Request:**

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
    "employmentType": ["full-time", "part-time"],
    "category": ["IT", "Design"],
    "salaryMin": 3000,
    "salaryMax": 10000,
    "status": ["active"]
  }
}
```

**Request Fields:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| bounds | Object | Yes | Geographic bounds for search |
| bounds.north | Number | Yes | Northern latitude |
| bounds.south | Number | Yes | Southern latitude |
| bounds.east | Number | Yes | Eastern longitude |
| bounds.west | Number | Yes | Western longitude |
| zoom | Number | No | Map zoom level (for analytics) |
| center | Object | No | Map center (for analytics) |
| filters | Object | No | Optional filters (empty = no filtering) |
| filters.employmentType | String[] | No | Employment types to include |
| filters.category | String[] | No | Job categories to include |
| filters.salaryMin | Number | No | Minimum salary |
| filters.salaryMax | Number | No | Maximum salary |
| filters.status | String[] | No | Job statuses to include |

**Response (200 OK):**

```json
{
  "success": true,
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123abc",
    "boundsSearch": {
      "north": 34.5,
      "south": 32.0,
      "east": 45.0,
      "west": 43.0
    }
  },
  "stats": {
    "totalFound": 150,
    "returnedCount": 42,
    "filteredOut": 108
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
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "description": "نبحث عن مطور React خبير لفريقنا",
      "skills": ["React", "Node.js", "TypeScript", "MongoDB"],
      "applicants": 12,
      "isNew": true
    },
    ...
  ]
}
```

**Response Fields:**

| Field | Type | Notes |
|-------|------|-------|
| success | Boolean | API call status |
| meta | Object | Request metadata |
| meta.timestamp | ISO8601 | Server response time |
| meta.requestId | String | Request ID for tracking |
| meta.boundsSearch | Object | Echo of search bounds |
| stats | Object | Result statistics |
| stats.totalFound | Number | Total jobs in bounds (before filtering) |
| stats.returnedCount | Number | Jobs in response (after filtering) |
| stats.filteredOut | Number | Jobs excluded by filters |
| jobs | Array | Job listings |

**Response Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Invalid bounds or filters |
| 401 | Unauthorized |
| 500 | Server error |

---

## Job Object Schema

```typescript
interface Job {
  // Identifiers
  id: number;
  
  // Geolocation (required)
  latitude: number;
  longitude: number;
  
  // Primary Information
  company: string;
  title: string;
  
  // Compensation
  salary: string;              // Display format: "6000-8000"
  salaryMin: number;           // Numeric minimum
  salaryMax: number;           // Numeric maximum
  
  // Classification
  employmentType: "full-time" | "part-time" | "contract" | "freelance";
  category: "IT" | "Design" | "Healthcare" | "Engineering" | "Sales" | "HR" | "Other";
  status: "active" | "expired" | "filled" | "paused";
  
  // Timestamps
  createdAt: ISO8601;
  updatedAt: ISO8601;
  
  // Extended Information
  description: string;         // Job description (text or HTML)
  skills: string[];           // Required skills
  applicants: number;         // Number of applicants
  
  // Computed Fields
  isNew?: boolean;            // True if created within last 24 hours
}
```

---

## Filter Values (Enums)

### Employment Types

```javascript
["full-time", "part-time", "contract", "freelance"]
```

### Job Categories

```javascript
["IT", "Design", "Healthcare", "Engineering", "Sales", "HR", "Other"]
```

### Job Status

```javascript
["active", "expired", "filled", "paused"]
```

---

## Performance Considerations

### Pagination (Future Enhancement)

Currently returns all jobs in bounds. Future versions may add:

```json
{
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 150
  }
}
```

### Caching

- Cache search results for 5 minutes
- Invalidate cache on new job creation
- Use request ID for debugging cache hits

### Bounds Threshold

- Minimum bounds size: ~1km x 1km
- Maximum bounds size: unlimited (but returns max 1000 jobs)
- Smaller bounds = faster queries

---

## Database Query (Reference Implementation)

```sql
SELECT * FROM jobs
WHERE status = 'active'
AND latitude BETWEEN ? AND ?          -- bounds.south to bounds.north
AND longitude BETWEEN ? AND ?         -- bounds.west to bounds.east
AND (? IS NULL OR employmentType IN (?))
AND (? IS NULL OR category IN (?))
AND (? IS NULL OR salaryMin >= ?)
AND (? IS NULL OR salaryMax <= ?)
ORDER BY createdAt DESC
LIMIT 1000;
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": {
    "code": "INVALID_BOUNDS",
    "message": "Invalid geographic bounds",
    "details": "north must be greater than south"
  }
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req_123abc"
  }
}
```

---

## Rate Limiting

- **Limit:** 100 requests per minute per user
- **Headers:**
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 95`
  - `X-RateLimit-Reset: 1705330200`

---

## Future Endpoints (P2+)

### Get Job Details
`GET /api/v1/jobs/{id}`

### Get Similar Jobs
`POST /api/v1/jobs/similar`

### Get Job Statistics
`POST /api/v1/jobs/stats/bounds`

### Search with Autocomplete
`GET /api/v1/jobs/search/autocomplete?q=developer`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-15 | Initial specification |

---

## Implementation Notes

1. **Always validate bounds** - Ensure north > south, east > west
2. **Sanitize filters** - Only allow known enum values
3. **Use indexes** - Create indexes on (latitude, longitude, status)
4. **Pagination ready** - Design with future pagination in mind
5. **Analytics** - Log all searches for analytics
6. **Cache strategy** - Balance between freshness and performance

