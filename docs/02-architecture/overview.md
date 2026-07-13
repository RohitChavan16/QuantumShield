# Architecture Overview

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** High-level system architecture and component interactions.
**Related Documents:** [Tech Stack](tech-stack.md), [ADR-001 (Scope)](../18-decisions/ADR-001-scope.md)

## 1. High-Level Architecture (MVP)

Below is the conceptual architecture designed for the MVP implementation.

```text
┌─────────────┐      ┌──────────────────┐      ┌───────────────────────┐
│ Event       │ HTTP │  API Gateway     │      │  React SOC Dashboard  │
│ Simulator   │─────▶│  (Go/Gin)        │◀────▶│  (WebSocket + REST)   │
│ (Go, cron)  │      │  :8080           │      └───────────────────────┘
└─────────────┘      └────────┬─────────┘
                              │ XADD
                    ┌─────────▼─────────┐
                    │ Redis Streams     │
                    │ telemetry_events  │
                    │ transaction_events│
                    └────┬──────────┬───┘
                         │          │
             ┌───────────▼──┐   ┌───▼────────────┐
             │ Correlation  │   │ Risk/Fraud     │
             │ Engine       │   │ Rule Engine    │
             │ (Go worker   │   │ (Go worker     │
             │  pool)       │   │  pool)         │
             └───────┬──────┘   └────────┬───────┘
                     │  XADD alerts_stream │
                     └──────────┬──────────┘
                                │
                    ┌───────────▼────────────┐
                    │ AI Explainability Svc  │
                    │ (Gemini API + rule SHAP)│
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │ WebSocket Broadcaster  │──▶ Dashboard (live)
                    │ + PostgreSQL persist   │
                    └────────────────────────┘

  Parallel: Quantum Scanner Service → scans mock TLS/cipher config → CBOM table → Dashboard
```

## 2. Key Architectural Decisions

The MVP architecture is tailored for a hackathon timeline while providing a clear path to production-grade deployment.

- **Event Bus:** Uses Redis Streams (`telemetry_events`, `transaction_events`) rather than a full Kafka cluster. (See [ADR-002](../18-decisions/ADR-002-event-bus.md))
- **Stream Processing:** Uses a Go worker pool with an in-memory sliding window, deferring Apache Flink to the future roadmap.
- **Risk Scoring:** Uses a transparent weighted-rule engine to evaluate domains, rather than a black-box ML model. (See [ADR-005](../18-decisions/ADR-005-risk-engine.md))
- **Entity Resolution:** Telemetry and transaction events share a seeded `endpoint_id` field for the MVP. (See [ADR-004](../18-decisions/ADR-004-entity-resolution.md))
- **Deployment:** The entire stack is configured to run via a single `docker compose up` command for demonstration purposes, minimizing moving parts. (See [ADR-003](../18-decisions/ADR-003-modular-monolith.md))

## 3. Data Flow

1. **Ingestion:** Security telemetry and transaction requests enter the API Gateway and are written to Redis Streams.
2. **Correlation:** The Correlation Engine (Go workers) reads from the streams, joining events by `endpoint_id` within a time window.
3. **Scoring:** The Risk Engine applies weighted logic to generate an aggregated risk score.
4. **Explanation:** The AI Explainability Service calls the Gemini API to produce a natural language summary of the risk factors.
5. **Broadcasting & Persistence:** The resulting alert is stored in PostgreSQL and broadcast to the React frontend via WebSocket for instant visibility.
