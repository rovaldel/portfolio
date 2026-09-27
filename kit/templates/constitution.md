<!-- PLANTILLA AGNÓSTICA. Sustituir todos los marcadores ⚠️ antes de implementar. -->

# Constitución de {{NOMBRE}}

## Principios fundamentales

### I. Verdad del producto (NO NEGOCIABLE)

- La especificación maestra y las decisiones aprobadas son la fuente de verdad funcional.
- No se inventan usuarios, resultados, contenido, integraciones, métricas ni reglas de negocio.
- ⚠️ **DECISIÓN DE PROYECTO:** enumerar aquí las invariantes del dominio y los comportamientos expresamente prohibidos.

### II. Rebanadas mínimas verificables

- Cada spec entrega un resultado observable o una prueba que justifique por qué no es visual.
- Se construye el sistema mínimo que satisface el alcance actual. Una capa, servicio, dependencia o abstracción necesita un requisito o riesgo concreto.
- Las tareas se cortan por recorridos de valor, no por capas técnicas.

### III. Fidelidad a las fuentes

- El golden master es referencia de solo lectura, no código de producción.
- El comportamiento existente se cita como `fuente#función:línea`; no se vuelve a describir de memoria.
- Si están activados, tokens y contenido generados no se editan a mano.
- Cambiar una decisión visual o editorial exige una spec o decisión registrada.
- ⚠️ **DECISIÓN DE PROYECTO:** declarar qué aspectos del mockup son normativos y cuáles son solo exploratorios.

### IV. Seguridad y privacidad proporcionales (NO NEGOCIABLE)

- Se aplica `compliance/BASELINE_OWASP.md` según las capacidades y el riesgo real del producto.
- Denegación por defecto en toda frontera privilegiada; validación de entrada y codificación de salida en cada frontera de datos.
- Secretos fuera del repositorio, logs y artefactos cliente. Dependencias y automatizaciones revisadas y fijadas.
- Los controles no aplicables se documentan con motivo; los aplicables tienen prueba y evidencia.
- ⚠️ **DECISIÓN DE PROYECTO:** datos, amenazas principales, ASVS objetivo, residencia y obligaciones regulatorias.

### V. Operación simple y recuperable

- Desarrollo, CI y producción usan el mismo artefacto cuando el producto se despliega.
- Un despliegue requiere healthcheck proporcional, observabilidad mínima y rollback ensayado.
- No se introduce infraestructura “por si acaso”.
- ⚠️ **DECISIÓN DE PROYECTO:** entornos, disponibilidad, recuperación y responsables operativos.

## Restricciones técnicas

- ⚠️ **Stack:** decidir en `plan.md` cuando las restricciones estén claras; no heredarlo de la plantilla.
- ⚠️ **Arquitectura:** declarar procesos, persistencia, integraciones y límites solo si el producto los necesita.
- ⚠️ **Compatibilidad:** navegadores, dispositivos, accesibilidad, idiomas y rendimiento objetivo.
- ⚠️ **Entrega:** definir Docker, CI/CD y hosting conforme al runtime elegido.

## Flujo y puertas de calidad

- Toda spec incluye criterios de aceptación, casos límite, fuera de alcance y evidencia de cierre.
- Revisión humana reforzada para autenticación, criptografía, autorización, datos sensibles, pagos y despliegue.
- Ficheros protegidos: `.specify/memory/constitution.md`, `compliance/**`, `design/golden/**` y decisiones registradas. Los generados se cambian desde su fuente.
- Las puertas concretas se fijan al elegir stack: pruebas, análisis estático, dependencias, accesibilidad, rendimiento, imagen y despliegue según aplique.
- Ningún secreto o dato real sensible entra en repositorio, prompt, fixture, captura o log.

## Gobernanza

Esta constitución prevalece sobre preferencias de implementación. Una enmienda registra motivo, impacto, fecha y specs afectadas. Una spec cerrada no se reescribe: una nueva spec la sustituye.

**Version:** 0.1.0 | **Ratified:** ⚠️ AAAA-MM-DD | **Last Amended:** ⚠️ AAAA-MM-DD
