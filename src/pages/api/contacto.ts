import type { APIRoute } from 'astro';
import { createHash, randomUUID } from 'node:crypto';
import { contactAbuseGuard } from '../../lib/contact-abuse';
import { deliverContact } from '../../lib/contact-mailer';
import { parseContactSubmission } from '../../lib/contact-submission';
import { getUi, isLocale, pathFor } from '../../lib/i18n';
import type { Locale } from '../../lib/i18n';

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

/** The visitor's language travels in the form action (?lang=en); anything else is Spanish. */
const requestLocale = (url: URL): Locale => {
  const value = url.searchParams.get('lang');
  return isLocale(value) ? value : 'es';
};

const failedDelivery = (
  input: { name: string; email: string; message: string },
  locale: Locale,
  status = 503,
  retryAfter?: string,
  wantsJson = false,
) => {
  const text = getUi(locale).contactApi;
  const footer = getUi(locale).footer;
  const action = locale === 'en' ? '/api/contacto?lang=en' : '/api/contacto';
  if (wantsJson)
    return jsonResponse(
      status,
      { ok: false, message: text.unconfirmed },
      retryAfter ? { 'Retry-After': retryAfter } : {},
    );
  return new Response(
    `<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${text.failedPageTitle}</title><main><h1>${text.failedHeading}</h1><p role="alert">${text.failedBody}<a href="mailto:rodrigo.valdelvira@gmail.com">rodrigo.valdelvira@gmail.com</a>.</p><form method="post" action="${action}"><label for="name">${text.labelName}</label><input id="name" name="name" value="${escapeHtml(input.name)}" required minlength="2" maxlength="80"><label for="email">${text.labelEmail}</label><input id="email" name="email" type="email" value="${escapeHtml(input.email)}" required maxlength="254"><label for="message">${text.labelMessage}</label><textarea id="message" name="message" required minlength="20" maxlength="3000">${escapeHtml(input.message)}</textarea><input type="hidden" name="idempotencyKey" value="${randomUUID()}"><input type="hidden" name="contact_check_field" value=""><button type="submit">${text.retry}</button></form><p><a href="${pathFor('privacy', locale)}">${footer.privacy}</a> · <a href="${pathFor('contact', locale)}">${text.backToContact}</a></p></main></html>`,
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
  locale: Locale,
  wantsJson = false,
) => {
  const text = getUi(locale).contactApi;
  const explanation = {
    invalid: text.invalid,
    'too-large': text.tooLarge,
    'content-type': text.contentType,
    origin: text.origin,
    honeypot: text.honeypot,
  }[reason];
  if (wantsJson) return jsonResponse(status, { ok: false, message: explanation });
  return new Response(
    `<!doctype html><html lang="${locale}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${text.rejectedPageTitle}</title><main><h1>${text.rejectedHeading}</h1><p role="alert">${explanation}</p><p><a href="${pathFor('contact', locale)}">${text.backToContact}</a> · <a href="mailto:rodrigo.valdelvira@gmail.com">${text.writeEmail}</a></p><p><a href="${pathFor('privacy', locale)}">${getUi(locale).footer.privacy}</a></p></main></html>`,
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
  const locale = requestLocale(url);
  const wantsJson = request.headers.get('accept')?.includes('application/json') === true;
  const siteOrigin = import.meta.env.SITE ? new URL(import.meta.env.SITE).origin : url.origin;
  const allowedOrigins = import.meta.env.DEV ? [url.origin] : [url.origin, siteOrigin];
  const parsed = await parseContactSubmission(request, allowedOrigins);
  if (!parsed.ok) {
    console.info('contact_submission_rejected', parsed.reason);
    return rejectedSubmission(parsed.status, parsed.reason, locale, wantsJson);
  }
  const connectionKey = createHash('sha256').update(clientAddress).digest('hex');
  const abuse = contactAbuseGuard.take(connectionKey, parsed.value.idempotencyKey);
  if (abuse !== 'allowed')
    return failedDelivery(
      parsed.value,
      locale,
      abuse === 'duplicate' ? 503 : 429,
      abuse === 'rate-limited' ? '900' : undefined,
      wantsJson,
    );
  const result = await deliverContact(parsed.value);
  if (result === 'accepted') {
    if (wantsJson) return jsonResponse(200, { ok: true });
    return redirect(pathFor('contact', locale) + '?enviado=1', 303);
  }
  console.info(`contact_delivery_${result}`);
  return failedDelivery(parsed.value, locale, 503, undefined, wantsJson);
};
