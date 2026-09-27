import { afterEach, expect, it, vi } from 'vitest';
import nodemailer from 'nodemailer';
import { deliverContact } from '../../src/lib/contact-mailer';

vi.mock('nodemailer', () => ({ default: { createTransport: vi.fn() } }));
afterEach(() => vi.resetAllMocks());
const input = {
  name: 'Prueba local',
  email: 'visitor@example.com',
  message: 'Consulta de prueba sin envío de correo real.',
  idempotencyKey: 'local-test-id-123456',
  contact_check_field: '',
};
const env = {
  GMAIL_SMTP_USER: 'rodrigo.valdelvira@gmail.com',
  GMAIL_SMTP_APP_PASSWORD: 'test-only-placeholder',
  CONTACT_FROM: 'rodrigo.valdelvira@gmail.com',
  CONTACT_TO: 'rodrigo.valdelvira@gmail.com',
};

it('envía por Gmail con TLS, destino fijo y Reply-To del visitante', async () => {
  const sendMail = vi.fn().mockResolvedValue({ accepted: [env.CONTACT_TO] });
  vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as unknown as ReturnType<
    typeof nodemailer.createTransport
  >);
  expect(await deliverContact(input, undefined, env)).toBe('accepted');
  expect(nodemailer.createTransport).toHaveBeenCalledWith(
    expect.objectContaining({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: env.GMAIL_SMTP_USER, pass: env.GMAIL_SMTP_APP_PASSWORD },
    }),
  );
  expect(sendMail).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO,
      replyTo: input.email,
    }),
  );
});

it('no simula éxito si Gmail no acepta al destinatario o faltan credenciales', async () => {
  const sendMail = vi.fn().mockResolvedValue({ accepted: [] });
  vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as unknown as ReturnType<
    typeof nodemailer.createTransport
  >);
  expect(await deliverContact(input, undefined, env)).toBe('failed');
  expect(await deliverContact(input, undefined, { ...env, GMAIL_SMTP_APP_PASSWORD: '' })).toBe('unavailable');
  expect(sendMail).toHaveBeenCalledTimes(1);
});
