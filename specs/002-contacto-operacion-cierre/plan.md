# Implementation Plan: Contacto, operación y cierre

**Branch**: 002-contacto-operacion-cierre | **Date**: 2026-09-25 | **Spec**: [spec.md](spec.md)

**Input**: specs/002-contacto-operacion-cierre/spec.md

## Summary

Completar el portfolio existente con envío real y efímero del formulario, páginas legales accesibles, publicación identificable y reversible, y expediente verificable de cierre. La implementación extiende Astro/TypeScript con Node standalone en la raíz, conserva HTML útil antes de JavaScript, integra SMTP en el mismo proceso y mantiene el contenedor e imagen únicos. Las ocho decisiones humanas y dependencias aún no cerradas siguen como puertas operativas; no se inventan valores ni se habilita producción.

## Technical Context

**Language/Version**: TypeScript estricto, Node.js 24.19.0, pnpm 12.3.0.

**Primary Dependencies**: Astro 7.3.2, @astrojs/node 11.1.0; componentes Astro y módulos DOM existentes; Vitest 5, Playwright 1.63 y axe-core ya configurados. El cliente SMTP queda sujeto a selección mínima y fijada tras confirmar proveedor.

**Storage**: Sin base de datos ni persistencia de consultas en la aplicación. Formulario en memoria durante la petición; limitación e idempotencia efímeras en proceso. Registros sin datos personales. Metadatos de despliegue en CI/operación y artefactos identificados por digest.

**Testing**: Vitest para validación, rate limit e idempotencia; Playwright para recorrido accesible y errores conservados; integración HTTP/SMTP simulada, privacidad de logs, contenedor y despliegue/rollback controlado. Suite visual completa heredada de 000 y puertas aplicables de 010; el cierre de 020 no suplanta evidencia pendiente de ellas.

**Target Platform**: Navegadores actuales; Node 24 sobre Linux/OCI, puerto 3000 detrás de HTTPS en Hetzner. Dominio canónico https://rodrigovaldelvira.com; www redirige al raíz, pendiente de verificar DNS/proxy efectivos.

**Project Type**: Aplicación Astro, proyecto y proceso únicos, páginas prerenderizadas y API dinámica.

**Performance Goals**: Contenido esencial disponible sin JavaScript; timeout SMTP finito; health check apto para sondeo sin revelar datos internos. La spec no fija latencia SMTP numérica.

**Constraints**: Una aplicación, proceso y contenedor; envío único sin respuesta automática, cola ni reintento indefinido; cero persistencia del mensaje; secretos fuera de cliente/Git/logs; CSP estricta; WCAG 2.2 AA; legales en borrador hasta aprobación; no publicar con puertas fallidas o pendientes. GHCR, datos Hetzner/SSH/DNS, SMTP, alertas, contenido autorizado, revisión legal, política bots y cierre 000/010 son decisiones humanas pendientes.

**Scale/Scope**: Rutas públicas actuales, formulario, 3 documentos legales, endpoint de envío y health, una instancia, una imagen versionada, 34 criterios y 3 revisiones humanas, más dependencias 000/010.

## Constitution Check

| Gate | Evidencia del enfoque | Estado |
|---|---|---|
| I. Veracidad | Publicar solo contenido aprobado; omitir canales pendientes; legales en borrador bloquean producción. | PASS condicionado a aprobación humana |
| II. Accesibilidad | HTML útil conservado; formulario con labels, errores asociados, foco/anuncio y alternativa email. | PASS sujeto a revisión WCAG 2.2 AA |
| III. Fidelidad | Suite completa de escenas heredadas; ningún golden se actualiza automáticamente. | PASS sujeto a evidencia pendiente de 000 |
| IV. Privacidad/seguridad | Límites, validación, origen, CRLF, honeypot, idempotencia, rate limit, SMTP TLS y logs redactados. | PASS sujeto a pruebas/revisión reforzada |
| V. Unidad/despliegue | Una app y artefacto OCI por digest, promoción serializada, health y rollback. | PASS sujeto a datos operativos aprobados |
| VI. Descubrimiento honesto | Datos derivados de fuente aprobada; política GPTBot/OAI-SearchBot pendiente. | PASS condicionado a decisión humana |
| Dependencias mínimas | Reutilizar contenedor/suites; justificar cualquier dependencia SMTP/operación. | PASS condicionado a revisión |

El diseño puede completarse sin inventar decisiones. Activar contacto y publicar requieren resolver los ocho pendientes de research.md, la aprobación legal y los cierres verificables de 000/010.

## Project Structure

Documentation: specs/002-contacto-operacion-cierre/{plan.md,research.md,data-model.md,quickstart.md,contracts/}

Source: src/content/site.ts (fuente aprobada), src/lib/ (validación/políticas), src/pages/contacto.astro, src/pages/{privacidad,cookies,terminos}.astro, src/pages/api/contacto.ts y src/pages/api/salud.ts. Reutilizar scripts/check-release-readiness.mjs, .github/workflows/, Dockerfile, compose.yaml y tests/{unit,integration,e2e,visual}/.

**Structure Decision**: Extender la aplicación Astro existente en la raíz y su file router. La lógica de contacto va en módulos pequeños de src/lib; las verificaciones se integran en suites actuales. No crear servicio, paquete ni base de datos adicional.

## Complexity Tracking

No hay violaciones constitucionales ni proyecto adicional. Cualquier dependencia SMTP debe justificarse por proveedor/transporte aprobado y fijarse al lockfile.

## Phase 0: Research Outcome

Las decisiones técnicas heredadas y patrones están en research.md. Decisiones humanas externas permanecen explícitas como bloqueos, no como supuestos técnicos.

## Phase 1: Design Outcome

- data-model.md: entidades temporales y evidencia sin persistencia de datos personales.
- contracts/contact.openapi.yaml: contrato HTTP del formulario.
- contracts/deployment.md: promoción, health y rollback.
- contracts/release-gates.md: bloqueo por criterios, aprobaciones y dependencias.
- quickstart.md: validación local/simulada.

### Post-design constitution re-check

Se mantienen los gates: el mensaje solo se envía tras validación, no se guarda ni registra; la experiencia pública sigue accesible; no se añaden procesos o almacenamiento; publicación/cierre fallan de forma cerrada ante pendientes. Evidencia visual, revisión legal y revisión accesible siguen pendientes. No se requiere Complexity Tracking.
