import { useState, useEffect } from "react";
import Button from "./components/Button";
import CanvasBoard from "./components/CanvasBoard";
import { getRoom, setRoom, generateRoomId } from "./lib/room";

export default function App() {
  const [currentRoom, setCurrentRoom] = useState<string>(() => getRoom());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoom(getRoom());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const createRoom = () => {
    const newRoomId = generateRoomId();
    setRoom(newRoomId);
    setCurrentRoom(newRoomId);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto h-full">

      <header className="text-center">
        <h1 className="text-4xl font-bold text-text-primary">CoDraw</h1>
        <h2 className="text-4xl text-text-secondary mt-2">a collaborative digital chalkboard</h2>
      </header>

      <div className="py-4">
        <Button variant="action" size="lg" className="w-full text-3xl font-bold" onClick={createRoom}>
          Create Room
        </Button>
      </div>

      <CanvasBoard />

      <div className="text-center">
        <p className="text-text-secondary text-4xl pt-4">Room ID: {currentRoom}</p>
      </div>
      
    </div>
  );
}
