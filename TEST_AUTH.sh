#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test${TIMESTAMP}@example.com"

echo -e "${BLUE}🧪 Auth Workflow Testing${NC}"
echo -e "${BLUE}=========================${NC}\n"

# Test 1: Register
echo -e "${YELLOW}Test 1: Register User${NC}"
REGISTER=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"TestPassword123\",
    \"firstName\": \"أحمد\",
    \"lastName\": \"محمد\",
    \"role\": \"seeker\"
  }")

if echo $REGISTER | jq . > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Register successful${NC}"
  echo $REGISTER | jq .
else
  echo -e "${RED}❌ Register failed${NC}"
  echo $REGISTER
  exit 1
fi

ACCESS_TOKEN=$(echo $REGISTER | jq -r '.accessToken // empty')
REFRESH_TOKEN=$(echo $REGISTER | jq -r '.refreshToken // empty')
USER_ID=$(echo $REGISTER | jq -r '.user.id // empty')

if [ -z "$ACCESS_TOKEN" ] || [ -z "$REFRESH_TOKEN" ]; then
  echo -e "${RED}❌ No tokens received${NC}"
  exit 1
fi

echo -e "${GREEN}Access Token: ${ACCESS_TOKEN:0:20}...${NC}"
echo -e "${GREEN}Refresh Token: ${REFRESH_TOKEN:0:20}...${NC}\n"

# Test 2: Get Profile
echo -e "${YELLOW}Test 2: Get Profile${NC}"
PROFILE=$(curl -s -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo $PROFILE | jq . > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Get profile successful${NC}"
  echo $PROFILE | jq .
else
  echo -e "${RED}❌ Get profile failed${NC}"
  echo $PROFILE
  exit 1
fi

echo ""

# Test 3: Refresh Token
echo -e "${YELLOW}Test 3: Refresh Token${NC}"
REFRESH=$(curl -s -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}")

if echo $REFRESH | jq . > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Refresh token successful${NC}"
  echo $REFRESH | jq .
else
  echo -e "${RED}❌ Refresh token failed${NC}"
  echo $REFRESH
  exit 1
fi

NEW_ACCESS_TOKEN=$(echo $REFRESH | jq -r '.accessToken // empty')
echo -e "${GREEN}New Access Token: ${NEW_ACCESS_TOKEN:0:20}...${NC}\n"

# Test 4: Login
echo -e "${YELLOW}Test 4: Login${NC}"
LOGIN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"TestPassword123\"
  }")

if echo $LOGIN | jq . > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Login successful${NC}"
  echo $LOGIN | jq .
else
  echo -e "${RED}❌ Login failed${NC}"
  echo $LOGIN
  exit 1
fi

echo ""

# Test 5: Logout
echo -e "${YELLOW}Test 5: Logout${NC}"
LOGOUT=$(curl -s -X POST $BASE_URL/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo $LOGOUT | jq . > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Logout successful${NC}"
  echo $LOGOUT | jq .
else
  echo -e "${RED}❌ Logout failed${NC}"
  echo $LOGOUT
  exit 1
fi

echo ""

# Test 6: Invalid Credentials (Should Fail)
echo -e "${YELLOW}Test 6: Invalid Credentials (Should Fail)${NC}"
INVALID_LOGIN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"WrongPassword123\"
  }")

if echo $INVALID_LOGIN | jq . > /dev/null 2>&1; then
  STATUS=$(echo $INVALID_LOGIN | jq -r '.statusCode // 500')
  if [ "$STATUS" == "401" ]; then
    echo -e "${GREEN}✅ Correctly rejected invalid credentials${NC}"
    echo $INVALID_LOGIN | jq .
  else
    echo -e "${RED}❌ Should have returned 401${NC}"
    echo $INVALID_LOGIN
  fi
else
  echo -e "${RED}❌ Invalid response${NC}"
  echo $INVALID_LOGIN
fi

echo ""

# Test 7: Duplicate Email (Should Fail)
echo -e "${YELLOW}Test 7: Duplicate Email (Should Fail)${NC}"
DUPLICATE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"TestPassword123\",
    \"firstName\": \"علي\",
    \"lastName\": \"حسن\",
    \"role\": \"employer\"
  }")

if echo $DUPLICATE | jq . > /dev/null 2>&1; then
  STATUS=$(echo $DUPLICATE | jq -r '.statusCode // 500')
  if [ "$STATUS" == "409" ]; then
    echo -e "${GREEN}✅ Correctly rejected duplicate email${NC}"
    echo $DUPLICATE | jq .
  else
    echo -e "${RED}❌ Should have returned 409${NC}"
    echo $DUPLICATE
  fi
else
  echo -e "${RED}❌ Invalid response${NC}"
  echo $DUPLICATE
fi

echo ""
echo -e "${GREEN}=========================${NC}"
echo -e "${GREEN}✅ All tests completed!${NC}"
echo -e "${GREEN}=========================${NC}"
