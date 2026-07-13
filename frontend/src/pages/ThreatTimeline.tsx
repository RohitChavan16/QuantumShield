import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, Activity } from 'lucide-react';
import { ComposedChart, Scatter, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import { Badge } from '../components/ui/Badge';

export function ThreatTimeline() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Hardcoded mock data for timeline events
  const data = [
    { time: new Date(Date.now() - 1000 * 3600).getTime(), lane: 'Authentication', type: 'Failed Login', color: 'var(--color-critical)' },
    { time: new Date(Date.now() - 1000 * 3500).getTime(), lane: 'Authentication', type: 'Failed Login', color: 'var(--color-critical)' },
    { time: new Date(Date.now() - 1000 * 3400).getTime(), lane: 'Authentication', type: 'Successful Login', color: 'var(--color-low)' },
    { time: new Date(Date.now() - 1000 * 3300).getTime(), lane: 'Endpoint', type: 'Process Execution', color: 'var(--color-high)' },
    { time: new Date(Date.now() - 1000 * 3200).getTime(), lane: 'Endpoint', type: 'File Modification', color: 'var(--color-medium)' },
    { time: new Date(Date.now() - 1000 * 1200).getTime(), lane: 'Transaction', type: 'Transfer Request', color: 'var(--color-critical)' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) setHasSearched(true);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border p-3 rounded-card shadow-lg text-sm">
          <div className="font-semibold text-text-primary mb-1">{data.type}</div>
          <div className="text-text-secondary text-xs">Lane: {data.lane}</div>
          <div className="text-text-muted text-xs mt-2 font-mono">
            {new Date(data.time).toLocaleTimeString()}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <Card className="p-4 shrink-0">
        <form onSubmit={handleSearch} className="flex items-center gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search by endpoint, account, or user ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Button type="submit">Search Timeline</Button>
        </form>
      </Card>

      <Card className="flex-1 flex flex-col overflow-hidden bg-[#0A0D14]">
        {!hasSearched ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState 
              icon={Activity} 
              title="No Entity Selected" 
              description="Enter an entity ID above, or select one from an alert, to view its timeline." 
            />
          </div>
        ) : data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState 
              icon={Activity} 
              title="No Events Found" 
              description={`No historical events found for entity "${searchTerm}".`}
            />
          </div>
        ) : (
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div>
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" /> Entity Timeline
                </h3>
                <p className="text-sm text-text-muted mt-1 font-mono">{searchTerm}</p>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="text-xs"><span className="w-2 h-2 rounded-full bg-critical mr-2"></span>Critical</Badge>
                <Badge variant="outline" className="text-xs"><span className="w-2 h-2 rounded-full bg-high mr-2"></span>High</Badge>
                <Badge variant="outline" className="text-xs"><span className="w-2 h-2 rounded-full bg-medium mr-2"></span>Medium</Badge>
              </div>
            </div>
            
            <div className="flex-1 min-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={data}
                  margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                >
                  <XAxis 
                    dataKey="time" 
                    type="number" 
                    domain={['dataMin', 'dataMax']} 
                    tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                    stroke="var(--color-border)"
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                  />
                  <YAxis 
                    dataKey="lane" 
                    type="category" 
                    stroke="var(--color-border)"
                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                  />
                  <ZAxis range={[100, 100]} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--color-border)' }} />
                  <Scatter name="Events" data={data} fill="var(--color-accent)">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Scatter>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
