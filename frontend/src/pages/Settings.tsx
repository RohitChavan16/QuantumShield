import { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { AlertTriangle, PlayCircle, Save, DatabaseBackup } from 'lucide-react';

export function Settings() {
  const { toast } = useToast();
  
  // Thresholds state
  const [thresholds, setThresholds] = useState({ critical: 80, high: 50, medium: 20 });
  const [isSaving, setIsSaving] = useState(false);

  // Demo Actions state
  const [isResetting, setIsResetting] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const handleSaveThresholds = async () => {
    setIsSaving(true);
    try {
      // Mock API PUT
      await new Promise(r => setTimeout(r, 600));
      toast({ title: 'Risk thresholds updated successfully', type: 'success' });
    } catch (e) {
      toast({ title: 'Failed to update thresholds', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm("This will clear all current alerts and reset to seed state. Continue?")) return;
    
    setIsResetting(true);
    try {
      // Mock API POST
      await new Promise(r => setTimeout(r, 1000));
      toast({ title: 'Demo data reset to seed state', type: 'success' });
    } catch (e) {
      toast({ title: 'Reset failed', type: 'error' });
    } finally {
      setIsResetting(false);
    }
  };

  const triggerScenario = async (scenarioId: string, name: string) => {
    setActiveScenario(scenarioId);
    try {
      // Mock API POST
      await new Promise(r => setTimeout(r, 1500));
      toast({ 
        title: `Scenario '${name}' triggered`, 
        description: 'View on Fusion Dashboard →', 
        type: 'success', 
        duration: 8000 
      });
    } catch (e) {
      toast({ title: 'Failed to trigger scenario', type: 'error' });
    } finally {
      setActiveScenario(null);
    }
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-4xl mx-auto w-full pb-10">
      <div>
        <h2 className="text-xl font-bold tracking-tight">System Settings</h2>
        <p className="text-sm text-text-muted">Operational configuration and demo control (Admin only)</p>
      </div>

      {/* Risk Thresholds */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-alt/30">
          <h3 className="font-semibold text-lg">Risk Thresholds</h3>
          <p className="text-sm text-text-muted">Adjust the score boundaries for alert severity classification.</p>
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary flex justify-between">
                Critical <span className="text-critical font-mono">{thresholds.critical}+</span>
              </label>
              <input 
                type="range" min="0" max="100" 
                value={thresholds.critical} 
                onChange={(e) => setThresholds({ ...thresholds, critical: parseInt(e.target.value) })}
                className="w-full accent-critical"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary flex justify-between">
                High <span className="text-high font-mono">{thresholds.high}+</span>
              </label>
              <input 
                type="range" min="0" max="100" 
                value={thresholds.high} 
                onChange={(e) => setThresholds({ ...thresholds, high: parseInt(e.target.value) })}
                className="w-full accent-high"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary flex justify-between">
                Medium <span className="text-medium font-mono">{thresholds.medium}+</span>
              </label>
              <input 
                type="range" min="0" max="100" 
                value={thresholds.medium} 
                onChange={(e) => setThresholds({ ...thresholds, medium: parseInt(e.target.value) })}
                className="w-full accent-medium"
              />
            </div>
          </div>
          <div className="pt-2">
            <Button onClick={handleSaveThresholds} isLoading={isSaving}>
              <Save className="w-4 h-4 mr-2" /> Save Thresholds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attack Scenario Trigger (Prominent) */}
      <Card className="border-accent/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
        <div className="p-4 border-b border-border bg-accent/5">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-accent" /> Attack Scenario Simulator
          </h3>
          <p className="text-sm text-text-muted">Trigger canned attack sequences for live demonstration.</p>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScenarioCard 
              name="Treasury Compromise" 
              desc="Impossible travel leading to data exfil and large transfer."
              id="scen_treasury"
              onTrigger={() => triggerScenario('scen_treasury', 'Treasury Compromise')}
              isLoading={activeScenario === 'scen_treasury'}
              disabled={!!activeScenario && activeScenario !== 'scen_treasury'}
            />
            <ScenarioCard 
              name="Impossible Travel" 
              desc="Rapid successive logins from geographically distant IPs."
              id="scen_travel"
              onTrigger={() => triggerScenario('scen_travel', 'Impossible Travel')}
              isLoading={activeScenario === 'scen_travel'}
              disabled={!!activeScenario && activeScenario !== 'scen_travel'}
            />
            <ScenarioCard 
              name="Credential Stuffing Burst" 
              desc="High volume of failed logins against multiple accounts."
              id="scen_stuffing"
              onTrigger={() => triggerScenario('scen_stuffing', 'Credential Stuffing Burst')}
              isLoading={activeScenario === 'scen_stuffing'}
              disabled={!!activeScenario && activeScenario !== 'scen_stuffing'}
            />
            <ScenarioCard 
              name="Ransomware Encryption" 
              desc="Mass file modification followed by lateral movement."
              id="scen_ransomware"
              onTrigger={() => triggerScenario('scen_ransomware', 'Ransomware Encryption')}
              isLoading={activeScenario === 'scen_ransomware'}
              disabled={!!activeScenario && activeScenario !== 'scen_ransomware'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Demo Controls (Danger Zone) */}
      <Card className="border-critical/30 overflow-hidden">
        <div className="p-4 border-b border-critical/20 bg-critical/5">
          <h3 className="font-semibold text-lg text-critical flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
          </h3>
        </div>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold">Reset Demo Data</h4>
            <p className="text-sm text-text-muted mt-1">Clears all current alerts, transactions, and state.</p>
          </div>
          <Button variant="destructive" onClick={handleResetDemo} isLoading={isResetting}>
            <DatabaseBackup className="w-4 h-4 mr-2" /> Reset State
          </Button>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="p-4 bg-surface-alt/10">
        <h4 className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">System Information</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-mono">
          <div><span className="text-text-muted block text-xs">Version</span> v1.0.0-rc.3</div>
          <div><span className="text-text-muted block text-xs">Environment</span> {import.meta.env.MODE}</div>
          <div><span className="text-text-muted block text-xs">API Endpoint</span> /api/v1</div>
          <div><span className="text-text-muted block text-xs">WS Protocol</span> wss://</div>
        </div>
      </Card>
    </div>
  );
}

function ScenarioCard({ name, desc, id: _id, onTrigger, isLoading, disabled }: { name: string, desc: string, id: string, onTrigger: () => void, isLoading: boolean, disabled: boolean }) {
  return (
    <div className="border border-border p-4 rounded-card flex flex-col justify-between hover:bg-surface-alt/30 transition-colors">
      <div className="mb-4">
        <h4 className="font-semibold text-sm">{name}</h4>
        <p className="text-xs text-text-muted mt-1 leading-relaxed">{desc}</p>
      </div>
      <Button 
        size="sm" 
        variant="secondary" 
        className="w-full"
        onClick={onTrigger}
        isLoading={isLoading}
        disabled={disabled}
      >
        Trigger Scenario
      </Button>
    </div>
  );
}
