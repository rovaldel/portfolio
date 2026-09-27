# Research: Contacto, operación y cierre

**Feature**: 002-contacto-operacion-cierre  
**Date**: 2026-09-25

La arquitectura se hereda de 000/001 y del repositorio. Las decisiones humanas de la servilleta no se resuelven por investigación técnica; siguen como bloqueos de activación/publicación.

## 1. Aplicación y ejecución

**Decision**: Extender Astro 7.3.2, TypeScript y @astrojs/node standalone actuales, con POST /api/contacto en el mismo proceso Node. Mantener páginas prerenderizadas y reutilizar el health check existente.

**Rationale**: La constitución exige una app/proceso/imagen. El repo configura output server, adaptador Node, CSP, puerto 3000, /api/salud y un contenedor endurecido. API externa o runtime nuevo ampliarían superficie y datos.

**Alternatives considered**: Proveedor de formularios de terceros, función serverless separada, SPA, cola o base de datos. Se descartan por unidad de despliegue, privacidad y alcance.

## 2. Envío de contacto

**Decision**: Validar tamaño y forma antes de construir correo; destinatario desde secreto/configuración; remitente fijo aprobado y email visitante solo como Reply-To. Enviar una vez con TLS y timeout finito. Confirmar únicamente tras aceptación explícita. Texto plano; sin respuesta automática; no reintentar resultado incierto.

**Rationale**: Cumple confirmación veraz, límites, protección CRLF y ausencia de persistencia. El visitante no controla destinatario ni From.

**Alternatives considered**: Cola/reintento (persistencia y duplicados), respuesta automática (tratamiento adicional), HTML libre (inyección), remitente del usuario (spoofing/alineación DMARC). Fuera de alcance o incompatible.

**Dependency choice**: No fijar biblioteca hasta conocer proveedor y transporte. Elegir dependencia mínima mantenida o protocolo nativo comprobable, fijar versión y probar TLS, timeout y redacción. Proveedor, remitente, destino y credenciales son decisiones operativas, no código.

## 3. Abuso e idempotencia

**Decision**: Máximo 5 intentos por clave efímera derivada de conexión en ventana de 15 minutos y límite global; honeypot, clave idempotente breve y cuerpo máximo 8 KiB. Estado acotado en memoria del proceso, sin escribir IP. Confiar en forwarded headers solo desde proxy conocido.

**Rationale**: Una instancia única permite estado efímero sin servicio adicional. Límite global protege recursos. Reinicio limpia contadores.

**Alternatives considered**: Redis/DB (servicio extra), hash persistente de IP (retención innecesaria), CAPTCHA/terceros (rastreo/dependencia), rate limit cliente (no protege servidor). La memoria no coordina réplicas; escalar requeriría revisar arquitectura.

## 4. Errores y accesibilidad

**Decision**: Respuesta pública genérica; HTML inicial conserva canales. Validaciones y resultado asociados a controles, foco/anuncio de error, campos preservados al fallar, mailto alternativo. POST tradicional debe operar sin depender de fetch.

**Rationale**: Contenido primero, WCAG 2.2 AA y controles accionables; evita filtrar diagnóstico SMTP.

**Alternatives considered**: Borrar el formulario, éxito optimista, error solo visual o retirar contacto al faltar SMTP. Engañan, pierden datos o eliminan alternativa real.

## 5. Publicación y reversión

**Decision**: CI verifica y construye imagen por commit, publica/identifica digest; un único job de producción con concurrencia serializada promueve ese digest en Hetzner. Mantener versión anterior; comprobar salud HTTPS externamente; ante fallo revertir a digest anterior. Health público solo devuelve status ok.

**Rationale**: Coincide con constitución y contenedor existente. Se promueve el mismo artefacto verificado; rollback no reconstruye otra versión.

**Alternatives considered**: Reconstruir durante deploy, jobs concurrentes, retirar previa antes del health check o revelar detalles en health. Riesgo de no reproducibilidad, carrera o filtración.

## 6. Expediente de cierre

**Decision**: Registrar estado, evidencia localizable, fecha/actor para 34 criterios, tres revisiones humanas, verificaciones y dependencias 000/010. La puerta se calcula desde evidencia. Pendiente, fallido, omitido sin excepción o evidencia ausente bloquea publicación y declaración de producto terminado.

**Rationale**: FR-014 exige cobertura verificable; cierre administrativo previo no aprueba pruebas visuales/accesibilidad ni sustituye cierre 010.

**Alternatives considered**: Checklist manual sin vínculos, equiparar cierre administrativo con aprobación técnica o copiar aprobaciones de specs previas. No dan trazabilidad ni reflejan estado real.

## 7. Decisiones humanas y condiciones pendientes

Las decisiones recibidas del titular están registradas en [human-decisions.md](human-decisions.md), sin almacenar credenciales:

- D-01 a D-05 y D-07 están decididas conforme a ese registro.
- D-06: investigación de transferencias cerrada el 2026-09-27 con evidencia pública de Google aceptada por el titular; se registró la asunción de riesgo menor indicada en `human-decisions.md`. Los textos legales están aprobados. Se retiró el plazo fijo de 12 meses, sin afirmar un plazo máximo ni borrado automático. La revisión de logs del proxy se completó.
- D-08: excepción limitada para desplegar con el contrato visual de spec 000 fallido (19/19 escenas) y la revisión humana de accesibilidad pendiente; revisar el 2026-10-27. No constituye pase técnico.

Siguen siendo puertas de publicación la provisión segura de SMTP y GHCR, la cuenta y clave de despliegue, el workflow inmutable con rollback, la activación y prueba de alertas, las revisiones humanas de privacidad/operación y la evidencia técnica restante. La autorización de una decisión humana no convierte por sí sola en aprobada una verificación dependiente.

### Evidencia pública de Google y conservación (consulta 2026-09-27)

Google indica que la información puede tratarse en servidores fuera del país de residencia y que, para transferencias internacionales, se apoya en decisiones de adecuación, el EU-U.S. Data Privacy Framework para Google LLC y sus filiales estadounidenses cubiertas, y cláusulas contractuales tipo cuando corresponden. También explica que sus servicios de consumo suelen prestarse desde Google Ireland Limited a usuarios del EEE. Referencias: [marcos de transferencia de Google](https://policies.google.com/privacy/frameworks?hl=en), [región de la cuenta de Google](https://policies.google.com/faq).

El titular acepta estas fuentes como evidencia válida para cerrar la investigación de transferencias internacionales D-06. Asunción de riesgo menor: "se asume la validez del marco general de Google Ireland y DPF/SCCs para el tratamiento en el EEE, condicionado a que la cuenta de destino mantenga su operativa bajo los términos estándar del EEE". Si cambian la región o los términos aplicables a la cuenta, se reabre la revisión.

La AEPD describe la limitación del plazo de conservación como conservar los datos solo durante el tiempo necesario para la finalidad. Por eso se retiró la promesa operativa de borrado a los 12 meses, manteniendo en la política la eliminación manual cuando los mensajes dejan de ser necesarios, sin afirmar que no exista el principio general de limitación. Referencia: [principios de protección de datos de la AEPD](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/principios).
