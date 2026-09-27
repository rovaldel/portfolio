# Research: Lógica del portfolio

**Feature**: `001-logica-del-portafolio`  
**Date**: 2026-09-25

No quedan aclaraciones técnicas pendientes. La spec y la especificación maestra cerraron las decisiones de producto; la spec 000 ya documenta la arquitectura y herramientas que implementa el repositorio.

## 1. Framework, renderizado y dependencias

**Decision**: Continuar con Astro 7.3.2, TypeScript estricto y `@astrojs/node` 11.1.0 en modo standalone. Mantener las páginas públicas prerenderizadas y añadir comportamiento cliente con módulos DOM locales. No incorporar framework de UI ni dependencia de runtime.

**Rationale**: Esta feature extiende la carcasa ya construida y debe conservar HTML útil sin JavaScript, proceso único, CSP existente y bajo JavaScript cliente. El plan y la investigación de `specs/000-esqueleto-visual-funcional/` ya resolvieron y validaron esta elección.

**Alternatives considered**: Next.js fue evaluado en la spec 000 y descartado por añadir runtime de React y tensionar el prerenderizado/CSP. CMS, base de datos, servicio LLM o framework cliente contradicen las restricciones de esta feature.

## 2. Fuente de contenido e intenciones

**Decision**: Modelar las intenciones como datos locales tipados que refieren a contenido factual aprobado y a una ruta canónica existente. Normalizar Unicode/acentos, mayúsculas y espacios para comparar; resolver una sola intención, estado desconocido o ambigüedad sin desempate arbitrario.

**Rationale**: La constitución y la spec requieren respuestas reproducibles, trazables y sin afirmaciones nuevas. El proyecto ya mantiene contenido público validado en `src/content/site.ts`, el catálogo en `src/lib/routes.ts` y acciones aprobadas en el mismo modelo. Mantener una función pura de normalización/selección facilita cubrir ejemplos y ambigüedades con Vitest.

**Alternatives considered**: Generación con LLM, búsqueda externa o analítica aumentarían superficie de datos y permitirían salidas no aprobadas; una respuesta seleccionada por prioridad ocultaría coincidencias ambiguas. No aplican.

## 3. Navegación e historial efímero

**Decision**: Las rutas canónicas siguen siendo enlaces HTML normales y la mejora conversacional usa History API solo para estados navegables que la spec aprueba. Restablecer el historial conversacional al inicio/recarga; no guardar consultas en URL, storage ni servidor.

**Rationale**: Enlaces reales mantienen navegación sin JavaScript y destinos compartibles. El historial local satisface atrás/adelante sin convertir consultas privadas en datos persistentes.

**Alternatives considered**: Aplicación SPA que sustituya documentos y persistencia en `localStorage` contradicen contenido-first y el requisito de descarte al recargar.

## 4. Bitácora

**Decision**: Derivar índice y filtros del único artículo cuyo cuerpo completo está presente en la colección Markdown de Astro. Mantener los cuatro registros incompletos fuera del catálogo público, enlaces y metadatos. Un filtro sin coincidencias muestra un estado vacío accesible.

**Rationale**: Evita títulos sin cuerpo y mantiene título, extracto, categoría y canonical ligados a la misma fuente. La colección Markdown existente evita duplicar el artículo en componentes.

**Alternatives considered**: Publicar teasers incompletos o inventar extractos ampliados contradice veracidad y los criterios de aceptación. No se hará.

## 5. SEO y referencias públicas

**Decision**: Derivar title, description, canonical, JSON-LD, Open Graph, sitemap, robots y `/llms.txt` de las rutas indexables y contenido publicado existentes. Declarar separadamente permiso de `OAI-SearchBot` para búsqueda/citación y exclusión de `GPTBot` para entrenamiento.

**Rationale**: La constitución exige referencias coherentes con el contenido visible y URLs canónicas existentes; la spec resuelve explícitamente la política de bots. El modelo de rutas/contenido existente ofrece una fuente local verificable.

**Alternatives considered**: Listas de URLs o metadatos mantenidos manualmente en varios sitios pueden divergir; bloqueo general de bots anularía la decisión aprobada. Se descartan.

## 6. Validación y bloqueo de entrada

**Decision**: Extender Vitest y Playwright ya instalados, añadir escenarios de teclado, movimiento reducido, no-JS y rutas/direct links y ejecutar la suite visual completa sin aprobar automáticamente cambios de composición. Incorporar el cierre formal y verificación de spec 000 como precondición a implementación de 001.

**Rationale**: Los criterios medibles incluyen contenido servido, privacidad de consultas, historial, accesibilidad, SEO y regresión visual. La spec 000 tiene un estado explícitamente pendiente en esta spec, por lo que completar su cierre evita basar la nueva rebanada en una referencia todavía no aprobada.

**Alternatives considered**: Añadir un segundo stack de pruebas o generar goldens durante la validación duplica herramientas o rebaja el contrato visual. No se justifica.
