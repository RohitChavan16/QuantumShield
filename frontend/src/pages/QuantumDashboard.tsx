import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ShieldAlert, RefreshCw, Zap } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export function QuantumDashboard() {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  
  // Mock data state for optimistic updates
  const [endpoints, setEndpoints] = useState([
    { id: 'EP-WS-NYC-04', cipher: 'RSA-2048', risk: 'high', status: 'NON-COMPLIANT' },
    { id: 'EP-DB-LON-01', cipher: 'ECDHE-X25519', risk: 'medium', status: 'NON-COMPLIANT' },
    { id: 'EP-MOB-881', cipher: 'RSA-2048', risk: 'high', status: 'NON-COMPLIANT' },
    { id: 'EP-SVC-ACC-09', cipher: 'ML-KEM-768', risk: 'low', status: 'COMPLIANT' },
  ]);

  const { data: cbom, refetch } = useQuery({
    queryKey: ['cbom'],
    queryFn: async () => {
      if (import.meta.env.VITE_MOCK_MODE === 'true' || import.meta.env.DEV) {
        await new Promise(r => setTimeout(r, 600));
        return {
          total_assets: 142,
          compliant_assets: 34,
          exposure_breakdown: {
            'RSA-2048': 64,
            'ECDHE-X25519': 44,
            'ML-KEM-768': 34
          }
        };
      }
      const res = await api.get('/api/v1/compliance/cbom');
      return res.data;
    }
  });

  const handleScan = async () => {
    setIsScanning(true);
    toast({ title: 'Scanning 142 endpoints...', type: 'info', duration: 3000 });
    try {
      await new Promise(r => setTimeout(r, 3000));
      await refetch();
      toast({ title: 'Scan complete — 3 new findings', type: 'success' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleUpgrade = (id: string) => {
    toast({ title: `Initiating ML-KEM upgrade on ${id}...`, type: 'info' });
    setTimeout(() => {
      setEndpoints(prev => prev.map(ep => 
        ep.id === id ? { ...ep, cipher: 'ML-KEM-768', risk: 'low', status: 'COMPLIANT' } : ep
      ));
      toast({ title: `Upgrade successful for ${id}`, type: 'success' });
    }, 1500);
  };

  const donutData = cbom ? Object.entries(cbom.exposure_breakdown).map(([name, value]) => ({ name, value })) : [];
  const COLORS = {
    'RSA-2048': 'var(--color-critical)',
    'ECDHE-X25519': 'var(--color-medium)',
    'ML-KEM-768': 'var(--color-low)'
  };

  const readinessPercent = cbom ? Math.round((cbom.compliant_assets / cbom.total_assets) * 100) : 0;

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Quantum Risk & CBOM</h2>
          <p className="text-sm text-text-muted">Cryptographic Bill of Materials & HNDL Risk Posture</p>
        </div>
        <Button onClick={handleScan} isLoading={isScanning}>
          <RefreshCw className="w-4 h-4 mr-2" /> Run Compliance Scan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        
        {/* Readiness */}
        <Card className="p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="text-sm font-semibold text-text-secondary absolute top-4 left-4">Migration Readiness</h3>
          <div className="relative w-40 h-40 flex items-center justify-center mt-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" className="stroke-surface-alt" strokeWidth="12" fill="none" />
              <circle 
                cx="80" cy="80" r="70" 
                className="stroke-low transition-all duration-1000 ease-out" 
                strokeWidth="12" 
                fill="none" 
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - readinessPercent / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-mono font-bold">{readinessPercent}%</span>
              <span className="text-xs text-text-muted">Compliant</span>
            </div>
          </div>
        </Card>

        {/* Algorithm Exposure */}
        <Card className="p-6 flex flex-col relative h-[250px]">
          <h3 className="text-sm font-semibold text-text-secondary shrink-0">Algorithm Exposure</h3>
          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={(COLORS as any)[entry.name] || 'var(--color-border)'} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }} 
                  itemStyle={{ color: 'var(--color-text-primary)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* HNDL Risk Gauge */}
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">HNDL Risk Profile</h3>
          <div className="w-24 h-24 rounded-full bg-critical/10 border-2 border-critical flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)] mb-4">
            <ShieldAlert className="w-10 h-10 text-critical" />
          </div>
          <span className="text-2xl font-bold tracking-widest text-critical uppercase">High</span>
          <p className="text-xs text-text-muted mt-2 max-w-[200px]">
            Significant exposure to Harvest Now, Decrypt Later (HNDL) attacks via legacy key exchanges.
          </p>
        </Card>

      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-alt/30 flex justify-between items-center shrink-0">
          <h3 className="font-semibold">Vulnerability Feed</h3>
          <Badge variant="outline">{endpoints.filter(e => e.status !== 'COMPLIANT').length} Non-Compliant</Badge>
        </div>
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface sticky top-0 border-b border-border z-10">
              <tr>
                <th className="p-4 font-medium text-text-muted">Endpoint</th>
                <th className="p-4 font-medium text-text-muted">Current Cipher</th>
                <th className="p-4 font-medium text-text-muted">Risk</th>
                <th className="p-4 font-medium text-text-muted text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {endpoints.map((ep) => (
                <tr key={ep.id} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="p-4 font-mono">{ep.id}</td>
                  <td className="p-4 font-mono">{ep.cipher}</td>
                  <td className="p-4">
                    {ep.status === 'COMPLIANT' ? (
                      <Badge variant="low">SECURE</Badge>
                    ) : (
                      <Badge variant={ep.risk as any}>{ep.risk.toUpperCase()}</Badge>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {ep.status === 'COMPLIANT' ? (
                      <span className="text-xs text-text-muted mr-4">Up to date</span>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 border-accent text-accent hover:bg-accent/10"
                        onClick={() => handleUpgrade(ep.id)}
                      >
                        <Zap className="w-3 h-3 mr-1.5 fill-current" /> Upgrade to ML-KEM
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
