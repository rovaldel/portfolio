import type { APIRoute } from 'astro';
import { createHash, randomUUID } from 'node:crypto';
import { contactAbuseGuard } from '../../lib/contact-abuse';
import { deliverContact } from '../../lib/contact-mailer';
import { parseContactSubmission } from '../../lib/contact-submission';

export const prerender = false;

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\"', '&quot;')
    .replaceAll("'", '&#39;');

const jsonResponse = (
  status: number,
  payload: { ok: boolean; message?: string },
  extraHeaders: Record<string, string> = {},
) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });

const failedDelivery = (
  input: { name: string; email: string; message: string },
  status = 503,
  retryAfter?: string,
  wantsJson = false,
) => {
  if (wantsJson)
    return jsonResponse(
      status,
      {
        ok: false,
        message: 'No se pudo confirmar el envío. Inténtalo de nuevo o escríbeme por email.',
      },
      retryAfter ? { 'Retry-After': retryAfter } : {},
    );
  return new Response(
    `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Entrega no confirmada · Contacto</title><main><h1>No se pudo confirmar la entrega</h1><p role="alert">El mensaje no ha sido confirmado. Tus campos se conservan aquí. También puedes escribir a <a href="mailto:rodrigo.valdelvira@gmail.com">rodrigo.valdelvira@gmail.com</a>.</p><form method="post" action="/api/contacto"><label for="name">Nombre</label><input id="name" name="name" value="${escapeHtml(input.name)}" required minlength="2" maxlength="80"><label for="email">Email</label><input id="email" name="email" type="email" value="${escapeHtml(input.email)}" required maxlength="254"><label for="message">Mensaje</label><textarea id="message" name="message" required minlength="20" maxlength="3000">${escapeHtml(input.message)}</textarea><input type="hidden" name="idempotencyKey" value="${randomUUID()}"><input type="hidden" name="contact_check_field" value=""><button type="submit">Intentar de nuevo</button></form><p><a href="/privacidad">Privacidad</a> · <a href="/contacto">Volver a Contacto</a></p></main></html>`,
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        ...(retryAfter ? { 'Retry-After': retryAfter } : {}),
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  );
};

const rejectedSubmission = (
  status: 400 | 413 | 415,
  reason: 'invalid' | 'too-large' | 'content-type' | 'origin' | 'honeypot',
  wantsJson = false,
) => {
  const explanation = {
    invalid:
      'Revisa que el nombre, el email y el mensaje estén completos. El mensaje debe tener al menos 20 caracteres.',
    'too-large': 'El mensaje supera el tamaño permitido. Acórtalo y vuelve a intentarlo.',
    'content-type': 'No se pudo leer el formulario. Vuelve a Contacto e inténtalo de nuevo.',
    origin:
      'No se pudo validar el origen del envío. Vuelve a cargar Contacto desde el sitio e inténtalo otra vez.',
    honeypot: 'No se pudo validar el envío. Vuelve a cargar Contacto e inténtalo de nuevo.',
  }[reason];
  if (wantsJson) return jsonResponse(status, { ok: false, message: explanation });
  return new Response(
    `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revisa el envío · Contacto</title><main><h1>No se ha enviado el mensaje</h1><p role="alert">${explanation}</p><p><a href="/contacto">Volver a Contacto</a> · <a href="mailto:rodrigo.valdelvira@gmail.com">Escribir por email</a></p><p><a href="/privacidad">Privacidad</a></p></main></html>`,
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  );
};

export const POST: APIRoute = async ({ request, redirect, url, clientAddress }) => {
  const wantsJson = request.headers.get('accept')?.includes('application/json') === true;
  const siteOrigin = import.meta.env.SITE ? new URL(import.meta.env.SITE).origin : url.origin;
  const allowedOrigins = import.meta.env.DEV ? [url.origin] : [url.origin, siteOrigin];
  const parsed = await parseContactSubmission(request, allowedOrigins);
  if (!parsed.ok) {
    console.info('contact_submission_rejected', parsed.reason);
    return rejectedSubmission(parsed.status, parsed.reason, wantsJson);
  }
  const connectionKey = createHash('sha256').update(clientAddress).digest('hex');
  const abuse = contactAbuseGuard.take(connectionKey, parsed.value.idempotencyKey);
  if (abuse !== 'allowed')
    return failedDelivery(
      parsed.value,
      abuse === 'duplicate' ? 503 : 429,
      abuse === 'rate-limited' ? '900' : undefined,
      wantsJson,
    );
  const result = await deliverContact(parsed.value);
  if (result === 'accepted') {
    if (wantsJson) return jsonResponse(200, { ok: true });
    return redirect('/contacto?enviado=1', 303);
  }
  console.info(`contact_delivery_${result}`);
  return failedDelivery(parsed.value, 503, undefined, wantsJson);
};
