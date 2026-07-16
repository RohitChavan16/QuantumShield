# Frontend Pages

**Version:** 1.1
**Last Updated:** 2026-07-16
**Scope:** Core UI screens for the React dashboard.

**Global shell:** Dark theme (navy `#0B0F1A` bg, cyan `#22D3EE` accent, red `#EF4444` critical, amber `#F59E0B` high), sidebar navigation, and a top bar with a live EPS counter + system health pill.

---

## 1. Fusion Dashboard (SOC Analyst) 
*(Primary Demo Screen)*

- **Purpose:** Unified live view correlating cyber + transaction alerts.
- **Data Fields Consumed:**
  - **KPIs (`MOCK_KPIS`):** `active_alerts` (number), `mttd_avg_seconds` (number), `blocked_amount` (number).
  - **Alerts (`MOCK_ALERTS`):**
    - `id` (string), `severity` (string: 'critical'|'high'|'medium'), `status` (string), `score` (number), `timestamp` (ISO string).
    - `entity_id` (string), `factors` (array of strings).
    - `linked_transaction` (object or null: `id`, `amount`, `sender`, `receiver`).
    - `raw` (object: e.g. `process`, `ip`, `user`).
    - `correlation` (object: `score`, `signals`, `telemetry_contribution`, `transaction_contribution`).
    - `impact` (object: `financial_exposure`, `affected_customers`, `affected_accounts`, `compliance_risk`, `recovery_priority`, `risk_classification`).
    - `ai_insight` (object: `reason`, `evidence`, `impact`, `confidence`, `recommended_action`).
    - `quantum` (object: `readiness_score`, `assets_at_risk`, `cbom_coverage`, `migration_progress`, `critical_alerts`).
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
- **Data Fields Consumed:** Same `MOCK_ALERTS` fields as the Fusion Dashboard, heavily utilizing `correlation`, `ai_insight`, `impact`, `factors`, and `raw` JSON fields.
- **Components:**
  - Correlation factors list (chips: "EDR Compromise", "Impossible Travel").
  - SHAP-style horizontal bar chart (Recharts) of factor contribution % (from `telemetry_contribution` & `transaction_contribution`).
  - Gemini-generated natural-language summary paragraph (from `ai_insight`).
  - Action buttons: Approve / Block / Escalate / Mark False Positive.
  - Raw JSON toggle (to show real payload from `raw`).

## 3. Threat Timeline
- **Data Fields Consumed (`EnterpriseTimelineEvent`):**
  - `id` (string), `time` (number).
  - `lane` (string: 'Identity' | 'Endpoint' | 'Network' | 'Transaction' | 'AI Engine').
  - `type` (string), `severity` (string: 'critical'|'high'|'medium'|'low'|'info').
  - `entity` (string), `mitre` (optional string), `description` (string).
  - `aiCorrelated` (boolean).
  - `evidence` (array of `TimelineEventEvidence`: `label`, `type` ('log'|'pcap'|'transaction'|'intel'), `value`, `raw`).
  - `linkedTo` (optional array of IDs).
- **Components:**
  - Horizontal time-series (Recharts `ComposedChart`) of an entity's events (auth, endpoint, transaction) plotted on one axis to visually show the attack chain.
  - Global header with an AI Timeline Summary and export capabilities.
  - Interactive scrubbing and playback tools.

## 4. Transaction Explorer (Fraud Analyst)
- **Data Fields Consumed (`MOCK_TRANSACTIONS`):**
  - `id`, `sender`, `receiver`, `amount`, `endpoint_id`.
  - `risk_score` (number), `correlated` (boolean), `decision` (string: 'BLOCK'|'HOLD'|'ALLOW'), `timestamp`.
  - `transaction_type` (string: 'RTGS'|'IMPS'|'SWIFT'|'NEFT'|'UPI').
  - `threat_category`, `assigned_analyst`, `correlation_score`, `ai_confidence`.
  - `mitre_techniques` (array of strings), `case_id`, `branch`, `business_unit`.
- **Components:**
  - Table (sortable/filterable) of all transactions with `risk_score` column (color heatmap).
  - Row click opens Alert Detail drawer if correlated, else a basic transaction card.
  - Bulk actions toolbar.

## 5. Attack Graph (Full Screen)
- **Data Fields Consumed:** Leverages `MOCK_ALERTS` fields specifically `entity_id`, `factors`, and `linked_transaction` to construct nodes dynamically.
- **Components:**
  - React Flow, force-directed layout. Node types: Endpoint (laptop), User (person), Account (bank), External IP (globe).
  - Click node → side panel with entity risk history.

## 6. Quantum Risk Dashboard 
*(Secondary Differentiator)*
- **Data Fields Consumed:**
  - **CBOM Data:** `total_assets`, `compliant_assets`, `exposure_breakdown` (e.g., `'RSA-2048'`, `'ECDHE-X25519'`, `'ML-KEM-768'`).
  - **Endpoint Vulnerabilities:** `id`, `cipher`, `risk` ('high'|'medium'|'low'), `status` ('NON-COMPLIANT'|'COMPLIANT').
- **Components:**
  - **Donut chart:** % RSA-2048 vs % ECDHE-X25519 vs % ML-KEM-768 hybrid across scanned endpoints.
  - **HNDL Risk gauge:** LOW/MEDIUM/HIGH per endpoint category.
  - **Vulnerability feed:** "sess_02 using ECDHE-RSA-AES256 — NON-COMPLIANT, recommend ML-KEM upgrade." (Mapped from endpoint objects).
  - **Migration readiness %:** Progress bar (big number, judge-friendly).
  - **Action:** "Run Compliance Scan" button (triggers quantum-scanner manually, animates progress).

## 7. AI Investigation Panel
- **Data Fields Consumed:** 
  - Iterates over `MOCK_ALERTS` to populate the selectable alert list (uses `id`, `severity`, `factors`, `entity_id`).
  - **Internal Chat Model:** `id`, `role` ('user' | 'assistant'), `content` (markdown text).
- **Components:**
  - Chat-style panel allowing analysts to ask Gemini follow-up questions about an alert (e.g., "why is this high risk?"). The prompt is grounded with the alert's JSON context.
  - Recommended actions list rendered from Gemini's structured response.

## 8. Executive Dashboard
- **Data Fields Consumed:** Aggregated metrics built upon `MOCK_KPIS` and historical datasets (fraud prevented, false positive rate).
- **Components:**
  - **Big numbers:** Fraud Prevented (₹), False Positive Rate trend line (before/after correlation).
  - **Compliance status chips:** DORA / PCI-DSS / GDPR (green/amber).
  - Simple and minimal for executives.

## 9. Case Management
- **Data Fields Consumed:** Uses `MOCK_ALERTS` and focuses specifically on tracking fields like `status` ('NEW'|'INVESTIGATING'|'RESOLVED'), `severity`, and `timestamp`.
- **Components:**
  - Kanban-lite: `New` → `Investigating` → `Resolved` columns (drag and drop).

## 10. Settings
- **Components:**
  - Threshold sliders for risk score bands (Critical/High/Medium).
  - Toggle mock data generator on/off.
  - API key configuration (Gemini).
