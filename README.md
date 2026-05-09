# FraudShield AI (India Fraud Watch)

FraudShield AI is a real-time fraud monitoring dashboard + API for fintech transaction risk analysis.

This repo contains:

- `backend/`: Express + Prisma + Postgres + Redis + JWT auth + fraud scoring + alert workflows
- `frontend/`: TanStack Start (Vite) UI with Mapbox tracing + live transaction tracking

## Features

- JWT authentication with roles: `ADMIN`, `ANALYST`, `USER`
- Transactions API (list, analyze, details)
- Fraud alerts with persistent status workflow:
  - `NEW` -> `INVESTIGATING` -> `RESOLVED`
  - `DISMISSED` for triage
- Reports list + report detail page (KPI + Mapbox trace overlay)
- Transaction detail page with Mapbox trace + optional live trace streaming (SSE)
- Live dashboard "transaction tracking" stream (SSE) animated on the Mapbox map
- Landing page 3D hero (Three.js via `@react-three/fiber` + `drei`)

## Tech Stack

Backend:

- Node.js + Express
- PostgreSQL + Prisma
- Redis (pub/sub + recent alerts feed)
- JWT auth

Frontend:

- TanStack Start + Vite
- React Query
- Tailwind
- Mapbox GL
- Three.js (`@react-three/fiber`, `@react-three/drei`)

## Prerequisites

- Node.js (recommended: latest LTS)
- Docker Desktop (recommended) for Postgres + Redis
- A Mapbox public token (for maps): `VITE_MAPBOX_TOKEN`

## Quick Start (Recommended: Docker)

### 1) Start Postgres + Redis

From `backend/`:

```powershell
cd C:\Projects\FraudShield-AI\backend
docker compose up -d
```

### 2) Configure backend env

Edit `backend/.env` (defaults are already set for local docker-compose):

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`

Optional (enables better IP reputation/context signals):

- `ABUSEIPDB_API_KEY` (AbuseIPDB)
- `IPINFO_TOKEN` (ipinfo.io)

### 3) Apply Prisma migrations

```powershell
cd C:\Projects\FraudShield-AI\backend
npx prisma migrate deploy
```

### 4) Seed demo users (Admin + Analyst)

```powershell
cd C:\Projects\FraudShield-AI\backend
npm run seed:users
```

Demo logins (password is set by the seed script; default is `sentinel1234`):

- `admin@sentinel.io` / `sentinel1234`
- `analyst@sentinel.io` / `sentinel1234`

### 5) Start the backend

```powershell
cd C:\Projects\FraudShield-AI\backend
npm run dev
```

Health check:

- `GET http://localhost:5000/api/health`
- `GET http://localhost:5000/api`

### 6) Configure frontend env (Mapbox + API base)

Create `frontend/.env` (see `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=pk.your_mapbox_public_token_here
```

### 7) Start the frontend

```powershell
cd C:\Projects\FraudShield-AI\frontend
npm install
npm run dev -- --port 3000 --host
```

Open:

- `http://localhost:3000`

## Key Routes (Frontend)

- `/` landing
- `/login` sign in (email + password)
- `/signup` create account
- `/dashboard` overview + live map
- `/dashboard/transactions` list
- `/dashboard/transactions/:id` transaction details + trace + live trace mode
- `/dashboard/alerts` live alerts feed (admin/analyst only)
- `/dashboard/reports` reports list
- `/dashboard/reports/:id` report detail (KPI + map overlay)

Admin separation:

- Non-admin users do not see the Admin nav item.
- Admin routes require role `ADMIN`.

## Key APIs (Backend)

Base:

- `GET /api` (API index)
- `GET /api/health` (DB + Redis health)

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

Alerts (admin/analyst):

- `GET /api/alerts` (supports filters: `status`, `severity`, pagination)
- `GET /api/alerts/recent`
- `PATCH /api/alerts/:alertId/investigate`
- `PATCH /api/alerts/:alertId/dismiss` (optional `{ reason }`)
- `PATCH /api/alerts/:alertId/resolve`

Transactions:

- `POST /api/transactions/analyze`
- `GET /api/transactions`
- `GET /api/transactions/stream` (SSE: live dashboard traces)
- `GET /api/transactions/:id`
- `GET /api/transactions/:id/trace`
- `GET /api/transactions/:id/trace/stream` (SSE)

Reports:

- `GET /api/reports`
- `GET /api/reports/:id`

## Notes / Troubleshooting

- If you see "Mapbox token required", confirm you created `frontend/.env` and restarted the frontend dev server.
- If `npm run dev` for the backend exits immediately, it usually means Postgres or Redis is not running or `DATABASE_URL`/`REDIS_URL` is wrong.
- Large bundle warnings during `vite build` are expected due to `mapbox-gl` and router bundles.

