# API Endpoints

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** REST endpoints for the MVP.
**Related Documents:** [API Standards](standards.md), [WebSocket Design](websocket.md)

All endpoints expect `Authorization: Bearer <JWT>` except `/auth/login`.  
Standard error shape: `{error: {code, message}}`.  
Validation uses `go-playground/validator` struct tags.

## 1. Auth

- `POST /api/v1/auth/login`
  - Body: `{username, password}`
  - Returns: `{token, role}` — `200` success, `401` unauthorized
- `GET /api/v1/auth/me`
  - Header: `Bearer <token>`
  - Returns: `{user_id, role}` — `200` success, `401` unauthorized

## 2. Telemetry Ingestion

- `POST /api/v1/ingest/telemetry`
  - Header: `Bearer <token>`
  - Body: Telemetry event schema (see [Schemas](../06-event-model/schemas.md))
  - Returns: `202 Accepted {event_id}` — `400` on schema failure

## 3. Transactions

- `POST /api/v1/transaction/authorize`
  - Headers: `Bearer <token>`, `Idempotency-Key`
  - Body: `{transaction_id, sender_account_id, receiver_account_id, amount, currency, endpoint_id}`
  - Returns: `200 {decision, risk_score, reasons[]}` — `409` on duplicate key, `422` on invalid account

## 4. Alerts

- `GET /api/v1/alerts?status=&severity=&limit=&cursor=`
  - Returns: `200 {alerts[], next_cursor}`
- `GET /api/v1/alerts/{id}`
  - Returns: `200` full alert including `shap_attribution` and `ai_summary`, `404` if not found
- `PATCH /api/v1/alerts/{id}`
  - Header: `Bearer <token>`
  - Body: `{status}`
  - Returns: `200` updated alert — `403` if not analyst role

## 5. Dashboard KPIs

- `GET /api/v1/dashboard/kpis`
  - Returns: `200 {eps, active_alerts, mttd_seconds, blocked_amount_today}`

## 6. Quantum / Compliance

- `GET /api/v1/compliance/cbom`
  - Returns: `200 {total_monitored_keys, vulnerable_classical_keys, compliant_hybrid_keys, migration_readiness_percentage}`
- `POST /api/v1/compliance/scan`
  - Header: `Bearer <admin_token>`
  - Returns: `202 Accepted` (triggers scan)

## 7. Analytics

- `GET /api/v1/analytics/false-positive-trend`
  - Returns: `200 {points:[{date, rate}]}`

## 8. Admin

- `POST /api/v1/admin/seed/reset`
  - *Critical for live re-runs between judge visits.* Resets demo data.
  - Returns: `200 OK`
- `PUT /api/v1/admin/thresholds`
  - Body: `{critical, high, medium}`
  - Returns: `200 OK`

## 9. AI Explainability

- `POST /api/v1/ai/ask`
  - Body: `{alert_id, question}`
  - Returns: `200 {answer}` (Gemini-grounded response)
