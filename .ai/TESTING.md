# TESTING.md: Testing Requirements and Standards

Comprehensive testing requirements for all AI-assisted changes.

**Principle:** Every change must be tested before declaring success.

---

## Testing Hierarchy

```
┌─────────────────────────────────────────┐
│       MANUAL VERIFICATION               │
│   (User/Developer visual testing)       │
└────────────────────┬────────────────────┘
                     ↑
┌────────────────────┴────────────────────┐
│       E2E TESTS (if applicable)         │
│   (Complete user workflows)             │
└────────────────────┬────────────────────┘
                     ↑
┌────────────────────┴────────────────────┐
│       INTEGRATION TESTS (optional)      │
│   (Component/Module interaction)        │
└────────────────────┬────────────────────┘
                     ↑
┌────────────────────┴────────────────────┐
│       UNIT TESTS                        │
│   (Individual functions/components)     │
└────────────────────┬────────────────────┘
                     ↑
┌────────────────────┴────────────────────┐
│       BUILD VERIFICATION                │
│   (Compile, lint, bundle)               │
└────────────────────┬────────────────────┘
                     ↑
┌────────────────────┴────────────────────┐
│       CODE REVIEW CHECKS                │
│   (ESLint, TypeScript, formatting)      │
└─────────────────────────────────────────┘
```

**All levels must pass before declaring success.**

---

## Frontend Testing

### Level 1: Code Quality (Required)

#### ESLint
**Command:** `npm run lint`

**What it checks:**
- Code style compliance
- Unused variables
- Undefined variables
- Type issues
- Best practices

**Expected output:**
```
✓ No ESLint errors
✓ All files pass
```

**Failure handling:**
```
❌ [eslint] src/file.jsx
   Line X: error message

ACTION: Fix the error, do NOT disable the rule
```

**Rules:**
- [ ] Cannot add `@ts-ignore` or `// eslint-disable`
- [ ] Cannot modify ESLint config to hide error
- [ ] Must fix the actual problem

---

#### TypeScript Check
**Command:** `npm run build` (includes TypeScript check)

**What it checks:**
- Type errors
- Type mismatches
- Interface violations
- Generic type issues

**Expected output:**
```
✓ TypeScript compiles successfully
✓ No type errors
```

**Failure handling:**
```
❌ src/file.tsx:10
   error TS2322: Type mismatch

ACTION: Fix the type error
```

**Rules:**
- [ ] Cannot use `as any`
- [ ] Cannot use implicit `any`
- [ ] Must maintain strict mode

---

### Level 2: Build (Required)

#### Production Build
**Command:** `npm run build`

**What it does:**
- Compiles all code
- Bundles assets
- Minifies code
- Creates optimized build

**Expected output:**
```
Compiled successfully.
File sizes after gzip:
  274.1 kB  build/static/js/main.*.js
  15.29 kB  build/static/css/main.*.css
```

**Success criteria:**
- [ ] Build completes without errors
- [ ] No warnings (or approved warnings)
- [ ] Output goes to `build/` folder
- [ ] File sizes reasonable

**Build size limits:**
- Main JS: < 300 kB (gzipped)
- Main CSS: < 50 kB (gzipped)
- Total: < 500 kB (gzipped)

If exceeding limits:
```
⚠️ Warning: Bundle size exceeded
  Current: 350 kB (limit: 300 kB)
  
ACTION: Investigate and optimize
```

---

### Level 3: Unit Tests (Required)

#### Jest Tests
**Command:** `npm run test -- --run` or `npm test`

**What it tests:**
- Individual components
- Utility functions
- Service methods
- Helper functions
- Edge cases

**Expected output:**
```
PASS  src/components/Button.test.jsx
PASS  src/utils/helpers.test.js
Test Suites: 5 passed, 5 total
Tests:       42 passed, 42 total
Coverage:    80% lines, 80% branches
```

**Test requirements:**
- [ ] All tests must pass
- [ ] Cannot skip with `xdescribe` or `xit`
- [ ] Cannot use `.only` to skip tests
- [ ] Coverage >= 80% (if threshold set)
- [ ] No flaky tests

**If test fails:**
```
❌ FAIL  src/components/Button.test.jsx
   ● Button › renders correctly
   
Expected: "Click me"
Received: "Button"

ACTION: Fix the code or update test
```

---

### Level 4: Integration Tests (Optional)

#### React Component Interaction
**Command:** `npm run test:integration` (if available)

**What it tests:**
- Component interaction
- State changes
- Event handling
- User workflows

**Example test:**
```javascript
test('Clicking apply button updates applicant status', () => {
  render(<ApplicantCard applicant={mockData} />);
  
  fireEvent.click(screen.getByText('قبول'));
  
  expect(screen.getByText('مقبول')).toBeInTheDocument();
});
```

---

### Level 5: E2E Tests (Optional)

#### User Workflow Testing
**Command:** `npm run test:e2e` (if configured)

**What it tests:**
- Complete user workflows
- Page navigation
- Form submissions
- API integration

**Example workflow:**
```
1. User logs in
2. User searches for jobs
3. User applies to job
4. User sees confirmation
5. User receives notification
```

---

### Level 6: Manual Verification (Required)

After automated tests pass, manually verify:

#### Visual Check
- [ ] UI looks correct
- [ ] Layout is not broken
- [ ] Colors and fonts are correct
- [ ] Responsive design works

#### Functional Check
- [ ] Feature works as intended
- [ ] Buttons/links work
- [ ] Forms validate correctly
- [ ] No console errors

#### Browser Check
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari (if available)
- [ ] Works on mobile

#### Accessibility Check
- [ ] Can tab through elements
- [ ] Labels are associated with inputs
- [ ] Color contrast is sufficient
- [ ] No focus traps

**Checklist:**
```
Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Mobile Safari (if available)

Responsive Testing
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

Functionality Testing
- [ ] All buttons work
- [ ] Forms submit correctly
- [ ] No console errors
- [ ] No broken links

Performance Check
- [ ] Page loads quickly
- [ ] No lag on interactions
- [ ] Smooth animations
```

---

## Backend Testing

### Level 1: Code Quality (Required)

#### ESLint & TypeScript
Same as frontend (see above)

**Commands:**
```
npm run lint
npm run build  # includes TypeScript check
```

---

### Level 2: Build (Required)

#### Build to dist/
**Command:** `npm run build`

**Expected output:**
```
✓ Build complete
dist/ folder created
Source maps generated
```

---

### Level 3: Unit Tests (Required)

#### Jest Tests
**Command:** `npm run test` or `npm test`

**What it tests:**
- Service methods
- Controller logic
- Guard functionality
- Interceptor behavior
- Utility functions

**Expected output:**
```
PASS  src/modules/auth/auth.service.spec.ts
PASS  src/modules/jobs/jobs.controller.spec.ts
Test Suites: 8 passed, 8 total
Tests:       120 passed, 120 total
```

**Requirements:**
- [ ] All tests must pass
- [ ] No skipped tests
- [ ] Coverage >= 75% (or project standard)

---

### Level 4: Integration Tests (Optional)

#### API Endpoint Testing
**Command:** `npm run test:integration`

**What it tests:**
- API endpoints
- Request/response flow
- Middleware execution
- Error handling

**Example test:**
```typescript
describe('POST /api/jobs', () => {
  it('should create a new job', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/jobs')
      .send(createJobDto)
      .expect(201);
      
    expect(response.body.id).toBeDefined();
  });
});
```

---

### Level 5: E2E Tests (Optional)

#### Complete API Workflow
**Command:** `npm run test:e2e`

**What it tests:**
- Complete API workflows
- Database transactions
- Authentication flow
- Error scenarios

---

### Level 6: Manual Verification (Required)

After automated tests pass, verify:

#### API Check
- [ ] Endpoints respond correctly
- [ ] Request validation works
- [ ] Response format is correct
- [ ] Error messages are clear

#### Database Check
- [ ] Data persists correctly
- [ ] Relationships are maintained
- [ ] No orphaned records
- [ ] Transactions rollback on error

#### Security Check
- [ ] Authentication required
- [ ] Authorization enforced
- [ ] Rate limiting works
- [ ] Input validation strict

---

## Change-Specific Testing

### For Bug Fixes

**Test before and after:**

```
Before Fix:
- Reproduce the bug
- Show the error
- Verify it's broken

After Fix:
- Test the fix works
- Test no regression
- Test edge cases
- Test related features
```

**Example:**

```
Bug: selectedApplicant unused variable

Before Fix:
npm run build
→ ❌ [eslint] ... 'selectedApplicant' is unused

After Fix:
npm run build
→ ✅ Compiled successfully
npm run test
→ ✅ All tests pass
Manual: Component still works as expected ✓
```

---

### For New Features

**Test functionality:**

```
Feature: Add search filter

Tests Needed:
1. Component renders
2. Filter buttons work
3. Filtering logic correct
4. State updates on filter
5. Results display correctly
6. Edge cases (empty results, etc.)
```

---

### For Refactoring

**Test no regression:**

```
Refactor: Extract component

Before:
- Original component works ✓
- All tests pass ✓

After:
- Extracted component works ✓
- Parent component works ✓
- All tests still pass ✓
- No visual changes ✓
```

---

## Testing Checklist Template

Use this for every change:

```markdown
## Testing Checklist for [Change Name]

### Code Quality
- [ ] npm run lint passes
- [ ] No ESLint warnings (or approved)
- [ ] TypeScript strict mode passes
- [ ] No @ts-ignore added

### Build
- [ ] npm run build succeeds
- [ ] Bundle size acceptable
- [ ] No warnings in build output

### Unit Tests
- [ ] npm run test passes (all tests)
- [ ] No skipped tests
- [ ] Coverage acceptable
- [ ] New tests written for new code

### Integration Tests (if applicable)
- [ ] npm run test:integration passes
- [ ] Related components tested

### E2E Tests (if applicable)
- [ ] npm run test:e2e passes
- [ ] Complete workflow tested

### Manual Verification
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Responsive design works
- [ ] No console errors
- [ ] Feature works as intended
- [ ] No breaking changes

### Documentation
- [ ] Code comments added
- [ ] Tests are readable
- [ ] Change logged in CHANGELOG_AI.md
```

---

## Test Configuration Files

### Frontend (React)

**jest.config.js** or **setupTests.js:**
```javascript
// Usually pre-configured by CRA
// Do not modify without approval
```

**test environment:** jsdom

**coverage thresholds:**
```javascript
{
  "branches": 80,
  "functions": 80,
  "lines": 80,
  "statements": 80
}
```

---

### Backend (NestJS)

**jest.config.js:**
```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
};
```

---

## Continuous Integration Checklist

Before calling a change "done":

- [ ] ESLint: ✅ All files pass
- [ ] TypeScript: ✅ No errors
- [ ] Build: ✅ Compiles successfully
- [ ] Unit tests: ✅ All pass
- [ ] Integration tests: ✅ All pass (if applicable)
- [ ] E2E tests: ✅ All pass (if applicable)
- [ ] Manual verification: ✅ Completed
- [ ] No console errors: ✅ Verified
- [ ] Bundle size: ✅ Acceptable
- [ ] Documentation: ✅ Updated
- [ ] Changelog: ✅ Logged

**All items must be checked. If any is unchecked, the change is not ready.**

---

## Test Failure Procedure

If a test fails at any point:

1. **Stop Immediately**
   - Do not continue with other changes
   - Do not proceed to next level

2. **Analyze Failure**
   - Read error message
   - Understand what failed
   - Why did it fail?

3. **Fix the Issue**
   - Fix code or fix test
   - Do not skip/ignore test
   - Do not disable rule

4. **Re-run Test**
   - Run entire test suite
   - Ensure no new failures
   - Verify fix is complete

5. **Resume Pipeline**
   - Start from the beginning
   - Run all levels again
   - Ensure everything passes

---

## Common Test Failures

### ESLint Failures

```
❌ [eslint] src/file.jsx
   Line 10: 'unused' is assigned but never used
   
FIX:
1. Remove the unused variable
2. OR use it in the code
3. DO NOT add // eslint-disable
```

---

### TypeScript Failures

```
❌ error TS2322: Type 'string' is not assignable to type 'number'

FIX:
1. Check the type annotation
2. Check the value being assigned
3. Fix the mismatch
4. DO NOT use 'as any'
```

---

### Build Failures

```
❌ Failed to compile

FIX:
1. Check the error message
2. Usually an ESLint or TypeScript issue
3. Fix the underlying problem
4. Rebuild
```

---

### Test Failures

```
❌ FAIL src/file.test.js
   Expected: "value"
   Received: "other"

FIX:
1. Is the test correct?
2. Is the code correct?
3. Fix either the test or code
4. Re-run test
```

---

## Performance Testing

### Frontend Performance Targets

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

If performance degrades:
```
⚠️ Performance Warning:
  LCP increased from 2.0s to 2.8s
  
ACTION: Investigate and optimize
```

---

### Backend Performance Targets

- API response time: < 500ms (p95)
- Database query: < 100ms (p95)
- Error rate: < 0.1%

---

## Accessibility Testing

For UI changes, verify:

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Labels are associated with inputs
- [ ] Color contrast is WCAG AA compliant
- [ ] Focus indicators are visible
- [ ] ARIA attributes where needed
- [ ] Screen reader compatible

Use tools:
- axe DevTools
- WAVE
- Lighthouse
- Screen reader testing

---

## Security Testing

For sensitive changes:

- [ ] No hardcoded credentials
- [ ] Input is sanitized
- [ ] Output is encoded
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Authentication required
- [ ] Authorization enforced
- [ ] Rate limiting active

---

## Final Verification

**The Build Pipeline Success Checklist**

```
✅ Linting:          All files pass
✅ Compilation:      No type errors
✅ Build:            Optimized build created
✅ Unit Tests:       All pass
✅ Integration:      All workflows pass
✅ E2E Tests:        All scenarios pass
✅ Manual Tests:     Features work correctly
✅ Performance:      Meets targets
✅ Accessibility:    Fully accessible
✅ Security:         No vulnerabilities
✅ Documentation:    Updated and logged
✅ Ready:            ✅ YES

Status: READY TO DEPLOY
```

If ANY checkbox is ❌, the change is NOT ready.

---

## Remember

```
Testing is not optional.

Tests catch bugs before they reach production.
Tests ensure changes don't break existing features.
Tests give confidence that code is correct.

NO SHORTCUTS.
NO SKIPPED TESTS.
NO DISABLED CHECKS.

Test everything. Always.
```
