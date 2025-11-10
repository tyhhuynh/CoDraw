import Button from "./Button";
import type { Mode } from "../types";
import { PenLine, Eraser, Undo2, Trash } from "lucide-react";

type Props = {
  mode: Mode;
  setMode: (m: Mode) => void;
  onUndo: () => void;
  onClear?: () => void;
};

export default function Toolbar({ mode, setMode, onUndo, onClear }: Props) {
  return (
    <div className="flex gap-4 w-full">
      <Button
        variant={mode === "draw" ? "tool-active" : "tool-inactive"}
        onClick={() => setMode("draw")}
        className="flex-1"
        aria-pressed={mode === "draw"}
        aria-label="draw tool"
      >
        <PenLine/>
      </Button>
      <Button
        variant={mode === "erase" ? "tool-active" : "tool-inactive"}
        onClick={() => setMode("erase")}
        className="flex-1"
        aria-pressed={mode === "erase"}
        aria-label="erase tool"
      >
        <Eraser />
      </Button>
      <Button
        variant="action"
        onClick={onUndo}
        className="flex-1"
        aria-label="undo"
      >
        <Undo2 />
      </Button>
      <Button
        variant="action"
        onClick={onClear}
        className="flex-1"
        disabled={!onClear}
        aria-label="clear canvas"
      >
        <Trash />
      </Button>
    </div>
  );
}
