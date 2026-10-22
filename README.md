# Pahad Footprint (पहाड़ फुटप्रिंट) — Uttarakhand Eco-Carbon Accounting System

A production-grade web application and analytical telemetry portal engineered for tourists, regional mountain hosts, and Uttarakhand sustainability administrators.

---

## 1. System Architecture

The project follows a decoupled monorepo architecture:

```
Pahad Footprint/
├── frontend/                  # Next.js 14+ App Router, TypeScript, Tailwind CSS
│   ├── src/
│   │   ├── app/               # App Router pages (/ , /methodology, /restoration, /admin)
│   │   ├── components/        # Biophilic UI components (Navbar, TripCalculatorForm, etc.)
│   │   ├── lib/               # Typed API client with deterministic fallback
│   │   └── types/             # TypeScript domain schemas
│   ├── Dockerfile             # Multi-stage production container
│   └── tailwind.config.js     # Exact Google Stitch token definitions
│
├── server/                    # Node.js, Express, TypeScript, Sequelize ORM, PostgreSQL
│   ├── src/
│   │   ├── config/            # Database pool & environment configuration
│   │   ├── middleware/        # JWT auth, requireAdmin RBAC, Zod validation
│   │   ├── models/            # Sequelize models (User, Trip)
│   │   ├── routes/            # REST API endpoints (/auth, /trips, /admin)
│   │   └── utils/             # Deterministic carbon calculation engine
│   └── Dockerfile             # Production container
│
├── nginx/                     # Reverse proxy configuration
│   └── nginx.conf             # Rate limiting, gzip, security headers, SSL-ready
│
├── docker-compose.yml         # Full multi-container orchestration (PostgreSQL, Express, Next.js, Nginx)
└── qa-check.ps1               # Automated 49-point QA verification suite
```

---

## 2. Design System & Biophilic Tokens

Ingested directly from the Google Stitch design specifications:
- **Primary Headers & Surfaces:** Deep Forest Green (`#1B4332`), text `#FFFFFF`
- **Metric Containers:** Pale Mist Green (`#EDF6F0`) with 1px solid border (`#D8E8DF`)
- **Global Canvas:** Soft Alabaster Off-White (`#F8FAF9`)
- **Typography:** Inter across all headings, body text, and tables (`#111827` Charcoal for WCAG AA compliance)
- **Warning Accents:** Earthy Terracotta (`#C85A32`)
- **Geometry:** Cards `16px` border-radius & `20px` internal padding; inputs/buttons `10px` border-radius; `24px` grid gaps.
- **Responsive Guard:** All grids use `minmax(0, Xfr)` to eliminate horizontal overflow on mobile viewports (`375px+`).

---

## 3. Mathematical Carbon Model

- **Vehicle Base Factors:**
  - Diesel SUV: `180 g CO₂e / vkm`
  - Petrol Sedan: `140 g CO₂e / vkm`
  - Electric Vehicle: `45 g CO₂e / vkm`
  - Shared UTC Bus: `30 g CO₂e / pkm`
- **Altitude Incline Multipliers:**
  - Foothills (&lt;800m AMSL): `1.00×`
  - Mid-Hills (800–2,400m AMSL): `1.25×`
  - High Altitude (&gt;2,400m AMSL): `1.40×`
- **Accommodation Intensities:**
  - Luxury Resort: `24.0 kg CO₂e / night`
  - Standard Hotel: `9.0 kg CO₂e / night`
  - Pahadi Homestay: `6.0 kg CO₂e / night`
  - Eco-Camp: `3.5 kg CO₂e / night`
- **Eco-Habit Credits:**
  - Reusable bottle refill: `−2.0 kg / person`
  - Local seasonal cuisine: `−3.0 kg / person`

---

## 4. REST API Specification

| Method | Endpoint | Access | Purpose |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Public | Register tourist or admin account |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| `POST` | `/api/trips/calculate` | Public | Deterministic real-time calculation |
| `POST` | `/api/trips/log` | Auth / Guest | Persist calculated trip into database |
| `GET` | `/api/admin/metrics` | Admin RBAC | Aggregated 214.8t regional system metrics |
| `GET` | `/api/admin/trips` | Admin RBAC | Paginated 1,482 audit log with row expansion |

### Seed Credentials
- **Regional Auditor:** `admin@pahadfootprint.gov.in` / `PahadAdmin2026!` (Role: `admin`)
- **Tourist Account:** `tourist@pahadfootprint.org` / `PahadTourist2026!` (Role: `tourist`)

---

## 5. Quickstart & Local Development

### Option A: Local Dev Mode (Node.js)

1. **Start Backend (Express + SQLite/Postgres):**
   ```bash
   cd server
   npm install
   npm run dev
   # Server runs on http://localhost:5000
   ```

2. **Start Frontend (Next.js 14):**
   ```bash
   cd frontend
   npm install
   npm run dev
   # App runs on http://localhost:3000
   ```

### Option B: Production Docker Deployment

```bash
docker-compose up --build -d
```
All 4 services will spin up:
- Nginx Gateway: `http://localhost` (Port 80)
- Next.js Frontend: `http://localhost:3000`
- Express Backend: `http://localhost:5000`
- PostgreSQL Database: Port 5432
