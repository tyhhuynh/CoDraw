import { Msg, Stroke } from "./types";
import { isValidMsg } from "./validation";

const MAX_STROKES = 2000;

export class WhiteboardDO {
  private state: DurableObjectState;
  private strokes: Stroke[] = [];

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(req: Request): Promise<Response> {
    const upgrade = req.headers.get("Upgrade");
    if (upgrade !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    this.state.acceptWebSocket(server);

    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketOpen(ws: WebSocket) {
    const syncMsg: Msg = { type: "sync", strokes: this.strokes };
    try {
      ws.send(JSON.stringify(syncMsg));
    } catch (error) {
      console.error('[WhiteboardDO] Failed to send sync message:', error);
    }
  }

  webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    let msg: Msg | null = null;
    try {
      const text = typeof message === "string" 
        ? message 
        : new TextDecoder().decode(message);
      const parsed = JSON.parse(text);
      if (isValidMsg(parsed)) {
        msg = parsed;
      } else {
        console.warn('[WhiteboardDO] Invalid message format received');
        return;
      }
    } catch (error) {
      console.warn('[WhiteboardDO] Failed to parse WebSocket message:', error instanceof Error ? error.message : 'Unknown error');
      return;
    }
    if (!msg) return;

    if (msg.type === "stroke") {
      this.strokes.push(msg.stroke);
      if (this.strokes.length > MAX_STROKES) this.strokes.shift();
      this.broadcast({ type: "stroke", stroke: msg.stroke });
      return;
    }

    if (msg.type === "undo") {
      this.strokes = this.strokes.filter((s) => s.id !== msg.strokeId);
      this.broadcast({ type: "undo", strokeId: msg.strokeId });
      return;
    }

    if (msg.type === "ping") {
      try {
        ws.send(JSON.stringify({ type: "ping", ts: msg.ts } as Msg));
      } catch (error) {
        console.debug('[WhiteboardDO] Failed to send ping response (socket may be closed)');
      }
      return;
    }

    if (msg.type === "sync") {
      try {
        ws.send(JSON.stringify({ type: "sync", strokes: this.strokes } as Msg));
      } catch (error) {
        console.warn('[WhiteboardDO] Failed to send sync response:', error instanceof Error ? error.message : 'Socket may be closed');
      }
      return;
    }
  }

  webSocketClose(_ws: WebSocket, _code: number, _reason: string, _wasClean: boolean) {
  }

  private broadcast(msg: Msg) {
    const data = JSON.stringify(msg);
    const sockets = this.state.getWebSockets();
    let failedCount = 0;
    
    for (const ws of sockets) {
      try {
        ws.send(data);
      } catch (error) {
        failedCount++;
        if (error instanceof Error && !error.message.includes('closed')) {
          console.debug(`[WhiteboardDO] Broadcast failed to one client (${failedCount}/${sockets.length})`);
        }
      }
    }
    
    if (failedCount > 0 && failedCount === sockets.length) {
      console.warn(`[WhiteboardDO] Broadcast failed to all ${sockets.length} connected clients`);
    }
  }
}