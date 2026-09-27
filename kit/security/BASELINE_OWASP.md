# Línea base de seguridad agnóstica

Referencia: **OWASP Top 10:2025** y **OWASP ASVS 5.0.0**. Al iniciar un proyecto se comprueba que siguen siendo las ediciones vigentes y se registra la fecha.

## Aplicación proporcional

Antes del plan se inventarían superficies: contenido público, entradas, cuentas, privilegios, datos, ficheros, pagos, integraciones, tareas asíncronas, administración y despliegue. Un control es:

- **aplicable:** tiene requisito, prueba, responsable y evidencia;
- **no aplicable:** tiene motivo verificable;
- **pendiente:** bloquea la implementación de esa superficie.

ASVS nivel 1 es el punto de partida para aplicaciones web. Elevar el nivel cuando datos, privilegios, impacto o regulación lo exijan. MASVS se añade para clientes móviles; no se sustituye ASVS por él si también existe backend web.

## Mapa OWASP Top 10:2025

| Categoría | Control base |
|---|---|
| A01 Control de acceso roto | Denegar por defecto; autorización en la frontera de confianza; pruebas horizontales y verticales cuando existan recursos privados. |
| A02 Configuración insegura | Configuración segura por entorno, errores genéricos, cabeceras, servicios mínimos, contenedor no root y sin privilegios si hay imagen. |
| A03 Fallos de cadena de suministro | Lockfile o equivalente, procedencia revisada, dependencias y Actions fijadas, auditoría, SBOM y actualización controlada según stack. |
| A04 Fallos criptográficos | TLS vigente, primitivas estándar, secretos en gestor apropiado, cifrado en reposo según sensibilidad y rotación documentada. |
| A05 Inyección | Validación por esquema, consultas parametrizadas, codificación por contexto y prohibición de evaluación dinámica de entrada no confiable. |
| A06 Diseño inseguro | Modelo de amenazas proporcional, límites de abuso y estados de fallo definidos antes del código. |
| A07 Fallos de autenticación | Solo si hay cuentas: autenticación robusta, recuperación segura, sesiones caducables, mensajes no enumerables y MFA según riesgo. |
| A08 Integridad de software o datos | Artefactos verificables, builds reproducibles, entradas firmadas cuando aplique y protección de actualizaciones/deserialización. |
| A09 Fallos de registro y alertas | Eventos de seguridad útiles sin secretos ni contenido sensible; retención, acceso, alertas y respuesta definidos según impacto. |
| A10 Manejo incorrecto de condiciones excepcionales | Timeouts, límites, cancelación, cierre limpio, respuestas seguras y recuperación/rollback probados. |

## Controles universales

- Ningún secreto, credencial o dato personal real en Git, prompts, fixtures, capturas, logs o artefactos cliente.
- Toda entrada no confiable tiene tamaño, tipo y formato limitados; toda salida se codifica para su contexto.
- Dependencias mínimas, justificadas y auditadas. Automatizaciones externas revisadas y fijadas a una versión inmutable antes de producción.
- Entornos separados. Producción falla de forma cerrada si falta configuración crítica.
- Principio de mínimo privilegio para proceso, contenedor, CI, servidor y proveedores.
- Revisión humana reforzada para autenticación, autorización, criptografía, datos sensibles, pagos y despliegue.

## Web pública, si aplica

Como mínimo: CSP acorde a los recursos reales, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, protección contra framing y HSTS solo tras confirmar HTTPS permanente en todos los hosts afectados. No se copia una CSP genérica que rompa o relaje la aplicación: se prueba sobre el build real.

## Evidencia mínima

- Matriz `control → aplicabilidad → spec → prueba → evidencia → estado`.
- Escaneo de secretos del historial.
- Auditoría y análisis estático apropiados al ecosistema elegido.
- Escaneo de imagen y comprobación no root cuando haya contenedor.
- Pruebas de abuso en cada frontera pública.
- Revisión del despliegue, healthcheck y rollback cuando haya producción.
