import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useWebSocket(path: string) {
  const ws = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}${path}`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'FILTER_UPDATE') {
        queryClient.invalidateQueries({ queryKey: ['filters'] });
      } else if (data.type === 'ANALYTICS_UPDATE') {
        queryClient.invalidateQueries({ queryKey: ['analytics'] });
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [path, queryClient]);

  return ws.current;
}
