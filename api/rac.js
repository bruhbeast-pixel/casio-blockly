// Vercel serverless proxy for the RSC compiler.
// Keep the upstream fixed so this endpoint cannot be used as an open proxy.
const UPSTREAM_URL = 'https://casiovn.vercel.app/api/rac';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
    const upstream = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
    const responseBody = await upstream.text();
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json; charset=utf-8');
    return res.status(upstream.status).send(responseBody);
  } catch (error) {
    console.error('RSC compiler proxy error:', error);
    return res.status(502).json({ error: 'The compiler service could not be reached.' });
  }
}
