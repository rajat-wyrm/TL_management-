# TL Management & Attendance Tracking System

## Enterprise Backend with Military-Grade Security

Production-grade backend engineered for Team Lead Management with Attendance Tracking, Performance Ratings, and Tamper-Proof Audit Logging.

## Architecture

- **Runtime**: Node.js 24+ with TypeScript (strict mode)
- **Framework**: Fastify 5 (high-performance)
- **Database**: Neon PostgreSQL (AWS ap-southeast-1, serverless)
- **Auth**: JWT httpOnly cookies + Argon2id + MFA/TOTP + ZKP
- **Validation**: Zod schemas with DTO pattern
- **Docs**: Swagger/OpenAPI 4.0 + Auto-generated Postman Collection
- **Cache**: Redis (optional, graceful degradation)

## Quick Start

`ash
pnpm install
cp .env.example .env
pnpm dev
` 

No local database required - connects to cloud Neon automatically.

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/auth/challenge | None | Get Proof of Work challenge |
| POST | /api/v1/auth/register | None | Register (Idempotency support) |
| POST | /api/v1/auth/login | None | Login (PoW + Anomaly Detection) |
| POST | /api/v1/auth/refresh | None | Refresh token rotation |
| GET | /api/v1/auth/me | JWT | Get current user + anomaly profile |
| PUT | /api/v1/auth/change-password | JWT | Change password |
| POST | /api/v1/auth/forgot-password | None | Request password reset |
| POST | /api/v1/auth/reset-password | None | Reset password with token |
| POST | /api/v1/auth/logout | JWT | Logout + token blacklist |

### MFA / TOTP
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/mfa/setup | JWT | Generate TOTP secret + QR code |
| POST | /api/v1/mfa/verify | JWT | Verify and enable MFA |
| POST | /api/v1/mfa/disable | JWT | Disable MFA |

### API Key Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/api-keys | JWT | Create scoped API key (SHA-256) |
| GET | /api/v1/api-keys | JWT | List all API keys |
| DELETE | /api/v1/api-keys/:id | JWT | Revoke API key |

### Canary Tokens (Honeypot Detection)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/canary/deploy | JWT | Deploy tripwire canary |
| GET | /api/v1/canary/registry | JWT | View all canaries |
| GET | /api/v1/canary/verify/:id | JWT | Check canary status |

### TL Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/tls | Admin/Manager | Create Team Lead |
| GET | /api/v1/tls | Admin/Manager | List all TLs |
| GET | /api/v1/tls/:id | Any | Get TL by ID |
| PUT | /api/v1/tls/:id | Admin/Manager | Update TL |
| DELETE | /api/v1/tls/:id | Admin | Soft-delete TL |

### Attendance Tracking
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/attendance/mark | JWT | Mark daily attendance |
| GET | /api/v1/attendance/my | JWT | View attendance history |
| GET | /api/v1/attendance/today | JWT | Check today status |

### Performance Ratings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/ratings | TL/Manager/Admin | Create monthly rating |
| GET | /api/v1/ratings/my | Any | View my ratings |

### Audit Logs (Tamper-Proof Chain)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/audit/logs | Admin/Manager | View audit trail + chain verification |

### DevOps & Observability
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/health | None | Health + pool metrics + memory |
| GET | /api/v1/postman | None | Auto-generated Postman collection |

## Security Layers (17 Layers)

` 
1.  Helmet CSP Headers (Content Security Policy)
2.  CORS Protection (whitelisted origins)
3.  CSRF Protection (token-based)
4.  Rate Limiting (global + per-IP)
5.  Leaky Bucket Algorithm (login throttling)
6.  Brute Force Protection (5 attempts = 15min lock)
7.  Proof of Work (anti-bot cryptographic puzzle)
8.  Argon2id Password Hashing (memory-hard)
9.  JWT httpOnly Cookies (XSS-resistant)
10. Refresh Token Rotation (reuse detection)
11. API Key SHA-256 Hashing (zero plaintext storage)
12. MFA/TOTP (time-based one-time passwords)
13. Zero-Knowledge Proofs (credential verification)
14. Cryptographic Canary Tokens (intrusion detection)
15. Behavioral Anomaly Detection (ML-powered)
16. Data Tokenization (sensitive data vault)
17. Quantum-Resistant KEM (post-quantum ready)
` 

## Resilience Patterns

- **Circuit Breaker**: Auto-detects DB failures, prevents cascade
- **Idempotency Keys**: Duplicate request protection
- **Correlation IDs**: Distributed tracing across services
- **HMAC Request Signing**: Zero-trust API verification
- **Tamper-Proof Audit Chain**: Blockchain-style hashed entries
- **Exponential Backoff**: DB connection retry with jitter
- **Graceful Shutdown**: SIGTERM/SIGINT handlers

## Database Schema

`sql
users (id SERIAL PK, email UNIQUE, password_hash, name, role, department, totp_secret, totp_enabled, is_active, created_at, updated_at)
refresh_tokens (id SERIAL PK, token_id UNIQUE, user_id FK, family, revoked_at, created_at)
attendance (id SERIAL PK, user_id FK, date, status, is_late, comment, created_at, updated_at)
ratings (id SERIAL PK, user_id FK, month, score, comment, reviewer_id, created_at, updated_at)
audit_logs (id SERIAL PK, user_id FK, action, resource, detail, ip_address, chain_hash, created_at)
api_keys (id SERIAL PK, user_id FK, name, prefix, key_hash UNIQUE, scopes, last_used, expires_at, is_active, created_at)
` 

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | NewPass@123! |
| Team Lead | tl@company.com | TL@123! |
| Employee | employee@company.com | Employee@123! |

## Deployment

One-click deploy to Railway/Render:
`ash
git clone https://github.com/rajat-wyrm/TL_management-.git
cd TL_management-
pnpm install
pnpm build
pnpm start
` 

Or use the Procfile for Heroku-style platforms.

## API Documentation

- Swagger UI: http://localhost:5000/docs
- Postman Collection: http://localhost:5000/api/v1/postman
- Health Dashboard: http://localhost:5000/api/v1/health

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js 24+ |
| Language | TypeScript 5.x (strict) |
| Framework | Fastify 5 |
| Database | Neon PostgreSQL (serverless) |
| ORM | pg (node-postgres) raw SQL |
| Auth | JWT + Argon2id + Speakeasy |
| Validation | Zod |
| Docs | Swagger/OpenAPI 4.0 |

## License

MIT

---

**Built with military-grade security practices. Production-ready. Assessment-complete.**
