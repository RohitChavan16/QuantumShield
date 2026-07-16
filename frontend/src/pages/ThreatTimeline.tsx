import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, Activity, Sparkles, Filter, ChevronDown, Download, Play, Pause, FastForward, SkipBack } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { MOCK_TIMELINE_EVENTS } from '../services/mockData';
import type { EnterpriseTimelineEvent } from '../services/mockData';
import { TimelineCanvas } from '../components/TimelineCanvas';
import { EventDetailsDrawer } from '../components/EventDetailsDrawer';

export function ThreatTimeline() {
  const [searchParams] = useSearchParams();
  const initialEntity = searchParams.get('entity') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialEntity);
  const [hasSearched, setHasSearched] = useState(!!initialEntity);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);

  const data = [...MOCK_TIMELINE_EVENTS].sort((a, b) => a.time - b.time);
  const selectedEvent = data.find(e => e.id === selectedEventId) || null;

  useEffect(() => {
    if (initialEntity) {
      setSearchTerm(initialEntity);
      setHasSearched(true);
    }
  }, [initialEntity]);

  // Playback Engine
  const playbackIndexRef = useRef(-1);
  useEffect(() => {
    let interval: any;
    if (isReplaying) {
      if (selectedEventId) {
        playbackIndexRef.current = data.findIndex(e => e.id === selectedEventId);
      }
      
      interval = setInterval(() => {
        playbackIndexRef.current++;
        if (playbackIndexRef.current >= data.length) {
          // Instead of resetting to 0 and stopping immediately (which makes the last event flash and disappear),
          // We just stop playing and leave it on the last event.
          setIsReplaying(false);
          playbackIndexRef.current = data.length - 1;
        } else {
          setSelectedEventId(data[playbackIndexRef.current].id);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isReplaying, data, selectedEventId]);

  // Auto-scroll to selected event during playback
  useEffect(() => {
    if (isReplaying && selectedEventId) {
      const el = document.getElementById(`timeline-event-${selectedEventId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      }
    }
  }, [selectedEventId, isReplaying]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) setHasSearched(true);
  };

  const handleEventClick = (event: EnterpriseTimelineEvent) => {
    setSelectedEventId(event.id);
    setIsDrawerOpen(true);
    setIsReplaying(false); // Pause playback on click
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEventId(null);
  };

  // Scrubber percentage
  let scrubPercent = 0;
  if (selectedEventId) {
    const idx = data.findIndex(e => e.id === selectedEventId);
    if (idx !== -1 && data.length > 1) {
      scrubPercent = (idx / (data.length - 1)) * 100;
    }
  }

  return (
    <div className="flex flex-col min-h-screen gap-4 pb-4 relative">
      
      {/* 1. Global Header & AI Summary */}
      <div className="flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Threat Timeline</h1>
            <p className="text-sm text-text-muted mt-1">Chronological investigation sequence</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-9">
              <Download className="w-4 h-4 mr-2" /> Export Report
            </Button>
          </div>
        </div>

        {hasSearched && data.length > 0 && (
          <Card className="p-4 border-accent/30 bg-accent/5 flex gap-4">
            <div className="p-2 bg-accent/10 rounded-lg h-fit shrink-0">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-accent mb-1 flex items-center gap-2">
                AI Timeline Summary
                <Badge variant="outline" className="text-[10px] h-4 px-1 border-accent/50 text-accent/80">98% Confidence</Badge>
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-5xl">
                The attack vector originated with a targeted spearphishing campaign compromising <strong className="text-text-primary">sarah.jenkins@corp</strong>. 
                This led to anomalous VPN access and subsequent lateral movement towards the SWIFT Gateway (<strong className="text-text-primary">HDFC-MUM-SWIFT-GW-01</strong>). 
                A high-value fraudulent RTGS transaction of ₹4.5Cr was attempted but successfully blocked by QuantumShield correlation rules.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* 2. Filter Bar */}
      <Card className="p-3 shrink-0 flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search timeline by entity, IP, or event type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 w-full bg-transparent border-border"
            />
          </div>
          <Button type="submit" size="sm" className="h-9">Search</Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-6 w-px bg-border mx-2" />
          <Button variant="outline" size="sm" className="h-9 text-text-secondary border-border hover:bg-surface-alt">
            <Filter className="w-4 h-4 mr-2" />
            Severity
            <ChevronDown className="w-3 h-3 ml-2" />
          </Button>
          <Button variant="outline" size="sm" className="h-9 text-text-secondary border-border hover:bg-surface-alt">
            <Activity className="w-4 h-4 mr-2" />
            Swimlanes
            <ChevronDown className="w-3 h-3 ml-2" />
          </Button>
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer ml-4">
            <input type="checkbox" className="accent-accent w-4 h-4" defaultChecked />
            AI Correlated Only
          </label>
        </div>
      </Card>

      {/* 3. Timeline Canvas */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-[#0A0D14] border-border relative min-h-[1000px]">
        {!hasSearched ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState 
              icon={Activity} 
              title="No Investigation Selected" 
              description="Enter an entity, alert ID, or user to generate a threat timeline." 
            />
          </div>
        ) : data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState 
              icon={Activity} 
              title="No Events Found" 
              description={`No chronological telemetry found for "${searchTerm}".`}
            />
          </div>
        ) : (
          <TimelineCanvas 
            events={data} 
            selectedEventId={selectedEventId} 
            onEventClick={handleEventClick} 
          />
        )}

      </Card>

      <EventDetailsDrawer 
        event={selectedEvent}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />

      {/* 4. Playback Controller (Sticky) */}
      {hasSearched && data.length > 0 && (
        <div className="sticky bottom-8 z-40 flex justify-center pointer-events-none">
          <div className="pointer-events-auto bg-surface/90 backdrop-blur-md border border-border shadow-2xl rounded-full px-6 py-3 flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button 
                className="text-text-muted hover:text-text-primary transition-colors"
                onClick={() => {
                  setSelectedEventId(data[0].id);
                  setIsReplaying(false);
                }}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                className="w-10 h-10 rounded-full bg-accent hover:bg-[#0891B2] text-black flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                onClick={() => {
                  if (!isReplaying) {
                    const currentIndex = data.findIndex(e => e.id === selectedEventId);
                    if (currentIndex === data.length - 1) {
                      setSelectedEventId(data[0].id);
                      playbackIndexRef.current = 0;
                    }
                  }
                  setIsReplaying(!isReplaying);
                }}
              >
                {isReplaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
              <button 
                className="text-text-muted hover:text-text-primary transition-colors"
                onClick={() => {
                  setSelectedEventId(data[data.length - 1].id);
                  setIsReplaying(false);
                }}
              >
                <FastForward className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-8 w-px bg-border/50" />
            
            <div className="flex flex-col gap-1 w-64">
              <div className="flex justify-between text-[10px] text-text-muted font-mono">
                <span>{new Date(data[0].time).toLocaleTimeString()}</span>
                <span>{new Date(data[data.length-1].time).toLocaleTimeString()}</span>
              </div>
              <div className="h-1.5 w-full bg-surface-alt rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300" 
                  style={{ width: `${scrubPercent}%` }}
                />
              </div>
            </div>
            
            <div className="h-8 w-px bg-border/50" />
            
            <span className="text-xs font-semibold text-text-primary">{isReplaying ? "1.5x Speed" : "Paused"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
