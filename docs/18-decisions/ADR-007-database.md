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
