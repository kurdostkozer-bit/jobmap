# Flutter Authentication Integration Test Checklist

## Backend Status
✅ Backend Running on `localhost:3000`
✅ PostgreSQL Connected
✅ All Authentication Endpoints Working:
  - POST /api/auth/register
  - POST /api/auth/login  
  - GET /api/auth/me
  - POST /api/auth/logout
  - POST /api/auth/refresh

## Flutter Code Updates Completed
✅ AuthRemoteDataSource updated
  - Now correctly parses `accessToken` (camelCase)
  - Supports `refreshToken` handling
  - Uses `/auth/me` endpoint
  - Returns AuthResponse with nested user object

✅ AuthRepository updated
  - Added `refreshToken()` method
  - Returns AuthResponse instead of just UserModel

✅ UserModel updated  
  - Fixed field names (avatarUrl not profileImage)
  - Made optional fields nullable
  - Better DateTime parsing

✅ AuthNotifier updated
  - Handles AuthResponse correctly
  - Stores tokens in SecureStorage
  - Supports refresh token flow

## Manual Flutter Testing Steps

### Step 1: Register New User
Input:
- Email: flutter-test-{timestamp}@example.com
- Password: FlutterTest123!
- FirstName: Flutter
- LastName: Test
- Role: seeker

Expected Output:
- ✅ User created in PostgreSQL
- ✅ JWT accessToken issued
- ✅ Refresh Token issued  
- ✅ Token stored in SecureStorage
- ✅ Navigation to home (or success screen)

### Step 2: Login with Registered User
Input:
- Email: (from Step 1)
- Password: FlutterTest123!

Expected Output:
- ✅ JWT token retrieved
- ✅ User data populated
- ✅ Authenticated state = true
- ✅ Token persisted in SecureStorage

### Step 3: Get Profile (/auth/me)
Prerequisites:
- User logged in from Step 2
- Bearer token in Authorization header

Expected Output:
- ✅ User profile retrieved
- ✅ Fields match (id, email, firstName, lastName, role)
- ✅ No 401 Unauthorized errors

### Step 4: Refresh Token
Prerequisites:
- Refresh token available from Step 1 or 2

Expected Output:
- ✅ New accessToken issued
- ✅ New refresh token issued (optional)
- ✅ Old token can be discarded
- ✅ User stays authenticated

### Step 5: Auto-Login After App Restart
Prerequisites:
- Complete Steps 1-3
- Kill and restart Flutter app

Expected Output:
- ✅ Token retrieved from SecureStorage
- ✅ User automatically logged in
- ✅ No login screen shown (skip to home)
- ✅ /auth/me call succeeds

### Step 6: Logout
Prerequisites:
- User logged in

Expected Output:
- ✅ Clear token from SecureStorage
- ✅ State reset to unauthenticated
- ✅ Redirect to login screen

## Notes

### Known Limitations
- Navigation routes not yet implemented (see commented lines in pages)
- Auto-login flow (initializeAuth) not yet hooked to app startup
- No error handling for token expiry grace period

### Next Steps After Verification
1. Implement navigation between pages
2. Add error handling for 401 responses
3. Implement auto-login on app launch
4. Add tests for token refresh on expiry
5. Add offline detection

## Status
- Code Changes: ✅ COMPLETED
- Backend Testing: ✅ VERIFIED  
- Flutter Code: ✅ UPDATED
- Integration: 🟡 PENDING (need to run on emulator/device)
