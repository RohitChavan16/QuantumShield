export const MOCK_ALERTS = [
  {
    id: "ALT-8492-BX",
    severity: "critical",
    status: "NEW",
    score: 94,
    timestamp: new Date(Date.now() - 1000 * 12).toISOString(),
    entity_id: "EP-WS-NYC-04",
    factors: ["EDR_COMPROMISE_PROCESS", "IMPOSSIBLE_TRAVEL", "DATA_EXFILTRATION"],
    linked_transaction: {
      id: "TXN-8849-01",
      amount: 450000,
      sender: "ACCT-9901-CORP",
      receiver: "ACCT-8120-EXT",
    },
    raw: {
      process: "powershell.exe -enc JABz...",
      ip: "185.15.2.x",
      user: "jdoe"
    }
  },
  {
    id: "ALT-8491-AZ",
    severity: "high",
    status: "INVESTIGATING",
    score: 76,
    timestamp: new Date(Date.now() - 1000 * 300).toISOString(),
    entity_id: "USR-SVC-ACCOUNT",
    factors: ["MULTIPLE_FAILED_LOGINS", "OFF_HOURS_ACCESS"],
    linked_transaction: null,
    raw: {}
  },
  {
    id: "ALT-8488-CX",
    severity: "medium",
    status: "NEW",
    score: 55,
    timestamp: new Date(Date.now() - 1000 * 1200).toISOString(),
    entity_id: "TXN-7110-88",
    factors: ["AMOUNT_OUT_OF_PROFILE"],
    linked_transaction: {
      id: "TXN-7110-88",
      amount: 15000,
      sender: "ACCT-1022-RETAIL",
      receiver: "ACCT-0091-EXT",
    },
    raw: {}
  }
];

export const MOCK_KPIS = {
  active_alerts: 14,
  mttd_avg_seconds: 1.2,
  blocked_amount: 1250000,
};

export const MOCK_TRANSACTIONS = [
  { id: "TXN-8849-01", sender: "ACCT-9901-CORP", receiver: "ACCT-8120-EXT", amount: 450000, endpoint_id: "EP-WS-NYC-04", risk_score: 94, correlated: true, decision: "BLOCK", timestamp: new Date(Date.now() - 1000 * 12).toISOString() },
  { id: "TXN-7110-88", sender: "ACCT-1022-RETAIL", receiver: "ACCT-0091-EXT", amount: 15000, endpoint_id: "EP-MOB-881", risk_score: 55, correlated: true, decision: "HOLD", timestamp: new Date(Date.now() - 1000 * 1200).toISOString() },
  { id: "TXN-1122-09", sender: "ACCT-5531-CORP", receiver: "ACCT-9999-INT", amount: 2000, endpoint_id: "EP-WS-LON-01", risk_score: 12, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 3600).toISOString() },
  { id: "TXN-4421-11", sender: "ACCT-1100-RETAIL", receiver: "ACCT-4412-EXT", amount: 80000, endpoint_id: "EP-WS-NYC-02", risk_score: 45, correlated: false, decision: "ALLOW", timestamp: new Date(Date.now() - 1000 * 7200).toISOString() },
  { id: "TXN-9910-44", sender: "ACCT-9901-CORP", receiver: "ACCT-8888-EXT", amount: 1200000, endpoint_id: "EP-WS-NYC-04", risk_score: 88, correlated: true, decision: "BLOCK", timestamp: new Date(Date.now() - 1000 * 86400).toISOString() },
];
