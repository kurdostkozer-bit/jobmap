# Engineering Standards

**Version:** 1.0  
**Last Updated:** 2026-07-26  
**Owner:** JobMap

Quick daily reference. For details, check COMPREHENSIVE_ROADMAP.md or ARCHITECTURE_DECISIONS.md.

---

## 🎯 3 Core Principles

1. **Map First** — Map is the app, not a feature
2. **API First** — Clean, reusable APIs; no UI logic in services
3. **Domain Driven** — Jobs, Users, Employers are separate domains

---

## 💻 Coding Rules

**TypeScript/Backend:**
- ESLint must pass
- No `any` types
- Strict null checks
- No duplicated logic
- No hardcoded values

**React/Frontend:**
- Components < 300 lines
- No unnecessary re-renders
- No inline styles
- Hooks at component top

**Flutter/Mobile:**
- Use providers for state
- No network calls in build()
- Separate UI from logic

---

## 🏗️ Architecture

**Separation of Concerns:**
- API Layer → HTTP only
- Service Layer → Business logic
- UI Layer → Presentation only

**File Structure:**
```
Backend:  src/modules/{feature}/{dto,entities,service,controller,module}
Frontend: src/features/{feature}/{api,store,components,hooks}
```

---

## 🔗 Git & PR

**Commits:** Conventional format (feat/fix/docs/refactor/test)
- One logical change per commit
- < 72 chars title
- Include issue number if applicable

**Before Merge:**
- ESLint passes
- Tests pass
- Code reviewed
- Docs updated

---

## ⚡ Performance

**Frontend:**
- Debounce map events (300ms+)
- Virtualize large lists
- Cache API responses (5 min TTL)

**Backend:**
- Index: latitude, longitude, user_id, status
- Pagination for large results
- Join/eager load (no N+1 queries)

---

## 🔐 Security

**Always:**
- Validate ALL input (frontend AND backend)
- Never trust frontend
- Authorization in backend only
- HTTPS in production

**Never:**
- Hardcode secrets
- Trust user role from frontend
- Store sensitive data in localStorage

---

## 📋 Code Review Checklist

- [ ] Works as described
- [ ] ESLint passes
- [ ] No console errors
- [ ] No duplicated code
- [ ] Naming is clear
- [ ] Input validated
- [ ] No secrets in code
- [ ] Edge cases handled

---

## 📚 Quick Links

| Need | Look Here |
|------|-----------|
| Direction? | COMPREHENSIVE_ROADMAP.md |
| Architecture? | ARCHITECTURE_DECISIONS.md |
| Tech? | TECH_STACK.md |
| Getting Started? | START_HERE.md |
| Setup? | README.md |

