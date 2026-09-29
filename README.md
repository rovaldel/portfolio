# Portfolio de Rodrigo Valdelvira

Portfolio en Astro/TypeScript con navegación conversacional local, páginas accesibles sin JavaScript, cinco temas, CV descargable y contacto mediante Gmail SMTP. Dominio canónico: https://rodrigovaldelvira.com. Alojamiento previsto: VPS de Hetzner.

## Arranque

Requiere Node 24.19.0 y pnpm 12.3.0.

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

La aplicación utiliza `http://localhost:3000`. El explorador de preguntas funciona en el navegador, sin llamadas a un LLM ni almacenamiento de conversaciones. Las fuentes, imágenes y scripts son locales. Solo se guarda `rv_theme` cuando el visitante elige un tema.

## Idiomas

El sitio existe en español (URLs originales) e inglés (bajo `/en`). El selector `ES`/`EN` de la cabecera, o la entrada «English»/«Español» del menú móvil, lleva a la página equivalente y conserva `?asunto=` y `?servicio=`. No hay redirección automática por `Accept-Language`.

- `src/content/site.ts` es la fuente en español; `src/content/site.en.ts` traduce solo el texto y reutiliza estructura, identificadores, orden, iconos e imágenes. `getContent(locale)` (`src/content/index.ts`) devuelve la edición pedida y `validateLocaleParity` falla si ambas divergen.
- `src/lib/i18n.ts` reúne el idioma de la URL, la tabla de rutas equivalentes y las cadenas de interfaz (también las usan los scripts del navegador, que leen `<html lang>`).
- Las páginas viven en `src/components/pages/`; `src/pages/*.astro` y `src/pages/en/*.astro` son envoltorios de una línea. El artículo de Bitácora tiene un archivo por idioma (`locale:` en su cabecera).
- El formulario de contacto envía a `/api/contacto?lang=en` desde la versión inglesa para que el servidor responda en ese idioma; el correo que recibe el titular no cambia.
- Las páginas legales inglesas son una traducción de cortesía de los textos españoles aprobados y así lo indican; prevalece el original español.
- `Descargar CV` entrega el mismo PDF (en español) desde ambas versiones; no hay un CV en inglés.

## Contacto

En local, rellena `GMAIL_SMTP_APP_PASSWORD` en `.env` con una contraseña de aplicación de Google. `.env.example` solo es una plantilla sin secretos. No uses la contraseña normal ni guardes credenciales en el repositorio. La cuenta SMTP, el remitente y el destino aprobados para el formulario son `rodr.valdelvira@gmail.com`. El canal público alternativo del portfolio sigue siendo el email aprobado en `src/content/site.ts`.

El servidor envía por `smtp.gmail.com:465` con TLS, elimina espacios de formato de la contraseña de aplicación, usa el email del visitante como `Reply-To` y confirma únicamente la aceptación SMTP. El registro distingue configuración incompleta (`contact_delivery_unavailable`) de un rechazo o fallo SMTP (`contact_delivery_failed`); si hay código de error SMTP, lo registra sin incluir credenciales ni datos del formulario. Sin configuración válida muestra un error y el email alternativo. Incluye validación de origen y campos, límite de tamaño, honeypot, límite de frecuencia e identificador para evitar duplicados. Estos límites viven en memoria de una única instancia.

```bash
pnpm run build
pnpm run start
# Alternativa con las variables de .env transmitidas al contenedor:
docker compose up --build --wait
```

## Monitor operativo

El workflow `monitor-production.yml` consulta `/api/salud` cada cinco minutos y envía alertas de caída y recuperación al email público `rodrigo.valdelvira@gmail.com`, usando la cuenta SMTP `rodr.valdelvira@gmail.com`. Evita repetir avisos durante una misma caída. Para activarlo en GitHub Actions debe configurarse `GMAIL_SMTP_APP_PASSWORD` como secreto; el workflow no está activo hasta que estos cambios estén en la rama predeterminada y ese secreto quede provisionado.

## Verificación

```bash
pnpm run check
pnpm run lint
pnpm run test:unit
pnpm run test:integration:contact
pnpm exec playwright test tests/e2e/portfolio-polish.spec.ts --project=chromium
```

Las pruebas SMTP usan transportes falsos: no envían mensajes. Las pruebas E2E compilan y arrancan el servidor de producción en un puerto separado. El PDF conserva los bytes del original y se comprueba tanto por HTTP como mediante una descarga desde el botón.

## Publicación y documentación

Consultar [revisión y pendientes operativos](docs/REVISION_PORTFOLIO.md). El titular aprobó las tres páginas legales y cerró la investigación D-06 con evidencia pública de Google y una asunción de riesgo menor registrada en `specs/002-contacto-operacion-cierre/human-decisions.md`. Por decisión del titular, la política no promete una eliminación a los 12 meses: declara que la aplicación no configura borrado automático en Gmail ni fija un plazo máximo concreto. La revisión del proxy quedó documentada; anotó que el driver Docker `json-file` de NPM carece de límites explícitos de tamaño/cantidad, como seguimiento de endurecimiento operativo. SMTP necesita la contraseña de aplicación en el servidor; no se ha realizado una entrega real ni un despliegue.

Toolkit IA permanece como «Próximamente»; Bitácora ya ofrece el artículo publicado. El artículo se conserva en su URL con `noindex`. Sitemap y llms.txt solo enlazan contenido indexable. Los datos estructurados describen el perfil, las páginas y las capacidades profesionales; no garantizan posicionamiento en buscadores o asistentes.

Las especificaciones históricas permanecen en `specs/`. El mockup y los golden son referencias y no se han alterado. `pnpm run test:visual` compara con ese diseño anterior; las diferencias solicitadas deben revisarse como una nueva revisión visual. `pnpm run release:check` mantiene sus condiciones de publicación y no debe interpretarse como superado por estas correcciones.

## Despliegue

El workflow `.github/workflows/deploy.yml` verifica el código, construye una imagen OCI para `linux/amd64`, la escanea y despliega su digest inmutable al servicio `app` de Hetzner. El usuario remoto `deploy` y su directorio de publicación ya están aprovisionados. Para activarlo faltan el token GHCR de solo lectura guardado una vez en el servidor, las variables de Actions `DEPLOY_HOST` y `SSH_FINGERPRINT`, y los secretos `DEPLOY_SSH_KEY` y `GMAIL_SMTP_APP_PASSWORD`. El workflow instala este último en `/srv/projects/portfolio/deploy/runtime.env` con permisos `0600`; el token GHCR no se reenvía desde Actions. Las instrucciones están en `scripts/deploy/`.

El despliegue comprueba salud y HTTPS desde fuera, conserva el Compose e imagen previos para rollback y restaura el servicio si falla una comprobación. D-06 está aprobado y el preflight legal pasa; aún no se ha ejecutado una publicación porque faltan las credenciales de Actions/GHCR y la entrega SMTP real.
