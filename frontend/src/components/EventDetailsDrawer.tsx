import { Drawer } from './ui/Drawer';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import type { EnterpriseTimelineEvent } from '../services/mockData';
import { Shield, Server, Network, CreditCard, BrainCircuit, Activity, Tag, Lock, FileJson } from 'lucide-react';
import { cn } from '../lib/utils';

interface EventDetailsDrawerProps {
  event: EnterpriseTimelineEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const getLaneIcon = (lane: string) => {
  switch (lane) {
    case 'Identity': return <Shield className="w-5 h-5" />;
    case 'Endpoint': return <Server className="w-5 h-5" />;
    case 'Network': return <Network className="w-5 h-5" />;
    case 'Transaction': return <CreditCard className="w-5 h-5" />;
    case 'AI Engine': return <BrainCircuit className="w-5 h-5" />;
    default: return <Activity className="w-5 h-5" />;
  }
};

export function EventDetailsDrawer({ event, isOpen, onClose }: EventDetailsDrawerProps) {
  if (!isOpen || !event) return null;

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose}
      className="w-full sm:w-[500px] max-w-full"
    >
      <div className="flex flex-col h-full bg-bg-base">
        {/* Header */}
        <div className="p-6 border-b border-border bg-surface-alt/30 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("p-2 rounded-lg border", 
              event.severity === 'critical' ? 'bg-critical/10 border-critical/30 text-critical' :
              event.severity === 'high' ? 'bg-high/10 border-high/30 text-high' :
              event.severity === 'medium' ? 'bg-medium/10 border-medium/30 text-medium' :
              event.severity === 'info' ? 'bg-accent/10 border-accent/30 text-accent' :
              'bg-low/10 border-low/30 text-low'
            )}>
              {getLaneIcon(event.lane)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary leading-tight">{event.type}</h2>
              <p className="text-xs text-text-muted font-mono mt-1">
                {new Date(event.time).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-[10px] uppercase">{event.severity}</Badge>
            <Badge variant="outline" className="text-[10px] uppercase border-accent/30 text-accent">{event.lane}</Badge>
            {event.aiCorrelated && (
              <Badge variant="outline" className="text-[10px] bg-accent/10 border-accent/50 text-accent gap-1">
                <BrainCircuit className="w-3 h-3" /> Correlated
              </Badge>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest">Description</h3>
            <p className="text-sm text-text-primary leading-relaxed bg-surface border border-border p-3 rounded-card">
              {event.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest">Target Entity</h3>
              <div className="flex items-center gap-2 bg-surface-alt/50 border border-border px-3 py-2 rounded-btn">
                <Tag className="w-4 h-4 text-accent" />
                <span className="text-sm font-mono truncate">{event.entity}</span>
              </div>
            </div>
            
            {event.mitre && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest">MITRE ATT&CK</h3>
                <div className="flex items-center gap-2 bg-high/10 border border-high/30 px-3 py-2 rounded-btn">
                  <Lock className="w-4 h-4 text-high" />
                  <span className="text-sm font-mono truncate text-high" title={event.mitre}>{event.mitre.split(' ')[0]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Evidence Panel */}
          {event.evidence && event.evidence.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                <FileJson className="w-4 h-4" /> Evidence & Telemetry
              </h3>
              
              {event.evidence.map((ev, idx) => (
                <div key={idx} className="border border-border rounded-card overflow-hidden">
                  <div className="bg-surface-alt/80 px-4 py-2 border-b border-border flex justify-between items-center">
                    <span className="text-xs font-semibold text-text-primary">{ev.label}</span>
                    <Badge variant="outline" className="text-[9px] uppercase">{ev.type}</Badge>
                  </div>
                  
                  {ev.raw ? (
                    <div className="bg-black/60 p-4 overflow-x-auto">
                      <pre className="text-xs font-mono text-emerald-400/90 leading-relaxed">
                        {JSON.stringify(JSON.parse(ev.raw), null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-surface p-4">
                      <p className="text-sm font-mono text-text-secondary">{ev.value}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-surface-alt flex gap-3 shrink-0">
          <Button className="flex-1 bg-critical hover:bg-critical/80 text-white border-transparent">
            Contain Entity
          </Button>
          <Button variant="outline" className="flex-1">
            Export JSON
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
