# Quickstart validation: Esqueleto visual funcional

Esta guía describe el estado esperado después de implementar la spec 000. Es una guía de arranque y validación, no código de implementación.

## Prerequisites

- Git.
- Node.js 24 LTS en la versión exacta declarada por el repositorio.
- Corepack/pnpm en la versión declarada por `packageManager`.
- Docker Engine y Docker Compose v2.
- Espacio para los navegadores fijados por Playwright.

No se necesitan SMTP, base de datos ni secretos. Las páginas legales continúan como borrador y no habilitan publicación pública.

## Native setup

Desde la raíz del repositorio:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium firefox
pnpm run verify:kit
```

Resultados esperados:

- el lockfile no cambia;
- las fuentes generadas coinciden con el golden;
- las referencias `portfolio#función:línea` siguen siendo válidas;
- ningún fichero protegido se reescribe para acomodar la aplicación.

## Run the application natively

```bash
pnpm run dev
```

Abrir `http://localhost:3000`. En otra terminal:

```bash
curl --fail --silent http://localhost:3000/api/salud
```

Resultado esperado: `{"status":"ok"}`. Detener el proceso con `Ctrl+C`; no queda estado de aplicación que conservar.

## Single-command Docker path

La instrucción reproducible exigida desde una copia limpia es:

```bash
docker compose up --build --wait
```

Después:

```bash
curl --fail --silent http://localhost:3000/api/salud
curl --fail --silent http://localhost:3000/
docker compose ps
docker compose down
```

Resultados esperados:

- el servicio queda `healthy` en `http://localhost:3000`;
- funciona sin variables SMTP y Contacto ofrece correo sin simular envío;
- hay un servicio, un proceso de aplicación y ningún volumen de datos;
- el contenedor usa usuario no root, filesystem de solo lectura y capacidades eliminadas;
- `docker compose down` termina limpiamente.

## Full feature verification

```bash
pnpm run verify:spec:000
```

El comando debe ejecutar, sin omisiones silenciosas:

1. fuentes/trazabilidad, formato, lint, `astro check`, unitarias y build limpio;
2. catálogo de rutas, HTML sin JavaScript, 308/404/500, activos, CV, salud y cabeceras sobre el build empaquetado;
3. recorridos Playwright en Chromium y Firefox, más proyectos sin JavaScript y con movimiento reducido;
4. axe en rutas, estados relevantes y cinco temas;
5. las 19 comparaciones visuales con evidencia conforme al esquema;
6. build, salud y endurecimiento real del contenedor.

Una puerta fallida produce código distinto de cero. El comando no actualiza las referencias golden.

## Scenario 1: direct and no-JavaScript navigation

Ejecutar el proyecto Playwright sin JavaScript o usar su filtro documentado:

```bash
pnpm exec playwright test --project=no-js-chromium
```

Comprobar:

- cada una de las 15 rutas de [contracts/http-routes.md](contracts/http-routes.md) responde 200 al abrirse directamente;
- existe `main`, un H1 y contenido propio útil;
- avatar/nombre, navegación y enlaces de contenido funcionan sin cliente;
- una ruta inexistente responde 404 y ofrece Portada, Proyectos y Contacto;
- una variante conocida redirige permanentemente a su versión canónica.

## Scenario 2: truthful catalogues and contact

```bash
pnpm exec playwright test tests/e2e/content-and-contact.spec.ts
```

Expected outcomes:

- Proyectos contiene solo Leadia y Nami; Leadia apunta a `https://leadia.es` y Nami no tiene CTA externo;
- Habilidades no contiene estrellas ni puntuaciones;
- Bitácora contiene solo el artículo LangGraph y el permalink abre su cuerpo completo;
- los seis servicios incluyen detalle y llegan a un asunto permitido en Contacto;
- Contacto muestra email/teléfono/LinkedIn/ubicación aprobados, declara el formulario no disponible y no emite `POST` ni éxito simulado;
- no aparecen micrófono, Toolkit, banner de cookies, etiquetas demo ni afirmaciones de indexación por agente.

## Scenario 3: themes, keyboard and motion

```bash
pnpm exec playwright test tests/e2e/theme-and-accessibility.spec.ts
pnpm exec playwright test --project=reduced-motion-chromium
```

Expected outcomes:

- Rioja es inicial; las cinco opciones tienen nombre, muestra y estado actual;
- una selección válida sobrevive a recarga y un valor corrupto cae a Rioja;
- Escape/exterior cierran la capa y devuelven el foco al disparador;
- Tab/Shift+Tab recorren acciones en orden, el foco es visible y no queda atrapado/tapado;
- con movimiento reducido desaparecen escritura progresiva, flotación, pulsos y scroll suave;
- axe no devuelve violaciones críticas o serias; resultados incompletos quedan adjuntos para revisión manual.

## Scenario 4: reflow and image fallback

```bash
pnpm exec playwright test tests/e2e/reflow-and-assets.spec.ts
```

Expected outcomes:

- a 320 px, 390 × 844 y zoom 200 % no hay overflow horizontal ni acciones inaccesibles;
- la consulta persistente y la respuesta activa permanecen alcanzables con viewport reducido;
- bloquear una imagen activa un reemplazo comprensible sin cambiar su caja;
- la página no solicita fuentes, scripts o imágenes a terceros.

La simulación real de teclado móvil y la lectura con VoiceOver/NVDA se registran como revisión humana; no se consideran demostradas solo por automatización.

## Scenario 5: CV and HTTP security

Con la aplicación empaquetada en ejecución:

```bash
curl --fail --head http://localhost:3000/Rodrigo-Valdelvira-CV.pdf
curl --fail --silent http://localhost:3000/Rodrigo-Valdelvira-CV.pdf --output /tmp/Rodrigo-Valdelvira-CV.pdf
```

Validar las cabeceras y el hash definidos en [contracts/http-routes.md](contracts/http-routes.md), así como texto seleccionable. Las pruebas de integración comprueban también CSP sin `unsafe-inline`/`unsafe-eval`, `nosniff`, políticas de permisos, aislamiento y protección contra framing.

## Scenario 6: visual contract

```bash
pnpm run test:visual
```

La ejecución debe producir:

```text
artifacts/spec-000/
├── environment.json
├── visual-report.json
├── playwright-report/
└── scenes/
    └── <scene-name>/
        ├── golden.png
        ├── candidate.png
        ├── diff.png
        └── metrics.json
```

Validar que:

- `visual-report.json` satisface [contracts/visual-evidence.schema.json](contracts/visual-evidence.schema.json);
- existen exactamente los 19 IDs declarados, sin duplicados;
- cada escena pasa individualmente;
- `pixel` respeta threshold 0,1 y ratio máximo 0,005;
- `contract` enlaza una excepción, mantiene propiedades normativas y limita cada anclaje a 2 CSS px;
- `habilidades` y `articulo-langgraph` constan como excepciones `contract` justificadas;
- navegador, SO, DPR, hashes, reloj, fuentes y bloqueo de red externa quedan registrados.

Solo para un cambio editorial aprobado existe un comando separado:

```bash
pnpm run visual:update
```

No se ejecuta en `verify:spec:000` ni en CI. Requiere revisar diff de configuración/referencias y registrar la decisión.

## Human acceptance

Tras pasar la automatización, Rodrigo revisa las 19 escenas en 1440 × 900 y 390 × 844, además de 320 px y zoom 200 %. También recorre teclado y al menos un lector de pantalla. La aprobación se adjunta a la evidencia; nunca compensa una escena fallida.

## Troubleshooting

- **Versión de navegador distinta**: reinstalar con el Playwright fijado; no aceptar una referencia nueva.
- **Fuentes no listas o diff inestable**: verificar WOFF2 locales, `document.fonts.ready`, imagen de ejecución y reloj congelado.
- **Tema vuelve a Rioja**: revisar que `rv_theme` sea uno de los cinco IDs y que el navegador permita `localStorage`; el sitio debe seguir operativo si lo bloquea.
- **Puerto 3000 ocupado**: detener el proceso conflictivo. El contrato canónico permanece en 3000.
- **Docker no queda healthy**: inspeccionar logs técnicos; no añadir datos personales ni secretos a la salida.
- **Legal bloquea publicación**: comportamiento esperado hasta revisión jurídica; no retirar la marca de borrador para hacer pasar una puerta.
