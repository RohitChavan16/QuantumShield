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
Delivers the *operational visibility* value (a living Cryptographic Bill of Materials - CBOM dashboard) — which is what the problem statement actually asks for ("quantum risk monitoring"), without requiring us to actually implement post-quantum cryptography, which the problem statement does not ask us to do.

## Trade-offs
The MVP is a simulation of posture scanning rather than a deep protocol integration.

## Future Revisit Conditions
Production roadmap explicitly lists real TLS introspection and HSM-backed key storage as the maturity path.
