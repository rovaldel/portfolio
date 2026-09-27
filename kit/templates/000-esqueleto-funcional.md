# Servilleta: Esqueleto funcional · spec 000

> **Plantilla agnóstica.** Sustituye todos los marcadores. No añadas cuentas, base de datos, API, IA, colas o servicios externos salvo que el recorrido elegido los necesite.

**Hito:** 1 · **Depende de:** nada

**Se valida viendo:** ⚠️ [resultado mínimo observable, ubicación y modo de acceso]

**Si existe golden visual:** la spec 000 debe cerrar la presentación completa asignada a ella —no una pantalla de muestra— y declarar escenas, viewports, tolerancia, excepciones aprobadas e informe de diferencias. Las specs posteriores heredan ese contrato y no lo rediseñan.

## 0. Referencia normativa

- Especificación maestra: ⚠️ [secciones exactas].
- Golden master: ⚠️ [capturas y punteros `fuente#función:línea`, o “sin comportamiento previo”].
- Constitución: íntegra.
- Precedencia: la maestra decide el producto; el golden decide lo visual declarado normativo; esta servilleta decide el alcance de la rebanada.

## 1. Objetivo y contexto de negocio

⚠️ ¿Cuál es el recorrido de valor más pequeño que demuestra que el producto puede construirse y operarse de la forma definitiva?

Debe terminar en valor comprobable, no solo en carpetas, configuración o una pantalla vacía.

## 2. Usuarios

- **Usuario directo:** ⚠️
- **Necesidad y contexto:** ⚠️
- **Conocimiento que no se le puede exigir:** ⚠️
- **Actores indirectos, si existen:** ⚠️

## 3. Historias de usuario

- **HU1.** Como ⚠️, quiero ⚠️, para ⚠️.
- **HU2.** Como responsable del producto, quiero verificar ⚠️, para saber que ⚠️.

## 4. Requisitos funcionales

- **RF1.** ⚠️ Comportamiento observable de entrada a salida.
- **RF2.** ⚠️ Estado vacío o primera visita.
- **RF3.** ⚠️ Error y recuperación.
- **RF4.** ⚠️ Persistencia, identidad o integración solo si el objetivo las exige.
- **RF5.** ⚠️ Forma mínima de ejecutar localmente y, si aplica, publicar.
- **RF6.** ⚠️ Contrato de `README.md`: estado real, funcionamiento, requisitos, configuración, arranque, parada, verificación, despliegue y rollback, sin anunciar comandos todavía inexistentes.

## 5. Reglas de negocio

- **RN1.** ⚠️ Regla. **Ejemplo:** caso concreto.
- **RN2.** ⚠️ Regla. **Ejemplo:** caso concreto.

## 6. Criterios de aceptación

- **CA1.** ⚠️ Resultado principal verificable con sí/no.
- **CA2.** ⚠️ Camino vacío o alternativo verificable.
- **CA3.** ⚠️ Fallo esperado con mensaje y recuperación verificables.
- **CA4.** *(prueba)* ⚠️ Restricción no visible: seguridad, rendimiento, contrato o integridad.
- **CA5.** ⚠️ Ejecución local reproducible; producción solo si forma parte de esta rebanada.
- **CA6.** *(si existe golden)* Todas las escenas comparan golden y candidata de forma reproducible; una escena fallida bloquea el cierre y el informe conserva diff y métricas.
- **CA7.** Los comandos disponibles del README se han ejecutado desde checkout limpio y coinciden con el comportamiento documentado.

## 7. Casos límite

- Sin datos o primera visita.
- Entrada inválida o inesperadamente grande.
- Recurso o tercero no disponible, si existe.
- Operación repetida, concurrencia o doble envío, si aplica.
- Pantalla pequeña, zoom, teclado y movimiento reducido, si hay interfaz.
- Interrupción y recuperación sin pérdida indebida.

## 8. Fuera de alcance

- ⚠️ Funciones aplazadas explícitamente.
- Arquitectura genérica y automatizaciones sin consumidor actual.
- Controles que no aplican al riesgo, con motivo documentado.

## 9. Decisiones ya tomadas

- ⚠️ Solo decisiones presentes en la constitución, la maestra o `docs/DECISIONES.md`.
- El stack se decide en el plan a partir de requisitos; no se hereda del kit.
- Cada nueva dependencia necesita una necesidad concreta y una alternativa más simple descartada.

## Decisiones pendientes antes de `/speckit-specify`

1. ⚠️ Resultado exacto de la rebanada.
2. ⚠️ Qué escenas completas del mockup son normativas y cómo se comparan.
3. ⚠️ Fronteras de datos y nivel de seguridad aplicable.
4. ⚠️ Contrato local y, si aplica, contrato de producción.
