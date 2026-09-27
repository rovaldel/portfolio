# Data Model: Contacto, operación y cierre

Este modelo define estados de ejecución y evidencia. No crea persistencia de consultas personales en la aplicación.

## Consulta de contacto (temporal)

- Campos: nombre (2–80 caracteres), email válido (máximo 254), mensaje (20–3000), token idempotente aleatorio de vida breve, honeypot vacío y hora de recepción.
- Transporte máximo 8 KiB; content type admitido; conjunto exacto de campos. Rechazar origen/host no permitido, campos inesperados, CRLF en valores de cabecera, honeypot completado y valores inválidos.
- Un solo destinatario configurado; From fijo aprobado; email visitante solo Reply-To.
- Valores solo en memoria durante petición y en navegador hasta respuesta. No persistir ni registrar valores, cuerpos, cabeceras completas o secretos.
- Estados: received → rejected-validation | rejected-abuse | delivering → accepted | failed-provider | timed-out | unavailable. Solo accepted confirma envío. Resultado incierto se comunica como no confirmado y no se reintenta.

## Canal público confirmado

- Campos: tipo (email, phone, linkedin, location), valor canónico, etiqueta, destino, aprobación (pending, approved, excluded), evidencia/actor/fecha de confirmación.
- Publicar solo approved. Pendiente o excluido no produce texto ni enlace vacío. Fuente pública: src/content/site.ts. Evidencia de aprobación permanece fuera del sitio.

## Ventana de abuso (efímera)

- Clave efímera del proceso para conexión, contador, inicio/expiración; clave idempotente y resultado durante TTL corto.
- Máximo 5 intentos por dirección en 15 minutos y límite global defensivo. Dirección nunca se guarda en disco ni logs. Reinicio limpia estado; despliegue asume instancia única.
- No usar listas persistentes, analítica de direcciones ni almacenamiento externo.

## Versión publicada

- Campos: referencia de cambio, URI/digest OCI inmutable, UTC timestamp, URL, job actor, resultado (built, verified, promoted, healthy, rolled-back, failed), digest anterior y activo.
- Producción serializada; promover digest verificado sin reconstruir. Conservar anterior hasta superar health check; si falla, restaurar anterior y registrar fallo.

## Evidencia de cierre

- Campos: ID de criterio/revisión/dependencia, resultado (pass, fail, pending, not-run, approved-exception), referencia/hash/ubicación de evidencia, fecha/hora, actor, notas sin PII y estado bloqueante.
- Cobertura: 34 criterios, revisiones de contenido, privacidad/legal y operación, dependencias 000/010, controles técnicos y ocho decisiones.
- Cada evidencia enlaza al criterio exacto. Fail, pending, not-run sin excepción aprobada, evidencia ausente, revisión humana pendiente o dependencia sin cierre comprobable bloquea publicar y declarar la v1 terminada.

## Decisión pendiente

- Campos: ID 1–8, pregunta, responsable, decisión, evidencia, fecha, acciones bloqueadas y estado (open, decided, verified).
- Transiciones: open → decided → verified. No inferir respuesta desde recomendaciones o valores actuales. Resolver una decisión no aprueba verificaciones técnicas automáticamente.

## Relaciones

- Consulta temporal → canal/destinatario aprobado; sin almacenamiento entre peticiones.
- Publicación → artefacto por digest → health check → activo o rollback.
- Criterio/revisión/dependencia → evidencia → puertas de publicación/cierre.
- Decisión pendiente → acciones bloqueadas de formulario, contenido público, despliegue o cierre.
