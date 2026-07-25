# Render Environment Variables Template

## ⚠️ Security Warning
**NEVER commit this file to GitHub with actual values!**

Keep this file locally only. Add these environment variables directly in Render Dashboard.

---

## Backend Web Service Environment Variables

Copy these into Render Dashboard → Your Web Service → Environment:

```
NODE_ENV=production
DB_HOST=dpg-d9ihg9ernols73fbauog-a.render.internal
DB_PORT=5432
DB_NAME=jobmap_ssqr
DB_USER=jobmap_user
DB_PASSWORD=<YOUR_DATABASE_PASSWORD>
JWT_SECRET=<GENERATE_STRONG_32+_CHARACTER_SECRET>
JWT_REFRESH_SECRET=<GENERATE_STRONG_32+_CHARACTER_SECRET>
```

### How to Generate Strong Secrets

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
```

**Or use online tool:** https://www.random.org/cgi-bin/randbytes?nbytes=32&format=h

---

## Database Credentials

From your Render PostgreSQL Instance (jobmap-db):

| Variable | Value |
|----------|-------|
| **DB_HOST** | Internal host from jobmap-db |
| **DB_PORT** | 5432 |
| **DB_NAME** | jobmap_ssqr |
| **DB_USER** | jobmap_user |
| **DB_PASSWORD** | From Render credentials |

---

## Steps to Add Variables in Render Dashboard

1. Go to your Web Service: `jobmap-backend`
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Enter each variable above
5. Click **"Deploy"**

---

## After First Deployment

⚠️ **IMPORTANT:**

1. **Rotate Database Credentials:**
   - Go to jobmap-db instance
   - Click "Create new default credentials"
   - Update Web Service environment variables

2. **Update JWT Secrets:**
   - Generate new strong secrets
   - Update in Render Dashboard
   - Redeploy Web Service

3. **Verify Deployment:**
   ```bash
   curl https://jobmap-backend.onrender.com/api/health
   ```

---

## Environment Variables Checklist

- [ ] NODE_ENV=production
- [ ] DB_HOST=correct internal host
- [ ] DB_PORT=5432
- [ ] DB_NAME=jobmap_ssqr
- [ ] DB_USER=jobmap_user
- [ ] DB_PASSWORD=strong password
- [ ] JWT_SECRET=32+ character random string
- [ ] JWT_REFRESH_SECRET=different 32+ character random string

---

**Local Use Only - Delete sensitive values after adding to Render Dashboard!**
