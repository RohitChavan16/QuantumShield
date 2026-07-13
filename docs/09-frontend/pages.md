# Frontend Pages

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Core UI screens for the React dashboard.

**Global shell:** Dark theme (navy `#0B0F1A` bg, cyan `#22D3EE` accent, red `#EF4444` critical, amber `#F59E0B` high), sidebar navigation, and a top bar with a live EPS counter + system health pill.

---

## 1. Fusion Dashboard (SOC Analyst) 
*(Primary Demo Screen)*

- **Purpose:** Unified live view correlating cyber + transaction alerts.
- **Components:**
  - **Live Alert Feed (Left, 40%):** Scrolling cards, color-coded by severity, auto-scroll-pause-on-hover, new-alert slide-in animation.
  - **Attack Path Graph (Right, 60%):** React Flow canvas showing `Endpoint → User → Account → Recipient` nodes. Edges pulse red when a live alert traverses that path.
  - **Top KPI strip:** EPS (events/sec), Active Alerts, MTTD (mocked calculated), Blocked Amount (₹).
  - **Filters:** severity, entity type, time range.
  - **States:** 
    - Empty: "No correlated threats — monitoring 3 streams" with pulsing radar icon.
    - Loading: skeleton cards.
    - Error: WS disconnected banner with auto-reconnect countdown.
- **Actions:** Click alert card → opens Alert Detail drawer (slide from right).

## 2. Alert Detail Drawer
- Correlation factors list (chips: "EDR Compromise", "Impossible Travel").
- SHAP-style horizontal bar chart (Recharts) of factor contribution %.
- Gemini-generated natural-language summary paragraph.
- Action buttons: Approve / Block / Escalate / Mark False Positive.
- Raw JSON toggle (to show real payload).

## 3. Threat Timeline
- Horizontal time-series (Recharts `ComposedChart`) of an entity's events (auth, endpoint, transaction) plotted on one axis to visually show the attack chain.

## 4. Transaction Explorer (Fraud Analyst)
- Table (sortable/filterable) of all transactions with `risk_score` column (color heatmap).
- Row click opens Alert Detail drawer if correlated, else a basic transaction card.
- Bulk actions toolbar.

## 5. Attack Graph (Full Screen)
- React Flow, force-directed layout. Node types: Endpoint (laptop), User (person), Account (bank), External IP (globe).
- Click node → side panel with entity risk history.

## 6. Quantum Risk Dashboard 
*(Secondary Differentiator)*
- **Donut chart:** % RSA-2048 vs % ECDHE-X25519 vs % ML-KEM-768 hybrid across scanned endpoints.
- **HNDL Risk gauge:** LOW/MEDIUM/HIGH per endpoint category.
- **Vulnerability feed:** "sess_02 using ECDHE-RSA-AES256 — NON-COMPLIANT, recommend ML-KEM upgrade."
- **Migration readiness %:** Progress bar (big number, judge-friendly).
- **Action:** "Run Compliance Scan" button (triggers quantum-scanner manually, animates progress).

## 7. AI Investigation Panel
- Chat-style panel allowing analysts to ask Gemini follow-up questions about an alert (e.g., "why is this high risk?"). The prompt is grounded with the alert's JSON context.
- Recommended actions list rendered from Gemini's structured response.

## 8. Executive Dashboard
- **Big numbers:** Fraud Prevented (₹), False Positive Rate trend line (before/after correlation).
- **Compliance status chips:** DORA / PCI-DSS / GDPR (green/amber).
- Simple and minimal for executives.

## 9. Case Management
- Kanban-lite: `New` → `Investigating` → `Resolved` columns (drag and drop).

## 10. Settings
- Threshold sliders for risk score bands (Critical/High/Medium).
- Toggle mock data generator on/off.
- API key configuration (Gemini).
