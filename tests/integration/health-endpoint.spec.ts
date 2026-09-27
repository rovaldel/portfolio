import { expect, it } from 'vitest';
import { GET, HEAD, POST } from '../../src/pages/api/salud';

it('implements the exact non-sensitive GET, HEAD and POST health contract', async () => {
  const get = GET();
  const getHeaders = [...get.headers];
  const getBody = await get.text();
  expect(get.status).toBe(200);
  expect(getBody).toBe('{"status":"ok"}');
  const head = HEAD();
  expect(head.status).toBe(200);
  expect(await head.text()).toBe('');
  const post = POST();
  expect(post.status).toBe(405);
  expect(post.headers.get('allow')).toBe('GET, HEAD');
  expect(await post.text()).toContain('Method Not Allowed');
  expect(`${getBody}${JSON.stringify(getHeaders)}`).not.toMatch(/version|host|smtp|secret|server/i);
});
