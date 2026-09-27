# Cierre de la especificación NNN · [nombre]

> Se guarda en `specs/NNN-slug/cierre.md` cuando la especificación se da por terminada.
>
> **Para qué sirve:** es lo único que conecta una especificación con la siguiente. Sin este documento, cada servilleta se escribe con los supuestos del papel en vez de con lo aprendido construyendo, y el proyecto repite errores que ya había resuelto.

**Cerrada el:** AAAA-MM-DD · **Ramas:** … · **Revisión humana de seguridad:** sí / no aplica

---

## 1. Criterios de aceptación

Uno a uno, con su resultado. Un criterio no verificado **no cierra**.

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| CA1 | … | ✅ / ❌ | captura, prueba o comando |

**Criterios no cumplidos y por qué:** [si los hay, y qué se hace con ellos]

## 2. Qué cambió respecto a la especificación

Lo que se implementó distinto de lo especificado, y por qué. Si `spec.md` se corrigió durante la implementación, aquí se dice qué y cuándo.

| Cambio | Motivo | ¿Se corrigió `spec.md`? |
|---|---|---|

Si no cambió nada, escribirlo: *«Ninguno. Lo implementado coincide con lo especificado.»* Es información, no un trámite.

## 3. Decisiones tomadas durante la implementación

Las que tengan coste de reversión alto **van también a `docs/DECISIONES.md`**, no solo aquí.

| Decisión | Alternativas descartadas | Registrada en DECISIONES |
|---|---|---|

## 4. Qué hay que saber para las siguientes especificaciones

**La sección más importante del documento.** Lo que aprendiste construyendo y que cambia lo que se dará por supuesto después.

- **Supuestos que resultaron falsos:** …
- **Lo que costó más de lo previsto:** …
- **Lo que resultó más fácil:** …
- **Restricciones nuevas** que heredan las siguientes specs: …
- **Servilletas que hay que revisar** a la luz de esto: …

## 5. Deuda dejada a propósito

Lo que se dejó a medias **conscientemente**, con dónde queda anotado. Deuda que no se escribe no es deuda: es un fallo esperando.

| Qué | Por qué se dejó | Dónde queda anotado |
|---|---|---|

## 6. Estado de las puertas

- [ ] Comando de verificación del proyecto en verde
- [ ] Criterios de aceptación verificados
- [ ] Revisión humana reforzada en superficies de riesgo (si aplica)
- [ ] Comparación visual con las capturas del golden (si aplica)
- [ ] Matriz de controles actualizada (si toca controles)
