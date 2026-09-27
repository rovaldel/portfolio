import { strict as assert } from 'node:assert';

const domain = process.argv[2];
if (domain !== 'rodrigovaldelvira.com') throw new Error('Dominio canónico inesperado.');
const origin = 'https://' + domain;
const request = (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(15000) });

const health = await request(origin + '/api/salud');
assert.equal(health.status, 200, 'GET /api/salud debe responder 200.');
assert.equal(await health.text(), '{"status":"ok"}', 'La respuesta de health debe ser mínima.');

const head = await request(origin + '/api/salud', { method: 'HEAD' });
assert.equal(head.status, 200, 'HEAD /api/salud debe responder 200.');
assert.equal(await head.text(), '', 'HEAD /api/salud no debe incluir cuerpo.');

const post = await request(origin + '/api/salud', { method: 'POST' });
assert.equal(post.status, 405, 'POST /api/salud debe responder 405.');
assert.match(post.headers.get('allow') ?? '', /GET/);
assert.match(post.headers.get('allow') ?? '', /HEAD/);

const home = await request(origin + '/');
assert.equal(home.status, 200, 'La portada canónica debe responder 200.');
const html = await home.text();
assert.match(html, /<h1\b/i, 'La portada debe incluir su H1 en HTML.');
assert.match(home.headers.get('content-security-policy') ?? '', /default-src 'self'/);
assert.doesNotMatch(home.headers.get('content-security-policy') ?? '', /unsafe-inline/);
assert.equal(home.headers.get('x-frame-options'), 'DENY');
assert.match(home.headers.get('strict-transport-security') ?? '', /^max-age=/);

const redirect = await request('https://www.' + domain + '/sobre-mi?origen=deploy-check', {
  redirect: 'manual',
});
assert.equal(redirect.status, 308, 'www debe redirigir con 308.');
assert.equal(
  redirect.headers.get('location'),
  origin + '/sobre-mi?origen=deploy-check',
  'www debe conservar la ruta y query en el dominio canónico.',
);

console.log('HTTPS, dominio canónico, health y cabeceras públicas verificados.');
