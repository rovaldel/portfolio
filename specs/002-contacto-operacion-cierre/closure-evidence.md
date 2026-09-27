# Expediente de cierre 020

El inventario machine-readable y el estado actual viven en [closure-evidence.json](closure-evidence.json). Contiene los 34 criterios `CA-01`–`CA-34`, las tres revisiones humanas, ocho decisiones, los cierres de 000/010 y la aprobación de los tres documentos legales.

Los registros están en `pending` y sin referencia de evidencia hasta que una verificación o aprobación real se complete. La lista no declara ninguna aprobación por la mera existencia de código o contenido público. No se incluyen datos personales.

Ejecuta `pnpm run release:check` para obtener el resumen JSON separado por evidencia técnica, revisiones/decisiones humanas, excepciones y riesgos. El cierre y la publicación permanecen bloqueados si falta evidencia, hay fallos o siguen abiertas decisiones/dependencias.
