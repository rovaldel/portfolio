# Diferencias visuales y excepciones localizadas

**Revisión**: 2026-09-25. **Informe vigente**: [visual-report.json](../../artifacts/spec-000/visual-report.json).

El contrato sigue usando un máximo de **0,5 % de píxeles cambiados** y **2 px de diferencia en anclas**. No se cambió la configuración ni se actualizaron los goldens. Las excepciones siguientes solo excluyen la región indicada y están pendientes de revisión humana; ninguna escena contractual queda aprobada por existir una excepción.

## Excepciones registradas

| Escena | Diferencia permitida | Resultado medido | Estado |
|---|---|---:|---|
| Habilidades | Se retira la columna de puntuaciones subjetivas en estrellas. Solo se excluye esa columna. | 2,481 %; el ancla del grupo Backend difiere 63,859 px, frente al máximo de 2 px. | Pendiente de revisión humana; falla |
| Artículo LangGraph | Se retira la etiqueta que afirmaba indexación automatizada. Solo se excluye esa etiqueta. | 5,823 %; las tres anclas cumplen el límite de 2 px. | Pendiente de revisión humana; falla |

Las coordenadas, evidencia antes/después y selectores están definidos en [exceptions.ts](../../tests/visual/exceptions.ts). Las regiones excluidas no cubren los anclajes ni el contenido restante.

## Diferencias de contenido que se conservan

Estas decisiones protegen la veracidad o la publicación aprobada. No son excepciones del comparador y no reducen el área medida:

- **Sobre mí** muestra el puesto vigente en Cidatum desde diciembre de 2025. La localización general de perfil sigue con aprobación pendiente; por eso no se publica la afirmación de ubicación del golden. Idiomas e intereses se conservan en la fuente de perfil.
- **Contacto** no publica email, teléfono ni LinkedIn porque los tres canales tienen aprobación pendiente. El formulario informa que no recibe mensajes.
- **Bitácora** publica solo el artículo completo aprobado; excluye registros incompletos de muestra.
- **Legales** mantiene los tres documentos como borradores de trabajo y fuera de indexación.
- El contenido no atribuye éxito de envío, proyectos, clientes ni disponibilidad de canales que no estén aprobados.

## Resultado visual por escena

El informe del 25-09-2026 registra 19 de 19 escenas fallidas. Las ratios de píxeles cambiados son:

| Escena | Diferencia |
|---|---:|
| Portada Rioja escritorio | 1,654 % |
| Portada Rioja móvil | 4,408 % |
| Portada tema claro | 1,693 % |
| Portada tema oscuro | 1,531 % |
| Portada Cobalto | 1,521 % |
| Portada Bosque | 1,762 % |
| Selector de tema | 2,105 % |
| Sobre mí | 4,070 % |
| Habilidades | 2,481 % |
| Servicios | 3,279 % |
| Detalle de servicio | 2,578 % |
| Proyectos | 3,301 % |
| Leadia | 4,189 % |
| Experiencia | 3,727 % |
| Formación | 4,272 % |
| Contacto | 2,787 % |
| Bitácora | 4,830 % |
| Artículo LangGraph | 5,823 % |
| Privacidad | 3,890 % |

El mínimo supera el límite de 0,5 %. T070, T071–T075 y T033 permanecen abiertas; también faltan las revisiones humanas de [accessibility-review.md](accessibility-review.md). Esta hoja documenta el estado, no concede una dispensa de aceptación.
