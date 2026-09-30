// ============================================
// Cloudflare Worker — Lifeasy CRM API Proxy
// ============================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ⚙️ REPLACE with your Apps Script Web App URL
const APPS_SCRIPT_URL = const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx55KaZMOit6w1sp7nMw1hZvxAF4nYX9IKqvrLp6YDMCyPVQJBZeSgnlXetGEshIiavnw/exec';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    try {
      const url = new URL(request.url);

      if (request.method === 'GET') {
        const action = url.searchParams.get('action') || '';
        const res = await fetch(`${APPS_SCRIPT_URL}?action=${action}`, { redirect: 'follow' });
        const text = await res.text();
        return new Response(text, {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }

      if (request.method === 'POST') {
        const body = await request.text();
        const res = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
          redirect: 'follow',
        });
        const text = await res.text();
        return new Response(text, {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }

      return new Response('Method not allowed', { status: 405 });
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: 'Server error: ' + err.message }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }
  },
};