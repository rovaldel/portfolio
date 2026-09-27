# Contract: HTTP routes and documents

## Canonical public surfaces

Every route below accepts `GET` and `HEAD`. `GET` returns `200`, `Content-Type: text/html; charset=utf-8`, a Spanish semantic document, one visible H1, useful route-specific content and normal navigation without needing JavaScript. `HEAD` returns equivalent status and headers without a body.

| Canonical path | Required content | Publication/index state |
|---|---|---|
| `/` | “Soy Rodrigo, AI Engineer”, honest value proposition, portrait and primary navigation | approved/index |
| `/sobre-mi` | Profile, location, availability, languages and interests | approved/index |
| `/habilidades` | Grouped ordered skills without ratings | approved/index |
| `/servicios` | Exactly six summaries, full descriptions and contact links | approved/index |
| `/experiencia` | Complete approved experience and dates | approved/index |
| `/formacion` | Exactly six approved records | approved/index |
| `/proyectos` | Exactly Leadia and Nami | approved/index |
| `/proyectos/leadia` | Leadia case and safe external link | approved/index |
| `/proyectos/nami` | Nami case and “En fase de diseño”, without empty external link | approved/index |
| `/bitacora` | Exactly the published LangGraph article | approved/index |
| `/bitacora/langgraph-para-agentes-en-produccion` | Full article and coherent metadata | approved/index |
| `/contacto` | Approved channels, unavailable form state and `mailto:` alternative | approved/index |
| `/privacidad` | Visibly marked working draft | working-draft/noindex |
| `/cookies` | Working draft explaining only `rv_theme`; no consent banner | working-draft/noindex |
| `/terminos` | Visibly marked working draft | working-draft/noindex |

Legal documents exist for local visual validation, but public production release remains blocked while any is `working-draft`.

## Canonicalization and errors

- Canonical pages use lowercase kebab-case and no trailing slash except `/`.
- A known case, accent, legacy name or trailing-slash variant returns a permanent `308` to the canonical path and preserves only a safe query string.
- A path not in the route/redirect catalog returns a real `404`, not a soft 200, using the same visual system and links to `/`, `/proyectos` and `/contacto`.
- An unexpected error returns `500`, never a trace, filesystem path, environment value or internal identifier, and offers the same three recovery destinations.
- The stable PDF filename is an explicit named-asset exception to the lowercase URL rule.

## Theme/contact query

The only accepted preselection query is `/contacto?asunto={service-slug}`, where `service-slug` belongs to the six-entry allowlist. Invalid, repeated or oversized values are ignored, are not reflected into HTML and do not produce an error page. Query values are not stored.

## Health endpoint

`GET /api/salud` follows [health.openapi.yaml](health.openapi.yaml) and returns only:

```json
{"status":"ok"}
```

It is dynamic, uses `Cache-Control: no-store` and reveals no build, host, dependency or future SMTP detail.

## CV document

`GET /Rodrigo-Valdelvira-CV.pdf` returns:

- `200` and the bytes copied from `mockup/Rodrigo_Valdelvira_CV_AI_Engineer.pdf`;
- `Content-Type: application/pdf`;
- `Content-Disposition: attachment; filename="Rodrigo-Valdelvira-CV.pdf"`;
- `X-Robots-Tag: noindex, noarchive`;
- the expected source SHA-256 from master spec §0.2;
- selectable text preserved.

Every CV control targets this URL and uses download name `Rodrigo-Valdelvira-CV.pdf`. Known previous PDF names redirect `308` to it.

## External destinations and assets

- Leadia targets `https://leadia.es` with a new browsing context and `rel="noopener noreferrer"`.
- LinkedIn targets exactly `https://www.linkedin.com/in/rovaldel`.
- Email and phone are semantic `mailto:` and `tel:` links with visible values.
- Nami does not expose an external anchor.
- All images, CSS, JavaScript and WOFF2 fonts are served by this application. The rendered page makes no request to a third-party origin.
- Asset failures do not turn a page into an error response; the UI contract defines stable fallbacks.

## Security headers

The packaged application attaches the following to HTML and applicable assets. HSTS is asserted only when the request is served through production HTTPS; all other headers are tested locally on the running container.

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' <build-hashes>; style-src 'self' <build-hashes>; img-src 'self' data:; font-src 'self'; connect-src 'self'; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
X-Frame-Options: DENY
```

`unsafe-inline` and `unsafe-eval` are absent. Hashes are generated by the build and served as response headers using Astro CSP plus Node adapter `staticHeaders`.

## Explicit exclusions

- `POST /api/contacto` does not exist in spec 000. The browser must not attempt it and the UI must not simulate any result.
- Sitemap, JSON-LD, `robots.txt` and `llms.txt` are contracts of spec 010.
- HTTPS redirects, `www` redirect, deployment and rollback are completed by spec 020; this contract only ensures the application behaves correctly behind that proxy.
