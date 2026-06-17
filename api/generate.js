export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const key = process.env.FEATHERLESS_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: 'FEATHERLESS_API_KEY not set' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

  const body = await req.json();

  const resp = await fetch('https://api.featherless.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'moonshotai/Kimi-K2.7-Code',
      max_tokens: body.max_tokens || 8000,
      messages: [
        ...(body.system ? [{ role: 'system', content: body.system }] : []),
        ...(body.messages || []),
      ],
    }),
  });

  const data = await resp.json();

  const converted = {
    content: [{ type: 'text', text: data.choices?.[0]?.message?.content || '' }]
  };

  return new Response(JSON.stringify(converted), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
