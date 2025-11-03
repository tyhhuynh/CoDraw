import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import Toolbar from "./Toolbar";
import { History } from "../lib/history";
import type { Mode, Point, Stroke } from "../types";
import { connect } from "../lib/websocket";
import { getRoom } from "../lib/room";

const DEFAULT_COLOR = "#ffffff";
const DEFAULT_WIDTH = 4;
const ERASE_WIDTH = 24;

export default function CanvasBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketRef = useRef<ReturnType<typeof connect> | null>(null);

  const [mode, setMode] = useState<Mode>("draw");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const historyRef = useRef(new History());
  const currentRef = useRef<Stroke | null>(null);
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  useEffect(() => {
    const room = getRoom();
    const sock = connect(room, {
      onOpen: () => {
        if (import.meta.env.DEV) console.log("WS open");
      },
      onMessage: (msg) => {
        switch (msg.type) {
          case "sync": {
            historyRef.current = new History();
            for (const s of msg.strokes) historyRef.current.push(s);
            setStrokes(historyRef.current.all());
            break;
          }
          case "stroke": {
            historyRef.current.push(msg.stroke);
            setStrokes(historyRef.current.all());
            break;
          }
          
          case "undo": {
            const all = historyRef.current.all().filter(s => s.id !== msg.strokeId);
            historyRef.current = new History();
            for (const s of all) historyRef.current.push(s);
            setStrokes(historyRef.current.all());
            break;
          }
          case "clear": {
            historyRef.current = new History();
            setStrokes([]);
          break;
          }
        }
      },
      onError: (e) => console.error("WS error", e),
      onClose: () => {
        if (import.meta.env.DEV) console.log("WS closed");
      },
    });
    socketRef.current = sock;
    return () => sock.close();
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const r = canvasRef.current!.getBoundingClientRect();

    if (r.width <= 0 || r.height <= 0) {
      return { x: 0, y: 0, t: Date.now() };
    }
  
    let x = (e.clientX - r.left) / r.width;
    let y = (e.clientY - r.top) / r.height;

    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));
    
    return { x, y, t: Date.now() };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const s: Stroke = {
      id: uuid(),
      mode,
      width: mode === "erase" ? ERASE_WIDTH : DEFAULT_WIDTH,
      color: DEFAULT_COLOR,
      points: [getPos(e)],
    };
    currentRef.current = s;
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = currentRef.current;
    if (!s) return;
    s.points.push(getPos(e));
    drawStroke(s);
  };

  const end = () => {
    const s = currentRef.current;
    if (!s) return;
    currentRef.current = null;

    historyRef.current.push(s);
    setStrokes(historyRef.current.all());

    socketRef.current?.send({ type: "stroke", stroke: s });
  };

  const undo = () => {
    const last = historyRef.current.undo();
    if (!last) return;
    setStrokes(historyRef.current.all());
    
    socketRef.current?.send({ type: "undo", strokeId: last.id });
  };

  const clear = () => {
    historyRef.current = new History();
    setStrokes([]);
    
    socketRef.current?.send({ type: "clear" });
  };

  const drawStroke = useCallback((s: Stroke) => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.save();

    if (s.mode === "erase") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = s.color;
    }
    ctx.lineWidth = s.width;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const pts = s.points;
    if (pts.length < 2) { ctx.restore(); return; }

    const canvasWidth = c.width / dpr;
    const canvasHeight = c.height / dpr;

    ctx.beginPath();
    ctx.moveTo(pts[0].x * canvasWidth, pts[0].y * canvasHeight);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x * canvasWidth, pts[i].y * canvasHeight);
    }
    ctx.stroke();
    ctx.restore();
  }, [dpr]);

  const redraw = useCallback(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    for (const s of strokes) drawStroke(s);
  }, [strokes, drawStroke]);

  useEffect(() => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    c.width = Math.floor(rect.width * dpr);
    c.height = Math.floor(rect.height * dpr);
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }, [dpr, redraw]);

  return (
    <div className="w-full h-[70vh] flex flex-col gap-4">
      <Toolbar mode={mode} setMode={setMode} onUndo={undo} onClear={clear} />
      <canvas
        ref={canvasRef}
        className="w-full h-full border-8 border-[oklch(0.60_0.08_65)] rounded bg-[oklch(0.39_0.07_160)] touch-none"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      />
    </div>
  );
}
