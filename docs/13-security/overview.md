# Security Overview

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Security posture, authentication, and logging.

## 1. Authentication & Authorization

- **JWT:** We use HS256 for the MVP (RS256 in prod) with a 1h expiry and a role claim (`analyst` or `admin`).
- **RBAC:** `admin`-only routes are strictly gated by middleware checking the JWT role claim.

## 2. Rate Limiting

- **Gateway Middleware:** A token bucket rate limiter is applied per IP on the API gateway (100 req/min).

## 3. Input Validation

- **Struct Tags:** Every handler uses struct-tag validation. We strictly reject unknown fields.

## 4. Audit Log (Compliance)

- **Auditability:** Every alert status change and admin action is written to the `audit_log` table. 
- *Pitch Note:* Mention this explicitly; it directly answers the regulatory/DORA angle from the problem statement.

## 5. Secrets Management

- **No committed secrets:** The `.env` file is gitignored. An `.env.example` file is maintained for setup.
- **Gemini API Key:** Never exposed to the frontend; loaded and managed server-side only.

## 6. OWASP Basics

- **SQL Injection:** We use parameterized SQL via the `pgx` driver. No `eval` or dynamic SQL anywhere.
- **CORS:** Locked to the frontend origin.
