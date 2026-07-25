# ✅ Sprint 1 Verification Steps

**Date:** July 25, 2026  
**Status:** Ready to Execute  
**Current Blocker:** npm dependency conflicts (FIXED in package.json)

---

## 🚀 Execute These Steps in Order

### Step 1: Clean Install (5 min)
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Expected Output:**
```
added XXX packages in X seconds
```

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

**If it fails:**
Show the error message. Do not proceed until this passes.

---

### Step 2: Build Backend (5 min)
```bash
npm run build
```

**Expected Output:**
```
[Nest] ... - 07/25/2026, ... [NestFactory] ...
... successfully
```

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

**Verify:**
```bash
ls -la dist/
```
Should have compiled files.

---

### Step 3: Database Setup (2 min)

**Prerequisite:** PostgreSQL running locally

```bash
npm run migration:run
```

**Expected Output:**
```
query: CREATE TABLE "users" ...
Migration 1721903400000-CreateUsersTable executed successfully
```

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

**Verify in PostgreSQL:**
```sql
\dt users
SELECT COUNT(*) FROM users;
```

---

### Step 4: Run Tests (5 min)
```bash
npm run test
```

**Expected Output:**
```
PASS  src/modules/auth/auth.service.spec.ts
  AuthService
    register
      ✓ should successfully register a new user
      ...
      
Test Suites: 2 passed, 2 total
Tests:       XX passed, XX total
```

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

**If tests fail:** Show which tests failed and why.

---

### Step 5: Check Coverage (2 min)
```bash
npm run test:cov
```

**Expected Output:**
```
Auth: ____%
Database: ____%
Overall: ≥60%
```

**Status:** ⏳ PENDING  
**Coverage:** _____%  
**Result:** [ ] ≥60% / [ ] <60%

---

### Step 6: Start Backend Server (Running)
```bash
npm run dev
```

**Expected Output:**
```
[Nest] ... - 07/25/2026, ... [NestFactory] ...
[Nest] ... Application successfully started
Listening on port 3000
```

**Status:** ⏳ PENDING  
**Result:** [ ] Running / [ ] Failed

**Do NOT proceed until you see this message. Server should be running.**

---

## 🧪 API Testing (Manual)

### Prerequisite
Backend must be running on http://localhost:3000

### Test 1: Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "firstName": "أحمد",
    "lastName": "محمد",
    "role": "seeker"
  }'
```

**Expected:**
- Status: 201
- Response has `user`, `accessToken`, `refreshToken`

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

**Actual Response:**
```json
(Paste response here)
```

---

### Test 2: Database Insert
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```

**Expected:** 1 row with correct data

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

### Test 3: Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

**Expected:**
- Status: 200
- Response has `accessToken` and `refreshToken`

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

**Save the tokens:**
```
accessToken: ____________________________
refreshToken: ___________________________
```

---

### Test 4: Get Profile
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer {accessToken}"
```

**Expected:**
- Status: 200
- Response has user data (id, email, firstName, etc.)

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

### Test 5: Refresh Token
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "{refreshToken}"}'
```

**Expected:**
- Status: 200
- New `accessToken` issued

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

### Test 6: Logout
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer {accessToken}"
```

**Expected:**
- Status: 200

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

### Test 7: Invalid Token (Should Fail)
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer invalid-token"
```

**Expected:**
- Status: 401

**Status:** ⏳ PENDING  
**Result:** [ ] Correctly Rejected / [ ] Failed

---

## 📱 Flutter Verification

### Step 1: Dependencies
```bash
cd mobile/flutter_app
flutter pub get
```

**Expected:** All dependencies installed

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

### Step 2: Analyze
```bash
flutter analyze
```

**Expected:** No errors

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

### Step 3: Build
```bash
flutter build apk  # Android
# or
flutter build ios  # iOS
```

**Expected:** Build succeeds

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

### Step 4: Manual Test
```bash
flutter run
```

**Expected:**
1. App launches
2. Shows login/register screen
3. No crashes

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

#### Test 4a: Register
1. Tap "سجل الآن"
2. Fill:
   - Email: flutter@example.com
   - Password: TestPassword123
   - First Name: علي
   - Last Name: حسن
   - Role: Seeker
3. Tap "إنشاء الحساب"

**Expected:** 
- Success message
- Token saved

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

#### Test 4b: Logout & Restart
1. Tap "تسجيل الخروج"
2. Close app completely
3. Relaunch app

**Expected:**
- Shows login screen (not home)
- Token cleared

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

## ⚛️ React Verification

### Step 1: Dependencies
```bash
cd web/dashboard
npm install
```

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

### Step 2: Build
```bash
npm run build
```

**Expected:** build/ folder created

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

### Step 3: Start Dev Server
```bash
npm start
```

**Expected:** 
- App opens on http://localhost:3000
- No errors

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

### Step 4: Manual Test

#### Test 4a: Register
1. Navigate to /register
2. Fill:
   - First Name: محمد
   - Last Name: أحمد
   - Email: react@example.com
   - Password: TestPassword123
   - Role: Employer
3. Click "إنشاء الحساب"

**Expected:** Success message

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

#### Test 4b: Login
1. Navigate to /login
2. Fill:
   - Email: react@example.com
   - Password: TestPassword123
3. Click "تسجيل الدخول"

**Expected:** 
- Success message
- Token stored

**Status:** ⏳ PENDING  
**Result:** [ ] Pass / [ ] Fail

---

## 📊 Summary

| Step | Status | Pass/Fail | Notes |
|------|--------|-----------|-------|
| 1. npm install | ⏳ | [ ] / [ ] | |
| 2. npm build | ⏳ | [ ] / [ ] | |
| 3. migrations | ⏳ | [ ] / [ ] | |
| 4. tests | ⏳ | [ ] / [ ] | |
| 5. coverage | ⏳ | [ ] / [ ] | |
| 6. server | ⏳ | [ ] / [ ] | |
| API Register | ⏳ | [ ] / [ ] | |
| API Login | ⏳ | [ ] / [ ] | |
| API Profile | ⏳ | [ ] / [ ] | |
| API Refresh | ⏳ | [ ] / [ ] | |
| API Logout | ⏳ | [ ] / [ ] | |
| Flutter Build | ⏳ | [ ] / [ ] | |
| Flutter Register | ⏳ | [ ] / [ ] | |
| React Build | ⏳ | [ ] / [ ] | |
| React Login | ⏳ | [ ] / [ ] | |

---

## ✅ Final Decision

**Sprint 1 is APPROVED only if:**
- ✅ All steps 1-6 pass
- ✅ All 7 API tests pass
- ✅ Flutter register & restart works
- ✅ React login works
- ✅ No critical bugs

**If any step fails:**
- 🔴 Document the error
- 🔴 Fix the issue
- 🔴 Re-run the failing step
- 🔴 Do not proceed to next stage

---

**Ready to start?**

Execute Step 1 first and report the result.
