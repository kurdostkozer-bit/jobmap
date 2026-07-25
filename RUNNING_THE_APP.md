# JobMap Iraq - Running the Application

## Prerequisites

- Node.js 18+
- Flutter 3.0+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose

## Quick Start

### 1. Start Database & Redis

```bash
cd /workspace
docker-compose up -d
```

This will start:
- PostgreSQL on `localhost:5432` (user: postgres, pass: postgres, db: jobmap)
- Redis on `localhost:6379`

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:3000`

**Key Endpoints:**
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- GET `/auth/profile` - Get logged-in user profile
- GET `/api/companies` - List all companies
- GET `/api/jobs` - Search jobs
- GET `/api/jobs/location/nearby?lat=X&lng=Y&radius=50` - Jobs near location
- GET `/api/applications/user/my-applications` - My applications
- GET `/api/map/governorates` - All Iraqi governorates

### 3. Test Backend (curl)

**Register:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123!",
    "firstName":"John",
    "lastName":"Doe"
  }'
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "seeker",
    "isEmailVerified": false,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "access_token": "eyJhbGc..."
}
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Get Profile (with token):**
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Setup Flutter Mobile App

```bash
cd mobile/flutter_app
flutter pub get
flutter run
```

(Make sure you have Android emulator running or iOS simulator)

**Key Features:**
- Login screen connected to backend
- Jobs list with search & filtering
- Interactive map with governorates drill-down
- Job applications tracking
- Notifications panel

### 5. Setup React Web Dashboard

```bash
cd web/dashboard
npm install
npm start
```

Dashboard will run on `http://localhost:3000` (Note: Make sure Backend isn't on 3000, or use PORT=3001)

**Key Features:**
- Admin authentication
- Company management
- Job posting & editing
- Applications management
- Map-based job search
- Notifications system

## Database Seeding

The application uses TypeORM with `synchronize: true` in development mode, so tables are created automatically.

To add initial data (Iraqi governorates), run:

```bash
# In backend directory
npm run seed
```

(You'll need to create a seed script first - see backend/src/database/seeds/)

## API Documentation

### Auth Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile (requires JWT)

### Companies
- `POST /companies` - Create company (requires JWT)
- `GET /companies/:id` - Get company details
- `GET /companies/my-companies` - Get user's companies (requires JWT)
- `PUT /companies/:id` - Update company (requires JWT)
- `DELETE /companies/:id` - Delete company (requires JWT)

### Jobs
- `POST /jobs` - Create job (requires JWT)
- `GET /jobs/:id` - Get job details
- `GET /jobs/search?q=keyword&governorate=Baghdad` - Search jobs
- `GET /jobs/location/nearby?lat=33.33&lng=44.44&radius=50` - Jobs near location
- `GET /jobs/governorate/:governorate` - Jobs by governorate
- `PUT /jobs/:id` - Update job (requires JWT)
- `DELETE /jobs/:id` - Delete job (requires JWT)

### Applications
- `POST /applications` - Apply for job (requires JWT)
- `GET /applications/user/my-applications` - My applications (requires JWT)
- `GET /applications/:id` - Get application details
- `PATCH /applications/:id/status` - Update application status
- `DELETE /applications/:id` - Withdraw application (requires JWT)

### Map & Locations
- `GET /map/governorates` - All Iraqi governorates
- `GET /map/governorates/:id` - Specific governorate with districts
- `GET /map/governorates/:id/districts` - Districts of governorate
- `GET /map/districts/:id/neighborhoods` - Neighborhoods of district
- `GET /map/governorates/:id/drill-down` - Full location hierarchy

### Notifications
- `GET /notifications` - Get user notifications (requires JWT)
- `GET /notifications?unread=true` - Get unread notifications only
- `PATCH /notifications/:id/read` - Mark notification as read
- `PATCH /notifications/read-all` - Mark all as read (requires JWT)
- `DELETE /notifications/:id` - Delete notification (requires JWT)

## Testing the Flow

### 1. Register & Login
- Call `/auth/register` to create account
- Store the `access_token` from response
- Use token in `Authorization: Bearer <token>` header for protected endpoints

### 2. Create Company (for Employer)
```bash
curl -X POST http://localhost:3000/companies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Company",
    "email": "hr@techco.com",
    "governorate": "Baghdad",
    "district": "Karrada",
    "latitude": 33.2844,
    "longitude": 44.3615
  }'
```

### 3. Post a Job
```bash
curl -X POST http://localhost:3000/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer",
    "description": "Looking for experienced developer",
    "governorate": "Baghdad",
    "district": "Karrada",
    "realLatitude": 33.2844,
    "realLongitude": 44.3615,
    "salaryMin": 1000,
    "salaryMax": 2000,
    "skills": ["Node.js", "React", "PostgreSQL"],
    "jobType": "Full-Time",
    "experienceLevel": "Senior"
  }'
```

### 4. Search Jobs
```bash
curl -X GET 'http://localhost:3000/jobs/search?q=developer&governorate=Baghdad'
```

### 5. Apply for Job
```bash
curl -X POST http://localhost:3000/applications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "JOB_ID_HERE",
    "coverLetter": "I am interested in this position...",
    "cvUrl": "https://example.com/cv.pdf"
  }'
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=jobmap
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=7d
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3000/api
```

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use: `lsof -i :3000`
- Ensure PostgreSQL is running: `docker-compose ps`
- Check database connection: `psql -U postgres -d jobmap`

### Flutter app can't connect
- Make sure backend is running on localhost:3000
- Check if emulator can reach host: `telnet localhost 3000`
- Update API URL in `lib/core/services/api_client.dart` if needed

### React dashboard issues
- Clear cache: `npm install && npm start`
- Check browser console for errors (F12)
- Verify Redux DevTools extension installation

## Next Steps

1. **Database seeding** - Add Iraqi governorates & districts data
2. **Authentication** - Add email verification & password reset
3. **File uploads** - Add company logo & CV upload
4. **Real-time notifications** - Integrate Socket.io
5. **Search optimization** - Add Elasticsearch for full-text search
6. **Mobile app finish** - Complete all screens & polish UI
7. **Performance** - Add caching, pagination, lazy loading
8. **Testing** - Add unit & integration tests
9. **Deployment** - Setup CI/CD pipelines

## Architecture Overview

```
Backend (NestJS)
├── Auth Module (JWT)
├── Users Module
├── Companies Module
├── Jobs Module (with location anonymization)
├── Applications Module
├── Locations Module (Iraqi map data)
├── Notifications Module
└── Common (Guards, Interceptors, Filters)

Mobile (Flutter)
├── Features
│   ├── Auth (Riverpod)
│   ├── Jobs (Riverpod)
│   ├── Map (Google Maps)
│   └── Applications (Riverpod)
└── Core (API Client, Services)

Web (React)
├── Features
│   ├── Auth (Redux)
│   ├── Jobs (Redux)
│   ├── Companies (Redux)
│   ├── Applications (Redux)
│   ├── Notifications (Redux)
│   └── Map (Redux)
└── Store (Redux Toolkit)
```

## Security Notes

- ⚠️ JWT_SECRET in .env should be strong & unique
- ⚠️ Always validate user input
- ⚠️ Don't commit .env files to git
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for auth endpoints
- ⚠️ Add CORS configuration carefully
