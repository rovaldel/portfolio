import { expect, it, vi } from 'vitest';
import { configureContactMailTransport, deliverContact } from '../../src/lib/contact-mailer';
import type { ContactInput } from '../../src/lib/contact-submission';

const input: ContactInput = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Necesito ayuda con un proyecto real.',
  idempotencyKey: 'abcdefghijklmnop',
  contact_check_field: '',
};
const env = { CONTACT_FROM: 'portfolio@example.com', CONTACT_TO: 'owner@example.com' };

it('confirms only provider acceptance and uses fixed sender/recipient with plain text', async () => {
  const send = vi.fn(async (message: import('../../src/lib/contact-mailer').MailMessage, timeout: number) => {
    void message;
    void timeout;
  });
  await expect(deliverContact(input, { secure: true, send }, env)).resolves.toBe('accepted');
  expect(send).toHaveBeenCalledOnce();
  expect(send.mock.calls[0]![0]).toMatchObject({
    from: env.CONTACT_FROM,
    to: env.CONTACT_TO,
    replyTo: input.email,
  });
});
it('does not confirm rejection, timeout or missing configuration', async () => {
  await expect(
    deliverContact(
      input,
      {
        secure: true,
        send: async () => {
          throw new Error('private detail');
        },
      },
      env,
    ),
  ).resolves.toBe('failed');
  await expect(
    deliverContact(input, { secure: true, send: () => new Promise(() => {}) }, env, 5),
  ).resolves.toBe('failed');
  await expect(deliverContact(input, undefined, env)).resolves.toBe('unavailable');
});

it('supports injection without making provider details part of public errors', async () => {
  const send = vi.fn(async (message: import('../../src/lib/contact-mailer').MailMessage, timeout: number) => {
    void message;
    void timeout;
  });
  configureContactMailTransport({ secure: true, send });
  await expect(deliverContact(input, undefined, env)).resolves.toBe('accepted');
  expect(send).toHaveBeenCalledOnce();
  configureContactMailTransport(undefined);
});

it('fails closed for an adapter that does not require TLS', async () => {
  await expect(deliverContact(input, { secure: false, send: async () => {} }, env)).resolves.toBe(
    'unavailable',
  );
});
