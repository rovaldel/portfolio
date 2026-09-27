---
name: "servilleta"
description: "Redacta el borrador de una servilleta —la especificación en lenguaje de negocio que alimenta /speckit-specify— a partir del golden master, la especificación maestra y las decisiones ya cerradas. Úsala cuando toque preparar la siguiente funcionalidad."
argument-hint: "NNN-nombre-de-la-spec (ej: 010-modelo-de-datos)"
user-invocable: true
disable-model-invocation: false
---

## Entrada

```text
$ARGUMENTS
```

Es el identificador de la especificación: `NNN-nombre`. Si viene vacío, pregunta cuál toca y **no continúes** hasta saberlo.

---

## Qué es esto y qué NO es

Vas a redactar el **borrador** de una servilleta: la especificación en lenguaje de negocio que después alimenta `/speckit-specify`.

**Una servilleta la decide una persona.** Tu trabajo es reunir todo lo que ya está decidido y escrito en el proyecto, redactarlo con la estructura correcta, y **marcar con claridad lo que falta por decidir**. No es rellenar huecos con lo que parezca razonable.

> **La regla que gobierna esta skill:** si no está en una fuente del proyecto, **no lo escribes: lo preguntas.** Un requisito inventado que suena bien es peor que un hueco visible, porque nadie lo revisa.

---

## Paso 1 · Localizar las fuentes

Lee `docs/servilletas/FUENTES.md` y busca la entrada de esta spec. Te da:

- Las secciones de `docs/ESPECIFICACION_MAESTRA.md` que la describen
- Las funciones del golden master con su línea exacta
- Las capturas de referencia

Si la spec **no aparece** en FUENTES.md, dilo y pregunta antes de seguir.

## Paso 2 · Leer, en este orden

1. **`.specify/memory/constitution.md`** — íntegra. Es la que manda sobre todo lo demás.
2. **Las secciones indicadas de la especificación maestra** — de ahí salen el objetivo, los usuarios y la mayoría de las reglas de negocio.
3. **`design/behavior-inventory.md`**, la zona de esta spec — qué funciones hay que portar.
4. **El código del golden**, las funciones citadas. Léelas de verdad: los comentarios explican el porqué clínico, que casi nunca está en otro sitio.
5. **Las capturas** indicadas.
6. **`docs/DECISIONES.md`** — toda decisión relacionada va a la sección 9.
7. **`specs/*/` de las specs ya cerradas**, en particular su `cierre.md` — qué se construyó realmente y qué se aprendió. **Esto cambia las dependencias y los supuestos.**
8. **`content/es.json`** y **`design/tokens.json`** — qué copy y qué valores existen ya.

## Paso 3 · Redactar el borrador

Usa la plantilla de `docs/GUIA_ESPECIFICACIONES.md` §5. Once secciones, de la 0 a la 9, más la cabecera.

**Cabecera:** hito, dependencias y —importante— **`Se valida viendo:`** una frase concreta de qué se ve y dónde. Si la spec no produce nada visible, dilo así: *«Nada visible. Se verifica con pruebas: …»*

**Sección 0 · Referencia normativa.** Cita las funciones **con su línea exacta**, tomada del inventario, nunca de memoria. Añade las capturas. Si la spec no tiene comportamiento previo en el golden, dilo explícitamente: *«Esta especificación construye algo que el prototipo no tiene.»*

**Secciones 1–3.** Objetivo, usuarios e historias. Salen de la especificación maestra. Escribe **sin una sola palabra de tecnología**: si tu cuñado no lo entiende, está mal redactado.

**Sección 4 · Requisitos.** Cuando exista comportamiento en el golden, redacta **requisitos de port**, no descripciones:
> ✅ `RF2. Portar attachQsSwipe (golden:2249). Aspecto en hoy-tres-tareas.png`
> ❌ `RF2. El sistema debe permitir deslizar la tarjeta hacia arriba para…`

Describir con palabras algo que ya existe construido pierde precisión en la traducción. **Apunta.**

**Sección 5 · Reglas de negocio.** Cada una con **un ejemplo concreto, con números o casos reales**. Sin ejemplo, la regla no está terminada. Sácalas de la especificación maestra y de los comentarios del golden.

**Sección 6 · Criterios de aceptación.** Cada uno tiene que responderse **sí o no mirando la app**. Marca `(prueba)` los que no se puedan comprobar a ojo. Si una spec no tiene ningún criterio verificable visualmente y no es de las de cimientos, algo está mal planteado.

**Sección 7 · Casos límite.** Vacío, cero, error, sin conexión, valores extremos, concurrencia, lo inesperado.

**Sección 8 · Fuera de alcance.** Explícito. Es la sección que impide que la implementación se vaya por las ramas.

**Sección 9 · Decisiones ya tomadas.** Todo lo que el agente de `/speckit-specify` no debe decidir. Si no está aquí, se lo inventará.

## Paso 4 · Marcar lo que falta

Cada hueco que no puedas rellenar desde una fuente va así, en su sitio:

```
⚠️ DECISIÓN PENDIENTE — [la pregunta, formulada para que se pueda responder]
   Opciones: [las que veas, con su consecuencia]
   Mi recomendación: [cuál y por qué]
```

**Cuenta siempre cuántas quedan** al terminar. Cero pendientes en una spec compleja es señal de que inventaste algo.

## Paso 5 · Verificar antes de entregar

1. `node design/scripts/check-refs.mjs` — todas las referencias apuntan a lo que dicen.
2. Las **diez preguntas** de la guía §5, una a una, respondidas por escrito.
3. Ninguna regla de negocio sin ejemplo.
4. Ninguna palabra de tecnología en las secciones 1 a 8.
5. Nada que contradiga la constitución. Si algo choca, **dilo en lugar de resolverlo**.

## Paso 6 · Entregar

Guarda en `docs/servilletas/NNN-nombre.md` y presenta:

- Qué fuentes usaste y qué encontraste en cada una
- **Las decisiones pendientes, en primer lugar y numeradas**
- El resultado de las diez preguntas
- Qué supuestos hiciste, si hiciste alguno

Después **para**. No ejecutes `/speckit-specify`: la servilleta la revisa una persona antes.

---

## Errores que no debes cometer

- **Inventar reglas de negocio.** Salen de la especificación maestra, del golden o de una decisión. De ningún otro sitio.
- **Reescribir copy clínico.** El texto de este producto es parte del tratamiento. Sale de `content/es.json`.
- **Citar líneas de memoria.** Siempre del inventario, y siempre verificadas con `check-refs`.
- **Rellenar un hueco para que la servilleta parezca completa.** Un hueco visible se resuelve; uno tapado se implementa mal.
- **Describir con prosa lo que el golden ya construyó.** Apunta a la función y a la captura.
- **Meter tecnología en las secciones 1–8.** El *cómo* va en `/speckit-plan`, no aquí.
