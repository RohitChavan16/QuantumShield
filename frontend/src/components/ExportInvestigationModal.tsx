import { useState } from 'react';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { 
  FileText, FileJson, FileSpreadsheet, Lock, Shield, EyeOff, 
  CheckCircle2, Clock, AlertTriangle, Key, Download, Loader2, Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/Tooltip';

interface ExportInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  totalFiltered: number;
}

export function ExportInvestigationModal({ isOpen, onClose, selectedCount, totalFiltered }: ExportInvestigationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Configuration State
  const [scope, setScope] = useState<'current' | 'selected' | 'filtered' | 'investigation'>('filtered');
  const [format, setFormat] = useState<'csv' | 'xlsx' | 'pdf' | 'json'>('csv');
  const [includedData, setIncludedData] = useState<Set<string>>(new Set(['details', 'summary']));
  const [securityOptions, setSecurityOptions] = useState<Set<string>>(new Set(['password', 'aes', 'audit']));
  const [exportAccess, setExportAccess] = useState('24h');
  const [justification, setJustification] = useState('');
  
  // 2FA State
  const [otp, setOtp] = useState('');

  const toggleSet = (set: Set<string>, value: string, updateSet: (s: Set<string>) => void) => {
    const newSet = new Set(set);
    if (newSet.has(value)) newSet.delete(value);
    else newSet.add(value);
    updateSet(newSet);
  };

  const handleGenerate = () => {
    if (!justification) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(2);
    }, 1200);
  };

  const handleVerify = () => {
    if (otp.length < 6) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 1500);
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setOtp('');
      setJustification('');
    }, 300);
  };

  const renderConfigStep = () => (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* 1. Export Scope */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">1. Export Scope</h3>
            <div className="flex flex-col gap-2">
              {[
                { id: 'current', label: 'Current Transaction', count: 1 },
                { id: 'selected', label: 'Selected Transactions', count: selectedCount },
                { id: 'filtered', label: 'Current Filtered Results', count: totalFiltered },
                { id: 'investigation', label: 'Current Investigation', count: totalFiltered },
              ].map(opt => (
                <label key={opt.id} className={cn(
                  "flex items-center justify-between p-3 rounded-card border cursor-pointer transition-colors",
                  scope === opt.id ? "bg-accent/10 border-accent text-text-primary shadow-[0_0_10px_rgba(34,211,238,0.2)]" : "bg-surface border-border text-text-secondary hover:border-accent/50"
                )}>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="scope" className="accent-accent cursor-pointer" checked={scope === opt.id} onChange={() => setScope(opt.id as any)} />
                    <span className="text-sm">{opt.label}</span>
                  </div>
                  <Badge variant="outline" className={cn(scope === opt.id ? "bg-accent/20 border-accent/40 text-accent" : "bg-[#4C1D95]/10 border-[#8B5CF6]/30 text-[#A78BFA]")}>{opt.count} records</Badge>
                </label>
              ))}
              <Tooltip content="Requires L3 Security Clearance or Admin privileges.">
                <label className="flex items-center justify-between p-3 rounded-card border bg-surface-alt/50 border-border/50 text-text-muted cursor-not-allowed opacity-50">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="scope" disabled className="cursor-not-allowed" />
                    <span className="text-sm">Entire Report (Full Database)</span>
                  </div>
                  <Lock className="w-4 h-4" />
                </label>
              </Tooltip>
            </div>
          </div>

          {/* 2. Export Format */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">2. Export Format</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'csv', icon: FileText, label: 'CSV', desc: 'Raw data analysis' },
                { id: 'xlsx', icon: FileSpreadsheet, label: 'Excel (.xlsx)', desc: 'Formatted reports' },
                { id: 'pdf', icon: FileText, label: 'PDF Report', desc: 'Executive summary' },
                { id: 'json', icon: FileJson, label: 'JSON', desc: 'System integration' },
              ].map(fmt => (
                <label key={fmt.id} className={cn(
                  "flex flex-col gap-1 p-3 rounded-card border cursor-pointer transition-colors",
                  format === fmt.id ? "bg-[#4C1D95]/20 border-[#8B5CF6] text-[#EDE9FE] shadow-[0_0_10px_rgba(139,92,246,0.2)]" : "bg-surface border-border text-text-secondary hover:border-[#8B5CF6]/50"
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <input type="radio" name="format" className="accent-[#8B5CF6] cursor-pointer" checked={format === fmt.id} onChange={() => setFormat(fmt.id as any)} />
                    <fmt.icon className={cn("w-4 h-4", format === fmt.id ? "text-[#A78BFA]" : "text-text-muted")} />
                    <span className="text-sm font-medium">{fmt.label}</span>
                  </div>
                  <span className="text-[10px] text-text-muted ml-6">{fmt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 7. Reason for Export */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">3. Reason for Export <span className="text-critical">*</span></h3>
            <div className="relative">
              <select 
                className="w-full appearance-none cursor-pointer bg-surface border border-border rounded-btn px-4 py-2 pr-10 text-sm focus:outline-none focus:border-accent text-text-primary transition-colors"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              >
                <option value="" disabled>Select justification...</option>
                <option value="audit">Compliance Audit</option>
                <option value="fraud">Fraud Investigation</option>
                <option value="mgmt">Management Review</option>
                <option value="dispute">Customer Dispute</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* 3. Include Data */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">4. Include Data</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'details', label: 'Transaction Details' },
                { id: 'summary', label: 'AI Summary' },
                { id: 'correlation', label: 'Correlation Analysis' },
                { id: 'mitre', label: 'MITRE ATT&CK' },
                { id: 'timeline', label: 'Timeline Events' },
                { id: 'risk', label: 'Risk Assessment' },
                { id: 'impact', label: 'Business Impact' },
                { id: 'notes', label: 'Analyst Notes' },
                { id: 'evidence', label: 'Evidence' },
                { id: 'metadata', label: 'System Metadata' },
              ].map(opt => (
                <label key={opt.id} className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer select-none transition-colors",
                  includedData.has(opt.id) ? "bg-accent/20 border-accent text-accent shadow-[0_0_8px_rgba(34,211,238,0.2)]" : "bg-surface border-border text-text-muted hover:border-accent/50"
                )}>
                  <input type="checkbox" className="hidden" checked={includedData.has(opt.id)} onChange={() => toggleSet(includedData, opt.id, setIncludedData)} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* 4. Security Options & Access */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">5. Security Controls</h3>
            <div className="flex flex-col gap-2 bg-surface-alt p-3 rounded-card border border-border">
              {[
                { id: 'password', icon: Key, label: 'Password Protect Export' },
                { id: 'aes', icon: Shield, label: 'AES-256 File Encryption (Required)' },
                { id: 'watermark', icon: FileText, label: 'Watermark Report as Confidential' },
                { id: 'mask', icon: EyeOff, label: 'Mask Sensitive Customer Info' },
                { id: 'audit', icon: Clock, label: 'Generate Audit Trail (Required)' },
              ].map(opt => {
                const isRequired = opt.id === 'aes' || opt.id === 'audit';
                return (
                  <label key={opt.id} className={cn(
                    "flex items-center gap-3 p-2 rounded cursor-pointer transition-colors",
                    isRequired ? "opacity-70 cursor-not-allowed" : "hover:bg-surface"
                  )}>
                    <input 
                      type="checkbox" 
                      className="accent-[#8B5CF6] w-4 h-4 cursor-pointer" 
                      checked={isRequired || securityOptions.has(opt.id)} 
                      onChange={() => !isRequired && toggleSet(securityOptions, opt.id, setSecurityOptions)}
                      disabled={isRequired}
                    />
                    <opt.icon className="w-4 h-4 text-[#A78BFA]" />
                    <span className="text-sm text-text-secondary">{opt.label}</span>
                  </label>
                );
              })}
              
              <div className="mt-2 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-sm text-text-secondary">Export Access Expires</span>
                <select 
                  className="bg-surface border border-border rounded-btn px-2 py-1 text-xs focus:border-[#8B5CF6] outline-none text-text-primary cursor-pointer transition-colors"
                  value={exportAccess}
                  onChange={(e) => setExportAccess(e.target.value)}
                >
                  <option value="never">Never Expires</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Export Preview */}
      <div className="bg-surface-alt border border-border rounded-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-text-muted">Format</p>
              <p className="text-sm font-semibold text-accent uppercase">{format}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted">Estimated Size</p>
            <p className="text-sm font-semibold text-[#EDE9FE]">~{(includedData.size * 45).toFixed(0)} KB</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Protection</p>
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-low" />
              <span className="text-sm font-semibold text-low">Secured</span>
            </div>
          </div>
        </div>
        
        {/* 9. Security Warning */}
        <div className="flex items-center gap-2 text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1.5 rounded-full border border-[#F59E0B]/20">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-medium">Export operations are audited.</span>
        </div>
      </div>
    </div>
  );

  const render2FA = () => (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in zoom-in-95 fade-in duration-200">
      <div className="w-16 h-16 bg-accent/20 border border-accent/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
        <Shield className="w-8 h-8 text-accent" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-2">Identity Verification Required</h3>
      <p className="text-sm text-text-secondary mb-8 max-w-sm">
        To export sensitive banking data, please enter the 6-digit verification code sent to your registered authenticator app or mobile device.
      </p>
      
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <Input 
          className="text-center tracking-[0.5em] text-lg h-12 bg-surface-alt border-accent/50 focus:border-accent" 
          placeholder="000000" 
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
        />
        <Button 
          className="w-full bg-accent hover:bg-[#0891B2] text-black h-12 text-lg font-semibold"
          disabled={otp.length < 6 || isGenerating}
          onClick={handleVerify}
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Generate'}
        </Button>
        <p className="text-xs text-text-muted mt-4">(Note: This verification step is mocked for demonstration)</p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in zoom-in-95 fade-in duration-200">
      <div className="w-20 h-20 bg-low/20 border border-low/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
        <CheckCircle2 className="w-10 h-10 text-low" />
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-2">Export Ready</h3>
      <p className="text-sm text-text-secondary mb-8 max-w-sm">
        Your investigation export has been securely generated and encrypted.
      </p>

      <div className="bg-surface-alt border border-border rounded-card p-4 w-full max-w-md text-left flex flex-col gap-3 mb-8">
        <div className="flex justify-between items-center pb-3 border-b border-border">
          <span className="text-xs text-text-muted">Export Reference ID</span>
          <span className="text-sm font-mono text-accent">EXP-8492-BX9</span>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-low" />
          <span className="text-sm text-text-secondary">AES-256 Encryption <strong className="text-text-primary">Enabled</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-accent" />
          <span className="text-sm text-text-secondary">Audit Log <strong className="text-text-primary">Recorded</strong></span>
        </div>
      </div>

      <Button className="w-full max-w-md h-12 bg-accent hover:bg-[#0891B2] text-black font-bold text-lg" onClick={resetAndClose}>
        <Download className="w-5 h-5 mr-2" /> Download Secure File
      </Button>
    </div>
  );

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={isGenerating ? () => {} : resetAndClose} 
      title={step === 1 ? "Export Investigation" : step === 2 ? "Security Verification" : "Export Success"}
      className="max-w-5xl w-[95vw]"
    >
      <div className="p-6 pt-2 overflow-y-auto max-h-[65vh] custom-scrollbar">
        {step === 1 && renderConfigStep()}
        {step === 2 && render2FA()}
        {step === 3 && renderSuccess()}
      </div>
      
      {step === 1 && (
        <div className="px-6 py-4 border-t border-border bg-surface-alt flex items-center justify-end gap-3 rounded-b-card">
          <Button variant="outline" onClick={resetAndClose} disabled={isGenerating}>Cancel</Button>
          <Button variant="outline" className="border-accent/50 text-accent hover:bg-accent/10" disabled={isGenerating}>Preview</Button>
          <Button 
            className="bg-accent hover:bg-[#0891B2] text-black font-semibold disabled:opacity-50"
            onClick={handleGenerate}
            disabled={!justification || isGenerating}
          >
            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin text-black" /> Preparing...</> : 'Generate Export'}
          </Button>
        </div>
      )}
    </Dialog>
  );
}
