import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, Share2, Filter, Info, Activity } from 'lucide-react';
import { ReactFlow, Controls, Background, MiniMap } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { Link, useSearchParams } from 'react-router-dom';
import '@xyflow/react/dist/style.css';

import { MOCK_ALERTS } from '../services/mockData';

const generateGraphData = (alertId: string | null) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Use the requested alert or fallback to the critical one
  const alert = (alertId ? MOCK_ALERTS.find(a => a.id === alertId) : null) || MOCK_ALERTS.find(a => a.severity === 'critical') || MOCK_ALERTS[0];
  
  // 1. External Threat Source
  nodes.push({ id: 'src-ip', position: { x: 50, y: 250 }, data: { label: `Attacker IP\n${alert.raw.ip}` }, style: { backgroundColor: 'var(--color-critical)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px' } });
  
  // 2. Firewall / Gateway
  nodes.push({ id: 'fw', position: { x: 250, y: 250 }, data: { label: 'Perimeter Firewall' }, style: { backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '8px' } });
  
  // 3. Compromised Endpoint
  nodes.push({ id: 'ep', position: { x: 500, y: 250 }, data: { label: `Compromised Endpoint\n${alert.entity_id}` }, style: { backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '2px solid var(--color-critical)', borderRadius: '8px', color: 'var(--color-text-primary)' } });
  
  // 4. Compromised User
  nodes.push({ id: 'usr', position: { x: 500, y: 100 }, data: { label: `Compromised User\n${alert.raw.user}` }, style: { backgroundColor: 'rgba(245, 158, 11, 0.2)', border: '2px solid var(--color-high)', borderRadius: '8px', color: 'var(--color-text-primary)' } });
  
  // 5. Internal Account
  nodes.push({ id: 'act-in', position: { x: 750, y: 250 }, data: { label: `Internal Account\n${alert.linked_transaction?.sender}` }, style: { backgroundColor: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' } });
  
  // 6. External Transfer
  nodes.push({ id: 'act-out', position: { x: 1000, y: 250 }, data: { label: `External Account\n${alert.linked_transaction?.receiver}` }, style: { backgroundColor: 'var(--color-surface-alt)', border: '1px dashed var(--color-border)', borderRadius: '8px', color: 'var(--color-text-primary)' }, type: 'output' });

  // Add edges
  edges.push({ id: 'e1', source: 'src-ip', target: 'fw', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } });
  edges.push({ id: 'e2', source: 'fw', target: 'ep', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } });
  edges.push({ id: 'e3', source: 'usr', target: 'ep', animated: true, style: { stroke: 'var(--color-high)', strokeWidth: 2 } });
  edges.push({ id: 'e4', source: 'ep', target: 'act-in', animated: true, label: 'Lateral Movement', labelStyle: { fill: 'var(--color-text-secondary)', fontSize: 10 }, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } });
  edges.push({ id: 'e5', source: 'act-in', target: 'act-out', animated: true, label: `Transfer ₹${(alert.linked_transaction?.amount || 0) / 100000}L`, labelBgStyle: { fill: 'var(--color-surface)' }, labelStyle: { fill: 'var(--color-critical)', fontWeight: 'bold' }, style: { stroke: 'var(--color-critical)', strokeWidth: 3 } });

  // Add some decoy/normal nodes for realism
  nodes.push({ id: 'ep-norm', position: { x: 500, y: 400 }, data: { label: 'Normal Endpoint\nCORP-MAC-01' }, style: { backgroundColor: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-secondary)' } });
  edges.push({ id: 'e-norm', source: 'fw', target: 'ep-norm', animated: false, style: { stroke: 'var(--color-text-muted)', strokeWidth: 1 } });
  
  return { nodes, edges, alert };
};

export function AttackGraph() {
  const [searchParams] = useSearchParams();
  const alertId = searchParams.get('alertId');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  
  const { nodes: allNodes, edges: allEdges } = React.useMemo(() => generateGraphData(alertId), [alertId]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const filteredNodes = showCriticalOnly 
    ? allNodes.filter(n => n.style?.borderColor === 'var(--color-critical)' || n.id === 'src-ip' || n.id.includes('act')) 
    : allNodes;

  return (
    <div className="flex h-full gap-6">
      
      {/* Main Graph Area */}
      <Card className="flex-1 flex flex-col relative overflow-hidden bg-[#0A0D14]">
        <div className="absolute top-4 left-4 z-10 flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Find node..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 bg-surface/80 backdrop-blur"
            />
          </div>
          <Button 
            variant={showCriticalOnly ? "primary" : "outline"} 
            size="sm"
            onClick={() => setShowCriticalOnly(!showCriticalOnly)}
            className="h-9 bg-surface/80 backdrop-blur"
          >
            <Filter className="w-4 h-4 mr-2" /> Critical Path Only
          </Button>
        </div>

        {allNodes.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState 
              icon={Share2} 
              title="No Active Paths" 
              description="The graph will populate as correlated alerts arrive." 
            />
          </div>
        ) : (
          <div className="flex-1 h-full w-full">
            <ReactFlow 
              nodes={filteredNodes} 
              edges={allEdges} 
              onNodeClick={onNodeClick}
              fitView 
              colorMode="dark"
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={16} color="rgba(255, 255, 255, 0.05)" />
              <Controls className="bg-surface border-border text-text-primary fill-text-primary" />
              <MiniMap 
                nodeStrokeColor="var(--color-border)"
                nodeColor="var(--color-surface-alt)"
                maskColor="rgba(0, 0, 0, 0.5)"
                className="bg-surface border border-border rounded-card"
              />
            </ReactFlow>
          </div>
        )}
      </Card>

      {/* Side Panel (Context) */}
      <Card className={`w-80 shrink-0 flex flex-col transition-all duration-300 ${selectedNode ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 hidden'}`}>
        <div className="p-4 border-b border-border flex justify-between items-center bg-surface-alt/30">
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 text-accent" /> Entity Details
          </h3>
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setSelectedNode(null)}>Close</Button>
        </div>
        
        {selectedNode && (
          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            <div>
              <p className="text-xs text-text-muted mb-1">Entity ID</p>
              <p className="font-mono text-lg text-text-primary">{selectedNode.data.label as string}</p>
              <Badge variant="outline" className="mt-2 text-xs">Type: {selectedNode.id.split('-')[0].toUpperCase()}</Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-3">Risk History</h4>
              <div className="space-y-3">
                <div className="p-3 bg-critical/10 border border-critical/20 rounded-md">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-critical">Critical Alert</span>
                    <span className="text-[10px] text-text-muted">12m ago</span>
                  </div>
                  <p className="text-xs text-text-secondary">Involved in ALT-8492-BX (Data Exfiltration path)</p>
                </div>
                <div className="p-3 bg-surface-alt/50 border border-border rounded-md">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-text-primary">Medium Alert</span>
                    <span className="text-[10px] text-text-muted">2h ago</span>
                  </div>
                  <p className="text-xs text-text-secondary">Involved in ALT-8488-CX (Anomalous Transfer)</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-auto">
              <Link to={`/threat-timeline?entity=${encodeURIComponent((selectedNode.data.label as string).split('\n').pop() || '')}`} className="block">
                <Button variant="outline" className="w-full">
                  <Activity className="w-4 h-4 mr-2" /> View Timeline
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
      
    </div>
  );
}
