import { defineMiddleware } from 'astro:middleware';
import { isAllowedContactSubject } from './lib/contact';
import { canonicalPaths, legacyRedirects } from './lib/routes';

const headers = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
};

const getCanonicalPath = (pathname: string) => {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const lower = decoded.toLocaleLowerCase('es-ES');
  const noSlash = lower !== '/' ? lower.replace(/\/+$/, '') : '/';
  return canonicalPaths.has(noSlash) ? noSlash : null;
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, searchParams } = context.url;
  const legacy = legacyRedirects[pathname];
  const canonical = getCanonicalPath(pathname);
  if (legacy || (canonical && canonical !== pathname)) {
    const target = legacy ?? canonical!;
    const subjects = searchParams.getAll('asunto');
    const subject = subjects.length === 1 ? (subjects[0] ?? null) : null;
    const safeQuery =
      target === '/contacto' && isAllowedContactSubject(subject)
        ? `?asunto=${encodeURIComponent(subject ?? '')}`
        : '';
    return Response.redirect(new URL(`${target}${safeQuery}`, context.url), 308);
  }
  const response = await next();
  for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
  if (context.url.protocol === 'https:')
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return response;
});
