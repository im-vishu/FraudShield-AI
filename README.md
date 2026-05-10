# FraudShield AI - India Fraud Watch Platform

FraudShield AI is a modern **fraud monitoring** platform with a polished admin/analyst UI, persistent alert workflows, and rich report/transaction detail pages with **Mapbox trace visuals** and a demo **live trace** stream.

Live Demo: (add your deployed URL)

---

## Screenshots

Dashboard / Live Map

<p align="center">
  <img src="frontend/src/assets/screenshots/dashboard.png" alt="FraudShield AI Dashboard" width="900" />
</p>

Transaction Details / Live Trace

<p align="center">
  <img src="frontend/src/assets/screenshots/transaction-details.png" alt="Transaction Details" width="900" />
</p>

Report Detail / KPI + Overlay

<p align="center">
  <img src="frontend/src/assets/screenshots/report-details.png" alt="Report Details" width="900" />
</p>

---

## Features

- JWT authentication with roles: `ADMIN`, `ANALYST`, `USER`
- Persistent fraud alert actions:
  - Investigate / Dismiss / Resolve (stored in Postgres via Prisma)
  - Status workflow: `NEW` -> `INVESTIGATING` -> `RESOLVED` (or `DISMISSED`)
- Transactions:
  - List + detail page
  - Transaction trace rendered on Mapbox
  - Demo "Live Trace" via SSE stream
- Reports:
  - Reports list + report detail page
  - KPI summary + trace summary + Mapbox overlay
- Landing page 3D hero (Three.js via `@react-three/fiber` + `drei`)

---

## Tech Stack

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

## Project Structure (high-level)

```text
.
├─ backend/             # Express API (auth, alerts, reports, transactions, SSE)
├─ frontend/            # TanStack Start + Vite UI
└─ README.md
```

---

## Environment Variables

Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=pk.your_mapbox_public_token_here
```

Backend (`backend/.env`)

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

Note: `.env` files should not be committed.

---

## Setup & Development

Prerequisites:

- Node.js (recommended: latest LTS)
- Docker Desktop (recommended) for Postgres + Redis

1) Start Postgres + Redis

```powershell
cd C:\Projects\FraudShield-AI\backend
docker compose up -d
```

If you see an error like `failed to connect to the docker API` your Docker engine is not running. Start Docker Desktop and retry.

2) Apply Prisma migrations

```powershell
cd C:\Projects\FraudShield-AI\backend
npx prisma migrate deploy
```

3) Seed demo users (Admin + Analyst)

```powershell
cd C:\Projects\FraudShield-AI\backend
npm install
npm run seed:users
```

Demo logins (default password: `sentinel1234`):

- `admin@sentinel.io` / `sentinel1234`
- `analyst@sentinel.io` / `sentinel1234`

4) Run backend

```powershell
cd C:\Projects\FraudShield-AI\backend
npm run dev
```

API:

- `http://localhost:5000/api/health`
- `http://localhost:5000/api`

5) Run frontend

```powershell
cd C:\Projects\FraudShield-AI\frontend
npm install
npm run dev -- --port 3000 --host
```

Open: `http://localhost:3000`

---

## Troubleshooting

Mapbox says "token required":

1. Confirm `frontend/.env` contains `VITE_MAPBOX_TOKEN=pk...`
2. Restart the frontend dev server (Vite loads env vars at startup)

Backend returns "Route not found: /api":

- Ensure the backend is running on port 5000
- Open `http://localhost:5000/api` (root index route)

Backend won't start:

- You need Postgres running and reachable at `DATABASE_URL`
- You need Redis running at `REDIS_URL` (for local dev, Redis now has an in-memory fallback, but Postgres is still required)

---

## License

MIT

FraudShield AI © 2026 - Created by Vishant Chaudhary

