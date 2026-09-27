# Revisión del portfolio — 25 de septiembre de 2026

## Cambios

- CV: PDF original empaquetado en la ruta de descarga. Mismos bytes en desarrollo y producción, con nombre de archivo y cabeceras de descarga.
- Contacto: LinkedIn en otra pestaña, iconos con contraste, foco más discreto e información de privacidad visible.
- SMTP: Gmail por TLS en puerto 465; variables cargadas en desarrollo, arranque Node y Docker Compose. Sin credenciales, el formulario informa de que no puede confirmar la entrega y facilita el correo alternativo; no simula un envío.
- Habilidades: niveles del mockup, presentados como autoevaluación orientativa, estrellas SVG accesibles y distribución adaptativa.
- Proyectos: una tarjeta completa por enlace, sin «Ver detalles», compatible con teclado y navegación sin JavaScript.
- Navegación: siete secciones en una fila en escritorio, adaptación en pantallas pequeñas. Recursos futuros separados y sin botones inactivos que parezcan acciones.
- Bitácora: portada «Próximamente». El artículo existente se conserva en su URL como material previo, con noindex y fuera de sitemap/llms. Las consultas sobre bitácora explican que está en preparación.
- SEO: entidad Person enlazada a WebSite, páginas y servicios; canonical, Open Graph, imagen social, favicon, breadcrumbs y resumen llms.txt. PerplexityBot y OAI-SearchBot permitidos; se mantiene el bloqueo independiente de GPTBot para entrenamiento.

## Gmail: paso pendiente de configuración

Crear una contraseña de aplicación en la cuenta Google con verificación en dos pasos y guardarla **solo** en `.env` local (modo 600) o en el almacén de secretos del servidor como `GMAIL_SMTP_APP_PASSWORD`. No compartirla ni incluirla en Git. `.env.example` contiene los nombres de variables y valores públicos; su contraseña permanece vacía. El campo admite la contraseña con o sin espacios visuales.

Para desarrollo, completar el secreto de forma local en `.env`. Esta copia de trabajo ya contiene un `.env` privado (modo 600) con usuario, remitente y destinatario definidos; falta añadir la contraseña de aplicación nueva. Los scripts Node lo cargan sin mostrar el aviso de archivo ausente. Docker Compose transmite las cuatro variables al contenedor en ejecución; `.dockerignore` excluye `.env` de la imagen. Un gestor de secretos del despliegue también puede inyectarlas directamente.

La aceptación SMTP no acredita por sí sola la llegada a la bandeja de entrada. Tras configurar el servidor, comprobar una entrega real solicitada por el titular y revisar el buzón. Las pruebas automatizadas usan transportes falsos y no envían correo.

## Revisión jurídica y operativa

Confirmado por el titular: dominio `rodrigovaldelvira.com`, VPS de Hetzner y portfolio para empleo, sin actividad como autónomo. No se inventan NIF, domicilio profesional ni una actividad comercial.

Los textos se han ampliado conforme a esas condiciones. Se mantienen identificados como borradores porque la conformidad requiere verificar aspectos que no están en este repositorio:

1. País efectivo de la VPS, contrato aplicable de Hetzner, acceso al servidor y retención del proxy, logs y copias.
2. Condiciones de la cuenta personal de Gmail para este tratamiento; destinatarios, posibles transferencias internacionales y garantías aplicables. No se presume un contrato de Google Workspace.
3. Aplicación de la política propuesta de 12 meses desde la última comunicación a los correos; ajustar el texto si se adopta otro plazo justificado. El código no elimina correos del buzón.
4. Revisar si la finalidad real o una actividad económica posterior exige información adicional del artículo 10 LSSI. El mero nombre «portfolio» no decide por sí solo su ámbito de aplicación.
5. Verificar en el despliegue que no se añaden analítica, cookies, widgets o registros no descritos. El código inspeccionado solo escribe `rv_theme` después de que se elija un tema.

No se ha realizado un despliegue ni se ha accedido a la VPS o a Gmail. No hay certificación de cumplimiento universal ni aprobación jurídica ficticia. Las puertas históricas de publicación se conservan; los cambios visuales pedidos reemplazan criterios anteriores incompatibles (por ejemplo, la ausencia de estrellas), sin alterar el mockup ni los golden para ocultar diferencias.

## Fuentes consultadas

- [RGPD, artículos 6, 12–22 y 44 y siguientes](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679).
- [LSSI, artículos 10 y 22.2](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758).
- [Guía de cookies de la AEPD](https://www.aepd.es/guias/guia-cookies.pdf): preferencias solicitadas y tecnologías similares.
- [Contraseñas de aplicación de Google](https://support.google.com/accounts/answer/185833?hl=es).
- [Rastreadores de Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).
- [Documentación de Google sobre búsqueda con IA](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

## Visibilidad tras publicar

Comprobar la URL canónica, HTTPS, redirecciones y acceso de los rastreadores en el proxy. Registrar y verificar el dominio en Google Search Console y Bing Webmaster Tools y enviar `/sitemap.xml`. Mantener proyectos y experiencia actualizados y enlazar el dominio desde LinkedIn. No se promete una posición ni recomendación preferente por buscadores o asistentes; `llms.txt` es un resumen adicional, no una señal que garantice posicionamiento.
