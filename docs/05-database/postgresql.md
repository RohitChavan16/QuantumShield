# Database Design (PostgreSQL)

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Relational database schema for the MVP.

## 1. Schema Definition

```sql
-- Accounts
CREATE TABLE accounts (
  account_id      TEXT PRIMARY KEY,
  customer_id     TEXT NOT NULL,
  current_balance NUMERIC(14,2) DEFAULT 0,
  risk_tier       TEXT DEFAULT 'STANDARD',       -- STANDARD/ELEVATED/RESTRICTED
  created_at      TIMESTAMPTZ DEFAULT now(),
  account_status  TEXT DEFAULT 'ACTIVE'
);
CREATE INDEX idx_accounts_customer ON accounts(customer_id);

-- Registered devices / endpoints
CREATE TABLE devices (
  device_id       TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  canvas_hash     TEXT,
  os_fingerprint  TEXT,
  trust_score     REAL DEFAULT 1.0,
  last_login      TIMESTAMPTZ,
  is_compromised  BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_devices_user ON devices(user_id);

-- Telemetry events (append-only, partition-ready)
CREATE TABLE telemetry_events (
  event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts              TIMESTAMPTZ NOT NULL,
  endpoint_id     TEXT NOT NULL,
  event_type      TEXT NOT NULL,                 -- PROCESS_SPAWN/AUTH_FAIL/VPN_CONNECT/...
  process_name    TEXT,
  hash_sha256     TEXT,
  source_ip       TEXT,
  raw_payload     JSONB,
  created_at      TIMESTAMPTZ DEFAULT now()
) PARTITION BY RANGE (ts);
CREATE INDEX idx_telemetry_endpoint_ts ON telemetry_events(endpoint_id, ts DESC);

-- Transactions
CREATE TABLE transactions (
  transaction_id  TEXT PRIMARY KEY,
  sender_account  TEXT REFERENCES accounts(account_id),
  receiver_account TEXT,
  amount          NUMERIC(14,2) NOT NULL,
  currency        TEXT DEFAULT 'INR',
  endpoint_id     TEXT,                          -- links transaction to originating device (KEY correlation field)
  decision        TEXT,                           -- ALLOW/HOLD/BLOCK
  risk_score      INT,
  ts              TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_txn_sender_ts ON transactions(sender_account, ts DESC);
CREATE INDEX idx_txn_endpoint ON transactions(endpoint_id);

-- Fused alerts (the star table)
CREATE TABLE alerts (
  alert_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts              TIMESTAMPTZ DEFAULT now(),
  severity        TEXT NOT NULL,                  -- CRITICAL/HIGH/MEDIUM/LOW
  risk_score      INT NOT NULL,
  entity_id       TEXT NOT NULL,                  -- endpoint_id or account_id
  transaction_id  TEXT REFERENCES transactions(transaction_id),
  correlation_factors JSONB,                       -- ["EDR_COMPROMISE","IMPOSSIBLE_TRAVEL"]
  shap_attribution JSONB,                           -- {"factor":"weight"}
  ai_summary      TEXT,                             -- Gemini narrative
  status          TEXT DEFAULT 'NEW',              -- NEW/INVESTIGATING/RESOLVED/FALSE_POSITIVE
  created_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_alerts_status_ts ON alerts(status, ts DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);

-- Cryptographic Bill of Materials
CREATE TABLE cryptographic_assets (
  asset_id        TEXT PRIMARY KEY,
  endpoint_name   TEXT NOT NULL,
  tls_version     TEXT NOT NULL,
  cipher_suite    TEXT NOT NULL,
  is_pqc_hybrid   BOOLEAN DEFAULT FALSE,
  hndl_risk       TEXT DEFAULT 'HIGH',             -- LOW/MEDIUM/HIGH
  last_scanned    TIMESTAMPTZ DEFAULT now()
);

-- Audit log (compliance)
CREATE TABLE audit_log (
  id              BIGSERIAL PRIMARY KEY,
  actor           TEXT,
  action          TEXT,
  target_id       TEXT,
  ts              TIMESTAMPTZ DEFAULT now(),
  metadata        JSONB
);
```

## 2. Future Scaling

- `telemetry_events` is already declared `PARTITION BY RANGE(ts)` for monthly partitioning. 
- At scale (>10M rows/day), analytical workloads will move to ClickHouse. 
- `alerts` will remain in PostgreSQL because it is highly transactional and requires ACID guarantees for case management workflow.
