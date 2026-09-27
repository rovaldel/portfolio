# Revisión humana de accesibilidad — spec 000

La automatización cubre rutas, temas, landmarks, foco, reflow y las violaciones críticas o serias de axe. Esta hoja conserva la evidencia que no puede sustituirse por un barrido automático.

La ejecución automatizada de `verify:spec:000` deja su resultado y versiones en `artifacts/spec-000/verification-summary.json`; la evidencia visual enlazada es `artifacts/spec-000/visual-report.json`. Esos resultados no sustituyen las filas humanas siguientes.

| Revisión | Entorno | Criterio | Resultado | Evidencia/fecha |
|---|---|---|---|---|
| Teclado | Chromium, escritorio | Tab/Shift+Tab tiene orden comprensible, foco visible y Escape devuelve el foco | Pendiente de revisión humana | |
| Lector de pantalla | VoiceOver o NVDA | Landmarks, H1, selector, tarjetas, enlaces e imagen son anunciables | Pendiente de revisión humana | |
| Zoom | 200 %, 320 px y 390×844 | No hay overflow horizontal, contenido oculto o acciones inaccesibles | Pendiente de revisión humana | |
| Contraste reforzado | Navegador compatible | Texto, bordes y foco se distinguen en cinco temas | Pendiente de revisión humana | |
| Teclado móvil | Dispositivo físico | La consulta persistente y la respuesta activa permanecen alcanzables | Pendiente de revisión humana | |

No se considera aprobada la accesibilidad de publicación hasta adjuntar evidencia de estas revisiones. El estado legal de borrador también bloquea publicación pública independientemente de esta hoja.

**Automatización 2026-09-25**: [verification-summary.json](../../artifacts/spec-000/verification-summary.json) (2026-09-25T14:20:07.967Z) registra 11 puertas aprobadas y el contrato visual fallido. Chromium y Firefox completaron 118 pruebas con 4 omisiones previstas; no-JS, movimiento reducido y contenedor pasan. El [informe visual](../../artifacts/spec-000/visual-report.json) registra 19/19 escenas fallidas (1,521 %–5,823 %). Esta evidencia automatizada no completa ninguna fila humana de abajo.
