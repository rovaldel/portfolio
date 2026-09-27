export const prerender = false;

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};
export const GET = () => new Response('{"status":"ok"}', { status: 200, headers });
export const HEAD = () => new Response(null, { status: 200, headers });
export const POST = () =>
  new Response('{"error":"Method Not Allowed"}', {
    status: 405,
    headers: { ...headers, Allow: 'GET, HEAD' },
  });
