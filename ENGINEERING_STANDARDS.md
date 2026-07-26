# Engineering Standards

**Reference:** Daily development guide for maintaining code quality and consistency.

---

## 🎯 Core Principles (Non-Negotiable)

### 1️⃣ Map First
- Map is center of discovery
- Every feature serves map-first thinking
- Geography drives data model

### 2️⃣ API First
- Clean, reusable APIs
- No UI logic scattered in components
- Backend logic in services, not views

### 3️⃣ Domain Driven
- Jobs, Users, Employers, Applications = separate domains
- Clear boundaries between domains
- Each domain owns its entities & logic

---

## 💻 Coding Rules

### TypeScript/Backend
```
✅ ESLint must pass
  npm run lint

✅ No 'any' type
  ❌ let x: any = ...
  ✅ let x: User = ...

✅ Strict null checks enabled
  ✅ type | null
  ❌ type (without null handling)

✅ No duplicated business logic
  ❌ Same validation in 2 files
  ✅ Shared validation service

✅ No hardcoded values
  ❌ const MAX_JOBS = 100;
  ✅ Use config/env variables
```

### React/Frontend
```
✅ Components < 300 lines
  ❌ Component.jsx = 500 lines
  ✅ Break into smaller components

✅ No re-renders without reason
  ❌ new object {} on every render
  ✅ useMemo for derived state

✅ No inline styles
  ❌ <div style={{color: 'red'}}>
  ✅ <div className="error">

✅ Hooks in correct order
  ❌ useEffect inside conditional
  ✅ useEffect at component top
```

### Flutter/Mobile
```
✅ No setState without reason
✅ Use providers for state management
✅ Separate UI from business logic
✅ No network calls in build()
```

---

## 🏗️ Architecture Rules

### Separation of Concerns
```
API Layer:
  └─ HTTP client
     ├─ Request/response models
     └─ Error handling

Service Layer:
  └─ Business logic
     ├─ Data transformation
     └─ Caching

UI Layer:
  └─ Presentation only
     ├─ Props/State
     └─ Event handling

❌ DON'T:
  - API calls in components
  - Business logic in UI
  - UI in services
```

### File Organization
```
Backend:
  src/modules/jobs/
    ├─ dto/               (request/response models)
    ├─ entities/         (database models)
    ├─ jobs.service.ts   (business logic)
    ├─ jobs.controller.ts (HTTP routing)
    └─ jobs.module.ts    (DI config)

Frontend:
  src/features/jobs/
    ├─ api/             (HTTP calls)
    ├─ store/           (Redux state)
    ├─ components/      (UI components)
    └─ hooks/           (Custom hooks)
```

---

## 🔗 Git Rules

### Commits
```
✅ Conventional Commits format:
  feat: add job clustering at zoom 10
  fix: prevent memory leak in map
  docs: update clustering algorithm
  refactor: extract clustering service
  test: add clustering unit tests

✅ One logical change per commit
✅ Commit message < 72 chars
✅ Include issue number if applicable
  feat: add clustering (#123)
```

### Branching
```
✅ Branch naming:
  feature/job-clustering
  fix/memory-leak
  docs/roadmap-update
  refactor/extract-service

❌ DON'T:
  - Push directly to main
  - Commit without message
  - Merge without review
```

### Pull Requests
```
✅ Before merging:
  - ESLint passes
  - Tests pass (if added)
  - Code reviewed
  - Documentation updated

✅ PR title < 70 chars
✅ PR description explains WHY, not WHAT
```

---

## ⚡ Performance Rules

### Frontend
```
✅ Debounce map events (300ms minimum)
  - pan
  - zoom
  - search

✅ Virtualize large lists
  ❌ Render 1000 items
  ✅ Render only visible ~50 items

✅ No unnecessary re-renders
  ❌ Pass new {} on every render
  ✅ useMemo for derived state

✅ Lazy load components
  ❌ import Component from '...'
  ✅ const Component = lazy(() => import('...'))

✅ Cache API responses
  - 5 min TTL for bounds searches
  - Invalidate on user action
```

### Backend
```
✅ Database indexes on:
  - latitude, longitude (bounds search)
  - user_id (ownership queries)
  - status (filtering)

✅ Pagination on large results
  ❌ SELECT * FROM jobs (all 10K)
  ✅ SELECT ... LIMIT 100 OFFSET 0

✅ Query optimization
  ❌ N+1 queries
  ✅ JOIN or eager load

✅ Cache expensive operations
  - Clustering results (per zoom)
  - Governorate hierarchies
```

---

## 🔐 Security Rules

### Input Validation
```
✅ Validate ALL input (frontend & backend)
  - Type checking
  - Length limits
  - Range validation

✅ Never trust frontend validation
  ❌ Validate only in React
  ✅ Validate in backend API

✅ Sanitize user input
  - Remove scripts
  - Escape HTML
  - Validate emails
```

### Authentication/Authorization
```
✅ JWT tokens only
✅ Authorization in backend (never frontend)
✅ Never expose sensitive data in localStorage
✅ HTTPS in production
✅ Rate limiting on auth endpoints

❌ DON'T:
  - Store tokens in sessionStorage
  - Trust user role from frontend
  - Expose database IDs to UI
```

### API Security
```
✅ CORS configured (specific origins)
✅ Rate limiting (100 req/min per IP)
✅ Input size limits
✅ SQL injection protection (ORM)
✅ CSRF tokens for state-changing requests
```

---

## 📝 Code Review Checklist

Before submitting PR, verify:

### Functionality
- [ ] Feature works as described
- [ ] No console errors
- [ ] No console.log left in code
- [ ] Edge cases handled

### Code Quality
- [ ] ESLint passes
- [ ] No duplicated code
- [ ] No hardcoded values
- [ ] Naming is clear

### Performance
- [ ] No unnecessary re-renders (React)
- [ ] No N+1 queries
- [ ] Debouncing applied where needed
- [ ] Large lists virtualized

### Security
- [ ] Input validated
- [ ] No secrets in code
- [ ] Authorization checks in place
- [ ] Rate limiting applied

### Documentation
- [ ] Code comments for complex logic
- [ ] Git commit message clear
- [ ] PR description explains WHY
- [ ] README updated if needed

### Testing
- [ ] Manual testing done
- [ ] Edge cases tested
- [ ] Unit tests pass (if applicable)

---

## 🧪 Testing Standards

### Unit Tests
```
✅ Test business logic only
✅ Mock external dependencies
✅ 80%+ coverage for services
✅ File naming: feature.service.test.ts

❌ DON'T:
  - Test implementation details
  - Test UI rendering
  - Test framework features
```

### Integration Tests
```
✅ Test API endpoints
✅ Test database queries
✅ Test with real services (not mocks)
```

### Manual Testing
```
✅ Test on real device (if mobile)
✅ Test on multiple browsers (if web)
✅ Test with production data volume
✅ Verify error scenarios
```

---

## 📊 Metrics to Monitor

### Performance
```
API Response Time: < 100ms (p95)
Clustering Time: < 50ms for 1000 jobs
Memory: Stable over time (no leaks)
FPS: 50+ during interaction
```

### Code Quality
```
ESLint Violations: 0
Test Coverage: > 80% for services
Duplicate Code: < 5% of codebase
```

### Security
```
Vulnerabilities: 0 critical
Failed Auth Attempts Blocked: Yes
Rate Limiting Active: Yes
```

---

## 🔄 Update Process

When requirements change:

1. **Update COMPREHENSIVE_ROADMAP.md** (if milestone changes)
2. **Update ARCHITECTURE_DECISIONS.md** (if decision changes)
3. **Update this file** (if standards change)
4. **Commit with message:** `docs: update standards/roadmap`

---

## 📚 Quick Reference

| Need | Where to Look |
|------|---------------|
| Project direction? | `COMPREHENSIVE_ROADMAP.md` |
| Architecture choice? | `ARCHITECTURE_DECISIONS.md` |
| Tech details? | `TECH_STACK.md` |
| How to start? | `START_HERE.md` |
| How to run? | `README.md` |
| Coding rules? | This file |

---

**Status:** Active  
**Last Updated:** 2026-07-26  
**Maintained By:** Solo Developer
