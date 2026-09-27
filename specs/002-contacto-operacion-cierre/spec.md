# Feature Specification: Contacto, operación y cierre

**Feature Branch**: `[002-contacto-operacion-cierre]`

**Created**: 2026-09-25

**Status**: Draft — ocho decisiones externas pendientes y dependencias de 000/010 sin cierre verificado

**Input**: User description: [`docs/servilletas/020-contacto-operacion-y-cierre.md`](../../docs/servilletas/020-contacto-operacion-y-cierre.md)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enviar una consulta con resultado fiable (Priority: P1)

Como visitante, quiero enviar un mensaje por Contacto y saber si fue aceptado, para poder confiar en la confirmación y continuar por otra vía si falla.

**Why this priority**: El contacto operativo es el principal resultado nuevo de esta rebanada y completa el recorrido desde el portfolio hasta Rodrigo.

**Independent Test**: Con un destino de contacto de prueba disponible, enviar un mensaje válido y comprobar la recepción única y la confirmación posterior; repetir con una entrega rechazada o agotada y comprobar que no hay éxito falso, se conserva el texto y se presenta la alternativa por email.

**Acceptance Scenarios**:

1. **Given** los canales públicos confirmados y el formulario disponible, **When** una persona envía nombre, email y mensaje dentro de los límites, **Then** recibe confirmación solo después de que el destino acepte un único mensaje.
2. **Given** un formulario válido, **When** el destino rechaza el mensaje o no responde dentro del tiempo permitido, **Then** la persona ve que no se envió, conserva lo escrito y encuentra el email alternativo.
3. **Given** el proveedor de entrega no está configurado, **When** la persona visita Contacto, **Then** el formulario no simula disponibilidad o éxito y se ofrece el canal alternativo confirmado.
4. **Given** un formulario, **When** la persona revisa antes de enviarlo, **Then** ve un aviso breve de privacidad con enlace a la información de privacidad.

### User Story 2 - Usar canales públicos y conocer el uso de datos (Priority: P2)

Como visitante, quiero encontrar canales de contacto aprobados y consultar información legal y de privacidad, para elegir cómo contactar y entender el uso de los datos enviados.

**Why this priority**: Los canales y avisos permiten un contacto informado y veraz incluso ante la indisponibilidad temporal del formulario.

**Independent Test**: Abrir Contacto, Privacidad, Cookies y Términos directamente; verificar únicamente datos autorizados, enlaces funcionales y ausencia de un aviso de consentimiento innecesario.

**Acceptance Scenarios**:

1. **Given** datos de contacto cuya publicación fue confirmada, **When** la persona abre Contacto, **Then** solo se muestran los canales aprobados y utilizables.
2. **Given** que teléfono, ubicación u otro canal no fue confirmado, **When** la persona abre Contacto, **Then** ese dato no se infiere ni aparece como enlace vacío.
3. **Given** que el portfolio no utiliza almacenamiento no esencial, **When** la persona abre sus páginas, **Then** no aparece un banner de cookies y el contenido sigue disponible aunque no pueda conservarse la preferencia de tema.

### User Story 3 - Mantener el sitio disponible durante una publicación (Priority: P2)

Como responsable del portfolio, quiero comprobar el sitio publicado, identificar la versión activa y recuperar la anterior si la nueva no funciona, para reducir interrupciones y conocer el resultado de cada publicación.

**Why this priority**: Una publicación recuperable protege el acceso público y permite completar la v1 con evidencia verificable.

**Independent Test**: En un entorno de publicación controlado, comprobar el acceso HTTPS en el dominio raíz y la redirección de www; simular un fallo de funcionamiento posterior a la publicación y verificar que se recupera la versión previa y el intento queda fallido.

**Acceptance Scenarios**:

1. **Given** una versión que superó las comprobaciones previas, **When** se publica, **Then** el dominio raíz sirve el sitio por HTTPS y www redirige al dominio raíz.
2. **Given** una versión nueva publicada, **When** la comprobación posterior confirma que el sitio funciona, **Then** queda identificable qué versión está activa y se registra el resultado de publicación.
3. **Given** que falla la comprobación posterior de la versión nueva, **When** termina el intento de publicación, **Then** se sirve la versión anterior y el intento se informa como fallido.
4. **Given** una persona consulta la comprobación pública de salud, **When** recibe la respuesta, **Then** esta confirma disponibilidad sin revelar versión, secretos, servidor ni estado del servicio de correo.

### User Story 4 - Cerrar la v1 con evidencia y aprobaciones completas (Priority: P1)

Como propietario del producto, quiero revisar evidencia vinculada a todos los criterios y las aprobaciones humanas pendientes, para distinguir lo verificado de lo que sigue bloqueando el cierre o la publicación.

**Why this priority**: La publicación y la declaración de producto terminado dependen de resultados comprobados, dependencias previas y decisiones humanas; un cierre parcial no debe presentarse como aprobación total.

**Independent Test**: Revisar el expediente de cierre y confirmar que cubre los 34 criterios, evidencia el resultado de cada uno y registra el estado de las tres revisiones humanas y de las dependencias 000 y 010; comprobar que cualquier fallo o bloqueo impide marcar la v1 como terminada o habilitar publicación.

**Acceptance Scenarios**:

1. **Given** los criterios de la v1 y sus verificaciones, **When** se prepara el cierre, **Then** cada uno de los 34 criterios tiene resultado y evidencia localizable.
2. **Given** un criterio fallido, una comprobación técnica omitida sin causa aprobada, una revisión humana pendiente o una dependencia previa sin cierre verificable, **When** se solicita declarar la v1 terminada o publicarla, **Then** la solicitud queda bloqueada y el pendiente queda visible.
3. **Given** todos los criterios y revisiones requeridos aprobados, **When** se revisa el cierre, **Then** el resultado diferencia las aprobaciones técnicas de las humanas y permite declarar terminado el producto.

### Edge Cases

- Nombre ausente, de 1 o más de 80 caracteres; email ausente, inválido o de más de 254 caracteres; mensaje ausente, menor de 20 o mayor de 3000 caracteres.
- Solicitud superior a 8 KiB, tipo de contenido inesperado, origen no permitido o campos no reconocidos: se rechaza sin aceptar mensaje ni exponer detalles internos.
- Campo trampa completado, encabezados manipulados mediante saltos de línea, texto interpretado como contenido activo o intento duplicado: no debe producir entrega adicional ni alterar el destinatario o encabezados.
- Doble clic, repetición inmediata y exceso de intentos (más de 5 desde la misma dirección de conexión durante 15 minutos): se evita la entrega duplicada y se aplica el límite sin conservar la dirección.
- Exceso global de intentos: se rechaza de forma segura y no afecta a la integridad de mensajes ya aceptados.
- El servicio de correo rechaza, tarda más del límite o no está configurado: no se confirma la entrega, no hay reintentos indefinidos ni se borran los datos del formulario.
- Falta de configuración operativa durante el desarrollo: el formulario se presenta como no disponible y mantiene un canal alternativo real.
- La nueva versión falla en disponibilidad, acceso seguro o comprobación funcional: se mantiene/restaura la anterior y se registra el fallo.
- No se han aprobado un canal, una mención de cliente/proyecto, una cifra o texto legal: no se infiere ni se publica como confirmado.
- Se desactiva o borra el almacenamiento de preferencias: el tema puede dejar de recordarse, pero el contenido y el contacto siguen utilizables.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Contacto DEBE mostrar email, teléfono, LinkedIn y ubicación/remoto únicamente cuando cada dato haya sido confirmado expresamente para publicación; los datos no confirmados DEBEN omitirse sin sustituciones inferidas.
- **FR-002**: El formulario DEBE aceptar nombre de 2–80 caracteres, email válido de hasta 254 caracteres y mensaje de 20–3000 caracteres, e informar estos límites de forma comprensible.
- **FR-003**: El formulario DEBE mostrar un aviso breve de privacidad enlazado a Privacidad antes de enviar los datos.
- **FR-004**: Un envío válido DEBE dirigirse una sola vez al destino configurado y mostrar éxito solo tras la aceptación del destino. No DEBE generar una respuesta automática al visitante.
- **FR-005**: Ante rechazo, indisponibilidad, timeout o configuración ausente, el sitio NO DEBE afirmar que el mensaje se envió; DEBE conservar los campos y mostrar email alternativo confirmado sin exponer el fallo interno.
- **FR-006**: El sitio DEBE limitar las solicitudes a 8 KiB, validar contenido, origen y campos previstos, rechazar datos inesperados y neutralizar intentos de alterar destinatario o encabezados; el mensaje se trata como texto.
- **FR-007**: El sitio DEBE limitar a 5 intentos por dirección de conexión en 15 minutos, aplicar un límite global defensivo y evitar aceptar repetidamente el mismo intento inmediato. La dirección de conexión no se conserva.
- **FR-008**: El portfolio NO DEBE persistir el contenido del formulario. Los registros NO DEBEN incluir nombre, email, mensaje, encabezados completos ni secretos.
- **FR-009**: Privacidad, Cookies y Términos DEBEN estar disponibles como páginas públicas. Mientras no se use almacenamiento no esencial, el sitio NO DEBE mostrar un banner de consentimiento; la falta de almacenamiento de preferencias no bloqueará su uso.
- **FR-010**: El sitio de producción DEBE responder por HTTPS en el dominio raíz configurado, dirigir www al dominio raíz y ofrecer una comprobación de salud que no revele versión, secretos, servidor ni estado del correo.
- **FR-011**: Cada publicación DEBE identificar la versión/artefacto promovido y registrar referencia de cambio, huella del artefacto, fecha y hora, URL y resultado; DEBE serializar las publicaciones de producción.
- **FR-012**: Antes de retirar la versión anterior, la nueva DEBE superar la comprobación posterior de salud; ante fallo, el sitio DEBE recuperar la versión previa y marcar la publicación como fallida.
- **FR-013**: La publicación DEBE estar bloqueada si hay criterios fallidos, comprobaciones técnicas requeridas omitidas sin causa aprobada o decisiones humanas bloqueantes pendientes.
- **FR-014**: El cierre de la v1 DEBE presentar resultado y evidencia vinculada de sus 34 criterios, estado de las tres revisiones humanas (contenido, privacidad/legal y operación) y estado de cierre verificable de las dependencias 000 y 010. No DEBE declarar la v1 terminada si hay algún fallo o pendiente bloqueante.
- **FR-015**: Los cambios DEBEN conservar la composición visual aprobada de las superficies públicas y superar la suite completa de escenas normativas; ningún cambio no aprobado actualizará la referencia visual.
- **FR-016**: La implementación DEBE satisfacer WCAG 2.2 AA y la línea base de privacidad y seguridad aprobadas por el proyecto, con verificación humana reforzada para contacto, cabeceras y operación.

### Key Entities

- **Consulta de contacto**: conjunto temporal de nombre, email y mensaje entregado por una persona; tiene resultado aceptado o fallido, no se conserva en el portfolio y solo se comunica como enviado tras aceptación.
- **Canal público confirmado**: forma de contacto aprobada individualmente para su publicación, con su destino y estado de confirmación.
- **Versión publicada**: artefacto del sitio asociado a una referencia de cambio y una huella identificadora, con URL, fecha, resultado y estado activo.
- **Evidencia de cierre**: resultado comprobable asociado a un criterio de aceptación, una revisión humana o una dependencia del producto.
- **Decisión de publicación pendiente**: dato o aprobación aún no resuelto que bloquea una acción específica, como publicar, activar contacto o declarar la v1 terminada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de los envíos aceptados válidos llega una sola vez al destino configurado y el 100 % de los fallidos evita una confirmación falsa, conserva los campos y ofrece una alternativa operativa.
- **SC-002**: El 100 % de las entradas fuera de los límites o de las condiciones de origen e integridad definidas se rechaza sin alterar el destinatario ni crear una entrega no autorizada.
- **SC-003**: En la verificación de registros de contacto, se recuperan cero nombres, emails, mensajes, encabezados completos o secretos; el portfolio conserva cero mensajes enviados.
- **SC-004**: El 100 % de los canales y afirmaciones públicos de contacto está confirmado antes de mostrarse; los elementos sin aprobación aparecen cero veces.
- **SC-005**: El 100 % de las páginas legales requeridas abre como página pública y, si no hay almacenamiento no esencial, se muestran cero banners de consentimiento.
- **SC-006**: El dominio raíz completa la conexión segura en el 100 % de las comprobaciones y www redirige al dominio raíz.
- **SC-007**: En el 100 % de las simulaciones de fallo posterior a la publicación, la versión previa vuelve a servirse y el intento nuevo queda registrado como fallido.
- **SC-008**: El 100 % de los registros de publicación incluye referencia de cambio, huella de artefacto, fecha/hora, URL y resultado; la comprobación de salud no revela ninguno de los datos prohibidos.
- **SC-009**: La suite completa de escenas visuales heredadas termina sin cambios de composición no aprobados y se cumplen los criterios de accesibilidad del proyecto.
- **SC-010**: El 100 % de los 34 criterios de la v1 tiene evidencia vinculada y resultado visible antes del cierre; las tres revisiones humanas y los cierres previos de 000/010 constan con su resultado.
- **SC-011**: Cero publicaciones o declaraciones de producto terminado ocurren con criterios fallidos, verificaciones obligatorias omitidas sin causa aprobada o decisiones humanas/dependencias bloqueantes pendientes.

## Assumptions

- La servilleta y las secciones citadas de la especificación maestra son las fuentes de alcance; no se porta comportamiento del golden porque no existe comportamiento previo de contacto u operación.
- La operación mantiene una sola aplicación y proceso, una imagen identificada por su huella, HTTPS en el dominio raíz y recuperación de la versión previa conforme a la constitución.
- El envío consiste en un solo mensaje a un destino configurado, sin respuesta automática, cola, base de datos, persistencia local ni reintento indefinido.
- Se aplican como requisitos del proyecto las líneas base de accesibilidad, seguridad y privacidad descritas en la constitución y la servilleta.
- Las ocho decisiones de la servilleta siguen sin respuesta en esta especificación: visibilidad del paquete de imagen; datos efectivos y aprovisionamiento de Hetzner; proveedor/remitente/destino de correo; canal de alertas; datos y menciones autorizados; responsable y aprobación de textos legales; política de rastreo GPTBot/OAI-SearchBot; y resolución/cierre de dependencias 000 y 010. Deben quedar resueltas por quien tenga autoridad antes de la acción de publicación o cierre que afecten.
- Las recomendaciones incluidas en la servilleta son orientación, no aprobaciones ni valores efectivos. Ningún secreto, canal, contenido público o aprobación jurídica se presume.
- Las referencias visuales asignadas son pruebas de regresión heredada; no definen el comportamiento nuevo de envío o despliegue.
- El comprobador externo mínimo y el canal de alerta quedan sujetos a decisión humana; no se presupone una herramienta o servicio concreto.
- El cierre administrativo de 000 no equivale a superar sus verificaciones visuales o revisión humana de accesibilidad; 010 conserva cierre pendiente hasta aportar evidencia.
- La suite visual completa de 000 y la evidencia de los 34 criterios son dependencias de verificación, no resultados ya obtenidos por esta especificación.
