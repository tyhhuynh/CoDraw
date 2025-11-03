import { useEffect, useState, useRef } from "react";
import Button from "./components/Button";
import CanvasBoard from "./components/CanvasBoard";
import { getRoom, setRoom, generateRoomId } from "./lib/room";
import { Toaster, toast } from "sonner";

export default function App() {
  const [currentRoom, setCurrentRoom] = useState<string>(() => getRoom());
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [cooldownRemainingMs, setCooldownRemainingMs] = useState(0);
  const cooldownMS = 5000;
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const handlePopState = () => setCurrentRoom(getRoom());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const startCooldown = () => {
    setIsCoolingDown(true);
    setCooldownRemainingMs(cooldownMS);

    // Update countdown visually each 100ms
    intervalRef.current = window.setInterval(() => {
      setCooldownRemainingMs((prev) => {
        const next = Math.max(0, prev - 100);
        if (next === 0 && intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return next;
      });
    }, 100);

    timerRef.current = window.setTimeout(() => {
      setIsCoolingDown(false);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, cooldownMS);
  };

  const createRoom = async () => {
    if (isCoolingDown) {
      toast.warning(`Please wait ${Math.ceil(cooldownRemainingMs / 1000)}s before creating another room.`);
      return;
    }
  
    const newRoomId = generateRoomId();
    setRoom(newRoomId);
    setCurrentRoom(newRoomId);
  
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Room created and URL copied");
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Room created and URL copied");
      } catch {
        toast.error("Failed to copy room URL");
      }
    }
  
    startCooldown();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto h-full">
      <Toaster
            position="top-center"
            richColors={true}
            duration={3000}
            visibleToasts={3}
          />

      <header className="text-center">
        <h1 className="text-6xl text-text-primary font-bold">CoDraw</h1>
        <h2 className="text-4xl text-text-secondary mt-2">a collaborative digital chalkboard</h2>
      </header>

      <div className="py-4">
        <Button variant="action" size="lg" className="w-full text-3xl font-bold" onClick={createRoom} disabled={isCoolingDown}>
          {isCoolingDown ? `Please wait ${Math.ceil(cooldownRemainingMs / 1000)}s` : "Create Room"}
        </Button>
      </div>

      <CanvasBoard />

      <div className="text-center">
        <p className="text-text-secondary text-4xl font-semibold pt-4">Room ID: {currentRoom}</p>
      </div>

    </div>
  );
}
