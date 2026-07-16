import { useState, useEffect, useMemo, useRef } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { MOCK_ALERTS, MOCK_KPIS } from '../services/mockData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { AlertDetailDrawer } from '../components/AlertDetailDrawer';
import { ArrowUpRight, ArrowDownRight, Radar, ShieldAlert, Share2, CheckCircle2, Network, Atom, Sparkles, Banknote, Clock, Info, ChevronDown, Crosshair, Server, TrendingUp, Search, ActivitySquare, History, Filter, User, Laptop, Database, Globe, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactFlow, Controls, Background, Handle, Position } from '@xyflow/react';
import { Link } from 'react-router-dom';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWebSocket } from '../hooks/useWebSocket';



const ICONS: Record<string, any> = {
  user: User,
  endpoint: Laptop,
  server: Server,
  database: Database,
  account: Banknote,
  external: Globe
};

function CustomEntityNode({ data }: { data: any }) {
  const Icon = ICONS[data.type] || Server;
  
  let statusColor = 'border-border text-text-muted';
  let shadow = '';
  if (data.status === 'compromised') {
    statusColor = 'border-critical text-critical';
    shadow = 'shadow-[0_0_15px_rgba(239,68,68,0.4)]';
  } else if (data.status === 'high_risk') {
    statusColor = 'border-amber-500 text-amber-500';
    shadow = 'shadow-[0_0_15px_rgba(245,158,11,0.4)]';
  } else if (data.status === 'blocked') {
    statusColor = 'border-emerald-500 text-emerald-500';
  }

  const isDimmed = data.isDimmed;

  return (
    <div className={`relative px-4 py-2 bg-surface border rounded-card flex items-center gap-3 transition-all ${statusColor} ${shadow} ${isDimmed ? 'opacity-30' : 'opacity-100'} hover:opacity-100 cursor-pointer`}>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className={`p-1.5 rounded bg-surface-alt ${statusColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-text-primary whitespace-nowrap">{data.label}</span>
        <span className="text-[9px] text-text-muted uppercase tracking-wider">{data.subtitle}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

function EntityDetailDrawer({ entity, isOpen, onClose }: { entity: any, isOpen: boolean, onClose: () => void }) {
  if (!entity) return null;
  const Icon = ICONS[entity.type] || Info;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-[400px] bg-surface border-l border-border z-50 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-border bg-surface-alt/30">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded bg-surface-alt ${entity.status === 'compromised' ? 'text-critical' : 'text-accent'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold">{entity.label}</h2>
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">{entity.subtitle}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 px-2 text-text-muted hover:text-text-primary">Close</Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-alt/30 p-3 rounded-card border border-border/50">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Risk Status</div>
                  <div className={`font-mono font-medium ${entity.status === 'compromised' ? 'text-critical' : entity.status === 'high_risk' ? 'text-amber-500' : 'text-emerald-500'}`}>{entity.status.replace('_', ' ').toUpperCase()}</div>
                </div>
                <div className="bg-surface-alt/30 p-3 rounded-card border border-border/50">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Entity ID</div>
                  <div className="font-mono text-sm">{entity.id}</div>
                </div>
              </div>

              {entity.metadata && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-text-secondary border-b border-border/50 pb-2">Properties</h3>
                  {Object.entries(entity.metadata).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center py-1">
                      <span className="text-xs text-text-muted">{k}</span>
                      <span className="text-xs font-mono">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              {entity.alerts && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-text-secondary border-b border-border/50 pb-2">Related Events</h3>
                  {entity.alerts.map((a: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 bg-critical/10 border border-critical/20 p-2 rounded">
                      <AlertTriangle className="w-3 h-3 text-critical mt-0.5 shrink-0" />
                      <span className="text-[10px] text-text-primary leading-tight">{a}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border bg-surface-alt/30 shrink-0">
               <Button className="w-full text-xs">Run Deep Scan</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function FusionDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const alertIdParam = searchParams.get('alertId');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(alertIdParam);
  const [hoveredSignalId, setHoveredSignalId] = useState<string | null>(null);
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);
  const [isEntityDrawerOpen, setIsEntityDrawerOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [activeScope, setActiveScope] = useState('selected_alert');
  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);
  const initialLoadDone = useRef(false);
  useWebSocket(); // subscribe to events here in a real implementation

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (alertIdParam !== selectedAlertId) {
      setSelectedAlertId(alertIdParam);
    }
  }, [alertIdParam]);

  const handleAlertClick = (id: string) => {
    setSearchParams({ alertId: id });
    setSelectedAlertId(id);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

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
    if (alerts) {
      setLiveAlerts(alerts);
      if (!initialLoadDone.current && !alertIdParam && alerts.length > 0) {
        setSelectedAlertId(alerts[0].id);
        initialLoadDone.current = true;
      }
    }
  }, [alerts, alertIdParam, setSearchParams]);

  const activeAlert = liveAlerts.find((a: any) => a.id === selectedAlertId) || null;

  const nodeTypes = useMemo(() => ({ custom: CustomEntityNode }), []);

  const { nodes, edges } = useMemo(() => {
    let baseNodes: Node[] = [
      { id: 'usr-1', position: { x: 50, y: 150 }, type: 'custom', data: { label: 'Sarah Jenkins', subtitle: 'VP Treasury', type: 'user', status: 'compromised', metadata: { Department: 'Treasury', Role: 'VP', 'Recent Logins': 'MUM, SIN, LON (Blocked)', 'Risk': '99/100' }, alerts: ['Phishing Email Clicked', 'Impossible Travel Detected'] } },
      { id: 'ep-1', position: { x: 250, y: 50 }, type: 'custom', data: { label: 'EP-MUM-TRES-04', subtitle: 'Win 10 Endpoint', type: 'endpoint', status: 'compromised', metadata: { OS: 'Windows 10 Pro', Owner: 'Sarah Jenkins', 'EDR Status': 'Disabled by Policy', 'Malware': 'Mimikatz' }, alerts: ['EDR Agent Terminated', 'LSASS Memory Dump'] } },
      { id: 'vpn-1', position: { x: 250, y: 250 }, type: 'custom', data: { label: 'APAC-VPN-GW', subtitle: 'Gateway', type: 'server', status: 'high_risk', metadata: { 'IP Address': '203.0.113.45', 'Location': 'Singapore', 'Auth': 'MFA Bypassed' }, alerts: ['MFA Fatigue Attack'] } },
      { id: 'srv-1', position: { x: 500, y: 150 }, type: 'custom', data: { label: 'HDFC-MUM-SWIFT-GW-01', subtitle: 'Linux Server', type: 'server', status: 'compromised', metadata: { 'OS': 'RHEL 8', 'Zone': 'Secure Enclave', 'Risk': '100/100' }, alerts: ['Unauthorized SSH Access', 'Service Account Brute Force'] } },
      { id: 'act-1', position: { x: 750, y: 50 }, type: 'custom', data: { label: 'ACCT-9901-CORP', subtitle: 'INR Treasury Account', type: 'account', status: 'high_risk', metadata: { 'Balance': '₹450,000,000', 'BU': 'Corporate Banking', 'Risk': 'High' }, alerts: ['Unusual Access Time', 'Large Beneficiary Addition'] } },
      { id: 'txn-1', position: { x: 950, y: 50 }, type: 'custom', data: { label: 'RTGS ₹4.5Cr', subtitle: 'Pending Transfer', type: 'account', status: 'blocked', metadata: { 'Amount': '₹45,000,000', 'Beneficiary': 'Global Corp Ltd', 'Status': 'Blocked by Correlation Engine' }, alerts: ['Anomaly Detected: Velocity', 'Pattern Matches Campaign X'] } },
      { id: 'ext-1', position: { x: 950, y: 250 }, type: 'custom', data: { label: '10.0.4.15', subtitle: 'Unmanaged IP', type: 'external', status: 'compromised', metadata: { 'Country': 'Unknown', 'ASN': 'AS1234', 'Threat Intel': 'Known C2 Server' }, alerts: ['Beaconing Activity', 'Data Exfiltration Attempt'] } }
    ];
    
    let baseEdges: Edge[] = [
      { id: 'e1-2', source: 'usr-1', target: 'ep-1', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } },
      { id: 'e1-3', source: 'usr-1', target: 'vpn-1', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } },
      { id: 'e2-4', source: 'ep-1', target: 'srv-1', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } },
      { id: 'e3-4', source: 'vpn-1', target: 'srv-1', animated: true, style: { stroke: 'var(--color-amber-500)', strokeWidth: 2 } },
      { id: 'e4-5', source: 'srv-1', target: 'act-1', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } },
      { id: 'e5-6', source: 'act-1', target: 'txn-1', animated: true, style: { stroke: 'var(--color-emerald-500)', strokeWidth: 2 } },
      { id: 'e4-7', source: 'srv-1', target: 'ext-1', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } },
    ];

    if (hoveredEntityId || hoveredSignalId) {
      let activeNodes = new Set<string>();
      if (hoveredEntityId) activeNodes.add(hoveredEntityId);
      if (hoveredSignalId === 'phishing') { activeNodes.add('usr-1'); activeNodes.add('ep-1'); }
      if (hoveredSignalId === 'lateral_movement') { activeNodes.add('ep-1'); activeNodes.add('vpn-1'); activeNodes.add('srv-1'); }
      if (hoveredSignalId === 'fraud') { activeNodes.add('act-1'); activeNodes.add('txn-1'); }

      baseNodes = baseNodes.map(n => ({
        ...n,
        data: { ...n.data, isDimmed: activeNodes.size > 0 && !activeNodes.has(n.id) }
      }));
      
      baseEdges = baseEdges.map(e => ({
        ...e,
        style: { ...e.style, opacity: activeNodes.size > 0 && !(activeNodes.has(e.source) || activeNodes.has(e.target)) ? 0.2 : 1 }
      }));
    }

    return { nodes: baseNodes, edges: baseEdges };
  }, [hoveredEntityId, hoveredSignalId]);

  return (
    <div className="flex flex-col h-full gap-4 pb-4">
      
      {/* GLOBAL PLATFORM OVERVIEW */}
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold tracking-tight">Fusion Global Overview</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted font-medium">Scope:</span>
          <div className="flex bg-surface-alt/50 p-1 rounded-btn border border-border">
            <button className="px-3 py-1 text-xs font-medium bg-surface rounded-btn border border-border text-text-primary shadow-sm">Last 24h</button>
            <button className="px-3 py-1 text-xs font-medium text-text-muted hover:text-text-primary">7 Days</button>
            <button className="px-3 py-1 text-xs font-medium text-text-muted hover:text-text-primary">30 Days</button>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs border-border/50 text-text-muted hover:text-text-primary">
            <Filter className="w-3 h-3 mr-1" /> Filters
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <KpiCard 
          title="Events/sec" 
          value="142" 
          trend="up" 
          isLoading={isKpisLoading}
          bgColor="bg-blue-950/20"
        />
        <KpiCard 
          title="Active Alerts" 
          value={kpis?.active_alerts} 
          trend="down" 
          isLoading={isKpisLoading}
          bgColor="bg-purple-950/20"
        />
        <KpiCard 
          title="MTTD" 
          value={`${kpis?.mttd_avg_seconds}s avg`} 
          trend="down" 
          isLoading={isKpisLoading}
          bgColor="bg-emerald-950/20"
        />
        <KpiCard 
          title="Blocked Today" 
          value={kpis ? `₹${(kpis.blocked_amount / 100000).toFixed(1)}L` : ''} 
          trend="up" 
          isLoading={isKpisLoading}
          bgColor="bg-amber-950/20"
        />
      </div>

      {/* Global Compact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 shrink-0">
        <ThreatTrendsWidget />
        <MitreCoverageWidget onSignalHover={setHoveredSignalId} />
        <QuantumSummaryWidget alert={null} activeScope="global" onScopeChange={() => {}} />
        <SystemHealthWidget />
        <AiExecutiveBriefingWidget />
      </div>

      {/* Global Investigation Context */}
      <div className="bg-surface-alt/30 border border-border/50 rounded-card p-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-text-muted uppercase tracking-wider">Live</span>
          </div>
          <div className="h-4 w-[1px] bg-border mx-2" />
          {activeAlert ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">Currently Investigating:</span>
              <Badge variant="outline" className={`border-${activeAlert.severity} text-${activeAlert.severity} font-mono`}>{activeAlert.id}</Badge>
              <span className="font-mono font-bold">{activeAlert.entity_id}</span>
              <Badge variant={activeAlert.severity as any} className="uppercase text-[10px]">{activeAlert.severity}</Badge>
              <span className="text-xs text-text-muted flex items-center gap-1 ml-4"><Clock className="w-3 h-3" /> Updated 3 seconds ago</span>
              <Button size="sm" variant="outline" className="ml-2 h-7 text-xs border-accent text-accent hover:bg-accent hover:text-black" onClick={() => setIsDrawerOpen(true)}>View Details</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-text-muted">
              <Info className="w-4 h-4" /> No Active Investigation Selected - Monitoring Global Telemetry
            </div>
          )}
        </div>
        
        {activeAlert && (
          <Button variant="ghost" size="sm" className="h-7 text-xs text-text-muted hover:text-text-primary" onClick={() => handleAlertClick('')}>
            Clear Context
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-[500px]">
        {/* Left: Live Operations (40%) */}
        <Card className="w-full lg:w-[40%] flex flex-col overflow-hidden bg-[#0A0D14]">
          <div className="p-4 border-b border-border bg-surface-alt/30 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent" /> Live Operations
              </h2>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-text-muted">Active Cases:</span>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">12</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="w-3 h-3 absolute left-2.5 top-2 text-text-muted" />
                <input type="text" placeholder="Search signals, IPs..." className="w-full bg-black/40 border border-border rounded text-xs py-1.5 pl-7 pr-2 focus:outline-none focus:border-accent text-text-primary" />
              </div>
              <Button size="sm" variant="outline" className="h-[26px] text-xs px-2 text-text-muted border-border/50">
                <Filter className="w-3 h-3 mr-1" /> Filters
              </Button>
            </div>
          </div>
          
          {/* Notification Stream (System Events) */}
          <div className="bg-blue-950/20 border-b border-border/50 px-4 py-2 shrink-0 flex items-center gap-2">
            <ActivitySquare className="w-3 h-3 text-blue-400 shrink-0" />
            <div className="text-[10px] text-text-muted truncate">
              <span className="text-blue-400 font-mono mr-2">SYS-901</span> API Rate Limit near threshold (94%) on Ingestion Gateway.
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
                    onClick={() => handleAlertClick(alert.id)}
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
          <div className="p-3 border-t border-border bg-surface shrink-0">
            <Link to="/threat-timeline" className="block">
              <Button variant="ghost" className="w-full text-xs text-text-muted hover:text-text-primary">
                See all logs <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Right: Attack Graph (60%) */}
        <Card className="w-full lg:w-[60%] flex flex-col relative overflow-hidden bg-[#0A0D14]">
          <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
            <h2 className="font-semibold flex items-center gap-2 bg-surface/80 backdrop-blur px-3 py-1.5 rounded-btn border border-border pointer-events-auto">
              <Share2 className="w-4 h-4 text-accent" /> Attack Path
            </h2>
            <div className="bg-surface-alt/80 backdrop-blur border border-border/50 rounded p-2 pointer-events-auto">
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Current Investigation</div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-text-primary">{activeAlert?.id || 'INC-9021-CORP'}</span>
                <Badge variant={activeAlert?.severity === 'critical' ? 'critical' : 'high'} className="text-[10px] py-0">{activeAlert?.severity || 'critical'}</Badge>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <div className="bg-surface/80 backdrop-blur border border-border/50 rounded-card p-3 w-64 shadow-xl pointer-events-auto transition-all">
              <div 
                className="flex items-center justify-between cursor-pointer border-b border-border/50 pb-1 mb-2"
                onClick={() => setIsSummaryOpen(!isSummaryOpen)}
              >
                <div className="text-[10px] text-text-muted uppercase tracking-wider">Attack Summary</div>
                <ChevronDown className={`w-3 h-3 text-text-muted transition-transform ${isSummaryOpen ? 'rotate-180' : ''}`} />
              </div>
              
              <AnimatePresence>
                {isSummaryOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary">Type</span>
                      <span className="text-xs font-medium text-amber-400">Credential Theft & Fraud</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary">Stage</span>
                      <span className="text-xs font-medium text-critical">Data Exfiltration</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary">Assets</span>
                      <span className="text-xs font-mono">4 Compromised</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary">Potential Loss</span>
                      <span className="text-xs font-mono font-semibold text-text-primary">₹4.5Cr</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="absolute bottom-4 right-72 z-10 pointer-events-none flex items-center gap-4">
            <div className="bg-surface-alt/60 backdrop-blur border border-border/50 rounded-full px-3 py-1.5 flex gap-3 pointer-events-auto">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-critical shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div><span className="text-[10px] text-text-muted font-medium">Compromised</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div><span className="text-[10px] text-text-muted font-medium">High Risk</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[10px] text-text-muted font-medium">Blocked</span></div>
            </div>
            <Link to="/attack-graph" className="pointer-events-auto text-xs text-accent hover:text-accent/80 hover:underline flex items-center bg-surface/50 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur">
               See Full Attack Graph <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="flex-1 h-full w-full">
            <ReactFlow 
              nodes={nodes} 
              edges={edges}
              nodeTypes={nodeTypes}
              fitView 
              colorMode="dark"
              proOptions={{ hideAttribution: true }}
              onNodeClick={(_, node) => {
                setSelectedEntity(node.data);
                setIsEntityDrawerOpen(true);
              }}
            >
              <Background gap={16} color="rgba(255, 255, 255, 0.05)" />
              <Controls className="bg-surface border-border text-text-primary fill-text-primary" />
            </ReactFlow>
          </div>
          
          {/* Timeline Preview (Active Investigation Tier) */}
          <div className="absolute bottom-4 right-4 z-10 bg-surface/80 backdrop-blur border border-border/50 rounded-card p-3 w-64 shadow-2xl transition-all">
            <div 
              className={`flex items-center justify-between cursor-pointer ${isTimelineOpen ? 'border-b border-border/50 pb-2 mb-3' : ''}`}
              onClick={() => setIsTimelineOpen(!isTimelineOpen)}
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-semibold">Incident Timeline</h3>
              </div>
              <ChevronDown className={`w-3 h-3 text-text-muted transition-transform ${isTimelineOpen ? 'rotate-180' : ''}`} />
            </div>
            
            <AnimatePresence>
              {isTimelineOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent overflow-hidden"
                >
                  <div 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active cursor-pointer"
                    onMouseEnter={() => setHoveredSignalId('phishing')}
                    onMouseLeave={() => setHoveredSignalId(null)}
                  >
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border bg-surface text-text-muted group-[.is-active]:text-critical group-[.is-active]:border-critical/50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-1.5 h-1.5 bg-critical rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] pl-2">
                      <div className="text-[10px] text-text-muted">09:12 AM</div>
                      <div className="text-xs text-text-primary group-hover:text-accent transition-colors">Phishing Email Delivered</div>
                    </div>
                  </div>
                  
                  <div 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active cursor-pointer"
                    onMouseEnter={() => setHoveredSignalId('lateral_movement')}
                    onMouseLeave={() => setHoveredSignalId(null)}
                  >
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border bg-surface text-text-muted group-[.is-active]:text-amber-500 group-[.is-active]:border-amber-500/50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] pl-2">
                      <div className="text-[10px] text-text-muted">09:26 AM</div>
                      <div className="text-xs text-text-primary group-hover:text-accent transition-colors">Lateral Movement to SWIFT</div>
                    </div>
                  </div>

                  <div 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active cursor-pointer"
                    onMouseEnter={() => setHoveredSignalId('fraud')}
                    onMouseLeave={() => setHoveredSignalId(null)}
                  >
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border bg-surface text-text-muted group-[.is-active]:text-critical group-[.is-active]:border-critical/50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <div className="w-1.5 h-1.5 bg-critical rounded-full animate-pulse"></div>
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] pl-2">
                      <div className="text-[10px] text-text-muted">09:32 AM</div>
                      <div className="text-xs text-text-primary group-hover:text-accent transition-colors">RTGS ₹4.5Cr Initiated</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Investigation Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0 min-h-[300px]">
        <CorrelationSummaryWidget alert={activeAlert} onSignalHover={setHoveredSignalId} />
        <BusinessImpactWidget alert={activeAlert} onEntityHover={setHoveredEntityId} />
        <AiInsightWidget alert={activeAlert} />
        <QuantumSummaryWidget alert={activeAlert} activeScope={activeScope} onScopeChange={setActiveScope} />
      </div>

      <AlertDetailDrawer 
        alertId={selectedAlertId}
        isOpen={isDrawerOpen} 
        onClose={handleDrawerClose} 
      />
      <EntityDetailDrawer
        entity={selectedEntity}
        isOpen={isEntityDrawerOpen}
        onClose={() => setIsEntityDrawerOpen(false)}
      />
    </div>
  );
}

function KpiCard({ title, value, trend, isLoading, bgColor }: { title: string, value: any, trend: 'up' | 'down', isLoading: boolean, bgColor?: string }) {
  return (
    <Card className={`p-5 flex flex-col justify-between h-[104px] ${bgColor || ''}`}>
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

function CorrelationSummaryWidget({ alert, onSignalHover }: { alert: any, onSignalHover: (id: string | null) => void }) {
  if (!alert) {
    return (
      <Card className="p-5 flex flex-col h-full items-center justify-center text-center bg-surface-alt/10 border-dashed border-border/50">
        <Network className="w-8 h-8 text-text-muted mb-2 opacity-50" />
        <p className="text-sm text-text-muted">Select an alert to view correlation.</p>
      </Card>
    );
  }
  
  if (!alert.correlation) return <Skeleton className="h-full w-full rounded-card" />;
  const { score, signals, telemetry_contribution, transaction_contribution } = alert.correlation;
  
  return (
    <Card className="p-5 flex flex-col h-full border-accent/20 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-purple-500 opacity-50" />
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2"><Network className="w-4 h-4 text-accent" /> Correlation Summary</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted hidden xl:inline-block">Selected Alert <ChevronDown className="w-3 h-3 inline" /></span>
          <span className="font-mono text-xl font-bold text-accent">{score}%</span>
        </div>
      </div>
      
      <div className="flex-1 mb-4 space-y-2">
        <div className="text-xs text-text-muted mb-2 font-medium">Signals Detected</div>
        {signals.map((s: string) => (
          <div 
            key={s} 
            className="flex items-center gap-2 text-xs text-text-primary hover:text-accent cursor-pointer transition-colors px-1 -mx-1 rounded hover:bg-surface-alt/30"
            onMouseEnter={() => onSignalHover(s.toLowerCase().replace(/ /g, '_'))}
            onMouseLeave={() => onSignalHover(null)}
          >
            <CheckCircle2 className="w-3 h-3 text-accent shrink-0" /> {s}
          </div>
        ))}
      </div>

      <div className="space-y-3 mt-auto pt-4 border-t border-border/50">
        <div>
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span>Telemetry Contribution</span>
            <span>{telemetry_contribution}%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-alt rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${telemetry_contribution}%` }} className="h-full bg-blue-500 rounded-full" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span>Transaction Contribution</span>
            <span>{transaction_contribution}%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-alt rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${transaction_contribution}%` }} className="h-full bg-emerald-500 rounded-full" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-text-muted">Correlation Time: 10:41:59 AM</span>
          <Link to={`/threat-timeline?alertId=${alert.id}`} className="text-xs text-accent hover:underline flex items-center gap-1">View Details <ArrowUpRight className="w-3 h-3" /></Link>
        </div>
      </div>
    </Card>
  );
}

function BusinessImpactWidget({ alert, onEntityHover }: { alert: any, onEntityHover: (id: string | null) => void }) {
  if (!alert) {
    return (
      <Card className="p-5 flex flex-col h-full items-center justify-center text-center bg-surface-alt/10 border-dashed border-border/50">
        <Banknote className="w-8 h-8 text-text-muted mb-2 opacity-50" />
        <p className="text-sm text-text-muted">Waiting for investigation context.</p>
      </Card>
    );
  }
  
  if (!alert.impact) return <Skeleton className="h-full w-full rounded-card" />;
  const { financial_exposure, affected_customers, affected_accounts, compliance_risk, recovery_priority, risk_classification } = alert.impact;

  return (
    <Card className="p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2"><Banknote className="w-4 h-4 text-critical" /> Business Impact</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted hidden xl:inline-block">Selected Alert <ChevronDown className="w-3 h-3 inline" /></span>
          <Badge variant="outline" className="border-critical/50 text-critical">{risk_classification}</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 justify-center">
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-xs text-text-muted">Financial Exposure</span>
          <span className="font-mono text-sm font-bold text-critical">{financial_exposure}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-xs text-text-muted">Affected Account</span>
          <span className="font-mono text-xs cursor-pointer hover:text-accent" onMouseEnter={() => onEntityHover(affected_accounts)} onMouseLeave={() => onEntityHover(null)}>{affected_accounts}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-xs text-text-muted">Target Customer</span>
          <span className="text-xs font-medium truncate max-w-[120px]" title={affected_customers}>{affected_customers}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-xs text-text-muted">Compliance Risk</span>
          <span className="text-xs">{compliance_risk}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-xs text-text-muted">Recovery Priority</span>
          <span className="text-xs font-bold text-critical">{recovery_priority}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/50">
        <span className="text-[10px] text-text-muted">Last Updated: 12s ago</span>
        <Link to={`/transactions?alertId=${alert.id}`} className="text-xs text-accent hover:underline flex items-center gap-1">View Transaction <ArrowUpRight className="w-3 h-3" /></Link>
      </div>
    </Card>
  );
}

function AiInsightWidget({ alert }: { alert: any }) {
  if (!alert) {
    return (
      <Card className="p-5 flex flex-col h-full items-center justify-center text-center bg-surface-alt/10 border-dashed border-border/50">
        <Sparkles className="w-8 h-8 text-text-muted mb-2 opacity-50" />
        <p className="text-sm text-text-muted">Select an alert to view AI Insights.</p>
      </Card>
    );
  }

  if (!alert.ai_insight) return <Skeleton className="h-full w-full rounded-card" />;
  const { reason, evidence, impact, confidence, recommended_action } = alert.ai_insight;

  return (
    <Card className="p-5 flex flex-col h-full bg-surface-alt/30">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" /> AI Insight</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted hidden xl:inline-block">Selected Alert <ChevronDown className="w-3 h-3 inline" /></span>
          <Badge variant="outline" className="border-purple-500/30 text-purple-400">{confidence}% Confidence</Badge>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Reason</div>
          <div className="text-xs text-text-primary leading-relaxed">{reason}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Evidence</div>
          <div className="text-xs font-mono text-text-secondary bg-black/30 p-2 rounded border border-border/50">{evidence}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Impact</div>
          <div className="text-xs text-text-primary">{impact}</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Recommended Action</div>
        <div className="text-xs font-medium text-accent mb-3">{recommended_action}</div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-muted">AI Analysis Time: 10:42:01 AM</span>
          <Link to={`/ai-investigation?alertId=${alert.id}`} className="text-xs text-purple-400 hover:underline flex items-center gap-1">Open Investigation <ArrowUpRight className="w-3 h-3" /></Link>
        </div>
      </div>
    </Card>
  );
}

function QuantumSummaryWidget({ alert, activeScope, onScopeChange }: { alert: any, activeScope: string, onScopeChange: (scope: string) => void }) {
  // If no alert is selected but scope is 'selected_alert', we can either show empty or global. We will show empty to be strictly correct.
  if (!alert && activeScope === 'selected_alert') {
    return (
      <Card className="p-5 flex flex-col h-full items-center justify-center text-center bg-surface-alt/10 border-dashed border-border/50">
        <Atom className="w-8 h-8 text-text-muted mb-2 opacity-50" />
        <p className="text-sm text-text-muted">Select an alert to view localized Quantum Risk.</p>
        <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => onScopeChange('global')}>Switch to Platform Status</Button>
      </Card>
    );
  }

  // Use the global platform posture if scope is global or alert is null. (Mocking global posture)
  const quantum = alert?.quantum || { readiness_score: 82, assets_at_risk: 1540, cbom_coverage: 94, migration_progress: "Phase 3 (Enterprise)" };
  const { readiness_score, assets_at_risk, cbom_coverage, migration_progress } = quantum;

  return (
    <Card className="p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
          <Atom className="w-4 h-4 text-blue-400" /> 
          {activeScope === 'selected_alert' ? 'Incident Posture' : 'Platform Quantum Readiness'}
        </h3>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onScopeChange(activeScope === 'selected_alert' ? 'global' : 'selected_alert')}>
          <span className="text-[10px] text-text-muted hidden xl:inline-block hover:text-text-primary">{activeScope === 'selected_alert' ? 'Selected Alert' : 'Global Platform'} <ChevronDown className="w-3 h-3 inline" /></span>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-alt" />
            <motion.circle 
              cx="48" cy="48" r="40" 
              stroke="currentColor" 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={251.2} 
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * readiness_score) / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-blue-500" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-xl font-bold">{readiness_score}%</span>
            <span className="text-[8px] text-text-muted uppercase tracking-widest">Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-surface-alt/50 p-2 rounded-md text-center">
          <div className="font-mono text-lg font-semibold text-critical">{assets_at_risk}</div>
          <div className="text-[10px] text-text-muted">Assets at Risk</div>
        </div>
        <div className="bg-surface-alt/50 p-2 rounded-md text-center">
          <div className="font-mono text-lg font-semibold text-blue-400">{cbom_coverage}%</div>
          <div className="text-[10px] text-text-muted">CBOM Coverage</div>
        </div>
        <div className="col-span-2 bg-surface-alt/50 p-2 rounded-md flex justify-between items-center mb-2">
          <div className="text-[10px] text-text-muted">Migration</div>
          <div className="text-xs font-medium">{migration_progress}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <span className="text-[10px] text-text-muted">Last Updated: 2m ago</span>
        <Link to="/quantum" className="text-xs text-blue-400 hover:underline flex items-center gap-1">Open Dashboard <ArrowUpRight className="w-3 h-3" /></Link>
      </div>
    </Card>
  );
}

function ThreatTrendsWidget() {
  const data = [
    { time: '00:00', volume: 120 }, { time: '04:00', volume: 180 }, 
    { time: '08:00', volume: 350 }, { time: '12:00', volume: 290 }, 
    { time: '16:00', volume: 420 }, { time: '20:00', volume: 380 }, 
    { time: '24:00', volume: 450 }
  ];

  return (
    <Card className="p-4 flex flex-col h-full bg-surface-alt/10">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Threat Trends</h3>
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-mono text-[10px]">+14%</Badge>
      </div>
      <div className="flex-1 w-full mt-2 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickMargin={5} />
            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickFormatter={(val) => val} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(10, 13, 20, 0.9)', borderColor: 'rgba(255,255,255,0.1)', fontSize: '12px' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Area type="monotone" dataKey="volume" stroke="#10b981" fillOpacity={1} fill="url(#colorVolume)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/50">
        <span className="text-[10px] text-text-muted">Last 24 Hours Volume</span>
        <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] text-accent hover:text-accent/80">View Details <ArrowUpRight className="w-3 h-3 ml-1" /></Button>
      </div>
    </Card>
  );
}

function MitreCoverageWidget({ onSignalHover }: { onSignalHover?: (id: string | null) => void }) {
  const isLoading = false; // Mock loading state
  const isEmpty = false; // Mock empty state

  const tactics = [
    { name: 'Initial Access', status: 'critical', signalId: 'phishing', techniques: 'T1566 Phishing', evidence: 'Spearphishing Link clicked by VP Treasury', lastSeen: '12m ago', confidence: '99%' },
    { name: 'Execution', status: 'high', signalId: 'execution', techniques: 'T1059 Command & Scripting', evidence: 'PowerShell executed on EP-MUM-TRES-04', lastSeen: '10m ago', confidence: '92%' },
    { name: 'Persistence', status: 'none', signalId: null },
    { name: 'Privilege Esc.', status: 'none', signalId: null },
    { name: 'Defense Evasion', status: 'none', signalId: null },
    { name: 'Cred Access', status: 'critical', signalId: 'credential_access', techniques: 'T1003 OS Credential Dumping', evidence: 'LSASS memory dump detected on EP-MUM-TRES-04', lastSeen: '8m ago', confidence: '95%' },
    { name: 'Discovery', status: 'none', signalId: null },
    { name: 'Lateral Mvmt', status: 'critical', signalId: 'lateral_movement', techniques: 'T1021 Remote Services', evidence: 'Lateral movement to HDFC-MUM-SWIFT-GW', lastSeen: '5m ago', confidence: '98%' },
    { name: 'Collection', status: 'none', signalId: null },
    { name: 'C2', status: 'critical', signalId: 'c2', techniques: 'T1571 Non-Standard Port', evidence: 'Beacon communication to 10.0.4.15 (Known C2)', lastSeen: '3m ago', confidence: '99%' },
    { name: 'Exfiltration', status: 'high', signalId: 'fraud', techniques: 'T1048 Exfiltration Over Alt Protocol', evidence: 'Large RTGS transfer initiated ₹4.5Cr', lastSeen: '1m ago', confidence: '88%' },
    { name: 'Impact', status: 'none', signalId: null },
  ];

  const activeCount = tactics.filter(t => t.status !== 'none').length;

  if (isLoading) {
    return (
      <Card className="p-4 flex flex-col h-full bg-surface-alt/10">
        <Skeleton className="w-1/2 h-5 mb-2" />
        <Skeleton className="w-1/3 h-3 mb-4" />
        <div className="grid grid-cols-3 gap-1.5 mt-2 flex-1">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-6 w-full rounded" />)}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 flex flex-col h-full bg-surface-alt/10 relative">
      <div className="flex justify-between items-start mb-2 border-b border-border/50 pb-2">
        <div>
          <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-amber-400" /> MITRE ATT&CK
          </h3>
          <div className="text-[10px] text-text-muted mt-1">Platform Overview (Last 24 Hours)</div>
        </div>
        <div className="flex flex-col items-end">
          <Badge variant="outline" className="border-border text-text-primary text-[10px] py-0 mb-1 font-medium">{activeCount} / {tactics.length} Tactics Observed</Badge>
          <div className="flex gap-2 items-center mt-1">
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-critical shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span><span className="text-[8px] text-text-muted uppercase">Confirmed</span></div>
            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></span><span className="text-[8px] text-text-muted uppercase">Suspicious</span></div>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center text-center p-4">
          <div className="text-xs text-text-muted">No ATT&CK techniques observed for the selected scope.</div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-3 gap-1.5 mt-1 relative">
          {tactics.map((t) => (
            <div 
              key={t.name} 
              className={`group relative flex items-center justify-center p-1 rounded border transition-colors cursor-default ${
                t.status === 'critical' ? 'bg-critical/10 border-critical/30 text-critical shadow-[0_0_8px_rgba(239,68,68,0.15)] hover:border-critical/60' :
                t.status === 'high' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:border-amber-500/60' :
                'bg-surface-alt/50 border-border/30 text-text-muted opacity-60'
              }`}
              onMouseEnter={() => t.signalId && onSignalHover?.(t.signalId)}
              onMouseLeave={() => onSignalHover?.(null)}
            >
              <span className="text-[9px] font-semibold text-center leading-[1.1] uppercase tracking-[0.02em]">{t.name}</span>
              
              {t.status !== 'none' && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-surface border border-border rounded-card p-3 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                  <div className={`text-xs font-semibold mb-1 border-b border-border/50 pb-1 ${t.status === 'critical' ? 'text-critical' : 'text-amber-500'}`}>{t.name}</div>
                  <div className="space-y-2 mt-2 text-left">
                    <div>
                      <div className="text-[9px] text-text-muted uppercase tracking-wider mb-0.5">Techniques</div>
                      <div className="text-[10px] text-text-secondary leading-tight">{t.techniques}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-text-muted uppercase tracking-wider mb-0.5">Evidence</div>
                      <div className="text-[10px] text-text-secondary leading-tight">{t.evidence}</div>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-border/50">
                      <div>
                        <div className="text-[9px] text-text-muted uppercase tracking-wider mb-0.5">Last Seen</div>
                        <div className="text-[10px] text-text-secondary">{t.lastSeen}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-text-muted uppercase tracking-wider mb-0.5">Confidence</div>
                        <div className="text-[10px] text-emerald-400 font-mono">{t.confidence}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 mt-auto border-t border-border/50">
        <span className="text-[10px] text-text-muted">Last updated: Just now</span>
        <Link to="/mitre">
          <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] text-accent hover:text-accent/80">View Full Matrix <ArrowUpRight className="w-3 h-3 ml-1" /></Button>
        </Link>
      </div>
    </Card>
  );
}

function SystemHealthWidget() {
  return (
    <Card className="p-4 flex flex-col h-full bg-surface-alt/10">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2"><Server className="w-4 h-4 text-blue-400" /> System Health</h3>
      </div>
      <div className="flex-1 space-y-2 justify-center flex flex-col mt-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Ingestion Gateway</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Online</span>
          </div>
          <div className="w-full bg-surface-alt rounded-full h-1"><div className="bg-emerald-400 h-1 rounded-full" style={{width: '100%'}}></div></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">AI Analysis Engine</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Online</span>
          </div>
          <div className="w-full bg-surface-alt rounded-full h-1"><div className="bg-emerald-400 h-1 rounded-full" style={{width: '95%'}}></div></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">SWIFT Collectors</span>
            <span className="flex items-center gap-1 text-[10px] text-amber-400"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Degraded</span>
          </div>
          <div className="w-full bg-surface-alt rounded-full h-1"><div className="bg-amber-400 h-1 rounded-full" style={{width: '60%'}}></div></div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 mt-auto border-t border-border/50">
        <span className="text-[10px] text-text-muted">99.98% Uptime</span>
        <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] text-accent hover:text-accent/80">Topology <ArrowUpRight className="w-3 h-3 ml-1" /></Button>
      </div>
    </Card>
  );
}

function AiExecutiveBriefingWidget() {
  return (
    <Card className="p-4 flex flex-col h-full bg-surface-alt/10 col-span-1 md:col-span-2">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-400" /> AI Executive Briefing</h3>
        <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-[10px]">Generated 1m ago</Badge>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4 mt-2">
        <div className="bg-surface/50 p-2 rounded border border-border/30">
          <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Global Threat Level</div>
          <div className="text-sm font-medium text-critical">ELEVATED</div>
          <div className="text-xs text-text-muted mt-1 leading-snug">14% increase in lateral movement across APAC endpoints.</div>
        </div>
        <div className="bg-surface/50 p-2 rounded border border-border/30">
          <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Active Campaigns</div>
          <div className="text-sm font-medium text-amber-400">2 Coordinated Attacks</div>
          <div className="text-xs text-text-muted mt-1 leading-snug">Targeting RTGS clearing systems and Treasury accounts.</div>
        </div>
        <div className="col-span-2 pt-2">
           <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Top Anomaly</div>
           <div className="text-xs font-mono text-text-primary bg-black/40 p-2 rounded border border-border/50">
             Service Account (svc_swift_sync) abnormal access pattern from unmanaged IP (10.0.4.15).
           </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 mt-auto border-t border-border/50">
        <span className="text-[10px] text-text-muted">Generated by Quantum AI</span>
        <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] text-purple-400 hover:text-purple-300">Full Report <ArrowUpRight className="w-3 h-3 ml-1" /></Button>
      </div>
    </Card>
  );
}
