import CanvasBoard from "./components/CanvasBoard";

export default function App() {
  return (
    <div className="p-4 max-w-4xl mx-auto h-full">
      <h1 className="font-semibold mb-3">CoDraw – Collaborative Whiteboard (Frontend)</h1>
      <p className="text-sm text-gray-600 mb-2">
        v1: draw / erase (toggle) / undo. Touch supported. Room via <code>?room=</code>.
      </p>
      <CanvasBoard />
    </div>
  );
}
