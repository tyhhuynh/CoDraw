import type { Mode } from "../types";

type Props = {
  mode: Mode;
  setMode: (m: Mode) => void;
  onUndo: () => void;
};

export default function Toolbar({ mode, setMode, onUndo }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-3 py-1 rounded border ${mode==="draw" ? "bg-black text-white" : "bg-white"} `}
        onClick={() => setMode("draw")}
      >
        Draw
      </button>
      <button
        className={`px-3 py-1 rounded border ${mode==="erase" ? "bg-black text-white" : "bg-white"} `}
        onClick={() => setMode("erase")}
      >
        Erase
      </button>

      <div className="mx-2 h-6 w-px bg-gray-300" />

      <button className="px-3 py-1 rounded border bg-white" onClick={onUndo}>Undo</button>
      
    </div>
  );
}
