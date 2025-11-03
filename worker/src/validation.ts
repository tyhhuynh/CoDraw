import type { Point, Stroke, Msg } from "./types";

function isValidPoint(data: unknown): data is Point {
  if (!data || typeof data !== "object") return false;
  const p = data as Record<string, unknown>;
  return (
    typeof p.x === "number" &&
    typeof p.y === "number" &&
    (p.t === undefined || typeof p.t === "number")
  );
}

function isValidStroke(data: unknown): data is Stroke {
  if (!data || typeof data !== "object") return false;
  const s = data as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    (s.mode === "draw" || s.mode === "erase") &&
    typeof s.width === "number" &&
    typeof s.color === "string" &&
    Array.isArray(s.points) &&
    s.points.every(isValidPoint)
  );
}

export function isValidMsg(data: unknown): data is Msg {
  if (!data || typeof data !== "object") return false;
  const msg = data as Record<string, unknown>;
  
  if (typeof msg.type !== "string") return false;
  
  switch (msg.type) {
    case "sync":
      return (
        Array.isArray(msg.strokes) &&
        msg.strokes.every(isValidStroke)
      );
    
    case "stroke":
      return isValidStroke(msg.stroke);
    
    case "undo":
      return typeof msg.strokeId === "string";
    
    case "clear":
      return true;
    
    case "ping":
      return typeof msg.ts === "number";
    
    default:
      return false;
  }
}
