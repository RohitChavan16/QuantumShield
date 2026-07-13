# Product Vision & Problem Analysis

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Project vision, problem breakdown, root cause analysis.
**Related Documents:** [Features](features.md), [Architecture Overview](../02-architecture/overview.md)

## 1. Product Vision

**Vision statement:**
> SentinelFuse fuses cybersecurity telemetry with transactional behaviour in real time, so that an attack pattern invisible to a SIEM alone and invisible to a fraud engine alone becomes obvious the moment both signals are viewed together — explained in plain language, and extended to flag the bank's exposure to future quantum decryption risk.

**Why this vision, not a broader one:**
The problem statement explicitly asks for *correlation*, not "another fraud detector" or "another SIEM." Every team that misreads this brief will build one or the other. We are building the **join**, which is the actual gap named in the problem statement.

**One-sentence pitch:** 
*"Your SIEM sees the malware. Your fraud engine sees the transfer. Nobody sees they're the same attack — until now."*

**Elevator pitch (30s, for casual judge conversation):**
> "Banks run cybersecurity monitoring and fraud detection as two separate systems that never talk to each other. An attacker who compromises a bank employee's laptop and then initiates a wire transfer from it looks completely normal to the fraud engine — it's a valid session, valid credentials, valid transaction. SentinelFuse correlates the endpoint compromise with the transaction in real time, explains exactly why it's suspicious, and blocks it — while also tracking which parts of the bank's encryption are vulnerable to future quantum decryption attacks. It's the missing link between security operations and fraud operations."

**What we are NOT building:**
A general-purpose SIEM, a general-purpose fraud ML platform, a production PQC migration tool. We are building the **correlation and explainability layer** that sits on top of / between those systems. Scoping this narrowly is itself a strategic decision — see [ADR-001](../18-decisions/ADR-001-scope.md).

## 2. Problem Analysis

### 2.1 The Core Problem, Decomposed

| Sub-problem | Why it exists today | Who suffers |
|---|---|---|
| Security telemetry and transaction data live in different systems with no shared schema or session context | Historical org silos: SOC teams own SIEM, fraud teams own transaction monitoring, procured from different vendors, on different timelines | Both teams — neither has the full picture |
| Rule-based fraud engines fire on transaction attributes alone (amount, velocity, geo) | These are the only signals available without cyber telemetry | Customers (false declines), bank (missed real fraud) |
| SOC alerts fire on endpoint/network anomalies alone, with no visibility into what the compromised session then did financially | EDR/SIEM tools have no concept of "bank account" or "transaction" | SOC analysts (alert fatigue, no financial context to prioritize) |
| Neither system can explain *why* in a way a human or regulator can audit | Legacy rule engines give binary flags; black-box ML gives none | Compliance officers, customers disputing declines |
| No visibility into cryptographic assets vulnerable to future quantum decryption (HNDL) | Nobody currently monitors this as an operational risk category at all | Long-term data confidentiality, regulatory readiness (DORA) |

### 2.2 Why this is hard (not just "hasn't been built yet")

1. **Entity resolution across domains** — a `device_id` in EDR logs and an `account_id` in the ledger aren't naturally the same key; you need a resolution layer.
2. **Latency budget** — correlation must happen before the transaction is authorized, not after, or it's just forensics. This means sub-second joins, not batch analytics.
3. **False positive cost is asymmetric** — blocking a legitimate ₹75,000 transfer has real customer/business cost, so correlation must *raise confidence*, not just *add more rules that fire more often*.
4. **Explainability is a regulatory requirement, not a nice-to-have** (GDPR Art. 22-style "right to explanation," RBI/DORA-style model governance expectations) — so whatever scores the risk must be able to show its work.

### 2.3 Root Cause Statement

> The correlation gap exists because cybersecurity and fraud systems are architected as **independent decision boundaries** rather than **contributors to one shared decision.** SentinelFuse's core innovation is architectural, not algorithmic: a shared event bus + sliding-window entity join that lets both domains contribute to one score.
