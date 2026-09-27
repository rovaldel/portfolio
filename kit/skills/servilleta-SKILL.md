---
name: "servilleta"
description: "Redacta el borrador de una especificación de negocio para GitHub Spec Kit usando únicamente fuentes aprobadas del proyecto y marcando las decisiones pendientes."
argument-hint: "NNN-nombre-de-la-spec"
user-invocable: true
disable-model-invocation: false
---

## Entrada

`$ARGUMENTS` debe ser `NNN-nombre`. Si falta, pregunta qué spec toca y detente.

## Regla principal

Redacta un **borrador para revisión humana**. Si un requisito no está en una fuente aprobada, no lo inventes: márcalo como decisión pendiente.

## Fuentes y orden

1. Leer íntegra `.specify/memory/constitution.md`.
2. Buscar la spec en `docs/servilletas/FUENTES.md`. Si no aparece o contiene una referencia rota, detenerse y pedir que se regenere/configure.
3. Leer las secciones señaladas de `docs/ESPECIFICACION_MAESTRA.md`.
4. Leer la zona correspondiente de `design/behavior-inventory.md`, las funciones reales citadas y las capturas declaradas.
5. Leer `docs/DECISIONES.md` si existe.
6. Leer los `cierre.md` de specs terminadas que puedan cambiar dependencias o supuestos.
7. Consultar tokens y contenido generados solo si están habilitados en `design/golden.config.json`.

No deduzcas requisitos a partir de nombres de carpetas, dependencias instaladas o restos de código.

## Estructura del borrador

Usa la guía `docs/GUIA_ESPECIFICACIONES.md` y redacta:

0. Referencias normativas.
1. Objetivo y contexto sin tecnología.
2. Usuarios y conocimientos asumidos.
3. Historias de usuario.
4. Requisitos observables.
5. Reglas de negocio, cada una con ejemplo concreto.
6. Criterios de aceptación binarios y su evidencia.
7. Vacío, límites, errores, recuperación y accesibilidad aplicable.
8. Fuera de alcance explícito.
9. Decisiones ya aprobadas.

Para comportamiento existente, apunta al golden con `` `fuente#función:línea` `` y a la captura; no lo re-narres. Para comportamiento nuevo, indica que el golden no lo contiene.

## Decisiones pendientes

Usa exactamente:

```text
⚠️ DECISIÓN PENDIENTE — pregunta concreta
Opciones: alternativas y consecuencias
Recomendación: opción y fundamento
```

Cuenta las pendientes. Cero solo es válido si todas las decisiones relevantes están respaldadas por fuentes.

## Verificación y entrega

1. Ejecutar `node design/scripts/check-refs.mjs`.
2. Responder las diez preguntas de la guía.
3. Comprobar que no hay tecnología en objetivo, usuarios, historias ni reglas de negocio.
4. Comprobar que cada regla tiene ejemplo y cada criterio evidencia.
5. Guardar `docs/servilletas/NNN-nombre.md`.
6. Presentar primero las decisiones pendientes, luego fuentes, supuestos y resultado de revisión.

Después detenerse. No ejecutar `/speckit-specify` sin revisión humana.
