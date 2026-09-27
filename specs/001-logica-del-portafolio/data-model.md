# Data model: Lógica del portfolio

Los datos son contenido público inmutable en build y estado efímero en memoria del navegador. No se requiere almacenamiento persistente.

## Intención

Representa una clase de preguntas que puede responderse con hechos aprobados.

| Campo | Tipo | Regla |
|---|---|---|
| `id` | string | Identificador estable y único. |
| `phrases` | string[] | Expresiones de usuario; se comparan normalizadas, sin cambiar el texto original mostrado. |
| `response` | string | Texto aprobado, local y determinista; no contiene HTML arbitrario. |
| `destination` | string | Ruta canónica existente del detalle relacionado. |
| `contentRefs` | string[] | Referencias de procedencia a contenido aprobado. |

La selección devuelve exactamente una de estas decisiones: intención única, desconocida, o ambigua con los destinos candidatos. Una intención reconocida debe contener respuesta, procedencia y destino válido.

## Consulta

Entrada efímera enviada desde el campo local.

| Campo | Tipo | Regla |
|---|---|---|
| `text` | string | Máximo 300 caracteres; se rechaza/vacía tras normalizar espacios. No se envía ni persiste. |
| `normalizedText` | string | Forma solo de comparación: Unicode normalizado, minúsculas, sin diacríticos y espacios repetidos plegados. |
| `decision` | IntentMatch | Estado determinista: recognized, unknown o ambiguous. |

Las consultas y respuestas de la pestaña se descartan al volver al inicio o recargar.

## Página pública

Destino indexable servido por una ruta canónica.

| Campo | Tipo | Regla |
|---|---|---|
| `path` | string | Ruta local canónica existente en el catálogo de rutas. |
| `title` | string | Coherente con el título visible. |
| `description` | string | Descripción en español y derivada de contenido aprobado. |
| `canonicalUrl` | URL | Dominio canónico más `path`; no incluye query/hash. |
| `mainContent` | HTML prerenderizado | Contiene H1 único y contenido principal legible sin JavaScript. |
| `indexable` | boolean | Solo true para páginas públicas aprobadas; excluye borradores, API y CV según sus reglas. |

## Artículo

Proyección de la entrada Markdown completa de Bitácora.

| Campo | Tipo | Regla |
|---|---|---|
| `slug` | string | Único y estable. |
| `title` | string | Coincide con título visible y encabezado. |
| `body` | Markdown | Cuerpo completo; sin HTML arbitrario. |
| `category` | string | Categoría publicada utilizada por filtros. |
| `canonicalPath` | string | Ruta canónica correspondiente al slug. |
| `published` | boolean | Solo el artículo completo aprobado tiene true. |

La colección publicada alimenta índice, filtro, metadatos y referencias. Los cuatro registros incompletos quedan excluidos antes de renderizar.

## Referencia pública

Metadato o recurso de descubrimiento derivado de páginas indexables.

| Campo | Tipo | Regla |
|---|---|---|
| `kind` | `metadata \| json-ld \| open-graph \| sitemap \| robots \| llms` | Recurso público con formato específico. |
| `canonicalPaths` | string[] | Cada ruta existe, es canónica e indexable; no incluye borradores ni endpoints. |
| `sourceRefs` | string[] | Página o contenido aprobado del que deriva el dato. |

Sitemap, `/llms.txt`, JSON-LD y etiquetas sociales no deben anunciar recursos fuera del catálogo público.
