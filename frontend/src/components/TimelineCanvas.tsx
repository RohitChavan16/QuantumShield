import { useRef } from 'react';
import type { EnterpriseTimelineEvent } from '../services/mockData';
import { TimelineEventCard } from './TimelineEventCard';

interface TimelineCanvasProps {
  events: EnterpriseTimelineEvent[];
  selectedEventId: string | null;
  onEventClick: (event: EnterpriseTimelineEvent) => void;
}

const LANES = ['Identity', 'Endpoint', 'Network', 'Transaction', 'AI Engine'] as const;
const LANE_HEIGHT = 320;

export function TimelineCanvas({ events, selectedEventId, onEventClick }: TimelineCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort events chronologically to ensure they flow left-to-right
  const sortedEvents = [...events].sort((a, b) => a.time - b.time);

  // Use fixed spacing based on chronological order to completely prevent collisions!
  const PADDING_X = 50;
  const EVENT_SPACING = 380; // Distance between each event card horizontally
  const CANVAS_WIDTH = Math.max(1200, sortedEvents.length * EVENT_SPACING + (PADDING_X * 2)); 

  const getPositionX = (eventId: string) => {
    const index = sortedEvents.findIndex(e => e.id === eventId);
    if (index === -1) return PADDING_X;
    return PADDING_X + (index * EVENT_SPACING);
  };

  // Draw connecting SVG lines between linked events
  // For simplicity, we just draw lines from event center to event center
  const getEventCoordinates = (eventId: string) => {
    const ev = sortedEvents.find(e => e.id === eventId);
    if (!ev) return null;
    const x = getPositionX(ev.id) + 140; // Card width / 2
    const yIndex = LANES.indexOf(ev.lane as any);
    const y = yIndex * LANE_HEIGHT + (LANE_HEIGHT / 2); // Center of the lane
    return { x, y };
  };

  return (
    <div className="flex-1 overflow-auto bg-[#0A0D14] custom-scrollbar relative" ref={containerRef}>
      <div style={{ width: CANVAS_WIDTH, minHeight: LANES.length * LANE_HEIGHT }} className="relative py-8">
        
        {/* Background Grid Lines (Horizontal) */}
        <div className="absolute inset-0 pointer-events-none flex flex-col pt-8">
          {LANES.map((lane) => (
            <div key={lane} style={{ height: LANE_HEIGHT }} className="border-b border-border/30 w-full relative">
              <span className="absolute left-4 top-4 text-xs font-semibold text-text-muted uppercase tracking-widest">{lane}</span>
            </div>
          ))}
        </div>

        {/* Causal Arrows (SVG) */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', zIndex: 0 }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-border)" className="opacity-50" />
            </marker>
            <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-accent)" />
            </marker>
          </defs>
          
          {sortedEvents.flatMap(event => {
            if (!event.linkedTo) return [];
            const start = getEventCoordinates(event.id);
            if (!start) return [];

            return event.linkedTo.map(targetId => {
              const end = getEventCoordinates(targetId);
              if (!end) return null;
              
              const isSelectedPath = selectedEventId === event.id || selectedEventId === targetId;
              const strokeColor = isSelectedPath ? 'var(--color-accent)' : 'var(--color-border)';
              const strokeOpacity = isSelectedPath ? 1 : 0.3;
              const marker = isSelectedPath ? 'url(#arrowhead-active)' : 'url(#arrowhead)';

              // Draw a bezier curve
              const path = `M ${start.x} ${start.y} C ${start.x + 100} ${start.y}, ${end.x - 100} ${end.y}, ${end.x} ${end.y}`;

              return (
                <path 
                  key={`${event.id}-${targetId}`}
                  d={path}
                  stroke={strokeColor}
                  strokeWidth="2"
                  fill="none"
                  strokeOpacity={strokeOpacity}
                  markerEnd={marker}
                  className="transition-all duration-300"
                />
              );
            });
          })}
        </svg>

        {/* Render Events */}
        <div className="absolute inset-0 pt-8" style={{ zIndex: 10 }}>
          {sortedEvents.map((event) => {
            const laneIndex = LANES.indexOf(event.lane as any);
            const top = laneIndex * LANE_HEIGHT + 30; // 30px padding from top of lane
            const left = getPositionX(event.id);
            
            // Dim if there's a selection and this isn't it
            const isDimmed = selectedEventId ? selectedEventId !== event.id : false;

            return (
              <div 
                id={`timeline-event-${event.id}`}
                key={event.id}
                className="absolute transition-all duration-500"
                style={{ top, left }}
              >
                <TimelineEventCard 
                  event={event} 
                  isSelected={selectedEventId === event.id} 
                  isDimmed={isDimmed}
                  onClick={onEventClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
