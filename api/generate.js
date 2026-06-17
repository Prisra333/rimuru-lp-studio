export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const key = process.env.FEATHERLESS_API_KEY;
  if (!key) return res.status(500).json({ error: 'FEATHERLESS_API_KEY not set' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    const resp = await fetch('https://api.featherless.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: body.model || 'moonshotai/Kimi-K2.7-Code',
        max_tokens: body.max_tokens || 2000,
        messages: [
          ...(body.system ? [{ role: 'system', content: body.system }] : []),
          ...(body.messages || []),
        ],
      }),
    });

    const raw = await resp.text();
    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'featherless_error', status: resp.status, detail: raw.slice(0, 800) });
    }

    const data = JSON.parse(raw);
    return res.status(200).json({
      content: [{ type: 'text', text: data.choices?.[0]?.message?.content || '' }],
    });
  } catch (e) {
    return res.status(500).json({ error: 'handler_exception', detail: String(e) });
  }
}
