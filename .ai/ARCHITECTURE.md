# ARCHITECTURE.md: Technology Stack Freeze

Defines the approved technology stack and architectural decisions for JobMap.

**Principle:** Do not replace, upgrade, or change any technology without explicit approval.

---

## Architecture Freeze Policy

```
SHORT-TERM FREEZE: Locked (do not change)

LONG-TERM: Migrations allowed IF documented with ADR

Frozen decisions protect stability.
Migrations are possible with proper process.
```

### Two-Tier Approach

```
🟢 SHORT-TERM (< 1 year)
├─ Technology is FROZEN
├─ No changes without emergency
├─ Stability prioritized
└─ Team learns current stack

🟡 LONG-TERM (1+ years)
├─ Migration possible
├─ Requires Architecture Decision Record (ADR)
├─ Must document:
│  ├─ Why change?
│  ├─ What alternatives?
│  ├─ What are tradeoffs?
│  ├─ Migration plan?
│  └─ Timeline?
├─ Needs team approval
└─ Phased migration allowed
```

### When Freeze is Lifted

Short-term freeze can be challenged if:

```
✓ Security vulnerability in current tech
✓ Current tech is deprecated/abandoned
✓ Critical performance issue
✓ Team consensus for change
✓ Project needs justify change
✗ Just "new and shiny"
✗ Personal preference
✗ Hype cycle
```

### Migration Process

If migration is needed:

1. **Create ADR**
   ```
   File: .ai/ADR/XXX-migrate-to-[new-tech].md
   Document: Context, Decision, Consequences, Alternatives
   ```

2. **Get Approval**
   - Project lead approval
   - Team discussion
   - Risk assessment
   - Timeline agreement

3. **Plan Migration**
   - Phased approach
   - Timeline (typically 4-8 weeks)
   - Parallel running (if possible)
   - Rollback plan

4. **Execute Migration**
   - Incremental changes
   - Full testing at each phase
   - Team training
   - Documentation update

5. **Update ARCHITECTURE.md**
   - New tech becomes FROZEN
   - New ADR reference added
   - New migration path documented

---

### Example: Future Vite Migration

```
If in 2 years we decide to migrate from CRA to Vite:

Step 1: Create ADR-050-migrate-to-vite.md

Context:
- CRA has served well for 2+ years
- Build times are increasing
- Vite offers faster builds
- Team has Vite experience

Decision:
Migrate to Vite for faster builds

Consequences:
- Build time: 2 min → 30 sec
- New tool to learn (minimal)
- Config changes needed
- Plugin ecosystem different

Alternatives:
- Stay with CRA (increasingly slow)
- Try Turbopack (experimental)
- Manual Webpack (complex)

Timeline:
Week 1-2: Setup Vite project
Week 3-4: Migrate core components
Week 5-6: Migrate all components
Week 7: Testing and fixes
Week 8: Deploy

Step 2: Team approves ADR

Step 3: Execute migration plan

Step 4: Update ARCHITECTURE.md:
   CRA → Vite (refer to ADR-050)

Result: New technology is now FROZEN for next cycle
```

---

## Important Note for AI Assistants

```
CURRENT STATUS (2026):

All technologies listed below are FROZEN for development.

You CANNOT change them.

You CAN:
✅ Use them within their scope
✅ Learn their best practices
✅ Optimize within them

You CANNOT:
❌ Replace them
❌ Upgrade major versions
❌ Add alternatives
❌ Change architecture

Exception:
If future ADR documents approval for migration,
update ARCHITECTURE.md accordingly and follow new tech.
```

---

## Architecture Freeze Policy (Original)

---

## Frontend Architecture

### Core Framework
**Technology:** React 18.x  
**Status:** ✅ FROZEN

**Why:**
- Industry standard for dashboards
- Large ecosystem of libraries
- Performance optimized
- Team expertise

**Cannot Change:**
- ❌ Switch to Vue, Angular, Svelte, etc.
- ❌ Downgrade to React 16
- ❌ Upgrade major version without testing
- ❌ Use experimental React features

**If you need:**
- New React version? Ask project lead
- Different framework? Not approved
- React alternative? Discuss with team

---

### Build Tool
**Technology:** Create React App (CRA)  
**Status:** ✅ FROZEN

**Why:**
- Zero configuration
- Built-in ESLint, Jest, Webpack
- Optimized for production builds
- Team familiarity

**Cannot Change:**
- ❌ Eject CRA (except critical reason)
- ❌ Switch to Vite
- ❌ Switch to Next.js
- ❌ Manual Webpack setup

**Note:** If ejecting, document extensively

---

### State Management
**Technology:** React Hooks + Context API  
**Status:** ✅ FROZEN

**Why:**
- Built into React
- Good for small to medium state
- No extra dependencies
- Team understands hooks

**Cannot Change:**
- ❌ Add Redux (unless explicitly approved)
- ❌ Add MobX
- ❌ Add Zustand
- ❌ Switch to other state management

**If you need:**
- Complex state? Optimize current solution
- New pattern? Discuss with team first

---

### Styling
**Technology:** CSS (with CSS Modules or inline styles)  
**Status:** ✅ FROZEN

**Why:**
- Simple and fast
- No extra dependencies
- Easy to maintain
- Team familiar

**Cannot Change:**
- ❌ Add Tailwind CSS
- ❌ Add styled-components
- ❌ Add emotion
- ❌ Add SASS/SCSS

**Exception:** If CSS proves inadequate, discuss alternatives

---

### Routing
**Technology:** React Router v6+  
**Status:** ✅ FROZEN

**Why:**
- Standard in React ecosystem
- Handles client-side routing well
- Good performance
- Mature library

**Cannot Change:**
- ❌ Switch to other routing library
- ❌ Manual routing implementation
- ❌ Use history directly

---

### HTTP Client
**Technology:** Fetch API or Axios  
**Status:** ✅ FROZEN

**Why:**
- Fetch: Native browser API
- Axios: Simple HTTP client
- Both reliable and well-tested

**Cannot Change:**
- ❌ Switch to GraphQL
- ❌ Switch to different HTTP library
- ❌ Manual XMLHttpRequest

---

### Maps Library
**Technology:** Leaflet + React Leaflet  
**Status:** ✅ FROZEN

**Why:**
- Lightweight (39 KB)
- OpenStreetMap compatible
- Good performance
- Team expertise

**Cannot Change:**
- ❌ Switch to Google Maps
- ❌ Switch to Mapbox
- ❌ Switch to other mapping library

---

### UI Components
**Technology:** Custom components (from scratch)  
**Status:** ✅ FROZEN

**Why:**
- Full control over design
- No external UI framework bloat
- Custom to JobMap needs
- Team built them

**Cannot Change:**
- ❌ Add Material-UI
- ❌ Add Bootstrap
- ❌ Add Ant Design
- ❌ Add any component library

**If you need:** Extend existing components, don't add dependencies

---

### Testing Framework
**Technology:** Jest + React Testing Library  
**Status:** ✅ FROZEN

**Why:**
- Jest: Industry standard test runner
- React Testing Library: Best practices for React testing
- Both come with CRA
- Good performance

**Cannot Change:**
- ❌ Switch to Mocha
- ❌ Switch to Vitest
- ❌ Switch to other testing library

---

### Node.js Version
**Technology:** Node.js 18 LTS or higher  
**Status:** ✅ FROZEN

**Version Range:** `18.x`, `20.x`, `22.x` (LTS only)

**Cannot Change:**
- ❌ Downgrade to Node 16
- ❌ Use non-LTS versions
- ❌ Use very old versions

**Update Policy:**
- New LTS versions OK to update to
- Always test after upgrade
- Update package-lock.json

---

### npm Version
**Technology:** npm 9.x or higher  
**Status:** ✅ FROZEN

**Why:**
- Latest features
- Better dependency resolution
- Faster installs

**Cannot Change:**
- ❌ Use old npm versions
- ❌ Switch to yarn without approval

---

## Backend Architecture

### Core Framework
**Technology:** NestJS 10.x  
**Status:** ✅ FROZEN

**Why:**
- Enterprise-grade framework
- TypeScript first
- Modular architecture
- Great for APIs

**Cannot Change:**
- ❌ Switch to Express (unless critical)
- ❌ Switch to Fastify
- ❌ Downgrade version
- ❌ Use non-standard NestJS patterns

---

### Language
**Technology:** TypeScript 5.x  
**Status:** ✅ FROZEN

**Why:**
- Type safety
- Better IDE support
- Catches errors at compile time
- Team expertise

**Cannot Change:**
- ❌ Switch to plain JavaScript
- ❌ Downgrade TypeScript
- ❌ Disable strict mode

**Rules:**
- All code must be TypeScript
- No `any` type
- `strict: true` in tsconfig

---

### Database
**Technology:** PostgreSQL 14+  
**Status:** ✅ FROZEN

**Why:**
- Relational database
- ACID compliance
- Good for structured data
- Proven reliability

**Cannot Change:**
- ❌ Switch to MySQL
- ❌ Switch to MongoDB
- ❌ Switch to other database

**Connection Pool:** PgBouncer or similar

---

### ORM
**Technology:** TypeORM 0.3.x  
**Status:** ✅ FROZEN

**Why:**
- Active record pattern
- Works great with NestJS
- Good query builder
- Type-safe queries

**Cannot Change:**
- ❌ Switch to Sequelize
- ❌ Switch to Prisma
- ❌ Use raw SQL queries (unless critical)

---

### Database Migrations
**Technology:** TypeORM Migrations  
**Status:** ✅ FROZEN

**Why:**
- Version control for schema
- Reversible
- Part of TypeORM

**Cannot Change:**
- ❌ Use Flyway
- ❌ Use other migration tool
- ❌ Manual migrations

---

### Authentication
**Technology:** JWT (JSON Web Tokens)  
**Status:** ✅ FROZEN

**Why:**
- Stateless
- Scalable
- Industry standard
- Works with microservices

**Cannot Change:**
- ❌ Switch to sessions
- ❌ Switch to OAuth (unless needed)
- ❌ Use basic auth for production

**Token Library:** `@nestjs/jwt`

---

### Password Hashing
**Technology:** bcrypt  
**Status:** ✅ FROZEN

**Why:**
- Industry standard
- Slow by design (prevents brute force)
- Well-tested
- Secure

**Cannot Change:**
- ❌ Use plain text
- ❌ Use MD5 or SHA1
- ❌ Use other algorithm without reason

---

### Validation
**Technology:** class-validator + class-transformer  
**Status:** ✅ FROZEN

**Why:**
- Works with NestJS decorators
- Type-safe validation
- Good performance
- Consistent validation

**Cannot Change:**
- ❌ Use other validation library
- ❌ Manual validation

---

### Logging
**Technology:** Winston or Pino  
**Status:** ✅ FROZEN

**Why:**
- Structured logging
- Multiple transports
- Good performance
- Easy to parse

**Cannot Change:**
- ❌ Use console.log (only for dev)
- ❌ Use other logging library

---

### API Documentation
**Technology:** Swagger/OpenAPI  
**Status:** ✅ FROZEN

**Why:**
- Industry standard
- Auto-generated docs
- Client generation
- NestJS integration

**Cannot Change:**
- ❌ Use GraphQL
- ❌ Manual documentation

---

### Testing Framework
**Technology:** Jest  
**Status:** ✅ FROZEN

**Why:**
- Standard for Node.js
- TypeScript support
- Good performance
- NestJS recommended

**Cannot Change:**
- ❌ Switch to Mocha
- ❌ Switch to other framework

---

## Shared Technologies

### Version Control
**Technology:** Git  
**Status:** ✅ FROZEN

**Repository:** GitHub  
**Status:** ✅ FROZEN

**Branch Strategy:** Git Flow  
**Status:** ✅ FROZEN

**Cannot Change:**
- ❌ Switch to Mercurial
- ❌ Switch to GitLab (unless organizational change)
- ❌ Use different branching strategy

---

### Code Formatting
**Technology:** Prettier  
**Status:** ✅ FROZEN

**Why:**
- Consistent code style
- Zero configuration (mostly)
- Industry standard
- Works with ESLint

**Cannot Change:**
- ❌ Switch to other formatter
- ❌ Disable Prettier

---

### Linting
**Technology:** ESLint  
**Status:** ✅ FROZEN

**Why:**
- Most popular linter
- Lots of plugins
- Configurable
- NestJS/React compatible

**Cannot Change:**
- ❌ Switch to JSHint
- ❌ Switch to other linter
- ❌ Disable ESLint

---

### Environment Variables
**Technology:** `.env` files + `dotenv`  
**Status:** ✅ FROZEN

**Why:**
- Simple and standard
- Works for both frontend and backend
- Environment-specific configuration

**Cannot Change:**
- ❌ Use other configuration system
- ❌ Commit `.env` files

---

### Package Manager
**Technology:** npm  
**Status:** ✅ FROZEN

**Why:**
- Default for Node.js
- Large package registry
- Good dependency resolution

**Cannot Change:**
- ❌ Switch to yarn (without approval)
- ❌ Switch to pnpm (without approval)

---

## Architecture Decisions (Frozen)

### Modular Structure

✅ **Approved:**

**Backend:**
```
src/
├── modules/              ← Feature modules
│   ├── auth/
│   ├── users/
│   ├── jobs/
│   └── ...
├── common/               ← Shared utilities
├── database/             ← DB config & migrations
└── shared/               ← Shared services
```

**Frontend:**
```
src/
├── components/           ← Reusable components
├── pages/               ← Page components
├── services/            ← API services
├── store/               ← State management
├── features/            ← Feature-specific logic
└── shared/              ← Shared utilities
```

**Cannot Change:**
- ❌ Reorganize module structure
- ❌ Move files between modules
- ❌ Change folder naming

---

### API Design

✅ **REST API** (not GraphQL)

**Endpoints:** `/api/v1/*`

**Cannot Change:**
- ❌ Switch to GraphQL
- ❌ Change version scheme
- ❌ Change endpoint structure

---

### Database Design

✅ **Relational Model** (not document-based)

**Cannot Change:**
- ❌ Switch to document store
- ❌ Denormalize aggressively
- ❌ Use non-standard schemas

---

### Authentication

✅ **JWT Tokens** in Authorization header

**Cannot Change:**
- ❌ Use cookies for API tokens
- ❌ Use basic auth
- ❌ Change token storage

---

## Approval Process for Technology Changes

If you want to change technology:

1. **Document Request**
   ```
   Technology: [Current] → [Proposed]
   Reason: [Why change]
   Risk: [What could break]
   Alternative: [Other options considered]
   Benefit: [Specific benefits]
   ```

2. **Seek Approval**
   - Project lead must approve
   - Team must review
   - Risks must be mitigated

3. **Only Then**
   - Update ARCHITECTURE.md
   - Update package.json
   - Update documentation
   - Test thoroughly

---

## Security Stack

### HTTPS/TLS
**Status:** ✅ REQUIRED in production

**Cannot Change:**
- ❌ Use HTTP in production
- ❌ Disable SSL/TLS

---

### CORS
**Status:** ✅ CONFIGURED

**Cannot Change:**
- ❌ Disable CORS security
- ❌ Allow all origins in production

---

### CSRF Protection
**Status:** ✅ REQUIRED

**Cannot Change:**
- ❌ Disable CSRF protection

---

### Rate Limiting
**Status:** ✅ REQUIRED

**Cannot Change:**
- ❌ Disable rate limiting

---

## Performance Requirements

### Frontend Bundle Size
- Main JS: < 300 kB (gzipped)
- Main CSS: < 50 kB (gzipped)
- Total: < 500 kB (gzipped)

### Backend Response Time
- API response: < 500ms (p95)
- Database query: < 100ms (p95)

### Build Time
- Frontend: < 2 minutes
- Backend: < 1 minute

### Test Execution
- Frontend tests: < 2 minutes
- Backend tests: < 2 minutes

---

## Technology Checklist

Before proposing any technology change:

- [ ] Have I read ARCHITECTURE.md?
- [ ] Is this technology in the frozen list?
- [ ] Is there a good reason to change?
- [ ] Have I discussed with the team?
- [ ] Is this a security/performance issue?
- [ ] Is this just "nice to have"?

**If uncertain, ask before proceeding.**

---

## Quick Reference

| Layer | Technology | Status | Notes |
|-------|-----------|--------|-------|
| **Frontend** | | | |
| Framework | React 18 | ✅ Frozen | No alternatives |
| Build | CRA | ✅ Frozen | Do not eject |
| State | Hooks + Context | ✅ Frozen | No Redux |
| Styling | CSS | ✅ Frozen | No Tailwind |
| Routing | React Router 6 | ✅ Frozen | No alternatives |
| HTTP | Fetch/Axios | ✅ Frozen | No GraphQL |
| Maps | Leaflet | ✅ Frozen | No Google Maps |
| Testing | Jest + RTL | ✅ Frozen | No alternatives |
| | | | |
| **Backend** | | | |
| Framework | NestJS 10 | ✅ Frozen | No Express |
| Language | TypeScript 5 | ✅ Frozen | Strict mode |
| Database | PostgreSQL 14+ | ✅ Frozen | No MongoDB |
| ORM | TypeORM | ✅ Frozen | No Prisma |
| Auth | JWT | ✅ Frozen | No sessions |
| Validation | class-validator | ✅ Frozen | No alternatives |
| Logging | Winston/Pino | ✅ Frozen | No console |
| Testing | Jest | ✅ Frozen | No Mocha |
| | | | |
| **Shared** | | | |
| VCS | Git + GitHub | ✅ Frozen | No changes |
| Format | Prettier | ✅ Frozen | Non-negotiable |
| Lint | ESLint | ✅ Frozen | Non-negotiable |
| Config | .env files | ✅ Frozen | Standard approach |
| Package Manager | npm | ✅ Frozen | Default choice |

---

## Final Rule

```
ARCHITECTURE IS STABLE, BUT FLEXIBLE.

SHORT-TERM: Technologies are FROZEN
LONG-TERM: Migrations are possible with ADR

Changing technology is expensive.
It breaks builds, requires testing, and risks stability.

SHORT-TERM CHANGE (< 1 year):
Before changing:
1. Is this critical?
2. Is there no alternative?
3. Have we discussed this?
4. Do we have time to fix issues?

If all yes: Seek approval first.
If any no: Do not change.

LONG-TERM CHANGE (1+ years):
Before changing:
1. Create Architecture Decision Record (ADR)
2. Document why change is needed
3. Show alternatives evaluated
4. Explain consequences and tradeoffs
5. Plan migration timeline
6. Get team approval
7. Then proceed with phased migration

This framework protects stability today
while allowing evolution tomorrow.
```

---

## Migration Guidelines (Long-Term)

If an ADR approves technology migration:

### Before Migration

```
1. Create ADR documenting decision
2. Get full team approval
3. Plan detailed migration steps
4. Prepare rollback plan
5. Schedule migration window
6. Brief all team members
```

### During Migration

```
1. Set up parallel environment
2. Migrate incrementally (not all at once)
3. Test thoroughly at each step
4. Keep rollback plan ready
5. Monitor closely
6. Keep team informed
```

### After Migration

```
1. Full testing cycle
2. Performance verification
3. Update ARCHITECTURE.md
4. Update documentation
5. Team training if needed
6. Archive old ADR with migration notes
```

### Migration Timeline Estimate

```
Small change: 2-4 weeks
Medium change: 4-8 weeks
Large change: 8-16 weeks
Major architecture: 16+ weeks
```

---

## Reference: Using ADR for Changes

**Example:** If in future you need to migrate from CRA to Vite

```
1. Check current ARCHITECTURE.md
   → See: CRA is FROZEN for frontend build

2. Create ADR-050-migrate-to-vite.md
   → Explain why Vite is better
   → Show build time improvements
   → List alternatives considered
   → Plan the migration

3. Get team approval
   → Lead approves ADR
   → Team votes
   → Consensus reached

4. Execute migration
   → Phase 1: Setup Vite config
   → Phase 2: Migrate core
   → Phase 3: Migrate all files
   → Phase 4: Testing
   → Phase 5: Deploy

5. Update ARCHITECTURE.md
   → Old: "CRA (FROZEN)"
   → New: "Vite (FROZEN, see ADR-050)"
   → Timeline: "Migrated Q2 2027"

6. New cycle begins
   → Vite is now FROZEN
   → CRA is deprecated
```

---

## Important Reminders

### For Current Development

✅ **Current technologies are FROZEN**
- Do not try to change them
- Work within their constraints
- Become expert in them

### For Future Development

✅ **Changes are possible with process**
- Document why in ADR
- Show careful planning
- Get team approval
- Execute methodically

### For AI Assistants

```
TODAY (2026):
All technologies listed in this file are FROZEN.
You CANNOT change them.
You MUST work within them.

IF future ADR approves change:
THEN you follow new architecture.
BUT: Check ARCHITECTURE.md first
     Follow ADR process
     Respect migration timeline
```

