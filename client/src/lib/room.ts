export function getRoom(): string {
  const url = new URL(window.location.href);
  const roomParam = url.searchParams.get("room");
  if (!roomParam) return "demo";
  
  const sanitized = roomParam.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50);
  return sanitized || "demo";
}