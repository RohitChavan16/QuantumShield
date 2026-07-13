# User Personas and Journeys

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Target audience and core user workflows.

## 1. User Personas

### Persona 1 — Ananya, SOC Analyst
Monitors security alerts all day, drowning in false positives from disconnected tools. 
**Needs:** One screen, prioritized by real financial impact, that tells her *why* something matters, not just *that* something happened.

### Persona 2 — Rahul, Fraud Investigator
Reviews flagged transactions against SLA. 
**Needs:** Fast context (is this the customer traveling, or a compromised session?), one-click actions, defensible reasoning for every decision (regulatory audit).

### Persona 3 — Meera, Security Architect
Owns the bank's crypto posture and migration roadmap. 
**Needs:** A living inventory of what's quantum-vulnerable, not a one-time PDF audit, and a defensible number to report up to the CISO/board.

### Persona 4 — Vikram, Risk Executive
Cares about ₹ fraud prevented, false-positive trend, and regulatory compliance status — not architecture. 
**Needs:** Three big numbers and a trend line, nothing else.

### Persona 5 — The Judge
(Treat as a persona — it's the actual audience that matters most this week)
Evaluates: technical depth, problem-fit, feasibility, originality, presentation clarity, in ~5–8 minutes. 
**Needs:** To *see* the correlation happen live, understand the architecture in one diagram, and hear one thing no other team says (our answer: the quantum angle + honest additive explainability).

## 2. User Journeys

### Journey A — SOC Analyst detects and resolves a fused threat
1. Ananya opens the Fusion Dashboard, sees a CRITICAL alert slide in.
2. Clicks it → Alert Detail drawer opens, shows correlation factors and the SHAP-style bar chart.
3. Reads the Gemini-generated summary — understands in one paragraph why this fired.
4. Asks the AI panel "has this endpoint done this before?" — gets a grounded answer.
5. Clicks **Block** → transaction decision updates, audit log entry created, alert status → Resolved.

### Journey B — Fraud Investigator triages a transaction
1. Rahul opens Transaction Explorer, sorts by risk score descending.
2. Sees a transaction with no correlated alert (transaction-only signal, lower confidence) vs one with a fused alert (higher confidence).
3. Understands instantly which one deserves his limited attention first — this *is* the false-positive reduction value prop, experienced as a UX moment.

### Journey C — Security Architect checks quantum posture
1. Meera opens Quantum Dashboard, sees migration readiness at 62%.
2. Sees the SWIFT link endpoint flagged NON-COMPLIANT, HIGH HNDL risk.
3. Clicks "Simulate ML-KEM Migration" → watches readiness % climb, understands the tool as a *tracking* system, not a one-off scan.

### Journey D — Judge evaluates in 5 minutes
1. Sees architecture diagram (30s).
2. Watches a live attack scenario trigger → alert appear → get explained → get blocked, with a visible sub-1.5s timer (90s).
3. Sees the Quantum Dashboard as the differentiator (30s).
4. Hears the false-positive-reduction number and compliance angle (30s).
5. Asks one hard question, gets a precise, honest answer distinguishing MVP from architected-future (remaining time).
