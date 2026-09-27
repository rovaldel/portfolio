# Servilleta: Lógica del portfolio · spec 010

> **Estado:** borrador para revisión humana. No ejecutar `/speckit-specify` hasta resolver las decisiones pendientes.

**Hito:** 2 · **Depende de:** `000-esqueleto-visual-funcional`, que debe estar cerrada antes de iniciar esta rebanada.

**Se valida viendo:** desde la portada, las consultas reconocidas muestran su respuesta aprobada y un enlace al contenido completo; las consultas no reconocidas ofrecen destinos reales; las rutas y el historial funcionan al navegar, volver y recargar; la Bitácora, sus filtros y el artículo muestran el contenido correcto; y cada página pública declara su información para buscadores y sistemas de recuperación.

## 0. Referencia normativa

- **Constitución:** `.specify/memory/constitution.md`, íntegra. En especial: el contenido público procede de fuentes aprobadas; el contenido se puede leer sin interacción; el chat es local, determinista y no persiste; accesibilidad WCAG 2.2 AA; descubrimiento citable coherente con lo visible.
- **Especificación maestra:** §§2–10, 17.1–17.4, 18.1, 18.3–18.4 y 18.6.
- **Golden master funcional:**
  - `portfolio#answerFor:1681` — respuestas y orden de reconocimiento de consultas del prototipo.
  - `portfolio#submit:1700` — envío de una consulta y selección de respuesta.
  - `portfolio#text:1701` — presentación progresiva de una respuesta de texto.
  - `portfolio#stream:1718` — avance progresivo de la respuesta.
  - `portfolio#openPostInChatFn:1768` — consulta sugerida desde el artículo de Bitácora.
- **Capturas normativas:** `portfolio/portada-rioja-desktop.png`, `portfolio/portada-rioja-mobile.png`, `portfolio/portada-claro-desktop.png`, `portfolio/portada-oscuro-desktop.png`, `portfolio/portada-cobalto-desktop.png`, `portfolio/portada-bosque-desktop.png`, `portfolio/selector-tema.png`, `portfolio/sobre-mi.png`, `portfolio/habilidades.png`, `portfolio/servicios.png`, `portfolio/servicio-detalle.png`, `portfolio/proyectos.png`, `portfolio/proyecto-leadia.png`, `portfolio/experiencia.png`, `portfolio/formacion.png`, `portfolio/contacto.png`, `portfolio/bitacora.png`, `portfolio/articulo-langgraph.png` y `portfolio/legal-privacidad.png`.
- **Inventario:** `design/behavior-inventory.md`, zona “spec 010”, confirma las cinco funciones y líneas citadas arriba.
- **Contenido y valores visuales:** `content/es.json` y `design/tokens.json`, generados desde las fuentes del prototipo y protegidos contra edición manual.
- **Decisiones y cierres previos:** no existe `docs/DECISIONES.md` ni `specs/000-esqueleto-visual-funcional/cierre.md`. El directorio de 000 contiene especificación, plan y tareas, pero no un cierre. Por tanto, no se atribuyen aprendizajes de implementación ni se considera satisfecha la dependencia.
- **Verificación de referencias:** `node design/scripts/check-refs.mjs` informa `36 referencias al golden verificadas`.

## 1. Objetivo y contexto de negocio

Completar el contenido y la navegación del portfolio para que quien lo visita pueda consultar la información de Rodrigo mediante las secciones normales o escribiendo una pregunta. Las respuestas deben corresponder a información aprobada y conducir a la página que contiene el detalle. Cuando la pregunta no tenga una respuesta prevista, el portfolio debe reconocerlo y ayudar a encontrar destinos disponibles.

La navegación debe conservar destinos comprensibles al avanzar, volver o recargar. La Bitácora debe mostrar el artículo completo disponible y permitir llegar a él desde una pregunta relacionada. Las páginas públicas también deben poder encontrarse y citarse con títulos, descripciones y datos que correspondan al contenido visible.

## 2. Usuarios

- **Cliente potencial:** quiere saber qué problemas puede resolver Rodrigo, revisar su experiencia y servicios y llegar a Contacto.
- **Responsable de selección:** quiere comprobar trayectoria, habilidades, idiomas, ubicación, disponibilidad y currículum.
- **Perfil técnico:** quiere revisar proyectos, decisiones de arquitectura y publicaciones.
- **Buscador o agente de recuperación:** necesita páginas públicas estables, completas y coherentes para encontrar y citar información.

## 3. Historias de usuario

- **HU1.** Como visitante, quiero escribir una pregunta sobre Rodrigo y recibir una respuesta aprobada o una indicación honesta de que no se reconoce, para encontrar la información sin tener que conocer de antemano la estructura del portfolio.
- **HU2.** Como visitante, quiero elegir una sección y abrir su página completa, para consultar los detalles y compartir un destino estable.
- **HU3.** Como visitante, quiero volver, avanzar o recargar después de abrir una sección, para continuar el recorrido sin quedar en una vista sin dirección reconocible.
- **HU4.** Como visitante, quiero filtrar la Bitácora y leer el artículo cuyo texto completo está disponible, para localizar contenido técnico y entender cuál artículo estoy leyendo.
- **HU5.** Como visitante con movimiento reducido o que no usa interacciones complejas, quiero leer el mismo contenido sin efectos progresivos ni desplazamientos inesperados, para mantener el control de la lectura.
- **HU6.** Como responsable del producto, quiero que buscadores y sistemas de recuperación encuentren páginas coherentes con lo que cualquier visitante puede leer, para que las referencias públicas sean precisas.

## 4. Requisitos funcionales

- **RF1. Intérprete de consultas.** Construir un conjunto determinista de intenciones a partir de §7.3 de la maestra y de `content/es.json`. Las respuestas se limitan al contenido aprobado; una intención sin coincidencia presenta el estado desconocido con destinos reales. Las consultas de §7.3 incluyen Sobre mí; habilidades; servicios; proyectos; Leadia/voz; Nami; experiencia/CV; Cidatum; TalentTools/InclunIA; formación; idiomas; intereses; contacto; y LangGraph/CrewAI/AutoGen/Bitácora.
- **RF2. Envío y respuesta.** Portar `portfolio#submit:1700` para la presentación de la consulta y su respuesta, ajustado a las reglas de negocio de §7.2. Aspecto conversacional en las capturas normativas de las respuestas correspondientes.
- **RF3. Resolución de respuestas.** Portar `portfolio#answerFor:1681` como referencia del comportamiento de intenciones del prototipo, corregido por el contenido, alcance y reglas vigentes de la maestra. La respuesta “madurez de IA” del prototipo no habilita el evaluador que la generaba: ese módulo queda fuera de v1.
- **RF4. Presentación progresiva.** Portar `portfolio#text:1701` y `portfolio#stream:1718` para la respuesta textual en curso. Respetar movimiento reducido según §7.2 y los criterios de §18.3; el texto final debe ser el mismo.
- **RF5. Consulta desde Bitácora.** Portar `portfolio#openPostInChatFn:1768` como referencia para la acción “pregúntame sobre esto”, encaminándola a la intención aprobada del artículo. Aspecto en `portfolio/articulo-langgraph.png` y `portfolio/bitacora.png`.
- **RF6. Navegación conversacional.** Los accesos a Sobre mí, Habilidades, Servicios, Proyectos, Experiencia, Formación y Contacto son enlaces a sus rutas canónicas. Con la mejora conversacional pueden presentar el resumen y actualizar la dirección; sin ella siguen abriendo su página. Back, forward y recarga mantienen un destino navegable.
- **RF7. Bitácora.** Mostrar únicamente artículos publicados con cuerpo completo. En v1 se muestra “Cómo evalué tres frameworks de agentes antes de elegir LangGraph”, con contenido que corresponda al título. El filtro actualiza la lista visible y tiene alternativa accesible. Los otros cuatro registros sin cuerpo quedan fuera de los enlaces públicos y del índice.
- **RF8. Datos de página.** Cada ruta indexable tiene título, descripción, dirección canónica, H1 y contenido principal en español. Los datos estructurados, etiquetas para compartir, mapa del sitio, reglas para rastreadores y `/llms.txt` proceden del mismo contenido público y enlazan solo a páginas canónicas existentes.
- **RF9. Política de rastreo.** Hacer accesible el contenido público a rastreadores legítimos de búsqueda/citación. La maestra propone permitir `OAI-SearchBot` y bloquear `GPTBot` por defecto, pero identifica esa política como pendiente de confirmación.
- **RF10. Regresión.** Volver a ejecutar el conjunto completo de escenas visuales de 000 y conservar la estructura visual cerrada por esa especificación. Esta spec añade contenido y comportamiento sin rediseñar las superficies.
- **RF11. Verificación.** Incluir comprobaciones para normalización y resolución de intenciones, navegación e historial, artículo y filtros, HTML disponible sin interacción, metadatos y coherencia de datos públicos, además de recorridos con y sin JavaScript y regresión visual, según §§17–18 y §19.3.

## 5. Reglas de negocio

- **RN1. La conversación no crea hechos.** Solo presenta información aprobada; una consulta desconocida ofrece destinos sin improvisar. **Ejemplo:** preguntar “¿Qué experiencia tienes con LangGraph?” puede llevar al artículo aprobado; preguntar por un tema sin respuesta prevista no produce una nueva afirmación.
- **RN2. La normalización no cambia el significado.** Se ignoran diferencias de mayúsculas, acentos y espacios al reconocer una intención. **Ejemplo:** “HABILIDADES”, “habilidades” y “habilidádes” (con acento compuesto) deben llegar al mismo destino si la intención está definida.
- **RN3. El límite de consulta es 300 caracteres.** Se indica de forma accesible al alcanzar el máximo. **Ejemplo:** una consulta de 300 caracteres se puede enviar; con 301 no se acepta contenido adicional.
- **RN4. Una consulta vacía no crea un mensaje.** **Ejemplo:** pulsar Enter con solo espacios no añade una intervención al historial.
- **RN5. Enter envía y Shift+Enter inserta un salto de línea.** **Ejemplo:** “¿Qué haces?” seguido de Enter se envía; Shift+Enter permite continuar la consulta en otra línea.
- **RN6. El historial solo dura en la pestaña actual.** Volver al inicio o recargar lo elimina; no se registra ni se envía por red. **Ejemplo:** después de preguntar por Leadia, recargar deja la portada en su estado inicial y la consulta no aparece en una petición de red.
- **RN7. El resumen conocido conduce al detalle completo.** **Ejemplo:** la intención sobre servicios presenta un resumen y el enlace “Ver página completa” lleva a `/servicios`.
- **RN8. Solo se publica el artículo completo disponible.** **Ejemplo:** la Bitácora presenta el artículo sobre la evaluación de CrewAI, AutoGen y LangGraph, y no presenta como artículo público los cuatro registros que solo tienen título y extracto.
- **RN9. El título y el cuerpo del artículo siempre coinciden.** **Ejemplo:** abrir la tarjeta de “Cómo evalué tres frameworks de agentes antes de elegir LangGraph” presenta ese cuerpo, no el de otro artículo.
- **RN10. El contenido indexable coincide con lo visible.** **Ejemplo:** si el artículo aparece en el mapa del sitio, su URL responde y muestra el mismo título y cuerpo accesibles desde la Bitácora.
- **RN11. La información esencial no depende de animación o interacción.** **Ejemplo:** con movimiento reducido la respuesta completa aparece sin escritura progresiva y el enlace al artículo sigue disponible.

## 6. Criterios de aceptación

- **CA1.** Sí/no: al escribir una consulta de una intención conocida se muestra una respuesta aprobada y un enlace visible a su página completa.
- **CA2.** Sí/no: una consulta que no corresponde a ninguna intención muestra el estado desconocido y destinos reales, sin respuesta improvisada.
- **CA3.** Sí/no: diferencias de mayúsculas, acentos y espacios no impiden reconocer las consultas incluidas en el contenido aprobado.
- **CA4.** Sí/no: consultas vacías no generan mensaje; una consulta de 300 caracteres se puede enviar y el límite se comunica al alcanzarlo.
- **CA5.** Sí/no: Enter envía una consulta y Shift+Enter agrega una línea sin enviarla.
- **CA6.** Sí/no: tras abrir una sección, atrás, adelante y recargar dejan una ruta con contenido legible y navegación real.
- **CA7.** Sí/no: sin JavaScript se puede abrir cada página canónica y leer su contenido principal.
- **CA8.** Sí/no: al preguntar por LangGraph se encuentra el artículo correspondiente, y el enlace “pregúntame sobre esto” desde ese artículo vuelve a la conversación con el asunto relacionado.
- **CA9.** Sí/no: la Bitácora muestra solo el artículo con texto completo, el filtro cambia las entradas visibles y el título del artículo coincide con el cuerpo abierto.
- **CA10.** *(prueba)* La consulta y el historial no se envían por red, no se registran ni sobreviven a volver al inicio o recargar.
- **CA11.** *(prueba)* Cada ruta indexable contiene en la respuesta inicial título, descripción, canónica, H1 y contenido principal coherentes, sin requerir interacción.
- **CA12.** *(prueba)* El mapa del sitio, los datos estructurados y `/llms.txt` enlazan solo destinos canónicos existentes y reflejan datos visibles.
- **CA13.** Sí/no: con movimiento reducido no hay escritura progresiva ni desplazamiento automático que quite el control; la respuesta completa y su enlace siguen disponibles.
- **CA14.** Sí/no: todas las acciones de la conversación, filtros y recorridos se pueden completar con teclado, con foco visible y estado perceptible.
- **CA15.** *(prueba)* La suite visual completa heredada de 000 se ejecuta y no registra cambios de composición no aprobados.
- **CA16.** *(prueba)* Se permite lectura pública a los rastreadores acordados y se aplica la decisión explícita sobre rastreo de entrenamiento.

## 7. Casos límite

- **Consulta vacía o con espacios:** no añade mensajes ni muestra una respuesta.
- **Consulta en el límite y sobre el límite:** 300 caracteres se admiten; cualquier exceso se impide y el límite se anuncia accesiblemente.
- **Mayúsculas, tildes y espacios repetidos:** la normalización conserva el reconocimiento previsto sin transformar el sentido de la consulta.
- **Intenciones que comparten términos:** se aplica un orden de resolución único y aprobado; la respuesta nunca combina afirmaciones por accidente. La precedencia exacta entre coincidencias solapadas está pendiente (P2).
- **Intención desconocida:** se muestran destinos reales y no aparece respuesta inventada.
- **Movimiento reducido:** no se usa escritura progresiva ni scroll automático; la respuesta final aparece completa.
- **Atrás/adelante, recarga o vuelta al inicio:** se conserva una URL válida y el historial conversacional se descarta conforme a §7.2.
- **JavaScript desactivado:** las páginas y enlaces canónicos siguen llevando al contenido completo.
- **Sin conexión o error de carga:** la conversación no tiene estado de error de red porque no consulta un servicio remoto; una ruta ya disponible conserva su contenido entregado. La estrategia para una visita sin conexión previa no está especificada.
- **Filtro sin resultados:** el comportamiento y el mensaje visible no están definidos en las fuentes consultadas (P3).
- **Artículo o metadato incompleto:** no se presenta como artículo publicado ni se incluye en el mapa del sitio.
- **Preferencia de rastreo no confirmada:** no se publica una política de entrenamiento deducida; requiere la decisión P1.

## 8. Fuera de alcance

- Generación de respuestas mediante modelos, llamadas de conversación a servidores, recuperación remota o almacenamiento de historial.
- Cuentas, área privada, memoria entre visitas, analítica o registro de consultas.
- Micrófono, transcripción de voz, evaluador de madurez, Toolkit, Deep Research, auditoría SEO/GEO, detector de datos sensibles y generador de políticas del prototipo.
- Publicar artículos que solo tengan título o extracto sin cuerpo revisado y completo.
- Añadir proyectos, hechos, credenciales, respuestas, páginas masivas o contenido para buscadores sin aprobación en las fuentes del proyecto.
- Envío del formulario y operación de contacto real, que corresponden a la spec 020.
- Rediseñar superficies, modificar la identidad visual, alterar el contenido aprobado o regenerar capturas para ocultar diferencias.
- Cambiar la política de entrenamiento sin resolver la decisión pendiente correspondiente.

## 9. Decisiones ya tomadas

- La conversación es una navegación determinista local sobre contenido cerrado. No usa modelo generativo, no envía consultas a servidor y no presenta respuestas inventadas.
- La interfaz se identifica como “navegación del portfolio” o “asistente del portfolio”; no como IA generativa. El indicador engañoso “razonando / recuperando contexto” se sustituye por una descripción veraz equivalente a “buscando en el portfolio”.
- Las rutas canónicas son el destino normal de las secciones. La conversación es una mejora progresiva y no la única forma de leer el contenido.
- Se admiten las intenciones mínimas enumeradas en §7.3 de la maestra; el contenido y los textos aprobados proceden de la fuente común.
- Se acepta consulta libre de hasta 300 caracteres; se normalizan mayúsculas, acentos y espacios; Enter envía y Shift+Enter agrega una línea.
- No se crean mensajes para consultas vacías. La respuesta conocida ofrece resumen y enlace “Ver página completa”; la desconocida reconoce el límite y ofrece destinos reales.
- El historial solo se mantiene en memoria de la pestaña y se descarta al volver al inicio o recargar. No se registra, transmite ni usa para analítica.
- El desplazamiento automático ocurre solo tras acción del usuario, respeta movimiento reducido y no toma el foco.
- Solo se publica en Bitácora el artículo completo “Cómo evalué tres frameworks de agentes antes de elegir LangGraph”; los otros cuatro metadatos no se publican.
- La salida pública de páginas indexables —título, descripción, canónica, contenido, datos estructurados, mapa, reglas de rastreo y `llms.txt`— debe corresponder al contenido visible y aprobado.
- Se vuelve a ejecutar la suite visual completa de 000. No se modifica el golden ni la presentación cerrada sin una decisión aprobada.

## Decisiones pendientes antes de `/speckit-specify`

Quedan **3 decisiones pendientes**:

1. **P1 — Política de rastreo para entrenamiento:** ¿se confirma bloquear `GPTBot` y permitir `OAI-SearchBot`, como propone §10.5 de la maestra? **Opciones:** confirmar el valor predeterminado, permitiendo búsqueda/citación sin autorizar entrenamiento; o definir otra política explícita, cambiando las reglas públicas para esos rastreadores. **Mi recomendación:** confirmar el valor predeterminado escrito en la maestra, porque separa descubrimiento de autorización de entrenamiento.
2. **P2 — Precedencia de intenciones solapadas:** cuando una consulta coincide con más de una intención, ¿qué respuesta prevalece? **Opciones:** declarar una precedencia fija basada en la lista ordenada de intents, lo que da resultado repetible; o pedir una frase aclaratoria, lo que evita elegir una intención ambigua. **Mi recomendación:** pedir aclaración solo cuando haya dos destinos plausibles; la lista de prioridades del prototipo contiene solapamientos y no basta para definir una respuesta inequívoca.
3. **P3 — Filtro de Bitácora vacío:** ¿qué debe ver quien aplica un filtro sin artículos publicados en esa categoría? **Opciones:** mostrar un estado vacío explicativo, que hace explícito el resultado; o mantener solo categorías con artículos, reduciendo la posibilidad de un filtro vacío. **Mi recomendación:** mostrar un estado vacío accesible si la categoría se ofrece como filtro, para que una acción válida nunca parezca rota.

## Diez preguntas de la guía §5

1. **¿El objetivo se entiende sin tecnología?** Sí: consultar información aprobada y llegar a su detalle mediante navegación normal o preguntas.
2. **¿Está claro quién lo usa y qué necesita?** Sí: clientes, responsables de selección, perfiles técnicos y buscadores/agentes de recuperación, con necesidades tomadas de §§2–3.
3. **¿Cada regla tiene un ejemplo concreto?** Sí: RN1–RN11 incluyen un caso concreto; el límite incluye valores numéricos.
4. **¿Cada criterio se responde sí/no con evidencia?** Sí: CA1–CA16 son verificables; CA10–12, 15–16 requieren pruebas y están marcados.
5. **¿Está separado el qué del cómo?** Sí en las secciones de negocio; las referencias de port conservan identificadores del golden donde la guía los exige.
6. **¿El fuera de alcance evita expansión?** Sí: excluye generación remota, módulos de demostración, persistencia, artículos incompletos, envío de contacto y rediseño.
7. **¿Incluye vacío, error, límites y recuperación?** Sí para entrada vacía, límite, intención desconocida, historial e interacción reducida; se marca pendiente el estado de filtro vacío y queda sin decidir el comportamiento de visita sin conexión previa.
8. **¿Queda alguna decisión que el agente tendría que adivinar?** Sí: tres, enumeradas P1–P3; deben resolverse antes de especificar.
9. **¿Todos los punteros pasan el verificador?** Sí: `node design/scripts/check-refs.mjs` reporta 36 referencias al golden verificadas.
10. **¿Otra persona construiría el mismo comportamiento?** Aún no del todo: al resolver precedencia de intenciones, estado vacío del filtro y rastreo, las decisiones quedan suficientemente explícitas; el cierre de 000 sigue siendo una dependencia obligatoria.

**Supuestos hechos:** ninguno añadido como regla de producto. El estado de filtro vacío y la precedencia se dejaron como decisiones pendientes. La estrategia sin conexión previa se señala como no especificada, sin imponer comportamiento.
