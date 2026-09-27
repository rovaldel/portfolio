# Quickstart: validar Contacto, operación y cierre

## Requisitos

- Node 24.19.0, Corepack/pnpm 12.3.0 y Docker Engine + Compose v2.
- Dependencias del lockfile y navegadores Playwright, siguiendo README.md.
- SMTP falso aislado para integración. No usar secretos productivos.
- Prueba real de despliegue requiere decisiones humanas resueltas y secretos/provisión fuera del repositorio.

## Validación local

1. Ejecutar pnpm install --frozen-lockfile y pnpm run assets:prepare.
2. Sin SMTP, iniciar pnpm run dev y abrir /contacto. Debe indicarse indisponibilidad sin éxito simulado y mantenerse canal alternativo.
3. Con SMTP falso, probar mensaje válido, rechazo, timeout, repetición inmediata, honeypot, exceso de intentos, origen inválido, CRLF, content type inesperado y cuerpo mayor de 8 KiB.
4. Verificar destinatario fijo, entrega única, éxito solo al aceptar el proveedor, error genérico y campos preservados. Revisar que logs de prueba no contengan datos personales, cuerpo, cabeceras completas ni secretos.
5. Abrir /privacidad, /cookies y /terminos directamente; verificar HTML útil, borrador visible, enlaces funcionales y ausencia de banner.
6. Ejecutar pnpm run check, lint, test:unit, test:e2e, test:visual, verify:spec:000, verify:spec:010 y la nueva puerta 020. Registrar resultados reales; los fallos heredados no se marcan como superados.
7. Con Docker Compose, comprobar /api/salud devuelve únicamente {"status":"ok"}, además de métodos y headers contractuales; bajar el servicio.

## Publicación simulada y cierre

- En entorno aislado usar dos imágenes por digest: una healthy y otra que falle health. Verificar serialización, metadatos, conservación y restauración del digest anterior, y fallo del job nuevo.
- Ejecutar la puerta de cierre con cada grupo pendiente; debe bloquear. Incorporar evidencia aprobada y verificar transición solo cuando todas las puertas aplicables pasan.
- No desplegar a producción hasta completar contracts/release-gates.md y resolver decisiones humanas.

## Resultado esperado

El flujo es reproducible; éxito solo sigue aceptación SMTP; los fallos conservan campos y no filtran detalles; health es mínimo; el fallo simulado revierte; publicación/cierre bloquean ante cualquier pendiente sin aprobación.


## Ejecución registrada (2026-09-25)

- `pnpm run check`: PASS.
- `pnpm run lint`: PASS.
- `pnpm run test:unit`: PASS, 12 archivos y 40 pruebas.
- `pnpm run format:check`: PASS tras aplicar formato a 14 archivos heredados que lo incumplían.
- `pnpm run build`: PASS.
- `pnpm run test:integration:contact`: PASS, 5 archivos y 10 pruebas.
- `pnpm exec playwright test tests/e2e/accessibility.spec.ts --project=chromium`: PASS, 25 pruebas.
- `pnpm run verify:spec:000`: FAIL en el E2E heredado (109 passed, 7 failed, 4 skipped); los fallos son el nombre de estado duplicado de Bitácora, canonical esperado contra `localhost` en vez del dominio configurado, nombre accesible de navegación y un timeout de Firefox en `/privacidad`. El detalle está en `artifacts/spec-000/verification-summary.json` y `test-results/`.
- Docker Compose: PASS. El primer puerto 3000 ya estaba ocupado; `PORT=4317 docker compose up --build --wait` quedó healthy, `GET /api/salud` devolvió `{"status":"ok"}` y el servicio se detuvo con `docker compose down`.
- `pnpm run verify:spec:020`: PASS como verificador de contrato; publicación/cierre siguen bloqueados con 50 pendientes registrados.
- `pnpm run test:visual`: FAIL en las 19 escenas heredadas. El informe completo, con golden/candidata/diff/métricas por escena, está en `artifacts/spec-000/visual-report.json`. No se actualizó ninguna referencia.
- No se ejecutó SMTP real, despliegue/rollback productivo ni cierre final: faltan decisiones operativas, aprobaciones humanas y evidencia de 000/010.
