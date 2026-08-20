// Static demo server: serves the single-page cockpit shell. No backend
// persistence yet -- this just ships the existing demo live for the first
// time. A real KV/PIN-auth backend is a follow-up, same treatment as
// every other cockpit in this portfolio (Feliks, Pasha, Kostya).
let HTML_TEXT: string | null = null;
try {
  HTML_TEXT = await Deno.readTextFile(new URL("./index.html", import.meta.url));
} catch {
  HTML_TEXT = null;
}

Deno.serve((req: Request) => {
  const url = new URL(req.url);
  if (url.pathname === "/health") {
    return new Response(
      JSON.stringify({ ok: true, frontendEmbedded: HTML_TEXT !== null, now: new Date().toISOString() }),
      { headers: { "content-type": "application/json" } },
    );
  }
  if (!HTML_TEXT) {
    return new Response("index.html not found.", { status: 500 });
  }
  return new Response(HTML_TEXT, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" },
  });
});
