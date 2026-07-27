# SAFE_EDIT_POLICY.md: Allowed vs Forbidden Operations

A clear boundary between safe modifications and forbidden actions.

**Principle:** When in doubt, it's forbidden.

---

## Core Rule

```
✅ ALLOWED = Requested + Minimal + Reversible

❌ FORBIDDEN = Unrequested OR Excessive OR Risky
```

---

## Category 1: Code Modifications

### ✅ ALLOWED

- [ ] Fix a single bug in one file
- [ ] Remove unused variable causing error
- [ ] Fix type error (add type annotation)
- [ ] Add missing import statement
- [ ] Fix undefined variable (when clear what it should be)
- [ ] Change variable name for clarity (if causing bug)
- [ ] Add null check to prevent error
- [ ] Remove dead code (if verified unused)
- [ ] Fix logic error in function
- [ ] Correct spelling in variable/function names (if causing error)

**Examples:**

```javascript
✅ Remove unused: const [unused, setUnused] = useState(null);
✅ Fix type: const name: string = getUserName();
✅ Add import: import { Component } from 'react';
✅ Fix undefined: const navigate = useNavigate();
✅ Remove dead: if (false) { /* remove this */ }
✅ Add check: if (!user) return <Loading />;
```

---

### ❌ FORBIDDEN

- [ ] Refactor function structure
- [ ] Rename files or folders
- [ ] Move files between modules
- [ ] Change API endpoints
- [ ] Modify route paths
- [ ] Add new features
- [ ] Restructure components
- [ ] Change styling (unless bug fix)
- [ ] Reorder imports or code
- [ ] Add new dependencies
- [ ] Extract functions (refactoring)
- [ ] Create wrapper components
- [ ] Change component props
- [ ] Modify state management structure
- [ ] Add error handling (unless fixing bug)
- [ ] Change UI layout

**Examples:**

```javascript
❌ Refactor: Convert class to function component
❌ Rename: MapComponent.jsx → MapView.jsx
❌ Move: src/utils/helper.js → src/helpers/util.js
❌ Restructure: Break monolithic component into smaller ones
❌ Reformat: Reorder all imports or sort functions
❌ Add feature: "Let me add authentication"
❌ Change UI: "Let me redesign the button"
```

---

## Category 2: File Operations

### ✅ ALLOWED

- [ ] Create new file in existing module (if requested)
- [ ] Add file to existing directory structure
- [ ] Create test file for bug fix
- [ ] Add comments to clarify code

**Examples:**

```
✅ src/components/Applicants/ApplicantCard.jsx (new file)
✅ src/hooks/useApplicants.js (new file)
✅ src/components/Applicants/Applicants.test.jsx (test file)
```

---

### ❌ FORBIDDEN

- [ ] Rename any file
- [ ] Delete any file (without explicit approval)
- [ ] Move files between folders
- [ ] Create new directory structure
- [ ] Reorganize project folders
- [ ] Create new modules
- [ ] Delete unused files automatically

**Examples:**

```
❌ Rename: JobListings.jsx → JobsList.jsx
❌ Move: src/pages/Jobs.jsx → src/components/Jobs.jsx
❌ Create: src/new_module/ (without approval)
❌ Delete: Automatically remove old files
```

---

## Category 3: Dependencies & Configuration

### ✅ ALLOWED

- [ ] Reference existing packages in code
- [ ] Use existing scripts from package.json
- [ ] Follow existing project structure

---

### ❌ FORBIDDEN

- [ ] Install new package (without approval)
- [ ] Upgrade any package
- [ ] Downgrade any package
- [ ] Modify package.json
- [ ] Modify package-lock.json
- [ ] Change npm scripts
- [ ] Modify .env files
- [ ] Modify .env.example
- [ ] Modify build configuration
- [ ] Modify webpack config
- [ ] Modify tsconfig.json
- [ ] Modify .eslintrc
- [ ] Modify .prettierrc
- [ ] Disable linting/formatting
- [ ] Add type: "module" or similar
- [ ] Change Node version requirement

**Examples:**

```
❌ npm install axios
❌ npm install --save-dev @testing-library/react
❌ npm update
❌ npm outdated (then upgrade)
❌ Modify package.json scripts
❌ Edit .env or .env.production
❌ Change tsconfig compilerOptions
❌ Modify ESLint rules
```

---

## Category 4: Build & Testing

### ✅ ALLOWED

- [ ] Run existing build scripts
- [ ] Run existing test scripts
- [ ] Run linting commands
- [ ] Show build output
- [ ] Report test results

---

### ❌ FORBIDDEN

- [ ] Modify build scripts
- [ ] Change test configuration
- [ ] Disable tests
- [ ] Skip linting
- [ ] Add @ts-ignore comments
- [ ] Add // eslint-disable comments
- [ ] Modify jest.config.js
- [ ] Change test setup

**Examples:**

```
❌ Remove test that fails
❌ Add @ts-ignore to suppress error
❌ Add // eslint-disable-next-line
❌ Modify jest configuration
```

---

## Category 5: Code Style & Formatting

### ✅ ALLOWED

- [ ] Follow existing code style
- [ ] Match project conventions
- [ ] Use existing patterns from codebase

---

### ❌ FORBIDDEN

- [ ] Reformat code unrelated to fix
- [ ] Change indentation style
- [ ] Reorder imports
- [ ] Add unnecessary comments
- [ ] Update JSDoc (unless related to fix)
- [ ] Change quote style (single vs double)
- [ ] Change semicolon usage
- [ ] Reformat entire files

**Examples:**

```
❌ Change "const x = 1" to "const x=1"
❌ Sort all imports alphabetically
❌ Change all single quotes to double quotes
❌ Add extensive comments to existing code
❌ Reformat entire component
```

---

## Category 6: Architecture & Design

### ✅ ALLOWED

- [ ] Follow existing architectural patterns
- [ ] Use existing design patterns

---

### ❌ FORBIDDEN

- [ ] Add new architectural layer
- [ ] Change component hierarchy
- [ ] Reorganize state management
- [ ] Change module dependencies
- [ ] Introduce new patterns
- [ ] Extract shared services
- [ ] Create HOCs (Higher Order Components)
- [ ] Add context providers
- [ ] Introduce new hooks patterns
- [ ] Change data flow

**Examples:**

```
❌ Move state to Redux (if not already using)
❌ Extract common logic into service
❌ Create context wrapper
❌ Reorganize component tree
❌ Add middleware layer
```

---

## Category 7: Documentation

### ✅ ALLOWED

- [ ] Add comments explaining bug fix
- [ ] Update CHANGELOG_AI.md

---

### ❌ FORBIDDEN

- [ ] Update README.md
- [ ] Update CONTRIBUTING.md
- [ ] Update other .md files
- [ ] Change API documentation
- [ ] Update architecture docs (unless in .ai/)
- [ ] Modify existing comments (unless bug fix)

---

## Category 8: Git Operations

### ✅ ALLOWED

- [ ] Create commit with clear message
- [ ] Show git diff
- [ ] Reference issue numbers in commit

---

### ❌ FORBIDDEN

- [ ] Force push
- [ ] Rebase commits
- [ ] Squash commits (without approval)
- [ ] Amend commits (unless it's your own fix)
- [ ] Delete branches
- [ ] Reset commits

---

## The Decision Matrix

Use this when unsure:

```
Is it EXPLICITLY REQUESTED?
  ├─ Yes → Continue to next question
  └─ No → ❌ FORBIDDEN

Is it MINIMAL (one file/function)?
  ├─ Yes → Continue to next question
  └─ No → ❌ FORBIDDEN

Is it REVERSIBLE (easy to undo)?
  ├─ Yes → Continue to next question
  └─ No → ❌ FORBIDDEN

Does it FIX THE EXACT ISSUE?
  ├─ Yes → ✅ ALLOWED
  └─ No → ❌ FORBIDDEN
```

---

## Risk Levels

### 🟢 GREEN (Very Safe)

- [ ] Remove unused variable
- [ ] Fix type error
- [ ] Add missing import
- [ ] Fix undefined variable
- [ ] Add null check
- [ ] Fix logic error

→ Can proceed without approval (if diagnosing first)

---

### 🟡 YELLOW (Moderate Risk)

- [ ] Rename variable (for clarity in fix)
- [ ] Add comment explaining fix
- [ ] Create new file in existing module
- [ ] Extract function (only if fixing bug)
- [ ] Change function parameter

→ Should ask approval first

---

### 🔴 RED (High Risk)

- [ ] Delete file
- [ ] Move file
- [ ] Modify package.json
- [ ] Change route
- [ ] Add dependency
- [ ] Refactor component
- [ ] Reorganize folder structure

→ Must ask approval first, never proceed without

---

## Real World Examples

### Example 1: Fixing ESLint Error

```
Situation: Build fails with "unused variable"

Requested: Fix the build

ALLOWED:
✅ Remove unused const declaration
✅ Remove related setState call
✅ Run npm run build to verify

FORBIDDEN:
❌ Refactor entire component
❌ Optimize rendering
❌ Add new features
```

---

### Example 2: Fixing Type Error

```
Situation: TypeScript error "name is undefined"

Requested: Fix the error

ALLOWED:
✅ Add type annotation
✅ Add import statement
✅ Initialize variable
✅ Add null check

FORBIDDEN:
❌ Refactor function
❌ Change props interface
❌ Add new validation
```

---

### Example 3: Feature Request (WRONG APPROACH)

```
Situation: User says "Add search feature"

ALLOWED:
✅ Create search component (if full spec given)
✅ Add search input
✅ Add filtering logic

FORBIDDEN:
❌ Refactor existing components
❌ Change state management
❌ Modify other features
❌ Upgrade dependencies
```

---

## Approval Workflow

### When to Ask Permission

Ask before proceeding if:

- [ ] Modifying multiple files
- [ ] Touching shared/core files
- [ ] Changing public API/routes
- [ ] Any RED category operation
- [ ] Uncertain if allowed

**How to ask:**

```
I need to make this change:
[Describe the change]

Files affected: [List files]
Risk level: [Green/Yellow/Red]
Reversible: Yes/No

Should I proceed?
```

---

## Quick Reference Checklist

Before making ANY change:

- [ ] Is this the EXACT issue requested?
- [ ] Is this MINIMAL?
- [ ] Is this REVERSIBLE?
- [ ] Did I check DIAGNOSE_FIRST.md?
- [ ] Did I check RULES.md?
- [ ] Is this in the ALLOWED section?
- [ ] Do I need approval?

---

## When in Doubt

```
If you are unsure whether an operation is allowed:

1. Don't do it
2. Ask the user
3. Check this policy
4. Read RULES.md
5. Read DEBUG.md

Better to ask than to break something.
```
