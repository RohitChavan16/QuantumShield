import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { MOCK_ALERTS } from '../services/mockData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertDetailDrawer } from '../components/AlertDetailDrawer';
import { useToast } from '../components/ui/Toast';

const COLUMNS = ['NEW', 'INVESTIGATING', 'RESOLVED'];

export function CaseManagement() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: alerts, isLoading, setData } = useQuery({
    queryKey: ['alerts_kanban'],
    queryFn: async () => {
      if (import.meta.env.VITE_MOCK_MODE === 'true' || import.meta.env.DEV) {
        await new Promise(r => setTimeout(r, 400));
        return [...MOCK_ALERTS, {
          id: "ALT-7712-XY", severity: "medium", status: "RESOLVED", score: 45, timestamp: new Date().toISOString(), entity_id: "EP-WS-NYC-01", factors: ["KNOWN_MALWARE_HASH"], raw: {}
        }];
      }
      const res = await api.get('/api/v1/alerts');
      return res.data;
    }
  }) as any;

  // Derived state
  const items = alerts || [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeItem = items.find((i: any) => i.id === active.id);
    const overId = over.id;

    if (!activeItem) return;

    const isOverColumn = COLUMNS.includes(overId);
    const targetStatus = isOverColumn ? overId : items.find((i: any) => i.id === overId)?.status;

    if (activeItem.status !== targetStatus) {
      // Optimistic Update
      setData(items.map((i: any) => i.id === activeItem.id ? { ...i, status: targetStatus } : i));
      
      // Mock API call
      toast({ title: `Moved ${activeItem.id} to ${targetStatus}`, type: 'success' });
      setTimeout(() => {
        // If it was a real API and failed, we would revert to prevData
      }, 500);
    }
  };

  if (isLoading) return <div className="p-6">Loading board...</div>;

  const getItemsByStatus = (status: string) => items.filter((i: any) => i.status === status);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full items-start min-w-[900px]">
            {COLUMNS.map(columnId => (
              <Column key={columnId} id={columnId} title={columnId} items={getItemsByStatus(columnId)} onCardClick={setSelectedAlertId} />
            ))}
          </div>

          <DragOverlay>
            {activeId ? <KanbanCard alert={items.find((i: any) => i.id === activeId)} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <AlertDetailDrawer 
        isOpen={!!selectedAlertId} 
        onClose={() => setSelectedAlertId(null)} 
        alertId={selectedAlertId} 
      />
    </div>
  );
}

function Column({ id, title, items, onCardClick }: { id: string, title: string, items: any[], onCardClick: (id: string) => void }) {
  return (
    <div className="flex-1 w-80 max-w-sm flex flex-col bg-surface-alt/20 rounded-card border border-border h-full">
      <div className="p-3 border-b border-border flex justify-between items-center bg-surface-alt/50 rounded-t-card">
        <h3 className="font-semibold text-sm">{title}</h3>
        <Badge variant="outline" className="text-xs">{items.length}</Badge>
      </div>
      
      <div className="p-3 flex-1 overflow-y-auto">
        <SortableContext id={id} items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3 min-h-[100px]">
            {items.length === 0 ? (
              <div className="text-center p-4 text-xs text-text-muted border-2 border-dashed border-border rounded-card h-24 flex items-center justify-center">
                Drop alerts here
              </div>
            ) : (
              items.map(item => <SortableKanbanCard key={item.id} alert={item} onClick={() => onCardClick(item.id)} />)
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

function SortableKanbanCard({ alert, onClick }: { alert: any, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: alert.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard alert={alert} onClick={onClick} />
    </div>
  );
}

function KanbanCard({ alert, isOverlay, onClick }: { alert: any, isOverlay?: boolean, onClick?: () => void }) {
  if (!alert) return null;
  return (
    <Card 
      className={`p-3 cursor-grab active:cursor-grabbing hover:border-text-muted transition-colors ${isOverlay ? 'shadow-2xl scale-105 rotate-2' : ''}`}
      onClick={(e) => {
        // Prevent click when dragging
        if (e.defaultPrevented) return;
        onClick && onClick();
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-mono text-sm font-semibold">{alert.id}</span>
        <Badge variant={alert.severity} className="text-[10px] py-0 h-4 uppercase">{alert.severity}</Badge>
      </div>
      <div className="text-xs text-text-secondary font-mono truncate mb-2">{alert.entity_id}</div>
      <div className="flex justify-between items-end">
        <div className="flex gap-1 flex-wrap max-w-[70%]">
          {alert.factors.slice(0, 1).map((f: string) => <span key={f} className="text-[9px] px-1 bg-surface-alt rounded text-text-muted truncate max-w-full">{f}</span>)}
        </div>
        <span className={`text-xs font-bold text-${alert.severity}`}>{alert.score}</span>
      </div>
    </Card>
  );
}
