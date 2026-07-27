# FILE_OWNERS.md: Module Ownership and Boundaries

Defines which AI can modify which files, and what each module is responsible for.

**Principle:** Do not edit files outside your module unless explicitly approved.

---

## Backend Modules (NestJS)

### 🔐 Auth Module
**Path:** `backend/src/modules/auth/**`

**Responsibility:**
- User authentication
- JWT token generation
- Login/Register logic
- Password handling

**Can Edit:**
- ✅ Auth controller
- ✅ Auth service
- ✅ Auth guards
- ✅ Auth DTOs
- ✅ Auth middleware

**Cannot Edit Without Approval:**
- ❌ Database schema (unless auth-specific)
- ❌ User entity (use UserModule interface)
- ❌ Other module services
- ❌ Routes of other modules

**Related Modules:**
- Users (for user data)
- Database (for schema)

---

### 👥 Users Module
**Path:** `backend/src/modules/users/**`

**Responsibility:**
- User profile management
- User data retrieval
- User preferences
- User listing

**Can Edit:**
- ✅ Users controller
- ✅ Users service
- ✅ User entity
- ✅ User DTOs

**Cannot Edit:**
- ❌ Auth module
- ❌ Authentication logic
- ❌ Password changes (that's Auth)
- ❌ Other modules' services

---

### 💼 Companies Module
**Path:** `backend/src/modules/companies/**`

**Responsibility:**
- Company management
- Company profiles
- Company listings
- Company data

**Can Edit:**
- ✅ Companies controller
- ✅ Companies service
- ✅ Company entity
- ✅ Company DTOs

**Cannot Edit:**
- ❌ Jobs module (separate responsibility)
- ❌ User relationships (Users module)
- ❌ Authentication

---

### 💼 Jobs Module
**Path:** `backend/src/modules/jobs/**`

**Responsibility:**
- Job postings
- Job listings
- Job details
- Job filtering

**Can Edit:**
- ✅ Jobs controller
- ✅ Jobs service
- ✅ Job entity
- ✅ Job DTOs

**Cannot Edit:**
- ❌ Companies module (reference only)
- ❌ Applications module
- ❌ User module

---

### 📍 Locations Module
**Path:** `backend/src/modules/locations/**`

**Responsibility:**
- Location data
- Geographic services
- Location anonymization
- Mapping data

**Can Edit:**
- ✅ Locations service
- ✅ Location entity
- ✅ Location utilities

**Cannot Edit:**
- ❌ Other module business logic
- ❌ Maps component (that's frontend)

---

### 📝 Applications Module
**Path:** `backend/src/modules/applications/**`

**Responsibility:**
- Job applications
- Application status
- Application tracking
- Applicant management

**Can Edit:**
- ✅ Applications controller
- ✅ Applications service
- ✅ Application entity
- ✅ Application DTOs

**Cannot Edit:**
- ❌ Jobs module
- ❌ Users module
- ❌ Status workflow of other modules

---

### 🔔 Notifications Module
**Path:** `backend/src/modules/notifications/**`

**Responsibility:**
- Notification sending
- Notification templates
- Notification channels

**Can Edit:**
- ✅ Notifications service
- ✅ Notification templates

**Cannot Edit:**
- ❌ Other module logic
- ❌ Triggering conditions (those belong to the originating module)

---

### 🔍 Saved Searches Module
**Path:** `backend/src/modules/saved-searches/**`

**Responsibility:**
- User saved searches
- Search preferences
- Search management

**Can Edit:**
- ✅ Saved searches controller
- ✅ Saved searches service
- ✅ Search entity

**Cannot Edit:**
- ❌ Job searching logic (Jobs module)
- ❌ Filter implementation

---

### 🌐 Common/Shared (Backend)
**Path:** `backend/src/common/**` and `backend/src/shared/**`

**Responsibility:**
- Global guards
- Filters
- Interceptors
- Utilities
- Services

**Can Edit:**
- ✅ With prior knowledge of their usage

**Cannot Edit:**
- ❌ Without understanding all dependents
- ❌ Without running full test suite

---

## Frontend Modules (React)

### 🔐 Auth Pages
**Path:** `web/dashboard/src/pages/LoginPage.jsx`, `RegisterPage.jsx`, `OnboardingPage.jsx`

**Responsibility:**
- User authentication UI
- Login form
- Registration form
- Onboarding flow

**Can Edit:**
- ✅ Auth page components
- ✅ Auth logic
- ✅ Form validation

**Cannot Edit:**
- ❌ JobsMap component
- ❌ Dashboard layout
- ❌ Other page logic

---

### 🏠 Dashboard Page
**Path:** `web/dashboard/src/pages/DashboardPage.jsx`

**Responsibility:**
- Main dashboard view
- Component orchestration
- State management for dashboard

**Can Edit:**
- ✅ Dashboard layout
- ✅ Dashboard routing
- ✅ Component composition

**Cannot Edit:**
- ❌ Child component internals
- ❌ Global app state
- ❌ Auth logic

---

### 📍 Map Component
**Path:** `web/dashboard/src/components/JobsMap/`

**Responsibility:**
- Map visualization
- Map interactions
- Location display
- Job location pins

**Can Edit:**
- ✅ Map rendering
- ✅ Map interactions
- ✅ Location display logic

**Cannot Edit:**
- ❌ Job filtering (JobListings module)
- ❌ User location (Locations backend)
- ❌ Application logic

---

### 📋 Job Listings Component
**Path:** `web/dashboard/src/components/JobListings/`

**Responsibility:**
- Job list display
- Job filtering
- Job searching
- Job sorting

**Can Edit:**
- ✅ Job list UI
- ✅ Filtering logic
- ✅ Sorting logic

**Cannot Edit:**
- ❌ Map component
- ❌ Job creation
- ❌ Application status

---

### 📊 Analytics Component
**Path:** `web/dashboard/src/components/Analytics/`

**Responsibility:**
- Statistics display
- Chart rendering
- Data visualization
- Analytics dashboard

**Can Edit:**
- ✅ Chart components
- ✅ Statistics display
- ✅ Data formatting

**Cannot Edit:**
- ❌ Data calculation (backend)
- ❌ Other components

---

### 👥 Applicants Component
**Path:** `web/dashboard/src/components/Applicants/`

**Responsibility:**
- Applicant list display
- Applicant cards
- Applicant status display
- Application management UI

**Can Edit:**
- ✅ Applicant list UI
- ✅ Status buttons
- ✅ Applicant card display

**Cannot Edit:**
- ❌ ApplicantModal (separate component)
- ❌ Backend application logic
- ❌ Notification sending

---

### 🗣️ ApplicantModal Component
**Path:** `web/dashboard/src/components/ApplicantModal/`

**Responsibility:**
- Applicant detail view
- Applicant message sending
- Applicant profile display

**Can Edit:**
- ✅ Modal UI
- ✅ Modal logic

**Cannot Edit:**
- ❌ Applicants list
- ❌ Application status update

---

### 🔔 NotificationCenter Component
**Path:** `web/dashboard/src/components/NotificationCenter/`

**Responsibility:**
- Notification display
- Notification list
- Notification UI

**Can Edit:**
- ✅ Notification UI
- ✅ Notification display

**Cannot Edit:**
- ❌ Notification sending (backend)
- ❌ Notification creation

---

### 📈 StatsCard Component
**Path:** `web/dashboard/src/components/StatsCard/`

**Responsibility:**
- Stat card display
- Stat formatting
- Card UI

**Can Edit:**
- ✅ Card UI
- ✅ Display logic

**Cannot Edit:**
- ❌ Analytics logic

---

### 🎨 DashboardLayout Component
**Path:** `web/dashboard/src/components/DashboardLayout/`

**Responsibility:**
- Main layout structure
- Navigation
- Layout composition

**Can Edit:**
- ✅ Layout structure
- ✅ Navigation
- ✅ Common UI

**Cannot Edit:**
- ❌ Page content
- ❌ Feature logic

---

### 🔐 RequireAuth Component
**Path:** `web/dashboard/src/components/RequireAuth.jsx`

**Responsibility:**
- Route protection
- Auth check
- Redirect logic

**Can Edit:**
- ✅ Auth guard logic
- ✅ Redirect handling

**Cannot Edit:**
- ❌ Auth service (backend)
- ❌ Token logic

---

### 🌐 Services Layer
**Path:** `web/dashboard/src/services/**`

**Responsibility:**
- API calls
- Backend communication
- Data fetching

**Can Edit:**
- ✅ API service methods
- ✅ Request formatting
- ✅ Error handling

**Cannot Edit:**
- ❌ Backend endpoints (edit backend)
- ❌ Component logic (that's component responsibility)

---

### 📦 Store/State Management
**Path:** `web/dashboard/src/store/**`

**Responsibility:**
- Global state
- Redux/Context logic
- State persistence

**Can Edit:**
- ✅ State structure
- ✅ Actions
- ✅ Reducers

**Cannot Edit:**
- ❌ Without understanding all subscribers
- ❌ Breaking state contract

---

### 🎯 Features Layer
**Path:** `web/dashboard/src/features/**`

**Responsibility:**
- Feature-specific logic
- Feature state
- Feature utilities

**Can Edit:**
- ✅ Within feature scope
- ✅ Feature logic

**Cannot Edit:**
- ❌ Other features' logic
- ❌ Global state

---

## Cross-Module Rules

### 🚫 What Never Changes

These should rarely be modified:

```
❌ Never change (without approval):
  - Module interfaces/contracts
  - Public API endpoints
  - Database schema (only add, never remove)
  - Authentication flow
  - Core routing structure
  - Global state structure
```

### ✅ What's OK to Change

These are safe to modify within module:

```
✅ Can change:
  - Implementation details
  - Internal component logic
  - UI/styling (if in component)
  - Error messages
  - Comments and documentation
  - Local state management
```

---

## Approval Needed For

Ask before modifying if:

- [ ] Crosses module boundary
- [ ] Changes public interface
- [ ] Affects multiple modules
- [ ] Modifies shared/common code
- [ ] Changes backend endpoints
- [ ] Alters database schema
- [ ] Modifies authentication
- [ ] Changes routing

---

## Module Dependency Map

```
Auth Module
  └─→ Users Module
  └─→ Notifications Module

Jobs Module
  └─→ Companies Module
  └─→ Locations Module

Applications Module
  └─→ Jobs Module
  └─→ Users Module
  └─→ Notifications Module

Saved Searches Module
  └─→ Jobs Module
  └─→ Locations Module

Frontend: JobsMap
  └─→ Locations (backend)
  └─→ Jobs (backend)

Frontend: JobListings
  └─→ Jobs (backend)
  └─→ Saved Searches (backend)

Frontend: Applicants
  └─→ Applications (backend)
  └─→ Users (backend)

Frontend: Analytics
  └─→ Applications (backend)
  └─→ Jobs (backend)
```

---

## File Ownership Checklist

Before editing a file:

- [ ] Is this file in my assigned module?
- [ ] Have I checked FILE_OWNERS.md?
- [ ] Do I need cross-module changes?
- [ ] Should I ask for approval?
- [ ] Am I only fixing the assigned issue?

---

## When to Ask Permission

Message format:

```
Module Crossing Alert

I need to modify:
- [Module A] file1.js
- [Module B] file2.js

Reason: [Fix/Feature]
Impact: [What changes]
Approved: [Waiting]
```

**Always ask before:**
- Editing files in unlisted modules
- Crossing module boundaries
- Changing module interfaces
- Modifying shared/common code

---

## Ownership Violations

If you edit outside your module without approval:

🚨 **Change will be rejected**
- Code review will fail
- Changes must be reverted
- Document violation in CHANGELOG_AI.md

**Prevention:** Check FILE_OWNERS.md before every edit.
