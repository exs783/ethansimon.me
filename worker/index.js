// CORS + Basic-auth proxy for the log dashboard demo.
// Secrets (never in repo): wrangler secret put BACKEND_AUTH  -> "team:<password>"
const ORIGIN = 'https://ethansimon.me';
const UPSTREAM = 'https://vtollogs.williserdman.com/api';
const ALLOWED = new Set(['/health', '/upload']);
const MAX_BYTES = 10 * 1024 * 1024;

const cors = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin',
};

export default {
  async fetch(req, env) {
    const path = new URL(req.url).pathname;
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!ALLOWED.has(path)) return new Response('not found', { status: 404, headers: cors });
    if (req.headers.get('Origin') !== ORIGIN) return new Response('forbidden', { status: 403 });
    if (Number(req.headers.get('Content-Length') || 0) > MAX_BYTES)
      return new Response('too large', { status: 413, headers: cors });

    const headers = new Headers(req.headers);
    headers.set('Authorization', 'Basic ' + btoa(env.BACKEND_AUTH));
    headers.delete('Origin');
    const up = await fetch(UPSTREAM + path, { method: req.method, headers, body: req.body });
    const out = new Response(up.body, up);
    for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
    return out;
  },
};
