import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
    const [lastMessage, setLastMessage] = useState<any>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            try {
                setLastMessage(JSON.parse(event.data));
            } catch {
                setLastMessage(event.data);
            }
        };

        ws.onerror = (err) => console.error("WebSocket error:", err);

        return () => {
            ws.close();
        };
    }, [url]);

    return { lastMessage, socket: wsRef.current };
}