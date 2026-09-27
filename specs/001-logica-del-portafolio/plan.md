# Implementation Plan: Lógica del portfolio

**Branch**: `001-logica-del-portafolio` | **Date**: 2026-09-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-logica-del-portafolio/spec.md`

## Summary

Completar la carcasa Astro ya existente con intenciones locales deterministas basadas en contenido aprobado, navegación pública estable y accesible, Bitácora filtrable con su único artículo completo y referencias públicas derivadas de la misma fuente factual. La app continúa como un único proyecto TypeScript/Astro con páginas prerenderizadas, módulos DOM propios y el adaptador Node standalone. No se incorporan servicios ni dependencias de runtime.

La spec 000 es una precondición de implementación: su estado indica cierre pendiente y la suite visual contractual completa debe pasar antes de iniciar esta rebanada. Este plan no cambia esa dependencia.

## Technical Context

**Language/Version**: TypeScript estricto; Node.js 24.19.0; pnpm 12.3.0 (fijados por el proyecto)

**Primary Dependencies**: Astro 7.3.2, `@astrojs/node` 11.1.0; componentes Astro y módulos DOM propios; Vitest 5 y Playwright 1.63 para la verificación ya configurada. Sin dependencias nuevas previstas.

**Storage**: Ninguno. Intenciones, artículos y rutas son contenido de build; consultas y mensajes solo viven en memoria de la pestaña y se descartan al navegar al inicio o recargar.

**Testing**: Vitest para normalización, selección de intención y validación de contenido; Playwright para navegación, historial, Bitácora, referencias, accesibilidad y escenarios sin JavaScript/movimiento reducido; suite visual contractual completa de spec 000. Integrar estas comprobaciones en `verify:spec:010` conforme al manifiesto maestro.

**Target Platform**: Navegadores actuales; HTML prerenderizado servido por la aplicación Node standalone en Docker/Hetzner.

**Project Type**: Aplicación web Astro de un solo proyecto/proceso.

**Performance Goals**: Contenido principal y metadatos disponibles en el HTML inicial; reconocimiento local sin solicitudes de red; conservar el presupuesto y criterios de rendimiento heredados de la spec 000 y la maestra.

**Constraints**: Fuente factual aprobada únicamente; no consultas remotas, analítica, historial persistente ni afirmaciones generadas. WCAG 2.2 AA, sin JavaScript útil como base, CSP existente y fidelidad visual contractual. La spec 000 debe cerrarse antes de implementación; no actualizar goldens para hacer pasar esta spec.

**Scale/Scope**: Rutas públicas existentes más consulta determinista, filtros de Bitácora y metadatos/referencias de descubrimiento; un artículo completo publicado y cuatro borradores excluidos.

## Constitution Check

| Principio | Comprobación | Estado |
|---|---|---|
| I. Veracidad pública | Respuestas y referencias se derivan de `src/content/site.ts`, el artículo completo y fuentes aprobadas; los borradores no se publican. | PASS |
| II. Contenido accesible | Las rutas siguen prerenderizadas; consulta y filtros son mejoras progresivas; teclado, foco y movimiento reducido forman parte de la aceptación. | PASS |
| III. Fidelidad mecánica | Reutilizar estructura, temas, tokens y contenido aprobados; no editar fuentes protegidas ni regenerar goldens para ocultar cambios. Suite completa de escenas requerida. | PASS, condicionado a verificación de 000 |
| IV. Privacidad y seguridad | Sin modelo remoto, persistencia, telemetría o solicitudes con consultas; validar longitud y renderizar texto de forma segura. | PASS |
| V. Una aplicación y un artefacto | Astro/Node actual; no añadir servicios, base de datos ni dependencias de ejecución. | PASS |
| VI. Descubrimiento citable | Metadatos y referencias salen del catálogo de rutas y contenido visible; OAI-SearchBot permitido y GPTBot bloqueado según decisión aprobada. | PASS |

**Gate de entrada a implementación**: la spec 000 no superó su comprobación contractual visual y mantiene pendiente la revisión humana de accesibilidad. El usuario autorizó el 2026-09-25 una excepción administrativa para continuar esta implementación; el detalle consta en specs/000-esqueleto-visual-funcional/closure-decision.md. La excepción permite avanzar por secuencia, pero no convierte esos resultados en PASS ni satisface FR-017/SC-007 de esta feature. La verificación integral conserva el resultado heredado y reporta sus fallos.

## Project Structure

### Documentation (this feature)

```text
specs/001-logica-del-portafolio/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── portfolio-interaction.md
└── tasks.md             # Fase posterior de /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── content/
│   ├── site.ts                         # contenido factual tipado existente
│   └── bitacora/                       # artículo Markdown publicado
├── lib/
│   ├── content.ts                      # invariantes de contenido existentes
│   ├── routes.ts                       # rutas canónicas existentes
│   └── [módulos de intención y descubrimiento]
├── components/
│   ├── layout/                         # ConversationPage y navegación existentes
│   └── journal/                        # JournalIndex y componentes existentes
├── pages/                              # rutas Astro prerenderizadas y recursos públicos
└── scripts/                            # mejoras progresivas DOM existentes

tests/
├── unit/                               # Vitest: contenido e intenciones
├── integration/                        # HTTP, canonical, referencias públicas
├── e2e/                                # teclado, historial, filtros, no-JS
└── visual/                             # contrato completo heredado
```

**Structure Decision**: Extender la aplicación Astro ya presente en `src/` y sus suites existentes en `tests/`; mantener los nuevos módulos cerca de `src/lib/` y las mejoras de interfaz en componentes/scripts actuales. No crear una segunda aplicación ni copiar datos a fuentes paralelas.

## Complexity Tracking

No hay violaciones constitucionales ni complejidad adicional que justificar.
