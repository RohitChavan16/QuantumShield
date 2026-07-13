# API Standards

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** API design, naming conventions, error structures.

- **Versioning:** All routes prefixed `/api/v1/` — breaking changes get a new version prefix, never an in-place breaking change.
- **Auth:** `Authorization: Bearer <JWT>` on every route except `POST /auth/login`.
- **Naming:** REST nouns, plural resources (`/alerts`, not `/getAlerts`); actions that aren't pure CRUD use a verb sub-resource (`/compliance/scan`, `/admin/seed/reset`).
- **Status codes:** 
  - `200` success w/ body
  - `202` accepted-async
  - `400` validation error
  - `401` unauthenticated
  - `403` unauthorized (role)
  - `404` not found
  - `409` conflict (idempotency key reuse)
  - `422` semantic validation failure (e.g. unknown account)
  - `500` unhandled — never leak stack traces in the response body.
- **Error shape (uniform across every endpoint):**
  ```json
  { 
    "error": { 
      "code": "VALIDATION_ERROR", 
      "message": "amount must be positive", 
      "field": "amount" 
    } 
  }
  ```
- **Idempotency:** All state-mutating POSTs that could be safely retried (e.g., `/transaction/authorize`) require an `Idempotency-Key` header.
- **Pagination:** Cursor-based (`?limit=&cursor=`), never offset-based, for the alerts list (append-heavy table).
- **Timestamps:** Always ISO-8601 UTC (`2026-07-13T10:30:00Z`) — never epoch, never local time, on the wire.
- **Response envelope:** Resource endpoints return the resource directly (not wrapped in `{data: ...}`) to keep frontend typing simple; list endpoints return `{items: [...], next_cursor}`.
