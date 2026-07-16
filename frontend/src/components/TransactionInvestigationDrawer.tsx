import { X, ExternalLink, Activity, Network, Target, Crosshair, ShieldAlert, Shield, FileText, ChevronRight, History } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Tooltip } from './ui/Tooltip';
import { Link } from 'react-router-dom';

interface TransactionInvestigationDrawerProps {
  transaction: any;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionInvestigationDrawer({ transaction, isOpen, onClose }: TransactionInvestigationDrawerProps) {
  if (!isOpen || !transaction) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-[800px] bg-bg-base border-l border-border z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0 bg-surface/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold font-mono text-text-primary">{transaction.id}</h2>
              <Badge variant={
                transaction.decision === 'BLOCK' ? 'critical' : 
                transaction.decision === 'HOLD' ? 'high' : 'low'
              }>
                {transaction.decision}
              </Badge>
              {transaction.correlated && (
                <Badge variant="outline" className="border-accent text-accent">
                  <Network className="w-3 h-3 mr-1" />
                  Correlated
                </Badge>
              )}
            </div>
            <p className="text-sm text-text-secondary flex items-center gap-2">
              <History className="w-3 h-3" />
              {new Date(transaction.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* AI Executive Summary */}
          {transaction.risk_score > 50 && (
            <Card className="p-4 border-accent/30 bg-accent/5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent/10 rounded-lg shrink-0">
                  <Activity className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-accent mb-1 flex items-center gap-2">
                    AI Investigation Summary
                    <Badge variant="outline" className="text-[10px] h-4 px-1 border-accent/50 text-accent/80">Confidence: {transaction.ai_confidence || 90}%</Badge>
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Transaction flagged for <strong className="text-text-primary">{transaction.threat_category || 'Suspicious Activity'}</strong>. 
                    Pattern matching indicates a high probability of lateral movement followed by automated exfiltration attempts. 
                    {transaction.mitre_techniques?.length ? ` Aligns with ${transaction.mitre_techniques.join(', ')}.` : ''}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Core Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 space-y-4">
              <h3 className="text-sm font-semibold text-text-muted flex items-center gap-2 mb-4">
                <Target className="w-4 h-4" /> Transaction Details
              </h3>
              
              <div>
                <p className="text-xs text-text-muted mb-1">Amount</p>
                <p className="text-lg font-mono font-bold text-critical">
                  ₹{(transaction.amount || 0).toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-text-muted mb-1">Transaction Type</p>
                <p className="text-sm font-medium">{transaction.transaction_type || 'Unknown'}</p>
              </div>

              <div>
                <p className="text-xs text-text-muted mb-1">Business Unit / Branch</p>
                <p className="text-sm">{transaction.business_unit || 'N/A'} • {transaction.branch || 'N/A'}</p>
              </div>
            </Card>

            <Card className="p-4 space-y-4">
              <h3 className="text-sm font-semibold text-text-muted flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4" /> Risk Assessment
              </h3>

              <div className="flex items-end gap-3">
                <div>
                  <p className="text-xs text-text-muted mb-1">Risk Score</p>
                  <p className={`text-2xl font-bold font-mono ${transaction.risk_score > 80 ? 'text-critical' : transaction.risk_score > 50 ? 'text-high' : 'text-low'}`}>
                    {transaction.risk_score}/100
                  </p>
                </div>
                {transaction.correlation_score > 0 && (
                  <div className="pb-1">
                    <Badge variant="outline" className="border-border text-text-secondary">
                      Correlation: {transaction.correlation_score}%
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-text-muted mb-1">Threat Category</p>
                <p className="text-sm text-high">{transaction.threat_category || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-xs text-text-muted mb-1">Assigned Analyst</p>
                <p className="text-sm flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${transaction.assigned_analyst && transaction.assigned_analyst !== 'Unassigned' ? 'bg-low' : 'bg-text-muted'}`} />
                  {transaction.assigned_analyst || 'Unassigned'}
                </p>
              </div>
            </Card>
          </div>

          {/* Participants */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-text-muted flex items-center gap-2 mb-4">
              <Crosshair className="w-4 h-4" /> Participants & Endpoints
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-alt/50 border border-border/50">
                <div>
                  <p className="text-xs text-text-muted mb-1">Sender Account</p>
                  <p className="font-mono text-sm">{transaction.sender}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-muted mb-1">Endpoint Origin</p>
                  <Tooltip content="Click to view endpoint investigation">
                    <Link to={`/ai-investigation?entity=${transaction.endpoint_id}`} className="font-mono text-sm text-accent hover:underline flex items-center gap-1 justify-end">
                      {transaction.endpoint_id} <ExternalLink className="w-3 h-3" />
                    </Link>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="h-6 w-px bg-border"></div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-alt/50 border border-border/50">
                <div>
                  <p className="text-xs text-text-muted mb-1">Receiver Account</p>
                  <p className="font-mono text-sm">{transaction.receiver}</p>
                </div>
                <div className="text-right">
                  <Badge variant={transaction.receiver.includes('EXT') ? 'high' : 'low'} className="text-[10px]">
                    {transaction.receiver.includes('EXT') ? 'External Beneficiary' : 'Internal Account'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* MITRE Mapping */}
          {transaction.mitre_techniques && transaction.mitre_techniques.length > 0 && (
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-text-muted flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4" /> MITRE ATT&CK Mapping
              </h3>
              <div className="flex flex-wrap gap-2">
                {transaction.mitre_techniques.map((tech: string, i: number) => (
                  <Badge key={i} variant="outline" className="border-border bg-surface-alt/30 text-text-secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Case / Alert Link */}
          {(transaction.case_id || transaction.correlated) && (
            <Card className="p-4 border-accent/20">
               <h3 className="text-sm font-semibold text-text-muted flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4" /> Linked Investigations
              </h3>
              
              <div className="flex items-center gap-4">
                {transaction.case_id && (
                  <Link to={`/cases?caseId=${transaction.case_id}`}>
                    <Button variant="outline" className="w-full justify-between group">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-accent" />
                        {transaction.case_id}
                      </span>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                    </Button>
                  </Link>
                )}
                {transaction.correlated && (
                  <Link to={`/attack-graph?alertId=ALT-8492-BX`}>
                    <Button variant="outline" className="w-full justify-between group">
                      <span className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-accent" />
                        View Attack Graph
                      </span>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          )}
          
        </div>

        {/* Footer Actions / Navigation */}
        <div className="p-4 border-t border-border bg-surface-alt/30 grid grid-cols-2 gap-3 shrink-0">
          <Link to={`/attack-graph?alertId=${transaction.id}`} className="block">
            <button className="w-full flex items-center justify-center gap-2 p-3 rounded-btn border border-[#F87171] bg-[#EF4444]/20 text-[#FCA5A5] hover:bg-[#EF4444]/40 transition-colors cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.2)] font-semibold text-sm">
              <Network className="w-4 h-4" />
              Attack Graph
            </button>
          </Link>
          
          <Link to={`/threat-timeline?entity=${transaction.sender || transaction.id}`} className="block">
            <button className="w-full flex items-center justify-center gap-2 p-3 rounded-btn border border-[#FBBF24] bg-[#F59E0B]/20 text-[#FDE68A] hover:bg-[#F59E0B]/40 transition-colors cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)] font-semibold text-sm">
              <History className="w-4 h-4" />
              Threat Timeline
            </button>
          </Link>
          
          <Link to={`/transaction-explorer?alertId=${transaction.id}`} className="block">
            <button className="w-full flex items-center justify-center gap-2 p-3 rounded-btn border border-[#34D399] bg-[#10B981]/20 text-[#A7F3D0] hover:bg-[#10B981]/40 transition-colors cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold text-sm">
              <Activity className="w-4 h-4" />
              Txn Explorer
            </button>
          </Link>
          
          <Link to={`/ai-investigation?alertId=${transaction.id}`} className="block">
            <button className="w-full flex items-center justify-center gap-2 p-3 rounded-btn border border-[#A78BFA] bg-[#8B5CF6]/20 text-[#DDD6FE] hover:bg-[#8B5CF6]/40 transition-colors cursor-pointer shadow-[0_0_10px_rgba(139,92,246,0.2)] font-semibold text-sm">
              <Activity className="w-4 h-4" />
              AI Investigation
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
