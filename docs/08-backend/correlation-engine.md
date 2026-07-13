# Correlation Engine

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Core logic for the sliding-window entity join.

## 1. Event Ingestion

Both `telemetry_events` and `transaction_events` streams are consumed by the same worker pool via `XREADGROUP GROUP correlation-cg`.

## 2. Sliding Window Map

We maintain a per-entity (`endpoint_id`) in-memory structure:

```go
type Window struct {
    mu     sync.RWMutex
    events map[string][]TimestampedEvent // key: endpoint_id
}
// On insert: append event, then prune events older than 5*time.Minute
// GC ticker every 30s sweeps empty/expired entity keys
```

> **Why in-memory for MVP?** It provides sub-millisecond access and is simplest to demo reliably. In production, this will use Redis ZSET (`ZADD window:{id} ts event_json`, `ZRANGEBYSCORE` for window query) so state survives pod restarts and scales horizontally.

## 3. Matching Logic (Pseudocode)

```python
on TransactionEvent(t):
    recent = window.Get(t.EndpointID, last=5min)
    factors = []
    
    for e in recent:
        if e.Type == "PROCESS_SPAWN" and isKnownMalwareHash(e.Hash):
            factors.append("EDR_COMPROMISE_PROCESS", weight=0.40)
        if e.Type == "VPN_CONNECT" and e.SourceIP.IsHighRiskASN():
            factors.append("VPN_PROXY", weight=0.15)
        if e.Type == "AUTH_FAIL" and countRecentFails(recent) >= 3:
            factors.append("CREDENTIAL_STUFFING", weight=0.20)
            
    if t.Amount > profileAvg(t.SenderAccount) * 3:
        factors.append("AMOUNT_OUT_OF_PROFILE", weight=0.25)
    if geoDistance(t.SourceIP, lastKnownLocation(t.SenderAccount)) implies impossible travel:
        factors.append("IMPOSSIBLE_TRAVEL", weight=0.30)

    if len(factors) > 0:
        score = RiskEngine.Score(factors)
        if score.Value >= threshold.Medium:
            XADD alerts_stream {factors, score, transaction_id}
```

## 4. False Positive Reduction Mechanism

**Confidence Formula:** `confidence = min(1.0, num_corroborating_domains / 2)`

An alert triggered by BOTH a cyber signal AND a transaction signal gets a confidence of `1.0`. Single-domain-only signals are suppressed or downgraded to LOW. This is the direct implementation of the "reduces false positives" requirement.

## 5. Flowchart
`Event In → Window Lookup → Factor Extraction → ≥1 factor? → Risk Engine → Score ≥ threshold? → Alert Out → else Drop (ACK, no alert)`
