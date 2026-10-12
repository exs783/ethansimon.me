// Relay for ethansimon.me/gin-rummy: one Durable Object per room passes strings between a host and a guest.
// It keeps no game state and rules nothing; the host's browser owns the game.
const ORIGINS = ["https://ethansimon.me", "http://localhost:8765", "http://localhost:8000", "http://127.0.0.1:8765"];
const MAX = 8192;

export class Room {
  constructor() { this.host = null; this.guest = null; this.token = null; }

  async fetch(req) {
    const url = new URL(req.url), role = url.searchParams.get("role");
    if (req.headers.get("Upgrade") !== "websocket") return new Response("websocket only", { status: 426 });
    if (role !== "host" && role !== "guest") return new Response("bad role", { status: 400 });
    if (role === "host") {
      const t = url.searchParams.get("token") || "";
      if (t.length < 8 || (this.token && this.token !== t)) return new Response("room taken", { status: 409 });
      this.token = t;
    }
    const other = role === "host" ? "guest" : "host";
    const [client, server] = Object.values(new WebSocketPair());
    server.accept();
    if (this[role]) try { this[role].close(1000, "replaced"); } catch {}
    this[role] = server;
    const send = (ws, m) => { try { ws && ws.send(m); } catch {} };
    const peer = up => JSON.stringify({ t: "peer", up });
    server.addEventListener("message", e => {
      if (typeof e.data !== "string" || e.data.length > MAX || e.data === "ping") return;
      send(this[other], e.data);
    });
    const gone = () => { if (this[role] === server) { this[role] = null; send(this[other], peer(false)); } };
    server.addEventListener("close", gone);
    server.addEventListener("error", gone);
    send(this[other], peer(true));
    send(server, peer(!!this[other]));
    return new Response(null, { status: 101, webSocket: client });
  }
}

export default {
  async fetch(req, env) {
    const m = new URL(req.url).pathname.match(/^\/room\/([a-z0-9]{6,32})$/);
    if (!m) return new Response("gin-rummy-relay", { status: 404 });
    if (!ORIGINS.includes(req.headers.get("Origin"))) return new Response("forbidden", { status: 403 });
    return env.ROOMS.get(env.ROOMS.idFromName(m[1])).fetch(req);
  },
};
