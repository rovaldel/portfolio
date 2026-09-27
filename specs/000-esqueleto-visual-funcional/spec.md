# Feature Specification: Esqueleto visual funcional

**Feature Branch**: `main` (no se ejecutó hook de creación de rama)

**Created**: 2026-09-10

**Status**: Cierre administrativo para permitir la secuencia de spec 001; no implica aprobación visual, accesible ni de publicación. Ver closure-decision.md.

**Input**: User description: [`docs/servilletas/000-esqueleto-visual-funcional.md`](../../docs/servilletas/000-esqueleto-visual-funcional.md)

## Clarifications

### Session 2026-09-11

- Q: Cuando una escena cambie por veracidad, accesibilidad o retirada funcional, ¿qué parte del mockup debe seguir siendo visualmente vinculante? → A: Todas las secciones y el mensaje inicial `¡Hola!` deben ser fieles; únicamente puede diferir la región estrictamente afectada por una excepción justificada.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprender el perfil y explorar el portfolio (Priority: P1)

Como visitante, quiero entender desde la portada quién es Rodrigo y recorrer su perfil, experiencia, habilidades, servicios, proyectos, formación y bitácora para valorar su encaje profesional y decidir si continúo hacia el contacto.

**Why this priority**: Es el valor principal del portfolio. Sin contenido profesional completo, veraz y navegable, el resto de la experiencia carece de utilidad.

**Independent Test**: Una persona que entra por primera vez puede identificar el rol de Rodrigo, abrir cualquier sección pública directamente o mediante la navegación, consultar Leadia y Nami, leer el único artículo publicado y descargar el currículum sin necesitar funciones posteriores.

**Acceptance Scenarios**:

1. **Given** una primera visita a la portada, **When** la página termina de presentarse, **Then** se muestran “Soy Rodrigo, AI Engineer”, una propuesta de valor veraz, el retrato y accesos operativos a Sobre mí, Proyectos, currículum, selector de tema, consulta y pie.
2. **Given** cualquier superficie pública, **When** la persona usa la navegación, el historial o recarga la dirección actual, **Then** conserva un destino comprensible con contenido propio y puede volver a la portada mediante el avatar o el nombre.
3. **Given** el índice de proyectos, **When** la persona revisa sus entradas, **Then** encuentra exactamente Leadia y Nami, accede a la superficie propia de cada uno, puede abrir el destino externo de Leadia y ve Nami como “En fase de diseño” sin enlace vacío.
4. **Given** el índice de Bitácora, **When** la persona lo consulta, **Then** aparece únicamente “Cómo evalué tres frameworks de agentes antes de elegir LangGraph” y su enlace permanente abre el artículo completo con metadatos coherentes.
5. **Given** cualquier acceso al currículum, **When** la persona lo activa, **Then** descarga el documento vigente con el nombre visible “Rodrigo-Valdelvira-CV.pdf” y texto seleccionable.

---

### User Story 2 - Acceder al contenido sin barreras (Priority: P1)

Como visitante con cualquier necesidad de acceso, quiero completar los recorridos con teclado, foco visible, ampliación, pantalla estrecha, tamaños de texto propios y movimiento reducido para no depender de una forma concreta de interacción.

**Why this priority**: El contenido accesible es una condición no negociable de la experiencia pública, no una mejora posterior.

**Independent Test**: Todos los destinos y acciones esenciales se recorren en una pantalla de 320 px, con ampliación al 200 %, solo con teclado y con movimiento reducido, sin pérdida de contenido ni controles inaccesibles.

**Acceptance Scenarios**:

1. **Given** una pantalla de 320 px o una ampliación al 200 %, **When** la persona recorre cualquier superficie, **Then** no encuentra desplazamiento horizontal, contenido tapado ni acciones esenciales fuera de alcance.
2. **Given** navegación solo con teclado, **When** la persona usa menús, selector de tema, expansiones, tarjetas y enlaces, **Then** el foco es visible, sigue un orden comprensible, no queda atrapado y vuelve al control de origen tras cerrar una capa.
3. **Given** una preferencia de movimiento reducido, **When** se presentan cambios o respuestas, **Then** desaparecen la escritura progresiva, la flotación, los pulsos y el desplazamiento suave sin ocultar información.
4. **Given** el uso de lector de pantalla, **When** la persona recorre una superficie, **Then** encuentra regiones, encabezados, nombres, estados y alternativas de imagen comprensibles, y ninguna información depende solo de color, posición, iconos o estrellas.

---

### User Story 3 - Elegir y conservar la apariencia (Priority: P2)

Como visitante, quiero elegir entre Claro, Oscuro, Cobalto, Rioja y Bosque y conservar la elección para leer el portfolio con la apariencia que prefiera.

**Why this priority**: La personalización forma parte de la identidad visual aprobada y mejora la comodidad de lectura, aunque el contenido sigue siendo útil sin ella.

**Independent Test**: Desde una primera visita en Rioja, la persona abre el selector, identifica los cinco temas y el activo, cambia a cualquiera, conserva la elección en una visita posterior cuando el dispositivo lo permite y cierra el selector con Escape o pulsando fuera.

**Acceptance Scenarios**:

1. **Given** una primera visita sin preferencia válida, **When** se muestra el portfolio, **Then** Rioja es el tema activo.
2. **Given** el selector abierto, **When** la persona revisa las opciones, **Then** ve el nombre y una muestra de los cinco temas, además de un estado perceptible y anunciable para el tema actual.
3. **Given** una selección válida, **When** la persona vuelve al portfolio en el mismo dispositivo, **Then** se aplica el tema elegido cuando la preferencia puede recordarse.
4. **Given** una preferencia dañada o imposible de recordar, **When** se inicia una visita, **Then** se utiliza Rioja sin error bloqueante y el selector continúa operativo.

---

### User Story 4 - Consultar servicios y llegar a contacto con expectativas honestas (Priority: P2)

Como posible cliente o responsable de selección, quiero comprender los servicios ofrecidos y llegar a canales de contacto aprobados para decidir cómo plantear una conversación, sin que el portfolio simule funciones todavía no disponibles.

**Why this priority**: Convierte la exploración profesional en una siguiente acción útil y protege la confianza al distinguir lo disponible de lo futuro.

**Independent Test**: La persona revisa los seis servicios, abre su detalle, llega a Contacto con el asunto correspondiente, encuentra únicamente canales aprobados y ve que el formulario todavía no envía, junto a una alternativa de correo real.

**Acceptance Scenarios**:

1. **Given** la superficie de Servicios, **When** la persona examina el catálogo, **Then** encuentra exactamente seis servicios con resumen, descripción completa y acceso a Contacto con el asunto adecuado ya elegido.
2. **Given** la superficie de Contacto en esta rebanada, **When** la persona intenta continuar, **Then** el formulario se presenta claramente como no disponible, no confirma un envío y ofrece un enlace de correo aprobado.
3. **Given** cualquier control visible, **When** la persona lo activa, **Then** cumple la acción rotulada o comunica inequívocamente que no está disponible; no aparecen micrófono, Toolkit, banner de cookies, etiquetas de demostración ni éxito simulado.

---

### User Story 5 - Aprobar una base visual reproducible (Priority: P3)

Como responsable del producto, quiero comparar cada escena pública con su referencia y revisar las excepciones justificadas para cerrar una base visual, veraz y accesible que las funcionalidades posteriores no puedan reinterpretar sin una decisión explícita.

**Why this priority**: La evidencia protege la identidad aprobada y permite distinguir una corrección necesaria de una regresión futura.

**Independent Test**: Las 19 escenas normativas producen referencia, candidata, diferencias y métricas reproducibles; cada escena supera su modo de comparación y Rodrigo puede revisar los resultados en escritorio y móvil.

**Acceptance Scenarios**:

1. **Given** las 19 escenas normativas, **When** se ejecuta la comparación completa, **Then** cada una conserva referencia, candidata, imagen de diferencias, métricas y versión del entorno de visualización.
2. **Given** cualquier escena o región sin excepción autorizada, **When** se compara con el golden, **Then** no supera el 0,5 % de píxeles por encima del umbral perceptual configurado y conserva la composición de todas sus secciones, incluido el mensaje inicial `¡Hola!` cuando corresponda.
3. **Given** una diferencia exigida por veracidad, accesibilidad, adaptación o retirada de funciones, **When** se revisa la escena, **Then** existe una excepción localizada con requisito de origen y evidencia antes/después; solo puede diferir la región estrictamente afectada, el resto continúa sujeto a comparación visual y sus anclajes principales no se desvían más de 2 px.
4. **Given** una escena fallida, **When** se calcula el resultado global, **Then** el cierre queda bloqueado aunque el promedio de las demás escenas sea aceptable.

### Edge Cases

- Si la preferencia visual está ausente, dañada o no puede recordarse, se usa Rioja sin bloquear la visita.
- Si una descripción, experiencia o artículo es extenso, se adapta sin truncar información esencial ni provocar desplazamiento horizontal.
- Si falta el retrato o una imagen de proyecto, se conserva el espacio previsto y aparece un reemplazo estable y comprensible sin salto de composición.
- Con pantalla estrecha, ampliación o teclado móvil abierto, la consulta persistente, el foco y la respuesta activa permanecen visibles y alcanzables.
- Con movimiento reducido o contraste reforzado, se elimina el movimiento no esencial y la información sigue sin depender del color o la animación.
- Con teclado solamente, las capas se cierran con Escape, no crean trampas y devuelven el foco al control que las abrió.
- Una dirección desconocida o un fallo inesperado conserva la identidad visual, oculta detalles internos y ofrece recuperación hacia Portada, Proyectos y Contacto.
- Si el currículum o un destino externo no está disponible, la superficie de origen conserva contenido útil, identifica el fallo y mantiene operativa la navegación restante.
- Sin conexión antes de la visita no se promete funcionamiento; las superficies ya recibidas no dependen de recursos de terceros para completar su presentación.
- Si la persona repite una acción o abandona durante una transición, no quedan animaciones, esperas o capas huérfanas y el nuevo destino sigue siendo utilizable.
- Un dato público pendiente de aprobación no se sustituye por una afirmación plausible: se retira de la presentación pública o se marca como contenido de trabajo fuera de publicación.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El portfolio DEBE ofrecer contenido propio y navegación real en `/`, `/sobre-mi`, `/habilidades`, `/servicios`, `/experiencia`, `/formacion`, `/proyectos`, `/proyectos/leadia`, `/proyectos/nami`, `/bitacora`, `/bitacora/langgraph-para-agentes-en-produccion`, `/contacto`, `/privacidad`, `/cookies` y `/terminos`, además de una recuperación útil para direcciones desconocidas.
- **FR-002**: La portada DEBE reproducir el mensaje inicial `¡Hola!` con la posición, tratamiento visual y relación espacial del golden, y mostrar el título “Soy Rodrigo, AI Engineer”, una propuesta que diferencie la experiencia profesional total de la experiencia en IA, el retrato y accesos operativos a Sobre mí, Proyectos, currículum, temas, consulta y pie.
- **FR-003**: Cada superficie interna DEBE permitir volver a la portada mediante el avatar o el nombre, y las variantes conocidas de una dirección DEBEN conducir de forma permanente a su versión canónica en minúsculas, con guiones y sin barra final salvo `/`.
- **FR-004**: Todas las superficies públicas relevantes DEBEN entregar encabezado y contenido principal útil en una visita directa aunque las mejoras de interacción estén desactivadas.
- **FR-005**: Las acciones principales DEBEN presentar estados conversacionales para Sobre mí, Habilidades, Servicios, Proyectos, Experiencia, Formación y Contacto sin interpretar texto libre ni convertirse en la única vía hacia ese contenido.
- **FR-006**: Una respuesta activa DEBE permanecer visible sin quedar tapada por la consulta persistente, y cualquier transición o espera DEBE cesar al abandonar la superficie.
- **FR-007**: El portfolio DEBE respetar la preferencia de movimiento reducido eliminando escritura progresiva, flotación, pulsos y desplazamiento suave sin retirar contenido.
- **FR-008**: El selector DEBE ofrecer exactamente Claro, Oscuro, Cobalto, Rioja y Bosque, mostrar nombre, muestra y estado actual, iniciar en Rioja, recordar una selección válida cuando sea posible y cerrarse con Escape o pulsación exterior.
- **FR-009**: Todas las secciones de cada superficie DEBEN reproducir la jerarquía, composición, tipografías, espaciado, tamaños, paleta, radios, bordes, sombras, iconografía, imágenes, tono editorial y patrón conversacional del golden; una similitud general no constituye fidelidad y solo pueden diferir las regiones cubiertas por excepciones exigidas, localizadas y registradas.
- **FR-010**: Todos los recorridos DEBEN conservar contenido y acciones esenciales desde 320 px hasta escritorio grande, con ampliación al 200 %, tamaños de texto propios y teclado móvil abierto, sin desplazamiento horizontal ni contenido tapado.
- **FR-011**: Todas las superficies DEBEN cumplir WCAG 2.2 AA en los cinco temas, incluidos estructura, encabezados, salto al contenido, orden y visibilidad del foco, nombres y estados anunciables, alternativas de texto, tamaño de controles, contraste y ausencia de información transmitida por un único recurso visual.
- **FR-012**: Habilidades DEBE presentar las competencias como listas agrupadas y ordenadas sin escala de estrellas ni otra puntuación subjetiva no confirmada.
- **FR-013**: Perfil, Experiencia y Formación DEBEN mantener legible la información esencial sin expansión y PUEDEN ofrecer detalles adicionales mediante controles accesibles.
- **FR-014**: Servicios DEBE mostrar exactamente seis entradas, cada una con resumen, descripción completa y acceso a Contacto con el asunto correspondiente preseleccionado en el dispositivo.
- **FR-015**: Contacto DEBE publicar el email `rodrigo.valdelvira@gmail.com`, el teléfono `+34 653 850 674`, el perfil `https://www.linkedin.com/in/rovaldel` y la ubicación “Logroño, La Rioja · remoto”.
- **FR-016**: Perfil y Experiencia DEBEN presentar a Rodrigo como Ingeniero de Inteligencia Artificial en Cidatum, en Logroño y modalidad presencial, desde diciembre de 2025 hasta la actualidad, y como disponible para nuevos proyectos en remoto. Formación DEBE publicar las seis entradas aprobadas: Especialista implantador ISO 42001 de AENOR (2026), Máster oficial en Big Data de UEMC (2020–2021), Goethe-Zertifikat B1 (2017), Cambridge Advanced C1 (2012), Ingeniería Industrial (2009–2011) e Ingeniería Técnica Industrial, especialidad Mecánica (2005–2009).
- **FR-017**: Experiencia DEBE publicar las menciones aprobadas a InclunIA/Fundación ONCE, Habla con InclunIA, Clara/UPSA, 2KBot y Dat4me, además del resultado aprobado de una reducción del 65 % en el tiempo de análisis de datos de talento.
- **FR-018**: Experiencia DEBE indicar que TalentTools finalizó en diciembre de 2025 y que Cidatum comenzó en diciembre de 2025; cualquier referencia a “15+ años” DEBE calificar la experiencia profesional total, nunca la experiencia en IA.
- **FR-019**: Proyectos DEBE mostrar exactamente Leadia y Nami; cada tarjeta DEBE abrir su superficie propia, Leadia DEBE ofrecer su destino externo, Nami DEBE figurar como “En fase de diseño” sin enlace vacío y el recorrido alternativo DEBE anunciar posición y ofrecer anterior/siguiente.
- **FR-020**: Un fallo de imagen DEBE conservar el espacio de retratos y proyectos y mostrar un reemplazo estable y comprensible.
- **FR-021**: Todos los accesos al currículum DEBEN descargar el mismo documento vigente con el nombre visible y estable “Rodrigo-Valdelvira-CV.pdf”; el texto del documento DEBE ser seleccionable y el archivo no DEBE presentarse como otra superficie indexable.
- **FR-022**: Bitácora DEBE mostrar únicamente “Cómo evalué tres frameworks de agentes antes de elegir LangGraph”, y su superficie DEBE incluir el cuerpo completo, título coincidente, autor, fechas, categoría, tiempo de lectura, jerarquía de encabezados y enlace permanente.
- **FR-023**: En esta rebanada, el formulario de Contacto DEBE mostrarse claramente como no disponible, ofrecer el enlace de correo aprobado y no simular envío, confirmación ni fallo operativo.
- **FR-024**: Privacidad, Cookies y Términos DEBEN tener destinos propios; mientras no exista aprobación jurídica, DEBEN identificar su contenido como borrador de trabajo y la publicación pública DEBE permanecer bloqueada.
- **FR-025**: La preferencia de tema DEBE ser el único dato recordado por esta rebanada; no DEBEN existir seguimiento, analítica, almacenamiento de conversaciones, recursos de terceros ni banner de cookies, y Cookies DEBE explicar el uso de esa preferencia.
- **FR-026**: Ningún control visible DEBE carecer de una acción coherente con su rótulo; micrófono, Toolkit, etiquetas de demostración y confirmaciones simuladas DEBEN permanecer ausentes.
- **FR-027**: Una dirección desconocida o un fallo inesperado DEBE conservar el sistema visual, no revelar detalles internos y ofrecer acceso a Portada, Proyectos y Contacto.
- **FR-028**: Cada una de las 19 escenas normativas DEBE conservar referencia, candidata, imagen de diferencias, métricas y versión del entorno de visualización; una escena fallida DEBE bloquear el cierre.
- **FR-029**: Toda escena o región sin excepción DEBE respetar el umbral visual del 0,5 %; una excepción por veracidad, accesibilidad, adaptación o retirada funcional DEBE indicar requisito de origen, región y estado afectados y evidencia antes/después, limitar a 2 px la desviación de anclajes reales y mantener bajo comparación visual el resto de la escena. Una excepción no puede eximir la pantalla completa ni aprobarse únicamente por la presencia de tokens, fuentes, bordes, sombras o activos.
- **FR-030**: Desde una copia limpia, una única instrucción documentada DEBE dejar el portfolio disponible localmente, comunicar positivamente su estado, funcionar sin servicio de correo mostrando la alternativa prevista y detenerse limpiamente sin pérdida de datos.
- **FR-031**: La documentación DEBE describir estado real, requisitos, configuración, arranque, parada, verificación de esta feature, solución de problemas y contratos todavía pendientes, sin anunciar como disponible un mandato o procedimiento inexistente.
- **FR-032**: Los activos visuales y tipografías necesarios para presentar las superficies DEBEN estar disponibles desde el propio producto, sin depender de recursos de terceros.
- **FR-033**: Una corrección de contenido o contraste DEBE aplicarse en su fuente aprobada compartida y quedar registrada; no se permiten correcciones aisladas para hacer pasar una escena.
- **FR-034**: Las comprobaciones de esta feature y del conjunto DEBEN fallar si incumplen cualquier criterio aplicable y DEBEN producir o enlazar la evidencia correspondiente.

### Business Rules

- **BR-001**: La veracidad, accesibilidad, adaptación, seguridad y retirada de funciones engañosas prevalecen sobre la reproducción literal del golden; fuera de esas excepciones, el golden gobierna la presentación.
- **BR-002**: Ninguna afirmación pública se publica sin aprobación y un mismo dato debe proceder de una única fuente aprobada.
- **BR-003**: El contenido esencial no puede depender de una interacción opcional, del puntero, de la voz, del arrastre, del movimiento ni de la ejecución de mejoras cliente.
- **BR-004**: El catálogo inicial contiene dos proyectos y la Bitácora un único artículo completo; no se inventan proyectos, artículos, enlaces ni estados.
- **BR-005**: Una excepción visual necesita una causa normativa y evidencia; regenerar una referencia para ocultar una diferencia no constituye validación.
- **BR-006**: La preferencia visual no justifica consentimiento ni seguimiento porque no existe almacenamiento no esencial en esta feature.

### Key Entities

- **Superficie pública**: Destino enlazable con dirección canónica, título, contenido principal, navegación y estado de indexación.
- **Perfil profesional**: Conjunto coherente de nombre público, rol, resumen, ubicación, disponibilidad, idiomas, experiencia, formación, habilidades y canales confirmados.
- **Tema visual**: Una de las cinco apariencias aprobadas, con nombre, muestra, estado activo y preferencia opcional recordable.
- **Servicio**: Oferta con título, resumen, descripción completa y asunto de contacto asociado.
- **Proyecto**: Caso público con título, estado, rol, descripción, imagen, posición en el catálogo y destino externo opcional confirmado.
- **Artículo**: Publicación completa con título, cuerpo, autor, fechas, categoría, tiempo de lectura y enlace permanente.
- **Escena normativa**: Estado visible definido por una referencia, condiciones de captura, candidata, diferencias, métricas y resultado.
- **Excepción visual**: Diferencia autorizada con causa, requisito de origen, estado afectado y evidencia antes/después.

### Scope Boundaries

**Included**:

- La presentación pública completa, sus rutas, contenido aprobado, cinco temas, navegación, estados conversacionales predeterminados, adaptación, accesibilidad, currículum, contacto no operativo, legales provisionales, errores y evidencia visual.
- El arranque y parada local reproducibles, la comunicación de salud y la documentación necesaria para verificar esta feature.

**Excluded**:

- Interpretación de texto libre, clasificación de intenciones, redacción de respuestas, respuesta desconocida, enlace de consultas con Bitácora y escritura progresiva de respuestas libres; corresponden a la spec 010.
- Envío real del formulario, validación de mensajes, protección contra abuso, correo, confirmación, fallos operativos y conservación temporal de intentos; corresponden a la spec 020.
- Publicación en producción, dominio, certificados, despliegue continuo, restauración, alertas y operación; corresponden a la spec 020.
- Descubrimiento para buscadores y agentes más allá de presentar contenido público útil: índice, mapa del sitio, metadatos enriquecidos y política de rastreo pertenecen a la spec 010.
- Cuentas, autenticación, base de datos, gestor editorial, analítica, seguimiento, conversación remota, almacenamiento de conversaciones, micrófono, voz, Toolkit y recursos cargados desde terceros.
- Proyectos distintos de Leadia y Nami, los cuatro artículos sin cuerpo completo, enlaces inventados y cualquier nombre, cifra, certificación o canal sin aprobación.
- Rediseñar el golden, sustituir activos normativos por aproximaciones o ampliar la v1 con una cuarta especificación sin un criterio de aceptación que lo obligue.

### Dependencies

- La [constitución del proyecto](../../.specify/memory/constitution.md) gobierna veracidad, accesibilidad, fidelidad, privacidad, seguridad y unidad del producto.
- La especificación maestra aporta el alcance y las correcciones normativas citadas por la servilleta.
- El golden funcional y sus 19 capturas aportan el comportamiento y la presentación de referencia.
- Las fuentes aprobadas de contenido y valores visuales, el currículum y los activos originales deben estar disponibles; sus ficheros protegidos no se modifican de forma aislada para acomodar el resultado.
- El email, teléfono, perfil de LinkedIn y ubicación aprobados deben mantenerse coherentes en todas las superficies donde aparezcan.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de las 15 superficies públicas enumeradas y la recuperación de dirección desconocida muestran encabezado, contenido principal útil y navegación operativa al abrirse directamente.
- **SC-002**: Al menos 4 de 5 visitantes de prueba identifican correctamente el rol de Rodrigo y localizan un proyecto, el currículum y una vía de contacto sin ayuda en menos de 3 minutos.
- **SC-003**: El 100 % de los recorridos esenciales se completa solo con teclado, con foco visible y sin trampas, y no se detectan problemas automáticos críticos o serios de accesibilidad.
- **SC-004**: Los cinco temas alcanzan contraste WCAG 2.2 AA para texto, iconos informativos, bordes de control y foco en todas las superficies representativas.
- **SC-005**: En 320 px, 390 × 844, escritorio grande y ampliación al 200 %, el 100 % de los recorridos se completa sin desplazamiento horizontal, contenido tapado ni acciones inaccesibles.
- **SC-006**: Las 19 escenas normativas superan individualmente su comparación: toda región no exceptuada, incluso dentro de una escena con excepción, no excede el 0,5 % acordado; las regiones exceptuadas mantienen anclajes reales dentro de 2 px y ninguna escena pasa solo por comprobar propiedades visuales genéricas.
- **SC-007**: El 100 % de las afirmaciones, canales, certificaciones, nombres de terceros y cifras visibles tiene aprobación trazable; se publica cero contenido pendiente o inventado.
- **SC-008**: El 100 % de los controles visibles realiza la acción rotulada o comunica inequívocamente su indisponibilidad; se muestran cero confirmaciones simuladas.
- **SC-009**: El 100 % de los accesos al currículum entrega el mismo documento vigente con el nombre “Rodrigo-Valdelvira-CV.pdf” y texto seleccionable.
- **SC-010**: Una persona con acceso a una copia limpia deja disponible el portfolio y confirma su estado con una sola instrucción documentada en menos de 10 minutos, sin credenciales de correo y sin pérdida de datos al detenerlo.
- **SC-011**: Rodrigo aprueba la fidelidad de todas las secciones y del mensaje inicial `¡Hola!` en las 19 escenas de 1440 × 900 y 390 × 844 tras revisar también 320 px y ampliación al 200 %; ninguna aprobación manual ni similitud general compensa una comparación fallida.
- **SC-012**: En una prueba sin mejoras de interacción, el 100 % de las superficies públicas conserva contenido esencial y destinos navegables.

## Assumptions

- Se adopta la recomendación conservadora de la servilleta para Habilidades: listas agrupadas y ordenadas sin estrellas hasta que exista una escala explicable y aprobada.
- Los textos de Privacidad, Cookies y Términos se pueden usar para cerrar la composición como borradores claramente marcados, pero no habilitan publicación pública hasta su aprobación jurídica.
- Rioja es el tema de primera visita y recordar esa preferencia visual no implica consentimiento porque no se incorpora seguimiento ni almacenamiento no esencial.
- El formulario real y sus estados operativos pertenecen a la spec 020; esta feature solo presenta su composición y una alternativa de correo confirmada.
- La navegación conversacional de esta feature se limita a acciones predeterminadas; la interpretación de consultas pertenece a la spec 010.
- La arquitectura y las medidas operativas deben respetar las decisiones de la constitución y de la especificación maestra durante la planificación, sin ampliar el alcance funcional descrito aquí.
