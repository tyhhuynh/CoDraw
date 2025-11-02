export type Point = { x: number; y: number; t?: number };
export type Mode = "draw" | "erase";
export type Stroke = {
  id: string;
  mode: Mode;
  width: number;
  color: string;
  points: Point[];
};