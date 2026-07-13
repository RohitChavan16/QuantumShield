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
Demonstrates the *correlation mechanism* faithfully without requiring a fuzzy-matching subsystem that would eat 1–2 days for a capability the problem statement doesn't actually require us to solve generally. 

## Trade-offs
Does not solve real-world identity resolution challenges. 

## Future Revisit Conditions
Production roadmap notes graph-based entity resolution (TigerGraph or Neo4j) as the real answer. This simplification must be labeled clearly in the architecture documentation and pitch.
