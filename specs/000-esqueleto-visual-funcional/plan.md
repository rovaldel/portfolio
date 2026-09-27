# Implementation Plan: Esqueleto visual funcional

**Branch**: `000-esqueleto-visual-funcional` | **Date**: 2026-09-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/000-esqueleto-visual-funcional/spec.md`

## Summary

Construir la carcasa pública completa del portfolio como una única aplicación Astro con TypeScript estricto y adaptador Node standalone. Las 15 superficies públicas se prerenderizan desde una fuente de contenido tipada; `/api/salud` permanece como endpoint dinámico del mismo proceso. JavaScript nativo y local mejora únicamente tema, capas accesibles, expansiones, carrusel y acciones conversacionales predeterminadas. El producto se entrega en un contenedor sin privilegios y se valida, escena por escena, contra las 19 referencias normativas.

La elección de Astro frente a Next.js está motivada en [research.md](research.md): reduce el runtime cliente, conserva HTML estático con un futuro `POST /api/contacto` en el mismo proceso y permite una CSP estricta con hashes servida como cabecera para páginas prerenderizadas.

## Technical Context

**Language/Version**: TypeScript 7.0 en modo estricto máximo; Node.js 24 LTS, fijado a parche e imagen por digest al implementar

**Primary Dependencies**: Astro 7.3, `@astrojs/node` 11.1 en modo `standalone`; componentes `.astro` y módulos DOM propios, sin framework de UI ni CMS

**Storage**: Ficheros versionados para contenido y activos; `localStorage` únicamente para `rv_theme`; sin base de datos, cookies ni almacenamiento de conversación

**Testing**: `astro check`, Vitest 5, Playwright 1.63 en Chromium y Firefox, `@axe-core/playwright`, `pixelmatch`/`pngjs` para evidencia visual persistente, pruebas HTTP y de contenedor

**Target Platform**: Navegadores evergreen; proceso Node 24 sobre Linux/OCI, puerto 3000 detrás de proxy HTTPS en producción

**Project Type**: Aplicación web de contenido, prerenderizada con endpoints Node selectivos

**Performance Goals**: Contenido esencial presente antes de ejecutar JavaScript; cero solicitudes a terceros; dimensiones estables para retratos/proyectos y ausencia de salto al activar fallback; las métricas Lighthouse completas se incorporan en la spec 010

**Constraints**: Una aplicación, proceso y contenedor; CSP sin `unsafe-inline` ni `unsafe-eval`; recursos propios; WCAG 2.2 AA en cinco temas; reflow desde 320 px y zoom 200 %; movimiento reducido; golden de solo lectura; fallo individual de escena bloqueante

**Scale/Scope**: 15 rutas públicas canónicas, recuperación 404 y error inesperado, 5 temas, 6 servicios, 2 proyectos, 6 entradas de formación, 1 artículo publicado, CV descargable y 19 escenas normativas

## Constitution Check

### Pre-design gate

| Gate constitucional | Evidencia en el enfoque | Estado |
|---|---|---|
| I. Veracidad pública | Una fuente pública tipada aplica las decisiones aprobadas de la spec; el golden extraído queda como referencia, no como copy publicable. Nami no recibe URL y el 65 %, fechas y canales se reutilizan sin duplicación. | PASS |
| II. Contenido accesible antes que interacción | Todas las rutas se prerenderizan con HTML semántico y enlaces reales. Tema, expansiones y conversación son mejoras; las pruebas cubren teclado, no-JS, 320 px, zoom, foco y movimiento reducido. | PASS |
| III. Fidelidad mecánica | Se reutilizan activos y tokens normativos, no se edita `mockup/**`, `design/tokens.json` ni `content/es.json`; las 19 escenas producen candidata, diff, métricas y excepciones trazables. | PASS |
| IV. Privacidad y seguridad | Solo se recuerda `rv_theme`; no hay envío ni almacenamiento de conversación. Astro CSP con hashes, headers del proceso, errores genéricos y contenedor endurecido cubren la frontera actual. | PASS |
| V. Una aplicación y artefacto | Astro Node standalone sirve HTML, activos y `/api/salud` desde un proceso y un contenedor. No se añaden servicios, persistencia ni infraestructura ajena. | PASS |
| VI. Descubrimiento honesto | Cada página obtiene título, descripción, canonical y H1 desde la misma fuente. Sitemap, JSON-LD, robots y `llms.txt` siguen reservados a la spec 010. | PASS |
| Dependencias mínimas | No se añade framework de UI; cada dependencia directa corresponde al runtime, tipado o a una puerta verificable. Versiones y navegador quedan fijados en lockfile. | PASS |

No hay violaciones que necesiten excepción. Las páginas legales permanecen como borrador de trabajo y bloquean publicación, pero no bloquean la implementación ni la validación local de esta feature.

## Project Structure

### Documentation (this feature)

```text
specs/000-esqueleto-visual-funcional/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── health.openapi.yaml
│   ├── http-routes.md
│   ├── ui-states.md
│   └── visual-evidence.schema.json
└── tasks.md                         # creado posteriormente por /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/                      # cabecera, navegación, pie, consulta persistente
│   ├── sections/                    # perfil, experiencia, formación, habilidades, servicios
│   ├── projects/                    # índice, tarjeta, detalle y recorrido alternativo
│   ├── journal/                     # índice y presentación del artículo
│   └── ui/                          # temas, expansiones, estados, fallback de imagen
├── content/
│   ├── config.ts                    # esquema y colección del artículo
│   ├── site.ts                      # única fuente pública tipada de datos breves
│   └── bitacora/
│       └── langgraph-para-agentes-en-produccion.md
├── layouts/
│   └── BaseLayout.astro
├── lib/
│   ├── routes.ts                    # catálogo canónico y metadatos base
│   ├── content.ts                   # validación, selección y relaciones de contenido
│   └── themes.ts                    # catálogo cerrado de cinco temas
├── pages/
│   ├── index.astro
│   ├── sobre-mi.astro
│   ├── habilidades.astro
│   ├── servicios.astro
│   ├── experiencia.astro
│   ├── formacion.astro
│   ├── contacto.astro
│   ├── privacidad.astro
│   ├── cookies.astro
│   ├── terminos.astro
│   ├── proyectos/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── bitacora/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── api/salud.ts
│   ├── 404.astro
│   └── 500.astro
├── scripts/                         # módulos cliente pequeños y propios
│   ├── theme-init.ts
│   ├── theme-selector.ts
│   ├── disclosure.ts
│   └── portfolio-actions.ts
└── styles/
    ├── global.css
    ├── themes.css
    └── motion.css

public/
├── fonts/                           # Gabarito, Hanken Grotesk e IBM Plex Mono WOFF2
├── images/                          # retrato y proyectos derivados de fuentes normativas
└── Rodrigo-Valdelvira-CV.pdf

tests/
├── unit/                            # esquemas, rutas, temas y reglas de catálogo
├── integration/                     # build, HTML, assets, headers, PDF y salud
├── e2e/                             # navegación, teclado, responsive y no-JS
└── visual/                          # captura, anclajes, comparación e informe por escena

scripts/
└── visual/                          # runner e informe; no actualiza el golden al verificar

artifacts/
└── spec-000/                        # candidata, diff, métricas y versión de navegador

astro.config.ts
package.json
pnpm-lock.yaml
Dockerfile
compose.yaml
.env.example
```

**Structure Decision**: Aplicación Astro única en la raíz. Las páginas y endpoints siguen el router de ficheros; los componentes agrupan responsabilidades visuales, `src/content/` concentra la única fuente publicable y `tests/` separa contratos HTTP, recorridos y comparación visual. `mockup/`, los generados protegidos de `design/` y `content/es.json` permanecen fuentes de referencia de solo lectura.

## Phase 0: Research Outcome

Las decisiones y alternativas están en [research.md](research.md). No quedan aclaraciones técnicas ni dependencias sin justificación.

## Phase 1: Design Outcome

- [data-model.md](data-model.md) define entidades, validaciones, relaciones y transiciones sin introducir persistencia.
- [contracts/http-routes.md](contracts/http-routes.md) fija rutas, canonicalización, tipos de respuesta, headers y comportamiento sin JavaScript.
- [contracts/health.openapi.yaml](contracts/health.openapi.yaml) formaliza el único endpoint dinámico de esta feature.
- [contracts/ui-states.md](contracts/ui-states.md) fija los estados accesibles de tema, navegación, expansión, consulta, proyecto, imagen y contacto no operativo.
- [contracts/visual-evidence.schema.json](contracts/visual-evidence.schema.json) define la evidencia reproducible y el fallo por escena.
- [quickstart.md](quickstart.md) describe la validación ejecutable desde una copia limpia.

### Post-design constitution re-check

El diseño mantiene los siete gates en `PASS`: no añade datos, servicios o dependencias fuera de alcance; todas las interfaces conservan alternativa HTML y teclado; los contratos de HTTP, estado y evidencia hacen verificables CSP, canonicalización, fidelidad, privacidad y el único artefacto. No se requiere Complexity Tracking.
