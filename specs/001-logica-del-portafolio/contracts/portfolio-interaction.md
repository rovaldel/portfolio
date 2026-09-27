# Contract: portfolio interactions

Este contrato describe el comportamiento público verificable de consulta, navegación y Bitácora. No define una API de servidor: la consulta se resuelve enteramente en el navegador.

## Consulta local

- Entrada: texto español de hasta 300 caracteres.
- Vacío o espacios: no crea mensaje ni modifica historial.
- Normalización para coincidencia: ignorar mayúsculas, diacríticos y espacios repetidos.
- Una intención: mostrar solo respuesta aprobada y enlace real a su canonical.
- Ninguna intención: comunicarlo honestamente y ofrecer enlaces existentes.
- Varias intenciones/destinos plausibles: pedir aclaración antes de responder.
- Enter envía; Shift+Enter inserta salto de línea.
- No hay fetch/XHR, telemetría, storage de conversación ni persistencia entre cargas.
- `prefers-reduced-motion: reduce` desactiva escritura progresiva; el contenido completo aparece de inmediato.
- Actualizar la respuesta no roba foco ni desplaza la lectura de forma inesperada.

## Navegación

- Toda acción de navegación tiene como base un enlace HTML a una ruta canónica.
- Las páginas directas, recarga, atrás y adelante resuelven destinos legibles.
- El contenido principal y enlaces permanecen disponibles sin JavaScript.
- La visita al inicio descarta el contexto conversacional efímero.

## Bitácora

- El índice solo enlaza el artículo completo “Cómo evalué tres frameworks de agentes antes de elegir LangGraph”.
- Filtros operables por teclado actualizan el conjunto de artículos visible.
- Un filtro sin resultados presenta un estado vacío con nombre/mensaje accesible.
- “Pregúntame sobre esto” inicia la intención aprobada relacionada con LangGraph/frameworks.

## Referencias públicas

- Cada página indexable ofrece title, description, canonical, H1 y cuerpo español coherentes antes de interacción.
- Sitemap, robots, JSON-LD, Open Graph y `/llms.txt` solo señalan destinos canónicos existentes y publicados.
- `OAI-SearchBot` queda permitido para búsqueda/citación; `GPTBot` queda bloqueado para entrenamiento.
- Ninguno de estos recursos incluye los cuatro registros incompletos de Bitácora.
