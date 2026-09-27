import { createHash } from 'node:crypto';
import source from '../../assets/Rodrigo-Valdelvira-CV.pdf?inline';

export const prerender = false;
const document = Buffer.from(source.slice(source.indexOf(',') + 1), 'base64');
if (
  createHash('sha256').update(document).digest('hex') !==
  '889781068935b4a4838422a61709e2a3449efe74536060474ee0f0707f9cd7b4'
) {
  throw new Error('CV asset integrity check failed');
}

const getHeaders = (contentLength: number) => ({
  'Content-Type': 'application/pdf',
  'Content-Disposition': 'attachment; filename="Rodrigo-Valdelvira-CV.pdf"',
  'X-Robots-Tag': 'noindex, noarchive',
  'Cache-Control': 'public, max-age=0',
  'Content-Length': String(contentLength),
});
export const GET = async () => {
  return new Response(document, { headers: getHeaders(document.byteLength) });
};
export const HEAD = async () => {
  return new Response(null, { headers: getHeaders(document.byteLength) });
};
