# Features & Roadmap

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Feature list mapped to requirements, MVP/Production distinction, and success criteria.

## 1. Feature List

(Mapped to FR-ids and MVP/Prod/Future)

| # | Feature | FR | Tier | Judge Impact |
|---|---|---|---|---|
| 1 | Telemetry + Transaction ingest APIs | FR-01, FR-02 | MVP | Foundation |
| 2 | Sliding-window correlation engine | FR-03 | MVP | 🔥🔥🔥 core value prop |
| 3 | Weighted risk scoring | FR-04 | MVP | 🔥🔥 |
| 4 | Explainability (attribution + Gemini narrative) | FR-05 | MVP | 🔥🔥🔥 |
| 5 | Real-time WS alert feed | FR-07 | MVP | 🔥🔥🔥 visual wow |
| 6 | Fusion Dashboard + Attack Graph | — | MVP | 🔥🔥🔥 |
| 7 | Quantum CBOM scanner + dashboard | FR-09, FR-10 | MVP | 🔥🔥🔥 differentiator |
| 8 | 6 core fraud detection patterns | FR-11 | MVP | 🔥🔥 |
| 9 | Alert case status workflow | FR-08 | MVP | 🔥 |
| 10 | Configurable thresholds | FR-12 | Should | 🔥 shows maturity |
| 11 | Demo-reset endpoint | FR-13 | Should | operational |
| 12 | AI follow-up Q&A panel | FR-14 | Should | 🔥🔥 |
| 13 | 4 additional fraud patterns (SIM swap, credential stuffing, etc.) | FR-15 | Should | 🔥 |
| 14 | Case management Kanban | FR-16 | Could | 🔥 |
| 15 | GNN money-mule detection | FR-17 | Future | mention only |
| 16 | Real Kafka/Flink pipeline | — | Future | mention only |
| 17 | Real PQC/HSM integration | — | Future | mention only |

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
> This table is the single most important artifact to have memorized before judge Q&A — every "why didn't you build X" question is answered by pointing at this row.

## 3. Success Criteria

### Technical Success (must all be true before Day 5 ends)
- [ ] A telemetry event + a correlated transaction event produce a visible alert in <1.5s, live, not pre-recorded.
- [ ] The alert's explanation is generated from real factor weights, not a hardcoded string.
- [ ] The quantum dashboard shows real data from the CBOM scan (not static mock JSON with no backend).
- [ ] The system survives a killed network connection to Gemini without crashing.
- [ ] `docker compose up` works on a machine that isn't the dev's own laptop (test this — a shockingly common hackathon failure).

### Product Success
- [ ] A judge can articulate, unprompted, what makes this different from "just another fraud detector" after the demo.
- [ ] The quantum angle is remembered as *the* differentiator in judge feedback.

### Competitive Success
- [ ] Shortlisted for the PPT/screening round.
- [ ] Score ≥ leading teams on "technical depth" and "problem-fit" evaluation axes specifically.
