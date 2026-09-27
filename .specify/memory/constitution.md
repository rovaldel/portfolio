# Constitución del Portfolio de Rodrigo Valdelvira

## Principios fundamentales

### I. Veracidad pública (NO NEGOCIABLE)

- La especificación maestra y el contenido aprobado son la única fuente de afirmaciones públicas.
- No se inventan clientes, enlaces, credenciales, cifras, testimonios, fechas, disponibilidad ni estado de proyectos.
- “15+ años” describe experiencia profesional total, no experiencia en IA.
- TalentTools termina en diciembre de 2025 y Cidatum comienza en diciembre de 2025.
- Un proyecto sin URL no presenta un enlace vacío. Contenido sujeto a confidencialidad no se publica sin confirmación explícita.

### II. Contenido accesible antes que interacción (NO NEGOCIABLE)

- Las rutas públicas relevantes entregan HTML útil sin depender de JavaScript.
- La conversación, temas, filtros y transiciones son mejoras progresivas; nunca la única vía al contenido.
- Se cumple WCAG 2.2 AA: teclado, foco visible, landmarks, nombres accesibles, zoom/reflow, contraste y movimiento reducido.
- Ningún control visible carece de acción real. Una función no construida se elimina de la interfaz.

### III. Fidelidad mecánica al mockup

- `mockup/` es la referencia de solo lectura funcional y visual, no código de producción.
- Los comportamientos se citan como `portfolio#función:línea` y se verifican automáticamente.
- `design/tokens.json` y `content/es.json` se generan desde la configuración; no se editan a mano.
- Se portan jerarquía, temas, tono e identidad aprobados, corrigiendo las incompatibilidades de accesibilidad, responsive, SEO, seguridad o contenido documentadas en la maestra.
- Cambiar una decisión visual o editorial exige una spec o decisión registrada.

### IV. Privacidad y seguridad proporcionales (NO NEGOCIABLE)

- Baseline: OWASP Top 10:2025 y ASVS 5.0.0 nivel 1, conforme a `compliance/BASELINE_OWASP.md`.
- No hay cuentas, base de datos, LLM remoto, analítica ni almacenamiento de conversación en v1.
- La conversación determinista y las preferencias operan localmente. El formulario es la única frontera de datos personales y no se persiste en la aplicación.
- Toda entrada se valida y limita; el contenido se codifica por contexto; Markdown no admite HTML arbitrario; se rechaza inyección CRLF.
- Secretos SMTP y de despliegue permanecen fuera de cliente, Git, logs y artefactos. Logs sin cuerpo del mensaje ni datos personales.
- Dependencias y Actions mínimas, revisadas, fijadas y escaneadas. Revisión humana reforzada en contacto, cabeceras, contenedor y despliegue.

### V. Una aplicación, un artefacto, un despliegue recuperable

- La v1 es una sola aplicación TypeScript, un proceso y un contenedor; sin monorepo, microservicios, base de datos, CMS, cola, Redis, Kubernetes o Terraform.
- Docker local y producción promocionan la misma imagen, configurada externamente y ejecutada sin root.
- Producción vive en el servidor `hetzner`, detrás de HTTPS, en `https://rodrigovaldelvira.com`; `www` redirige al dominio raíz.
- `deploy.yml` verifica antes de desplegar, identifica el artefacto por commit/digest, serializa producción, comprueba salud y restaura la versión previa si falla.

### VI. Descubrimiento citable y honesto

- Toda ruta indexable tiene title, description, canonical, H1 y contenido principal renderizado en servidor.
- Sitemap, robots, JSON-LD, Open Graph y `llms.txt` derivan de la misma fuente factual y solo publican URLs 200 canónicas.
- El marcado estructurado coincide con contenido visible. No hay páginas masivas, texto oculto, keyword stuffing ni afirmaciones creadas para buscadores o LLM.
- Se permite rastreo de búsqueda pública conforme a la maestra y se separa de la autorización de entrenamiento.

## Restricciones y calidad

- Arquitectura concreta: se decide en el plan de spec 000 entre las alternativas acotadas por la maestra; no se abre una tercera sin bloqueo demostrado.
- Rebanadas verticales: máximo las tres specs maestras (`000`, `010`, `020`) salvo criterio de aceptación que obligue a dividir.
- Cada tarea entrega un resultado verificable e integra pruebas, accesibilidad, seguridad, SEO y documentación aplicables.
- Ficheros protegidos: esta constitución, `compliance/**`, `mockup/**`, `design/tokens.json`, `content/es.json` y decisiones registradas.
- Puertas bloqueantes al existir aplicación: formato/lint, tipos, pruebas, auditoría de dependencias, Gitleaks, CodeQL, build, accesibilidad, cabeceras/CSP, Trivy, usuario no root y pruebas de despliegue/rollback.
- No se introduce una dependencia sin necesidad trazable y alternativa más simple descartada.

## Gobernanza

Esta constitución prevalece sobre preferencias de implementación. Toda enmienda registra motivo, impacto, fecha y specs afectadas. Una spec cerrada no se reescribe: otra la sustituye. Un conflicto real se eleva; no se resuelve inventando requisitos.

**Version:** 1.0.0 | **Ratified:** 2026-09-09 | **Last Amended:** 2026-09-09
