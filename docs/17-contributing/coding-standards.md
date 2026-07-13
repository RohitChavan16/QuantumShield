# Coding Standards

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Development standards for backend and frontend.

## 1. Go (Backend)

- `gofmt` + `golangci-lint` on every commit (pre-commit hook or CI gate).
- **Package names:** short, lowercase, no underscores (`correlate`, not `correlation_engine`).
- **Errors:** always wrapped with context (`fmt.Errorf("scoring transaction %s: %w", txnID, err)`), never silently swallowed.
- **State:** No global mutable state except explicitly documented singletons (Redis client, DB pool) initialized once in `main.go` and passed via dependency injection, not package-level `var`.
- **Documentation:** Every exported function has a doc comment.
- **Testing:** Table-driven tests for anything with >2 branches of logic (the risk scoring formula is the canonical example).

## 2. TypeScript/React (Frontend)

- **Components:** Functional components only, no class components.
- **Typing:** Types over interfaces for props (project convention — pick one, stay consistent); no `any` without a `// TODO` justification comment.
- **File structure:** One component per file, file name matches component name.
- **Data fetching:** Only via the `services/` + React Query hooks layer — components never call `fetch`/`axios` directly.
- **Styling:** No inline styles; Tailwind utility classes or a documented CSS variable, never both mixed within one element.

## 3. Cross-Cutting

- **Commit messages:** `type(scope): message` (Conventional Commits) — e.g., `feat(correlate): add sliding window GC`, `fix(gateway): handle malformed telemetry payload`.
- **Secrets:** No secrets committed, ever — `.env` gitignored, `.env.example` maintained.
- **Pull Requests:** Every PR description states: what changed, why, how tested.
