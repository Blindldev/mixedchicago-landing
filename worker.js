export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = new Set([
      'https://mixedchicago.com',
      'https://www.mixedchicago.com',
      'https://blindldev.github.io'
    ]);
    const headers = {
      'Access-Control-Allow-Origin': allowed.has(origin) ? origin : 'https://mixedchicago.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
      'Vary': 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'POST') return new Response(JSON.stringify({ ok:false, error:'Method not allowed' }), { status: 405, headers });

    try {
      const { email, hp } = await request.json();
      if (hp) return new Response(JSON.stringify({ ok:true }), { status: 204, headers }); // honeypot trip

      const value = (email || '').toLowerCase().trim();
      const ok = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
      if (!ok) return new Response(JSON.stringify({ ok:false, error:'Invalid email' }), { status: 400, headers });

      // De-dupe on email; KV free tier is fine for < 1k entries
      await env.MM_SUBSCRIBERS.put(value, JSON.stringify({
        email: value,
        ts: new Date().toISOString(),
        source: 'mixedchicago.com'
      }), { metadata: { email: value } });

      return new Response(JSON.stringify({ ok:true }), { status: 201, headers });
    } catch (e) {
      return new Response(JSON.stringify({ ok:false, error:'Server error' }), { status: 500, headers });
    }
  }
}
