# Servilleta: Esqueleto visual funcional · spec 000

> **Estado:** borrador para revisión humana. No ejecutar `/speckit-specify` hasta resolver las decisiones pendientes del final.

**Hito:** 1 · **Depende de:** ninguna especificación anterior; parte del kit preparado y de las fuentes normativas versionadas.

**Se valida viendo:** la portada y todas las superficies públicas de la v1, recorridas mediante navegación real en escritorio y móvil, con los cinco temas, contenido útil, controles operativos y un informe por cada escena que conserve referencia, candidata, diferencias y métricas.

## 0. Referencia normativa

- **Constitución:** `.specify/memory/constitution.md`, íntegra. Prevalecen en particular la veracidad pública, el contenido accesible antes que la interacción, la fidelidad mecánica al mockup, la privacidad proporcional y la entrega como una sola aplicación recuperable.
- **Especificación maestra:** §§0, 4–6, 8.1–8.5, 8.6–8.7 solo en su presentación, 9, 11.3, 12–13, 17.3–17.4, 18.1, 18.3, 18.5–18.6 y 21.
- **Golden master funcional:**
  - `portfolio#componentDidMount:1653` — detección de preferencia de movimiento y aparición del banner que esta especificación ordena retirar.
  - `portfolio#componentWillUnmount:1658` — cancelación de esperas y animaciones al abandonar la vista.
  - `portfolio#componentDidUpdate:1659` — colocación de la conversación en la respuesta más reciente.
  - `portfolio#pushUser:1665` — presentación de la acción elegida por la persona.
  - `portfolio#respondCard:1667` — espera y presentación de una tarjeta de respuesta.
  - `portfolio#handleAction:1675` — asociación entre las acciones principales y sus superficies.
  - `portfolio#renderVals:1904` — composición de mensajes, temas, tarjetas, expansiones, proyectos, artículos y diálogos del prototipo; solo se porta la parte incluida en esta servilleta.
- **Capturas normativas:** `portfolio/portada-rioja-desktop.png`, `portfolio/portada-rioja-mobile.png`, `portfolio/portada-claro-desktop.png`, `portfolio/portada-oscuro-desktop.png`, `portfolio/portada-cobalto-desktop.png`, `portfolio/portada-bosque-desktop.png`, `portfolio/selector-tema.png`, `portfolio/sobre-mi.png`, `portfolio/habilidades.png`, `portfolio/servicios.png`, `portfolio/servicio-detalle.png`, `portfolio/proyectos.png`, `portfolio/proyecto-leadia.png`, `portfolio/experiencia.png`, `portfolio/formacion.png`, `portfolio/contacto.png`, `portfolio/bitacora.png`, `portfolio/articulo-langgraph.png` y `portfolio/legal-privacidad.png`.
- **Contenido y valores visuales extraídos:** `content/es.json` y `design/tokens.json`. Son fuentes generadas y protegidas; cualquier corrección se hace en su origen y se regenera.
- **Estado anterior:** no existe `docs/DECISIONES.md` ni hay especificaciones cerradas con `cierre.md`; por tanto, no hay decisiones ni aprendizajes adicionales que puedan darse por aprobados.
- **Precedencia:** la constitución y la maestra corrigen al golden cuando exigen accesibilidad, veracidad, adaptación a pantalla, seguridad o retirada de funciones; fuera de esas excepciones, el golden decide la presentación.

## 1. Objetivo y contexto de negocio

Construir la presentación pública completa y definitiva del portfolio para que una persona pueda conocer a Rodrigo, revisar su trayectoria, habilidades, servicios, proyectos, formación y bitácora, descargar su currículum y llegar a los canales de contacto mediante recorridos reales.

Esta primera rebanada no es una portada aislada. Deja cerrados el lenguaje visual, la jerarquía, las rutas, el contenido visible y los estados de presentación que heredarán las siguientes funcionalidades sin rediseño. También produce una comparación reproducible de todas las escenas normativas para que cualquier diferencia futura sea detectable.

El valor comprobable es doble: el visitante ya puede consultar el portfolio de principio a fin, y el responsable del producto puede decidir con evidencia si la reproducción del golden es fiel, veraz y accesible.

## 2. Usuarios

- **Usuario directo:** cualquier persona que visite el portfolio para conocer el perfil profesional de Rodrigo, sus servicios, proyectos, experiencia, formación o publicaciones.
- **Necesidad y contexto:** debe encontrar contenido útil desde una visita directa, navegar entre superficies y entender qué acciones están realmente disponibles, tanto en escritorio como en móvil.
- **Conocimiento que no se le puede exigir:** no necesita conocer el patrón conversacional, usar arrastre, voz o puntero, ni saber que existen estados de presentación adicionales.
- **Necesidades de acceso:** debe poder completar los recorridos con teclado, foco visible, ampliación, pantalla estrecha, tamaños de texto propios y movimiento reducido.
- **Actor indirecto:** Rodrigo, como responsable del producto, necesita comparar cada escena con la referencia y aprobar las excepciones visibles antes del cierre.

## 3. Historias de usuario

- **HU1.** Como visitante, quiero comprender desde la portada quién es Rodrigo y acceder a su perfil, proyectos y currículum, para decidir si me interesa seguir explorando su trabajo.
- **HU2.** Como visitante, quiero recorrer directamente cada sección pública y volver atrás o recargar sin perderme, para consultar el contenido en el orden que prefiera.
- **HU3.** Como visitante, quiero elegir entre Claro, Oscuro, Cobalto, Rioja y Bosque y conservar mi elección, para leer el portfolio con la apariencia que prefiera.
- **HU4.** Como visitante con necesidades de acceso, quiero que todo el contenido y las acciones esenciales funcionen con teclado, ampliación, pantalla estrecha y movimiento reducido, para no depender de una forma concreta de interacción.
- **HU5.** Como responsable del producto, quiero comparar todas las escenas públicas con el golden y revisar cada excepción, para cerrar una base visual que las siguientes funcionalidades no puedan reinterpretar.

## 4. Requisitos funcionales

- **RF1. Superficies públicas.** La rebanada entrega `/`, `/sobre-mi`, `/habilidades`, `/servicios`, `/experiencia`, `/formacion`, `/proyectos`, `/proyectos/leadia`, `/proyectos/nami`, `/bitacora`, `/bitacora/langgraph-para-agentes-en-produccion`, `/contacto`, `/privacidad`, `/cookies`, `/terminos` y una página de error útil para rutas desconocidas. Todas tienen contenido propio, navegación real y una única cabecera principal visible.
- **RF2. Portada y navegación.** La portada muestra “Soy Rodrigo, AI Engineer”, una propuesta que no confunde experiencia profesional total con experiencia en IA, retrato, acceso primario a Sobre mí, acceso secundario a Proyectos, currículum, selector de tema, barra de consulta y pie. En rutas internas, avatar y nombre vuelven a `/`.
- **RF3. Estados conversacionales de presentación.** Portar `portfolio#pushUser:1665`, `portfolio#respondCard:1667` y `portfolio#handleAction:1675` para reproducir la transición visible desde las acciones principales hacia Sobre mí, Habilidades, Servicios, Proyectos, Experiencia, Formación y Contacto, sin anticipar la interpretación de consultas de la spec 010. Aspecto en `portfolio/sobre-mi.png`, `portfolio/habilidades.png`, `portfolio/servicios.png`, `portfolio/proyectos.png`, `portfolio/experiencia.png`, `portfolio/formacion.png` y `portfolio/contacto.png`.
- **RF4. Ciclo visible de la conversación.** Portar de `portfolio#componentDidMount:1653` únicamente el respeto a movimiento reducido; no portar la aparición del banner de cookies. Portar `portfolio#componentDidUpdate:1659` para mantener visible la respuesta activa sin que la barra persistente la tape, y `portfolio#componentWillUnmount:1658` para que no continúen esperas o animaciones al abandonar la superficie.
- **RF5. Composición del golden.** Portar de `portfolio#renderVals:1904` la composición incluida de temas, mensajes, tarjetas, expansiones, servicios, proyectos, artículo y presentación legal. No portar micrófono, banner de cookies, etiquetas de demostración, Toolkit ni éxito simulado del formulario. Los detalles que la maestra convierte en superficies enlazables se abren mediante su destino real; un diálogo puede existir solo como mejora cuando el mismo contenido siga disponible directamente.
- **RF6. Temas.** Ofrecer los cinco temas normativos, mostrar nombre, muestra y estado actual, iniciar en Rioja, recordar la selección y permitir cerrar el selector mediante Escape o pulsando fuera. Aspecto en las seis portadas y `portfolio/selector-tema.png`.
- **RF7. Contrato visual.** Reproducir la jerarquía, composición, tipografías, espaciado, tamaños, paleta, radios, bordes, sombras, iconografía, tratamiento de imágenes, personalidad editorial y patrón conversacional del golden. Los valores de los cinco temas proceden de `design/tokens.json`; una corrección de contraste se aplica al valor compartido y se registra como excepción.
- **RF8. Adaptación.** Mantener todos los recorridos desde 320 px hasta escritorio grande, con ampliación al 200 %, tamaños de texto propios y teclado móvil abierto. No hay desplazamiento horizontal, pérdida de acción esencial ni contenido tapado. Tarjetas y listados pasan a una columna cuando el contenido lo necesita.
- **RF9. Accesibilidad.** Cada superficie tiene estructura y encabezados comprensibles, salto al contenido, foco visible, orden de teclado, nombres y estados anunciables, texto alternativo, controles de tamaño suficiente, contraste AA en los cinco temas y ausencia de información transmitida solo por color, posición, icono o estrellas.
- **RF10. Perfil, experiencia, habilidades, servicios y formación.** Mostrar el contenido estructurado aprobado. Experiencia y formación permiten ampliar detalles, pero mantienen legible lo esencial sin expansión. Los seis servicios muestran resumen, descripción completa y acceso a contacto con el asunto correspondiente ya elegido en el dispositivo.

  ⚠️ **DECISIÓN PENDIENTE P1 — ¿Se conserva la escala visual de una a cinco estrellas en Habilidades?**
  **Opciones:** conservarla, añadiendo una alternativa textual comprensible y dejando claro que no es una certificación; o sustituirla por listas ordenadas sin puntuación, lo que evita una valoración subjetiva no confirmada.
  **Mi recomendación:** sustituirla por listas sin puntuación hasta que Rodrigo confirme que la escala aporta valor y puede explicar qué significa cada nivel.

- **RF11. Proyectos.** Mostrar exactamente Leadia y Nami. Cada tarjeta llega a su superficie propia; Leadia ofrece su enlace externo seguro y Nami muestra “En fase de diseño” sin enlace vacío. El recorrido alternativo anuncia “Proyecto 1 de 2” o “Proyecto 2 de 2”, ofrece anterior/siguiente y nunca es la única vía. Un fallo de imagen conserva el espacio y muestra un reemplazo estable.
- **RF12. Currículum.** Todos los accesos descargan el fichero vigente con el nombre visible y estable “Rodrigo-Valdelvira-CV.pdf”. El documento mantiene su texto seleccionable y no se presenta como otra página indexable del portfolio.
- **RF13. Bitácora.** El índice muestra únicamente “Cómo evalué tres frameworks de agentes antes de elegir LangGraph”, con el cuerpo completo del golden, su título coincidente, autor, fechas, categoría, tiempo de lectura, jerarquía de encabezados y enlace permanente. Los otros cuatro registros no aparecen en navegación pública.
- **RF14. Contacto visible.** La superficie muestra los canales públicos aprobados y la presentación completa del formulario. En esta rebanada el envío aparece claramente no disponible y ofrece el enlace de correo; no existe confirmación simulada. El envío real y sus estados operativos pertenecen a la spec 020.

  ⚠️ **DECISIÓN PENDIENTE P2 — ¿Qué email, teléfono, URL de LinkedIn y ubicación se aprueban para publicación?**
  **Opciones:** confirmar expresamente los valores actuales del golden —teléfono `+34 653 850 674`, LinkedIn `in/rovaldel`, “Logroño, La Rioja · remoto”— y aportar el email que falta; o proporcionar sustituciones, lo que cambiará las escenas de Contacto, Perfil y Legal.
  **Mi recomendación:** confirmar o corregir el conjunto completo antes de `/speckit-specify`; ningún canal no confirmado debe quedar visible por herencia del mockup.

  ⚠️ **DECISIÓN PENDIENTE P3 — ¿Siguen vigentes para publicación el puesto actual en Cidatum, la disponibilidad declarada y las certificaciones mostradas?**
  **Opciones:** aprobar el estado y las certificaciones tal como quedan corregidos por la maestra; o entregar cambios concretos, que deberán aplicarse a Perfil, Experiencia y Formación antes de fijar el baseline visual.
  **Mi recomendación:** validarlos contra la situación real en la fecha de cierre de la spec 000, porque son afirmaciones públicas que pueden haber cambiado.

  ⚠️ **DECISIÓN PENDIENTE P4 — ¿Se autoriza publicar los nombres de clientes/proyectos y la cifra de reducción del 65 % incluidos en el contenido extraído?**
  **Opciones:** autorizar cada mención y la cifra; o retirar de las superficies públicas los elementos no autorizados, evitando revelar información confidencial y obligando a comparar esas escenas por contrato.
  **Mi recomendación:** exigir aprobación positiva elemento por elemento y retirar mientras tanto cualquier nombre o cifra que no la tenga.

- **RF15. Legal y errores.** Privacidad, Cookies y Términos son superficies enlazables. No hay banner de cookies; Cookies explica únicamente la preferencia visual guardada. La ruta desconocida y el error inesperado conservan el sistema visual, no muestran detalles internos y ofrecen regreso a Portada, Proyectos y Contacto.

  ⚠️ **DECISIÓN PENDIENTE P5 — ¿Qué texto legal se aprueba para Privacidad, Cookies y Términos?**
  **Opciones:** someter el borrador del golden a revisión y aprobar una versión final; o mantenerlo solo como contenido de trabajo inequívocamente marcado y bloquear cualquier publicación hasta sustituirlo.
  **Mi recomendación:** permitir que la spec 000 cierre la composición con contenido de trabajo claramente marcado, pero impedir la publicación hasta contar con aprobación jurídica sobre responsable, base legal, conservación y derechos.

- **RF16. Evidencia visual.** Cada una de las 19 escenas normativas produce referencia, candidata, imagen de diferencias, métricas y versión del navegador. Las escenas no exceptuadas se comparan píxel a píxel; las excepciones autorizadas comparan exactamente el sistema visual y limitan a 2 px la desviación de los anclajes principales.
- **RF17. Arranque local.** Desde una copia limpia, una única instrucción deja disponible el portfolio; funciona sin acceso al servicio de correo mostrando el estado no disponible, ofrece una comprobación de salud positiva y se detiene limpiamente sin pérdida de datos porque esta rebanada no los persiste.
- **RF18. Documentación.** El README describe el estado real, funcionamiento, requisitos, configuración, arranque, parada, verificación de esta spec, solución de problemas y los contratos todavía pendientes de publicación, comprobación posterior y recuperación. No anuncia como disponible ningún mandato o procedimiento todavía inexistente.

## 5. Reglas de negocio

- **RN1. La verdad prevalece sobre el golden.** Toda afirmación pública se corrige con la maestra y solo se publica si está aprobada. **Ejemplo:** TalentTools termina en diciembre de 2025 aunque el golden muestre “HOY”; Cidatum comienza en diciembre de 2025.
- **RN2. La experiencia total no se presenta como experiencia en IA.** **Ejemplo:** “15+ años de experiencia profesional” es válido; “15+ años de experiencia en IA” no lo es.
- **RN3. Un control visible siempre cumple su promesa.** Si una función todavía no existe, el control se retira o se presenta inequívocamente como no disponible. **Ejemplo:** en la spec 000 el formulario no responde “enviado” y ofrece correo, mientras que micrófono y Toolkit no aparecen.
- **RN4. Cada contenido tiene una sola fuente aprobada.** Un mismo dato no se corrige por separado en varias superficies. **Ejemplo:** la fecha final de TalentTools se cambia en la fuente común y aparece igual en Perfil, Experiencia y cualquier resumen posterior.
- **RN5. Las direcciones públicas son canónicas.** Se usan minúsculas, guiones y ausencia de barra final salvo en `/`; una variante conocida lleva permanentemente a la canónica. **Ejemplo:** `/Sobre-Mi/` lleva a `/sobre-mi`, y `www` conserva la ruta al llevar al dominio raíz.
- **RN6. El catálogo inicial contiene dos proyectos.** **Ejemplo:** “Proyecto 1 de 2” corresponde a Leadia y “Proyecto 2 de 2” a Nami; Nami muestra “En fase de diseño” y no un enlace vacío.
- **RN7. La Bitácora solo publica contenido completo.** **Ejemplo:** el índice público contiene un único artículo, “Cómo evalué tres frameworks de agentes antes de elegir LangGraph”; los otros cuatro metadatos no son tarjetas públicas.
- **RN8. Rioja es el punto de partida y hay cinco temas.** **Ejemplo:** una primera visita se ve en Rioja; si la persona elige Bosque, la siguiente visita comienza en Bosque cuando su preferencia puede recordarse.
- **RN9. La preferencia visual no justifica un banner de cookies.** **Ejemplo:** elegir Cobalto se explica en Cookies, pero no provoca una solicitud de consentimiento ni instala seguimiento.
- **RN10. El contenido esencial no depende de una interacción opcional.** **Ejemplo:** los datos básicos de una experiencia se leen antes de abrir sus detalles y `/proyectos/leadia` se visita directamente sin pasar por el carrusel.
- **RN11. La accesibilidad corrige el valor visual, no se parchea de forma aislada.** **Ejemplo:** si el texto atenuado de Rioja no alcanza contraste AA, se ajusta el valor Rioja compartido y se registra la excepción; no se cambia solo una tarjeta.
- **RN12. La fidelidad se decide escena a escena.** **Ejemplo:** una escena en modo píxel falla si más del 0,5 % supera el umbral configurado, aunque el promedio de las 19 escenas sea menor.
- **RN13. Las excepciones visibles necesitan causa y evidencia.** **Ejemplo:** `portfolio/legal-privacidad.png` puede diferir porque el contenido pasa a una superficie enlazable y el texto es provisional, pero el registro indica el requisito de origen y conserva el antes y el después.
- **RN14. El currículum tiene una única descarga estable.** **Ejemplo:** los accesos de Portada y Habilidades descargan `/Rodrigo-Valdelvira-CV.pdf` con el mismo nombre, no variantes distintas o enlaces rotos.
- **RN15. Los recursos visuales normativos no se sustituyen por aproximaciones.** **Ejemplo:** el retrato y `leadia.webp` parten de los activos del mockup; si una imagen falla se muestra el reemplazo previsto sin desplazar la tarjeta.

## 6. Criterios de aceptación

- **CA1.** Sí/no: al abrir `/` se ven el H1 “Soy Rodrigo, AI Engineer”, propuesta, retrato, accesos a Sobre mí y Proyectos, currículum, selector de tema, barra de consulta y pie, sin micrófono, Toolkit, banner de cookies ni etiqueta de demostración.
- **CA2.** Sí/no: desde la navegación real se alcanzan todas las superficies de RF1; volver, avanzar y recargar conservan un destino comprensible y ninguna pantalla queda vacía.
- **CA3.** Sí/no: avatar y nombre regresan a `/`; Leadia abre su destino externo; Nami no muestra enlace vacío; todos los demás controles visibles realizan la acción rotulada.
- **CA4.** Sí/no: las siete respuestas de presentación conservan la jerarquía y composición de sus capturas; Servicios y Leadia muestran además sus detalles completos.
- **CA5.** Sí/no: el selector ofrece Claro, Oscuro, Cobalto, Rioja y Bosque, señala el actual, se cierra con Escape y pulsación exterior y conserva la elección cuando el entorno lo permite.
- **CA6.** Sí/no: una primera visita usa Rioja; si la preferencia no se puede recordar, el portfolio sigue siendo utilizable y vuelve a Rioja sin mostrar un error bloqueante.
- **CA7.** Sí/no: a 390 × 844, 320 px, ampliación al 200 % y con teclado móvil abierto no hay desplazamiento horizontal, contenido tapado ni acción inaccesible.
- **CA8.** Sí/no: todos los recorridos se completan con teclado, el foco es siempre visible, el selector y los detalles cierran con Escape y el foco vuelve al control que los abrió.
- **CA9.** Sí/no: con movimiento reducido no hay escritura progresiva, flotación, pulsos ni desplazamiento suave, y ninguna información desaparece.
- **CA10.** Sí/no: Perfil y Experiencia dicen que TalentTools termina en diciembre de 2025; “15+ años” solo califica la experiencia profesional total.
- **CA11.** Sí/no: aparecen exactamente Leadia y Nami, y Bitácora muestra exactamente el único artículo con cuerpo completo y título coincidente.
- **CA12.** Sí/no: la superficie Contacto muestra los canales aprobados y un formulario claramente no disponible que ofrece el enlace de correo, sin confirmar un envío.
- **CA13.** Sí/no: Privacidad, Cookies y Términos tienen destino propio; una ruta desconocida muestra un error útil con accesos a Portada, Proyectos y Contacto.
- **CA14.** Sí/no: todos los accesos al currículum descargan el mismo documento con el nombre “Rodrigo-Valdelvira-CV.pdf”.
- **CA15.** *(prueba)* Los cinco temas alcanzan contraste AA para texto, iconos informativos, bordes y foco; la revisión automática no reporta impactos críticos o serios y se completa con teclado, lector de pantalla y móvil.
- **CA16.** *(prueba)* Cada una de las 19 escenas supera su modo de comparación, conserva golden, candidata, diferencias, métricas y versión del navegador, y una sola escena fallida bloquea el cierre.
- **CA17.** Sí/no: Rodrigo revisa y aprueba la presentación en 1440 × 900 y 390 × 844, además de comprobar 320 px y ampliación al 200 %; su revisión no sustituye una comparación fallida.
- **CA18.** *(prueba)* Las tipografías y los activos necesarios se sirven desde el propio sitio y ninguna captura necesita recursos de terceros.
- **CA19.** *(prueba)* Una visita directa a cada superficie pública recibe encabezado y contenido principal útil aun cuando las mejoras de interacción estén desactivadas.
- **CA20.** *(prueba)* Desde una copia limpia, la única instrucción documentada pone en marcha el portfolio, la comprobación de salud responde positivamente, la ausencia del servicio de correo se explica sin fingir éxito y la parada es limpia.
- **CA21.** *(prueba)* La entrega funciona sin privilegios elevados, no puede reescribir su propia instalación y mantiene una comprobación de salud positiva.
- **CA22.** *(prueba)* Cada respuesta pública cumple todas las medidas de protección enumeradas en §9; la comprobación falla si falta una o si se ha debilitado sin la excepción prevista.
- **CA23.** Sí/no: el README distingue lo disponible de lo pendiente, documenta también los contratos futuros de publicación, comprobación posterior y recuperación, y todos los mandatos que declara disponibles se ejecutan desde una copia limpia.
- **CA24.** *(prueba)* Existe una única comprobación automática de la spec 000 y otra global, ambas documentadas; fallan si falla cualquiera de sus criterios y producen o enlazan la evidencia correspondiente.

## 7. Casos límite

- **Primera visita o preferencia ausente:** se usa Rioja; el selector sigue mostrando los cinco temas y cuál está activo.
- **Preferencia dañada o imposible de recordar:** se ignora el valor desconocido, se usa Rioja y el resto del portfolio continúa disponible.
- **Contenido extenso:** la descripción de Nami, los detalles de servicio, la experiencia y el artículo se adaptan sin truncar información esencial ni provocar desplazamiento horizontal.
- **Imagen ausente o fallida:** proyecto y retrato mantienen dimensiones; aparece un reemplazo estable y comprensible sin salto de composición.
- **Pantalla estrecha, ampliación y teclado móvil:** a 320 px y 200 %, la barra de consulta, el foco y la respuesta activa permanecen alcanzables.
- **Movimiento o contraste reforzados:** desaparece el movimiento no esencial y la información no depende del color ni de la animación.
- **Teclado solamente:** selector, expansiones, tarjetas y navegación no crean trampas; Escape cierra la capa activa y devuelve el foco.
- **Ruta desconocida o fallo inesperado:** se conserva el sistema visual, no aparecen detalles internos y se ofrecen Portada, Proyectos y Contacto como recuperación.
- **Documento o destino externo no disponible:** el fallo no convierte la superficie de origen en una pantalla vacía; el enlace sigue siendo identificable y el resto de la navegación funciona.
- **Sin conexión antes de la visita:** no se promete uso sin conexión ni se simula contenido; las rutas ya recibidas no dependen de recursos de terceros para completar su presentación.
- **Acción repetida o abandono durante una espera:** no quedan animaciones activas ni capas huérfanas al cambiar de superficie; la navegación continúa siendo recuperable.
- **Contenido pendiente de aprobación:** no se sustituye por una afirmación plausible. Se marca como contenido de trabajo fuera de publicación o se retira hasta que exista una decisión explícita.

## 8. Fuera de alcance

- Interpretar texto libre, clasificar intenciones, redactar respuestas, mostrar respuesta desconocida o enlazar consultas con la Bitácora; corresponde a la spec 010.
- El efecto de escritura progresiva de respuestas libres; la spec 000 solo respeta el estado sin movimiento en las presentaciones que porta.
- Envío real del formulario, validaciones, protección contra abuso, correo, confirmación, fallo y conservación temporal de intentos; corresponde a la spec 020.
- Publicación en producción, dominio, certificados, despliegue continuo, restauración, alertas y operación del servidor; corresponde a la spec 020.
- Índice para buscadores, mapa del sitio, resumen para recuperación automatizada, metadatos enriquecidos y política de rastreo; se completan en la spec 010 sin alterar esta base visual.
- Cuentas, inicio de sesión, base de datos, gestor editorial, analítica, seguimiento, conversación remota, almacenamiento de conversaciones o recursos cargados desde terceros.
- Micrófono, voz, Toolkit y sus demostraciones de madurez, datos sensibles, normativa, investigación, auditoría o redacción de políticas.
- Banner de cookies, éxito simulado del formulario, etiquetas de demostración y los cuatro artículos sin cuerpo completo.
- Añadir proyectos distintos de Leadia y Nami, inventar enlaces o publicar nombres, cifras, certificados o canales no confirmados.
- Rediseñar el golden, cambiar copy clínico/profesional por preferencia, sustituir activos por aproximaciones o regenerar referencias para hacer pasar una diferencia.
- Abrir una cuarta especificación, servicio separado o automatización sin un criterio de aceptación que lo obligue.

## 9. Decisiones ya tomadas

- La v1 es una sola aplicación TypeScript estricta, un proceso de producción y un contenedor; no hay monorepo, microservicios, cola, Redis, base de datos, Kubernetes, Terraform ni CMS.
- El plan elige entre Next.js App Router con salida standalone y Astro con adaptador Node. No abre una tercera alternativa sin demostrar un bloqueo real.
- Todas las rutas públicas relevantes entregan HTML útil sin depender de JavaScript. La conversación, temas, filtros y expansiones son mejoras progresivas.
- La aplicación reserva en el mismo proceso las rutas de contacto y salud, aunque la operación real de contacto se complete en la spec 020.
- El Dockerfile multi-stage, `compose.yaml`, `.dockerignore` y `.env.example` se crean en esta spec. `docker compose up --build` sirve `http://localhost:3000`; `/api/salud` devuelve 200 con un cuerpo mínimo; `docker compose down` para limpiamente.
- El contenedor usa base mínima fijada por digest, usuario y grupo dedicados sin root, solo dependencias de runtime, `NODE_ENV=production`, `HEALTHCHECK` en loopback, root filesystem de solo lectura, `/tmp` como `tmpfs`, `cap_drop: ALL` y `no-new-privileges:true`.
- Las cabeceras mínimas son las de §11.3: HSTS, CSP con `default-src 'self'`, `base-uri 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'`, recursos propios y `upgrade-insecure-requests`; además `nosniff`, referrer estricto, permisos sensibles desactivados, aislamiento de apertura/recursos y `DENY` para marcos. No se permiten `unsafe-eval` ni `unsafe-inline`; solo se admite nonce por respuesta si la alternativa elegida obliga a un script inline.
- Las tipografías son Gabarito para titulares, Hanken Grotesk para texto e IBM Plex Mono para elementos técnicos, servidas localmente en WOFF2.
- Los temas son Claro, Oscuro, Cobalto, Rioja y Bosque; Rioja es inicial. La preferencia usa `localStorage` con la clave `rv_theme` y se aplica antes de pintar para evitar parpadeo.
- Los valores de `design/tokens.json` coinciden exactamente salvo ajuste de contraste registrado. Los activos originales del mockup se reutilizan y las imágenes publicadas tienen dimensiones explícitas, variantes AVIF/WebP, fallback y tamaños responsivos.
- Las escenas, precondiciones, viewports y modos de comparación son los de `design/golden.config.json`. El modo píxel admite como máximo 0,5 % por encima del umbral perceptual; el modo contrato limita a 2 CSS px los anclajes y solo se usa para cambios exigidos y registrados.
- La preparación del golden puede ocultar únicamente micrófono, Toolkit y controles retirados por la maestra. No puede alterar estilos, enmascarar contenido estable ni aceptar automáticamente una referencia nueva.
- Cada diferencia visible por accesibilidad, veracidad, adaptación o retirada de funciones entra en el registro de excepciones con requisito de origen, estado afectado y evidencia antes/después.
- WCAG 2.2 AA gobierna todas las rutas y temas. El contenido esencial no depende de voz, arrastre, hover, movimiento, precisión motora ni ejecución cliente.
- No hay cookies ni almacenamiento no esencial. La preferencia de tema es local y se documenta; no se cargan fuentes, scripts, recursos, embeds o seguimiento de terceros.
- `content/es.json`, `design/tokens.json`, `mockup/**`, la constitución y `compliance/**` son fuentes protegidas. No se editan a mano para acomodar la implementación.
- La URL del CV es `/Rodrigo-Valdelvira-CV.pdf`; responde como PDF, descarga con nombre descriptivo y queda fuera de indexación y archivo.
- La spec 000 crea `npm run verify:spec:000`; `npm run verify` agrega las puertas aplicables. Omitir una prueba o regenerar el golden no cuenta como verificación.
- Las specs 010 y 020 heredan y vuelven a ejecutar toda la suite visual. Cualquier cambio posterior es regresión salvo decisión de producto explícita.
- No se introduce una dependencia sin necesidad trazable y sin descartar una alternativa más simple.

## Decisiones pendientes antes de `/speckit-specify`

Quedan **5 decisiones pendientes**:

1. **P1 — Escala de habilidades:** conservar las estrellas con alternativa textual o retirarlas.
2. **P2 — Datos públicos de contacto:** aprobar o corregir email, teléfono, LinkedIn y ubicación.
3. **P3 — Vigencia profesional:** confirmar puesto actual, disponibilidad y certificaciones.
4. **P4 — Confidencialidad:** autorizar o retirar menciones a clientes/proyectos y la cifra del 65 %.
5. **P5 — Legal:** aprobar los textos de Privacidad, Cookies y Términos o mantener bloqueada la publicación.
