import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, FileCheck, Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export function ExecutiveDashboard() {
  const [dateRange, setDateRange] = useState('7D');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['executive_analytics', dateRange],
    queryFn: async () => {
      if (import.meta.env.VITE_MOCK_MODE === 'true' || import.meta.env.DEV) {
        await new Promise(r => setTimeout(r, 400));
        return {
          fraud_prevented: 12500000,
          fraud_prevented_trend: 12.5,
          fp_rate: 4.2,
          fp_rate_trend: -1.8,
          mttd_avg: 1.2,
          mttd_trend: -15.4,
          fp_trend_data: [
            { date: 'Mon', baseline: 12, correlated: 4 },
            { date: 'Tue', baseline: 15, correlated: 5 },
            { date: 'Wed', baseline: 14, correlated: 4 },
            { date: 'Thu', baseline: 18, correlated: 3 },
            { date: 'Fri', baseline: 11, correlated: 4 },
            { date: 'Sat', baseline: 9, correlated: 2 },
            { date: 'Sun', baseline: 10, correlated: 3 },
          ]
        };
      }
      const res = await api.get('/api/v1/analytics/executive'); // Mock endpoint path
      return res.data;
    }
  });

  return (
    <div className="flex flex-col h-full gap-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Executive Summary</h2>
          <p className="text-sm text-text-muted">High-level risk and ROI reporting</p>
        </div>
        <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-40 h-9">
          <option value="24H">Last 24 Hours</option>
          <option value="7D">Last 7 Days</option>
          <option value="30D">Last 30 Days</option>
          <option value="90D">Last Quarter</option>
        </Select>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <StatCard 
          title="Fraud Prevented" 
          value={isLoading ? '...' : `₹${((analytics?.fraud_prevented || 0) / 100000).toFixed(1)}L`} 
          trend={analytics?.fraud_prevented_trend} 
          trendSuffix="%" 
          trendType="good_is_up" 
        />
        <StatCard 
          title="False Positive Rate" 
          value={isLoading ? '...' : `${analytics?.fp_rate}%`} 
          trend={analytics?.fp_rate_trend} 
          trendSuffix="%" 
          trendType="good_is_down" 
        />
        <StatCard 
          title="Mean Time To Detect" 
          value={isLoading ? '...' : `${analytics?.mttd_avg}s`} 
          trend={analytics?.mttd_trend} 
          trendSuffix="%" 
          trendType="good_is_down" 
        />
      </div>

      {/* Chart */}
      <Card className="flex-1 min-h-[300px] p-6 flex flex-col">
        <div className="mb-4 shrink-0">
          <h3 className="font-semibold text-lg">False Positive Reduction</h3>
          <p className="text-sm text-text-muted">Rule-only baseline vs. Fused correlation</p>
        </div>
        <div className="flex-1 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics?.fp_trend_data || []} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--color-text-muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--color-text-muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                itemStyle={{ fontSize: '14px' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Line 
                name="Rule-Only Baseline (Legacy)" 
                type="monotone" 
                dataKey="baseline" 
                stroke="var(--color-text-muted)" 
                strokeWidth={2} 
                dot={{ r: 4, fill: 'var(--color-surface)' }} 
              />
              <Line 
                name="Fused Correlation (AI)" 
                type="monotone" 
                dataKey="correlated" 
                stroke="var(--color-accent)" 
                strokeWidth={3} 
                dot={{ r: 5, fill: 'var(--color-surface)' }} 
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Compliance Status row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <ComplianceCard title="DORA Readiness" icon={ShieldCheck} status="On Track" />
        <ComplianceCard title="PCI-DSS v4.0" icon={Lock} status="On Track" />
        <ComplianceCard title="GDPR Posture" icon={FileCheck} status="Attention Needed" isWarning />
      </div>

    </div>
  );
}

function StatCard({ title, value, trend, trendSuffix, trendType }: { title: string, value: string, trend?: number, trendSuffix: string, trendType: 'good_is_up' | 'good_is_down' }) {
  const isUp = (trend || 0) > 0;
  const isGood = trendType === 'good_is_up' ? isUp : !isUp;
  
  return (
    <Card className="p-6">
      <h3 className="text-sm font-semibold text-text-secondary">{title}</h3>
      <div className="flex items-end justify-between mt-3">
        <span className="text-4xl font-mono font-bold text-text-primary tracking-tight">{value}</span>
        {trend !== undefined && (
          <span className={`flex items-center text-sm font-medium ${isGood ? 'text-low' : 'text-critical'}`}>
            {isUp ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
            {Math.abs(trend)}{trendSuffix}
          </span>
        )}
      </div>
    </Card>
  );
}

function ComplianceCard({ title, icon: Icon, status, isWarning }: { title: string, icon: any, status: string, isWarning?: boolean }) {
  return (
    <Card className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isWarning ? 'bg-high/10 border-high/20 text-high' : 'bg-low/10 border-low/20 text-low'} border`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-semibold text-text-primary">{title}</span>
      </div>
      <Badge variant={isWarning ? 'high' : 'low'}>{status}</Badge>
    </Card>
  );
}
