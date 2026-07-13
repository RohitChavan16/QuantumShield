# ADR-005: Transparent weighted-rule risk engine instead of a trained ML model

**Date:** 2026-07-13
**Status:** Approved

## Problem
XGBoost or Graph Neural Network (GNN) models require labeled training data we don't have, and would be a black box we couldn't credibly explain in 5 days.

## Options Considered
1. Train a mock XGBoost model on synthetic data.
2. Implement risk scoring as an explicit transparent weighted-rule engine.

## Decision
Implement risk scoring as an explicit weighted-sum formula. Treat this as an intentional, auditable design, not a shortcut.

## Reason
An additive model gives us *exact*, not approximated, factor attribution "for free" — which is a genuinely better regulatory answer (GDPR Art. 22-style explainability) than a black-box model with a bolted-on approximation (like SHAP). This reframes a time constraint as a design principle.

## Trade-offs
The MVP risk scoring won't use traditional ML inference, which might seem less "AI" if not framed correctly.

## Future Revisit Conditions
Must be stated with full honesty in the pitch — this is a credibility strength, not something to hide. Production roadmap will add trained models once labeled data exists, keeping the additive model as an explainability baseline.
