export type Point = { x: number; y: number; t?: number };

export type Stroke = {
  id: string;                 // uuid from the client
  mode: "draw" | "erase";     // draw uses source-over; erase uses destination-out
  width: number;              // brush width
  color: string;              // hex/rgb; ignored for erase
  points: Point[];            // polyline points
};

export type Msg =
  | { type: "sync"; strokes: Stroke[] }      // sent on connect or when client asks
  | { type: "stroke"; stroke: Stroke }       // broadcast a finished stroke
  | { type: "undo"; strokeId: string }       // remove a stroke by id
  | { type: "ping"; ts: number };            // latency checks (optional)
