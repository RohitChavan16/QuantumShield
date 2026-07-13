import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { MOCK_ALERTS, MOCK_KPIS } from '../services/mockData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { AlertDetailDrawer } from '../components/AlertDetailDrawer';
import { ArrowUpRight, ArrowDownRight, Radar, ShieldAlert, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWebSocket } from '../hooks/useWebSocket';

const initialNodes: Node[] = [
  { id: 'usr-1', position: { x: 50, y: 150 }, data: { label: 'jdoe' }, type: 'input' },
  { id: 'ep-1', position: { x: 250, y: 150 }, data: { label: 'EP-WS-NYC-04' } },
  { id: 'act-1', position: { x: 450, y: 50 }, data: { label: 'ACCT-9901-CORP' } },
  { id: 'ext-1', position: { x: 650, y: 50 }, data: { label: 'ACCT-8120-EXT' }, type: 'output' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'usr-1', target: 'ep-1', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } },
  { id: 'e2-3', source: 'ep-1', target: 'act-1', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } },
  { id: 'e3-4', source: 'act-1', target: 'ext-1', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } },
];

export function FusionDashboard() {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);
  useWebSocket(); // subscribe to events here in a real implementation

  const { data: kpis, isLoading: isKpisLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      if (import.meta.env.VITE_MOCK_MODE === 'true' || import.meta.env.DEV) {
        await new Promise(r => setTimeout(r, 300));
        return MOCK_KPIS;
      }
      const res = await api.get('/api/v1/dashboard/kpis');
      return res.data;
    }
  });

  const { data: alerts, isLoading: isAlertsLoading, isError } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      if (import.meta.env.VITE_MOCK_MODE === 'true' || import.meta.env.DEV) {
        await new Promise(r => setTimeout(r, 600));
        return MOCK_ALERTS;
      }
      const res = await api.get('/api/v1/alerts?status=NEW&limit=20');
      return res.data;
    }
  });

  useEffect(() => {
    if (alerts) setLiveAlerts(alerts);
  }, [alerts]);

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <KpiCard 
          title="Events/sec" 
          value="142" 
          trend="up" 
          isLoading={isKpisLoading} 
        />
        <KpiCard 
          title="Active Alerts" 
          value={kpis?.active_alerts} 
          trend="down" 
          isLoading={isKpisLoading} 
        />
        <KpiCard 
          title="MTTD" 
          value={`${kpis?.mttd_avg_seconds}s avg`} 
          trend="down" 
          isLoading={isKpisLoading} 
        />
        <KpiCard 
          title="Blocked Today" 
          value={kpis ? `₹${(kpis.blocked_amount / 100000).toFixed(1)}L` : ''} 
          trend="up" 
          isLoading={isKpisLoading} 
        />
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-[500px]">
        {/* Left: Alert Feed (40%) */}
        <Card className="w-full lg:w-[40%] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-alt/30 flex items-center justify-between shrink-0">
            <h2 className="font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-accent" /> Live Feed
            </h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-surface-alt">All</Badge>
              <Badge variant="critical" className="cursor-pointer">Critical</Badge>
              <Badge variant="high" className="cursor-pointer opacity-50">High</Badge>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isError && (
              <div className="bg-critical/10 text-critical text-sm p-3 rounded-card border border-critical/20 flex justify-between items-center">
                Couldn't load alerts <Button variant="outline" size="sm" className="h-6 text-xs bg-transparent border-critical/50 text-critical">Retry</Button>
              </div>
            )}
            
            {isAlertsLoading ? (
              <>
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </>
            ) : liveAlerts.length === 0 ? (
              <EmptyState 
                icon={Radar} 
                title="No correlated threats" 
                description="Monitoring 3 live streams. The graph will populate as events occur." 
              />
            ) : (
              <AnimatePresence>
                {liveAlerts.map(alert => (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group border border-border bg-surface hover:bg-surface-alt/50 rounded-card p-4 cursor-pointer relative overflow-hidden transition-colors"
                    onClick={() => setSelectedAlertId(alert.id)}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${alert.severity}`} />
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold">{alert.entity_id}</span>
                        {alert.status === 'NEW' && <span className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-glow" />}
                      </div>
                      <span className="text-xs text-text-muted">Just now</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {alert.factors.slice(0, 3).map((f: string) => (
                        <Badge key={f} variant="outline" className="text-[10px] py-0">{f.replace(/_/g, ' ')}</Badge>
                      ))}
                      {alert.factors.length > 3 && <Badge variant="outline" className="text-[10px] py-0">+{alert.factors.length - 3} more</Badge>}
                    </div>
                    <div className="flex justify-between items-end">
                      <span className={`font-mono text-2xl font-bold text-${alert.severity}`}>{alert.score}</span>
                      <span className="text-xs text-text-secondary">Risk Score</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </Card>

        {/* Right: Attack Graph (60%) */}
        <Card className="w-full lg:w-[60%] flex flex-col relative overflow-hidden bg-[#0A0D14]">
          <div className="absolute top-4 left-4 z-10">
            <h2 className="font-semibold flex items-center gap-2 bg-surface/80 backdrop-blur px-3 py-1.5 rounded-btn border border-border">
              <Share2 className="w-4 h-4 text-accent" /> Attack Path
            </h2>
          </div>
          <div className="flex-1 h-full w-full">
            <ReactFlow 
              nodes={initialNodes} 
              edges={initialEdges} 
              fitView 
              colorMode="dark"
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={16} color="rgba(255, 255, 255, 0.05)" />
              <Controls className="bg-surface border-border text-text-primary fill-text-primary" />
            </ReactFlow>
          </div>
        </Card>
      </div>

      <AlertDetailDrawer 
        isOpen={!!selectedAlertId} 
        onClose={() => setSelectedAlertId(null)} 
        alertId={selectedAlertId} 
      />
    </div>
  );
}

function KpiCard({ title, value, trend, isLoading }: { title: string, value: any, trend: 'up' | 'down', isLoading: boolean }) {
  return (
    <Card className="p-5 flex flex-col justify-between h-[104px]">
      <div className="text-sm text-text-secondary">{title}</div>
      {isLoading ? (
        <Skeleton className="h-8 w-24 mt-2" />
      ) : (
        <div className="flex items-end justify-between mt-1">
          <span className="font-mono text-3xl font-bold tracking-tight text-text-primary">{value}</span>
          <span className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-critical' : 'text-low'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            2.4%
          </span>
        </div>
      )}
    </Card>
  );
}
