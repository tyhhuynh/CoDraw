export type Point = { x: number; y: number; t?: number };

export type Stroke = {
  id: string;
  mode: "draw" | "erase";
  width: number;
  color: string;
  points: Point[];
};

export type Msg =
  | { type: "sync"; strokes: Stroke[] }
  | { type: "stroke"; stroke: Stroke }
  | { type: "undo"; strokeId: string }  
  | { type: "clear" }
  | { type: "ping"; ts: number };
