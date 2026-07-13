# Fraud Detection Patterns

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Core patterns detected by the Risk Engine.

> **Hackathon Scope:** We are building 6 core patterns for the MVP, stubbing 2 for the demo, and listing the rest as Future/Roadmap.

## MVP Implementation (Build Live)

| Pattern | Logic | Data Needed | Risk Weight |
|---|---|---|---|
| **Impossible Travel** | Haversine distance between last 2 known IP-geolocations / time delta > max plausible speed | `source_ip` geoIP, `last_login` | 0.30 |
| **EDR Host Compromise Hold** | Known-bad process hash in window before txn | telemetry hash | 0.40 |
| **Velocity Abuse** | >N transactions from same account in sliding 60s window | transaction stream count | 0.20 |
| **Device Drift** | `canvas_hash` differs from last 3 known hashes for user | `devices` table | 0.15 |
| **VPN/Proxy Risk** | Source IP ASN in known VPN/proxy range (mock static list) | telemetry `source_ip` | 0.15 |
| **Amount-Out-of-Profile** | Amount > 3× rolling 30-day average for account | transactions history | 0.25 |

## Stubbed (Hardcoded for Demo)

| Pattern | Logic | Data Needed | Risk Weight |
|---|---|---|---|
| **SIM Swap Lock** | Mock carrier API returns recent SIM change flag | mocked external field | 0.30 |
| **Session Hijack** | UA fingerprint mismatch mid-session | session cache | N/A |

## Future (Roadmap)

| Pattern | Logic | Data Needed | Risk Weight |
|---|---|---|---|
| **Money Mule (GNN)** | Account receives+forwards within 10 min, shared device with N other accounts | graph query | N/A |
| **Credential Stuffing** | ≥3 auth fails then success within 2 min | auth log stream | 0.20 |
| **Insider Threat** | Off-hours DB query + ledger change | DB audit log | N/A |
| **New Device** | `device_id` not in `registered_devices` | `devices` table | 0.10 |
| **TOR Exit Node** | Source IP in TOR exit list | telemetry | 0.15 |
| **Behavior Change** | Navigation path deviates from typical session graph | session history | N/A |
