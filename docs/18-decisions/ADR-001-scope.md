# ADR-001: Scope to correlation + explainability + quantum

**Date:** 2026-07-13
**Status:** Approved

## Problem
The hackathon problem statement is broad; teams could spend all 5 days building either a full SIEM clone or a comprehensive fraud-ML platform, missing the actual "correlation" ask.

## Options Considered
1. Build a full SIEM that also ingests transactions.
2. Build a full Fraud Engine that also ingests telemetry.
3. Scope narrowly to the *fusion layer* — the layer that correlates the two.

## Decision
Scope narrowly to the *fusion layer* — the thing that's actually missing today. 

## Reason
This focuses all effort on the genuinely differentiated part of the problem. It highlights correlation, explainability, and quantum risk—the specific elements called out in the problem statement.

## Trade-offs
Less surface area to demo (e.g., fewer general SIEM features).

## Future Revisit Conditions
If judges or stakeholders express confusion over the lack of a full SIEM, we will need to emphasize the MVP boundaries and explicitly state the scoping decision in the pitch (turning a limitation into a strength).
