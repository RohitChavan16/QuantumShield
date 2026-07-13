# Git & Branching Workflow

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Git branching model and contribution rules.

## 1. Branch Strategy

No long-lived `develop` branch — for a 5-day sprint, trunk-based development with short-lived feature branches (<1 day lifespan each) minimizes merge-conflict risk versus a heavier Git-flow model.

```
main                      ← always demo-able
 ├── feat/gateway-core           (Dev 1, Day 1)
 ├── feat/correlation-engine     (Dev 1, Day 2)
 ├── feat/risk-scoring           (Dev 3, Day 2)
 ├── feat/quantum-scanner        (Dev 3, Day 3)
 ├── feat/gemini-explain         (Dev 3, Day 3)
 ├── feat/dashboard-shell        (Dev 2, Day 1)
 ├── feat/fusion-dashboard       (Dev 2, Day 4)
 ├── feat/alert-detail           (Dev 4, Day 4)
 ├── feat/transaction-explorer   (Dev 4, Day 4)
 └── chore/docker-compose        (Dev 4, Day 1)
```

## 2. Git Workflow

- **Trunk:** `main` — always in a demo-able state; nothing merges to `main` that doesn't build and pass `go vet`/`npm run build`.
- **Feature branches:** `feat/<short-name>` (e.g. `feat/correlation-engine`, `feat/quantum-dashboard`), `fix/<short-name>` for bug fixes, `chore/<short-name>` for tooling/docs.
- **Commit cadence:** Small, frequent commits within a branch — no single end-of-day mega-commit. (Visible signal to judges reviewing the repo history).
- **PR requirement:** Every feature branch opens a PR against `main`; at minimum a self-review checklist if solo, a teammate review if paired, before merge.
- **CI gate:** GitHub Actions runs `go build ./...`, `go vet ./...`, `npm run build` on every PR — merge blocked on failure.
- **Daily sync point:** End of each day, all in-flight branches merge or are explicitly deferred — `main` must be demo-able every single night, not just on Day 5.

## 3. Contribution Guidelines

1. Before starting any feature, confirm the relevant contract (API shape / event schema / DB table) already exists in the documentation. If it doesn't, define it here first, don't invent it silently in code.
2. Pull latest `main` before branching.
3. Keep PRs scoped to one feature — if a PR description needs "and also," split it.
4. Every PR must include: what changed, why, how it was tested, and a screenshot/GIF if it touches the UI.
5. If you discover the plan in the documentation is wrong once you start building, **update the documentation in the same PR** — it must stay the source of truth, not go stale.
6. No merging your own PR without at least a self-review pass reading the full diff, even solo.
7. Flag blockers immediately in the team channel — a 5-day timeline has no slack for a half-day silent stall.
