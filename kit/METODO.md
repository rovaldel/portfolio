# Guía agnóstica de especificaciones para {{NOMBRE}}

## 1. Orden de trabajo

1. Revisar el mockup y `docs/ESPECIFICACION_MAESTRA.md`.
2. Completar las decisiones marcadas en `.specify/memory/constitution.md`.
3. Configurar `design/golden.config.json`: fuentes, tokens, contenido, escenas y mapa de specs.
4. Ejecutar `npm run design:regen` y revisar los artefactos generados.
5. Adaptar `docs/servilletas/000-esqueleto-funcional.md` a la rebanada mínima del producto.
6. Ejecutar `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks` y `/speckit-implement`.
7. Cerrar la spec con `docs/plantillas/cierre.md` antes de preparar la siguiente.

No se ejecuta `/servilleta` mientras `FUENTES.md` o la constitución contengan marcadores pendientes que afecten a esa spec.

## 2. Qué decide cada artefacto

| Artefacto | Decide | No decide |
|---|---|---|
| Especificación maestra | Producto, usuarios, alcance, riesgos, operación | Implementación detallada |
| Constitución | Reglas no negociables y gobernanza | Funciones individuales |
| Servilleta | Qué y por qué de una rebanada | Stack o librerías |
| `spec.md` | Requisitos verificables | Arquitectura accidental |
| `plan.md` | Cómo construir esa spec con el mínimo sistema suficiente | Nuevas funciones de producto |
| `tasks.md` | Unidades ejecutables y verificables | Requisitos nuevos |
| `cierre.md` | Evidencia y aprendizaje real | Reescritura retroactiva de una spec cerrada |

## 3. Golden master

El mockup es evidencia visual y funcional, no código de producción. Las servilletas apuntan a él mediante:

- `design/behavior-inventory.md` para comportamiento;
- `design/screenshots/` para estados visuales;
- `design/tokens.json` si el proyecto activa extracción de tokens;
- `content/<idioma>.json` si activa extracción de contenido.

Los punteros normativos usan el formato `` `fuente#función:línea` ``. `npm run refs:check` detecta líneas movidas o nombres inexistentes.

Si el mockup no contiene una función o estado, la spec lo declara. No se inventa una referencia.

## 4. Servilleta

Una servilleta es un borrador humano asistido. Debe incluir:

0. referencias normativas;
1. objetivo y contexto;
2. usuarios;
3. historias;
4. requisitos observables;
5. reglas de negocio con ejemplo;
6. criterios de aceptación binarios;
7. casos límite;
8. fuera de alcance;
9. decisiones ya tomadas.

Todo hueco se expresa así:

```text
⚠️ DECISIÓN PENDIENTE — pregunta concreta
Opciones: alternativas y consecuencias
Recomendación: opción y fundamento
```

La skill reúne fuentes y redacta. La persona responsable resuelve las decisiones y autoriza el paso a Spec Kit.

## 5. Primera rebanada

La spec 000 prueba el recorrido mínimo de valor y la forma real de operar el producto. “Punta a punta” significa atravesar **solo las capas que el producto necesita**:

- una web estática puede necesitar build, rutas, accesibilidad, contenedor y entrega, pero no cuentas ni base de datos;
- una aplicación con datos persistentes puede necesitar identidad, autorización y almacenamiento;
- una integración puede necesitar colas, reintentos o webhooks si sus contratos lo exigen.

No se añaden capas para demostrar exhaustividad. Cada componente nuevo debe vincularse a un requisito o riesgo concreto.

## 6. Seguridad proporcional

La línea base es `compliance/BASELINE_OWASP.md`. Antes del plan se clasifican:

- datos tratados y sensibilidad;
- fronteras de entrada y salida;
- identidad y permisos, si existen;
- terceros, secretos y cadena de suministro;
- exposición pública y consecuencias del fallo.

Se selecciona el nivel ASVS y los controles aplicables. “No aplica” requiere motivo y evidencia; no se implementan controles de cuentas, auditoría de negocio o cifrado por campo en productos que no tienen esa superficie.

## 7. Docker, CI y despliegue

El kit no puede generar un Dockerfile correcto sin conocer runtime, comando de build y artefacto de ejecución. El plan de la primera spec instancia el contrato de `docker/README.md`.

El workflow inicial verifica el propio armazón y secretos. Cuando se elige stack se añaden, como puertas bloqueantes:

- formato, análisis estático, tipos y pruebas aplicables;
- auditoría de dependencias y análisis de código para los lenguajes usados;
- build reproducible;
- escaneo y ejecución no root de la imagen, si hay contenedor;
- pruebas de aceptación y despliegue con rollback, si hay producción.

No se activa despliegue hasta que existan entorno protegido, secretos, healthcheck y procedimiento de rollback.

## 8. Cómo minimizar tareas sin perder robustez

- Cortar por recorridos verticales verificables, no por capas o carpetas.
- Integrar seguridad, accesibilidad, SEO y observabilidad en la tarea que crea la superficie correspondiente.
- Evitar paquetes compartidos, servicios y abstracciones hasta que haya dos consumidores reales.
- No crear tareas separadas para documentación o pruebas que forman parte de la definición de terminado de otra tarea.
- Registrar decisiones irreversibles; dejar las reversibles al plan más cercano a su uso.

Una tarea termina con evidencia. Una spec termina con sus criterios aceptados y `cierre.md`.

## 9. Cambio y trazabilidad

- Antes de implementar: corregir servilleta y spec, y regenerar artefactos derivados.
- Durante la implementación: si el requisito era incorrecto, corregirlo en la misma rama y documentar el cambio.
- Después de cerrar: crear una nueva spec que sustituya a la anterior; no reescribir historia.
- Un bug contra una spec correcta se corrige con prueba; un bug permitido por una spec incompleta exige además una nueva decisión de producto.

## 10. Diez preguntas de revisión

1. ¿El objetivo se entiende sin tecnología?
2. ¿Está claro quién lo usa y qué necesita?
3. ¿Cada regla de negocio tiene un ejemplo?
4. ¿Cada criterio se responde sí/no con evidencia?
5. ¿Está separado el qué del cómo?
6. ¿El fuera de alcance evita expansión?
7. ¿Incluye vacío, error, límites y recuperación?
8. ¿Queda alguna decisión que el agente tendría que adivinar?
9. ¿Las referencias apuntan a fuentes reales?
10. ¿Otra persona construiría el mismo comportamiento?
