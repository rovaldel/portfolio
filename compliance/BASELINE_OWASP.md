# Línea base de seguridad del portfolio

**Referencia verificada:** OWASP Top 10:2025 y OWASP ASVS 5.0.0, nivel 1. Revisar versiones al iniciar la implementación.

## Superficie y datos

- Sitio público sin cuentas, roles, pagos, base de datos, CMS, analítica ni LLM remoto.
- Conversación y preferencias locales; no salen del navegador.
- Única entrada servidor: formulario de contacto. Se valida, limita, protege contra abuso, envía por SMTP y no se persiste en la aplicación.
- Secretos: SMTP, SSH, registro de imágenes y configuración operativa. Nunca llegan al cliente ni al repositorio.

## Mapa OWASP Top 10:2025

| Categoría | Aplicación en este proyecto |
|---|---|
| A01 Control de acceso roto | Sin cuentas. API limitada a contacto/salud; rutas internas, ficheros y operación del servidor no son públicos; despliegue con mínimo privilegio. |
| A02 Configuración insegura | HTTPS, cabeceras probadas, errores genéricos, sin directory listing ni source maps públicos, contenedor read-only y servicio ligado a loopback. |
| A03 Cadena de suministro | Lockfile congelado, dependencias/Actions fijadas, auditoría, Gitleaks, CodeQL, Trivy y SBOM. |
| A04 Fallos criptográficos | TLS 1.2 mínimo y 1.3 preferente; claves SSH modernas; secretos solo en GitHub Environment o servidor restringido. |
| A05 Inyección | Esquema de entrada, escaping del framework, Markdown sin HTML arbitrario, cabeceras de email seguras y rechazo CRLF. |
| A06 Diseño inseguro | Modelo de amenazas reducido, límites explícitos y configuración de producción fail closed. |
| A07 Fallos de autenticación | No aplica a usuarios finales. SSH sin contraseña ni root; entorno de GitHub restringe producción. |
| A08 Integridad de software/datos | Imagen identificada por SHA/digest, build reproducible, procedencia comprobable y rollback a imagen previa. |
| A09 Registro y alertas | Salud, despliegue y errores técnicos sin payload de contacto, conversación o secretos; rotación y alertas. |
| A10 Condiciones excepcionales | Timeouts, tamaños máximos, idempotencia de envío, cierre limpio, healthcheck y rollback automático. |

## Cabeceras mínimas

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
X-Frame-Options: DENY
```

La CSP se prueba con el build real. No se permite `unsafe-eval`; un script inline inevitable usa nonce por respuesta. HSTS `preload` queda fuera hasta verificar todos los subdominios.

## Evidencia bloqueante

- Modelo de amenazas y matriz control → spec → prueba → evidencia.
- Auditoría de dependencias productivas y análisis estático.
- Gitleaks sobre historial completo.
- Pruebas de contacto: campos extra, entrada grande, HTML, CRLF, origen ajeno, ráfaga, doble envío y caída SMTP.
- Pruebas de cabeceras y CSP sobre el contenedor ejecutándose.
- Trivy y comprobación de usuario no root.
- Despliegue identificado por commit/digest, healthcheck y rollback ensayado.

Una excepción incluye alcance, motivo, responsable y fecha de caducidad. “No aplica” incluye evidencia.
