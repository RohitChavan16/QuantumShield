# Judge Strategy & Innovation

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Hackathon judging strategy, innovation points, and answers to anticipated questions.
**Related Documents:** [Demo Story](demo-story.md)

## 1. Evaluation Axes Strategy

**Evaluation axes we optimize for (typical hackathon rubric):** 
Problem-fit, Technical depth, Innovation, Feasibility/demo quality, Presentation, Business impact.

| Axis | Our Lever |
|---|---|
| Problem-fit | Explicitly address *both* halves of the problem statement (correlation AND quantum) — most teams will only address one |
| Technical depth | Live architecture diagram + real streaming pipeline + honest scoring-math explanation in Q&A |
| Innovation | Quantum dashboard + confidence-weighted correlation |
| Feasibility | MVP/Prod/Future table memorized, fallback video ready, `docker compose up` tested on a second machine |
| Presentation | Rehearsed demo story, one memorable one-liner repeated at open and close |
| Business impact | False-positive-reduction chart, ₹ fraud prevented, compliance chips (DORA/GDPR-style) |

## 2. Innovation List (Ranked by Hackathon Value)

1. **Multi-domain confidence weighting** — alerts corroborated by both cyber + transaction signals score higher confidence than single-domain alerts; this is the actual mechanism of the "reduce false positives" requirement, not a slogan.
2. **Quantum/HNDL risk tracking as a living dashboard**, not a one-time audit — almost no competing team will build this at all.
3. **Honest additive explainability** — framing SHAP-equivalence as a *design choice* (transparent model) rather than an approximation of a black box, directly answering the "explainable AI" requirement with more rigor than a bolted-on LLM summary.
4. **Live sub-1.5s correlation timer** shown on stage — makes an abstract latency claim into a visible, undeniable fact.
5. **Interactive migration simulation** on the Quantum Dashboard — turns a static compliance report into something a judge can click and feel agency over.
6. **Transparent MVP/Prod/Future labeling throughout the pitch** — meta-innovation: it's a credibility strategy, not a technical one, but it measurably changes how judges score "feasibility."

## 3. Anticipated Tough Questions

- **"Is any of this real ML?"**
  → *Answer honestly:* Risk scoring is an intentionally transparent rule engine for auditability; Gemini adds narrative; the roadmap adds trained models once labeled data exists. Overclaiming here is the single most common way hackathon teams lose credibility.

- **"How is this different from Splunk/Sentinel/QRadar?"**
  → *Answer:* Those are log platforms retrofitted with alerting; we're purpose-built to join financial ledger events with security telemetry as first-class citizens of the same data model — those platforms have no native concept of a "transaction."
