# Quantum Risk Module

**Version:** 1.0
**Last Updated:** 2026-07-13
**Scope:** Harvest-Now-Decrypt-Later (HNDL) risk monitoring.
**Related Documents:** [ADR-006](../18-decisions/ADR-006-quantum-module.md)

## 1. MVP Implementation Strategy

For the hackathon, we simulate posture scanning rather than attempting a multi-week deep TLS protocol integration. We seed 15–20 mock "endpoints" (e.g., API gateway, mobile app, core banking, SWIFT link) each with a TLS config.

### Logic (Go)

```go
type CBOMScanner struct{ safeCiphers map[string]bool }

func (s *CBOMScanner) AnalyzeSession(sessionID, tlsVersion, cipherSuite string) ScanResult {
    isSafe := (tlsVersion == "1.3") && s.safeCiphers[cipherSuite]
    hndlRisk := "LOW"
    action := "NONE"
    
    if !isSafe { 
        hndlRisk = "HIGH"
        action = "UPGRADE_TO_MLKEM_HYBRID" 
    }
    
    return ScanResult{
        SessionID: sessionID, 
        Compliant: isSafe, 
        HNDLRisk: hndlRisk, 
        RecommendedAction: action,
    }
}
```

## 2. Interactive Demo Moment

The Quantum Dashboard shows the migration readiness percentage ticking up if a user manually "patches" an endpoint. 
- **Action:** Clicking "Simulate ML-KEM Migration" flips one row in the database to compliant, and the chart animates.

## 3. Production Roadmap

In the real-world production version, the module will perform real TLS handshake introspection via `crypto/tls` connection state inspection across live endpoints. It will integrate with a real CBOM tool (exporting in CycloneDX format), run scheduled recurring scans, and alert when a new non-compliant cert is provisioned.
