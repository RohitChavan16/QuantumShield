# WebSocket Design

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Real-time event broadcasting to dashboard clients.

## 1. Connection Details

- **Endpoint:** `wss://<host>/ws?token=<jwt>`

## 2. Event Types

### Server → Client
```json
{"type":"ALERT_NEW","payload":{...alert}}
{"type":"ALERT_UPDATED","payload":{"alert_id":"...","status":"INVESTIGATING"}}
{"type":"METRIC_TICK","payload":{"eps":142,"active_alerts":3}}
{"type":"SCAN_PROGRESS","payload":{"pct":60}}
```

### Client → Server
```json
{"type":"SUBSCRIBE","payload":{"channel":"alerts"}}
{"type":"PING"}
```

## 3. Resilience & Heartbeat

- **Server behavior:** Sends `PING` every 20s.
- **Client behavior:** Must `PONG` within 5s or connection is closed.
- **Client hook:** Uses `useWebSocket` hook to reconnect with exponential backoff (1s → 2s → 4s → max 10s) and shows a `ConnectionStatusPill` in the UI.

## 4. Broadcast Strategy

- A single in-memory `Hub` (map of client connections, mutex-guarded) fed by a Redis Pub/Sub subscriber goroutine.
- This lets you horizontally scale gateway pods in Production (each pod subscribes to the same Redis channel) without code changes.
