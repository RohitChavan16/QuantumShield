import { useEffect, useRef, useState, useCallback } from 'react';

type WSStatus = 'connecting' | 'open' | 'closed';

interface UseWebSocketOptions {
  url?: string;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [status, setStatus] = useState<WSStatus>('closed');
  const [lastMessage, setLastMessage] = useState<unknown | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectDelay = 10000;

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const wsUrl = options.url || import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
    setStatus('connecting');

    try {
      ws.current = new WebSocket(`${wsUrl}/ws`);

      ws.current.onopen = () => {
        setStatus('open');
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch {
          setLastMessage(event.data);
        }
      };

      ws.current.onclose = () => {
        setStatus('closed');
        ws.current = null;
        
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), maxReconnectDelay);
        reconnectAttempts.current++;
        
        setTimeout(connect, delay);
      };

      ws.current.onerror = () => {
        // Will trigger onclose
      };
    } catch {
      setStatus('closed');
    }
  }, [options.url]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        // Prevent reconnect loop on unmount
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [connect]);

  return { status, lastMessage };
}
