export { WhiteboardDO } from "./WhiteboardDO";

export default {
  async fetch(request, env, _ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("codraw worker ok");
    }

    if (url.pathname.startsWith("/ws/")) {
      let roomId = url.pathname.split("/").pop() || "demo";
      roomId = roomId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50) || "demo";
      const id = env.ROOM_DO.idFromName(roomId);
      const stub = env.ROOM_DO.get(id);
      return stub.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<{ ROOM_DO: DurableObjectNamespace }>;
