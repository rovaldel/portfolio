import { strict as assert } from 'node:assert';

const domain = process.argv[2];
if (domain !== 'rodrigovaldelvira.com') throw new Error('Dominio canónico inesperado.');
const response = await fetch('https://' + domain + '/', { signal: AbortSignal.timeout(15000) });
assert.equal(response.status, 200, 'La versión anterior debe volver a responder en el dominio canónico.');
const html = await response.text();
assert.match(html, /<html\b/i, 'El servicio anterior debe devolver una página HTML.');
assert.match(html, /<h1\b/i, 'La página restaurada debe mantener un título principal.');
console.log('La web anterior volvió a responder por HTTPS.');
