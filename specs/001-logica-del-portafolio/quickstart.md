# Quickstart validation: Lógica del portfolio

Guía de validación end-to-end para 001 una vez que la spec 000 esté formalmente cerrada y sus escenas visuales contractuales hayan pasado. Requiere Node/pnpm según versiones fijadas en el repositorio y navegadores de Playwright.

## Preparar

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox
```

## Validar

```bash
pnpm run verify:kit
pnpm run verify:spec:000
pnpm run verify:spec:010
```

`verify:spec:010` es la puerta integral definida por la spec maestra para esta rebanada. Debe comprobar reconocimiento de todas las intenciones, normalización, unknown/ambiguity, límite y privacidad de consulta; URLs e historial; filtros y artículo; HTML sin JavaScript; metadatos/JSON-LD/sitemap/robots/`llms.txt`; accesibilidad; y suite visual completa. La entrada a implementación requiere cierre de 000 antes de comenzar estos cambios; si 000 está pendiente, no se considera validada esta feature.

## Comprobaciones manuales

1. Iniciar con `pnpm run dev` y abrir `http://localhost:3000`.
2. Enviar una consulta conocida con acentos/capitalización distintos; confirmar la respuesta aprobada y ruta de detalle.
3. Enviar consulta desconocida, ambigua, vacía y una de 301 caracteres; revisar estados accesibles, aclaración, no-envío y límite.
4. Usar teclado: Enter, Shift+Enter, foco visible, filtros y navegación; repetir con `prefers-reduced-motion: reduce`.
5. Navegar a secciones, usar atrás/adelante, recargar y volver al inicio; verificar que la conversación se descarta al recargar/inicio.
6. Desactivar JavaScript y abrir directamente Sobre mí, Habilidades, Servicios, Proyectos, Experiencia, Formación, Contacto, Bitácora y artículo; comprobar lectura y enlaces.
7. Aplicar filtros sin resultados y verificar el mensaje de estado; confirmar que el índice solo publica el artículo completo.
8. Inspeccionar las referencias públicas y confirmar únicamente rutas canónicas existentes, con OAI-SearchBot permitido y GPTBot excluido.

El detalle de decisiones de datos está en [data-model.md](data-model.md); reglas observables están en [contracts/portfolio-interaction.md](contracts/portfolio-interaction.md).
