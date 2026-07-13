# AI Explainability (Gemini)

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** AI-driven attribution and narrative generation.

## 1. Two-Layer Explainability

We use a two-layer explainability approach to satisfy regulatory requirements (GDPR/RBI) while ensuring the system remains mathematically transparent.

### 1.1 Deterministic Attribution Layer
*This is NOT a black-box SHAP approximation.* Because `RiskEngine.Score()` is a transparent weighted-sum, the exact contribution percentage per factor is calculated deterministically:
```text
(factor_weight × fired) / total_score
```
This is mathematically a "SHAP-style" additive attribution because the underlying model is inherently linear/additive. 

### 1.2 Narrative Layer (Gemini)
The Gemini API takes the structured factor breakdown + transaction context and produces a human-readable investigation summary.

## 2. Gemini Prompt Template

```text
System: You are a bank SOC/fraud investigation assistant. Given structured alert data, write a 3-sentence
professional investigation summary and a 2-item recommended action list. Be factual, cite only the given data,
no speculation. Output strict JSON: {"summary": "...", "actions": ["...", "..."]}

User: Alert factors: {factors_json}. Transaction: ₹{amount} from {sender} to {receiver} via endpoint {endpoint_id}.
Risk score: {score}/1000. Confidence: {confidence}.
```

## 3. Fallback Mechanism

If the Gemini API call fails, times out (>2s), or the API key is unconfigured, the system gracefully falls back to a deterministic template-string generator (e.g., `"High-risk transaction blocked due to %s and %s"`).
> **Critical:** The demo must never break on network flakiness. This is a required resilience pattern.
