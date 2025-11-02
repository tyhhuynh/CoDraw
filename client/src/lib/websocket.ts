import type { Stroke } from "../types";
import { isValidWSMessage } from "./validation";

export type WSMessage =
  | { type: "sync"; strokes: Stroke[] }
  | { type: "stroke"; stroke: Stroke }
  | { type: "undo"; strokeId: string }
  | { type: "ping"; ts: number };

export type WSHandlers = {
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (msg: WSMessage) => void;
  onError?: (err: Event) => void;
};

export function connect(roomId: string, handlers: WSHandlers = {}) {
  const base = import.meta.env.VITE_WS_URL;
  if (!base) {
    return {
      send: (_: WSMessage) => {},
      close: () => {},
      readyState: 3 as const,
    };
  }

  const ws = new WebSocket(`${base.replace(/\/$/, "")}/ws/${roomId}`);

  ws.onopen = () => handlers.onOpen?.();
  ws.onclose = () => handlers.onClose?.();
  ws.onerror = (e) => handlers.onError?.(e as Event);
  ws.onmessage = (e) => {
    try {
      const parsed = JSON.parse(e.data);
      if (isValidWSMessage(parsed)) {
        handlers.onMessage?.(parsed);
      } else {
        console.warn('[WebSocket] Invalid message format received');
      }
    } catch (error) {
      console.warn('[WebSocket] Failed to parse message:', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return {
    send: (msg: WSMessage) => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(msg)),
    close: () => ws.close(),
    get readyState() { return ws.readyState; },
  };
}
