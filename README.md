# CoDraw
A lightweight collaborative chalkboard using Cloudflare Workers & Durable Objects with real-time sync over WebSockets

Create a room, share the link, and draw together

Live: https://codraw.tyhh.dev

## Features

- Draw and erase with smooth strokes
- Undo last stroke, clear board
- Shareable room links
- Real-time sync via WebSockets
- Minimal UI and fast load

## Tech Stack

- Client: React 19, Vite, Tailwind
- Realtime: WebSockets
- Backend: Cloudflare Workers + Durable Objects (in-memory)
- Util: uuid, sonner

## Quick Start

### Prerequisites
- Node 18+
- pnpm/npm
- Cloudflare `wrangler` (for worker)

### Client
```bash
cd client
npm install
# set WebSocket URL for local dev
# Example if worker runs at http://127.0.0.1:8787
echo VITE_WS_URL=http://127.0.0.1:8787 >> .env
npm run dev
```

### Worker
```bash
cd worker
npm install
# Local dev (Durable Object in-memory)
npm run dev
```

Open the client dev server URL (e.g., http://localhost:5173).

## Configuration

- `VITE_WS_URL` (client): Base URL for the worker’s WebSocket endpoint.
  - Example:
    - `http://127.0.0.1:8787` (local)
    - `https://your-worker.example.workers.dev` (prod)
  - Client connects to `${VITE_WS_URL}/ws/:roomId`.

## Deployment

- Worker:
  ```bash
  cd worker
  npm run deploy
  ```
- Client:
  - Set `VITE_WS_URL` to your deployed worker URL.
  ```bash
  cd client
  npm run build
  # host the dist/ directory on your static host
  ```

## Architecture

- Each room maps to a Durable Object instance keyed by room ID.
- On connect, server sends a `sync` message with current strokes.
- Stroke/undo/clear events are validated and broadcast to all room clients.
- Current implementation keeps strokes in memory (no persistence).

## Limitations

- No persistent storage; board resets on DO restarts/redeploys.
- Single color/width defaults (no palette yet).
- Large rooms or extremely long sessions may be trimmed (`MAX_STROKES`).

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Acknowledgements

- Icons: lucide-react
- Toasts: sonner
- Font: DF Thin (embedded)
