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
Real microservices require service discovery, inter-service auth, and multiple Dockerfiles — pure DevOps overhead with zero demo-visible value in 5 days. Package boundaries + the architecture diagram tell the same story to a judge without the deployment complexity.

## Trade-offs
Less realistic network partitioning for the demo. 

## Future Revisit Conditions
Production roadmap must explicitly show the split-out path so this reads as sequencing, not a architectural gap. Revisit when the team size grows and services need independent scaling (HPA).
