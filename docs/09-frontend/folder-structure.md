# Frontend Folder Structure

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Directory layout for the React (Vite) frontend.

```text
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   │   └── router.tsx                 # React Router route table
│   ├── layouts/
│   │   ├── AppShell.tsx                # sidebar + topbar wrapper
│   │   └── AuthLayout.tsx
│   ├── pages/
│   │   ├── FusionDashboard/
│   │   │   ├── index.tsx
│   │   │   ├── AlertFeed.tsx
│   │   │   ├── AttackGraph.tsx
│   │   │   └── KpiStrip.tsx
│   │   ├── AlertDetail/index.tsx
│   │   ├── ThreatTimeline/index.tsx
│   │   ├── TransactionExplorer/index.tsx
│   │   ├── QuantumDashboard/index.tsx
│   │   ├── AiInvestigation/index.tsx
│   │   ├── ExecutiveDashboard/index.tsx
│   │   ├── CaseManagement/index.tsx
│   │   └── Settings/index.tsx
│   ├── components/
│   │   ├── ui/                         # shadcn-style primitives: Button, Card, Badge, Drawer, Tooltip
│   │   ├── charts/
│   │   │   ├── ShapBarChart.tsx
│   │   │   ├── SeverityDonut.tsx
│   │   │   └── FalsePositiveTrend.tsx
│   │   ├── AlertCard.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── LiveEpsCounter.tsx
│   │   └── ConnectionStatusPill.tsx
│   ├── hooks/
│   │   ├── useWebSocket.ts             # reconnect w/ exponential backoff
│   │   ├── useAlerts.ts                # React Query wrapper
│   │   └── useLiveMetrics.ts
│   ├── services/
│   │   ├── api.ts                      # axios/fetch instance, base URL, interceptors
│   │   ├── alerts.service.ts
│   │   ├── transactions.service.ts
│   │   ├── quantum.service.ts
│   │   └── ai.service.ts
│   ├── types/
│   │   ├── alert.types.ts
│   │   ├── transaction.types.ts
│   │   ├── telemetry.types.ts
│   │   └── cbom.types.ts
│   ├── contexts/
│   │   └── WebSocketContext.tsx
│   ├── providers/
│   │   └── QueryProvider.tsx           # React Query client provider
│   ├── store/
│   │   └── uiStore.ts                  # zustand: filters, selected alert, theme
│   ├── constants/
│   │   ├── severity.ts
│   │   └── routes.ts
│   ├── utils/
│   │   ├── formatCurrency.ts
│   │   ├── formatRelativeTime.ts
│   │   └── riskColor.ts
│   └── styles/
│       └── globals.css                 # Tailwind base + CSS vars
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
