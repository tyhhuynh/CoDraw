import { useState, useEffect } from "react";
import Button from "./components/Button";
import CanvasBoard from "./components/CanvasBoard";
import { getRoom, setRoom, generateRoomId } from "./lib/room";
import { Toaster, toast } from 'sonner';

export default function App() {
  const [currentRoom, setCurrentRoom] = useState<string>(() => getRoom());

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoom(getRoom());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    }
  }

  const createRoom = async () => {
    const newRoomId = generateRoomId();
    setRoom(newRoomId);
    setCurrentRoom(newRoomId);

    const roomUrl = window.location.href;

    const copied = await copyToClipboard(roomUrl);

    if (copied) {
      toast.success('Room created', {
        description: 'URL is copied to your clipboard!'
      });
    } else {
      toast.error('Could not copy link', {
        description: roomUrl,
        action: {
          label: 'Copy',
          onClick: async () => {
            const ok = await copyToClipboard(roomUrl);
            if (ok) toast.success('Copied!');
          },
        },
      });
    }

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

      <Toaster
            position="top-center"
            richColors={true}
            duration={3000}
            visibleToasts={3}
          />
      
    </div>
  );
}
