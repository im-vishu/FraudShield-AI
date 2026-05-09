# FraudShield AI - India Fraud Watch Platform 🎮⚡

FraudShield AI is a modern, high-performance **fraud monitoring** web app with a polished UI, persistent alert workflows, and rich report/transaction detail pages with **Mapbox trace visuals**.

🌐 **Live Demo:** (add your deployed URL)

---

## 📸 Screenshots

### 🏠 Dashboard / Live Map

<p align="center">
  <img src="frontend/src/assets/screenshots/dashboard.png" alt="FraudShield AI Dashboard" width="900" />
</p>

<br/>

### 🧭 Transaction Details / Live Trace

<p align="center">
  <img src="frontend/src/assets/screenshots/transaction-details.png" alt="Transaction Details" width="900" />
</p>

<br/>

### 📄 Report Detail / KPI + Overlay

<p align="center">
  <img src="frontend/src/assets/screenshots/report-details.png" alt="Report Details" width="900" />
</p>

---

## ✨ Features

- 🔐 **JWT Authentication** with roles: `ADMIN`, `ANALYST`, `USER`
- 🧾 **Transactions**
  - List transactions with filtering/search
  - Transaction detail page with Mapbox trace
  - Demo “Live Trace” mode via SSE
- 🚨 **Fraud Alerts (persistent)**
  - Investigate / Dismiss / Resolve actions persist in Postgres
  - Alert status workflow: `NEW` -> `INVESTIGATING` -> `RESOLVED` (or `DISMISSED`)
- 📊 **Reports**
  - Reports list + report detail page
  - KPI summary + trace summary + Mapbox overlay data
- 🛰️ **Live transaction tracking**
  - Backend SSE stream (`/api/transactions/stream`) animates trace movement on the dashboard map
- 🧊 **3D Landing Hero**
  - Three.js scene via `@react-three/fiber` + `drei`

---

## 🧰 Tech Stack

Backend:

- Node.js + Express
- PostgreSQL + Prisma
- Redis (pub/sub + recent alerts feed)
- JWT auth

Frontend:

- React + TypeScript
- TanStack Start + Vite
- React Query
- Tailwind CSS
- Mapbox GL
- Three.js (`@react-three/fiber`, `@react-three/drei`)

---

## 🗂️ Project Structure (high-level)

```text
.
├─ backend/             # Express API (auth, alerts, reports, transactions, SSE)
├─ frontend/            # TanStack Start + Vite UI
└─ README.md
```

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=pk.your_mapbox_public_token_here
```

### Backend (`backend/.env`)

Required:

```env
PORT=5000
DATABASE_URL=postgresql://fraudshield_user:fraudshield_password@localhost:5432/fraudshield_db?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace_this_with_a_strong_secret_key
JWT_EXPIRES_IN=7d
```

Optional (enables richer IP reputation/context signals):

```env
ABUSEIPDB_API_KEY=
IPINFO_TOKEN=
```

✅ `.env` files should not be committed.

---

## 🚀 Setup & Development

### ✅ Prerequisites

- Node.js (recommended: latest LTS)
- Docker Desktop (recommended) for Postgres + Redis

### 1) Start Postgres + Redis

```powershell
cd C:\Projects\FraudShield-AI\backend
docker compose up -d
```

### 2) Apply Prisma migrations

```powershell
cd C:\Projects\FraudShield-AI\backend
npx prisma migrate deploy
```

### 3) Seed demo users (Admin + Analyst)

```powershell
cd C:\Projects\FraudShield-AI\backend
npm install
npm run seed:users
```

Demo logins (default password `sentinel1234`):

- `admin@sentinel.io` / `sentinel1234`
- `analyst@sentinel.io` / `sentinel1234`

### 4) Run backend

```powershell
cd C:\Projects\FraudShield-AI\backend
npm run dev
```

Health:

- `http://localhost:5000/api/health`
- `http://localhost:5000/api`

### 5) Run frontend

```powershell
cd C:\Projects\FraudShield-AI\frontend
npm install
npm run dev -- --port 3000 --host
```

Open:

- `http://localhost:3000`

---

## 🐞 Troubleshooting

### Mapbox says “token required”

1. Confirm `frontend/.env` contains `VITE_MAPBOX_TOKEN=pk...`
2. Restart the frontend dev server (Vite reads env at startup)

### Backend won’t start

The backend waits for Postgres + Redis. Make sure Docker services are running:

```powershell
cd backend
docker compose up -d
```

---

## 📄 License

MIT

---

**FraudShield AI** © 2026 — Created by Vishant Chaudhary

