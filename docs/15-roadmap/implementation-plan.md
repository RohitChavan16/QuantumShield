# Implementation Plan (Day-by-Day)

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** 5-6 day sprint roadmap for the hackathon.

## Day 1 — Foundations
- **Morning:** Repo scaffolding (frontend/backend folders), Docker Compose skeleton (Postgres, Redis only), DB migrations run.
- **Afternoon:** Go gateway skeleton — health check route, JWT auth, `/ingest/telemetry` and `/transaction/authorize` accepting + validating + XADD-ing (no processing yet). Event simulator CLI producing mock events.
- **Night:** JSON schemas finalized and shared (contract-first); React app scaffolded with routing + dark theme shell + sidebar nav.
- **Deliverable:** Events flow from simulator → API → Redis Stream (visible via `redis-cli XREAD`).

## Day 2 — Correlation Core
- **Morning:** Sliding window struct + GC; consumer group worker reading both streams.
- **Afternoon:** Correlation matching logic with 3 initial fraud patterns wired; Risk Engine scoring formula + unit tests.
- **Night:** `alerts_stream` populated end-to-end; Postgres `alerts` table written on alert.
- **Deliverable:** `curl` a malicious telemetry event + transaction → row appears in `alerts` table.

## Day 3 — Explainability + Quantum
- **Morning:** Deterministic attribution breakdown; Gemini client + prompt + fallback.
- **Afternoon:** Quantum scanner service + CBOM table + seed data; remaining 3 fraud patterns.
- **Night:** WS hub + Redis pub/sub bridge; test live push to a WS test client (`wscat`).
- **Deliverable:** Alert with `ai_summary` populated, pushed live over WS.

## Day 4 — Frontend Build
- **Morning:** Fusion Dashboard — alert feed + KPI strip wired to real API+WS.
- **Afternoon:** Alert Detail drawer + SHAP bar chart + Attack Graph (React Flow) with mock/real data.
- **Night:** Quantum Dashboard + Executive Dashboard.
- **Deliverable:** Full dashboard renders live data end-to-end, no more mock frontend data.

## Day 5 — Polish, Scenarios, Resilience
- **Morning:** Build 2–3 canned "attack scenario" scripts in the simulator (button-triggerable from Settings). **Never rely on live random data.**
- **Afternoon:** Error/loading/empty states everywhere; WS reconnect logic; demo-reset endpoint; fix all console errors.
- **Night:** Record a fallback demo video (non-negotiable safety net); write README.
- **Deliverable:** Feature-complete, demo-rehearsed once end-to-end.

## Day 6 — Rehearsal & Pitch (If available)
- **Morning:** Full dry run with timer exactly as the pitch script; fix any rough edges.
- **Afternoon:** Slides finalized (architecture diagram, ROI chart, quantum differentiator); test on the actual presentation screen resolution.
- **Night:** Buffer for last-minute bugs. Team sleeps.
