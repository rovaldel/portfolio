# Servilleta 020 · Contacto, operación y cierre

**Hito:** 020 · Funcionalidad final de la v1  
**Depende de:** 000 (esqueleto visual funcional) y 010 (lógica del portfolio). La decisión de cierre administrativo de 000 permite avanzar en la secuencia, pero no declara superadas sus comprobaciones visuales ni la revisión humana de accesibilidad. La ficha de 010 sigue indicando que su cierre está pendiente.  
**Se valida viendo:** en `/contacto`, una persona puede enviar un mensaje válido y recibe confirmación únicamente cuando se acepta; si falla, conserva el texto y encuentra una alternativa. El mismo portfolio publicado responde por HTTPS y, ante una comprobación de salud fallida durante el despliegue, vuelve a la versión anterior. El cierre reúne evidencia de privacidad, seguridad, contacto, producción y aceptación total.

## 0. Referencias normativas

- **Especificación maestra:** §§8.6–8.7 (contacto, legal, cookies y errores), 11 (seguridad y privacidad), 14–16 (producción, publicación, continuidad), 17–18 (comprobaciones y criterios), 20 (decisiones humanas) y 23 (terminado global).
- **Golden master:** esta especificación construye algo que el prototipo no tiene. El mapa de fuentes declara «sin comportamiento previo»; no hay funciones del golden que portar.
- **Capturas normativas asignadas:** `portfolio/portada-rioja-desktop.png`, `portfolio/portada-rioja-mobile.png`, `portfolio/portada-claro-desktop.png`, `portfolio/portada-oscuro-desktop.png`, `portfolio/portada-cobalto-desktop.png`, `portfolio/portada-bosque-desktop.png`, `portfolio/selector-tema.png`, `portfolio/sobre-mi.png`, `portfolio/habilidades.png`, `portfolio/servicios.png`, `portfolio/servicio-detalle.png`, `portfolio/proyectos.png`, `portfolio/proyecto-leadia.png`, `portfolio/experiencia.png`, `portfolio/formacion.png`, `portfolio/contacto.png`, `portfolio/bitacora.png`, `portfolio/articulo-langgraph.png` y `portfolio/legal-privacidad.png`. Son referencias para comprobar la regresión visual heredada; no definen el comportamiento nuevo de envío ni despliegue.
- **Constitución:** mandan sus reglas de veracidad, accesibilidad, privacidad, seguridad y despliegue recuperable. El formulario es la única frontera de datos personales; no se persiste el mensaje en el portfolio y los registros no incluyen datos personales ni cuerpo.

## 1. Objetivo y contexto

Permitir que una persona contacte de verdad con Rodrigo, sepa si su mensaje se ha entregado o si debe probar otra vía, y que el portfolio pueda publicarse con garantías y recuperarse si una versión nueva deja de funcionar. La puesta en producción debe completar la v1 sin presentar como aprobados los controles que aún fallen ni ocultar decisiones humanas pendientes.

## 2. Usuarios

- **Cliente potencial, persona reclutadora o colaboradora:** quiere plantear una consulta mediante un canal público y saber si el formulario la envió.
- **Rodrigo:** necesita recibir el mensaje en el destino configurado, limitar abuso, mantener la privacidad y confirmar los datos y textos públicos.
- **Persona responsable de mantener el sitio:** necesita saber si el servicio responde, qué versión está activa y cómo recuperar la versión anterior.

## 3. Historias

1. Como visitante, quiero enviar nombre, email y mensaje y ver una confirmación verdadera, para saber que mi consulta llegó al destino indicado.
2. Como visitante, si el envío falla, quiero conservar lo escrito y disponer de una alternativa de contacto, para no perder mi consulta ni creer que se entregó.
3. Como visitante, quiero conocer el uso de mis datos y acceder a la información legal, para decidir con claridad si envío el formulario.
4. Como responsable del portfolio, quiero publicar una versión ya comprobada, observar que responde y restaurar la anterior si falla, para mantener el sitio disponible y poder identificar qué se publicó.
5. Como propietario del producto, quiero cerrar la v1 con resultados y evidencias de todos sus criterios y revisiones humanas, para distinguir lo que está verificado de lo que sigue pendiente.

## 4. Requisitos observables

No hay comportamiento de contacto ni operación que portar del golden. Los requisitos nuevos se derivan de la maestra:

- **RF1.** La página de contacto ofrece email, teléfono, LinkedIn y ubicación/remoto solo cuando cada dato haya sido confirmado para publicación.
- **RF2.** El formulario acepta nombre de 2–80 caracteres, email válido de hasta 254 y mensaje de 20–3000. Muestra un aviso breve de privacidad con enlace a `/privacidad`.
- **RF3.** Un envío correcto se confirma solo después de que el proveedor acepte un único mensaje dirigido a `CONTACT_TO`. No se envía respuesta automática.
- **RF4.** Si el envío no se acepta, la página indica que no se envió, conserva los campos y ofrece email como alternativa.
- **RF5.** El sitio limita los intentos abusivos, evita recibir varias veces el mismo intento inmediato y no revela al visitante detalles internos del fallo.
- **RF6.** La información legal y de privacidad está disponible como páginas públicas. No hay banner de cookies mientras no se incorporen cookies o almacenamiento no esencial.
- **RF7.** El sitio publicado permite comprobar que responde, identificar qué versión está activa y recuperar la anterior cuando la comprobación posterior falle.
- **RF8.** El cierre de v1 presenta el resultado verificable de sus criterios y revisiones requeridas. Un criterio fallido o una validación humana pendiente impide declarar terminado el producto o publicarlo.

## 5. Reglas de negocio

- **RB1. Confirmación veraz.** Solo se informa de envío cuando el destino configurado acepta el mensaje. *Ejemplo:* si el proveedor acepta la entrega, se muestra «enviado»; si agota el tiempo de espera, se muestra un error accionable, aunque el visitante haya pulsado una sola vez.
- **RB2. Límites de campos.** Nombre: 2–80 caracteres; email: válido y hasta 254; mensaje: 20–3000. *Ejemplo:* un mensaje de 19 caracteres no se envía; uno de 20 cumple el mínimo. El límite total de la petición es 8 KiB.
- **RB3. Protección de datos.** El portfolio no guarda el formulario. No se registran nombre, email, contenido ni cabeceras completas. El correo del visitante se usa como dirección de respuesta, no como remitente. *Ejemplo:* al revisar los registros del envío de prueba no se puede recuperar el texto ni la dirección del visitante.
- **RB4. Prevención de abuso y duplicados.** Se permiten como máximo 5 intentos por dirección de conexión en 15 minutos, además de un límite global defensivo; esa dirección no se guarda. Se reconoce un mismo intento inmediato para evitar aceptarlo varias veces. *Ejemplo:* el sexto intento dentro de 15 minutos recibe un rechazo por exceso; un doble clic no produce dos mensajes.
- **RB5. Origen e integridad del mensaje.** Solo se aceptan envíos desde el sitio permitido, con el formato previsto y sin datos inesperados; se rechazan saltos de línea que puedan alterar la dirección o el encabezado del correo y el mensaje se trata como texto. *Ejemplo:* incluir un dato adicional o intentar añadir un encabezado no produce un correo ni una respuesta de éxito.
- **RB6. Fallo de entrega.** Se espera al proveedor solo durante un tiempo limitado y no se repite el envío indefinidamente. *Ejemplo:* si el proveedor no responde a tiempo el formulario conserva nombre, email y mensaje y presenta el email alternativo.
- **RB7. Recuperación de producción.** La versión anterior se conserva mientras se comprueba la nueva; si la comprobación de que el sitio funciona falla, se restaura la anterior y el intento queda como fallido. *Ejemplo:* si la nueva versión no permite abrir la portada segura, vuelve a servirse la imagen previa sin reconstruirla.
- **RB8. Privacidad del navegador.** No se usan cookies ni almacenamiento no esencial; rechazar almacenamiento del navegador no bloquea el sitio, aunque no se recuerde el tema. *Ejemplo:* borrar o desactivar el almacenamiento solo hace que Rioja deje de ser recordado; las páginas siguen utilizables.
- **RB9. Aprobación de contenido y legal.** Los datos de contacto, menciones de clientes y proyectos, cifra del 65 % y textos legales requieren validación humana antes de producción. *Ejemplo:* si el teléfono no ha sido confirmado, no se muestra un enlace telefónico vacío ni se publica un número inferido.

## 6. Criterios de aceptación

- **CA1.** ¿La página de contacto muestra solo canales confirmados, formulario con límites y aviso enlazado a privacidad? **Sí/No mirando `/contacto`.**
- **CA2.** ¿Un mensaje de prueba válido llega una sola vez al destino configurado y solo entonces aparece confirmación? **(prueba)**
- **CA3.** ¿Ante fallo del proveedor se conservan los campos, no se confirma el envío y se ofrece el canal alternativo? **(prueba)**
- **CA4.** ¿Los campos fuera de límites, un origen ajeno, CRLF, una petición superior a 8 KiB y una ráfaga se rechazan según lo definido? **(prueba)**
- **CA5.** ¿Los registros de la prueba no contienen nombre, email, mensaje ni secretos? **(prueba)**
- **CA6.** ¿Las páginas `/privacidad`, `/cookies` y `/terminos` son accesibles y no aparece un banner de cookies? **Sí/No mirando las páginas.**
- **CA7.** ¿La versión publicada responde de forma segura en el dominio principal y `www` lleva al dominio raíz? **(prueba)**
- **CA8.** ¿La respuesta de salud no expone versión, secretos, nombre del servidor ni estado SMTP? **(prueba)**
- **CA9.** ¿Al provocar un fallo de salud, se restaura la versión anterior y el despliegue figura fallido? **(prueba)**
- **CA10.** ¿El registro del despliegue permite identificar commit, digest, fecha/hora, URL y resultado? **(prueba)**
- **CA11.** ¿Las superficies públicas mantienen el contrato visual y la suite completa de capturas pasa sin cambios no aprobados? **(prueba)**
- **CA12.** ¿Existe evidencia vinculada para los 34 criterios, están completadas las validaciones humanas de contenido, privacidad/legal y operación, y no quedan elementos falsos, vacíos o de demostración? **(prueba)**

## 7. Casos límite

- Nombre vacío, de un carácter o de más de 80; email ausente, mal formado o superior a 254; mensaje vacío, de 19 caracteres o de más de 3000.
- Cuerpo mayor de 8 KiB, campos no reconocidos, tipo de contenido incorrecto y origen/host no permitido.
- Campo trampa rellenado: el rechazo debe resultar indistinguible de un envío normal para el programa abusivo.
- Texto con código o saltos de línea que intenten alterar el correo: no se interpreta como contenido confiable ni se convierte en una cabecera.
- Doble clic, reintento inmediato con la misma clave, límite de intentos alcanzado y exceso global.
- SMTP rechazado, indisponible o lento: no hay éxito falso ni reintento sin límite; los datos permanecen en el formulario.
- Configuración SMTP ausente en desarrollo: formulario claramente no disponible y email alternativo; nunca se simula un envío exitoso.
- Fallo de la versión nueva, de la comprobación de funcionamiento o de la conexión segura durante la publicación: se conserva la versión anterior y el resultado es visible como fallo.
- Canal público o dato legal sin validar: no se inventa ni se publica como confirmado.
- La pérdida de preferencia del tema al desactivar almacenamiento no impide acceder a páginas ni completar el contacto.

## 8. Fuera de alcance

- Cuentas, área privada, base de datos, cola de mensajes, persistencia del formulario o respuestas automáticas.
- Analítica, píxeles, cookies no esenciales, newsletter, pruebas automáticas para distinguir personas de programas, contenido incrustado o recursos externos cargados sin acción de la persona.
- Herramientas avanzadas de supervisión; la comprobación externa mínima y el canal de alerta quedan sujetos a elección humana.
- Cambiar la arquitectura o el diseño ya aprobado por las specs 000 y 010, regenerar capturas para hacer pasar una regresión o añadir funcionalidades de contacto no enumeradas.
- Declarar conforme o jurídicamente aprobado el contenido legal sin revisión humana.
- Publicar mientras haya criterios fallidos, comprobaciones técnicas omitidas sin causa aprobada o decisiones humanas bloqueantes pendientes.
- Incorporar Toolkit, multidioma, modelos generativos, almacenamiento de conversaciones o sistemas de marketing.

## 9. Decisiones ya tomadas

- La única frontera de datos personales de la aplicación es el formulario; el portfolio no persiste sus datos. Los registros omiten el cuerpo y datos personales.
- El formulario envía un único email a `CONTACT_TO`, no responde automáticamente y solo confirma después de la aceptación del proveedor. Los errores conservan lo escrito y ofrecen email alternativo.
- Límites y controles son los de §§8.6 y 11: 2–80 caracteres para nombre, email máximo 254, mensaje 20–3000, petición máxima 8 KiB, 5 intentos por IP cada 15 minutos, comprobación de origen, honeypot, idempotencia, timeout SMTP y rechazo CRLF.
- El mensaje se trata como texto plano; el remitente es fijo del dominio y el correo del visitante se usa solo como `Reply-To`.
- La aplicación sigue siendo una sola aplicación y proceso; producción vive en Hetzner detrás de HTTPS en el dominio raíz, con `www` redirigido. El despliegue identifica la imagen por SHA/digest, verifica salud y revierte a la imagen anterior si falla.
- No se muestran cookies no esenciales ni banner de consentimiento; la preferencia de tema puede dejar de recordarse si se rechaza el almacenamiento.
- La seguridad toma como baseline OWASP Top 10:2025 y ASVS 5.0.0 nivel 1; la accesibilidad mantiene WCAG 2.2 AA.
- La suite visual completa de 000 debe volver a ejecutarse en 020. Cualquier cambio visual requiere excepción aprobada; no se actualiza el golden automáticamente.
- El producto no se declara terminado ni se publica con un criterio fallido. El cierre exige evidencia de los 34 criterios, las tres specs cerradas y validaciones humanas requeridas.

### ⚠️ Decisiones pendientes (8)

1. **¿Qué destino tendrá el paquete de imagen en GHCR y será público o privado?** Opciones: público (descarga sin autenticación) o privado (requiere credencial de solo lectura en el servidor). Recomendación: mantenerlo privado si no hay una necesidad de distribución pública.
2. **¿Cuáles son el host/IP y puerto de Hetzner, huella SSH, DNS controlado y datos efectivos de la cuenta `deploy`?** Opciones: aportar los valores reales ahora o completar el aprovisionamiento antes de activar publicación. Recomendación: completar y verificar todos antes del primer despliegue; no inferirlos.
3. **¿Qué configuración SMTP, remitente autorizado y `CONTACT_TO` se utilizarán?** Opciones: proveedor actual con TLS y remitente del dominio, o proveedor alternativo aprobado. Recomendación: usar un remitente del dominio con SPF, DKIM y DMARC alineados; las credenciales se provisionan fuera del repositorio.
4. **¿Qué canal recibirá alertas de caída o fallo continuado del contacto?** Opciones: email u otro canal ya administrado por Rodrigo. Recomendación: email operativo separado del buzón de contacto si está disponible.
5. **¿Qué email, teléfono, LinkedIn, menciones de clientes/proyectos y cifra del 65 % se autorizan para publicación?** Opciones: confirmar cada elemento o excluir los no confirmados. Recomendación: publicar solo elementos confirmados individualmente.
6. **¿Quién valida y aprueba los textos legales, responsable, base legal, conservación en el buzón y derechos antes de producción?** Opciones: revisión jurídica competente o aprobación explícita del propietario tras revisión. Recomendación: revisión jurídica antes de producción; los textos del mockup son borradores.
7. **¿Se mantiene bloquear GPTBot y permitir OAI-SearchBot?** Esta política está pendiente en §20, aunque la constitución la presenta como valor predeterminado. Opciones: confirmar el valor o registrar una política distinta. Recomendación: conservar el predeterminado de la maestra, permitir búsqueda/citación y bloquear entrenamiento.
8. **¿Cómo se resuelve el cierre previo de 010 y la evidencia pendiente de 000 para que 020 pueda completar y verificar sus dependencias?** Opciones: cerrar sus verificaciones pendientes o autorizar explícitamente la continuación dejando los riesgos abiertos. Recomendación: cerrar primero los criterios previos; la excepción administrativa de 000 no equivale a un pase técnico, y 010 todavía no tiene `cierre.md`.

## Comprobación de las diez preguntas de la guía §5

1. **¿El objetivo se entiende sin tecnología?** Sí: contacto verdadero, publicación recuperable y cierre verificable.
2. **¿Está claro quién lo usa y qué necesita?** Sí: visitante, propietario del portfolio y responsable de operación.
3. **¿Cada regla tiene un ejemplo concreto?** Sí: RB1–RB9 incluyen ejemplos numéricos o casos observables.
4. **¿Cada criterio se responde sí/no con evidencia?** Sí: CA1–CA12 indican inspección visual o prueba.
5. **¿Está separado el qué del cómo?** Sí: las secciones 1–8 describen resultados, límites y casos; los detalles de implementación quedan referenciados en las decisiones normativas, no como elección de plan.
6. **¿El fuera de alcance evita expansión?** Sí: excluye persistencia, marketing, APM y funcionalidades no especificadas.
7. **¿Incluye vacío, error, límites y recuperación?** Sí: contempla campos ausentes, errores SMTP, límites, abuso y rollback.
8. **¿Queda alguna decisión que el agente tendría que adivinar?** Sí: quedan 8 decisiones enumeradas; no se suplen con supuestos.
9. **¿Todos los punteros pasan `npm run refs:check`?** Pendiente de ejecutar la comprobación del proyecto; las referencias se han tomado de `FUENTES.md` y la maestra, sin líneas del golden.
10. **¿Otra persona construiría el mismo comportamiento?** En cuanto a reglas de negocio, sí; las decisiones externas y el cierre de dependencias deben resolverse antes de implementar o publicar.

## Pendientes y supuestos

**Decisiones pendientes: 8.** No se asumieron credenciales, canales de alerta, datos públicos ni aprobación jurídica. La recomendación en cada pregunta es orientación explícita de esta servilleta, no una decisión ya aprobada. No se ha ejecutado `npm run refs:check` ni otro verificador: el documento debe conservar ese estado visible hasta que se ejecute.
