# 🏢 JobMap - Location-Based Recruitment Platform

**Version:** 0.1.0-alpha  
**Status:** 🟡 Sprint 1 - Authentication Complete, Ready for QA  
**Last Updated:** July 25, 2026

---

## 📱 About JobMap

**JobMap** is a location-based recruitment platform for Iraq that connects job seekers with employers through an interactive map interface. Built with modern technologies, it provides:

- 🗺️ **Interactive Map:** Drill-down from governorates to neighborhoods
- 📍 **Location-Based Search:** Find jobs near you
- 💼 **Job Management:** Post, edit, and track job applications
- 📱 **Mobile First:** Native Flutter app for iOS/Android
- 🌐 **Web Dashboard:** React-based employer dashboard
- 🔐 **Secure Authentication:** JWT-based user management

---

## 🏗️ Tech Stack

### Backend
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL + PostGIS (spatial queries)
- **Cache:** Redis
- **Authentication:** JWT + bcrypt
- **API:** RESTful with OpenAPI documentation

### Mobile
- **Framework:** Flutter 3.0+
- **State Management:** Riverpod
- **HTTP Client:** Dio with interceptors
- **Storage:** flutter_secure_storage
- **Maps:** Google Maps Flutter

### Web Dashboard
- **Framework:** React 18
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios with interceptors
- **Styling:** CSS + Responsive Design
- **Routing:** React Router v6

### Infrastructure
- **Containers:** Docker & Docker Compose
- **Database:** PostgreSQL 15 + PostGIS
- **Cache:** Redis 7

---

## 🚀 Running the Application

### Prerequisites
- Node.js 18+
- Flutter 3.0+
- Docker & Docker Compose
- PostgreSQL 14+ (optional, use Docker)

### 1. Start Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start Docker services (PostgreSQL + Redis)
docker-compose up -d

# Run migrations
npm run migration:run

# Start server (development)
npm run dev
```

Backend will run on: **http://localhost:3000**

### 2. Start Frontend

**React Dashboard:**
```bash
cd web/dashboard

# Option A: Quick Start (No npm install needed)
# Open: file:///path/to/web/dashboard/public/app.html

# Option B: Full development
npm install
npm start  # runs on http://localhost:3001
```

**Flutter Mobile:**
```bash
cd mobile/flutter_app
flutter pub get
flutter run
```

### 3. Test Backend

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Password123!",
    "firstName":"Test",
    "lastName":"User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

---

## 📋 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | User login with credentials |
| GET | `/api/auth/me` | Get current user profile (requires JWT) |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | User logout |

### Response Format

**Success Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "seeker",
    "createdAt": "2026-07-25T..."
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest"
}
```

### Token Details
- **Access Token:** Expires in 7 days
- **Refresh Token:** Expires in 30 days
- **Storage:** localStorage (web), SecureStorage (mobile)

---

## 🗂️ Project Structure

```
jobmap/
├── backend/                    # NestJS backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication
│   │   │   ├── users/         # User management
│   │   │   ├── companies/     # Company management
│   │   │   ├── jobs/          # Job postings
│   │   │   ├── applications/  # Job applications
│   │   │   ├── locations/     # Map & locations
│   │   │   └── notifications/ # Notifications
│   │   ├── database/          # Migrations & seeds
│   │   └── main.ts
│   ├── package.json
│   └── docker-compose.yml
│
├── mobile/                     # Flutter mobile app
│   └── flutter_app/
│       ├── lib/
│       │   ├── features/
│       │   │   ├── auth/      # Authentication feature
│       │   │   ├── jobs/      # Jobs feature
│       │   │   ├── map/       # Map feature
│       │   │   └── applications/ # Applications feature
│       │   ├── core/          # Shared services
│       │   └── main.dart
│       └── pubspec.yaml
│
├── web/                        # React dashboard
│   └── dashboard/
│       ├── public/
│       │   └── app.html       # Standalone React app ⭐
│       ├── src/
│       │   ├── features/
│       │   │   ├── auth/      # Auth feature
│       │   │   ├── jobs/      # Jobs feature
│       │   │   ├── companies/ # Companies feature
│       │   │   └── ...
│       │   ├── store/         # Redux store
│       │   └── App.jsx
│       └── package.json
│
└── docs/                       # Documentation
    ├── ARCHITECTURE.md
    ├── API.md
    └── DEPLOYMENT.md
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Run unit tests
npm run test

# Run with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Flutter Testing
```bash
cd mobile/flutter_app

# Run tests
flutter test

# Build APK
flutter build apk

# Build iOS
flutter build ios
```

### React Testing
```bash
cd web/dashboard

# Run tests
npm test

# Build for production
npm run build
```

---

## 🔐 Security

### Implemented
- ✅ JWT authentication with bcrypt password hashing
- ✅ CORS configuration
- ✅ Input validation (class-validator)
- ✅ Rate limiting ready
- ✅ Helmet.js security headers

### Planned
- 🔲 Email verification
- 🔲 Two-factor authentication
- 🔲 OWASP vulnerability testing
- 🔲 API key management

---

## 📊 Project Progress

### Sprint 0 - Foundation ✅
- Architecture setup
- Project scaffolding
- Database schema design
- Infrastructure setup (Docker)
- API endpoint stubs

### Sprint 1 - Authentication 🟡 (In Progress)
- ✅ Backend auth endpoints (Register, Login, Profile, Refresh)
- ✅ Flutter auth screens (Login, Register)
- ✅ React auth pages (Login, Register, Dashboard)
- ✅ Database migrations
- ⏳ QA testing (awaiting device/browser verification)

### Sprint 2 - Company Management (Planned)
- Create/update company profiles
- Upload company logo
- Company verification
- Company dashboard

### Sprint 3 - Job Posting (Planned)
- Post jobs with location
- Edit/delete jobs
- Job listing page
- Track applications

### Sprints 4-6 (Roadmap)
- Interactive map with clustering
- Advanced search & filters
- Notifications system
- E2E testing & optimization

---

## 🐛 Known Issues

### Current Sprint
- None (code verified, awaiting QA approval)

### Future Improvements
- [ ] Real-time notifications (Socket.io)
- [ ] File upload for resumes/logos
- [ ] Search optimization (Elasticsearch)
- [ ] Performance optimization

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [FULL_PROJECT_DIAGNOSTIC.md](./FULL_PROJECT_DIAGNOSTIC.md) | Complete technical analysis |
| [RUNNING_THE_APP.md](./RUNNING_THE_APP.md) | How to run locally |
| [REACT_APP_READY.md](./REACT_APP_READY.md) | React testing guide |
| [SESSION_SUMMARY.md](./SESSION_SUMMARY.md) | Session completion report |

---

## 🚀 Deployment

### Development
```bash
# Using Docker
docker-compose up

# Services available:
# - Backend: http://localhost:3000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

### Staging/Production (Coming Soon)
- [ ] AWS/GCP deployment configs
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Database backup strategy
- [ ] Monitoring & alerting

---

## 👥 Team

- **Backend Lead:** [Your Name]
- **Flutter Lead:** [Your Name]
- **React Lead:** [Your Name]

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 📞 Support

For issues or questions:
1. Check [RUNNING_THE_APP.md](./RUNNING_THE_APP.md)
2. Review [FULL_PROJECT_DIAGNOSTIC.md](./FULL_PROJECT_DIAGNOSTIC.md)
3. Open an issue on GitHub

---

## 🎯 Current Status Summary

```
Backend:       ✅ Running & Verified
Flutter:       ✅ Code Ready, Awaiting Device Test
React:         ✅ UI Ready, Open app.html Now
GitHub:        ✅ Repository Active
QA Status:     🟡 Pending Manual Verification

Next Steps:
1. Test React in browser (5 min)
2. Test Flutter on device (30 min)
3. Report results
4. Close Sprint 1
5. Begin Sprint 2
```

---

**Ready to contribute?** Clone this repo and follow [RUNNING_THE_APP.md](./RUNNING_THE_APP.md)

**Questions?** Check the [documentation](./docs) or open an issue

---

**Last Updated:** July 25, 2026  
**Status:** 🟡 Sprint 1 QA Pending  
**Next Review:** After device testing
