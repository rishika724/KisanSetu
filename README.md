# किसान सेतु (Kisan Setu)
### Digital Agricultural Procurement & Mandi Scheduling Platform
**Smart India Hackathon (SIH Problem Statement 26032)**

---

## 🌾 Overview
**Kisan Setu (किसान सेतु)** is an agricultural procurement scheduling and tokenization platform built to eliminate Mandi traffic gridlocks, long queues, and arbitrary waiting periods for Indian farmers during harvest seasons.

It replaces uncoordinated truck and tractor arrivals with **capacity-aware time-slot booking** and generates **tamper-proof SHA-256 encrypted offline token passes** that Mandi Gate staff can verify instantly, even in zero-connectivity rural scenarios.

---

## 🎨 UI & Design Guidelines (Accessibility First)
Designed specifically for rural usability across varied age groups and lighting conditions:
- **Color Palette**: Neutral, clean, and accessible tones — slate grays (`#0f172a`, `#1e293b`), off-white canvas backgrounds (`#f8fafc`), soft charcoal text (`#1e293b`), and subtle muted green status accents (`#047857`, `#ecfdf5`). Overly bright and saturated colors have been intentionally avoided.
- **Typography & Sizing**: Extra-large, high-contrast typography (`text-lg`, `text-xl`, `text-2xl`) with clear Devanagari font rendering for rural readability.
- **Iconography**: Prominent Lucide React icons noticeably large (`w-8 h-8` / 28px–32px) with spacious tap padding (`min-height: 48px`) ensuring effortless touch on low-cost mobile displays.
- **Bilingual Support**: Direct, one-tap switcher between **हिंदी (Hindi - Default)** and **English**.

---

## 🏗️ Architecture & Tech Stack

```
KisanSetu/
├── backend/                       # Node.js + Express + TypeScript
│   ├── prisma/
│   │   ├── schema.prisma          # Part A: 5 Core Models & Enums
│   │   └── seed.ts                # Part C: Seed Script (3 Mandis, 10 Slots, Farmers)
│   ├── src/
│   │   ├── controllers/           # Capacity checks, booking transaction, token verifier
│   │   ├── routes/                # REST endpoints under /api/kisan-setu
│   │   ├── services/              # SHA-256 offline token encryption & QR payload service
│   │   ├── seedData.ts            # Realistic data fixtures
│   │   ├── dbStore.ts             # In-memory zero-config resilience layer
│   │   ├── prisma.ts              # PrismaClient singleton
│   │   └── index.ts               # Express entry point (Port 4000)
│   └── test-endpoints.js          # Automated smoke test suite
│
├── frontend/                      # Next.js 14 App Router + Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Part C: Accessible Root Layout & Language Context
│   │   │   ├── page.tsx           # Interactive Farmer Booking & Gate Scanner Dashboard
│   │   │   └── globals.css        # Accessible typography, focus rings, large touch targets
│   │   ├── components/
│   │   │   ├── Navbar.tsx         # Neutral branding, w-8 h-8 icons, language switcher
│   │   │   ├── BookingForm.tsx    # High-contrast slot booking & capacity progress bars
│   │   │   ├── TokenPassModal.tsx # Printable offline QR token receipt with SHA-256 hash
│   │   │   ├── MandiGateScanner.tsx # Gate staff token verifier & vehicle admission
│   │   │   └── HowItWorks.tsx     # SIH 26032 architectural explanation
│   │   ├── context/
│   │   │   └── LanguageContext.tsx # Hindi / English state manager
│   │   └── lib/
│   │       ├── translations.ts    # Complete bilingual rural dictionary
│   │       └── api.ts             # Typed API client
│   └── tailwind.config.ts
│
├── package.json                   # Root monorepo runner scripts
└── README.md
```

---

## 🗄️ Part A: Database Schema (`backend/prisma/schema.prisma`)

The Prisma schema defines 5 comprehensive models with relations:

1. **`Farmer`**:
   - `id`: Unique identifier (CUID)
   - `aadhaarHash`: Cryptographically hashed Aadhaar string (Unique)
   - `name`: Farmer full name
   - `phone`: Mobile number for SMS alerts
   - `language`: Preferred language (Default `'hi'`)
   - `landSize`: Landholding size in acres (Float)
   - `locationVillage`: Village and district location
   - Relations: `bookings Booking[]`

2. **`ProcurementCenter`**:
   - `id`: Unique identifier
   - `name`: Procurement center / Mandi name
   - `locationLat`: Latitude
   - `locationLng`: Longitude
   - `weighbridgeCount`: Number of operational weighbridge scales
   - `hourlyCapacity`: Max vehicle throughput per hour
   - Relations: `slots Slot[]`

3. **`Slot`**:
   - `id`: Unique identifier
   - `centerId`: Foreign key to `ProcurementCenter`
   - `date`: Scheduled arrival date (Format: `YYYY-MM-DD`)
   - `timeWindow`: Time bracket (e.g., `'09:00-10:00'`)
   - `maxCapacity`: Max vehicles allowed in this window
   - `bookedCount`: Currently confirmed reservations
   - Relations: `center ProcurementCenter`, `bookings Booking[]`
   - Constraints: `@@unique([centerId, date, timeWindow])`

4. **`Booking`**:
   - `id`: Unique booking identifier
   - `farmerId`: Foreign key to `Farmer`
   - `slotId`: Foreign key to `Slot`
   - `vehicleType`: Enum (`TRACTOR`, `BULLOCK_CART`, `TRUCK`)
   - `cropType`: Crop name (Wheat, Paddy, Mustard, Gram)
   - `estimatedWeight`: Declared load in quintals
   - `tokenHash`: Unique 64-char SHA-256 offline token string
   - `status`: Enum (`BOOKED`, `STAGING`, `MANDI_GATE`, `COMPLETED`, `CANCELLED`)
   - `createdAt`: Timestamp of booking
   - Relations: `farmer Farmer`, `slot Slot`, `qualityInspection QualityInspection?`

5. **`QualityInspection`**:
   - `id`: Inspection certificate ID
   - `bookingId`: One-to-one foreign key to `Booking`
   - `moistureLevel`: Measured grain moisture percentage
   - `dockageGrade`: Assessed quality grade (e.g., Grade A)
   - `approvedWeight`: Net weighbridge weighment
   - `totalPayout`: Calculated financial payout (INR)
   - `inspectorId`: Authorized Mandi officer ID
   - `verifiedAt`: Inspection timestamp

---

## 📡 Part B: Express REST API (`/api/kisan-setu`)

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/kisan-setu/centers` | Lists all procurement centers with weighbridge count and active slot counts. |
| `GET` | `/api/kisan-setu/slots/available?centerId=&date=` | Retrieves slots for a given center and date, calculating live remaining capacity and availability. |
| `POST` | `/api/kisan-setu/bookings` | Atomically validates capacity, reserves a slot, increments `bookedCount`, and generates a deterministic **SHA-256 encrypted offline token string**. |
| `GET` | `/api/kisan-setu/bookings/token/:tokenHash` | Verifies a SHA-256 token string for Mandi Gate security scanners and returns full booking, farmer, and vehicle details. |
| `PATCH`| `/api/kisan-setu/bookings/:id/status` | Updates vehicle gate status (`MANDI_GATE`, `STAGING`, `COMPLETED`). |
| `GET` | `/api/kisan-setu/farmers` | Returns mock farmer profiles for demonstration. |

### Sample POST `/api/kisan-setu/bookings` Payload:
```json
{
  "farmerId": "farmer-01",
  "slotId": "slot-01",
  "vehicleType": "TRACTOR",
  "cropType": "गेहूं (Wheat)",
  "estimatedWeight": 45.0
}
```

### Sample Response:
```json
{
  "success": true,
  "message": "Booking created successfully with SHA-256 offline token",
  "data": {
    "booking": {
      "id": "booking-172538...",
      "status": "BOOKED",
      "tokenHash": "557794432972540670A9BEF5716A06B741B209A7EECB1511E7E7CDB0664A3550"
    },
    "token": {
      "tokenHash": "557794432972540670A9BEF5716A06B741B209A7EECB1511E7E7CDB0664A3550",
      "qrPayload": "{\"app\":\"KISAN_SETU\",\"th\":\"557794...\"}",
      "algorithm": "SHA-256"
    }
  }
}
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **npm** or **pnpm**

### 2. Run Backend
```bash
cd backend
npm install
npx prisma generate
npm run dev
# Server will start on http://localhost:4000
```
*To run automated API tests:*
```bash
npm run test
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
# Next.js will launch on http://localhost:3000
```

### 4. Or Run Both from Root
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

---

## 🔒 Offline SHA-256 Cryptographic Tokenization
In remote agricultural collection yards with intermittent or absent cellular networks:
1. When a farmer books a slot, the system generates a 64-character SHA-256 digest encoding the farmer's verified Aadhaar hash, procurement center ID, vehicle type, crop parameters, and a timestamp.
2. The pass is printed or displayed on mobile as a high-density QR code.
3. Mandi gate scanners compute the cryptographic digest offline; if the hash matches the QR payload and schedule, the vehicle is admitted into the staging yard without waiting for live cloud synchronization.
