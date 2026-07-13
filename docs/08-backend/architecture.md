# Backend Microservices (Modular Monolith)

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Internal service boundaries mapped to Go packages.
**Related Documents:** [ADR-003](../18-decisions/ADR-003-modular-monolith.md)

## 1. MVP Decision

We build ONE Go binary with internal packages that behave like services (separate goroutine pools, separate Redis consumer groups) rather than multiple separately-deployed microservices.

**Why?** Real microservices need service discovery, separate Dockerfiles, network hops — that's 2 extra days of DevOps for zero demo value. The design doc will explicitly show how each package becomes an independently deployable service in Production.

## 2. Package Boundaries

| Package (MVP) | Prod Service Name | Purpose | Responsibilities |
|---|---|---|---|
| `gateway` | API Gateway | HTTP/WS entry, authZ | JWT validation, rate limiting, request validation, WS upgrade |
| `ingest` | Telemetry Service | accept telemetry | schema validate, XADD to `telemetry_events` |
| `txn` | Transaction Service | accept transactions | schema validate, XADD to `transaction_events`, sync-wait for verdict |
| `correlate` | Correlation Engine | core value-add | sliding window join, entity resolution, factor extraction |
| `risk` | Risk Engine | scoring | weighted formula, threshold decision |
| `quantum` | Quantum Scanner | crypto audit | scans mock endpoint registry, computes CBOM, HNDL classification |
| `explain` | AI/Explainability Svc | XAI + narrative | rule-based SHAP-style breakdown + Gemini narrative |
| `notify` | Notification Svc | fan-out | WS broadcast, (future: email/Slack) |
| `admin` | Admin Svc | config | threshold updates, seed data reset endpoint (demo reset button!) |

## 3. Communication Strategy

- **MVP:** In-process function calls between `gateway→ingest/txn` and Redis Streams between `ingest/txn → correlate → risk → explain → notify`. This provides a genuine async backbone story without network overhead.
- **Future Scalability:** Each package gets its own `main.go`, own Dockerfile, communicates over gRPC + real Kafka; horizontal scaling via Kubernetes HPA on consumer-group lag.
