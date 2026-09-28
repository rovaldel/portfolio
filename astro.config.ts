import node from '@astrojs/node';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { canonicalOrigin } from './src/lib/site-urls';

export default defineConfig({
  output: 'server',
  site: canonicalOrigin,
  adapter: node({ mode: 'standalone', staticHeaders: true }),
  build: { inlineStylesheets: 'never' },
  markdown: { syntaxHighlight: 'prism' },
  // Astro 7.3 emits this internal import for image-runtime logging but does
  // not yet expose its specifier. Resolve it to the matching public build file.
  vite: {
    ssr: {
      noExternal: ['nodemailer'],
    },
    resolve: {
      alias: {
        'astro/_internal/logger': fileURLToPath(
          new URL('./node_modules/astro/dist/core/logger/core.js', import.meta.url),
        ),
      },
    },
  },
  server: { host: true, port: 3000 },
  security: {
    // The health endpoint must return its documented 405 response for every
    // POST. It has no state-changing behavior, so origin enforcement is not
    // needed for this deliberately method-rejecting route.
    checkOrigin: false,
    ...(process.env['NODE_ENV'] === 'development'
      ? {}
      : {
          csp: {
            directives: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "img-src 'self' data:",
              "font-src 'self'",
              "connect-src 'self'",
              'upgrade-insecure-requests',
            ],
            scriptDirective: {
              resources: ["'self'"],
            },
            styleDirective: {
              resources: ["'self'"],
            },
          },
        }),
  },
});
