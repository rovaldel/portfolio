# Decisiones humanas de publicación

Registro de decisiones expresas del titular del portfolio. Actualizado el 2026-09-27. No contiene direcciones personales ni secretos; los valores aprobados permanecen en sus fuentes o en el almacén de secretos.

## D-01 — GHCR

**Estado**: aprobado. Paquete privado. El servidor conservará un token de solo lectura aprovisionado una vez; el workflow no lo reenviará en cada ejecución.

## D-02 — Hetzner

**Estado**: aprobado. Usuario dedicado `deploy`, clave exclusiva del workflow y validación mediante `SSH_FINGERPRINT`. `root@hetzner` queda para administración manual. Dominio canónico: `rodrigovaldelvira.com`.

## D-03 — SMTP

**Estado**: aprobado. Gmail SMTP con contraseña de aplicación guardada en el almacén de secretos, nunca en Git. Remitente y destinatario según la respuesta del titular. La credencial y la configuración de producción aún deben aprovisionarse.

## D-04 — Alertas

**Estado**: aprobado. No se necesita un buzón adicional: las alertas operativas se enviarán a `rodrigo.valdelvira@gmail.com`, el correo público de contacto. El monitor externo cada cinco minutos quedó implementado en `.github/workflows/monitor-production.yml`; requiere el secreto SMTP de Actions y una prueba de entrega; las alertas de fallo de entrega del formulario también siguen pendientes de instrumentar.

## D-05 — Contenido y canales públicos

**Estado**: aprobado por el titular. Se confirman los canales públicos, las menciones de clientes y proyectos y el dato cuantitativo que ya figuran en las fuentes del sitio. Referencias: `src/content/site.ts` y `content/es.json`.

## D-06 — Textos legales

**Estado**: aprobado por el titular el 2026-09-27. El titular aprobó el contenido de los tres textos y aceptó como válida la evidencia pública actual de Google sobre su marco general de transferencias internacionales. La investigación D-06 queda cerrada para publicación con esta asunción de riesgo menor: "se asume la validez del marco general de Google Ireland y DPF/SCCs para el tratamiento en el EEE, condicionado a que la cuenta de destino mantenga su operativa bajo los términos estándar del EEE". La política explica que Google puede tratar datos fuera del EEE y describe los marcos públicos aplicables.

El titular retiró el plazo fijo de 12 meses como condición de publicación porque no puede garantizarlo. La política declara que Gmail no tiene borrado automático configurado desde la aplicación y que no se fija un plazo máximo concreto; el titular puede eliminar mensajes manualmente cuando dejan de ser necesarios, sujeto al principio general de limitación del plazo de conservación.

La revisión de logs del proxy quedó hecha el 2026-09-27: el log de acceso recoge IP, URI, agente y referente; rota semanalmente y conserva cuatro archivos de acceso y diez de errores. El driver Docker del contenedor NPM es `json-file` sin límites explícitos de tamaño o cantidad; queda registrado como riesgo operativo aceptado y seguimiento de endurecimiento. Las tres páginas legales están en estado `approved`, con revisión final del titular fechada el 2026-09-27.
## D-07 — Rastreo

**Estado**: aprobado. Se permite OAI-Search y PerplexityBot; se bloquea GPTBot, conforme a `src/pages/robots.txt.ts`.

## D-08 — Excepción visual y de accesibilidad

**Estado**: excepción autorizada por el titular para continuar con la publicación aunque el contrato visual registre 19 de 19 escenas fallidas y la revisión humana de accesibilidad siga pendiente. La autorización extiende al despliegue el antecedente de `specs/000-esqueleto-visual-funcional/closure-decision.md`; no declara aprobado el contrato visual ni cierra la revisión de accesibilidad. No dispensa los demás gates técnicos, las condiciones legales ni el aprovisionamiento operativo. La excepción se revisará el 2026-10-27, 30 días después de su aprobación.

## Revisiones que siguen pendientes

- Privacidad y legal: aprobada el 2026-09-27 con evidencia pública de Google y la asunción de riesgo menor registrada en D-06. La política no promete un plazo fijo de borrado y declara que no hay eliminación automática configurada.
- Operación y recuperación: pendientes de aprovisionar y verificar el workflow, la cuenta `deploy`, el acceso privado a GHCR, las alertas y el rollback.
- Accesibilidad: revisión humana pendiente, bajo la excepción D-08.
