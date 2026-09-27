# Research: Esqueleto visual funcional

**Feature**: `000-esqueleto-visual-funcional`  
**Date**: 2026-09-10

No quedan aclaraciones técnicas pendientes. Las decisiones siguientes resuelven la arquitectura, las dependencias, las integraciones y las puertas de esta feature.

## 1. Framework y modelo de renderizado

**Decision**: Usar Astro 7.3 con TypeScript estricto, salida estática por defecto y `@astrojs/node` 11.1 en modo `standalone`. Prerenderizar todas las rutas públicas; declarar solo `/api/salud` y, en la futura spec 020, `/api/contacto` como rutas bajo demanda. No incorporar React, Vue, Svelte ni otra capa de UI.

**Rationale**: El producto es contenido público con mejoras locales. Astro genera HTML de cada ruta por defecto y permite mezclarlo con endpoints dinámicos dentro del mismo artefacto. El adaptador standalone sirve páginas, API y activos con un único proceso. Los componentes `.astro` no envían runtime de hidratación por sí mismos y los pocos comportamientos de esta spec caben en módulos TypeScript DOM. Esto satisface HTML útil sin JavaScript y deja preparada la frontera de contacto sin crear otro servicio. Véanse la [renderización bajo demanda](https://docs.astro.build/en/guides/on-demand-rendering/), los [endpoints](https://docs.astro.build/en/guides/endpoints/) y el [adaptador Node](https://docs.astro.build/en/guides/integrations-guide/node/).

**Alternatives considered**:

- Next.js App Router con `output: "standalone"`: cumple el modelo de proceso único y dispone de Route Handlers, pero añade runtime React/RSC innecesario para este sitio y su ruta documentada de CSP con nonce fuerza renderizado dinámico de las páginas; la alternativa SRI que preserva estáticos sigue siendo experimental. Se descarta por la tensión entre prerenderizado, CSP estricta y JavaScript mínimo. Véase la [guía CSP de Next.js](https://nextjs.org/docs/app/guides/content-security-policy).
- Next.js con exportación totalmente estática: no puede alojar el futuro endpoint dinámico de contacto dentro del mismo proceso, por lo que contradice la arquitectura cerrada.

## 2. Runtime, gestor y reproducibilidad

**Decision**: Node.js 24 LTS, TypeScript 7.0 y pnpm 12.3, todos fijados a versión exacta al implementar. Declarar pnpm en `packageManager`, versionar `pnpm-lock.yaml`, instalar con lockfile congelado y fijar por digest las imágenes de Node y Playwright. Ejecutar `astro check` antes de `astro build`.

**Rationale**: Node 24 es LTS soportado en la fecha del plan y ofrece más recorrido que la versión 22 usada por las herramientas preparatorias. El lockfile y los digests hacen repetibles build, auditoría y capturas. Astro transpila TypeScript durante build, pero el chequeo de tipos es una puerta separada. El repositorio migrará de manera coherente los comandos actuales de npm/Node 22 en `package.json`, README y CI. Véanse el [calendario oficial de Node](https://nodejs.org/en/about/previous-releases) y la [guía TypeScript de Astro](https://docs.astro.build/en/guides/typescript/).

**Alternatives considered**:

- Mantener npm sin lockfile: no satisface la auditoría `pnpm audit --prod` exigida por la maestra ni la instalación congelada.
- Mantener Node 22: sigue soportado, pero tiene menos margen de mantenimiento. No existe compatibilidad conocida que obligue a conservarlo.
- Usar la etiqueta `latest`: impide reproducir la misma aplicación o el mismo navegador y queda descartada.

## 3. Fuente única de contenido público

**Decision**: Crear `src/content/site.ts` como fuente pública breve, tipada y validada, y una colección Markdown para el único artículo. Usar `content/es.json`, el CV, la maestra y el mockup solo como entradas editoriales/proveniencia; no importar directamente `content/es.json` en las páginas ni editarlo.

**Rationale**: El JSON generado refleja el golden, pero conserva TalentTools como `HOY`, puntuaciones de habilidades y cinco teasers. Publicarlo directamente violaría veracidad y alcance. Una proyección pública única permite aplicar exactamente las correcciones aprobadas y reutilizar el mismo dato en páginas, tarjetas, respuestas y metadatos base. Markdown sin HTML arbitrario conserva el artículo completo de manera revisable.

**Alternatives considered**:

- Editar `content/es.json`: prohibido por la constitución porque es generado y protegido.
- Importar el JSON y parchear valores dentro de componentes: duplica reglas, permite divergencias y contradice FR-033.
- Añadir CMS o base de datos: fuera de alcance y sin necesidad operativa.

## 4. JavaScript progresivo y tema antes del primer pintado

**Decision**: Mantener enlaces y controles HTML como base y mejorar únicamente los estados definidos en [contracts/ui-states.md](contracts/ui-states.md). Aplicar Rioja en el HTML inicial y cargar, antes de la hoja de estilos, un pequeño script externo y propio que valide `localStorage.rv_theme`; después, el selector opera como módulo externo. No usar handlers ni estilos inline.

**Rationale**: Un script bloqueante local y mínimo puede establecer el atributo de tema antes del primer pintado sin relajar `script-src 'self'`. Si el almacenamiento no existe, falla o contiene otro valor, el documento conserva Rioja. Los enlaces siguen funcionando sin JavaScript y los temporizadores/transiciones se cancelan al navegar.

**Alternatives considered**:

- Script inline de tema: requeriría hash o nonce y complica la cabecera sin aportar funcionalidad.
- React global o store de estado: añade hidratación para estados efímeros que la plataforma web resuelve directamente.
- Cookie de tema: introduce almacenamiento servidor y semántica de cookies innecesarios.

## 5. CSP y cabeceras

**Decision**: Habilitar la CSP estable de Astro, configurar `build.inlineStylesheets: "never"` y recursos propios, y activar `staticHeaders: true` en el adaptador Node para convertir la política generada en cabecera HTTP también para páginas prerenderizadas. Añadir las demás cabeceras de §11.3 mediante middleware/configuración y probar el build empaquetado. No usar `unsafe-inline`, `unsafe-eval`, recursos remotos ni atributos de estilo dinámicos.

**Rationale**: Astro puede calcular hashes de sus scripts/estilos de build; el adaptador Node puede servirlos como cabecera para los estáticos, lo cual permite aplicar `frame-ancestors` y mantener la prerenderización. La documentación oficial describe [CSP con hashes](https://docs.astro.build/en/reference/configuration-reference/#securitycsp) y [`staticHeaders`](https://docs.astro.build/en/guides/integrations-guide/node/#staticheaders).

**Alternatives considered**:

- CSP solo en `<meta>`: no cubre todas las directivas, en particular `frame-ancestors`, y no satisface el contrato de cabeceras.
- Nonce por petición: convertiría páginas estáticas en renderizado bajo demanda sin necesidad funcional.
- Relajar con `unsafe-inline`: prohibido por constitución y maestra.

## 6. Activos, imágenes y CV

**Decision**: Copiar los activos normativos desde `mockup/` a `public/` sin modificar los originales, generar en build variantes responsivas AVIF/WebP cuando corresponda y mantener dimensiones explícitas y fallback estable. Copiar el PDF vigente a `/Rodrigo-Valdelvira-CV.pdf`, comprobar su SHA-256 y servirlo con las cabeceras del contrato.

**Rationale**: Todos los recursos quedan dentro del artefacto y no existe dependencia de red. Dimensiones y `srcset` evitan saltos de composición. La URL estable y el hash demuestran que todos los CTA entregan el mismo documento con texto seleccionable.

**Alternatives considered**:

- CDN, Google Fonts o imágenes remotas: infringen FR-032 y amplían CSP/superficie de privacidad.
- Optimización de imagen en runtime: exigiría caché escribible dentro del contenedor de solo lectura.
- Sustituir activos por aproximaciones: vulnera el contrato visual.

## 7. Pruebas unitarias, de integración y E2E

**Decision**: Usar Vitest en Node para esquemas e invariantes puras y Playwright contra `astro build` para páginas/componentes, recorridos y HTTP. Configurar proyectos Chromium y Firefox, además de variantes Chromium sin JavaScript y con `reducedMotion: "reduce"`. Integrar axe en rutas, temas y estados interactivos; mantener revisión manual de teclado, lector de pantalla, zoom y móvil.

**Rationale**: Vitest reutiliza la configuración Vite de Astro sin añadir jsdom ni otra librería de componentes. Playwright verifica el resultado realmente servido, puede desactivar JavaScript, emular movimiento reducido y recorrer varios motores. Axe detecta fallos comunes pero no sustituye la revisión humana. Véanse las guías de [testing en Astro](https://docs.astro.build/en/guides/testing/), [emulación de Playwright](https://playwright.dev/docs/emulation) y [accesibilidad con Playwright](https://playwright.dev/docs/accessibility-testing).

**Alternatives considered**:

- Jest/Testing Library: duplican configuración y suponen un framework de UI inexistente.
- Snapshots HTML unitarios: frágiles y menos representativos que roles, contenido y navegador real.
- Solo axe: no demuestra foco, orden, Escape, devolución de foco, zoom o calidad de alternativas.

## 8. Comparación visual y evidencia

**Decision**: Parametrizar las 19 escenas desde `design/golden.config.json`. Playwright fija Chromium, SO, DPR 1, viewport, reloj, movimiento y fuentes; espera `document.fonts.ready`. Un helper propio con `pixelmatch` y `pngjs` escribe siempre golden, candidata, diff y métricas. El modo `pixel` aplica threshold `0.1` y ratio máximo `0.005`; `contract` valida además tokens y propiedades normativas exactas y cajas de anclaje con delta máximo de 2 CSS px. El informe global pasa solo si pasan exactamente 19 resultados.

**Rationale**: Playwright advierte que las imágenes dependen del entorno; por ello baseline y candidata se capturan en la misma imagen fijada. Su comparación integrada no conserva todos los artefactos al pasar ni implementa el contrato geométrico, mientras `pixelmatch` expone el recuento y el diff que exige el esquema. Véanse las [comparaciones visuales de Playwright](https://playwright.dev/docs/test-snapshots) y su [imagen Docker](https://playwright.dev/docs/docker).

**Alternatives considered**:

- `toHaveScreenshot()` sin capa de informe: no materializa métricas y diff para toda escena satisfactoria ni los anclajes de `contract`.
- Percy/Chromatic: añade servicio y red externos sin necesidad.
- Regenerar referencias dentro de CI: prohibido; actualización y verificación deben ser comandos distintos.

## 9. Correcciones al manifiesto visual

**Decision**: Antes de validar, registrar `portfolio/habilidades` y `portfolio/articulo-langgraph` en `captures.comparison.contractScenes`, con FR-012 y FR-022/FR-026 como origen. Definir anclajes explícitos para las 19 escenas y rutas/precondiciones candidatas sin introducir máscaras.

**Rationale**: Ambas escenas heredan hoy el modo `pixel`, pero la primera debe retirar estrellas y la segunda debe retirar etiquetas de demo/borradores y añadir metadatos coherentes. Son diferencias visibles obligatorias; exigir igualdad píxel haría incompatible el golden con la spec. Cambiar a `contract` registra la excepción en vez de ocultarla.

**Alternatives considered**:

- Mantener `pixel` y tolerar el fallo: una escena fallida bloquea FR-028/SC-006.
- Ocultar las regiones o regenerar el golden: viola BR-005 y el contrato de evidencia.
- Portar estrellas y etiquetas: viola accesibilidad, veracidad y alcance.

## 10. Docker y comando de verificación

**Decision**: Construir una imagen multi-etapa, ejecutar `node dist/server/entry.mjs` como UID/GID dedicado, servir en 3000 y usar un probe Node para `HEALTHCHECK`. Compose declara root filesystem de solo lectura, `/tmp` como `tmpfs`, `cap_drop: ALL` y `no-new-privileges`. `verify:spec:000` agrega fuentes, formato/lint, tipos, unitarias, build, rutas/headers/assets, E2E, axe, 19 escenas y contenedor; usa limpieza con `trap` y devuelve error ante cualquier puerta.

**Rationale**: El adaptador standalone sirve `dist/client` y endpoints sin servidor adicional. Un probe Node evita instalar `curl` en runtime. Compose puede esperar el estado saludable, y la inspección del contenedor demuestra que el endurecimiento es efectivo. Véanse las [buenas prácticas de build Docker](https://docs.docker.com/build/building/best-practices/) y `docker compose up --wait` en la [referencia de Compose](https://docs.docker.com/reference/cli/docker/compose/up/).

**Alternatives considered**:

- Servidor Express propio: segundo framework sin requisito y más superficie de mantenimiento.
- Testcontainers: innecesario para un único servicio sin dependencias.
- Omitir Docker si no existe SMTP: FR-030 exige que arranque y sea honesto sin correo; la ausencia de SMTP no es un bloqueo.
