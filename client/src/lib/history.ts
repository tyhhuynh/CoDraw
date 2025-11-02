import type { Stroke } from "../types";

export class History {
  private done: Stroke[] = [];
  push(s: Stroke) { this.done.push(s); }
  undo(): Stroke | undefined { return this.done.pop(); }
  all(): Stroke[] { return this.done.slice(); }
}
