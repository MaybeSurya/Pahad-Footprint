# Pahad Footprint (पहाड़ फुटप्रिंट) — Uttarakhand Eco-Travel & Tree Restoration Guide

A modern, mountain-aware web application and environmental stewardship guide built for travelers, local communities, and village councils across Uttarakhand.

---

## 1. Overview & Key Features

Pahad Footprint helps travelers calculate their journey's fuel and carbon footprint across steep mountain roads, adopt greener choices, and support native tree planting with local village councils (*Van Panchayats*) and certified conservation NGOs.

### Core Capabilities:
- **5-Step Trip Planner:**
  - **Step 1: Route & Distance (`/calculator/route`):** Interactive OpenStreetMap selection across all 13 Uttarakhand districts. Mountain slope and road distances are calculated automatically.
  - **Step 2: Vehicles & Two-Wheelers (`/calculator/vehicle`):** Support for pedal bicycles, electric two-wheelers, petrol/hybrid motorcycles, gearless scooters, private cars (SUV, sedan, hatchback, coupe), and state buses. For private vehicles, asks for the **Vehicle Year of Registration** to calculate engine wear over time (older vehicles emit progressively more CO₂ on mountain climbs), while omitting registration questions for public transit and bicycles.
  - **Step 3: Where You Stay (`/calculator/stay`):** Compares eco-camps and Pahadi village homestays with grid-powered heated hotels and resorts.
  - **Step 4: Green Travel Choices (`/calculator/habits`):** Deductions for carrying reusable water bottles and eating local seasonal mountain food.
  - **Step 5: Trip Results & Live Weather (`/calculator/results`):** Clear carbon summaries, eco-swap recommendations, and live mountain temperature, AQI, and forecast powered by the **MaybeSurya Weather API**.
- **Tree Restoration & NGO Donations (`/restoration`):**
  - Self-planting pledges of native Himalayan Banj Oak (*Quercus leucotrichophora*).
  - One-click donation option via **DevNexis** (`https://devnexis.in/payment`) for travelers who want local village nurseries to plant and care for saplings on their behalf.
- **Certificate of Mountain Stewardship & Isolated Printing:**
  - Personalized recognition certificate with traveler name and tree count.
  - Dynamic QR code generated via the **MaybeSurya QrX API** linking directly to the internal verification portal.
  - Isolated iframe printing to save clean A4 PDFs without printing the entire webpage.
- **Online Certificate Verification Registry (`/verify`):**
  - Public registry to verify Certificate IDs (e.g. `UK-VP-2026-48219`).
  - Automatic URL query verification (`?cert=...&name=...`) when scanned via mobile cameras.
- **Admin Dashboard & Real-Time Activity Logs (`/admin`):**
  - **6-Metric Command Center:** Total trees supported, NGO donation amounts (₹), traveler pledges, verified certificates, 2-year survival rate (92.4%), and active Van Panchayats (38 councils across 186 hectares).
  - **Filterable Activity Table:** Real-time log tracking for *Donations*, *Pledges*, *Certificates*, and *Trips*.
  - **Export Tools:** Instant CSV and JSON export for audits and reports.
- **Offline Progressive Web App (PWA):**
  - Fully offline-ready with Service Worker caching (`/sw.js`) and Web App Manifest (`/manifest.json`).
  - Mountain calculations and route guides remain functional in remote valleys with zero mobile signal.
- **New Informational Pages:**
  - **Privacy Policy (`/privacy`):** 100% client-side calculation privacy, offline storage control, zero ads/trackers, and DPDP Act 2023 compliance.
  - **Contact Page (`/contact`):** Interactive inquiry form with Dehradun and Almora regional field desk coordinates.
  - **FAQ Page (`/faq`):** Search bar, 7 category filter pills, and expandable answers to common traveler questions.
  - **Methodology (`/methodology`):** Clear explanation of mountain hill factors and calculation formulas in simple English.
- **User Navigation & Profile Dropdown:**
  - Responsive header featuring the website brand mark (`/icons/icon.svg`).
  - Authenticated user profile button displaying avatar icon, name, and a dropdown menu with account details, quick navigation, and logout.
  - Dual language switcher with instant toggle between English and Hindi (`EN` / `हिन्दी`).

---

## 2. Project Architecture

The project is structured as a full-stack monorepo:

```
Pahad Footprint/
├── frontend/                  # Next.js 15+ App Router, TypeScript, Tailwind CSS, Framer Motion, Leaflet
│   ├── public/
│   │   ├── icons/             # SVG brand icon and PWA assets
│   │   ├── images/            # Mountain ridge panoramas and etchings
│   │   ├── manifest.json      # Progressive Web App manifest
│   │   └── sw.js              # Service Worker for offline mountain caching
│   ├── src/
│   │   ├── app/               # App Router pages (/ , /calculator/*, /restoration, /verify, /admin, /privacy, /contact, /faq, /methodology)
│   │   ├── components/        # Reusable nature-journal UI components (Navbar, Footer, AdminDashboard, etc.)
│   │   ├── contexts/          # TranslationContext (English / Hindi toggle)
│   │   ├── lib/               # Weather API, activity logger, and API client
│   │   └── types/             # TypeScript schemas for vehicles, calculations, logs, and sessions
│   ├── Dockerfile             # Multi-stage production container
│   └── tailwind.config.js     # Nature-journal paper tokens and styling
│
├── server/                    # Node.js, Express, TypeScript, Sequelize ORM, PostgreSQL / SQLite
│   ├── src/
│   │   ├── config/            # Database pool & environment configuration
│   │   ├── middleware/        # JWT auth, requireAdmin RBAC, Zod validation
│   │   ├── models/            # Sequelize models (User, Trip)
│   │   ├── routes/            # REST API endpoints (/auth, /trips, /admin)
│   │   └── utils/             # Carbon calculation engine
│   └── Dockerfile             # Production container
│
├── nginx/                     # Reverse proxy configuration
│   └── nginx.conf             # Rate limiting, gzip, security headers, SSL-ready
│
├── docker-compose.yml         # Full multi-container orchestration (PostgreSQL, Express, Next.js, Nginx)
└── README.md                  # Project documentation
```

---

## 3. Design System & Aesthetics

The user interface uses a **nature-journal** design language inspired by Himalayan cartography and botanical field books:

- **Warm Paper Canvas:** Deep paper (`#F7F6F0`), card paper (`#FAF9F5`), and border lines (`#2D322B29`).
- **Charcoal Ink:** High-contrast, readable dark typography (`#242722`) meeting WCAG AAA standards.
- **Alpine Greens:** Deep forest green (`#304B38`) and moss accents (`#496951`).
- **Terracotta & Earth:** Warm earth tones (`#8A5D2E`) for badges and highlights.
- **Typography:** Inter for clean readability, paired with monospace accents for IDs and statistics.
- **Clean Layouts:** Elimination of artificial buzzword badges and complex programmer labels sitewide in favor of simple, approachable English.

---

## 4. Vehicle & Fuel Compatibility Rules

| Mode | Allowed Fuel Types | Restricted Fuel Types |
|:---|:---|:---|
| **Bicycle** | Pedal (0 g/km), Electric (8 g/km) | Diesel, Petrol, CNG, LPG, Hybrid |
| **Motorcycle** | Petrol (55 g/km), Hybrid (38 g/km), EV (18 g/km) | Diesel, CNG, LPG |
| **Scooty** | Petrol (50 g/km), Hybrid (35 g/km), EV (16 g/km) | Diesel, CNG, LPG |
| **Car (SUV, Sedan, Hatchback, Coupe)** | Petrol, Diesel, CNG, LPG, Hybrid, EV | Pedal |
| **Public Transit** | State Bus (UTC), Train, Flight, Helicopter | N/A |

### Mountain Terrain Multipliers:
- **Foothills (&lt;800m):** `1.00×`
- **Mid-Hills (800–2,400m):** `1.25×` (+25% fuel consumption on mountain curves)
- **High Altitude (&gt;2,400m):** `1.40×` (+40% fuel consumption on steep climbs)

---

## 5. Third-Party API Integrations

1. **Himalayan Weather & AQI API (MaybeSurya):**
   - Documentation: `https://docs.maybesurya.dev/weather/overview`
   - Endpoints: `https://weather.maybesurya.dev/api/weather?location={Destination}`
   - Features: Real-time temperature, air quality index (AQI), weather conditions, and forecast.
2. **QR Code Generator API (MaybeSurya QrX):**
   - Endpoint: `https://qrgen.maybesurya.dev/api/qrgen?data={encodedUrl}`
   - Used for embedding scannable verification QR graphics into certificates.
3. **NGO Restoration Donations (DevNexis):**
   - Portal: `https://devnexis.in/payment`
   - Allows travelers to contribute ₹120 per tree directly to community Van Panchayats and nurseries.

---

## 6. REST API Endpoints

| Method | Endpoint | Access | Purpose |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Public | Register tourist or admin account |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| `POST` | `/api/trips/calculate` | Public | Real-time carbon calculation |
| `POST` | `/api/trips/log` | Auth / Guest | Save calculated trip into database |
| `GET` | `/api/admin/metrics` | Admin RBAC | Regional summary statistics |
| `GET` | `/api/admin/trips` | Admin RBAC | Paginated trip audit records |

### Demo Credentials:
- **Auditor / Admin:** `admin@pahadfootprint.gov.in` / `PahadAdmin2026!` (Role: `admin`)
- **Traveler Account:** `tourist@pahadfootprint.org` / `PahadTourist2026!` (Role: `tourist`)

---

## 7. Getting Started

### Prerequisites:
- Node.js 18+ or 20+
- npm or yarn

### Running Locally:

1. **Frontend (Next.js):**
   ```bash
   cd frontend
   npm install
   npm run dev -- -p 3001
   # Open http://localhost:3001 in your browser
   ```

2. **Backend (Express):**
   ```bash
   cd server
   npm install
   npm run dev
   # Server runs on http://localhost:5000
   ```

3. **Running with Docker Compose:**
   ```bash
   docker-compose up --build -d
   ```
   Services started:
   - Next.js Frontend: `http://localhost:3000`
   - Express Backend: `http://localhost:5000`
   - PostgreSQL: Port `5432`
   - Nginx Reverse Proxy: Port `80`

---

## 8. License & Community

Built with care for the Himalayan ecology of **Devbhoomi Uttarakhand**. Licensed under the MIT License.
