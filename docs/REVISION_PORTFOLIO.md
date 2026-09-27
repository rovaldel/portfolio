# Revisión del portfolio — 27 de septiembre de 2026

## Cambios

- CV: PDF original empaquetado en la ruta de descarga. Mismos bytes en desarrollo y producción, con nombre de archivo y cabeceras de descarga.
- Contacto: LinkedIn en otra pestaña, iconos con contraste, foco más discreto e información de privacidad visible.
- SMTP: Gmail por TLS en puerto 465; variables cargadas en desarrollo, arranque Node y Docker Compose. Sin credenciales, el formulario informa de que no puede confirmar la entrega y facilita el correo alternativo; no simula un envío.
- Habilidades: niveles del mockup, presentados como autoevaluación orientativa, estrellas SVG accesibles y distribución adaptativa.
- Proyectos: una tarjeta completa por enlace, sin «Ver detalles», compatible con teclado y navegación sin JavaScript.
- Navegación: siete secciones en una fila en escritorio, adaptación en pantallas pequeñas. Recursos futuros separados y sin botones inactivos que parezcan acciones.
- Bitácora: índice publicado con el artículo de LangGraph; el artículo conserva `noindex` y queda fuera de sitemap/llms.
- SEO: entidad Person enlazada a WebSite, páginas y servicios; canonical, Open Graph, imagen social, favicon, breadcrumbs y resumen llms.txt. PerplexityBot y OAI-SearchBot permitidos; se mantiene el bloqueo independiente de GPTBot para entrenamiento.

## Gmail: paso pendiente de configuración

Crear una contraseña de aplicación en la cuenta Google con verificación en dos pasos y guardarla **solo** en `.env` local (modo 600) o en el almacén de secretos del servidor como `GMAIL_SMTP_APP_PASSWORD`. No compartirla ni incluirla en Git. `.env.example` contiene los nombres de variables y valores públicos; su contraseña permanece vacía. El campo admite la contraseña con o sin espacios visuales.

Para desarrollo, completar el secreto de forma local en `.env`. Esta copia de trabajo ya contiene un `.env` privado (modo 600) con usuario, remitente y destinatario definidos; falta añadir la contraseña de aplicación nueva. Los scripts Node lo cargan sin mostrar el aviso de archivo ausente. Docker Compose transmite las cuatro variables al contenedor en ejecución; `.dockerignore` excluye `.env` de la imagen. Un gestor de secretos del despliegue también puede inyectarlas directamente.

La aceptación SMTP no acredita por sí sola la llegada a la bandeja de entrada. Tras configurar el servidor, comprobar una entrega real solicitada por el titular y revisar el buzón. Las pruebas automatizadas usan transportes falsos y no envían correo.

## Revisión jurídica y operativa

Confirmado por el titular: dominio `rodrigovaldelvira.com`, VPS de Hetzner y portfolio personal orientado a empleo, sin actividad como autónomo. No se inventan NIF, domicilio profesional ni actividad comercial.

El titular aprobó las tres páginas legales el 2026-09-27. La investigación de transferencias internacionales D-06 queda cerrada con las fuentes públicas de Google sobre su marco de transferencia y región de cuenta, y con esta asunción de riesgo menor aceptada por el titular: "se asume la validez del marco general de Google Ireland y DPF/SCCs para el tratamiento en el EEE, condicionado a que la cuenta de destino mantenga su operativa bajo los términos estándar del EEE". La evidencia y la decisión están en [human-decisions.md](../specs/002-contacto-operacion-cierre/human-decisions.md) y [research.md](../specs/002-contacto-operacion-cierre/research.md).

El titular retiró el plazo fijo de 12 meses porque no puede garantizarlo. La política declara que la aplicación no configura borrado automático en Gmail ni fija un plazo máximo concreto; se podrán borrar manualmente los mensajes cuando dejen de ser necesarios. Se mantiene el principio general de limitación del plazo de conservación.

La inspección de solo lectura de la VPS confirmó que el proxy registra IP de origen, URI, agente de usuario y referente; rota semanalmente y conserva cuatro ficheros de acceso y diez de errores. El driver Docker `json-file` del contenedor NPM no tiene límites explícitos de tamaño/cantidad; queda como seguimiento de endurecimiento operativo y se informa en la política de privacidad. No se presume un contrato de Google Workspace.

No se ha realizado un despliegue ni se ha accedido a Gmail. La ruta pública `/api/salud` de la versión existente aún devuelve 404. El cierre legal D-06 está aprobado. El usuario remoto `deploy` está aprovisionado y la clave dedicada está generada localmente; aún faltan su alta como secreto de Actions, las variables/secreto SMTP, el token de solo lectura GHCR en el servidor, la prueba real de entrega y la verificación de recuperación. La aplicación no afirma una garantía absoluta sobre las ubicaciones de tratamiento.
## Fuentes consultadas

- [RGPD, artículos 6, 12–22 y 44 y siguientes](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679).
- [LSSI, artículos 10 y 22.2](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758).
- [Guía de cookies de la AEPD](https://www.aepd.es/guias/guia-cookies.pdf): preferencias solicitadas y tecnologías similares.
- [Contraseñas de aplicación de Google](https://support.google.com/accounts/answer/185833?hl=es).
- [Rastreadores de Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).
- [Documentación de Google sobre búsqueda con IA](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

## Visibilidad tras publicar

Comprobar la URL canónica, HTTPS, redirecciones y acceso de los rastreadores en el proxy. Registrar y verificar el dominio en Google Search Console y Bing Webmaster Tools y enviar `/sitemap.xml`. Mantener proyectos y experiencia actualizados y enlazar el dominio desde LinkedIn. No se promete una posición ni recomendación preferente por buscadores o asistentes; `llms.txt` es un resumen adicional, no una señal que garantice posicionamiento.
