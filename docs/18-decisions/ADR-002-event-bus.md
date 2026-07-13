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
