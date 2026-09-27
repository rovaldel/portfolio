import nodemailer from 'nodemailer';
import type { ContactInput } from './contact-submission';

export type MailMessage = { from: string; to: string; replyTo: string; subject: string; text: string };
export type MailTransport = {
  /** The adapter must require verified TLS and must not retry. */
  secure: boolean;
  send(message: MailMessage, timeoutMs: number): Promise<void>;
};

let activeTransport: MailTransport | undefined;

export function configureContactMailTransport(transport?: MailTransport) {
  activeTransport = transport;
}

function gmailTransport(env: NodeJS.ProcessEnv): MailTransport | undefined {
  const user = env['GMAIL_SMTP_USER']?.trim();
  const appPassword = env['GMAIL_SMTP_APP_PASSWORD']?.replace(/\s/g, '');
  if (!user || !appPassword) return undefined;

  const client = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass: appPassword },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  });

  return {
    secure: true,
    async send(message) {
      const result = await client.sendMail(message);
      if (!result.accepted.length) throw new Error('smtp-recipient-rejected');
    },
  };
}

/** Uses Gmail SMTPS only when its application-password credentials are present. */
export async function deliverContact(
  input: ContactInput,
  transport: MailTransport | undefined = undefined,
  env = process.env,
  timeoutMs = 10_000,
) {
  const from = env['CONTACT_FROM']?.trim();
  const to = env['CONTACT_TO']?.trim();
  const selectedTransport = transport ?? activeTransport ?? gmailTransport(env);
  if (!selectedTransport || !selectedTransport.secure || !from || !to) return 'unavailable' as const;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      selectedTransport.send(
        {
          from,
          to,
          replyTo: input.email,
          subject: 'Nueva consulta desde el portfolio',
          text: `Nombre: ${input.name}\nEmail: ${input.email}\n\n${input.message}`,
        },
        timeoutMs,
      ),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error('mail-timeout')), timeoutMs);
      }),
    ]);
    return 'accepted' as const;
  } catch (error) {
    const code =
      error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown';
    console.info('contact_smtp_error', code);
    return 'failed' as const;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
