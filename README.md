# JobMap Iraq 🚀

Location-based recruitment platform for Iraq.

## Quick Start

### 1. Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### 2. Setup

```bash
# Clone repo
git clone https://github.com/jobmapiracy/jobmap.git
cd jobmap

# Start services
docker-compose up -d

# Install dependencies
cd backend
npm install
npm run dev
```

### 3. Test
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"John","lastName":"Doe","role":"seeker"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Health check
curl http://localhost:3000/health
```

## Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   └── users/
│   ├── main.ts
│   └── app.module.ts
├── package.json
└── tsconfig.json

docker-compose.yml
.gitignore
README.md
```

## Next Steps

1. ✅ Backend setup complete
2. 🔜 Add more modules (Companies, Jobs, etc)
3. 🔜 Flutter mobile app
4. 🔜 React web dashboard
5. 🔜 Deploy

## Commands

```bash
npm run dev              # Start dev server
npm run build           # Build for production
npm run test            # Run tests
npm run migration:run   # Run migrations
npm run seed:run        # Seed data
```

## Database

- PostgreSQL 15+ (dev on localhost:5432)
- Redis 7+ (dev on localhost:6379)

## API

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get profile
- `GET /health` - Health check

## Status

🚀 Sprint 0: Foundation - IN PROGRESS
