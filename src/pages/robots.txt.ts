import type { APIRoute } from 'astro';
import { canonicalUrl } from '../lib/routes';

export const prerender = true;

const policy = [
  'User-agent: *',
  'Allow: /',
  '',
  'User-agent: OAI-SearchBot',
  'Allow: /',
  '',
  'User-agent: PerplexityBot',
  'Allow: /',
  '',
  'User-agent: GPTBot',
  'Disallow: /',
  '',
  'Sitemap: ' + canonicalUrl('/sitemap.xml'),
  '',
].join('\n');

export const GET: APIRoute = () =>
  new Response(policy, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  });
