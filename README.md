# QuantumShield

**AI-Driven Correlation of Cybersecurity Telemetry & Transactional Behaviour**

## Problem Statement Summary

Current SIEM and anti-fraud systems operate in silos, leading to alert fatigue and missed cross-domain threats. QuantumShield unifies cybersecurity telemetry (network, endpoint, IAM) with transactional data in real-time. By applying AI-driven correlation and quantum-safe cryptographic tracking (CBOMs), it detects sophisticated, multi-vector fraud campaigns that traditional isolated systems miss.

## Architecture
![alt text](image.png)
![alt text](image-1.png)
*See `docs/` for full architecture and Phase 1 product discovery documents.*

At a high level:
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Go, Gin
- **Database**: PostgreSQL (relational & timeseries via partitions)
- **Cache/Streams**: Redis

## Tech Stack

| Domain | Technology |
|---|---|
| Backend | Go 1.22+, Gin |
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| Database | PostgreSQL 17 |
| Messaging/Cache | Redis 7 |
| Containerization | Docker Compose |
| CI/CD | GitHub Actions |

## Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RohitChavan16/QuantumShield.git
   cd QuantumShield
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Frontend has its own config as well but reads backend URL
   ```

3. **Start the stack:**
   ```bash
   make up
   ```

4. **Verify Health:**
   - Backend API: `http://localhost:8080/healthz`
   - Readiness (DB check): `http://localhost:8080/readyz`
   - Frontend UI: `http://localhost:3000`

## Folder Structure

- `/backend` - Go REST API and correlation engine
- `/frontend` - React application
- `/docs` - Architecture and product discovery documentation
- `/.github/workflows` - CI pipelines

## Environment Variables

| Name | Purpose | Example Value | Required |
|---|---|---|---|
| `APP_ENV` | Application environment | `local`, `production` | Yes |
| `LOG_LEVEL` | Logging verbosity | `debug`, `info` | Yes |
| `SERVER_PORT` | Backend HTTP port | `8080` | Yes |
| `POSTGRES_DSN` | DB connection string | `postgres://user:pass@host:5432/db` | Yes |
| `REDIS_ADDR` | Redis connection | `redis:6379` | Yes |
| `VITE_API_URL` | Frontend API URL | `http://localhost:8080` | Yes |

## Development Workflow

- Follow the `main` branch structure. Create feature branches (`feat/feature-name`, `fix/bug-name`).
- We enforce **Conventional Commits** (see `CONTRIBUTING.md`).
- Run `make backend-test` and `make frontend-build` to verify changes.
- Run `make lint` for standard checks.

## Phase Status

- Phase 1: Product Discovery - Completed.
- Phase 2: Project Initialization - Completed (Scaffolding).
- Phase 3: Feature Development - Pending.

## Team

SentinelFuse Team - FineSpark Hackathon, Bank of Maharashtra.
