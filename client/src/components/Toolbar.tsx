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
      >
        <PenLine/>
      </Button>
      <Button
        variant={mode === "erase" ? "tool-active" : "tool-inactive"}
        onClick={() => setMode("erase")}
        className="flex-1"
      >
        <Eraser />
      </Button>
      <Button
        variant="action"
        onClick={onUndo}
        className="flex-1"
      >
        <Undo2 />
      </Button>
      <Button
        variant="action"
        onClick={onClear}
        className="flex-1"
        disabled={!onClear}
      >
        <Trash />
      </Button>
    </div>
  );
}
