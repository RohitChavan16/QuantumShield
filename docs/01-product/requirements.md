# Requirements

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Functional and Non-Functional Requirements.
**Related Documents:** [Features](features.md)

## 1. Functional Requirements

Numbered, testable, and traceable to a feature.

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | System shall ingest cybersecurity telemetry events (auth, endpoint process, VPN, network) via a REST API | Must |
| FR-02 | System shall ingest transaction authorization requests via a REST API and return a decision (`ALLOW`/`HOLD`/`BLOCK`) synchronously | Must |
| FR-03 | System shall correlate telemetry events with transaction events for the same entity within a configurable sliding time window | Must |
| FR-04 | System shall compute a composite risk score using weighted contributions from multiple detection domains | Must |
| FR-05 | System shall generate a human-readable explanation for every alert, showing which factors contributed and their relative weight | Must |
| FR-06 | System shall persist all alerts with full context (factors, score, transaction, timestamps) for audit | Must |
| FR-07 | System shall push new alerts to connected dashboard clients in real time (<2s) via WebSocket | Must |
| FR-08 | System shall allow an analyst to change an alert's status (New → Investigating → Resolved/False Positive) | Must |
| FR-09 | System shall scan a registry of endpoints' TLS/cipher configuration and classify each as quantum-safe or not | Must |
| FR-10 | System shall display an aggregate cryptographic migration readiness percentage | Must |
| FR-11 | System shall detect at minimum: impossible travel, endpoint compromise correlation, velocity abuse, device drift, VPN/proxy risk, amount-out-of-profile | Must |
| FR-12 | System shall allow an admin to adjust risk score thresholds without redeploying | Should |
| FR-13 | System shall provide a reset endpoint to restore demo data to a known state | Should |
| FR-14 | System shall allow an analyst to ask a natural-language follow-up question about a specific alert | Should |
| FR-15 | System shall detect SIM swap, credential stuffing, new-device, and TOR-exit-node patterns | Should |
| FR-16 | System shall support case management with a simple workflow board | Could |
| FR-17 | System shall detect money-mule account rings via graph analysis | Won't (this phase) |

### 1.1 Out of Scope (Explicitly, to prevent scope creep)
- Real production ML model training (XGBoost/GNN) — we use a transparent, weighted rule engine by design (see ADR-005).
- Real Kafka/Flink cluster — architected for, not deployed (ADR-002).
- Real HSM/PQC cryptographic library integration — simulated/classified only (ADR-006).
- Multi-tenant / multi-bank support.
- Mobile app.

## 2. Non-Functional Requirements

| Category | Requirement | Target / Rationale |
|---|---|---|
| **Latency** | End-to-end correlation (event ingest → alert visible on dashboard) | < 1.5s p95 — must be visibly fast in a live demo |
| **Availability** | Demo environment uptime during judging window | 100% — mitigated via fallback video |
| **Explainability** | Every alert must show factor-level attribution | 100% of alerts, no exceptions |
| **Auditability** | Every state-changing action logged | All alert status changes + admin actions written to `audit_log` |
| **Resilience** | System must not crash if the Gemini API is unreachable | Deterministic fallback narrative generator — no single external dependency may break the core pipeline |
| **Reliability** | No event silently dropped on worker crash | Redis consumer groups + XAUTOCLAIM reclaim + dead-letter stream after 3 failed attempts |
| **Security** | All endpoints authenticated except login | JWT bearer, RBAC on admin routes |
| **Usability** | Analyst can understand an alert without reading code | Plain-language summary + visual attribution chart, not raw JSON |
| **Portability** | Full stack must boot on a judge's laptop | Single `docker compose up`, no cloud dependency required for demo |
| **Scalability** | Architecture must have a credible path to 10K+ TPS | Documented in ADR-002 / roadmap, not required to run at that scale in the MVP |
| **Maintainability** | Codebase must be understandable by a new teammate in <30 min | Enforced folder structure + coding standards |
