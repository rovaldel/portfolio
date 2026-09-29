import type { APIRoute } from 'astro';
import { canonicalUrl, indexableSurfaces } from '../lib/routes';

export const prerender = true;

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = () => {
  // Every language version lists all of its alternates, as search engines expect.
  const urls = indexableSurfaces
    .map((surface) => {
      const alternates = (['es', 'en'] as const)
        .map(
          (locale) =>
            '<xhtml:link rel="alternate" hreflang="' +
            locale +
            '" href="' +
            escapeXml(canonicalUrl(surface.alternates[locale])) +
            '"/>',
        )
        .join('');
      return '<url><loc>' + escapeXml(canonicalUrl(surface.canonicalPath)) + '</loc>' + alternates + '</url>';
    })
    .join('');
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    urls +
    '</urlset>';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  });
};
