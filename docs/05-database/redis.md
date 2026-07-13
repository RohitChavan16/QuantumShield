# Redis Design

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Streams, Pub/Sub, and Caching architecture.
**Related Documents:** [ADR-002: Event Bus](../18-decisions/ADR-002-event-bus.md)

## 1. Streams

| Stream | Producers | Consumer Group | Purpose |
|---|---|---|---|
| `telemetry_events` | gateway | `correlation-cg` | raw cyber events |
| `transaction_events` | gateway | `correlation-cg` | raw txn events |
| `alerts_stream` | correlate | `explain-cg` | fused alerts needing narrative |
| `notify_stream` | explain | `notify-cg` | ready-to-broadcast alerts |

## 2. Keys & Cache

- `session:{session_id}` (Hash, TTL 30m) — Active session context.
- `window:{entity_id}` (Managed in-app, backed by ZSET `window:{entity_id}` scored by timestamp for O(log n) range queries, TTL 5m).
- `eps:counter` (INCR per event, read every 1s by dashboard poll → resets via sliding counter).
- `cbom:cache` (String, TTL 60s) — Cached CBOM summary for fast dashboard load.

## 3. Pub/Sub

- **Channel:** `alerts:live`
- **Purpose:** The `explain-worker` publishes the finalized alert JSON to this channel; the gateway WS hub subscribes and fans out to all connected dashboard clients.

## 4. Consumer Groups / Worker Pools

- `correlation-cg` uses 8 consumers (goroutines) reading both streams.
- **Crash Recovery:** Uses `XAUTOCLAIM` every 10s to reclaim messages idle >30s.
- **Retry / DLQ:** On handler panic/error, message NOT XACK'd → remains pending. After 3 claim attempts (tracked via a small Redis Hash `retry:{stream}:{id}`), the payload is moved to `dead_letter_stream` for manual inspection. 
- *Note:* The "Failed Events" count is displayed in the Settings page as a small but real reliability signal.
