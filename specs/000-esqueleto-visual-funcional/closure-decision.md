# Decisión de cierre administrativo — spec 000

**Fecha de actualización**: 2026-09-25 14:20 UTC
**Autorización**: solicitud explícita del usuario en esta sesión.  
**Alcance**: permitir que spec 001 continúe sin el gate técnico heredado de spec 000.

## Estado registrado

Spec 000 queda cerrada administrativamente solo para desbloquear la secuencia de trabajo. Esta decisión no declara aprobados los criterios de aceptación ni la publicación, y no altera los resultados originales.

- La última ejecución de verify:spec:000 terminó en **fail**: formato, lint, tipos, unitarias, auditoría de producción, build, HTTP/E2E Chromium y Firefox, no-JS, movimiento reducido y contenedor pasaron; falló únicamente el contrato visual.
- El [informe visual](../../artifacts/spec-000/visual-report.json) registra **19 de 19 escenas fallidas**, con diferencias entre **1,521 % y 5,823 %**. El máximo contractual sigue siendo 0,5 % y no se modificó.
- La [revisión humana de accesibilidad](accessibility-review.md) continúa pendiente en teclado, lector de pantalla, zoom, contraste reforzado y teclado móvil.
- T070 permanece abierta. Tampoco se consideran completadas T071–T075 mientras la aceptación visual siga fallando.
- No se modificaron ni regeneraron los goldens ni se sobrescribieron umbrales. Las diferencias localizadas y las excepciones pendientes constan en [visual-exceptions.md](visual-exceptions.md).

## Excepción para spec 001

Por instrucción explícita del usuario, el bloqueo de entrada se considera dispensado administrativamente para iniciar la implementación de spec 001. Los riesgos visuales y de accesibilidad siguen abiertos y deben permanecer visibles en los reportes posteriores. Esta excepción no cuenta como pase de verify:spec:000 ni satisface los criterios visuales de spec 001.
