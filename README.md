# Portfolio de Rodrigo Valdelvira

Portfolio en Astro/TypeScript con navegación conversacional local, páginas accesibles sin JavaScript, cinco temas, CV descargable y contacto mediante Gmail SMTP. Dominio canónico: https://rodrigovaldelvira.com. Alojamiento previsto: VPS de Hetzner.

## Arranque

Requiere Node 24.19.0 y pnpm 12.3.0.

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

La aplicación utiliza `http://localhost:3000`. El explorador de preguntas funciona en el navegador, sin llamadas a un LLM ni almacenamiento de conversaciones. Las fuentes, imágenes y scripts son locales. Solo se guarda `rv_theme` cuando el visitante elige un tema.

## Contacto

En local, rellena `GMAIL_SMTP_APP_PASSWORD` en `.env` con una contraseña de aplicación de Google. `.env.example` solo es una plantilla sin secretos. No uses la contraseña normal ni guardes credenciales en el repositorio. El usuario, remitente y destino deben ser `rodrigo.valdelvira@gmail.com`.

El servidor envía por `smtp.gmail.com:465` con TLS, elimina espacios de formato de la contraseña de aplicación, usa el email del visitante como `Reply-To` y confirma únicamente la aceptación SMTP. El registro distingue configuración incompleta (`contact_delivery_unavailable`) de un rechazo o fallo SMTP (`contact_delivery_failed`); si hay código de error SMTP, lo registra sin incluir credenciales ni datos del formulario. Sin configuración válida muestra un error y el email alternativo. Incluye validación de origen y campos, límite de tamaño, honeypot, límite de frecuencia e identificador para evitar duplicados. Estos límites viven en memoria de una única instancia.

```bash
pnpm run build
pnpm run start
# Alternativa con las variables de .env transmitidas al contenedor:
docker compose up --build --wait
```

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

Consultar [revisión y pendientes operativos](docs/REVISION_PORTFOLIO.md). Los documentos legales describen el portfolio para empleo y siguen en borrador hasta verificar las condiciones de proveedores y la retención efectiva. SMTP necesita el secreto de servidor; no se ha realizado una entrega real ni un despliegue.

Toolkit IA y Bitácora aparecen como «Próximamente». El artículo previo se conserva en su URL con `noindex`. Sitemap y llms.txt solo enlazan contenido indexable. Los datos estructurados describen el perfil, las páginas y las capacidades profesionales; no garantizan posicionamiento en buscadores o asistentes.

Las especificaciones históricas permanecen en `specs/`. El mockup y los golden son referencias y no se han alterado. `pnpm run test:visual` compara con ese diseño anterior; las diferencias solicitadas deben revisarse como una nueva revisión visual. `pnpm run release:check` mantiene sus condiciones de publicación y no debe interpretarse como superado por estas correcciones.
