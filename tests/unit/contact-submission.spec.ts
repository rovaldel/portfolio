import { describe, expect, it } from 'vitest';
import { parseContactSubmission } from '../../src/lib/contact-submission';

const payload = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Necesito ayuda con un proyecto real.',
  idempotencyKey: 'abcdefghijklmnop',
  contact_check_field: '',
};
const request = (body: Record<string, string> = payload, headers: Record<string, string> = {}) =>
  new Request('https://portfolio.example/api/contacto', {
    method: 'POST',
    headers: {
      origin: 'https://portfolio.example',
      'content-type': 'application/x-www-form-urlencoded',
      ...headers,
    },
    body: new URLSearchParams(body),
  });

describe('contact request boundary', () => {
  it('accepts the exact valid field set', async () => {
    expect((await parseContactSubmission(request(), 'https://portfolio.example')).ok).toBe(true);
  });
  it.each([
    { name: 'A' },
    { name: 'A'.repeat(81) },
    { email: 'bad' },
    { email: 'a'.repeat(255) },
    { message: 'short' },
    { message: 'x'.repeat(3001) },
  ])('rejects invalid field limits', async (replace) => {
    expect(
      await parseContactSubmission(request({ ...payload, ...replace }), 'https://portfolio.example'),
    ).toMatchObject({ ok: false, status: 400 });
  });
  it('rejects a request with no Origin header', async () => {
    expect(
      await parseContactSubmission(request(payload, { origin: '' }), 'https://portfolio.example'),
    ).toMatchObject({ reason: 'origin' });
  });
  it('rejects unexpected, duplicate and missing fields', async () => {
    expect(
      await parseContactSubmission(request({ ...payload, extra: 'x' }), 'https://portfolio.example'),
    ).toMatchObject({ ok: false });
    const duplicate = new Request('https://portfolio.example/api/contacto', {
      method: 'POST',
      headers: { origin: 'https://portfolio.example', 'content-type': 'application/x-www-form-urlencoded' },
      body: `${new URLSearchParams(payload)}&name=second`,
    });
    expect(await parseContactSubmission(duplicate, 'https://portfolio.example')).toMatchObject({ ok: false });
    const missing = Object.fromEntries(
      Object.entries(payload).filter(([key]) => key !== 'contact_check_field'),
    ) as Record<string, string>;
    expect(await parseContactSubmission(request(missing), 'https://portfolio.example')).toMatchObject({
      ok: false,
    });
  });
  it('rejects wrong content type, origin, honeypot, CRLF and oversized bodies', async () => {
    expect(
      await parseContactSubmission(
        request(payload, { 'content-type': 'application/json' }),
        'https://portfolio.example',
      ),
    ).toMatchObject({ status: 415 });
    expect(
      await parseContactSubmission(
        request(payload, { origin: 'https://evil.example' }),
        'https://portfolio.example',
      ),
    ).toMatchObject({ reason: 'origin' });
    expect(
      await parseContactSubmission(
        request({ ...payload, contact_check_field: 'bot' }),
        'https://portfolio.example',
      ),
    ).toMatchObject({ reason: 'honeypot' });
    expect(
      await parseContactSubmission(
        request({ ...payload, name: 'Ada\r\nBcc:x' }),
        'https://portfolio.example',
      ),
    ).toMatchObject({ ok: false });
    const big = new Request('https://portfolio.example/api/contacto', {
      method: 'POST',
      headers: { origin: 'https://portfolio.example', 'content-type': 'application/x-www-form-urlencoded' },
      body: `x=${'a'.repeat(8200)}`,
    });
    expect(await parseContactSubmission(big, 'https://portfolio.example')).toMatchObject({ status: 413 });
  });
});
