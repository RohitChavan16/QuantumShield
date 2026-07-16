import { Shield, Server, Network, CreditCard, BrainCircuit, Activity, Tag, Lock } from 'lucide-react';
import type { EnterpriseTimelineEvent } from '../services/mockData';
import { cn } from '../lib/utils';

interface TimelineEventCardProps {
  event: EnterpriseTimelineEvent;
  isSelected: boolean;
  isDimmed: boolean;
  onClick: (event: EnterpriseTimelineEvent) => void;
}

const getLaneIcon = (lane: string) => {
  switch (lane) {
    case 'Identity': return <Shield className="w-4 h-4" />;
    case 'Endpoint': return <Server className="w-4 h-4" />;
    case 'Network': return <Network className="w-4 h-4" />;
    case 'Transaction': return <CreditCard className="w-4 h-4" />;
    case 'AI Engine': return <BrainCircuit className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'border-critical text-critical shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-critical/10';
    case 'high': return 'border-high text-high shadow-[0_0_15px_rgba(245,158,11,0.2)] bg-high/10';
    case 'medium': return 'border-medium text-medium bg-medium/10';
    case 'low': return 'border-low text-low bg-low/10';
    case 'info': return 'border-accent text-accent shadow-[0_0_15px_rgba(34,211,238,0.2)] bg-accent/10';
    default: return 'border-border text-text-muted bg-surface';
  }
};

export function TimelineEventCard({ event, isSelected, isDimmed, onClick }: TimelineEventCardProps) {
  const sevColor = getSeverityColor(event.severity);
  
  return (
    <div 
      className={cn(
        "relative w-[280px] shrink-0 bg-surface border rounded-card p-3 flex flex-col gap-2 cursor-pointer transition-all duration-300 group hover:border-accent/50",
        isSelected ? "border-accent ring-1 ring-accent shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "border-border",
        isDimmed ? "opacity-30 grayscale" : "opacity-100",
      )}
      onClick={() => onClick(event)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md border", sevColor)}>
            {getLaneIcon(event.lane)}
          </div>
          <div>
            <p className="text-[10px] font-mono text-text-muted">
              {new Date(event.time).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
            </p>
            <p className="text-xs font-semibold text-text-primary line-clamp-1" title={event.type}>{event.type}</p>
          </div>
        </div>
        {event.aiCorrelated && (
          <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(34,211,238,0.8)]" title="AI Correlated Event" />
        )}
      </div>

      <div className="flex flex-col gap-1.5 mt-1">
        <div className="flex items-center gap-1.5 text-[10px] text-text-secondary bg-surface-alt/50 px-1.5 py-0.5 rounded w-max max-w-full truncate">
          <Tag className="w-3 h-3 shrink-0" />
          <span className="truncate">{event.entity}</span>
        </div>
        
        {event.mitre && (
          <div className="flex items-center gap-1.5 text-[10px] text-high/80 bg-high/10 px-1.5 py-0.5 rounded w-max max-w-full truncate border border-high/20">
            <Lock className="w-3 h-3 shrink-0" />
            <span className="truncate font-mono">{event.mitre.split(' ')[0]}</span>
          </div>
        )}
      </div>
      
      {/* Highlight glow on hover */}
      <div className="absolute inset-0 rounded-card pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-accent/5 to-transparent" />
    </div>
  );
}
