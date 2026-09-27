import type { APIRoute } from 'astro';
import { canonicalUrl, indexableSurfaces } from '../lib/routes';

export const prerender = true;

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = () => {
  const urls = indexableSurfaces
    .map((surface) => '<url><loc>' + escapeXml(canonicalUrl(surface.canonicalPath)) + '</loc></url>')
    .join('');
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    urls +
    '</urlset>';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  });
};
