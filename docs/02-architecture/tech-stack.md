# Tech Stack Justification

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Selected technologies and rationale.
**Related Documents:** [Architecture Overview](overview.md)

| Layer | Choice | Why (vs alternatives considered) |
|---|---|---|
| Frontend framework | React + TypeScript + Vite | Team fluency, fastest dev-server iteration loop for a time-boxed hackathon vs Next.js's SSR overhead we don't need |
| Styling | TailwindCSS | Fast to build a consistent dark enterprise theme without hand-rolled CSS; avoids design-system yak-shaving |
| Charts | Recharts | Simplest React-native charting API for bar/line/donut needs; D3 gives more control but costs more implementation time for marginal visual gain |
| Graph visualization | React Flow | Purpose-built for node/edge diagrams (our Attack Graph), far less boilerplate than raw D3 force layouts |
| Animation | Framer Motion | Declarative, integrates cleanly with React state for the "alert slides in" moment that sells the live-ness of the demo |
| Backend language | Go | Team's proven strength, excellent concurrency primitives (goroutines) for the worker-pool pattern this architecture fundamentally needs, fast compile/iteration, single static binary simplifies Docker |
| Web framework | Gin | Minimal overhead, mature middleware ecosystem, team familiarity |
| Event bus | Redis Streams | Provides equivalent semantics to Kafka (partitioned log, consumer groups, replay) with a fraction of the operational risk during a live demo |
| Primary DB | PostgreSQL | ACID guarantees needed for alert status workflow and audit log; native JSONB for flexible event payloads without a schema migration per new event type |
| Cache/session | Redis | Already in the stack for streams; reused for session cache and rate-limit counters — avoids adding a second cache technology |
| AI narrative | Gemini API | Free/cheap tier suitable for hackathon budget, strong structured-JSON output mode, fast enough for our latency budget with fallback in place |
| Containerization | Docker + Docker Compose | Single-command boot is a hard requirement for judge-machine portability; Kubernetes would be pure overhead for a 5-day, single-host demo |
| Auth | JWT (HS256) | Stateless, simple to implement correctly in the time available; RS256/OIDC deferred to Production |
