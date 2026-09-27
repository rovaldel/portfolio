# Guía de especificaciones del portfolio

La fuente de producto es `docs/ESPECIFICACION_MAESTRA.md`; la constitución establece lo no negociable; `design/golden.config.json` enlaza las tres specs con el mockup.

## Flujo

1. `npm run design:regen` y revisión de `design/behavior-inventory.md`, `design/tokens.json`, `content/es.json` y `docs/servilletas/FUENTES.md`.
2. `/servilleta NNN-nombre` para crear un borrador desde esas fuentes.
3. Resolver todas las decisiones pendientes y verificar referencias.
4. `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
5. Verificar criterios y guardar `cierre.md` antes de iniciar la siguiente spec.

La descomposición maestra es deliberadamente mínima: `000-esqueleto-visual-funcional`, `010-logica-del-portfolio` y `020-contacto-operacion-y-cierre`. La primera cierra toda la presentación y su baseline visual; las otras añaden lógica interna sin rediseñar. Solo se divide una spec si un criterio de aceptación no puede verificarse de forma segura dentro de ella.

## Regla de la servilleta

La servilleta decide el qué y el porqué; el plan decide el cómo. El comportamiento existente se cita como `` `portfolio#función:línea` `` y con una captura. Si una decisión no aparece en la maestra, la constitución, el golden o `DECISIONES.md`, queda marcada: nunca se rellena por plausibilidad. En la spec `000`, todas las escenas asignadas en `design/golden.config.json` son normativas y deben producir golden, candidata, diff y métricas.

## Estructura

0. Referencias normativas.
1. Objetivo y contexto.
2. Usuarios.
3. Historias.
4. Requisitos observables.
5. Reglas de negocio con ejemplo.
6. Criterios binarios y evidencia.
7. Casos límite.
8. Fuera de alcance.
9. Decisiones aprobadas.

## Diez preguntas

1. ¿El objetivo se entiende sin tecnología?
2. ¿Está claro quién lo usa y qué necesita?
3. ¿Cada regla tiene un ejemplo concreto?
4. ¿Cada criterio se responde sí/no con evidencia?
5. ¿Está separado el qué del cómo?
6. ¿El fuera de alcance evita expansión?
7. ¿Incluye vacío, error, límites y recuperación?
8. ¿Queda alguna decisión que el agente tendría que adivinar?
9. ¿Todos los punteros pasan `npm run refs:check`?
10. ¿Otra persona construiría el mismo comportamiento?

## Criterio de tarea mínima

Las tareas se cortan por recorrido vertical. Seguridad, accesibilidad, SEO, pruebas y documentación forman parte de la tarea que crea la superficie, salvo que una evidencia independiente obligue a separarlas. No se crean paquetes, servicios o automatizaciones sin consumidor actual.

## Puertas por especificación

- `npm run verify:spec:000`: build, rutas, HTML útil, Docker y fidelidad de todas las escenas visuales.
- `npm run verify:spec:010`: contenido/intenciones, conversación, navegación, SEO, accesibilidad, rendimiento y regresión visual completa.
- `npm run verify:spec:020`: contacto, privacidad, seguridad, imagen, producción, rollback y regresión visual completa.
- `npm run verify`: agrega todas las puertas aplicables desde un checkout limpio.

Los scripts se crean con la spec correspondiente. Hasta entonces, el `README.md` debe distinguir los comandos disponibles de los contratos pendientes. Omitir una prueba o regenerar el golden no cuenta como verificación.

## Cambio

Antes del cierre, spec y plan pueden corregirse en la misma rama dejando constancia. Después del cierre, el comportamiento cambia mediante una nueva spec que sustituye a la anterior. Un bug contra una spec correcta se corrige con prueba; una omisión de requisitos requiere además una decisión de producto.
