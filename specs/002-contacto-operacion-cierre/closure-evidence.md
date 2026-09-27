# Expediente de cierre 020

El inventario machine-readable y el estado actual viven en [closure-evidence.json](closure-evidence.json). Contiene los 34 criterios `CA-01`–`CA-34`, las tres revisiones humanas, ocho decisiones, los cierres de 000/010 y el estado de aprobación de los tres documentos legales.

Los criterios técnicos siguen pendientes hasta que exista evidencia verificable; las decisiones y aprobaciones registradas no los superan por sí solas. D-08 consta como excepción limitada para el contrato visual (19/19 escenas fallidas) y la revisión de accesibilidad de spec 000, con revisión prevista para el 2026-10-27. La dependencia 000 queda exceptuada para despliegue, no declarada cerrada; spec 010 sigue pendiente.

Ejecuta `pnpm run release:check` para obtener el resumen JSON separado por evidencia técnica, revisiones/decisiones humanas, excepciones y riesgos. El despliegue permanece bloqueado mientras falten otros criterios, revisiones, condiciones legales o provisión operativa.
