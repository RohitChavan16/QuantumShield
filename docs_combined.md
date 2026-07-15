# Features & Roadmap

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Feature list mapped to requirements, MVP/Production distinction, and success criteria.

## 1. Feature List

(Mapped to FR-ids and MVP/Prod/Future)

| # | Feature | FR | Tier | Judge Impact |
|---|---|---|---|---|
| 1 | Telemetry + Transaction ingest APIs | FR-01, FR-02 | MVP | Foundation |
| 2 | Sliding-window correlation engine | FR-03 | MVP | ðŸ”¥ðŸ”¥ðŸ”¥ core value prop |
| 3 | Weighted risk scoring | FR-04 | MVP | ðŸ”¥ðŸ”¥ |
| 4 | Explainability (attribution + Gemini narrative) | FR-05 | MVP | ðŸ”¥ðŸ”¥ðŸ”¥ |
| 5 | Real-time WS alert feed | FR-07 | MVP | ðŸ”¥ðŸ”¥ðŸ”¥ visual wow |
| 6 | Fusion Dashboard + Attack Graph | â€” | MVP | ðŸ”¥ðŸ”¥ðŸ”¥ |
| 7 | Quantum CBOM scanner + dashboard | FR-09, FR-10 | MVP | ðŸ”¥ðŸ”¥ðŸ”¥ differentiator |
| 8 | 6 core fraud detection patterns | FR-11 | MVP | ðŸ”¥ðŸ”¥ |
| 9 | Alert case status workflow | FR-08 | MVP | ðŸ”¥ |
| 10 | Configurable thresholds | FR-12 | Should | ðŸ”¥ shows maturity |
| 11 | Demo-reset endpoint | FR-13 | Should | operational |
| 12 | AI follow-up Q&A panel | FR-14 | Should | ðŸ”¥ðŸ”¥ |
| 13 | 4 additional fraud patterns (SIM swap, credential stuffing, etc.) | FR-15 | Should | ðŸ”¥ |
| 14 | Case management Kanban | FR-16 | Could | ðŸ”¥ |
| 15 | GNN money-mule detection | FR-17 | Future | mention only |
| 16 | Real Kafka/Flink pipeline | â€” | Future | mention only |
| 17 | Real PQC/HSM integration | â€” | Future | mention only |

## 2. MVP vs Production vs Future

| Layer | MVP (this hackathon) | Production | Future |
|---|---|---|---|
| Event bus | Redis Streams | Apache Kafka, partitioned | Multi-region Kafka |
| Stream processing | Go worker pool, in-memory sliding window | Apache Flink, RocksDB-backed state | Flink w/ exactly-once semantics |
| Risk scoring | Transparent weighted rule engine | Same engine + trained XGBoost hybrid | GNN for network-level fraud (mule rings) |
| Explainability | Deterministic additive attribution + Gemini narrative | Real SHAP `TreeExplainer` on trained model | Counterfactual explanations, NLG compliance reports |
| Entity graph | None (key-based lookup) | TigerGraph / Neo4j | Full multi-hop centrality analysis |
| Quantum module | Static config classification | Live TLS handshake introspection | HSM-backed key storage, CycloneDX CBOM export |
| Deployment | Docker Compose, single host | Kubernetes, HPA | Multi-region active-active |
| Data store | PostgreSQL + Redis | + ClickHouse for analytics | + Aerospike for sub-100ms feature cache |

> [!TIP]
> This table is the single most important artifact to have memorized before judge Q&A â€” every "why didn't you build X" question is answered by pointing at this row.

## 3. Success Criteria

### Technical Success (must all be true before Day 5 ends)
- [ ] A telemetry event + a correlated transaction event produce a visible alert in <1.5s, live, not pre-recorded.
- [ ] The alert's explanation is generated from real factor weights, not a hardcoded string.
- [ ] The quantum dashboard shows real data from the CBOM scan (not static mock JSON with no backend).
- [ ] The system survives a killed network connection to Gemini without crashing.
- [ ] `docker compose up` works on a machine that isn't the dev's own laptop (test this â€” a shockingly common hackathon failure).

### Product Success
- [ ] A judge can articulate, unprompted, what makes this different from "just another fraud detector" after the demo.
- [ ] The quantum angle is remembered as *the* differentiator in judge feedback.

### Competitive Success
- [ ] Shortlisted for the PPT/screening round.
- [ ] Score â‰¥ leading teams on "technical depth" and "problem-fit" evaluation axes specifically.
# User Personas and Journeys

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Target audience and core user workflows.

## 1. User Personas

### Persona 1 â€” Ananya, SOC Analyst
Monitors security alerts all day, drowning in false positives from disconnected tools. 
**Needs:** One screen, prioritized by real financial impact, that tells her *why* something matters, not just *that* something happened.

### Persona 2 â€” Rahul, Fraud Investigator
Reviews flagged transactions against SLA. 
**Needs:** Fast context (is this the customer traveling, or a compromised session?), one-click actions, defensible reasoning for every decision (regulatory audit).

### Persona 3 â€” Meera, Security Architect
Owns the bank's crypto posture and migration roadmap. 
**Needs:** A living inventory of what's quantum-vulnerable, not a one-time PDF audit, and a defensible number to report up to the CISO/board.

### Persona 4 â€” Vikram, Risk Executive
Cares about â‚¹ fraud prevented, false-positive trend, and regulatory compliance status â€” not architecture. 
**Needs:** Three big numbers and a trend line, nothing else.

### Persona 5 â€” The Judge
(Treat as a persona â€” it's the actual audience that matters most this week)
Evaluates: technical depth, problem-fit, feasibility, originality, presentation clarity, in ~5â€“8 minutes. 
**Needs:** To *see* the correlation happen live, understand the architecture in one diagram, and hear one thing no other team says (our answer: the quantum angle + honest additive explainability).

## 2. User Journeys

### Journey A â€” SOC Analyst detects and resolves a fused threat
1. Ananya opens the Fusion Dashboard, sees a CRITICAL alert slide in.
2. Clicks it â†’ Alert Detail drawer opens, shows correlation factors and the SHAP-style bar chart.
3. Reads the Gemini-generated summary â€” understands in one paragraph why this fired.
4. Asks the AI panel "has this endpoint done this before?" â€” gets a grounded answer.
5. Clicks **Block** â†’ transaction decision updates, audit log entry created, alert status â†’ Resolved.

### Journey B â€” Fraud Investigator triages a transaction
1. Rahul opens Transaction Explorer, sorts by risk score descending.
2. Sees a transaction with no correlated alert (transaction-only signal, lower confidence) vs one with a fused alert (higher confidence).
3. Understands instantly which one deserves his limited attention first â€” this *is* the false-positive reduction value prop, experienced as a UX moment.

### Journey C â€” Security Architect checks quantum posture
1. Meera opens Quantum Dashboard, sees migration readiness at 62%.
2. Sees the SWIFT link endpoint flagged NON-COMPLIANT, HIGH HNDL risk.
3. Clicks "Simulate ML-KEM Migration" â†’ watches readiness % climb, understands the tool as a *tracking* system, not a one-off scan.

### Journey D â€” Judge evaluates in 5 minutes
1. Sees architecture diagram (30s).
2. Watches a live attack scenario trigger â†’ alert appear â†’ get explained â†’ get blocked, with a visible sub-1.5s timer (90s).
3. Sees the Quantum Dashboard as the differentiator (30s).
4. Hears the false-positive-reduction number and compliance angle (30s).
5. Asks one hard question, gets a precise, honest answer distinguishing MVP from architected-future (remaining time).
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
| FR-08 | System shall allow an analyst to change an alert's status (New â†’ Investigating â†’ Resolved/False Positive) | Must |
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
- Real production ML model training (XGBoost/GNN) â€” we use a transparent, weighted rule engine by design (see ADR-005).
- Real Kafka/Flink cluster â€” architected for, not deployed (ADR-002).
- Real HSM/PQC cryptographic library integration â€” simulated/classified only (ADR-006).
- Multi-tenant / multi-bank support.
- Mobile app.

## 2. Non-Functional Requirements

| Category | Requirement | Target / Rationale |
|---|---|---|
| **Latency** | End-to-end correlation (event ingest â†’ alert visible on dashboard) | < 1.5s p95 â€” must be visibly fast in a live demo |
| **Availability** | Demo environment uptime during judging window | 100% â€” mitigated via fallback video |
| **Explainability** | Every alert must show factor-level attribution | 100% of alerts, no exceptions |
| **Auditability** | Every state-changing action logged | All alert status changes + admin actions written to `audit_log` |
| **Resilience** | System must not crash if the Gemini API is unreachable | Deterministic fallback narrative generator â€” no single external dependency may break the core pipeline |
| **Reliability** | No event silently dropped on worker crash | Redis consumer groups + XAUTOCLAIM reclaim + dead-letter stream after 3 failed attempts |
| **Security** | All endpoints authenticated except login | JWT bearer, RBAC on admin routes |
| **Usability** | Analyst can understand an alert without reading code | Plain-language summary + visual attribution chart, not raw JSON |
| **Portability** | Full stack must boot on a judge's laptop | Single `docker compose up`, no cloud dependency required for demo |
| **Scalability** | Architecture must have a credible path to 10K+ TPS | Documented in ADR-002 / roadmap, not required to run at that scale in the MVP |
| **Maintainability** | Codebase must be understandable by a new teammate in <30 min | Enforced folder structure + coding standards |
# Product Vision & Problem Analysis

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Project vision, problem breakdown, root cause analysis.
**Related Documents:** [Features](features.md), [Architecture Overview](../02-architecture/overview.md)

## 1. Product Vision

**Vision statement:**
> QuantumShield fuses cybersecurity telemetry with transactional behaviour in real time, so that an attack pattern invisible to a SIEM alone and invisible to a fraud engine alone becomes obvious the moment both signals are viewed together â€” explained in plain language, and extended to flag the bank's exposure to future quantum decryption risk.

**Why this vision, not a broader one:**
The problem statement explicitly asks for *correlation*, not "another fraud detector" or "another SIEM." Every team that misreads this brief will build one or the other. We are building the **join**, which is the actual gap named in the problem statement.

**One-sentence pitch:** 
*"Your SIEM sees the malware. Your fraud engine sees the transfer. Nobody sees they're the same attack â€” until now."*

**Elevator pitch (30s, for casual judge conversation):**
> "Banks run cybersecurity monitoring and fraud detection as two separate systems that never talk to each other. An attacker who compromises a bank employee's laptop and then initiates a wire transfer from it looks completely normal to the fraud engine â€” it's a valid session, valid credentials, valid transaction. QuantumShield correlates the endpoint compromise with the transaction in real time, explains exactly why it's suspicious, and blocks it â€” while also tracking which parts of the bank's encryption are vulnerable to future quantum decryption attacks. It's the missing link between security operations and fraud operations."

**What we are NOT building:**
A general-purpose SIEM, a general-purpose fraud ML platform, a production PQC migration tool. We are building the **correlation and explainability layer** that sits on top of / between those systems. Scoping this narrowly is itself a strategic decision â€” see [ADR-001](../18-decisions/ADR-001-scope.md).

## 2. Problem Analysis

### 2.1 The Core Problem, Decomposed

| Sub-problem | Why it exists today | Who suffers |
|---|---|---|
| Security telemetry and transaction data live in different systems with no shared schema or session context | Historical org silos: SOC teams own SIEM, fraud teams own transaction monitoring, procured from different vendors, on different timelines | Both teams â€” neither has the full picture |
| Rule-based fraud engines fire on transaction attributes alone (amount, velocity, geo) | These are the only signals available without cyber telemetry | Customers (false declines), bank (missed real fraud) |
| SOC alerts fire on endpoint/network anomalies alone, with no visibility into what the compromised session then did financially | EDR/SIEM tools have no concept of "bank account" or "transaction" | SOC analysts (alert fatigue, no financial context to prioritize) |
| Neither system can explain *why* in a way a human or regulator can audit | Legacy rule engines give binary flags; black-box ML gives none | Compliance officers, customers disputing declines |
| No visibility into cryptographic assets vulnerable to future quantum decryption (HNDL) | Nobody currently monitors this as an operational risk category at all | Long-term data confidentiality, regulatory readiness (DORA) |

### 2.2 Why this is hard (not just "hasn't been built yet")

1. **Entity resolution across domains** â€” a `device_id` in EDR logs and an `account_id` in the ledger aren't naturally the same key; you need a resolution layer.
2. **Latency budget** â€” correlation must happen before the transaction is authorized, not after, or it's just forensics. This means sub-second joins, not batch analytics.
3. **False positive cost is asymmetric** â€” blocking a legitimate â‚¹75,000 transfer has real customer/business cost, so correlation must *raise confidence*, not just *add more rules that fire more often*.
4. **Explainability is a regulatory requirement, not a nice-to-have** (GDPR Art. 22-style "right to explanation," RBI/DORA-style model governance expectations) â€” so whatever scores the risk must be able to show its work.

### 2.3 Root Cause Statement

> The correlation gap exists because cybersecurity and fraud systems are architected as **independent decision boundaries** rather than **contributors to one shared decision.** QuantumShield's core innovation is architectural, not algorithmic: a shared event bus + sliding-window entity join that lets both domains contribute to one score.
# Architecture Overview

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** High-level system architecture and component interactions.
**Related Documents:** [Tech Stack](tech-stack.md), [ADR-001 (Scope)](../18-decisions/ADR-001-scope.md)

## 1. High-Level Architecture (MVP)

Below is the conceptual architecture designed for the MVP implementation.

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Event       â”‚ HTTP â”‚  API Gateway     â”‚      â”‚  React SOC Dashboard  â”‚
â”‚ Simulator   â”‚â”€â”€â”€â”€â”€â–¶â”‚  (Go/Gin)        â”‚â—€â”€â”€â”€â”€â–¶â”‚  (WebSocket + REST)   â”‚
â”‚ (Go, cron)  â”‚      â”‚  :8080           â”‚      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜      â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                              â”‚ XADD
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚ Redis Streams     â”‚
                    â”‚ telemetry_events  â”‚
                    â”‚ transaction_eventsâ”‚
                    â””â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”˜
                         â”‚          â”‚
             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”   â”Œâ”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
             â”‚ Correlation  â”‚   â”‚ Risk/Fraud     â”‚
             â”‚ Engine       â”‚   â”‚ Rule Engine    â”‚
             â”‚ (Go worker   â”‚   â”‚ (Go worker     â”‚
             â”‚  pool)       â”‚   â”‚  pool)         â”‚
             â””â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜   â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜
                     â”‚  XADD alerts_stream â”‚
                     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                â”‚
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚ AI Explainability Svc  â”‚
                    â”‚ (Gemini API + rule SHAP)â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                â”‚
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚ WebSocket Broadcaster  â”‚â”€â”€â–¶ Dashboard (live)
                    â”‚ + PostgreSQL persist   â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

  Parallel: Quantum Scanner Service â†’ scans mock TLS/cipher config â†’ CBOM table â†’ Dashboard
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
# Tech Stack Justification

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Selected technologies and rationale.
**Related Documents:** [Architecture Overview](overview.md)

| Layer | Choice | Why (vs alternatives considered) |
|---|---|---|
| Frontend framework | React + TypeScript + Vite | Team fluency, fastest dev-server iteration loop for a time-boxed hackathon vs Next.js's SSR overhead we don't need |
| Styling | TailwindCSS | Fast to build a consistent dark enterprise theme without hand-rolled CSS; avoids design-system yak-shaving |
| Charts | Recharts | Simplest React-native charting API for bar/line/donut needs; D3 gives more control but costs more implementation time for marginal visual gain |
| Graph visualization | React Flow | Purpose-built for node/edge diagrams (our Attack Graph), far less boilerplate than raw D3 force layouts |
| Animation | Framer Motion | Declarative, integrates cleanly with React state for the "alert slides in" moment that sells the live-ness of the demo |
| Backend language | Go | Team's proven strength, excellent concurrency primitives (goroutines) for the worker-pool pattern this architecture fundamentally needs, fast compile/iteration, single static binary simplifies Docker |
| Web framework | Gin | Minimal overhead, mature middleware ecosystem, team familiarity |
| Event bus | Redis Streams | Provides equivalent semantics to Kafka (partitioned log, consumer groups, replay) with a fraction of the operational risk during a live demo |
| Primary DB | PostgreSQL | ACID guarantees needed for alert status workflow and audit log; native JSONB for flexible event payloads without a schema migration per new event type |
| Cache/session | Redis | Already in the stack for streams; reused for session cache and rate-limit counters â€” avoids adding a second cache technology |
| AI narrative | Gemini API | Free/cheap tier suitable for hackathon budget, strong structured-JSON output mode, fast enough for our latency budget with fallback in place |
| Containerization | Docker + Docker Compose | Single-command boot is a hard requirement for judge-machine portability; Kubernetes would be pure overhead for a 5-day, single-host demo |
| Auth | JWT (HS256) | Stateless, simple to implement correctly in the time available; RS256/OIDC deferred to Production |
# Database Design (PostgreSQL)

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Relational database schema for the MVP.

## 1. Schema Definition

```sql
-- Accounts
CREATE TABLE accounts (
  account_id      TEXT PRIMARY KEY,
  customer_id     TEXT NOT NULL,
  current_balance NUMERIC(14,2) DEFAULT 0,
  risk_tier       TEXT DEFAULT 'STANDARD',       -- STANDARD/ELEVATED/RESTRICTED
  created_at      TIMESTAMPTZ DEFAULT now(),
  account_status  TEXT DEFAULT 'ACTIVE'
);
CREATE INDEX idx_accounts_customer ON accounts(customer_id);

-- Registered devices / endpoints
CREATE TABLE devices (
  device_id       TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  canvas_hash     TEXT,
  os_fingerprint  TEXT,
  trust_score     REAL DEFAULT 1.0,
  last_login      TIMESTAMPTZ,
  is_compromised  BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_devices_user ON devices(user_id);

-- Telemetry events (append-only, partition-ready)
CREATE TABLE telemetry_events (
  event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts              TIMESTAMPTZ NOT NULL,
  endpoint_id     TEXT NOT NULL,
  event_type      TEXT NOT NULL,                 -- PROCESS_SPAWN/AUTH_FAIL/VPN_CONNECT/...
  process_name    TEXT,
  hash_sha256     TEXT,
  source_ip       TEXT,
  raw_payload     JSONB,
  created_at      TIMESTAMPTZ DEFAULT now()
) PARTITION BY RANGE (ts);
CREATE INDEX idx_telemetry_endpoint_ts ON telemetry_events(endpoint_id, ts DESC);

-- Transactions
CREATE TABLE transactions (
  transaction_id  TEXT PRIMARY KEY,
  sender_account  TEXT REFERENCES accounts(account_id),
  receiver_account TEXT,
  amount          NUMERIC(14,2) NOT NULL,
  currency        TEXT DEFAULT 'INR',
  endpoint_id     TEXT,                          -- links transaction to originating device (KEY correlation field)
  decision        TEXT,                           -- ALLOW/HOLD/BLOCK
  risk_score      INT,
  ts              TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_txn_sender_ts ON transactions(sender_account, ts DESC);
CREATE INDEX idx_txn_endpoint ON transactions(endpoint_id);

-- Fused alerts (the star table)
CREATE TABLE alerts (
  alert_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts              TIMESTAMPTZ DEFAULT now(),
  severity        TEXT NOT NULL,                  -- CRITICAL/HIGH/MEDIUM/LOW
  risk_score      INT NOT NULL,
  entity_id       TEXT NOT NULL,                  -- endpoint_id or account_id
  transaction_id  TEXT REFERENCES transactions(transaction_id),
  correlation_factors JSONB,                       -- ["EDR_COMPROMISE","IMPOSSIBLE_TRAVEL"]
  shap_attribution JSONB,                           -- {"factor":"weight"}
  ai_summary      TEXT,                             -- Gemini narrative
  status          TEXT DEFAULT 'NEW',              -- NEW/INVESTIGATING/RESOLVED/FALSE_POSITIVE
  created_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_alerts_status_ts ON alerts(status, ts DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);

-- Cryptographic Bill of Materials
CREATE TABLE cryptographic_assets (
  asset_id        TEXT PRIMARY KEY,
  endpoint_name   TEXT NOT NULL,
  tls_version     TEXT NOT NULL,
  cipher_suite    TEXT NOT NULL,
  is_pqc_hybrid   BOOLEAN DEFAULT FALSE,
  hndl_risk       TEXT DEFAULT 'HIGH',             -- LOW/MEDIUM/HIGH
  last_scanned    TIMESTAMPTZ DEFAULT now()
);

-- Audit log (compliance)
CREATE TABLE audit_log (
  id              BIGSERIAL PRIMARY KEY,
  actor           TEXT,
  action          TEXT,
  target_id       TEXT,
  ts              TIMESTAMPTZ DEFAULT now(),
  metadata        JSONB
);
```

## 2. Future Scaling

- `telemetry_events` is already declared `PARTITION BY RANGE(ts)` for monthly partitioning. 
- At scale (>10M rows/day), analytical workloads will move to ClickHouse. 
- `alerts` will remain in PostgreSQL because it is highly transactional and requires ACID guarantees for case management workflow.
# Redis Design

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Streams, Pub/Sub, and Caching architecture.
**Related Documents:** [ADR-002: Event Bus](../18-decisions/ADR-002-event-bus.md)

## 1. Streams

| Stream | Producers | Consumer Group | Purpose |
|---|---|---|---|
| `telemetry_events` | gateway | `correlation-cg` | raw cyber events |
| `transaction_events` | gateway | `correlation-cg` | raw txn events |
| `alerts_stream` | correlate | `explain-cg` | fused alerts needing narrative |
| `notify_stream` | explain | `notify-cg` | ready-to-broadcast alerts |

## 2. Keys & Cache

- `session:{session_id}` (Hash, TTL 30m) â€” Active session context.
- `window:{entity_id}` (Managed in-app, backed by ZSET `window:{entity_id}` scored by timestamp for O(log n) range queries, TTL 5m).
- `eps:counter` (INCR per event, read every 1s by dashboard poll â†’ resets via sliding counter).
- `cbom:cache` (String, TTL 60s) â€” Cached CBOM summary for fast dashboard load.

## 3. Pub/Sub

- **Channel:** `alerts:live`
- **Purpose:** The `explain-worker` publishes the finalized alert JSON to this channel; the gateway WS hub subscribes and fans out to all connected dashboard clients.

## 4. Consumer Groups / Worker Pools

- `correlation-cg` uses 8 consumers (goroutines) reading both streams.
- **Crash Recovery:** Uses `XAUTOCLAIM` every 10s to reclaim messages idle >30s.
- **Retry / DLQ:** On handler panic/error, message NOT XACK'd â†’ remains pending. After 3 claim attempts (tracked via a small Redis Hash `retry:{stream}:{id}`), the payload is moved to `dead_letter_stream` for manual inspection. 
- *Note:* The "Failed Events" count is displayed in the Settings page as a small but real reliability signal.
# Event Schemas (JSON)

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Core event structures flowing through the system.

> Keep all schemas in `pkg/jsonschema/*.json` and validate with `gojsonschema` on ingest boundary only. Do not over-validate in the hot path.

## 1. Telemetry Event

```json
{
  "event_id": "evt_10492810",
  "timestamp": "2026-07-12T10:30:00Z",
  "endpoint_id": "EP_TREASURY_04",
  "event_type": "PROCESS_SPAWN",
  "process_name": "mimikatz.exe",
  "hash_sha256": "8508197...c75c87a",
  "source_ip": "10.2.4.18",
  "user_id": "u_9921"
}
```

## 2. Transaction Event

```json
{
  "transaction_id": "tx_99182301",
  "sender_account_id": "ACC_8829102",
  "receiver_account_id": "ACC_0019283",
  "amount": 75000.00,
  "currency": "INR",
  "endpoint_id": "EP_TREASURY_04",
  "timestamp": "2026-07-12T10:30:05Z"
}
```

## 3. Fused Alert Event

```json
{
  "alert_id": "evt_alert_001",
  "risk_score": 850,
  "severity": "CRITICAL",
  "correlation_factors": [
    "EDR_COMPROMISE_PROCESS", 
    "AMOUNT_OUT_OF_PROFILE"
  ],
  "shap_attribution": {
    "edr_compromise": 0.42, 
    "vpn_proxy": 0.18, 
    "amount_deviation": 0.30, 
    "impossible_travel": 0.10
  },
  "ai_summary": "This transaction was blocked because...",
  "transaction_id": "tx_99182301"
}
```

## 4. Other Entities
Risk Score internal object, Quantum scan event, and Audit event follow the same JSON-first pattern.
# API Endpoints

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** REST endpoints for the MVP.
**Related Documents:** [API Standards](standards.md), [WebSocket Design](websocket.md)

All endpoints expect `Authorization: Bearer <JWT>` except `/auth/login`.  
Standard error shape: `{error: {code, message}}`.  
Validation uses `go-playground/validator` struct tags.

## 1. Auth

- `POST /api/v1/auth/login`
  - Body: `{username, password}`
  - Returns: `{token, role}` â€” `200` success, `401` unauthorized
- `GET /api/v1/auth/me`
  - Header: `Bearer <token>`
  - Returns: `{user_id, role}` â€” `200` success, `401` unauthorized

## 2. Telemetry Ingestion

- `POST /api/v1/ingest/telemetry`
  - Header: `Bearer <token>`
  - Body: Telemetry event schema (see [Schemas](../06-event-model/schemas.md))
  - Returns: `202 Accepted {event_id}` â€” `400` on schema failure

## 3. Transactions

- `POST /api/v1/transaction/authorize`
  - Headers: `Bearer <token>`, `Idempotency-Key`
  - Body: `{transaction_id, sender_account_id, receiver_account_id, amount, currency, endpoint_id}`
  - Returns: `200 {decision, risk_score, reasons[]}` â€” `409` on duplicate key, `422` on invalid account

## 4. Alerts

- `GET /api/v1/alerts?status=&severity=&limit=&cursor=`
  - Returns: `200 {alerts[], next_cursor}`
- `GET /api/v1/alerts/{id}`
  - Returns: `200` full alert including `shap_attribution` and `ai_summary`, `404` if not found
- `PATCH /api/v1/alerts/{id}`
  - Header: `Bearer <token>`
  - Body: `{status}`
  - Returns: `200` updated alert â€” `403` if not analyst role

## 5. Dashboard KPIs

- `GET /api/v1/dashboard/kpis`
  - Returns: `200 {eps, active_alerts, mttd_seconds, blocked_amount_today}`

## 6. Quantum / Compliance

- `GET /api/v1/compliance/cbom`
  - Returns: `200 {total_monitored_keys, vulnerable_classical_keys, compliant_hybrid_keys, migration_readiness_percentage}`
- `POST /api/v1/compliance/scan`
  - Header: `Bearer <admin_token>`
  - Returns: `202 Accepted` (triggers scan)

## 7. Analytics

- `GET /api/v1/analytics/false-positive-trend`
  - Returns: `200 {points:[{date, rate}]}`

## 8. Admin

- `POST /api/v1/admin/seed/reset`
  - *Critical for live re-runs between judge visits.* Resets demo data.
  - Returns: `200 OK`
- `PUT /api/v1/admin/thresholds`
  - Body: `{critical, high, medium}`
  - Returns: `200 OK`

## 9. AI Explainability

- `POST /api/v1/ai/ask`
  - Body: `{alert_id, question}`
  - Returns: `200 {answer}` (Gemini-grounded response)
# API Standards

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** API design, naming conventions, error structures.

- **Versioning:** All routes prefixed `/api/v1/` â€” breaking changes get a new version prefix, never an in-place breaking change.
- **Auth:** `Authorization: Bearer <JWT>` on every route except `POST /auth/login`.
- **Naming:** REST nouns, plural resources (`/alerts`, not `/getAlerts`); actions that aren't pure CRUD use a verb sub-resource (`/compliance/scan`, `/admin/seed/reset`).
- **Status codes:** 
  - `200` success w/ body
  - `202` accepted-async
  - `400` validation error
  - `401` unauthenticated
  - `403` unauthorized (role)
  - `404` not found
  - `409` conflict (idempotency key reuse)
  - `422` semantic validation failure (e.g. unknown account)
  - `500` unhandled â€” never leak stack traces in the response body.
- **Error shape (uniform across every endpoint):**
  ```json
  { 
    "error": { 
      "code": "VALIDATION_ERROR", 
      "message": "amount must be positive", 
      "field": "amount" 
    } 
  }
  ```
- **Idempotency:** All state-mutating POSTs that could be safely retried (e.g., `/transaction/authorize`) require an `Idempotency-Key` header.
- **Pagination:** Cursor-based (`?limit=&cursor=`), never offset-based, for the alerts list (append-heavy table).
- **Timestamps:** Always ISO-8601 UTC (`2026-07-13T10:30:00Z`) â€” never epoch, never local time, on the wire.
- **Response envelope:** Resource endpoints return the resource directly (not wrapped in `{data: ...}`) to keep frontend typing simple; list endpoints return `{items: [...], next_cursor}`.
# WebSocket Design

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Real-time event broadcasting to dashboard clients.

## 1. Connection Details

- **Endpoint:** `wss://<host>/ws?token=<jwt>`

## 2. Event Types

### Server â†’ Client
```json
{"type":"ALERT_NEW","payload":{...alert}}
{"type":"ALERT_UPDATED","payload":{"alert_id":"...","status":"INVESTIGATING"}}
{"type":"METRIC_TICK","payload":{"eps":142,"active_alerts":3}}
{"type":"SCAN_PROGRESS","payload":{"pct":60}}
```

### Client â†’ Server
```json
{"type":"SUBSCRIBE","payload":{"channel":"alerts"}}
{"type":"PING"}
```

## 3. Resilience & Heartbeat

- **Server behavior:** Sends `PING` every 20s.
- **Client behavior:** Must `PONG` within 5s or connection is closed.
- **Client hook:** Uses `useWebSocket` hook to reconnect with exponential backoff (1s â†’ 2s â†’ 4s â†’ max 10s) and shows a `ConnectionStatusPill` in the UI.

## 4. Broadcast Strategy

- A single in-memory `Hub` (map of client connections, mutex-guarded) fed by a Redis Pub/Sub subscriber goroutine.
- This lets you horizontally scale gateway pods in Production (each pod subscribes to the same Redis channel) without code changes.
# Backend Microservices (Modular Monolith)

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Internal service boundaries mapped to Go packages.
**Related Documents:** [ADR-003](../18-decisions/ADR-003-modular-monolith.md)

## 1. MVP Decision

We build ONE Go binary with internal packages that behave like services (separate goroutine pools, separate Redis consumer groups) rather than multiple separately-deployed microservices.

**Why?** Real microservices need service discovery, separate Dockerfiles, network hops â€” that's 2 extra days of DevOps for zero demo value. The design doc will explicitly show how each package becomes an independently deployable service in Production.

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

- **MVP:** In-process function calls between `gatewayâ†’ingest/txn` and Redis Streams between `ingest/txn â†’ correlate â†’ risk â†’ explain â†’ notify`. This provides a genuine async backbone story without network overhead.
- **Future Scalability:** Each package gets its own `main.go`, own Dockerfile, communicates over gRPC + real Kafka; horizontal scaling via Kubernetes HPA on consumer-group lag.
# Correlation Engine

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Core logic for the sliding-window entity join.

## 1. Event Ingestion

Both `telemetry_events` and `transaction_events` streams are consumed by the same worker pool via `XREADGROUP GROUP correlation-cg`.

## 2. Sliding Window Map

We maintain a per-entity (`endpoint_id`) in-memory structure:

```go
type Window struct {
    mu     sync.RWMutex
    events map[string][]TimestampedEvent // key: endpoint_id
}
// On insert: append event, then prune events older than 5*time.Minute
// GC ticker every 30s sweeps empty/expired entity keys
```

> **Why in-memory for MVP?** It provides sub-millisecond access and is simplest to demo reliably. In production, this will use Redis ZSET (`ZADD window:{id} ts event_json`, `ZRANGEBYSCORE` for window query) so state survives pod restarts and scales horizontally.

## 3. Matching Logic (Pseudocode)

```python
on TransactionEvent(t):
    recent = window.Get(t.EndpointID, last=5min)
    factors = []
    
    for e in recent:
        if e.Type == "PROCESS_SPAWN" and isKnownMalwareHash(e.Hash):
            factors.append("EDR_COMPROMISE_PROCESS", weight=0.40)
        if e.Type == "VPN_CONNECT" and e.SourceIP.IsHighRiskASN():
            factors.append("VPN_PROXY", weight=0.15)
        if e.Type == "AUTH_FAIL" and countRecentFails(recent) >= 3:
            factors.append("CREDENTIAL_STUFFING", weight=0.20)
            
    if t.Amount > profileAvg(t.SenderAccount) * 3:
        factors.append("AMOUNT_OUT_OF_PROFILE", weight=0.25)
    if geoDistance(t.SourceIP, lastKnownLocation(t.SenderAccount)) implies impossible travel:
        factors.append("IMPOSSIBLE_TRAVEL", weight=0.30)

    if len(factors) > 0:
        score = RiskEngine.Score(factors)
        if score.Value >= threshold.Medium:
            XADD alerts_stream {factors, score, transaction_id}
```

## 4. False Positive Reduction Mechanism

**Confidence Formula:** `confidence = min(1.0, num_corroborating_domains / 2)`

An alert triggered by BOTH a cyber signal AND a transaction signal gets a confidence of `1.0`. Single-domain-only signals are suppressed or downgraded to LOW. This is the direct implementation of the "reduces false positives" requirement.

## 5. Flowchart
`Event In â†’ Window Lookup â†’ Factor Extraction â†’ â‰¥1 factor? â†’ Risk Engine â†’ Score â‰¥ threshold? â†’ Alert Out â†’ else Drop (ACK, no alert)`
# Backend Go Folder Structure

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Directory layout for the Go backend.
**Related Documents:** [Coding Standards](../17-contributing/coding-standards.md)

```text
backend/
â”œâ”€â”€ cmd/
â”‚   â”œâ”€â”€ server/main.go                  # boots gateway + all workers in one process (MVP)
â”‚   â””â”€â”€ simulator/main.go               # standalone attack-scenario event generator
â”œâ”€â”€ internal/
â”‚   â”œâ”€â”€ gateway/
â”‚   â”‚   â”œâ”€â”€ router.go                   # gin.Engine setup, route registration
â”‚   â”‚   â”œâ”€â”€ middleware/
â”‚   â”‚   â”‚   â”œâ”€â”€ auth.go                 # JWT middleware
â”‚   â”‚   â”‚   â”œâ”€â”€ ratelimit.go            # token bucket per-IP
â”‚   â”‚   â”‚   â”œâ”€â”€ cors.go
â”‚   â”‚   â”‚   â””â”€â”€ logging.go              # structured request logs
â”‚   â”‚   â””â”€â”€ handlers/
â”‚   â”‚       â”œâ”€â”€ telemetry_handler.go
â”‚   â”‚       â”œâ”€â”€ transaction_handler.go
â”‚   â”‚       â”œâ”€â”€ alerts_handler.go
â”‚   â”‚       â”œâ”€â”€ cbom_handler.go
â”‚   â”‚       â”œâ”€â”€ auth_handler.go
â”‚   â”‚       â””â”€â”€ ws_handler.go
â”‚   â”œâ”€â”€ ingest/
â”‚   â”‚   â””â”€â”€ validator.go                # JSON schema validation for telemetry
â”‚   â”œâ”€â”€ txn/
â”‚   â”‚   â””â”€â”€ validator.go
â”‚   â”œâ”€â”€ correlate/
â”‚   â”‚   â”œâ”€â”€ engine.go                   # main correlation loop, XREADGROUP consumer
â”‚   â”‚   â”œâ”€â”€ window.go                   # sliding window data structure (map+mutex+TTL GC)
â”‚   â”‚   â”œâ”€â”€ rules.go                    # correlation rule definitions
â”‚   â”‚   â””â”€â”€ entity_resolver.go          # maps device_id/user_id/account_id together
â”‚   â”œâ”€â”€ risk/
â”‚   â”‚   â”œâ”€â”€ scorer.go                   # weighted formula implementation
â”‚   â”‚   â”œâ”€â”€ fraud_patterns.go           # 14 fraud pattern detectors
â”‚   â”‚   â””â”€â”€ thresholds.go
â”‚   â”œâ”€â”€ quantum/
â”‚   â”‚   â”œâ”€â”€ scanner.go
â”‚   â”‚   â”œâ”€â”€ cipher_registry.go          # quantum-safe cipher allowlist
â”‚   â”‚   â””â”€â”€ cbom.go
â”‚   â”œâ”€â”€ explain/
â”‚   â”‚   â”œâ”€â”€ shap_approx.go              # deterministic rule-weight breakdown
â”‚   â”‚   â”œâ”€â”€ gemini_client.go            # Gemini API wrapper + prompt templates
â”‚   â”‚   â””â”€â”€ narrative.go
â”‚   â”œâ”€â”€ notify/
â”‚   â”‚   â””â”€â”€ broadcaster.go              # Redis pub/sub â†’ WS hub fan-out
â”‚   â”œâ”€â”€ streams/
â”‚   â”‚   â”œâ”€â”€ client.go                   # Redis client wrapper (go-redis)
â”‚   â”‚   â”œâ”€â”€ producer.go                 # XADD helpers
â”‚   â”‚   â””â”€â”€ consumer.go                 # XREADGROUP + XACK + XAUTOCLAIM helpers (stalled msg recovery)
â”‚   â”œâ”€â”€ store/
â”‚   â”‚   â”œâ”€â”€ postgres.go                 # pgx pool init
â”‚   â”‚   â”œâ”€â”€ alerts_repo.go
â”‚   â”‚   â”œâ”€â”€ transactions_repo.go
â”‚   â”‚   â”œâ”€â”€ accounts_repo.go
â”‚   â”‚   â””â”€â”€ cbom_repo.go
â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”œâ”€â”€ telemetry.go
â”‚   â”‚   â”œâ”€â”€ transaction.go
â”‚   â”‚   â”œâ”€â”€ alert.go
â”‚   â”‚   â””â”€â”€ cbom.go
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â””â”€â”€ config.go                   # env var loading (viper or plain os.Getenv)
â”‚   â””â”€â”€ ws/
â”‚       â””â”€â”€ hub.go                      # WS client registry + broadcast
â”œâ”€â”€ migrations/
â”‚   â”œâ”€â”€ 0001_init.sql
â”‚   â””â”€â”€ 0002_cbom.sql
â”œâ”€â”€ pkg/
â”‚   â””â”€â”€ jsonschema/                     # shared schema validation utils
â”œâ”€â”€ docker/
â”‚   â””â”€â”€ Dockerfile
â”œâ”€â”€ go.mod
â””â”€â”€ go.sum
```

> **Note:** We are leveraging the battle-tested Redis Streams `XADD/XREADGROUP/XAUTOCLAIM` patterns previously built (e.g., in BenchForge) for stalled-message recovery and consumer group management.
# Fraud Detection Patterns

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Core patterns detected by the Risk Engine.

> **Hackathon Scope:** We are building 6 core patterns for the MVP, stubbing 2 for the demo, and listing the rest as Future/Roadmap.

## MVP Implementation (Build Live)

| Pattern | Logic | Data Needed | Risk Weight |
|---|---|---|---|
| **Impossible Travel** | Haversine distance between last 2 known IP-geolocations / time delta > max plausible speed | `source_ip` geoIP, `last_login` | 0.30 |
| **EDR Host Compromise Hold** | Known-bad process hash in window before txn | telemetry hash | 0.40 |
| **Velocity Abuse** | >N transactions from same account in sliding 60s window | transaction stream count | 0.20 |
| **Device Drift** | `canvas_hash` differs from last 3 known hashes for user | `devices` table | 0.15 |
| **VPN/Proxy Risk** | Source IP ASN in known VPN/proxy range (mock static list) | telemetry `source_ip` | 0.15 |
| **Amount-Out-of-Profile** | Amount > 3Ã— rolling 30-day average for account | transactions history | 0.25 |

## Stubbed (Hardcoded for Demo)

| Pattern | Logic | Data Needed | Risk Weight |
|---|---|---|---|
| **SIM Swap Lock** | Mock carrier API returns recent SIM change flag | mocked external field | 0.30 |
| **Session Hijack** | UA fingerprint mismatch mid-session | session cache | N/A |

## Future (Roadmap)

| Pattern | Logic | Data Needed | Risk Weight |
|---|---|---|---|
| **Money Mule (GNN)** | Account receives+forwards within 10 min, shared device with N other accounts | graph query | N/A |
| **Credential Stuffing** | â‰¥3 auth fails then success within 2 min | auth log stream | 0.20 |
| **Insider Threat** | Off-hours DB query + ledger change | DB audit log | N/A |
| **New Device** | `device_id` not in `registered_devices` | `devices` table | 0.10 |
| **TOR Exit Node** | Source IP in TOR exit list | telemetry | 0.15 |
| **Behavior Change** | Navigation path deviates from typical session graph | session history | N/A |
# Risk Engine

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Transparent weighted-rule scoring logic.
**Related Documents:** [ADR-005](../18-decisions/ADR-005-risk-engine.md)

## 1. Weighted Formula

```text
R_score = (w_authÂ·S_auth + w_endpointÂ·S_endpoint + w_velocityÂ·S_velocity + w_amountÂ·S_amount) Ã— confidence_multiplier
```

**Default weights:** 
- `w_auth` = 0.25
- `w_endpoint` = 0.35 (Endpoint compromise is the strongest, rarest signal)
- `w_velocity` = 0.20
- `w_amount` = 0.20

**Adaptive Weights:** If `S_auth` factor already fired (e.g. VPN detected), `w_auth` is boosted 1.5Ã— for that scoring pass. This mirrors the "dynamic weight adjustment" pattern.

## 2. Thresholds

Thresholds are configurable via `/admin/thresholds` and can be adjusted live in the Settings page.
- **Critical:** `â‰¥ 800`
- **High:** `600 - 799`
- **Medium:** `400 - 599`
- **Low:** `< 400`

## 3. False Positive Reduction

The confidence multiplier is the actual false positive reduction mechanism. Single-signal alerts get `0.5Ã—` score, while multi-domain corroborated alerts get `1.0Ã—`.

> **Demo strategy:** Show a before/after chart on the Executive Dashboard comparing the "rule-only false positive rate" (~40%) vs the "fused correlation rate" (~12%). 

## 4. Future ML Integration

In production, the `RiskEngine.Score()` internals can be swapped for an XGBoost model call via a small Python sidecar (Flask+ONNX). Because the architecture isolates scoring behind a clean `RiskEngine` interface, this will be a drop-in replacement, not a rewrite.
# Frontend Folder Structure

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Directory layout for the React (Vite) frontend.

```text
frontend/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ main.tsx
â”‚   â”œâ”€â”€ App.tsx
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â””â”€â”€ router.tsx                 # React Router route table
â”‚   â”œâ”€â”€ layouts/
â”‚   â”‚   â”œâ”€â”€ AppShell.tsx                # sidebar + topbar wrapper
â”‚   â”‚   â””â”€â”€ AuthLayout.tsx
â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ FusionDashboard/
â”‚   â”‚   â”‚   â”œâ”€â”€ index.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ AlertFeed.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ AttackGraph.tsx
â”‚   â”‚   â”‚   â””â”€â”€ KpiStrip.tsx
â”‚   â”‚   â”œâ”€â”€ AlertDetail/index.tsx
â”‚   â”‚   â”œâ”€â”€ ThreatTimeline/index.tsx
â”‚   â”‚   â”œâ”€â”€ TransactionExplorer/index.tsx
â”‚   â”‚   â”œâ”€â”€ QuantumDashboard/index.tsx
â”‚   â”‚   â”œâ”€â”€ AiInvestigation/index.tsx
â”‚   â”‚   â”œâ”€â”€ ExecutiveDashboard/index.tsx
â”‚   â”‚   â”œâ”€â”€ CaseManagement/index.tsx
â”‚   â”‚   â””â”€â”€ Settings/index.tsx
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ ui/                         # shadcn-style primitives: Button, Card, Badge, Drawer, Tooltip
â”‚   â”‚   â”œâ”€â”€ charts/
â”‚   â”‚   â”‚   â”œâ”€â”€ ShapBarChart.tsx
â”‚   â”‚   â”‚   â”œâ”€â”€ SeverityDonut.tsx
â”‚   â”‚   â”‚   â””â”€â”€ FalsePositiveTrend.tsx
â”‚   â”‚   â”œâ”€â”€ AlertCard.tsx
â”‚   â”‚   â”œâ”€â”€ RiskBadge.tsx
â”‚   â”‚   â”œâ”€â”€ LiveEpsCounter.tsx
â”‚   â”‚   â””â”€â”€ ConnectionStatusPill.tsx
â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”œâ”€â”€ useWebSocket.ts             # reconnect w/ exponential backoff
â”‚   â”‚   â”œâ”€â”€ useAlerts.ts                # React Query wrapper
â”‚   â”‚   â””â”€â”€ useLiveMetrics.ts
â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”œâ”€â”€ api.ts                      # axios/fetch instance, base URL, interceptors
â”‚   â”‚   â”œâ”€â”€ alerts.service.ts
â”‚   â”‚   â”œâ”€â”€ transactions.service.ts
â”‚   â”‚   â”œâ”€â”€ quantum.service.ts
â”‚   â”‚   â””â”€â”€ ai.service.ts
â”‚   â”œâ”€â”€ types/
â”‚   â”‚   â”œâ”€â”€ alert.types.ts
â”‚   â”‚   â”œâ”€â”€ transaction.types.ts
â”‚   â”‚   â”œâ”€â”€ telemetry.types.ts
â”‚   â”‚   â””â”€â”€ cbom.types.ts
â”‚   â”œâ”€â”€ contexts/
â”‚   â”‚   â””â”€â”€ WebSocketContext.tsx
â”‚   â”œâ”€â”€ providers/
â”‚   â”‚   â””â”€â”€ QueryProvider.tsx           # React Query client provider
â”‚   â”œâ”€â”€ store/
â”‚   â”‚   â””â”€â”€ uiStore.ts                  # zustand: filters, selected alert, theme
â”‚   â”œâ”€â”€ constants/
â”‚   â”‚   â”œâ”€â”€ severity.ts
â”‚   â”‚   â””â”€â”€ routes.ts
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”œâ”€â”€ formatCurrency.ts
â”‚   â”‚   â”œâ”€â”€ formatRelativeTime.ts
â”‚   â”‚   â””â”€â”€ riskColor.ts
â”‚   â””â”€â”€ styles/
â”‚       â””â”€â”€ globals.css                 # Tailwind base + CSS vars
â”œâ”€â”€ index.html
â”œâ”€â”€ vite.config.ts
â”œâ”€â”€ tailwind.config.ts
â”œâ”€â”€ tsconfig.json
â””â”€â”€ package.json
```
# Frontend Pages

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Core UI screens for the React dashboard.

**Global shell:** Dark theme (navy `#0B0F1A` bg, cyan `#22D3EE` accent, red `#EF4444` critical, amber `#F59E0B` high), sidebar navigation, and a top bar with a live EPS counter + system health pill.

---

## 1. Fusion Dashboard (SOC Analyst) 
*(Primary Demo Screen)*

- **Purpose:** Unified live view correlating cyber + transaction alerts.
- **Components:**
  - **Live Alert Feed (Left, 40%):** Scrolling cards, color-coded by severity, auto-scroll-pause-on-hover, new-alert slide-in animation.
  - **Attack Path Graph (Right, 60%):** React Flow canvas showing `Endpoint â†’ User â†’ Account â†’ Recipient` nodes. Edges pulse red when a live alert traverses that path.
  - **Top KPI strip:** EPS (events/sec), Active Alerts, MTTD (mocked calculated), Blocked Amount (â‚¹).
  - **Filters:** severity, entity type, time range.
  - **States:** 
    - Empty: "No correlated threats â€” monitoring 3 streams" with pulsing radar icon.
    - Loading: skeleton cards.
    - Error: WS disconnected banner with auto-reconnect countdown.
- **Actions:** Click alert card â†’ opens Alert Detail drawer (slide from right).

## 2. Alert Detail Drawer
- Correlation factors list (chips: "EDR Compromise", "Impossible Travel").
- SHAP-style horizontal bar chart (Recharts) of factor contribution %.
- Gemini-generated natural-language summary paragraph.
- Action buttons: Approve / Block / Escalate / Mark False Positive.
- Raw JSON toggle (to show real payload).

## 3. Threat Timeline
- Horizontal time-series (Recharts `ComposedChart`) of an entity's events (auth, endpoint, transaction) plotted on one axis to visually show the attack chain.

## 4. Transaction Explorer (Fraud Analyst)
- Table (sortable/filterable) of all transactions with `risk_score` column (color heatmap).
- Row click opens Alert Detail drawer if correlated, else a basic transaction card.
- Bulk actions toolbar.

## 5. Attack Graph (Full Screen)
- React Flow, force-directed layout. Node types: Endpoint (laptop), User (person), Account (bank), External IP (globe).
- Click node â†’ side panel with entity risk history.

## 6. Quantum Risk Dashboard 
*(Secondary Differentiator)*
- **Donut chart:** % RSA-2048 vs % ECDHE-X25519 vs % ML-KEM-768 hybrid across scanned endpoints.
- **HNDL Risk gauge:** LOW/MEDIUM/HIGH per endpoint category.
- **Vulnerability feed:** "sess_02 using ECDHE-RSA-AES256 â€” NON-COMPLIANT, recommend ML-KEM upgrade."
- **Migration readiness %:** Progress bar (big number, judge-friendly).
- **Action:** "Run Compliance Scan" button (triggers quantum-scanner manually, animates progress).

## 7. AI Investigation Panel
- Chat-style panel allowing analysts to ask Gemini follow-up questions about an alert (e.g., "why is this high risk?"). The prompt is grounded with the alert's JSON context.
- Recommended actions list rendered from Gemini's structured response.

## 8. Executive Dashboard
- **Big numbers:** Fraud Prevented (â‚¹), False Positive Rate trend line (before/after correlation).
- **Compliance status chips:** DORA / PCI-DSS / GDPR (green/amber).
- Simple and minimal for executives.

## 9. Case Management
- Kanban-lite: `New` â†’ `Investigating` â†’ `Resolved` columns (drag and drop).

## 10. Settings
- Threshold sliders for risk score bands (Critical/High/Medium).
- Toggle mock data generator on/off.
- API key configuration (Gemini).
# AI Explainability (Gemini)

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** AI-driven attribution and narrative generation.

## 1. Two-Layer Explainability

We use a two-layer explainability approach to satisfy regulatory requirements (GDPR/RBI) while ensuring the system remains mathematically transparent.

### 1.1 Deterministic Attribution Layer
*This is NOT a black-box SHAP approximation.* Because `RiskEngine.Score()` is a transparent weighted-sum, the exact contribution percentage per factor is calculated deterministically:
```text
(factor_weight Ã— fired) / total_score
```
This is mathematically a "SHAP-style" additive attribution because the underlying model is inherently linear/additive. 

### 1.2 Narrative Layer (Gemini)
The Gemini API takes the structured factor breakdown + transaction context and produces a human-readable investigation summary.

## 2. Gemini Prompt Template

```text
System: You are a bank SOC/fraud investigation assistant. Given structured alert data, write a 3-sentence
professional investigation summary and a 2-item recommended action list. Be factual, cite only the given data,
no speculation. Output strict JSON: {"summary": "...", "actions": ["...", "..."]}

User: Alert factors: {factors_json}. Transaction: â‚¹{amount} from {sender} to {receiver} via endpoint {endpoint_id}.
Risk score: {score}/1000. Confidence: {confidence}.
```

## 3. Fallback Mechanism

If the Gemini API call fails, times out (>2s), or the API key is unconfigured, the system gracefully falls back to a deterministic template-string generator (e.g., `"High-risk transaction blocked due to %s and %s"`).
> **Critical:** The demo must never break on network flakiness. This is a required resilience pattern.
# Quantum Risk Module

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Harvest-Now-Decrypt-Later (HNDL) risk monitoring.
**Related Documents:** [ADR-006](../18-decisions/ADR-006-quantum-module.md)

## 1. MVP Implementation Strategy

For the hackathon, we simulate posture scanning rather than attempting a multi-week deep TLS protocol integration. We seed 15â€“20 mock "endpoints" (e.g., API gateway, mobile app, core banking, SWIFT link) each with a TLS config.

### Logic (Go)

```go
type CBOMScanner struct{ safeCiphers map[string]bool }

func (s *CBOMScanner) AnalyzeSession(sessionID, tlsVersion, cipherSuite string) ScanResult {
    isSafe := (tlsVersion == "1.3") && s.safeCiphers[cipherSuite]
    hndlRisk := "LOW"
    action := "NONE"
    
    if !isSafe { 
        hndlRisk = "HIGH"
        action = "UPGRADE_TO_MLKEM_HYBRID" 
    }
    
    return ScanResult{
        SessionID: sessionID, 
        Compliant: isSafe, 
        HNDLRisk: hndlRisk, 
        RecommendedAction: action,
    }
}
```

## 2. Interactive Demo Moment

The Quantum Dashboard shows the migration readiness percentage ticking up if a user manually "patches" an endpoint. 
- **Action:** Clicking "Simulate ML-KEM Migration" flips one row in the database to compliant, and the chart animates.

## 3. Production Roadmap

In the real-world production version, the module will perform real TLS handshake introspection via `crypto/tls` connection state inspection across live endpoints. It will integrate with a real CBOM tool (exporting in CycloneDX format), run scheduled recurring scans, and alert when a new non-compliant cert is provisioned.
# Security Overview

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Security posture, authentication, and logging.

## 1. Authentication & Authorization

- **JWT:** We use HS256 for the MVP (RS256 in prod) with a 1h expiry and a role claim (`analyst` or `admin`).
- **RBAC:** `admin`-only routes are strictly gated by middleware checking the JWT role claim.

## 2. Rate Limiting

- **Gateway Middleware:** A token bucket rate limiter is applied per IP on the API gateway (100 req/min).

## 3. Input Validation

- **Struct Tags:** Every handler uses struct-tag validation. We strictly reject unknown fields.

## 4. Audit Log (Compliance)

- **Auditability:** Every alert status change and admin action is written to the `audit_log` table. 
- *Pitch Note:* Mention this explicitly; it directly answers the regulatory/DORA angle from the problem statement.

## 5. Secrets Management

- **No committed secrets:** The `.env` file is gitignored. An `.env.example` file is maintained for setup.
- **Gemini API Key:** Never exposed to the frontend; loaded and managed server-side only.

## 6. OWASP Basics

- **SQL Injection:** We use parameterized SQL via the `pgx` driver. No `eval` or dynamic SQL anywhere.
- **CORS:** Locked to the frontend origin.
# Implementation Plan (Day-by-Day)

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** 5-6 day sprint roadmap for the hackathon.

## Day 1 â€” Foundations
- **Morning:** Repo scaffolding (frontend/backend folders), Docker Compose skeleton (Postgres, Redis only), DB migrations run.
- **Afternoon:** Go gateway skeleton â€” health check route, JWT auth, `/ingest/telemetry` and `/transaction/authorize` accepting + validating + XADD-ing (no processing yet). Event simulator CLI producing mock events.
- **Night:** JSON schemas finalized and shared (contract-first); React app scaffolded with routing + dark theme shell + sidebar nav.
- **Deliverable:** Events flow from simulator â†’ API â†’ Redis Stream (visible via `redis-cli XREAD`).

## Day 2 â€” Correlation Core
- **Morning:** Sliding window struct + GC; consumer group worker reading both streams.
- **Afternoon:** Correlation matching logic with 3 initial fraud patterns wired; Risk Engine scoring formula + unit tests.
- **Night:** `alerts_stream` populated end-to-end; Postgres `alerts` table written on alert.
- **Deliverable:** `curl` a malicious telemetry event + transaction â†’ row appears in `alerts` table.

## Day 3 â€” Explainability + Quantum
- **Morning:** Deterministic attribution breakdown; Gemini client + prompt + fallback.
- **Afternoon:** Quantum scanner service + CBOM table + seed data; remaining 3 fraud patterns.
- **Night:** WS hub + Redis pub/sub bridge; test live push to a WS test client (`wscat`).
- **Deliverable:** Alert with `ai_summary` populated, pushed live over WS.

## Day 4 â€” Frontend Build
- **Morning:** Fusion Dashboard â€” alert feed + KPI strip wired to real API+WS.
- **Afternoon:** Alert Detail drawer + SHAP bar chart + Attack Graph (React Flow) with mock/real data.
- **Night:** Quantum Dashboard + Executive Dashboard.
- **Deliverable:** Full dashboard renders live data end-to-end, no more mock frontend data.

## Day 5 â€” Polish, Scenarios, Resilience
- **Morning:** Build 2â€“3 canned "attack scenario" scripts in the simulator (button-triggerable from Settings). **Never rely on live random data.**
- **Afternoon:** Error/loading/empty states everywhere; WS reconnect logic; demo-reset endpoint; fix all console errors.
- **Night:** Record a fallback demo video (non-negotiable safety net); write README.
- **Deliverable:** Feature-complete, demo-rehearsed once end-to-end.

## Day 6 â€” Rehearsal & Pitch (If available)
- **Morning:** Full dry run with timer exactly as the pitch script; fix any rough edges.
- **Afternoon:** Slides finalized (architecture diagram, ROI chart, quantum differentiator); test on the actual presentation screen resolution.
- **Night:** Buffer for last-minute bugs. Team sleeps.
# Team Division

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Responsibilities for the 4-member team across the hackathon timeline.

| Dev | Owns | Day 1-2 | Day 3-4 | Day 5-6 |
|---|---|---|---|---|
| **Dev 1 â€” Backend Core** | Gateway, streams, correlation engine | Scaffolding, ingest/txn handlers, Redis streams | Correlation window + matching logic | Perf/resilience, demo scenarios scripting |
| **Dev 2 â€” Frontend Core** | React shell, Fusion Dashboard, WS integration | Routing, theme, alert feed skeleton | Live WS wiring, Attack Graph (React Flow) | Polish, loading/error states, responsive check |
| **Dev 3 â€” AI + Risk + Quantum** | Risk engine, Gemini explain, Quantum Scanner | JSON schemas, DB schemas, risk logic + tests | Gemini integration, Quantum CBOM backend | Write the pitch, coordinate fallback video |
| **Dev 4 â€” Integration & Polish** | PostgreSQL, Auth, Secondary Dashboards | DB setup, JWT auth, Transaction Explorer (UI) | Quantum/Exec Dashboards, AI chat panel | Rehearsal logistics, CI/CD, README polish |
# Demo Story

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Hackathon demo narrative and fallback plan.
**Related Documents:** [Judge Strategy](judge-strategy.md)

## 1. Narrative Arc

*Setup â†’ Attack â†’ Detection â†’ Explanation â†’ Business Impact â†’ Differentiator.*

1. **Setup (10s):** "Meet a bank treasury employee's laptop and their bank account â€” completely normal, until now."
2. **Attack (20s):** Trigger the "Treasury Compromise" scenario â€” a malicious process spawns on the endpoint (visible in a live log tail or terminal window for authenticity).
3. **Detection (30s):** Within seconds, a transaction fires from that same endpoint. The Fusion Dashboard lights up with a CRITICAL alert â€” live timer overlay shows the sub-1.5s latency.
4. **Explanation (40s):** Click into the alert â€” SHAP-style bar chart, Gemini narrative, ask the AI panel one live follow-up question.
5. **Business impact (30s):** Cut to Executive Dashboard â€” false-positive-reduction chart (before/after correlation), â‚¹ fraud prevented.
6. **Differentiator (30s):** Cut to Quantum Dashboard â€” "and separately, we're the only team addressing the *quantum* half of this problem statement" â€” click "Simulate ML-KEM Migration," watch the number move.
7. **Close (10s):** Restate the one-liner: *"Your SIEM sees the malware. Your fraud engine sees the transfer. We're the only ones who see it's the same attack."*

## 2. Fallback Plan

Full demo pre-recorded as a 2-minute video, on a USB stick and locally on the laptop (no reliance on venue wifi), triggered if the live demo fails. 

> [!IMPORTANT]
> This is not optional â€” treat as a P0 deliverable on Day 5.
# Judge Strategy & Innovation

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Hackathon judging strategy, innovation points, and answers to anticipated questions.
**Related Documents:** [Demo Story](demo-story.md)

## 1. Evaluation Axes Strategy

**Evaluation axes we optimize for (typical hackathon rubric):** 
Problem-fit, Technical depth, Innovation, Feasibility/demo quality, Presentation, Business impact.

| Axis | Our Lever |
|---|---|
| Problem-fit | Explicitly address *both* halves of the problem statement (correlation AND quantum) â€” most teams will only address one |
| Technical depth | Live architecture diagram + real streaming pipeline + honest scoring-math explanation in Q&A |
| Innovation | Quantum dashboard + confidence-weighted correlation |
| Feasibility | MVP/Prod/Future table memorized, fallback video ready, `docker compose up` tested on a second machine |
| Presentation | Rehearsed demo story, one memorable one-liner repeated at open and close |
| Business impact | False-positive-reduction chart, â‚¹ fraud prevented, compliance chips (DORA/GDPR-style) |

## 2. Innovation List (Ranked by Hackathon Value)

1. **Multi-domain confidence weighting** â€” alerts corroborated by both cyber + transaction signals score higher confidence than single-domain alerts; this is the actual mechanism of the "reduce false positives" requirement, not a slogan.
2. **Quantum/HNDL risk tracking as a living dashboard**, not a one-time audit â€” almost no competing team will build this at all.
3. **Honest additive explainability** â€” framing SHAP-equivalence as a *design choice* (transparent model) rather than an approximation of a black box, directly answering the "explainable AI" requirement with more rigor than a bolted-on LLM summary.
4. **Live sub-1.5s correlation timer** shown on stage â€” makes an abstract latency claim into a visible, undeniable fact.
5. **Interactive migration simulation** on the Quantum Dashboard â€” turns a static compliance report into something a judge can click and feel agency over.
6. **Transparent MVP/Prod/Future labeling throughout the pitch** â€” meta-innovation: it's a credibility strategy, not a technical one, but it measurably changes how judges score "feasibility."

## 3. Anticipated Tough Questions

- **"Is any of this real ML?"**
  â†’ *Answer honestly:* Risk scoring is an intentionally transparent rule engine for auditability; Gemini adds narrative; the roadmap adds trained models once labeled data exists. Overclaiming here is the single most common way hackathon teams lose credibility.

- **"How is this different from Splunk/Sentinel/QRadar?"**
  â†’ *Answer:* Those are log platforms retrofitted with alerting; we're purpose-built to join financial ledger events with security telemetry as first-class citizens of the same data model â€” those platforms have no native concept of a "transaction."
# Coding Standards

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Development standards for backend and frontend.

## 1. Go (Backend)

- `gofmt` + `golangci-lint` on every commit (pre-commit hook or CI gate).
- **Package names:** short, lowercase, no underscores (`correlate`, not `correlation_engine`).
- **Errors:** always wrapped with context (`fmt.Errorf("scoring transaction %s: %w", txnID, err)`), never silently swallowed.
- **State:** No global mutable state except explicitly documented singletons (Redis client, DB pool) initialized once in `main.go` and passed via dependency injection, not package-level `var`.
- **Documentation:** Every exported function has a doc comment.
- **Testing:** Table-driven tests for anything with >2 branches of logic (the risk scoring formula is the canonical example).

## 2. TypeScript/React (Frontend)

- **Components:** Functional components only, no class components.
- **Typing:** Types over interfaces for props (project convention â€” pick one, stay consistent); no `any` without a `// TODO` justification comment.
- **File structure:** One component per file, file name matches component name.
- **Data fetching:** Only via the `services/` + React Query hooks layer â€” components never call `fetch`/`axios` directly.
- **Styling:** No inline styles; Tailwind utility classes or a documented CSS variable, never both mixed within one element.

## 3. Cross-Cutting

- **Commit messages:** `type(scope): message` (Conventional Commits) â€” e.g., `feat(correlate): add sliding window GC`, `fix(gateway): handle malformed telemetry payload`.
- **Secrets:** No secrets committed, ever â€” `.env` gitignored, `.env.example` maintained.
- **Pull Requests:** Every PR description states: what changed, why, how tested.
# Git & Branching Workflow

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Git branching model and contribution rules.

## 1. Branch Strategy

No long-lived `develop` branch â€” for a 5-day sprint, trunk-based development with short-lived feature branches (<1 day lifespan each) minimizes merge-conflict risk versus a heavier Git-flow model.

```
main                      â† always demo-able
 â”œâ”€â”€ feat/gateway-core           (Dev 1, Day 1)
 â”œâ”€â”€ feat/correlation-engine     (Dev 1, Day 2)
 â”œâ”€â”€ feat/risk-scoring           (Dev 3, Day 2)
 â”œâ”€â”€ feat/quantum-scanner        (Dev 3, Day 3)
 â”œâ”€â”€ feat/gemini-explain         (Dev 3, Day 3)
 â”œâ”€â”€ feat/dashboard-shell        (Dev 2, Day 1)
 â”œâ”€â”€ feat/fusion-dashboard       (Dev 2, Day 4)
 â”œâ”€â”€ feat/alert-detail           (Dev 4, Day 4)
 â”œâ”€â”€ feat/transaction-explorer   (Dev 4, Day 4)
 â””â”€â”€ chore/docker-compose        (Dev 4, Day 1)
```

## 2. Git Workflow

- **Trunk:** `main` â€” always in a demo-able state; nothing merges to `main` that doesn't build and pass `go vet`/`npm run build`.
- **Feature branches:** `feat/<short-name>` (e.g. `feat/correlation-engine`, `feat/quantum-dashboard`), `fix/<short-name>` for bug fixes, `chore/<short-name>` for tooling/docs.
- **Commit cadence:** Small, frequent commits within a branch â€” no single end-of-day mega-commit. (Visible signal to judges reviewing the repo history).
- **PR requirement:** Every feature branch opens a PR against `main`; at minimum a self-review checklist if solo, a teammate review if paired, before merge.
- **CI gate:** GitHub Actions runs `go build ./...`, `go vet ./...`, `npm run build` on every PR â€” merge blocked on failure.
- **Daily sync point:** End of each day, all in-flight branches merge or are explicitly deferred â€” `main` must be demo-able every single night, not just on Day 5.

## 3. Contribution Guidelines

1. Before starting any feature, confirm the relevant contract (API shape / event schema / DB table) already exists in the documentation. If it doesn't, define it here first, don't invent it silently in code.
2. Pull latest `main` before branching.
3. Keep PRs scoped to one feature â€” if a PR description needs "and also," split it.
4. Every PR must include: what changed, why, how it was tested, and a screenshot/GIF if it touches the UI.
5. If you discover the plan in the documentation is wrong once you start building, **update the documentation in the same PR** â€” it must stay the source of truth, not go stale.
6. No merging your own PR without at least a self-review pass reading the full diff, even solo.
7. Flag blockers immediately in the team channel â€” a 5-day timeline has no slack for a half-day silent stall.
# ADR-001: Scope to correlation + explainability + quantum

**Date:** 2026-07-13
**Status:** Approved

## Problem
The hackathon problem statement is broad; teams could spend all 5 days building either a full SIEM clone or a comprehensive fraud-ML platform, missing the actual "correlation" ask.

## Options Considered
1. Build a full SIEM that also ingests transactions.
2. Build a full Fraud Engine that also ingests telemetry.
3. Scope narrowly to the *fusion layer* â€” the layer that correlates the two.

## Decision
Scope narrowly to the *fusion layer* â€” the thing that's actually missing today. 

## Reason
This focuses all effort on the genuinely differentiated part of the problem. It highlights correlation, explainability, and quantum riskâ€”the specific elements called out in the problem statement.

## Trade-offs
Less surface area to demo (e.g., fewer general SIEM features).

## Future Revisit Conditions
If judges or stakeholders express confusion over the lack of a full SIEM, we will need to emphasize the MVP boundaries and explicitly state the scoping decision in the pitch (turning a limitation into a strength).
# ADR-002: Redis Streams instead of Apache Kafka for the event bus (MVP)

**Date:** 2026-07-13
**Status:** Approved

## Problem
The reference architecture (JPMorgan, Capital One, DBS) uses Kafka and Flink at production scale for handling vast event volumes. 

## Options Considered
1. Deploy a real Kafka + Flink cluster.
2. Use Redis Streams with Go consumer groups for the MVP.

## Decision
Use Redis Streams with consumer groups for the MVP; document Kafka as the Production target.

## Reason
Redis Streams provides equivalent semantics (partitioned log, consumer groups, replay via `XREAD`, `XAUTOCLAIM` for crash recovery) with a fraction of the operational risk during a live, time-boxed demo. This exact pattern is already proven in prior team work (BenchForge), meaning near-zero implementation risk and maximum reuse.

## Trade-offs
Does not demonstrate Kafka knowledge directly in the codebase.

## Future Revisit Conditions
When moving beyond the hackathon to a staging/production rollout handling >1K TPS across multiple nodes, Kafka and Flink must be implemented. Must clearly narrate this as a deliberate substitution during Q&A.
# ADR-003: Modular monolith instead of deployed microservices (MVP)

**Date:** 2026-07-13
**Status:** Approved

## Problem
The problem statement's "expected outcomes" imply a multi-service enterprise system, but managing microservices is overhead-heavy for a 5-day sprint.

## Options Considered
1. Deploy 6+ separately-networked services via Docker Compose.
2. Implement as one Go binary (modular monolith).

## Decision
Implement as one Go binary with strict internal package boundaries mapping 1:1 to future services (gateway, correlate, risk, quantum, explain, notify).

## Reason
Real microservices require service discovery, inter-service auth, and multiple Dockerfiles â€” pure DevOps overhead with zero demo-visible value in 5 days. Package boundaries + the architecture diagram tell the same story to a judge without the deployment complexity.

## Trade-offs
Less realistic network partitioning for the demo. 

## Future Revisit Conditions
Production roadmap must explicitly show the split-out path so this reads as sequencing, not a architectural gap. Revisit when the team size grows and services need independent scaling (HPA).
# ADR-004: Entity resolution via a single shared `endpoint_id` key (MVP)

**Date:** 2026-07-13
**Status:** Approved

## Problem
Real-world entity resolution (matching a device fingerprint to a user to an account) is a hard, dedicated ML problem. Telemetry uses identifiers like `device_id` or `IP`, while transactions use `account_id` or `user_id`.

## Options Considered
1. Build a multi-attribute fuzzy matching system to connect devices to accounts.
2. Use a graph database for multi-hop entity resolution.
3. Seed telemetry and transaction events with a shared `endpoint_id` field for the MVP.

## Decision
Telemetry and transaction events share a seeded `endpoint_id` field for the MVP; correlation joins on this key.

## Reason
Demonstrates the *correlation mechanism* faithfully without requiring a fuzzy-matching subsystem that would eat 1â€“2 days for a capability the problem statement doesn't actually require us to solve generally. 

## Trade-offs
Does not solve real-world identity resolution challenges. 

## Future Revisit Conditions
Production roadmap notes graph-based entity resolution (TigerGraph or Neo4j) as the real answer. This simplification must be labeled clearly in the architecture documentation and pitch.
# ADR-005: Transparent weighted-rule risk engine instead of a trained ML model

**Date:** 2026-07-13
**Status:** Approved

## Problem
XGBoost or Graph Neural Network (GNN) models require labeled training data we don't have, and would be a black box we couldn't credibly explain in 5 days.

## Options Considered
1. Train a mock XGBoost model on synthetic data.
2. Implement risk scoring as an explicit transparent weighted-rule engine.

## Decision
Implement risk scoring as an explicit weighted-sum formula. Treat this as an intentional, auditable design, not a shortcut.

## Reason
An additive model gives us *exact*, not approximated, factor attribution "for free" â€” which is a genuinely better regulatory answer (GDPR Art. 22-style explainability) than a black-box model with a bolted-on approximation (like SHAP). This reframes a time constraint as a design principle.

## Trade-offs
The MVP risk scoring won't use traditional ML inference, which might seem less "AI" if not framed correctly.

## Future Revisit Conditions
Must be stated with full honesty in the pitch â€” this is a credibility strength, not something to hide. Production roadmap will add trained models once labeled data exists, keeping the additive model as an explainability baseline.
# ADR-006: Quantum module is a config-classification scanner

**Date:** 2026-07-13
**Status:** Approved

## Problem
Implementing real hybrid ML-KEM TLS handshakes is a multi-week cryptographic engineering effort.

## Options Considered
1. Attempt a deep integration with a real HSM or PQC library.
2. Scan a seeded registry of endpoint TLS/cipher configs and classify compliance.

## Decision
Scan a seeded registry of endpoint TLS/cipher configs and classify compliance against a known quantum-safe cipher list.

## Reason
Delivers the *operational visibility* value (a living Cryptographic Bill of Materials - CBOM dashboard) â€” which is what the problem statement actually asks for ("quantum risk monitoring"), without requiring us to actually implement post-quantum cryptography, which the problem statement does not ask us to do.

## Trade-offs
The MVP is a simulation of posture scanning rather than a deep protocol integration.

## Future Revisit Conditions
Production roadmap explicitly lists real TLS introspection and HSM-backed key storage as the maturity path.
# ADR-007: PostgreSQL + Redis only for the MVP data layer

**Date:** 2026-07-13
**Status:** Approved

## Problem
The reference architecture uses ClickHouse, TigerGraph, and Aerospike at production scale, which is too complex for a 5-day hackathon.

## Options Considered
1. Set up ClickHouse for analytics and a Graph DB for entity resolution.
2. Use a single PostgreSQL instance and Redis for the MVP.

## Decision
Use a single PostgreSQL instance (with partition-ready schema) + Redis for the MVP.

## Reason
MVP data volumes (seeded/simulated events over a 5-minute demo) never approach the scale where specialized stores matter; adding them would be complexity theater. The `telemetry_events` table will be pre-partitioned by range specifically so the migration story to a time-series/columnar store is credible without having built it.

## Trade-offs
Lacks native graph or fast-analytics capabilities in the MVP.

## Future Revisit Conditions
Documented purely for the roadmap conversation. As data volume scales, specialized datastores will be introduced.
