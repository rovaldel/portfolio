---

description: "Tareas ejecutables para implementar el esqueleto visual funcional"
---

# Tasks: Esqueleto visual funcional

**Input**: Documentos de diseño en `/specs/000-esqueleto-visual-funcional/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` y `.specify/memory/constitution.md`

**Tests**: Se incluyen porque FR-028, FR-029, FR-034 y SC-003–SC-012 exigen comprobaciones automáticas bloqueantes y evidencia reproducible.

**Organization**: Las tareas se agrupan por historia de usuario. Cada fase termina en un incremento verificable y conserva `mockup/**`, `design/tokens.json` y `content/es.json` como fuentes protegidas de solo lectura.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo porque trabaja en ficheros distintos y no depende de otra tarea incompleta de su grupo.
- **[Story]**: Relaciona la tarea con la historia de usuario correspondiente.
- Todas las tareas indican rutas exactas de implementación o evidencia.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar una aplicación Astro reproducible, con toolchain fijado y puertas locales disponibles.

- [X] T001 Fijar un parche de Node.js 24 en `.node-version`, pnpm 12.3.x en `packageManager` y versiones exactas de Astro 7.3, `@astrojs/node` 11.1, TypeScript 7.0, Vitest 5, Playwright 1.63, axe, pixelmatch/pngjs y herramientas de formato/lint en `package.json`
- [X] T002 Instalar las dependencias declaradas con pnpm y versionar la resolución reproducible completa en `pnpm-lock.yaml`
- [X] T003 [P] Activar TypeScript estricto máximo y los tipos de Astro/Node en `tsconfig.json` y `src/env.d.ts`
- [X] T004 [P] Configurar ESLint para TypeScript/Astro y Prettier para Astro, CSS y Markdown en `eslint.config.js`, `.prettierrc.json` y `.prettierignore`
- [X] T005 [P] Configurar Vitest en Node y Playwright para Chromium, Firefox, `no-js-chromium` y `reduced-motion-chromium` contra el build empaquetado en `vitest.config.ts` y `playwright.config.ts`
- [X] T006 [P] Declarar configuración no secreta, artefactos ignorados y contexto mínimo de contenedor en `.env.example`, `.gitignore` y `.dockerignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Crear contratos, contenido compartido, shell, seguridad y runtime que bloquean todas las historias.

**⚠️ CRITICAL**: Ninguna historia de usuario comienza hasta completar esta fase.

- [X] T007 [P] Escribir pruebas inicialmente fallidas para invariantes compartidos de perfil, rutas, catálogos, legales y fuente única en `tests/unit/content-contract.spec.ts`
- [X] T008 [P] Escribir pruebas inicialmente fallidas del contrato de salud, canonicalización, errores y cabeceras HTTP en `tests/integration/http-foundation.spec.ts`
- [X] T009 Modelar y poblar `SiteProfile`, `PublicSurface`, `Experience`, `Education`, `SkillGroup`, `Service`, `Project`, `Article`, `LegalDocument`, `NavigationAction` e imágenes aprobadas en `src/content/site.ts`
- [X] T010 Implementar validación fail-fast de unicidad, fechas, proveniencia, catálogo cerrado, slugs, estados legales y ausencia de afirmaciones pendientes en `src/lib/content.ts`
- [X] T011 [P] Definir las 15 rutas canónicas, variantes 308, metadatos base, indexabilidad y destinos de recuperación en `src/lib/routes.ts`
- [X] T012 [P] Definir el catálogo cerrado de Claro, Oscuro, Cobalto, Rioja y Bosque, con Rioja por defecto y tokens obligatorios, en `src/lib/themes.ts`
- [X] T013 [P] Crear la preparación reproducible de Gabarito, Hanken Grotesk, IBM Plex Mono, retrato, imágenes de proyectos, variantes AVIF/WebP y el PDF con hash verificado en `scripts/assets/prepare.mjs`, `public/fonts/`, `public/images/` y `public/Rodrigo-Valdelvira-CV.pdf`
- [X] T014 Implementar el documento HTML español prerenderizado, salto al contenido, metadatos, canonical, slot principal y carga local previa al primer pintado en `src/layouts/BaseLayout.astro`
- [X] T015 Implementar cabecera, navegación activa, avatar/nombre a portada, pie y consulta persistente honesta como HTML funcional sin JavaScript en `src/components/layout/Header.astro`, `src/components/layout/Navigation.astro`, `src/components/layout/Footer.astro` y `src/components/layout/PersistentQuery.astro`
- [X] T016 Portar la tipografía, composición, espaciado, controles, capas, tarjetas y fallback Rioja del golden sin editar fuentes protegidas en `src/styles/global.css`
- [X] T017 [P] Implementar los tokens compartidos de los cinco temas y la política global de movimiento/contraste preferido en `src/styles/themes.css` y `src/styles/motion.css`
- [X] T018 Implementar middleware de canonicalización segura, errores genéricos y cabeceras CSP/seguridad sin `unsafe-inline` ni `unsafe-eval` en `src/middleware.ts` y `astro.config.ts`
- [X] T019 Implementar `GET`/`HEAD` 200, `POST` 405 y `Cache-Control: no-store` para el cuerpo mínimo `{"status":"ok"}` en `src/pages/api/salud.ts`
- [X] T020 Implementar respuestas reales 404/500 con shell visual y enlaces a Portada, Proyectos y Contacto sin detalle interno en `src/pages/404.astro` y `src/pages/500.astro`

**Checkpoint**: El shell, la fuente única, el runtime y los contratos compartidos están listos; las historias pueden comenzar según el grafo de dependencias.

---

## Phase 3: User Story 1 - Comprender el perfil y explorar el portfolio (Priority: P1) 🎯 MVP

**Goal**: Entregar las 15 superficies con contenido profesional veraz, navegación real, dos proyectos, un artículo completo y un único CV descargable.

**Independent Test**: Abrir cada ruta directamente o sin JavaScript permite identificar el rol, recorrer todo el perfil, consultar Leadia y Nami, leer el artículo LangGraph y descargar el mismo PDF seleccionable.

### Tests for User Story 1

> Escribir y comprobar el fallo de estas pruebas antes de implementar la historia.

- [X] T021 [P] [US1] Escribir pruebas de perfil, experiencia, formación, habilidades, seis servicios, dos proyectos, un artículo y legales provisionales en `tests/unit/public-content.spec.ts`
- [X] T022 [P] [US1] Escribir pruebas de integración para las 15 rutas GET/HEAD, HTML español útil, H1 único, canonical y navegación sin JavaScript en `tests/integration/public-pages.spec.ts`
- [X] T023 [P] [US1] Escribir el recorrido E2E de portada, navegación/historial, proyectos, Bitácora y retorno mediante avatar o nombre en `tests/e2e/portfolio-exploration.spec.ts`
- [X] T024 [P] [US1] Escribir pruebas del nombre, bytes, SHA-256, cabeceras, redirecciones previas y texto seleccionable del CV en `tests/integration/cv.spec.ts`

### Implementation for User Story 1

- [X] T025 [US1] Configurar la colección Markdown sin HTML arbitrario y publicar el cuerpo aprobado con metadatos y tiempo de lectura determinista en `src/content/config.ts` y `src/content/bitacora/langgraph-para-agentes-en-produccion.md`
- [X] T026 [P] [US1] Implementar perfil, experiencia, formación, habilidades y resumen de servicios desde la fuente única en `src/components/sections/Profile.astro`, `src/components/sections/Experience.astro`, `src/components/sections/Education.astro`, `src/components/sections/Skills.astro` y `src/components/sections/Services.astro`
- [X] T027 [P] [US1] Implementar catálogo, tarjeta, detalle y recorrido anterior/siguiente anunciando posición para Leadia y Nami en `src/components/projects/ProjectIndex.astro`, `src/components/projects/ProjectCard.astro`, `src/components/projects/ProjectDetail.astro` y `src/components/projects/ProjectTraversal.astro`
- [X] T028 [P] [US1] Implementar índice y presentación semántica del único artículo publicado en `src/components/journal/JournalIndex.astro` y `src/components/journal/Article.astro`
- [X] T029 [P] [US1] Implementar imagen responsiva con dimensiones reservadas, texto alternativo y fallback estable en `src/components/ui/StableImage.astro` y `src/scripts/image-fallback.ts`
- [X] T030 [US1] Construir la portada con “Soy Rodrigo, AI Engineer”, propuesta veraz, retrato, CTA reales, descarga de CV y acciones predeterminadas en `src/pages/index.astro`
- [X] T031 [P] [US1] Construir Perfil, Habilidades, Experiencia y Formación con contenido esencial visible sin expansión en `src/pages/sobre-mi.astro`, `src/pages/habilidades.astro`, `src/pages/experiencia.astro` y `src/pages/formacion.astro`
- [X] T032 [P] [US1] Construir Servicios, Contacto y los tres borradores legales noindex sin banner de cookies ni envío simulado en `src/pages/servicios.astro`, `src/pages/contacto.astro`, `src/pages/privacidad.astro`, `src/pages/cookies.astro` y `src/pages/terminos.astro`
- [X] T033 [P] [US1] Construir el índice y las páginas canónicas de Leadia y Nami, con enlace externo seguro solo para Leadia, en `src/pages/proyectos/index.astro` y `src/pages/proyectos/[slug].astro`
- [X] T034 [P] [US1] Construir el índice con una sola entrada y el permalink completo del artículo en `src/pages/bitacora/index.astro` y `src/pages/bitacora/[slug].astro`
- [X] T035 [US1] Mejorar los siete enlaces predeterminados con tarjetas aprobadas, enlace canónico y cancelación al navegar sin interpretar texto libre en `src/components/layout/PortfolioActions.astro` y `src/scripts/portfolio-actions.ts`

**Checkpoint**: US1 funciona y se prueba de forma autónoma como MVP navegable sin depender de las mejoras de US3 o US4.

---

## Phase 4: User Story 2 - Acceder al contenido sin barreras (Priority: P1)

**Goal**: Hacer completables todos los recorridos con teclado, lector de pantalla, 320 px, zoom 200 %, texto personalizado y movimiento reducido.

**Independent Test**: Ejecutar las rutas y acciones esenciales en 320 px, 390 × 844, zoom 200 %, solo teclado, sin JavaScript y con movimiento reducido sin overflow, foco tapado, trampa ni pérdida de contenido.

### Tests for User Story 2

> Escribir y comprobar el fallo de estas pruebas antes de implementar la historia.

- [X] T036 [P] [US2] Escribir barridos axe por rutas, cinco temas y estados interactivos, fallando ante violaciones críticas o serias, en `tests/e2e/accessibility.spec.ts`
- [X] T037 [P] [US2] Escribir pruebas de Tab/Shift+Tab, foco visible, Escape, devolución de foco, encabezados, landmarks, nombres y cancelación de transiciones en `tests/e2e/keyboard-and-motion.spec.ts`
- [X] T038 [P] [US2] Escribir pruebas de 320 px, 390 × 844, zoom 200 %, texto ampliado, consulta persistente, red externa bloqueada y fallback sin salto en `tests/e2e/reflow-and-assets.spec.ts`

### Implementation for User Story 2

- [X] T039 [US2] Corregir landmarks, jerarquía, nombres/estados anunciables, orden DOM, tamaños de objetivo y focos no cubiertos en `src/layouts/BaseLayout.astro` y `src/components/`
- [X] T040 [P] [US2] Implementar disclosure/capa accesible con `aria-expanded`, Escape, clic exterior, contención cuando proceda y devolución de foco en `src/scripts/disclosure.ts`
- [X] T041 [P] [US2] Implementar reflow sin desbordamiento, unidades dinámicas, safe areas, consulta alcanzable y adaptación a texto/zoom en `src/styles/global.css`
- [X] T042 [P] [US2] Eliminar escritura progresiva, flotación, pulsos y scroll suave y cancelar timers/animaciones al cambiar de acción o ruta en `src/styles/motion.css` y `src/scripts/portfolio-actions.ts`
- [X] T043 [US2] Documentar la revisión humana de teclado, VoiceOver/NVDA, contraste reforzado, teclado móvil y zoom con criterios y campos de evidencia en `specs/000-esqueleto-visual-funcional/accessibility-review.md`

**Checkpoint**: US2 demuestra accesibilidad y adaptación sobre las superficies de US1 sin depender del selector persistente.

---

## Phase 5: User Story 3 - Elegir y conservar la apariencia (Priority: P2)

**Goal**: Permitir elegir los cinco temas, anunciar el activo, aplicar la selección antes del primer pintado y recordar solo `rv_theme` con fallback Rioja.

**Independent Test**: Partir sin preferencia, cambiar entre los cinco temas, recargar, corromper o bloquear storage y cerrar con Escape/exterior conservando operación, foco y contraste.

### Tests for User Story 3

> Escribir y comprobar el fallo de estas pruebas antes de implementar la historia.

- [X] T044 [P] [US3] Escribir pruebas unitarias del catálogo cerrado, Rioja por defecto y validación de valores `rv_theme` en `tests/unit/themes.spec.ts`
- [X] T045 [P] [US3] Escribir pruebas E2E de primer pintado, cinco opciones, estado actual, persistencia, storage corrupto/bloqueado y cierre con foco restaurado en `tests/e2e/theme-selector.spec.ts`

### Implementation for User Story 3

- [X] T046 [P] [US3] Implementar el script externo bloqueante que valida `localStorage.rv_theme` y deja Rioja ante ausencia, corrupción o excepción antes de cargar estilos en `src/scripts/theme-init.ts`
- [X] T047 [P] [US3] Implementar el disparador y la capa de temas con nombres, muestras, selección anunciada, Escape/exterior y persistencia tolerante a fallos en `src/components/ui/ThemeSelector.astro` y `src/scripts/theme-selector.ts`
- [X] T048 [US3] Integrar la inicialización y el selector en todas las superficies sin handlers ni estilos inline en `src/layouts/BaseLayout.astro` y `src/components/layout/Header.astro`

**Checkpoint**: US3 puede probarse después de Foundation y usa los tokens compartidos sin depender del flujo de servicios/contacto.

---

## Phase 6: User Story 4 - Consultar servicios y llegar a contacto con expectativas honestas (Priority: P2)

**Goal**: Completar los seis servicios y su asunto permitido en Contacto, manteniendo canales reales y un formulario inequívocamente no disponible.

**Independent Test**: Abrir cada servicio, leer su descripción completa, llegar a `/contacto?asunto={slug}`, comprobar la preselección permitida y verificar que no se recogen datos ni se emite POST o éxito simulado.

### Tests for User Story 4

> Escribir y comprobar el fallo de estas pruebas antes de implementar la historia.

- [X] T049 [P] [US4] Escribir pruebas E2E de los seis resúmenes/detalles, CTA, asunto preseleccionado, canales aprobados y controles retirados en `tests/e2e/content-and-contact.spec.ts`
- [X] T050 [P] [US4] Escribir pruebas HTTP que rechacen asuntos desconocidos, repetidos o sobredimensionados sin reflejarlos y confirmen que `/api/contacto` no existe en `tests/integration/contact-boundary.spec.ts`
- [X] T051 [P] [US4] Escribir pruebas unitarias del allowlist y del mapeo exacto `Consulta sobre: {title}` sin persistencia en `tests/unit/contact-subject.spec.ts`

### Implementation for User Story 4

- [X] T052 [US4] Implementar parseo local del asunto contra los seis slugs, ignorando valores inválidos sin reflejarlos ni almacenarlos, en `src/lib/contact.ts`
- [X] T053 [US4] Completar los seis servicios con resumen siempre visible, descripción completa accesible y CTA canónico con asunto en `src/components/sections/Services.astro` y `src/pages/servicios.astro`
- [X] T054 [US4] Completar Contacto con email, teléfono, LinkedIn, ubicación, asunto permitido y estado no disponible sin campos ni confirmación simulada en `src/pages/contacto.astro`

**Checkpoint**: US4 queda verificable sobre el shell y la fuente de US1, sin implementar ninguna frontera reservada a spec 020.

---

## Phase 7: User Story 5 - Aprobar una base visual reproducible (Priority: P3)

**Goal**: Generar y validar evidencia all-or-nothing para las 19 escenas, con comparación píxel o excepción contractual trazable.

**Independent Test**: `pnpm run test:visual` produce entorno, golden, candidata, diff y métricas de 19 IDs únicos; falla si cualquier escena incumple 0,5 %, 2 px, propiedades contractuales o esquema.

### Tests for User Story 5

> Escribir y comprobar el fallo de estas pruebas antes de implementar la historia.

- [X] T055 [P] [US5] Escribir pruebas de los 19 IDs únicos, modos, excepciones, anclajes, umbrales y resultado global all-or-nothing en `tests/visual/visual-contract.spec.ts`
- [X] T056 [P] [US5] Escribir la suite Playwright parametrizada que visita ruta/precondición/tema/viewport de cada escena y bloquea red externa en `tests/visual/scenes.spec.ts`

### Implementation for User Story 5

- [X] T057 [US5] Registrar rutas candidatas, precondiciones y anclajes de las 19 escenas y añadir Habilidades y Artículo LangGraph como `contract` por FR-012/FR-022/FR-026 en `design/golden.config.json`
- [X] T058 [P] [US5] Registrar las excepciones visuales autorizadas con categoría, requisitos, estado, antes/después, límite de 2 px y aprobación pendiente en `tests/visual/exceptions.ts`
- [X] T059 [US5] Implementar captura determinista con Chromium/SO/DPR fijados, reloj y animaciones congelados, `document.fonts.ready`, hash de fuentes y copia del golden en `tests/visual/capture.ts`
- [X] T060 [P] [US5] Implementar comparación pixelmatch a threshold 0,1/ratio 0,005 y comprobación contractual de tokens, fuentes, pesos, radios, bordes, sombras, activos y cajas en `tests/visual/compare.ts`
- [X] T061 [US5] Validar el esquema JSON, materializar siempre diff/métricas y calcular `overallStatus` solo con 19 escenas aprobadas en `tests/visual/report.ts`
- [X] T062 [US5] Orquestar actualización separada y verificación no destructiva en `scripts/visual/run.mjs`, añadiendo `visual:update` y `test:visual` a `package.json`

**Checkpoint**: US5 produce evidencia reproducible y ninguna aprobación humana puede convertir una escena fallida en aprobada.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar el artefacto único, la seguridad, la verificación agregada y la documentación honesta.

- [X] T063 [P] Crear la imagen multi-etapa reproducible con proceso Node no root y healthcheck, y el servicio único sin capacidades, `no-new-privileges`, filesystem de solo lectura y `/tmp` tmpfs en `Dockerfile` y `compose.yaml`
- [X] T064 [P] Escribir pruebas del build limpio, un proceso/servicio, salud, UID no root, filesystem read-only, capacidades eliminadas y parada limpia en `tests/integration/container.spec.ts`
- [X] T065 [P] Escribir pruebas empaquetadas de rutas 200/308/404/500, headers CSP, ausencia de terceros, activos y métodos permitidos en `tests/integration/packaged-app.spec.ts`
- [X] T066 Implementar el agregador fail-fast con limpieza garantizada para fuentes, formato/lint, tipos, unitarias, build, HTTP, E2E, axe, visual, auditoría, Gitleaks, CodeQL, Trivy y contenedor en `scripts/verify-spec-000.mjs` y `package.json`
- [X] T067 [P] Implementar una puerta de publicación que falle mientras cualquier `LegalDocument` siga en `working-draft`, sin bloquear validación local, en `scripts/check-release-readiness.mjs` y `tests/unit/release-readiness.spec.ts`
- [X] T068 [P] Configurar CI mínima y fijada para ejecutar `verify:spec:000` sin actualizar golden ni exponer secretos en `.github/workflows/verification.yml`
- [X] T069 [P] Documentar requisitos exactos, instalación congelada, arranque/parada nativos, comando Docker único, salud, verificación, troubleshooting y contratos pendientes en `README.md` y `docker/README.md`
- [ ] T070 Ejecutar `pnpm run verify:kit`, `pnpm run verify:spec:000` y los pasos humanos de `quickstart.md`, registrando resultados, versiones y enlaces a evidencia en `artifacts/spec-000/verification-summary.json` y `specs/000-esqueleto-visual-funcional/accessibility-review.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias; T002 espera a T001 y T003–T006 pueden continuar en paralelo tras la declaración de dependencias.
- **Foundational (Phase 2)**: Depende de Setup y bloquea todas las historias.
- **US1 (Phase 3)**: Depende de Foundational; constituye el MVP navegable.
- **US2 (Phase 4)**: Depende de US1 porque valida y corrige sus superficies renderizadas.
- **US3 (Phase 5)**: Depende solo de Foundational y puede desarrollarse en paralelo con US1/US2; su validación final usa las superficies existentes.
- **US4 (Phase 6)**: Depende de US1 para extender Servicios y Contacto, pero no depende de US2 ni US3.
- **US5 (Phase 7)**: Depende de US1, US2, US3 y US4 porque captura el estado funcional y accesible completo.
- **Polish (Phase 8)**: Depende de todas las historias incluidas en el cierre.

### User Story Dependency Graph

```text
Setup -> Foundational -> US1 (MVP) -> US2 ----\
                        |          \           \
                        |           -> US4 ------> US5 -> Polish
                        \-> US3 ----------------/
```

### Within Each User Story

- Las pruebas de la historia se escriben y fallan antes de su implementación.
- La fuente/modelo precede a componentes; componentes preceden a páginas e integración.
- Los helpers de captura/comparación preceden al informe y al runner visual.
- Cada checkpoint debe pasar antes de declarar completa la historia.

### Parallel Opportunities

- T003–T006 pueden ejecutarse en paralelo después de T001/T002.
- T007/T008, T011–T013 y T017 trabajan en contratos o ficheros distintos dentro de Foundation.
- Después de Foundation, US3 puede avanzar en paralelo con US1; tras US1, US2 y US4 pueden avanzar en paralelo.
- Las tareas `[P]` de pruebas y componentes de cada historia pueden repartirse una vez satisfechas sus dependencias explícitas.
- US5 y Polish conservan puntos de unión deliberadamente secuenciales para producir un único informe y un único resultado de cierre.

---

## Parallel Examples

### User Story 1

```text
En paralelo: T021, T022, T023 y T024.
Tras T025: T026, T027, T028 y T029.
Con componentes listos: T031, T032, T033 y T034.
```

### User Story 2

```text
En paralelo: T036, T037 y T038.
Tras observar los fallos: T040, T041 y T042, coordinando T039 como integración semántica.
```

### User Story 3

```text
En paralelo: T044 y T045.
Después: T046 y T047; T048 integra ambos resultados.
```

### User Story 4

```text
En paralelo: T049, T050 y T051.
Tras T052: T053 y T054 trabajan en superficies distintas.
```

### User Story 5

```text
En paralelo: T055 y T056.
Tras T057: T058 y T060 pueden avanzar mientras T059 fija la captura; T061 y T062 cierran el pipeline.
```

---

## Implementation Strategy

### MVP First (US1)

1. Completar Setup y Foundational.
2. Completar US1 y ejecutar sus pruebas unitarias, HTTP, no-JS y E2E.
3. Detenerse y validar el MVP: contenido profesional completo, rutas reales, proyectos, artículo y CV.
4. No publicar todavía: legales siguen en borrador y la evidencia/accessibilidad completas pertenecen a fases posteriores.

### Incremental Delivery

1. **Foundation**: aplicación reproducible, segura y con HTML base.
2. **US1**: portfolio navegable y veraz.
3. **US2**: acceso sin barreras.
4. **US3**: apariencia elegible y persistente.
5. **US4**: servicios a contacto honesto.
6. **US5**: contrato visual reproducible.
7. **Polish**: contenedor, verificación total, CI y documentación.

### Parallel Team Strategy

1. El equipo completa Setup y Foundational conjuntamente.
2. Al liberar Foundation, una línea implementa US1 y otra US3.
3. Al cerrar US1, US2 y US4 se ejecutan en paralelo.
4. US5 integra todas las superficies; Polish cierra el único artefacto verificable.

---

## Notes

- `[P]` significa ficheros distintos y ausencia de dependencia pendiente en ese punto.
- Los ficheros protegidos no se regeneran ni editan para ocultar diferencias.
- `visual:update` nunca forma parte de `verify:spec:000` ni de CI.
- Spec 000 no crea `POST /api/contacto`, SMTP, analítica, cookies, CMS, base de datos, voz, Toolkit ni interpretación de texto libre.
- Las páginas legales permiten validación local, pero `working-draft` mantiene bloqueada la publicación pública.
- Completar cada tarea con un resultado verificable y un commit o grupo lógico pequeño.

---

## Phase 9: Convergence

**Purpose**: Corregir las brechas comprobadas entre la implementación actual y la fidelidad, comportamiento, accesibilidad y evidencia exigidos antes del cierre.

**Dependency note**: Completar T071–T085 antes de volver a la T070, que permanece como puerta final de verificación y aceptación humana y no se duplica en esta fase.

- [ ] T071 CRITICAL: Reconstruir la portada y el shell compartido en `src/pages/index.astro`, `src/layouts/BaseLayout.astro`, `src/components/layout/`, `src/components/ui/ThemeSelector.astro` y `src/styles/` para reproducir en escritorio, móvil y los cinco temas la posición y tratamiento de `¡Hola!`, título, retrato, CTA, iconos, cabecera, consulta persistente y pie del golden per Constitution III, FR-002, FR-009 y SC-011 (contradicts)
- [ ] T072 CRITICAL: Reproducir las composiciones conversacionales, jerarquía, geometría, iconografía, tarjetas y expansiones del golden para Sobre mí, Habilidades, Experiencia y Formación en `src/pages/` y `src/components/sections/`, manteniendo visibles los datos esenciales y limitando la excepción de Habilidades a la retirada localizada de estrellas per Constitution III, FR-009, FR-012, FR-013 y SC-006 (contradicts)
- [ ] T073 CRITICAL: Rehacer Servicios, el estado de detalle accesible y Contacto en `src/pages/servicios.astro`, `src/pages/contacto.astro`, `src/components/sections/Services.astro`, `src/scripts/disclosure.ts` y estilos asociados para igualar la composición del golden, conservar los seis contenidos canónicos y no introducir campos ni resultados simulados per Constitution III, FR-009, FR-014 y FR-023 (contradicts)
- [ ] T074 CRITICAL: Rehacer el índice, tarjeta, recorrido y detalle de Leadia/Nami en `src/pages/proyectos/` y `src/components/projects/` para igualar imagen, proporciones, posición, CTA y navegación del golden sin perder rutas canónicas, enlace seguro de Leadia ni estado sin enlace de Nami per Constitution III, FR-009 y FR-019 (contradicts)
- [ ] T075 CRITICAL: Reproducir las composiciones del golden para Bitácora, artículo y legales en `src/pages/bitacora/`, `src/components/journal/` y `src/pages/{privacidad,cookies,terminos}.astro`, localizando únicamente las diferencias obligadas por artículo único, metadatos aprobados, retirada de etiquetas y aviso legal de borrador/noindex per Constitution III, FR-009, FR-022, FR-024 y FR-026 (contradicts)
- [X] T076 CRITICAL: Completar `tests/e2e/accessibility.spec.ts`, `tests/e2e/keyboard-and-motion.spec.ts` y `tests/e2e/reflow-and-assets.spec.ts` para cubrir todas las rutas, cinco temas, estados interactivos, Tab/Shift+Tab, foco visible y restaurado, H1 visible, lector semántico, 320 px, 390×844, zoom 200 %, texto ampliado, movimiento reducido, teclado móvil y fallos de imagen; corregir en `src/` cada defecto observado sin ocultar overflow per Constitution II, FR-010, FR-011 y US2/AC1-4 (partial)
- [X] T077 CRITICAL: Corregir `design/golden.config.json`, `tests/visual/exceptions.ts`, `tests/visual/visual-contract.spec.ts`, `specs/000-esqueleto-visual-funcional/contracts/visual-evidence.schema.json` y el comparador para admitir modo contractual solo en Habilidades y Artículo LangGraph, describir regiones exceptuadas, comparar al 0,5 % todo lo no exceptuado, medir anclajes reales de componentes dentro de 2 px y rechazar aprobaciones basadas únicamente en el viewport o propiedades genéricas per Constitution III, FR-029 y SC-006 (contradicts)
- [X] T078 Conectar las siete acciones predeterminadas al shell mediante `src/components/layout/PortfolioActions.astro`, `src/components/layout/PersistentQuery.astro` y `src/scripts/portfolio-actions.ts`, presentando la tarjeta aprobada con enlace canónico, manteniéndola visible sobre la consulta y cancelando transiciones al cambiar de acción o ruta, con enlaces normales cuando no hay JavaScript per FR-005, FR-006 y US1 (missing)
- [X] T079 Renderizar el artículo completo y sus metadatos desde `src/content/bitacora/langgraph-para-agentes-en-produccion.md` mediante la colección de Astro, y derivar de la misma entrada el índice, título, fechas, categoría, autor y tiempo de lectura sin mantener una copia manual abreviada en `src/components/journal/Article.astro` per FR-022 y US1/AC4 (partial)
- [X] T080 Sincronizar `src/scripts/theme-init.ts`, `src/scripts/theme-selector.ts` y `src/components/ui/ThemeSelector.astro` para que el tema restaurado antes del primer pintado sea también la opción anunciada, y ampliar `tests/e2e/theme-selector.spec.ts` a Rioja inicial, cinco opciones, valor corrupto, almacenamiento bloqueado, Escape y pulsación exterior con foco restaurado per FR-008 y US3/AC1-4 (partial)
- [X] T081 Completar `src/content/site.ts`, `src/lib/content.ts`, `src/lib/routes.ts` y sus pruebas con los campos, orden, proveniencia e invariantes definidos para perfil, superficies, experiencia, formación, habilidades, servicios, proyectos, artículo, temas, legales y acciones; hacer que Sobre mí consuma esa fuente única e incluya Cidatum vigente, idiomas e intereses sin copy factual duplicado per FR-016 y plan: fuente única y modelo de datos (partial)
- [X] T082 Separar y completar la captura, comparación e informe en `tests/visual/capture.ts`, `tests/visual/compare.ts`, `tests/visual/report.ts` y `scripts/visual/run.mjs`, registrando versión real de Chromium, hashes de fuentes, precondiciones, excepciones completas con evidencia/aprobación, artefactos y métricas de 19 escenas, y habilitando una actualización golden separada que nunca se ejecute durante verificación per FR-028 y plan: evidencia visual reproducible (partial)
- [X] T083 Completar la implementación y pruebas de `src/middleware.ts`, rutas y contratos HTTP para GET/HEAD de las 15 superficies, variantes canónicas conocidas, consultas de contacto inválidas/repetidas/sobredimensionadas también durante redirecciones, cabeceras completas, 404 y 500 sin detalles internos, activos/CV y ausencia de terceros per FR-003, FR-004 y FR-027 (partial)
- [X] T084 Completar `package.json`, `playwright.config.ts`, `scripts/verify-spec-000.mjs` y `.github/workflows/verification.yml` para ejecutar realmente Chromium, Firefox, no-JS y movimiento reducido, las 19 escenas, contenedor y todas las puertas declaradas de auditoría, Gitleaks, CodeQL y Trivy, conservando un resumen fail-fast honesto y la evidencia producida per FR-034 y plan: verificación agregada (partial)
- [X] T085 Actualizar `README.md`, `docker/README.md` y el troubleshooting para declarar la feature pendiente mientras falle cualquier escena o revisión, documentar el contrato de excepciones localizadas y anunciarla como implementada solo después de superar T070 per FR-031 (contradicts)


## Punto de control — 2026-09-25

- La ejecución oficial de verify:spec:000 (2026-09-25T14:20:07.967Z) y verify:spec:010 (2026-09-25T14:17:43.155Z) pasa fuentes, formato, lint, tipos, unitarias (40), auditoría, build, HTTP/E2E Chromium y Firefox (118 aprobadas, 4 omisiones previstas), no-JS (1), movimiento reducido (5) y contenedor (1). Ambas fallan solo la comparación visual.
- T070 permanece abierta hasta superar las 19 escenas y completar las cinco revisiones humanas de accessibility-review.md.
- T071–T075 permanecen abiertas: las composiciones difieren entre 1,521 % y 5,823 %, frente al máximo contractual de 0,5 %. El dock, el perfil, la composición de Servicios y el pie móvil se han ajustado; la portada móvil bajó de 5,660 % a 4,408 %. Las evidencias actuales están en artifacts/spec-000/visual-report.json. Las diferencias de contenido aprobadas se detallan en visual-exceptions.md.
