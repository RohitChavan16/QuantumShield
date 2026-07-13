# Event Schemas (JSON)

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Core event structures flowing through the system.

> Keep all schemas in `pkg/jsonschema/*.json` and validate with `gojsonschema` on ingest boundary only. Do not over-validate in the hot path.

## 1. Telemetry Event

```json
{
  "event_id": "evt_10492810",
  "timestamp": "2026-07-12T10:30:00Z",
  "endpoint_id": "EP_TREASURY_04",
  "event_type": "PROCESS_SPAWN",
  "process_name": "mimikatz.exe",
  "hash_sha256": "8508197...c75c87a",
  "source_ip": "10.2.4.18",
  "user_id": "u_9921"
}
```

## 2. Transaction Event

```json
{
  "transaction_id": "tx_99182301",
  "sender_account_id": "ACC_8829102",
  "receiver_account_id": "ACC_0019283",
  "amount": 75000.00,
  "currency": "INR",
  "endpoint_id": "EP_TREASURY_04",
  "timestamp": "2026-07-12T10:30:05Z"
}
```

## 3. Fused Alert Event

```json
{
  "alert_id": "evt_alert_001",
  "risk_score": 850,
  "severity": "CRITICAL",
  "correlation_factors": [
    "EDR_COMPROMISE_PROCESS", 
    "AMOUNT_OUT_OF_PROFILE"
  ],
  "shap_attribution": {
    "edr_compromise": 0.42, 
    "vpn_proxy": 0.18, 
    "amount_deviation": 0.30, 
    "impossible_travel": 0.10
  },
  "ai_summary": "This transaction was blocked because...",
  "transaction_id": "tx_99182301"
}
```

## 4. Other Entities
Risk Score internal object, Quantum scan event, and Audit event follow the same JSON-first pattern.
