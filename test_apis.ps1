# Test Backend APIs

Write-Host "=== Backend API Tests ===" -ForegroundColor Cyan

# Test Health
Write-Host "`n1. Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ Health: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Health: Failed" -ForegroundColor Red
}

# Test Register
Write-Host "`n2. Register..." -ForegroundColor Yellow
$randomEmail = "test$(Get-Random)@example.com"
$body = "{`"email`":`"$randomEmail`",`"password`":`"Password123!`",`"firstName`":`"Test`",`"lastName`":`"User`",`"role`":`"seeker`"}"
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Register: Success (HTTP $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   User ID: $($data.user.id)"
    Write-Host "   Access Token: $($data.accessToken.Substring(0, 20))..."
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    Write-Host "❌ Register: Failed (HTTP $statusCode)" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)"
}

# Test Login
Write-Host "`n3. Login..." -ForegroundColor Yellow
$loginBody = "{`"email`":`"$randomEmail`",`"password`":`"Password123!`"}"
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $loginBody -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Login: Success (HTTP $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   Access Token: $($data.accessToken.Substring(0, 20))..."
    $global:token = $data.accessToken
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    Write-Host "❌ Login: Failed (HTTP $statusCode)" -ForegroundColor Red
}

# Test /auth/me
Write-Host "`n4. Get Profile..." -ForegroundColor Yellow
if ($global:token) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" -Method GET -Headers @{"Authorization"="Bearer $global:token"} -UseBasicParsing -ErrorAction Stop
        $data = $response.Content | ConvertFrom-Json
        Write-Host "✅ Profile: Success" -ForegroundColor Green
        Write-Host "   User: $($data.firstName) $($data.lastName)"
        Write-Host "   Email: $($data.email)"
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        Write-Host "❌ Profile: Failed (HTTP $statusCode)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Profile: Skipped (no token from login)" -ForegroundColor Yellow
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
