# TL Management and Attendance Tracking System

Production-grade backend for Team Lead Management with Attendance Tracking, Ratings, and Audit Logging.

## Tech Stack
- Node.js 22+, TypeScript, Fastify 5
- PostgreSQL + Prisma ORM
- Redis (optional for caching/blacklist)
- JWT Auth with Argon2 password hashing
- Zod validation, Swagger docs

## Quick Start
` 
pnpm install
cp .env.example .env
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
pnpm dev
` 

## API Endpoints

**Auth Module:**
- POST /api/v1/auth/register - Register new user
- POST /api/v1/auth/login - Login
- GET /api/v1/auth/me - Get current user
- PUT /api/v1/auth/change-password - Change password
- POST /api/v1/auth/logout - Logout

**TL Management:**
- POST /api/v1/tls - Create TL (Admin/Manager)
- GET /api/v1/tls - List all TLs
- GET /api/v1/tls/:id - Get TL by ID
- PUT /api/v1/tls/:id - Update TL (Admin/Manager)
- DELETE /api/v1/tls/:id - Deactivate TL (Admin only)

**Attendance:**
- POST /api/v1/attendance/mark - Mark daily attendance
- GET /api/v1/attendance/my - Get attendance history
- GET /api/v1/attendance/today - Check today status

**Ratings:**
- POST /api/v1/ratings - Create rating (TL/Manager/Admin)
- GET /api/v1/ratings/my - Get my ratings

**Audit Logs:**
- GET /api/v1/audit/logs - View audit logs (Admin/Manager)

## Test Accounts
- Admin: admin@company.com / Admin@123!
- TL: tl@company.com / TL@123!
- Employee: employee@company.com / Employee@123!

## Security
Helmet, CORS, Rate Limiting, JWT httpOnly cookies, Argon2id hashing, RBAC, Zod validation, SQL injection prevention via Prisma, Audit logging.

## API Docs
http://localhost:5000/docs
