# Risk Engine

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Transparent weighted-rule scoring logic.
**Related Documents:** [ADR-005](../18-decisions/ADR-005-risk-engine.md)

## 1. Weighted Formula

```text
R_score = (w_auth·S_auth + w_endpoint·S_endpoint + w_velocity·S_velocity + w_amount·S_amount) × confidence_multiplier
```

**Default weights:** 
- `w_auth` = 0.25
- `w_endpoint` = 0.35 (Endpoint compromise is the strongest, rarest signal)
- `w_velocity` = 0.20
- `w_amount` = 0.20

**Adaptive Weights:** If `S_auth` factor already fired (e.g. VPN detected), `w_auth` is boosted 1.5× for that scoring pass. This mirrors the "dynamic weight adjustment" pattern.

## 2. Thresholds

Thresholds are configurable via `/admin/thresholds` and can be adjusted live in the Settings page.
- **Critical:** `≥ 800`
- **High:** `600 - 799`
- **Medium:** `400 - 599`
- **Low:** `< 400`

## 3. False Positive Reduction

The confidence multiplier is the actual false positive reduction mechanism. Single-signal alerts get `0.5×` score, while multi-domain corroborated alerts get `1.0×`.

> **Demo strategy:** Show a before/after chart on the Executive Dashboard comparing the "rule-only false positive rate" (~40%) vs the "fused correlation rate" (~12%). 

## 4. Future ML Integration

In production, the `RiskEngine.Score()` internals can be swapped for an XGBoost model call via a small Python sidecar (Flask+ONNX). Because the architecture isolates scoring behind a clean `RiskEngine` interface, this will be a drop-in replacement, not a rewrite.
