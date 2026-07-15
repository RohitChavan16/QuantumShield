import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { MOCK_TRANSACTIONS, MOCK_ALERTS } from '../services/mockData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Tooltip } from '../components/ui/Tooltip';
import { AlertDetailDrawer } from '../components/AlertDetailDrawer';
import { Download, Search, Link as LinkIcon } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export function TransactionExplorer() {
  const [searchParams] = useSearchParams();
  const alertId = searchParams.get('alertId');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('ALL');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  useEffect(() => {
    if (alertId) {
      const alert = MOCK_ALERTS.find(a => a.id === alertId);
      if (alert && alert.linked_transaction) {
        setSearchTerm(alert.linked_transaction.id);
      } else if (alert) {
        setSearchTerm(alert.entity_id);
      }
    }
  }, [alertId]);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (import.meta.env.VITE_MOCK_MODE === 'true' || import.meta.env.DEV) {
        await new Promise(r => setTimeout(r, 400));
        return MOCK_TRANSACTIONS;
      }
      const res = await api.get('/api/v1/transactions');
      return res.data.items;
    }
  });

  const filteredData = transactions?.filter((tx: any) => {
    const matchesSearch = tx.id.includes(searchTerm) || tx.sender.includes(searchTerm) || tx.receiver.includes(searchTerm);
    const matchesDecision = decisionFilter === 'ALL' || tx.decision === decisionFilter;
    return matchesSearch && matchesDecision;
  }) || [];

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  const handleExport = () => {
    if (!filteredData.length) return;
    const headers = ['Transaction ID', 'Sender', 'Receiver', 'Amount', 'Endpoint ID', 'Risk Score', 'Correlated', 'Decision', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((tx: any) => 
        [tx.id, tx.sender, tx.receiver, tx.amount, tx.endpoint_id, tx.risk_score, tx.correlated, tx.decision, tx.timestamp].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: 'Exported successfully', type: 'success' });
  };

  const handleRowClick = (tx: any) => {
    if (tx.correlated) {
      // Mock finding the correlated alert id
      setSelectedAlertId("ALT-8492-BX"); 
    } else {
      toast({ title: 'Transaction details view not implemented for uncorrelated TX', type: 'info' });
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search ID or Account..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select 
            value={decisionFilter} 
            onChange={(e) => {
              setDecisionFilter(e.target.value);
              setPage(1);
            }}
            className="w-40"
          >
            <option value="ALL">All Decisions</option>
            <option value="ALLOW">Allow</option>
            <option value="HOLD">Hold</option>
            <option value="BLOCK">Block</option>
          </Select>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={filteredData.length === 0}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </Card>

      <Card className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead className="text-center">Risk</TableHead>
                <TableHead className="text-center">Correlated</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j}><div className="h-4 bg-surface-alt rounded animate-pulse w-full max-w-[100px]" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-text-muted">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((tx: any) => (
                  <TableRow 
                    key={tx.id} 
                    className="cursor-pointer"
                    onClick={() => handleRowClick(tx)}
                  >
                    <TableCell className="font-mono">{tx.id}</TableCell>
                    <TableCell className="font-mono">{tx.sender}</TableCell>
                    <TableCell className="font-mono">
                      <Tooltip content={tx.receiver}>
                        <span className="truncate block max-w-[120px]">{tx.receiver}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell className={`font-mono text-right ${tx.amount > 100000 ? 'text-critical' : ''}`}>
                      ₹{(tx.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono">{tx.endpoint_id}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={tx.risk_score > 80 ? 'critical' : tx.risk_score > 50 ? 'high' : 'low'} className="w-10 justify-center">
                        {tx.risk_score}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {tx.correlated ? <LinkIcon className="w-4 h-4 text-accent mx-auto" /> : <span className="text-text-muted">-</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.decision === 'BLOCK' ? 'critical' : tx.decision === 'HOLD' ? 'high' : 'outline'}>
                        {tx.decision}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-muted text-xs whitespace-nowrap">
                      {new Date(tx.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t border-border flex justify-between items-center bg-surface shrink-0">
          <span className="text-sm text-text-muted">Showing {Math.min(filteredData.length, (page - 1) * pageSize + 1)} to {Math.min(filteredData.length, page * pageSize)} of {filteredData.length}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </Card>

      <AlertDetailDrawer 
        isOpen={!!selectedAlertId} 
        onClose={() => setSelectedAlertId(null)} 
        alertId={selectedAlertId} 
      />
    </div>
  );
}
