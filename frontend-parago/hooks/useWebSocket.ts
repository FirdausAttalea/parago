import { useEffect, useRef, useState } from "react";

export interface WebSocketMessage {
  type: string;
  vehicle_id?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: unknown;
}

export function useWebSocket(url: string) {
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        setLastMessage(JSON.parse(event.data));
      } catch {
        setLastMessage({ type: "raw", data: event.data });
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => {
      ws.close();
    };
  }, [url]);

  return { lastMessage };
}