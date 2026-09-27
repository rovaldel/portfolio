# Feature Specification: Lógica del portfolio

**Feature Branch**: `[001-logica-del-portafolio]`

**Created**: 2026-09-25

**Status**: Draft — decisiones de producto resueltas; cierre de 000 pendiente antes de implementar

**Input**: User description: `docs/servilletas/010-logica-del-portafolio.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar el portfolio con preguntas (Priority: P1)

Como visitante, quiero escribir una pregunta sobre Rodrigo y recibir una respuesta aprobada o una indicación honesta de que no se reconoce, para encontrar información sin conocer de antemano la estructura del portfolio.

**Why this priority**: Permite descubrir la información desde la portada y es el principal comportamiento nuevo de esta rebanada.

**Independent Test**: Enviar consultas conocidas de las categorías publicadas y una consulta desconocida; comprobar respuesta, enlace al detalle y ausencia de afirmaciones no aprobadas.

**Acceptance Scenarios**:

1. **Given** una consulta que corresponde a una intención publicada, **When** la persona la envía, **Then** recibe una respuesta basada en contenido aprobado y un enlace a la página completa correspondiente.
2. **Given** una consulta sin intención reconocida, **When** la persona la envía, **Then** el portfolio reconoce que no encuentra una respuesta y ofrece destinos existentes sin inventar información.
3. **Given** una consulta vacía o compuesta solo por espacios, **When** la persona intenta enviarla, **Then** no se añade ningún mensaje.
4. **Given** texto con diferencias de mayúsculas, acentos o espacios, **When** expresa una intención publicada, **Then** se reconoce de acuerdo con la normalización acordada.
5. **Given** una consulta con dos o más destinos plausibles, **When** la persona la envía, **Then** el portfolio pide que aclare el destino antes de presentar una respuesta.

### User Story 2 - Navegar por rutas públicas estables (Priority: P1)

Como visitante, quiero abrir una sección completa mediante su ruta y continuar con atrás, adelante o recarga, para consultar y compartir destinos reconocibles.

**Why this priority**: La conversación complementa las páginas; cada sección debe seguir siendo accesible como destino normal.

**Independent Test**: Abrir directamente cada ruta publicada, navegar entre ellas, usar atrás y adelante y recargar; comprobar que se conserva una página legible en la dirección correspondiente.

**Acceptance Scenarios**:

1. **Given** una página del portfolio, **When** la persona sigue un enlace a otra sección, **Then** abre la ruta canónica de esa sección.
2. **Given** que la persona ha navegado entre secciones, **When** usa atrás, adelante o recarga, **Then** llega a un destino válido con contenido legible.
3. **Given** una visita sin JavaScript, **When** la persona abre una ruta pública, **Then** puede leer el contenido principal y seguir enlaces disponibles.

### User Story 3 - Encontrar y leer el artículo publicado (Priority: P2)

Como visitante, quiero filtrar la Bitácora y leer el artículo técnico completo disponible, para encontrar contenido relevante y saber que el título corresponde al texto.

**Why this priority**: Hace accesible el contenido editorial existente y permite conectar una lectura con la navegación del portfolio.

**Independent Test**: Abrir la Bitácora, aplicar filtros y abrir el artículo publicado; comprobar que el título y el cuerpo corresponden y que los cuatro registros incompletos no se publican.

**Acceptance Scenarios**:

1. **Given** la Bitácora, **When** la persona la consulta, **Then** solo se ofrece como publicado el artículo completo “Cómo evalué tres frameworks de agentes antes de elegir LangGraph”.
2. **Given** un filtro disponible, **When** la persona lo selecciona, **Then** cambia la lista visible y la acción puede realizarse con teclado.
3. **Given** el artículo publicado, **When** la persona activa “pregúntame sobre esto”, **Then** llega a la consulta relacionada con el artículo.
4. **Given** un filtro sin artículos, **When** la persona lo selecciona, **Then** se muestra un estado vacío accesible que explica que no hay resultados.

### User Story 4 - Encontrar información pública coherente (Priority: P2)

Como buscador o sistema de recuperación, quiero encontrar páginas públicas estables cuyos títulos, descripciones y contenido coincidan con lo visible, para poder citarlas con precisión.

**Why this priority**: Mejora el descubrimiento público sin crear hechos ni contenido especial distinto del que consulta una persona.

**Independent Test**: Revisar cada ruta publicada y sus referencias públicas; comprobar que sus datos coinciden con la página, que los destinos existen y que la política para rastreadores coincide con la decisión aprobada.

**Acceptance Scenarios**:

1. **Given** una ruta indexable, **When** un visitante o rastreador la abre, **Then** encuentra título, descripción, encabezado y contenido principal en español coherentes.
2. **Given** el mapa del sitio y las referencias públicas, **When** se siguen sus enlaces, **Then** cada uno apunta a una ruta canónica publicada y su contenido refleja la información visible.
3. **Given** la política pública para rastreadores, **When** se consulta, **Then** permite OAI-SearchBot para búsqueda/citación y bloquea GPTBot para entrenamiento.

### User Story 5 - Consultar con control y accesibilidad (Priority: P1)

Como visitante que usa teclado o prefiere movimiento reducido, quiero enviar consultas y leer respuestas sin perder el control del foco o del desplazamiento, para acceder al mismo contenido que el resto de visitantes.

**Why this priority**: Accesibilidad y contenido disponible sin depender de efectos son requisitos fundamentales del portfolio.

**Independent Test**: Completar consultas y filtros solo con teclado y con preferencia de movimiento reducido; comprobar foco visible, ausencia de desplazamiento inesperado y disponibilidad del texto completo.

**Acceptance Scenarios**:

1. **Given** el campo de consulta, **When** la persona pulsa Enter, **Then** envía la consulta; al pulsar Shift+Enter, inserta un salto de línea.
2. **Given** una respuesta que aparece progresivamente, **When** está activa la preferencia de movimiento reducido, **Then** se muestra completa sin escritura progresiva.
3. **Given** una nueva respuesta tras una acción de la persona, **When** el contenido se presenta, **Then** el foco no se roba y el desplazamiento no aparta la lectura de forma inesperada.

### Edge Cases

- La consulta admite hasta 300 caracteres; al alcanzar el límite se comunica de forma accesible y no se acepta contenido adicional.
- Consultas con coincidencias en más de una intención no seleccionan una respuesta por prioridad: se pide a la persona que aclare cuál de los destinos plausibles busca.
- El título y el cuerpo de un artículo deben coincidir; un artículo incompleto no se publica ni se incluye en referencias públicas.
- Al volver al inicio o recargar, el historial de conversación de la pestaña se descarta.
- La conversación no envía ni registra consultas; no hay historial entre visitas ni analítica de uso.
- Una visita sin conexión previa no tiene comportamiento offline especificado; no se presupone que el contenido esté disponible sin haber cargado el sitio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El portfolio DEBE reconocer las intenciones publicadas sobre Sobre mí, habilidades, servicios, proyectos, Leadia/voz, Nami, experiencia/CV, Cidatum, TalentTools/InclunIA, formación, idiomas, intereses, contacto y LangGraph/CrewAI/AutoGen/Bitácora, usando únicamente contenido aprobado.
- **FR-002**: Cada consulta reconocida DEBE ofrecer una respuesta aprobada y un enlace a la página completa que contiene el detalle.
- **FR-003**: Una consulta no reconocida DEBE indicar que no se encontró respuesta y ofrecer enlaces a destinos públicos existentes, sin generar afirmaciones nuevas.
- **FR-004**: El reconocimiento DEBE ignorar diferencias de mayúsculas, acentos y espacios repetidos sin alterar el significado de la consulta. Si una consulta coincide con más de una intención y hay dos o más destinos plausibles, el portfolio DEBE pedir una aclaración antes de responder.
- **FR-005**: El campo DEBE admitir hasta 300 caracteres, anunciar el límite de forma accesible, impedir caracteres por encima del máximo y no crear mensajes para entradas vacías.
- **FR-006**: Enter DEBE enviar una consulta y Shift+Enter DEBE insertar un salto de línea.
- **FR-007**: Las consultas y el historial DEBEN permanecer solo en la pestaña actual, no enviarse a servicios remotos ni registrarse, y descartarse al volver al inicio o recargar.
- **FR-008**: Las respuestas progresivas DEBEN conservar el texto final aprobado y presentar el contenido completo sin progresión cuando la persona prefiera movimiento reducido.
- **FR-009**: Los enlaces a Sobre mí, Habilidades, Servicios, Proyectos, Experiencia, Formación y Contacto DEBEN abrir sus rutas canónicas; atrás, adelante y recarga DEBEN dejar un destino navegable.
- **FR-010**: Las rutas públicas DEBEN permitir leer el contenido principal y seguir enlaces sin JavaScript.
- **FR-011**: La acción “pregúntame sobre esto” del artículo DEBE iniciar una consulta relacionada con la intención aprobada de ese artículo.
- **FR-012**: La Bitácora DEBE publicar solo el artículo completo “Cómo evalué tres frameworks de agentes antes de elegir LangGraph”; sus filtros DEBEN actualizar la lista y ser operables con teclado. Una categoría sin resultados muestra un estado vacío accesible.
- **FR-013**: Cada página indexable DEBE presentar título, descripción, URL canónica, encabezado principal y contenido principal en español, todos coherentes con el contenido visible y aprobado.
- **FR-014**: Las referencias públicas (datos estructurados, etiquetas para compartir, mapa del sitio, reglas de rastreo y `/llms.txt`) DEBEN derivarse del contenido publicado y enlazar solo páginas canónicas existentes.
- **FR-015**: La política de rastreo DEBE permitir OAI-SearchBot para búsqueda/citación y bloquear GPTBot para entrenamiento.
- **FR-016**: La conversación, los filtros y la navegación DEBEN ser operables con teclado, mostrar el foco y respetar la preferencia de movimiento reducido conforme a los criterios de accesibilidad del proyecto.
- **FR-017**: Los cambios de esta rebanada DEBEN conservar las superficies visuales aprobadas; la regresión se compara con el conjunto completo de escenas visuales de la spec 000.
- **FR-018**: La implementación DEBE comprobar reconocimiento y normalización de intenciones, navegación e historial, Bitácora y filtros, contenido disponible sin interacción, coherencia de referencias públicas, accesibilidad y regresión visual.

### Key Entities

- **Intención**: tema publicado que relaciona expresiones de consulta con una respuesta aprobada y una página de detalle.
- **Consulta**: texto de hasta 300 caracteres que una persona envía durante la pestaña actual; no se conserva ni transmite.
- **Página pública**: destino canónico con título, descripción, encabezado y contenido visible aprobado.
- **Artículo**: publicación de Bitácora con título, cuerpo completo, categoría y destino canónico.
- **Referencia pública**: dato o enlace destinado al descubrimiento y citación de páginas publicadas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de las intenciones publicadas incluidas en el alcance produce la respuesta aprobada y el enlace al detalle correspondiente.
- **SC-002**: El 100 % de consultas no reconocidas muestra el estado desconocido y al menos un destino público real, sin afirmaciones improvisadas.
- **SC-003**: El 100 % de las rutas indexables ofrece título, descripción, URL canónica, encabezado y contenido principal coherentes antes de cualquier interacción.
- **SC-004**: El 100 % de enlaces presentes en las referencias públicas lleva a páginas canónicas existentes; no se publican los cuatro artículos sin cuerpo completo.
- **SC-005**: El 100 % de los flujos principales de consulta, navegación y filtrado puede completarse con teclado, con foco perceptible y sin pérdida de contenido al usar movimiento reducido.
- **SC-006**: En todas las recargas y vueltas al inicio verificadas, la consulta anterior deja de estar visible y no aparece en solicitudes de red ni registros de la aplicación.
- **SC-007**: La suite completa de escenas visuales heredada de la spec 000 termina sin cambios de composición no aprobados.
- **SC-008**: La política publicada permite OAI-SearchBot para búsqueda/citación y bloquea GPTBot para entrenamiento.

## Assumptions

- La fuente de hechos y textos públicos es el contenido aprobado del proyecto; no se añadirán afirmaciones nuevas.
- Las rutas canónicas de las secciones se definen en el contenido y las especificaciones del proyecto; esta rebanada las enlaza y conserva.
- La experiencia es una conversación local y determinista, sin generación mediante modelos, envío remoto, cuentas, persistencia, analítica ni almacenamiento entre visitas.
- Solo hay un artículo con cuerpo completo disponible para publicar en la Bitácora; cuatro registros incompletos quedan fuera de los enlaces públicos y del índice.
- La suite visual de 000 y su estructura aprobada son dependencia de verificación. La spec 000 debe cerrarse antes de iniciar implementación de esta rebanada.
- No se define disponibilidad offline para una primera visita sin conexión.
- Las consultas ambiguas solicitan aclaración; los filtros vacíos muestran un estado vacío accesible; OAI-SearchBot está permitido para búsqueda/citación y GPTBot bloqueado para entrenamiento.
