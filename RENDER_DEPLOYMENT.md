# Render Deployment Guide

## ⚠️ Security Note

**NEVER** commit `.env` files or secrets to GitHub!

- `.env` files are in `.gitignore` ✅
- All secrets should be added in Render Dashboard only

---

## Backend Deployment

### Environment Variables (Add in Render Dashboard)

```
NODE_ENV=production
DB_HOST=dpg-d9ihg9ernols73fbauog-a.render.internal
DB_PORT=5432
DB_USER=jobmap_user
DB_PASSWORD=<YOUR_SECURE_PASSWORD_HERE>
DB_NAME=jobmap_ssqr
JWT_SECRET=<GENERATE_STRONG_SECRET_32+_CHARS>
JWT_REFRESH_SECRET=<GENERATE_STRONG_SECRET_32+_CHARS>
```

### Setup Steps

1. **Create Web Service** on Render Dashboard
2. **Select** GitHub repo: `jobmap`
3. **Branch:** `main`
4. **Configuration:**
   - **Name:** `jobmap-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Region:** Frankfurt
   - **Plan:** Free or Starter

5. **Add all Environment Variables** from above
6. **Deploy**

### Database Connection

- Internal URL for Render services:
  ```
  postgresql://jobmap_user:PASSWORD@dpg-d9ihg9ernols73fbauog-a.render.internal:5432/jobmap_ssqr
  ```

---

## After Deployment

⚠️ **IMPORTANT:** After successful deployment:

1. **Rotate Database Credentials** on Render
2. **Generate Strong Secrets** for JWT (use openssl or strong password generator)
3. **Update all Render Environment Variables** with new values

---

## Testing Production Backend

```bash
curl https://jobmap-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## Troubleshooting

### Build Fails

Check Render logs:
```
Logs → Build Logs
```

### Database Connection Error

Verify:
1. DB_HOST includes `.render.internal`
2. DB_PORT is `5432`
3. DB_USER and DB_PASSWORD are correct
4. DB_NAME is `jobmap_ssqr`

### Application Crashes

Check:
1. JWT_SECRET and JWT_REFRESH_SECRET are set
2. NODE_ENV=production
3. Render logs for errors

