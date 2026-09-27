import { afterEach, expect, it, vi } from 'vitest';
import { canonicalOrigin } from '../../src/lib/site-urls';
import { configureContactMailTransport, type MailMessage } from '../../src/lib/contact-mailer';
import { POST } from '../../src/pages/api/contacto';

const callPost = async (idempotencyKey: string, message = 'Necesito ayuda con un proyecto real.') => {
  const form = new URLSearchParams({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message,
    idempotencyKey,
    contact_check_field: '',
  });
  const request = new Request(`${canonicalOrigin}/api/contacto`, {
    method: 'POST',
    headers: { origin: canonicalOrigin, 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const context = {
    request,
    url: new URL(request.url),
    clientAddress: '192.0.2.10',
    redirect: (path: string, status = 302) => new Response(null, { status, headers: { location: path } }),
  } as Parameters<typeof POST>[0];
  return POST(context);
};

afterEach(() => configureContactMailTransport(undefined));

it('redirects with 303 only after the injected provider accepts exactly one message', async () => {
  const send = vi.fn(async (message: MailMessage, timeout: number) => {
    void message;
    void timeout;
  });
  vi.stubEnv('CONTACT_FROM', 'portfolio@example.com');
  vi.stubEnv('CONTACT_TO', 'owner@example.com');
  configureContactMailTransport({ secure: true, send });
  const result = await callPost(`contact-${crypto.randomUUID()}`);
  expect(result.status).toBe(303);
  expect(result.headers.get('location')).toBe('/contacto?enviado=1');
  expect(send).toHaveBeenCalledOnce();
});

it('logs only a generic delivery state when configuration is missing', async () => {
  const log = vi.spyOn(console, 'info').mockImplementation(() => {});
  const privateMessage = 'Private message that must not be logged';
  const result = await callPost(`contact-${crypto.randomUUID()}`, privateMessage);
  expect(result.status).toBe(503);
  expect(log).toHaveBeenCalledWith('contact_delivery_unavailable');
  expect(JSON.stringify(log.mock.calls)).not.toContain(privateMessage);
  log.mockRestore();
});

it('retains failed values as escaped text in a no-store accessible response', async () => {
  const message = '<script>alert(1)</script> necesito ayuda';
  const result = await callPost(`contact-${crypto.randomUUID()}`, message);
  const body = await result.text();
  expect(result.status).toBe(503);
  expect(result.headers.get('cache-control')).toBe('no-store');
  expect(result.headers.get('content-type')).toContain('text/html');
  expect(body).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  expect(body).not.toContain('<script>alert(1)</script>');
  expect(body).toContain('role="alert"');
  expect(body).toContain('name="message"');
  expect(body).toContain('href="/privacidad"');
  expect(body).toContain('name="contact_check_field" value="">');
});
