export const CONTACT_BODY_LIMIT = 8192;
const honeypotField = 'contact_check_field';
const allowedFields = new Set(['name', 'email', 'message', 'idempotencyKey', honeypotField]);

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  idempotencyKey: string;
  contact_check_field: string;
};

export type ContactParseResult =
  | { ok: true; value: ContactInput }
  | {
      ok: false;
      status: 400 | 413 | 415;
      reason: 'invalid' | 'too-large' | 'content-type' | 'origin' | 'honeypot';
    };

export function parseContactSubmission(
  request: Request,
  expectedOrigins: string | readonly string[],
): Promise<ContactParseResult> {
  return (async () => {
    const allowedOrigins = new Set(typeof expectedOrigins === 'string' ? [expectedOrigins] : expectedOrigins);
    const originHeader = request.headers.get('origin');
    const referer = request.headers.get('referer');
    let submittedOrigin = originHeader;
    if (!submittedOrigin && referer) {
      try {
        submittedOrigin = new URL(referer).origin;
      } catch {
        submittedOrigin = null;
      }
    }
    if (!submittedOrigin || !allowedOrigins.has(submittedOrigin))
      return { ok: false, status: 400, reason: 'origin' };
    const contentType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
    if (contentType !== 'application/x-www-form-urlencoded' && contentType !== 'multipart/form-data')
      return { ok: false, status: 415, reason: 'content-type' };
    const declaredLength = Number(request.headers.get('content-length') ?? 0);
    if (declaredLength > CONTACT_BODY_LIMIT) return { ok: false, status: 413, reason: 'too-large' };
    const reader = request.body?.getReader();
    if (!reader) return { ok: false, status: 400, reason: 'invalid' };
    const chunks: Uint8Array[] = [];
    let byteLength = 0;
    while (true) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      byteLength += chunk.byteLength;
      if (byteLength > CONTACT_BODY_LIMIT) {
        await reader.cancel();
        return { ok: false, status: 413, reason: 'too-large' };
      }
      chunks.push(chunk);
    }
    const raw = new Uint8Array(byteLength);
    let offset = 0;
    for (const chunk of chunks) {
      raw.set(chunk, offset);
      offset += chunk.byteLength;
    }
    let form: FormData;
    try {
      form = await new Response(raw, {
        headers: { 'content-type': request.headers.get('content-type')! },
      }).formData();
    } catch {
      return { ok: false, status: 400, reason: 'invalid' };
    }
    const entries = [...form.entries()];
    if (entries.some(([key, value]) => !allowedFields.has(key) || typeof value !== 'string'))
      return { ok: false, status: 400, reason: 'invalid' };
    const keys = entries.map(([key]) => key);
    if (
      new Set(keys).size !== allowedFields.size ||
      keys.length !== allowedFields.size ||
      [...allowedFields].some((key) => !keys.includes(key))
    )
      return { ok: false, status: 400, reason: 'invalid' };
    const values = Object.fromEntries(entries) as Record<string, string>;
    const value = values as ContactInput;
    if (value.contact_check_field.trim()) return { ok: false, status: 400, reason: 'honeypot' };
    if (
      value.name.trim().length < 2 ||
      value.name.length > 80 ||
      /[\r\n]/.test(value.name) ||
      value.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) ||
      /[\r\n]/.test(value.email) ||
      value.message.trim().length < 20 ||
      value.message.length > 3000 ||
      value.idempotencyKey.length < 16 ||
      value.idempotencyKey.length > 128 ||
      !/^[\w-]+$/.test(value.idempotencyKey) ||
      value.contact_check_field.length > 200
    )
      return { ok: false, status: 400, reason: 'invalid' };
    return {
      ok: true,
      value: { ...value, name: value.name.trim(), email: value.email.trim(), message: value.message.trim() },
    };
  })();
}
