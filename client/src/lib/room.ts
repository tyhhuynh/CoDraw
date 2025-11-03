export function generateRoomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const array = new Uint8Array(12);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    for (let i = 0; i < array.length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 12; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return result;
}

export function getRoom(): string {
  const url = new URL(window.location.href);
  const roomParam = url.searchParams.get("room");
  if (!roomParam) return "demo";
  
  const sanitized = roomParam.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50);
  return sanitized || "demo";
}

export function setRoom(roomId: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set("room", roomId);
  window.history.pushState({}, "", url.toString());
}