import { useState, useEffect, useMemo } from 'react';
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
import { TransactionInvestigationDrawer } from '../components/TransactionInvestigationDrawer';
import { ExportInvestigationModal } from '../components/ExportInvestigationModal';
import { Download, Search, Link as LinkIcon, Filter, Activity, FileText, ChevronUp, ChevronDown, X, RefreshCw, Sparkles } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export function TransactionExplorer() {
  const [searchParams] = useSearchParams();
  const alertId = searchParams.get('alertId');
  
  // State Model
  const [searchTerm, setSearchTerm] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState({
    timeRange: '24h',
    riskScore: 'ALL',
    threatCategory: 'ALL'
  });

  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  
  // Pagination & Sorting State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>({ key: 'timestamp', direction: 'desc' });
  
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

  // Filter Logic
  const filteredData = useMemo(() => {
    let data = transactions || [];
    
    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter((tx: any) => 
        tx.id.toLowerCase().includes(term) || 
        tx.sender.toLowerCase().includes(term) || 
        tx.receiver.toLowerCase().includes(term) ||
        tx.endpoint_id.toLowerCase().includes(term) ||
        (tx.branch && tx.branch.toLowerCase().includes(term))
      );
    }
    
    // Basic Filters
    if (decisionFilter !== 'ALL') {
      data = data.filter((tx: any) => tx.decision === decisionFilter);
    }
    
    // Advanced Filters
    if (advancedFilters.riskScore !== 'ALL') {
      if (advancedFilters.riskScore === 'CRITICAL') data = data.filter((tx: any) => tx.risk_score >= 80);
      else if (advancedFilters.riskScore === 'HIGH') data = data.filter((tx: any) => tx.risk_score >= 50 && tx.risk_score < 80);
      else data = data.filter((tx: any) => tx.risk_score < 50);
    }
    if (advancedFilters.threatCategory !== 'ALL') {
      data = data.filter((tx: any) => tx.threat_category === advancedFilters.threatCategory);
    }

    // Sorting
    if (sortConfig) {
      data = [...data].sort((a: any, b: any) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        if (sortConfig.key === 'timestamp') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [transactions, searchTerm, decisionFilter, advancedFilters, sortConfig]);

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  // KPI Calculations
  const highRiskCount = (transactions || []).filter((tx: any) => tx.risk_score > 70).length;
  const blockedCount = (transactions || []).filter((tx: any) => tx.decision === 'BLOCK').length;
  const totalExposure = (transactions || []).filter((tx: any) => tx.risk_score > 50).reduce((sum: number, tx: any) => sum + tx.amount, 0);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig?.key !== column) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />;
  };

  const toggleRowSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRows(newSet);
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(newSet => {
        paginatedData.forEach((tx: any) => newSet.delete(tx.id));
        return new Set(newSet);
      });
    } else {
      setSelectedRows(newSet => {
        paginatedData.forEach((tx: any) => newSet.add(tx.id));
        return new Set(newSet);
      });
    }
  };

  const handleBulkAction = (action: string) => {
    toast({ title: `Bulk ${action} applied to ${selectedRows.size} transactions.`, type: 'success' });
    setSelectedRows(new Set());
  };

  const selectedTransaction = useMemo(() => {
    if (!selectedTransactionId) return null;
    return transactions?.find((tx: any) => tx.id === selectedTransactionId);
  }, [selectedTransactionId, transactions]);

  return (
    <div className="flex flex-col h-full gap-4 relative">
      
      {/* 1. AI Transaction Summary */}
      <Card className="p-4 border-[#22D3EE]/20 bg-[#22D3EE]/5 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-accent/10 rounded-lg shrink-0">
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-accent mb-1 flex items-center gap-2">
              AI Executive Summary <Badge variant="outline" className="h-4 px-1 text-[10px] border-accent/50 text-accent/80">LIVE</Badge>
            </h2>
            <p className="text-sm text-text-secondary">
              During the last 24 hours, Quantum AI detected <strong>{highRiskCount} high-risk</strong> transactions, 
              including {blockedCount} blocked transfers. Estimated high-risk financial exposure is 
              <strong className="text-text-primary"> ₹{(totalExposure / 10000000).toFixed(2)}Cr</strong>. 
              Highest risk concentration identified in Corporate Treasury endpoints.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto mt-2 sm:mt-0">
          <Button variant="outline" size="sm" className="bg-surface-alt border-border/60 hover:border-accent/40 text-text-secondary hover:text-text-primary transition-colors">
            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="bg-accent/10 border-accent text-accent hover:bg-accent hover:text-background transition-colors font-semibold shadow-lg shadow-accent/20">
            <Sparkles className="w-3.5 h-3.5 mr-2" /> Ask AI
          </Button>
        </div>
      </Card>

      {/* 2. Global KPIs */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <Card className="p-4 bg-[#60A5FA]/20 border-[#60A5FA]/60 shadow-sm shadow-[#60A5FA]/10">
          <p className="text-xs text-text-primary/80 mb-1 font-medium">Analysed Transactions</p>
          <p className="text-2xl font-mono font-bold text-info">{transactions?.length || 0}</p>
        </Card>
        <Card className="p-4 bg-[#EF4444]/20 border-[#EF4444]/60 shadow-sm shadow-[#EF4444]/10">
          <p className="text-xs text-text-primary/80 mb-1 font-medium">High Risk Detected</p>
          <p className="text-2xl font-mono font-bold text-critical">{highRiskCount}</p>
        </Card>
        <Card className="p-4 bg-[#F59E0B]/20 border-[#F59E0B]/60 shadow-sm shadow-[#F59E0B]/10">
          <p className="text-xs text-text-primary/80 mb-1 font-medium">Blocked / Held</p>
          <p className="text-2xl font-mono font-bold text-high">{blockedCount}</p>
        </Card>
        <Card className="p-4 bg-[#34D399]/20 border-[#34D399]/60 shadow-sm shadow-[#34D399]/10">
          <p className="text-xs text-text-primary/80 mb-1 font-medium">Correlation Confidence</p>
          <p className="text-2xl font-mono font-bold text-low">94%</p>
        </Card>
      </div>

      {/* 3. Search & Advanced Filters */}
      <Card className="p-4 flex flex-col gap-4 shrink-0 bg-[#1A2233]/40 border-[#22D3EE]/20 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 w-full">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input 
                placeholder="Smart Search: ID, Account, Endpoint, Branch..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Button 
              variant={showAdvancedFilters ? 'primary' : 'outline'} 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="w-4 h-4 mr-2" /> 
              Advanced Filters
            </Button>
            
            <Select 
              value={decisionFilter} 
              onChange={(e) => {
                setDecisionFilter(e.target.value);
                setPage(1);
              }}
              className="w-40 ml-auto cursor-pointer bg-[#4C1D95]/40 border-[#7C3AED]/50 text-[#EDE9FE] hover:bg-[#4C1D95]/60 focus:ring-[#8B5CF6] transition-colors"
            >
              <option value="ALL" className="bg-surface text-text-primary">All Decisions</option>
              <option value="ALLOW" className="bg-surface text-text-primary">Allow</option>
              <option value="HOLD" className="bg-surface text-text-primary">Hold</option>
              <option value="BLOCK" className="bg-surface text-text-primary">Block</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsExportModalOpen(true)} disabled={filteredData.length === 0}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-border grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <p className="text-xs text-text-muted mb-1">Time Range</p>
              <Select value={advancedFilters.timeRange} onChange={(e) => setAdvancedFilters({...advancedFilters, timeRange: e.target.value})}>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </Select>
            </div>

            <div>
              <p className="text-xs text-text-muted mb-1">Risk Level</p>
              <Select value={advancedFilters.riskScore} onChange={(e) => setAdvancedFilters({...advancedFilters, riskScore: e.target.value})}>
                <option value="ALL">All Risks</option>
                <option value="CRITICAL">Critical (&gt;80)</option>
                <option value="HIGH">High (50-80)</option>
                <option value="LOW">Low (&lt;50)</option>
              </Select>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Threat Category</p>
              <Select value={advancedFilters.threatCategory} onChange={(e) => setAdvancedFilters({...advancedFilters, threatCategory: e.target.value})}>
                <option value="ALL">All Categories</option>
                <option value="Data Exfiltration / Insider">Data Exfiltration</option>
                <option value="Account Takeover">Account Takeover</option>
                <option value="Lateral Movement">Lateral Movement</option>
                <option value="Credential Stuffing">Credential Stuffing</option>
              </Select>
            </div>
          </div>
        )}
      </Card>

      {/* 4. Table Area with Bulk Toolbar */}
      <Card className="flex-1 min-h-[600px] overflow-hidden flex flex-col relative border-2 border-[#60A5FA]/50 shadow-xl shadow-[#60A5FA]/10">
        
        {/* Bulk Action Toolbar */}
        {selectedRows.size > 0 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-surface-alt border border-border shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 z-20 animate-in slide-in-from-top-4">
            <span className="text-sm font-semibold">{selectedRows.size} selected</span>
            <div className="w-px h-4 bg-border"></div>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleBulkAction('Block')}>Block All</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleBulkAction('Assign')}>Assign to Me</Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleBulkAction('Create Case')}>Create Case</Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setSelectedRows(new Set())}><X className="w-4 h-4"/></Button>
          </div>
        )}

        <div className="flex-1 min-h-0 relative [&>div]:h-full [&>div]:absolute [&>div]:inset-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <div className="flex justify-center items-center h-full">
                    <input 
                      type="checkbox" 
                      className="cursor-pointer rounded border-border bg-surface-alt accent-accent"
                      checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                      onChange={toggleAllSelection}
                    />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-surface-alt/50 transition-colors" onClick={() => handleSort('id')}>
                  Transaction ID <SortIcon column="id"/>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-surface-alt/50 transition-colors" onClick={() => handleSort('sender')}>
                  Sender <SortIcon column="sender"/>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-surface-alt/50 transition-colors" onClick={() => handleSort('receiver')}>
                  Receiver <SortIcon column="receiver"/>
                </TableHead>
                <TableHead className="text-right cursor-pointer hover:bg-surface-alt/50 transition-colors" onClick={() => handleSort('amount')}>
                  Amount <SortIcon column="amount"/>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center cursor-pointer hover:bg-surface-alt/50 transition-colors" onClick={() => handleSort('risk_score')}>
                  Risk <SortIcon column="risk_score"/>
                </TableHead>
                <TableHead className="text-center">AI / Corr</TableHead>
                <TableHead className="cursor-pointer hover:bg-surface-alt/50 transition-colors" onClick={() => handleSort('decision')}>
                  Decision <SortIcon column="decision"/>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-surface-alt/50 transition-colors" onClick={() => handleSort('timestamp')}>
                  Timestamp <SortIcon column="timestamp"/>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="!border-info/20">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <TableCell key={j}><div className="h-4 bg-surface-alt rounded animate-pulse w-full max-w-[100px]" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                <TableRow className="!border-info/20">
                  <TableCell colSpan={10} className="h-32 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 opacity-20" />
                      <p>No transactions match your criteria.</p>
                      <Button variant="outline" size="sm" onClick={() => {setSearchTerm(''); setDecisionFilter('ALL'); setAdvancedFilters({timeRange: '24h', riskScore: 'ALL', threatCategory: 'ALL'});}}>Clear Filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((tx: any) => (
                  <TableRow 
                    key={tx.id} 
                    className="cursor-pointer group relative !border-info/20"
                    onClick={() => setSelectedTransactionId(tx.id)}
                  >
                    <TableCell className="text-center" onClick={(e) => toggleRowSelection(tx.id, e)}>
                      <input 
                        type="checkbox" 
                        className="cursor-pointer rounded border-border bg-surface-alt accent-accent"
                        checked={selectedRows.has(tx.id)}
                        onChange={() => {}} 
                      />
                    </TableCell>
                    <TableCell className="font-mono">{tx.id}</TableCell>
                    <TableCell className="font-mono">
                      <Tooltip content={`Branch: ${tx.branch || 'Unknown'}`}>
                        <span>{tx.sender}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="font-mono">
                      <Tooltip content={tx.receiver}>
                        <span className="truncate block max-w-[120px]">{tx.receiver}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell className={`font-mono text-right ${tx.amount > 1000000 ? 'text-critical' : ''}`}>
                      ₹{(tx.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] text-text-secondary border-border bg-surface-alt">
                        {tx.transaction_type || 'UNK'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={`Threat: ${tx.threat_category || 'None'}`}>
                        <Badge variant={tx.risk_score > 80 ? 'critical' : tx.risk_score > 50 ? 'high' : 'low'} className="w-10 justify-center cursor-help">
                          {tx.risk_score}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={`AI Confidence: ${tx.ai_confidence || 0}% | Correlation: ${tx.correlation_score || 0}%`}>
                        <div className="flex items-center justify-center gap-1">
                          {tx.ai_confidence > 80 && <Activity className="w-3 h-3 text-accent" />}
                          {tx.correlated && <LinkIcon className="w-3 h-3 text-high" />}
                          {!tx.correlated && tx.ai_confidence <= 80 && <span className="text-text-muted">-</span>}
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.decision === 'BLOCK' ? 'critical' : tx.decision === 'HOLD' ? 'high' : 'outline'}>
                        {tx.decision}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-muted text-xs whitespace-nowrap">
                      {new Date(tx.timestamp).toLocaleString()}
                    </TableCell>
                    
                    {/* Hover Row Actions overlay */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface p-1 rounded border border-border shadow-lg">
                      <Tooltip content="Investigate">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); setSelectedTransactionId(tx.id); }}>
                          <Search className="w-3 h-3" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Create Case">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); }}>
                          <FileText className="w-3 h-3" />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t border-border flex justify-between items-center bg-surface shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted">
              Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(filteredData.length, page * pageSize)} of {filteredData.length}
            </span>
            <Select 
              value={pageSize.toString()} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="w-20 h-8 text-xs bg-surface-alt"
            >
              <option value="10">10 / pg</option>
              <option value="25">25 / pg</option>
              <option value="50">50 / pg</option>
              <option value="100">100 / pg</option>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </Card>

      {/* Transaction Investigation Drawer */}
      <TransactionInvestigationDrawer 
        isOpen={!!selectedTransactionId} 
        onClose={() => setSelectedTransactionId(null)} 
        transaction={selectedTransaction} 
      />

      {/* Export Investigation Modal */}
      <ExportInvestigationModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedCount={selectedRows.size}
        totalFiltered={filteredData.length}
      />
    </div>
  );
}
