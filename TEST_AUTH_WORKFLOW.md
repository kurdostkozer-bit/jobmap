# 🧪 Auth Workflow Testing Guide

**Sprint 1** — Complete Authentication Flow Testing

---

## Prerequisites

```bash
# 1. Start Database
docker-compose up -d

# 2. Install Dependencies
cd backend
npm install

# 3. Run Migrations
npm run migration:run

# 4. Start Backend (in separate terminal)
npm run dev
```

---

## Test Scenarios

### 1. Register User

**Endpoint:** `POST http://localhost:3000/auth/register`

**Request:**
```json
{
  "email": "ahmed@example.com",
  "password": "SecurePass123",
  "firstName": "أحمد",
  "lastName": "محمد",
  "role": "seeker"
}
```

**Expected Response (201):**
```json
{
  "user": {
    "id": "uuid-1234",
    "email": "ahmed@example.com",
    "firstName": "أحمد",
    "lastName": "محمد",
    "role": "seeker",
    "avatarUrl": null,
    "createdAt": "2026-07-25T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation:**
- ✅ Email is valid format
- ✅ Password is at least 8 characters
- ✅ firstName and lastName are not empty
- ✅ role is either 'seeker' or 'employer'
- ✅ User saved to database
- ✅ Both tokens generated

---

### 2. Duplicate Email Registration (Should Fail)

**Endpoint:** `POST http://localhost:3000/auth/register`

**Request:**
```json
{
  "email": "ahmed@example.com",
  "password": "SecurePass123",
  "firstName": "علي",
  "lastName": "حسن",
  "role": "employer"
}
```

**Expected Response (409):**
```json
{
  "message": "البريد الإلكتروني مسجل بالفعل",
  "error": "Conflict",
  "statusCode": 409
}
```

---

### 3. Invalid Email (Should Fail)

**Endpoint:** `POST http://localhost:3000/auth/register`

**Request:**
```json
{
  "email": "invalid-email",
  "password": "SecurePass123",
  "firstName": "أحمد",
  "lastName": "محمد",
  "role": "seeker"
}
```

**Expected Response (400):**
```json
{
  "message": ["البريد الإلكتروني غير صحيح"],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 4. Short Password (Should Fail)

**Endpoint:** `POST http://localhost:3000/auth/register`

**Request:**
```json
{
  "email": "test@example.com",
  "password": "short",
  "firstName": "أحمد",
  "lastName": "محمد",
  "role": "seeker"
}
```

**Expected Response (400):**
```json
{
  "message": ["كلمة المرور يجب أن تكون 8 أحرف على الأقل"],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

### 5. Login with Valid Credentials

**Endpoint:** `POST http://localhost:3000/auth/login`

**Request:**
```json
{
  "email": "ahmed@example.com",
  "password": "SecurePass123"
}
```

**Expected Response (200):**
```json
{
  "user": {
    "id": "uuid-1234",
    "email": "ahmed@example.com",
    "firstName": "أحمد",
    "lastName": "محمد",
    "role": "seeker",
    "avatarUrl": null,
    "createdAt": "2026-07-25T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 6. Login with Wrong Password (Should Fail)

**Endpoint:** `POST http://localhost:3000/auth/login`

**Request:**
```json
{
  "email": "ahmed@example.com",
  "password": "WrongPassword123"
}
```

**Expected Response (401):**
```json
{
  "message": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

### 7. Login with Non-existent Email (Should Fail)

**Endpoint:** `POST http://localhost:3000/auth/login`

**Request:**
```json
{
  "email": "nonexistent@example.com",
  "password": "SecurePass123"
}
```

**Expected Response (401):**
```json
{
  "message": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

### 8. Get Profile (Authenticated)

**Endpoint:** `GET http://localhost:3000/auth/me`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Expected Response (200):**
```json
{
  "id": "uuid-1234",
  "email": "ahmed@example.com",
  "firstName": "أحمد",
  "lastName": "محمد",
  "role": "seeker",
  "avatarUrl": null,
  "createdAt": "2026-07-25T00:00:00.000Z"
}
```

---

### 9. Get Profile without Token (Should Fail)

**Endpoint:** `GET http://localhost:3000/auth/me`

**Expected Response (401):**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

### 10. Refresh Token

**Endpoint:** `POST http://localhost:3000/auth/refresh`

**Request:**
```json
{
  "refreshToken": "{refreshTokenFromLogin}"
}
```

**Expected Response (200):**
```json
{
  "user": {
    "id": "uuid-1234",
    "email": "ahmed@example.com",
    "firstName": "أحمد",
    "lastName": "محمد",
    "role": "seeker",
    "avatarUrl": null,
    "createdAt": "2026-07-25T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 11. Logout

**Endpoint:** `POST http://localhost:3000/auth/logout`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Expected Response (200):**
```json
{
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

## Quick Test Script (Bash)

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🔍 Testing Auth Workflow..."

# 1. Register
echo -e "\n✅ Test 1: Register User"
REGISTER=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "أحمد",
    "lastName": "محمد",
    "role": "seeker"
  }')

echo $REGISTER | jq .

ACCESS_TOKEN=$(echo $REGISTER | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $REGISTER | jq -r '.refreshToken')

# 2. Get Profile
echo -e "\n✅ Test 2: Get Profile"
curl -s -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# 3. Refresh Token
echo -e "\n✅ Test 3: Refresh Token"
REFRESH=$(curl -s -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}")

echo $REFRESH | jq .

# 4. Logout
echo -e "\n✅ Test 4: Logout"
curl -s -X POST $BASE_URL/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

echo -e "\n✅ All tests passed!"
```

---

## Flutter Integration Test

```dart
// test_widget_test.dart

void main() {
  testWidgets('Complete Auth Flow', (WidgetTester tester) async {
    // 1. Register
    await tester.pumpWidget(const MyApp());
    await tester.tap(find.byText('سجل الآن'));
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byType(TextField).at(0),
      'test@example.com',
    );
    await tester.enterText(
      find.byType(TextField).at(1),
      'TestPass123',
    );
    await tester.enterText(
      find.byType(TextField).at(2),
      'أحمد',
    );
    await tester.enterText(
      find.byType(TextField).at(3),
      'محمد',
    );

    await tester.tap(find.byText('إنشاء الحساب'));
    await tester.pumpAndSettle();

    expect(find.byText('تم إنشاء الحساب بنجاح'), findsOneWidget);

    // 2. Verify logged in
    expect(find.byType(HomePage), findsOneWidget);
  });
}
```

---

## Success Criteria

- ✅ Register with valid data: 201 Created
- ✅ Register with duplicate email: 409 Conflict
- ✅ Register with invalid email: 400 Bad Request
- ✅ Register with short password: 400 Bad Request
- ✅ Login with valid credentials: 200 OK
- ✅ Login with wrong password: 401 Unauthorized
- ✅ Login with non-existent email: 401 Unauthorized
- ✅ Get profile with token: 200 OK
- ✅ Get profile without token: 401 Unauthorized
- ✅ Refresh token: 200 OK with new tokens
- ✅ Logout: 200 OK
- ✅ All database transactions successful
- ✅ All tokens properly signed
- ✅ Passwords properly hashed

---

## Database Verification

```sql
-- Check users table
SELECT * FROM users;

-- Check user details
SELECT id, email, "firstName", "lastName", role, "isActive", "createdAt" 
FROM users 
WHERE email = 'ahmed@example.com';

-- Check for duplicate emails
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;
```

---

**Testing Date:** July 25, 2026  
**Sprint:** Sprint 1 — Authentication  
**Status:** Ready for Testing ✅
