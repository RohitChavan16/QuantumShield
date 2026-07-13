# Backend Go Folder Structure

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Directory layout for the Go backend.
**Related Documents:** [Coding Standards](../17-contributing/coding-standards.md)

```text
backend/
├── cmd/
│   ├── server/main.go                  # boots gateway + all workers in one process (MVP)
│   └── simulator/main.go               # standalone attack-scenario event generator
├── internal/
│   ├── gateway/
│   │   ├── router.go                   # gin.Engine setup, route registration
│   │   ├── middleware/
│   │   │   ├── auth.go                 # JWT middleware
│   │   │   ├── ratelimit.go            # token bucket per-IP
│   │   │   ├── cors.go
│   │   │   └── logging.go              # structured request logs
│   │   └── handlers/
│   │       ├── telemetry_handler.go
│   │       ├── transaction_handler.go
│   │       ├── alerts_handler.go
│   │       ├── cbom_handler.go
│   │       ├── auth_handler.go
│   │       └── ws_handler.go
│   ├── ingest/
│   │   └── validator.go                # JSON schema validation for telemetry
│   ├── txn/
│   │   └── validator.go
│   ├── correlate/
│   │   ├── engine.go                   # main correlation loop, XREADGROUP consumer
│   │   ├── window.go                   # sliding window data structure (map+mutex+TTL GC)
│   │   ├── rules.go                    # correlation rule definitions
│   │   └── entity_resolver.go          # maps device_id/user_id/account_id together
│   ├── risk/
│   │   ├── scorer.go                   # weighted formula implementation
│   │   ├── fraud_patterns.go           # 14 fraud pattern detectors
│   │   └── thresholds.go
│   ├── quantum/
│   │   ├── scanner.go
│   │   ├── cipher_registry.go          # quantum-safe cipher allowlist
│   │   └── cbom.go
│   ├── explain/
│   │   ├── shap_approx.go              # deterministic rule-weight breakdown
│   │   ├── gemini_client.go            # Gemini API wrapper + prompt templates
│   │   └── narrative.go
│   ├── notify/
│   │   └── broadcaster.go              # Redis pub/sub → WS hub fan-out
│   ├── streams/
│   │   ├── client.go                   # Redis client wrapper (go-redis)
│   │   ├── producer.go                 # XADD helpers
│   │   └── consumer.go                 # XREADGROUP + XACK + XAUTOCLAIM helpers (stalled msg recovery)
│   ├── store/
│   │   ├── postgres.go                 # pgx pool init
│   │   ├── alerts_repo.go
│   │   ├── transactions_repo.go
│   │   ├── accounts_repo.go
│   │   └── cbom_repo.go
│   ├── models/
│   │   ├── telemetry.go
│   │   ├── transaction.go
│   │   ├── alert.go
│   │   └── cbom.go
│   ├── config/
│   │   └── config.go                   # env var loading (viper or plain os.Getenv)
│   └── ws/
│       └── hub.go                      # WS client registry + broadcast
├── migrations/
│   ├── 0001_init.sql
│   └── 0002_cbom.sql
├── pkg/
│   └── jsonschema/                     # shared schema validation utils
├── docker/
│   └── Dockerfile
├── go.mod
└── go.sum
```

> **Note:** We are leveraging the battle-tested Redis Streams `XADD/XREADGROUP/XAUTOCLAIM` patterns previously built (e.g., in BenchForge) for stalled-message recovery and consumer group management.
