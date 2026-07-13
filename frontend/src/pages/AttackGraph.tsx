import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, Share2, Filter, Info, Activity } from 'lucide-react';
import { ReactFlow, Controls, Background, MiniMap } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { Link } from 'react-router-dom';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { id: 'usr-1', position: { x: 100, y: 300 }, data: { label: 'jdoe' }, type: 'input' },
  { id: 'ep-1', position: { x: 400, y: 300 }, data: { label: 'EP-WS-NYC-04' } },
  { id: 'act-1', position: { x: 700, y: 200 }, data: { label: 'ACCT-9901-CORP' } },
  { id: 'ext-1', position: { x: 1000, y: 200 }, data: { label: 'ACCT-8120-EXT' }, type: 'output' },
  { id: 'ep-2', position: { x: 400, y: 500 }, data: { label: 'EP-MOB-881' } },
  { id: 'act-2', position: { x: 700, y: 500 }, data: { label: 'ACCT-1022-RETAIL' } },
  { id: 'ext-2', position: { x: 1000, y: 500 }, data: { label: 'ACCT-0091-EXT' }, type: 'output' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'usr-1', target: 'ep-1', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } },
  { id: 'e2-3', source: 'ep-1', target: 'act-1', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } },
  { id: 'e3-4', source: 'act-1', target: 'ext-1', animated: true, style: { stroke: 'var(--color-critical)', strokeWidth: 2 } },
  { id: 'e1-5', source: 'usr-1', target: 'ep-2', animated: false, style: { stroke: 'var(--color-medium)', strokeWidth: 1 } },
  { id: 'e5-6', source: 'ep-2', target: 'act-2', animated: false, style: { stroke: 'var(--color-medium)', strokeWidth: 1 } },
  { id: 'e6-7', source: 'act-2', target: 'ext-2', animated: false, style: { stroke: 'var(--color-medium)', strokeWidth: 1 } },
];

export function AttackGraph() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const filteredNodes = showCriticalOnly 
    ? initialNodes.filter(n => ['usr-1', 'ep-1', 'act-1', 'ext-1'].includes(n.id)) 
    : initialNodes;

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

        {initialNodes.length === 0 ? (
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
              edges={initialEdges} 
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
              <Link to="/timeline" className="block">
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
