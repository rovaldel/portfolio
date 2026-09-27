# Especificación maestra · Portfolio conversacional de Rodrigo Valdelvira

| Campo | Valor |
|---|---|
| Versión | 1.1.0 |
| Estado | Aprobable para descomposición con Servilleta y GitHub Spec Kit |
| Fecha de referencia | 2026-09-09 |
| Propietario del producto | Rodrigo Valdelvira Ortigosa |
| URL canónica de producción | `https://rodrigovaldelvira.com` |

---

## 0. Cómo usar este documento

Este documento define el producto completo: qué debe hacer, qué no debe hacer y cómo se demostrará que está listo. Cada servilleta posterior debe apuntar a una sección concreta de esta especificación y al estado correspondiente del mockup; no debe volver a interpretar el producto desde cero.

La implementación se ordena deliberadamente en dos capas. La spec `000-esqueleto-visual-funcional` construye primero **toda la carcasa gráfica final y navegable** a partir del mockup. Las specs posteriores incorporan la lógica de dominio, conversación, contacto y operación dentro de esa carcasa; no pueden aprovechar su alcance para rediseñarla. Una diferencia visual posterior se trata como regresión salvo que esté registrada como excepción aprobada.

Las decisiones marcadas como **NO NEGOCIABLE** no se reabren en `/speckit-plan`. Las cuestiones marcadas como **VALIDACIÓN HUMANA** requieren confirmación de Rodrigo antes de publicar, pero no autorizan al implementador a inventar contenido.

La aplicación se considera «100 % funcional» cuando **todo lo que se muestra o se puede accionar funciona de verdad**. No significa que deban publicarse todos los experimentos contenidos en el mockup. Una función incompleta debe ocultarse; nunca se presenta como disponible, nunca devuelve datos simulados y nunca muestra un éxito falso.

### 0.1 Prioridad de las fuentes

Cuando dos fuentes discrepen, prevalece este orden:

1. Esta especificación para alcance, comportamiento, seguridad, accesibilidad, SEO y despliegue.
2. `mockup/Rodrigo_Valdelvira_CV_AI_Engineer.pdf` para datos biográficos, puestos y fechas.
3. `mockup/Portfolio Conversacional.html` para composición visual, interacción y copy que no contradiga al CV ni a esta especificación.
4. Los activos de primer nivel de `mockup/`: `portafolio.png`, `leadia.webp`, `nami-cover.png` y `qr.png`.
5. Las normas externas enlazadas en §22.

El antiguo directorio `mockup/uploads/` se retiró por contener únicamente iteraciones, duplicados y ficheros no enlazados. No debe reintroducirse material auxiliar como fuente normativa sin una decisión editorial explícita.

### 0.2 Identidad congelada de las fuentes

Estos hashes permiten detectar que el mockup cambió después de redactar la especificación:

| Fuente | SHA-256 |
|---|---|
| `Portfolio Conversacional.html` | `2289e434510639158295ea6de6ed11dab742451f17e4d2be900245211e2ac15e` |
| `support.js` | `e42ebd3c7bb28f9692adf59ce1bd57872cfcb0dcbe66fceff7a6ae98167d2db7` |
| `Rodrigo_Valdelvira_CV_AI_Engineer.pdf` | `889781068935b4a4838422a61709e2a3449efe74536060474ee0f0707f9cd7b4` |
| `portafolio.png` | `f6ea4c9ce436fd29632268eeec8827c29a352b6b4cdb2544679525222106d6fd` |
| `leadia.webp` | `191048ab1cf096528ee6520de4a5e6a35208d0830d6f40fe762dc6d25f5ae68f` |
| `nami-cover.png` | `b9aec9d26b05863a357394613626831016844be02c5516c6c0ea7f2ed4b985ef` |

Si cambia un hash, se revisan las secciones afectadas antes de generar otra servilleta.

---

## 1. Propósito y resultado de negocio

El sitio presenta a Rodrigo como AI Engineer capaz de llevar agentes, sistemas RAG, datos y modelos desde el problema de negocio hasta producción. Debe permitir que una persona reclutadora, un posible cliente o un colaborador entienda rápidamente su propuesta de valor, compruebe experiencia y proyectos, y contacte con él.

La conversación es la forma distintiva de navegar por el portfolio, no un fin en sí misma. El contenido debe seguir siendo legible, enlazable e indexable sin ejecutar JavaScript.

### 1.1 Objetivos medibles

- Una visita nueva entiende en menos de 30 segundos quién es Rodrigo, qué construye y cómo contactar.
- Todas las áreas públicas tienen URL propia y contenido HTML disponible sin JavaScript.
- No hay botones muertos, enlaces rotos, datos ficticios, formularios simulados ni resultados precalculados presentados como reales.
- El sitio puede ejecutarse localmente con un único comando Docker y publicarse en Hetzner mediante `.github/workflows/deploy.yml`.
- La producción sirve exclusivamente por HTTPS, puede desplegar una versión nueva sin perder la anterior y revierte si la comprobación de salud falla.
- El contenido es rastreable, canónico y estructurado para buscadores tradicionales y sistemas de respuesta basados en LLM.

### 1.2 Indicadores de la primera versión

- Cero enlaces internos o activos con respuesta 4xx/5xx.
- Cero errores de accesibilidad automáticos de impacto crítico o serio en las rutas representativas.
- Lighthouse, en ejecución reproducible de CI: al menos 90 en rendimiento y 95 en accesibilidad, buenas prácticas y SEO en móvil para `/`, `/proyectos` y un artículo.
- LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 en el percentil 75 cuando exista suficiente tráfico real; antes de disponer de datos de campo se usan las pruebas de laboratorio como señal, no como garantía.
- El formulario entrega un mensaje de prueba en la cuenta configurada y no registra nombre, email ni cuerpo en logs.
- El despliegue registra el SHA publicado y supera una comprobación HTTPS de salud y una comprobación de la portada.

No se fijan métricas de conversión ni analítica en la v1 porque no se instala ningún sistema de seguimiento.

---

## 2. Usuarios y recorridos principales

### 2.1 Perfiles

**Cliente potencial.** Quiere saber qué problemas puede resolver Rodrigo, ver pruebas de experiencia y plantear un proyecto.

**Responsable de selección.** Quiere validar trayectoria, tecnologías, idiomas, ubicación, disponibilidad y descargar el CV.

**Perfil técnico.** Quiere revisar proyectos, decisiones de arquitectura y publicaciones para evaluar profundidad técnica.

**Buscador o agente de recuperación.** Necesita HTML semántico, URLs estables, datos estructurados y fragmentos autocontenidos para descubrir y citar la información correctamente.

### 2.2 Recorridos obligatorios

1. Portada → Sobre mí → Experiencia → Descargar CV.
2. Portada → Servicios → Proyecto relacionado → Contacto.
3. Portada → escribir o elegir una consulta → respuesta del portfolio → abrir URL canónica de la sección.
4. Portada → Proyectos → Leadia o Nami → proyecto externo cuando exista.
5. Portada → Bitácora → filtrar → leer artículo completo → volver al portfolio o contactar.
6. Cualquier ruta → cambiar tema → recargar → conservar tema.
7. Cualquier ruta → navegación solo con teclado y lector de pantalla.
8. Contacto → completar formulario → ver envío confirmado o un error accionable sin perder el texto.
9. URL canónica abierta sin JavaScript → leer el contenido principal y navegar por enlaces normales.

---

## 3. Alcance de la versión 1

### 3.1 Incluido

- Portada conversacional.
- Sobre mí, habilidades, servicios, experiencia, formación e intereses.
- Dos proyectos: Leadia y Nami.
- Bitácora con el único artículo cuyo cuerpo completo existe en el mockup: la comparación CrewAI, AutoGen y LangGraph.
- Navegación por preguntas y accesos rápidos mediante un enrutador determinista local.
- Cinco temas: Claro, Oscuro, Cobalto, Rioja y Bosque.
- Descarga del CV vigente.
- Contacto por formulario, email, teléfono y LinkedIn, cuando el dato esté confirmado para exposición pública.
- Páginas legales públicas.
- SEO técnico, datos estructurados, sitemap, robots y `llms.txt`.
- Docker local, despliegue Docker en Hetzner, CI y CD con GitHub Actions.
- Monitorización mínima de salud, logs técnicos sin contenido personal y rollback.

### 3.2 No incluido

- Cuentas, autenticación, panel de administración, CMS, base de datos o área privada.
- Un modelo generativo, RAG remoto o llamadas a una API de IA para el chat.
- Guardar conversaciones o historial entre visitas.
- Analítica, píxeles publicitarios, cookies no esenciales o personalización de marketing.
- Newsletter, comentarios, buscador global o multidioma.
- Micrófono o transcripción de voz.
- AI Toolkit. Su acceso aparece deshabilitado como «próximamente» y varios módulos usan resultados simulados; en producción se oculta por completo.
- Los cuatro artículos que solo tienen título y extracto, pero no cuerpo propio.
- Deep Research y Auditoría SEO/GEO: el mockup anima una respuesta fija y no realiza la operación indicada.
- Detector PII con “modelo NER local”: el prototipo solo aplica expresiones regulares y no debe afirmar algo que no ejecuta.

Cada elemento anterior necesita una especificación nueva antes de exponerse. El código de demostración del mockup no se porta por anticipado.

---

## 4. Arquitectura de información y URLs

Todas las URLs usan minúsculas y guiones, sin barra final salvo `/`; cualquier variante redirige permanentemente. La versión canónica no usa `www`.

| Ruta | Contenido | Indexación |
|---|---|---|
| `/` | Portada, propuesta de valor y navegación conversacional | Sí |
| `/sobre-mi` | Presentación, ubicación, disponibilidad, idiomas e intereses | Sí |
| `/habilidades` | Competencias agrupadas | Sí |
| `/servicios` | Seis servicios y CTA de contacto | Sí |
| `/experiencia` | Trayectoria completa | Sí |
| `/formacion` | Formación y certificaciones | Sí |
| `/proyectos` | Índice de proyectos | Sí |
| `/proyectos/leadia` | Caso Leadia | Sí |
| `/proyectos/nami` | Caso Nami, marcado como diseño | Sí |
| `/bitacora` | Índice de artículos publicados | Sí |
| `/bitacora/langgraph-para-agentes-en-produccion` | Artículo completo existente | Sí |
| `/contacto` | Canales y formulario | Sí |
| `/privacidad` | Información de protección de datos | Sí |
| `/cookies` | Política que explica la ausencia de cookies no esenciales | Sí |
| `/terminos` | Aviso legal y condiciones de uso | Sí |
| `/robots.txt` | Política de rastreo y enlace al sitemap | N/A |
| `/sitemap.xml` | Solo URLs canónicas indexables | N/A |
| `/llms.txt` | Resumen y enlaces canónicos para recuperación automatizada | N/A |
| `/api/contacto` | Recepción del formulario | No; `POST` únicamente |
| `/api/salud` | Estado mínimo del proceso | No |

El servidor redirige con 308:

- `http://*` a `https://*`.
- `https://www.rodrigovaldelvira.com/*` a `https://rodrigovaldelvira.com/*`, conservando ruta y query segura.
- Variantes conocidas del nombre del PDF a la URL estable definida en §8.4.

Una ruta desconocida devuelve un 404 real, con una página útil y enlaces a portada, proyectos y contacto. No se convierte silenciosamente en 200.

---

## 5. Modelo de contenido y fuente única

### 5.1 Regla general

El mismo dato no se mantiene en varias superficies. Una fuente de contenido versionada genera páginas, respuestas conversacionales, metadatos y datos estructurados.

- Copy corto y datos estructurados: `content/es.json` o un módulo TypeScript tipado equivalente.
- Artículos largos: Markdown/MDX sin HTML arbitrario en `content/bitacora/`.
- Activos originales: directorio de fuentes; los formatos optimizados se generan durante el build.
- Nunca se incrusta copy biográfico o profesional directamente en componentes de interfaz.

No se añade un CMS en la v1. Publicar o corregir contenido es un cambio revisado en Git.

### 5.2 Entidades mínimas

**Site:** nombre, dominio, idioma, descripción, imagen social, fecha de modificación y política de rastreo.

**Person:** nombre completo, nombre público, rol, resumen, ubicación, disponibilidad, idiomas, canales verificados y enlaces `sameAs` verificados.

**Experience:** rol, organización, ubicación/modalidad, fecha inicial, fecha final o actualidad, logros y orden.

**Education:** título, entidad, año o intervalo y descripción.

**SkillGroup:** nombre y lista ordenada. La escala de estrellas se conserva solo si Rodrigo confirma que es útil; debe tener alternativa textual comprensible y no presentarse como certificación.

**Service:** título, resumen, descripción completa y llamada a contacto.

**Project:** slug, estado, rol, descripción, tecnologías, imagen, URL opcional y CTA opcional.

**Article:** slug, título, extracto, categoría, fechas ISO, tiempo de lectura calculado, cuerpo, autor y estado `draft|published`.

**ConversationIntent:** expresiones normalizadas, destino canónico y respuesta resumida derivada de las entidades anteriores.

### 5.3 Integridad factual

- Nombre de entidad consistente: **Rodrigo Valdelvira Ortigosa**. “Rodrigo Valdelvira” puede usarse como nombre corto visible.
- Rol principal: **AI Engineer**; Data Scientist puede aparecer como competencia o rol histórico.
- Cidatum: diciembre de 2025 a actualidad.
- TalentTools: abril de 2021 a diciembre de 2025. El `HOY` del HTML está obsoleto y no se porta.
- La cifra “15+ años” es válida como experiencia profesional total; no debe presentarse como 15 años de experiencia en IA.
- Nami permanece como proyecto en fase de diseño y no muestra enlace externo vacío.
- Los nombres de clientes, resultados cuantitativos y detalles de proyectos solo se publican si Rodrigo confirma que no están sujetos a confidencialidad.
- No se inventan URLs de GitHub, Instagram, Facebook ni otros perfiles a partir de los iconos del CV.
- Los textos legales del mockup son borradores, no una validación jurídica.

**VALIDACIÓN HUMANA obligatoria antes de producción:** datos públicos de contacto, estado laboral, certificados, cifra del 65 %, permiso para mencionar clientes/proyectos y copy legal.

---

## 6. Experiencia visual y responsive

### 6.1 Contrato visual

La spec `000-esqueleto-visual-funcional` es propietaria del contrato visual completo. La jerarquía, composición, sistema tipográfico, espaciado, tamaños, paleta, radios, bordes, sombras, iconografía, tratamiento de imágenes, personalidad editorial y patrón conversacional proceden de `mockup/Portfolio Conversacional.html`; no son inspiración ni una referencia aproximada:

- Tipografía de titulares Gabarito.
- Texto Hanken Grotesk.
- Elementos técnicos IBM Plex Mono.
- Superficies suaves, bordes finos, botones redondeados, fotografía recortada en escala de grises y acento de color por tema.
- Portada centrada con saludo, H1, propuesta, retrato y dos CTA.
- Respuestas en forma de conversación, con avatar y tarjetas.
- Barra de consulta persistente sin tapar el contenido.

La primera entrega reproduce todos los estados de referencia declarados en `design/golden.config.json`, no únicamente la portada. Incluye portada, menú de temas, Sobre mí, Habilidades, Servicios, Proyectos, detalle de proyecto, Experiencia, Formación, Contacto, Bitácora, artículo y una muestra legal, en escritorio y móvil donde se haya declarado captura. Los activos visuales de `mockup/` se reutilizan como fuentes, sin sustituciones "parecidas".

Las diferencias exigidas por esta especificación —por ejemplo, retirar micrófono, Toolkit y banner de cookies; corregir contenido falso; convertir modales en URLs; o mejorar accesibilidad y responsive— se resuelven conservando el mismo lenguaje gráfico. Cada diferencia visible debe constar en el registro de excepciones de la spec `000` con requisito de origen, estado afectado y evidencia antes/después. No se acepta una reinterpretación estética por preferencia del implementador.

Las fuentes se sirven localmente en WOFF2. Producción no solicita Google Fonts ni otro CDN.

### 6.2 Temas

Se portan los tokens del mockup para Claro, Oscuro, Cobalto, Rioja y Bosque. Rioja es el tema inicial. La selección se conserva en `localStorage` con la clave `rv_theme` y se aplica antes de pintar para evitar parpadeo.

Cada combinación se valida contra WCAG 2.2 AA. Si un color del mockup no alcanza contraste, prevalece accesibilidad y se registra el ajuste del token; no se corrige localmente en un componente.

### 6.3 Reglas responsive

- Soporte desde 320 px de ancho hasta pantallas de escritorio grandes.
- Se usan unidades de viewport dinámicas; el teclado móvil no puede ocultar el campo ni la respuesta activa.
- En móvil se simplifican etiquetas auxiliares, pero nunca desaparece una acción esencial.
- No hay scroll horizontal a 320 px ni con zoom al 200 %.
- Las tarjetas de proyectos, experiencia, servicios y formación pasan a una columna cuando lo requiera el contenido, no por detección de dispositivo.
- Imágenes con dimensiones explícitas y `srcset`; la foto original de aproximadamente 1 MB se optimiza a AVIF/WebP con fallback y tamaños responsivos.

### 6.4 Movimiento

Se conservan transiciones breves y las animaciones de entrada cuando no retrasan la tarea. `prefers-reduced-motion: reduce` elimina streaming visual, desplazamiento animado, flotación y pulsos. Ninguna información depende de una animación.

### 6.5 Verificación mecánica de fidelidad

La fidelidad visual de la spec `000` es una puerta bloqueante y reproducible:

- Las capturas golden se generan desde el mockup cuyo hash consta en §0.2 y se versionan. CI no las regenera ni las acepta automáticamente.
- Golden y aplicación se capturan con la misma versión fijada de Chromium, DPR 1, viewport, fuentes WOFF2 locales, tema, contenido, reloj y movimiento congelado.
- Cada escena declara ruta, precondición, viewport, nombre estable y modo de comparación en `design/golden.config.json`.
- Los tokens de color deben coincidir exactamente con `design/tokens.json`, salvo ajustes de contraste registrados.
- El modo `pixel` se usa cuando contenido y estructura son equivalentes. Tras ignorar únicamente el antialiasing definido por la herramienta, como máximo el 0,5 % de los píxeles puede superar el umbral perceptual configurado. Una escena por encima falla aunque el promedio global quede por debajo.
- El modo `contract` sólo se permite cuando esta especificación obliga a cambiar contenido o retirar una función del mockup. Compara de forma exacta tokens, fuentes, pesos, radios, bordes, sombras y activos; y exige que los anclajes principales —cabecera, H1, retrato, CTA, tarjetas, barra de consulta y footer— no se desvíen más de 2 CSS px en posición o tamaño. La escena declara la variación autorizada; `contract` no es una tolerancia visual genérica.
- La preparación del golden puede ocultar exclusivamente controles que §3.2 retira de producción y debe quedar versionada en `design/golden.config.json`; no puede alterar estilos para aproximar el resultado candidato.
- No se permiten máscaras sobre contenido estable. Una región realmente dinámica se documenta y aprueba de forma individual; los cambios editoriales se verifican con `contract`, no ocultándolos.
- El informe conserva golden, captura candidata, imagen de diferencias, métricas y versión del navegador como evidencia de cierre.
- Además de la comparación automática, Rodrigo revisa en la spec `000` escritorio y móvil. La aprobación humana no sustituye una comparación fallida.

Las specs `010` y `020` ejecutan la misma suite para demostrar que añadir lógica no alteró el diseño. Actualizar el golden para hacer pasar un cambio requiere una decisión de producto explícita; nunca forma parte automática de una corrección.

---

## 7. Navegación conversacional

### 7.1 Principio

La interfaz conversacional es una navegación enriquecida sobre contenido cerrado. **NO NEGOCIABLE:** no se llama a un LLM, no se envía la consulta a servidor y no se presenta una respuesta inventada.

La interfaz se identifica como “navegación del portfolio” o “asistente del portfolio”, no como IA generativa. El indicador del mockup “razonando / recuperando contexto” se sustituye por una descripción veraz, como “buscando en el portfolio”.

### 7.2 Comportamiento

- Los accesos Sobre mí, Habilidades, Servicios, Proyectos, Experiencia, Formación y Contacto son enlaces reales a sus rutas canónicas.
- Con JavaScript, pueden abrir el contenido con la transición conversacional y actualizar la URL mediante History API.
- Sin JavaScript, navegan normalmente a la página de destino.
- La entrada libre normaliza mayúsculas, acentos y espacios, y resuelve únicamente los intentos definidos en contenido.
- Enter envía; Shift+Enter inserta salto de línea.
- Consultas vacías no crean mensajes.
- Longitud máxima: 300 caracteres, indicada de forma accesible al alcanzar el límite.
- Para una intención conocida se muestra un resumen breve y un enlace claro “Ver página completa”.
- Para una intención desconocida se reconoce el límite y se ofrecen destinos reales. No se improvisa.
- El historial vive solo en memoria de la pestaña y se elimina al volver al inicio o recargar.
- Las consultas no se registran, no se mandan por red y no alimentan analítica.
- El scroll automático solo se produce tras acción del usuario, respeta movimiento reducido y no roba el foco.

### 7.3 Intenciones mínimas

Sobre mí; habilidades/stack; servicios/ayuda; proyectos/casos; Leadia/voz; Nami; experiencia/CV; Cidatum; TalentTools/InclunIA; formación/estudios; idiomas; intereses; contacto/email/teléfono/LinkedIn; LangGraph/CrewAI/AutoGen/bitácora.

### 7.4 Estados

Inicial, consulta escrita, destino conocido, destino desconocido, navegación a detalle y vuelta a inicio. No existe un estado de error de red porque esta función no usa red.

El micrófono simulado del mockup se oculta. No se muestra como deshabilitado y no se solicita permiso de audio.

---

## 8. Requisitos funcionales por superficie

### 8.1 Portada y cabecera

- Un único H1 visible: “Soy Rodrigo, AI Engineer”.
- Propuesta breve que diferencia experiencia total de experiencia específica en IA.
- CTA primario a Sobre mí y secundario a Proyectos.
- En las rutas internas, logotipo/avatar y nombre enlazan a `/`.
- Selector de tema con nombre, muestra visual, estado actual y cierre por Escape/clic exterior.
- Cabecera y footer no ocultan el foco ni el contenido.

### 8.2 Perfil, experiencia, habilidades, servicios y formación

- Cada sección es una página pre-renderizada y una respuesta invocable desde la portada.
- Experiencia y formación usan controles expandibles con estado, nombre accesible y navegación de teclado.
- Los detalles esenciales también pueden leerse sin expandir o sin JavaScript.
- Cada servicio tiene una descripción completa y un CTA que llega a `/contacto` con el asunto preseleccionado localmente.
- Los canales públicos se muestran como enlaces semánticos (`mailto:`, `tel:` y HTTPS) y con texto visible, no solo iconos.

### 8.3 Proyectos

- El índice contiene exactamente Leadia y Nami mientras no se apruebe otro proyecto.
- Cada tarjeta abre una URL propia y puede recorrerse por teclado.
- Leadia enlaza a `https://leadia.es` en pestaña nueva con `noopener noreferrer`.
- Nami no representa un enlace si no tiene URL; muestra de forma explícita “En fase de diseño”.
- El carrusel conversacional permite anterior/siguiente, anuncia posición (“Proyecto 1 de 2”) y no es la única forma de acceso.
- Un fallo al cargar imagen muestra un fallback estable sin desplazar el layout.

### 8.4 CV

- El fichero fuente vigente es `mockup/Rodrigo_Valdelvira_CV_AI_Engineer.pdf`.
- Se publica en la URL estable `/Rodrigo-Valdelvira-CV.pdf`; el nombre enlazado por el mockup actualmente no existe y debe corregirse.
- Todos los CTA descargan el mismo fichero y usan un nombre de descarga descriptivo.
- El PDF conserva texto seleccionable y etiquetado existente.
- La respuesta incluye `Content-Type: application/pdf`, `Content-Disposition` apropiado y `X-Robots-Tag: noindex, noarchive` para evitar duplicar el contenido del sitio y ampliar innecesariamente la exposición de datos personales.

### 8.5 Bitácora

- El índice solo muestra artículos `published` con cuerpo completo.
- En v1 se publica “Cómo evalué tres frameworks de agentes antes de elegir LangGraph”, con el cuerpo que existe en el mockup y un slug canónico estable.
- Los otros cuatro metadatos quedan como borradores no enlazados, fuera del sitemap y fuera del bundle público.
- Filtro por categoría actualiza la lista visible y tiene alternativa accesible.
- Cada artículo tiene autor, fechas, categoría, tiempo de lectura calculado, encabezados jerárquicos y enlace permanente.
- El contenido mostrado debe corresponder al título seleccionado. El defecto del prototipo que abre el mismo cuerpo para cualquier tarjeta no se porta.
- El bloque “pregúntame sobre esto” lleva al intent correspondiente de la portada; no afirma que un agente haya indexado el texto.
- Código, citas y afirmaciones se revisan editorialmente. Una cita propia se identifica como tal; no se atribuye a terceros sin fuente.

### 8.6 Contacto

Canales visibles: email, teléfono, LinkedIn y ubicación/remoto, sujetos a la validación de §5.3.

El formulario contiene:

- Nombre: 2–80 caracteres.
- Email: formato válido, máximo 254 caracteres.
- Mensaje: 20–3000 caracteres.
- Campo honeypot invisible para personas y fuera del orden de foco.
- Aviso breve de privacidad con enlace a `/privacidad`.
- Botón con estados inactivo, enviando, enviado y error.

El endpoint `POST /api/contacto`:

- Acepta solo `application/json` y un cuerpo máximo de 8 KiB.
- Valida de nuevo todos los campos en servidor y rechaza campos inesperados.
- Comprueba `Origin`/`Host` permitidos.
- Aplica límite por IP efectiva confiable: 5 intentos cada 15 minutos y límite global defensivo. No persiste la IP.
- El cliente genera una clave de idempotencia por intento y desactiva el botón mientras envía; el proceso conserva brevemente las claves aceptadas para evitar duplicados por doble clic o reintento inmediato.
- Rechaza el honeypot de forma indistinguible de un envío normal para el bot.
- Impone timeout al proveedor SMTP y no reintenta indefinidamente.
- Envía un único email a `CONTACT_TO`. No manda respuesta automática al remitente.
- Usa un remitente fijo del dominio; el email del visitante solo aparece como `Reply-To`, tras impedir inyección CRLF.
- Trata el mensaje como texto plano; nunca lo renderiza como HTML confiable.
- No registra el payload, el email, el nombre, el mensaje ni cabeceras completas.
- Devuelve 202 solo cuando el proveedor acepta el mensaje, 400 para entrada inválida, 429 para exceso y 503 para fallo temporal, con textos genéricos.

Si falla el envío, la interfaz conserva los campos, explica que no se ha enviado y ofrece el enlace de email. Nunca muestra el éxito de demostración actual.

### 8.7 Legal, cookies y errores

- Privacidad, cookies y términos son páginas enlazables, no contenido exclusivo de un modal.
- No se muestra banner de cookies: la v1 no usa cookies ni almacenamiento no esencial. La preferencia de tema en `localStorage` se documenta en `/cookies`.
- Si se añade analítica, embeds, CAPTCHA o tracking, el banner y la política se vuelven a especificar antes de integrar.
- El 404 y el error inesperado mantienen el sistema visual, no filtran trazas y ofrecen recuperación.
- **VALIDACIÓN HUMANA:** una revisión jurídica confirma identidad del responsable, base legal, conservación y derechos antes de producción.

---

## 9. Accesibilidad

Objetivo: **WCAG 2.2 nivel AA** en todas las rutas y temas.

### 9.1 Requisitos verificables

- HTML semántico con `lang="es"`, landmarks, un H1 por página y jerarquía sin saltos arbitrarios.
- Enlace “Saltar al contenido” visible al foco.
- Todas las funciones operables con teclado, sin trampas y con foco visible.
- Los diálogos, si se usan como mejora, bloquean foco, tienen nombre, cierran con Escape y devuelven foco al disparador. La URL canónica sigue disponible.
- Los targets interactivos alcanzan al menos 24 × 24 CSS px y tienen separación suficiente; acciones principales apuntan a 44 × 44 px.
- Contraste AA de texto, iconos informativos, bordes de controles y foco en los cinco temas.
- No se usa color, posición, icono ni número de estrellas como única forma de comunicar significado.
- Inputs con `label` visible, `autocomplete`, propósito correcto, errores asociados con `aria-describedby` y resumen de error.
- Los estados de envío se anuncian con una región viva no intrusiva; no se anuncia cada carácter del efecto de escritura.
- Imágenes informativas con texto alternativo; adornos con `alt=""`.
- El retrato se describe como “Retrato de Rodrigo Valdelvira”. Las capturas de producto describen lo que aportan.
- Zoom 200 %, reflow a 320 CSS px y tamaños de texto del sistema sin pérdida de función.
- `prefers-reduced-motion` y `prefers-contrast` se respetan cuando el navegador los exponga.
- La experiencia principal no requiere voz, arrastre, hover ni precisión motora.

Las pruebas automáticas son una puerta, no sustituyen una revisión manual con teclado, VoiceOver/NVDA y móvil.

---

## 10. SEO técnico y optimización para recuperación por LLM

### 10.1 Principio

No existe una técnica separada que sustituya al SEO técnico y al contenido fiable. Se priorizan HTML rastreable, entidad consistente, fuentes primarias, páginas autocontenidas, enlaces estables y datos estructurados que coinciden con lo visible.

### 10.2 Renderizado e indexabilidad

- El contenido principal, navegación, metadatos y JSON-LD se generan en servidor/build; no dependen de hidratación.
- Respuesta 200 solo para recursos existentes; redirecciones 308; 404/410 reales.
- Canonical absoluto y único por página.
- Título y descripción únicos, en español, y coherentes con el H1.
- `robots.txt` referencia `https://rodrigovaldelvira.com/sitemap.xml`.
- `sitemap.xml` usa URLs absolutas y fechas de modificación reales; excluye API, drafts, estados de UI y parámetros.
- No hay páginas huérfanas: toda URL indexable se alcanza desde navegación o enlaces de contenido.
- Open Graph y Twitter Cards con imagen social optimizada de 1200 × 630, título, descripción, URL y alt.
- Favicon, iconos y manifest no contienen recursos rotos.
- No se bloquean CSS, fuentes o imágenes necesarias para comprender la página.

### 10.3 Datos estructurados

Los datos JSON-LD se generan desde la fuente única y se validan en CI:

- Portada: `WebSite` y `Person` enlazados por `@id`.
- `/sobre-mi`: `ProfilePage` cuyo `mainEntity` es la misma `Person`.
- Proyectos: `CreativeWork` o `SoftwareApplication` únicamente cuando sus propiedades son veraces.
- Artículo: `BlogPosting` con autor, fechas, titular, descripción, URL e imagen.
- Rutas internas: `BreadcrumbList` cuando la miga es visible.

No se añade `FAQPage`, valoraciones, clientes, premios ni credenciales solo para obtener un resultado enriquecido. Todo marcado debe existir en la página y poder demostrarse.

### 10.4 Contenido citable

- Cada página abre con una respuesta directa de 1–3 frases que se entiende fuera de contexto.
- Servicios, experiencia y proyectos usan encabezados descriptivos y hechos concretos.
- Las afirmaciones cuantitativas indican contexto; las fechas usan valores ISO en metadatos.
- Los artículos separan hechos, experiencia personal y opinión, y enlazan fuentes primarias cuando hacen afirmaciones externas.
- La biografía, el rol y el nombre tienen una formulación coherente en portada, perfil, metadatos, JSON-LD y `llms.txt`.
- `sameAs` solo incluye perfiles cuya URL ha sido comprobada.
- No se generan páginas masivas, texto oculto, keyword stuffing, contenido sintético sin revisión ni variantes duplicadas para distintos bots.

### 10.5 `llms.txt` y crawlers

- Se publica `/llms.txt` en Markdown, generado desde el contenido: nombre, resumen factual, idioma, fecha de actualización y enlaces a perfil, servicios, proyectos y artículos.
- `llms.txt` se trata como una ayuda experimental, no como estándar consolidado ni factor de ranking.
- `OAI-SearchBot` y otros crawlers de búsqueda/citación legítimos pueden acceder a las páginas públicas.
- La decisión de permitir entrenamiento se expresa por separado. Valor predeterminado de esta especificación: permitir `OAI-SearchBot` y **bloquear `GPTBot`**, para favorecer descubrimiento sin autorizar entrenamiento por defecto.
- Ningún WAF, challenge JavaScript o regla de rate limit bloquea accidentalmente los recursos públicos de crawlers verificados.
- Contacto y salud se excluyen del rastreo; el formulario conserva protección antiabuso.

### 10.6 Metadatos base de la entidad

- Nombre: `Rodrigo Valdelvira Ortigosa`.
- Nombre público: `Rodrigo Valdelvira`.
- Descripción base: `AI Engineer en Logroño especializado en agentes de IA, sistemas RAG, datos, MLOps y puesta en producción.`
- URL: `https://rodrigovaldelvira.com`.
- Idioma: `es-ES`.

El copy final se valida editorialmente; las variantes de título se prueban sin cambiar la identidad ni prometer capacidades no demostradas.

---

## 11. Seguridad y privacidad

### 11.1 Estándar y modelo de riesgo

La línea base es OWASP Top 10:2025 y OWASP ASVS 5.0.0 nivel 1. El portfolio es público, sin cuentas ni datos sensibles persistidos; el formulario es su única frontera de entrada y datos personales.

Antes de implementar se documenta un modelo de amenazas pequeño que cubra: abuso del formulario, inyección en email/logs, XSS desde Markdown, secretos SMTP, compromiso de dependencias o Actions, suplantación del proxy, despliegue no autorizado y denegación de servicio básica.

### 11.2 Cobertura OWASP Top 10:2025

| Categoría | Controles exigidos |
|---|---|
| A01 Control de acceso roto | Solo `POST` en contacto; API y rutas internas no exponen ficheros, secretos ni operaciones administrativas; usuario de despliegue con mínimo privilegio. |
| A02 Configuración insegura | HTTPS, headers, errores genéricos, sin directory listing, sin source maps públicos, modo producción, contenedor read-only y servicio interno ligado a loopback. |
| A03 Cadena de suministro | Lockfile congelado, dependencias y acciones fijadas, audit, CodeQL, Gitleaks, Trivy, SBOM y revisión de actualizaciones. |
| A04 Fallos criptográficos | TLS 1.2 mínimo y 1.3 preferente; claves SSH modernas; secretos solo en servidor/GitHub Environment; nunca secretos en cliente o repositorio. |
| A05 Inyección | Validación por esquema, React escaping, Markdown sin HTML arbitrario, cabeceras de email construidas con biblioteca segura, rechazo CRLF y CSP estricta. |
| A06 Diseño inseguro | Modelo de amenazas, límites explícitos, sin LLM ni scraping, sin almacenar conversación, fail closed en configuración de producción. |
| A07 Fallos de autenticación | La web no autentica usuarios. SSH deshabilita contraseña y root; GitHub Environment limita quién despliega. |
| A08 Integridad de software/datos | Imagen identificada por SHA/digest, Actions fijadas por SHA completo, build reproducible y rollback a imagen anterior. |
| A09 Logging y alertas | Logs de salud, despliegue y errores técnicos; sin payload de contacto ni secretos; rotación y comprobación post-deploy. |
| A10 Condiciones excepcionales | Timeouts, tamaños máximos, mensajes correctos, healthcheck, parada limpia y rollback automático ante fallo. |

### 11.3 Cabeceras HTTP

Producción debe emitir, como mínimo:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
X-Frame-Options: DENY
```

No se permite `unsafe-eval`. `unsafe-inline` tampoco se permite; se usan CSS y scripts propios externos. Si el framework obliga a emitir un script inline, se autoriza únicamente con un nonce distinto por respuesta, sin ampliar el resto de la política. HSTS `preload` solo se solicita después de verificar que todos los subdominios funcionan permanentemente por HTTPS.

### 11.4 Secretos y datos

- Secretos SMTP y credenciales de despliegue nunca se envían al navegador, no viven en `.env` versionado y no se imprimen.
- Producción lee secretos de un fichero restringido preaprovisionado en Hetzner (`chmod 600`) o secretos Docker equivalentes.
- GitHub Actions no transporta un blob completo de `.env` en cada despliegue.
- El sitio no persiste los formularios. La conservación posterior en el buzón y el proveedor SMTP se explica en privacidad.
- Se minimizan logs del proxy y se excluyen query strings sensibles.
- Los mensajes del chat local nunca salen del dispositivo.
- No se cargan scripts, fuentes, embeds o recursos de terceros salvo enlaces activados por el usuario.

### 11.5 Puertas bloqueantes

- `pnpm audit --prod` corta en vulnerabilidades altas o críticas, con excepción temporal documentada y fecha de caducidad.
- Gitleaks escanea historial completo.
- CodeQL analiza JavaScript/TypeScript.
- Trivy escanea sistema operativo y dependencias de la imagen y corta en alta/crítica corregible.
- La imagen se inspecciona para confirmar usuario no root.
- Prueba automatizada de cabeceras y CSP en la imagen ejecutándose.
- Pruebas de abuso de formulario: payload grande, campos extra, CRLF, HTML, origen ajeno, ráfaga y caída SMTP.
- Acciones externas de GitHub fijadas por SHA completo, con comentario de versión humana.

---

## 12. Arquitectura técnica mínima

### 12.1 Decisión

**NO NEGOCIABLE para la v1:** una sola aplicación TypeScript, un solo proceso de producción y un solo contenedor de aplicación. Renderizado estático/servidor para contenido y una ruta servidor para contacto. Sin microservicios, cola, Redis, base de datos, Kubernetes, Terraform o CMS.

La elección concreta del framework se cierra en el plan de la spec 000. Debe demostrar:

- Pre-renderizado real de todas las rutas públicas.
- JavaScript cliente selectivo para conversación, temas, filtros y expansiones.
- Endpoint de contacto y salud dentro del mismo proceso.
- Build standalone apto para contenedor no root.
- CSP estricta sin relajar seguridad.

La recomendación por defecto es **Next.js App Router con TypeScript estricto y salida standalone**, porque concentra páginas, metadatos, rutas y endpoint en una aplicación. El plan puede escoger Astro con adaptador Node si prueba menor JavaScript y la misma simplicidad operativa; no puede abrir una tercera alternativa sin un bloqueo demostrado.

### 12.2 Estructura conceptual

```text
Navegador
  ├─ HTML pre-renderizado: perfil, servicios, proyectos, bitácora, legal
  ├─ interacción local: chat determinista, tema, filtros, acordeones
  └─ POST /api/contacto
               │
               ▼
Aplicación Node única ── SMTP autenticado ── buzón de Rodrigo
               │
               └─ GET /api/salud

Internet ── Caddy en Hetzner ── 127.0.0.1:3000 ── contenedor portfolio
```

### 12.3 Dependencias

Solo se admiten dependencias que resuelvan una necesidad de esta especificación. Como máximo se espera: framework, validador de esquema, transporte SMTP y herramientas de pruebas/build. El enrutador conversacional, themes y filtros no justifican librerías propias.

Las versiones se fijan en lockfile. Node usa una versión LTS soportada en el momento de implementar, fijada por versión y digest en Docker; no se congela aquí un Node obsoleto por anticipado.

---

## 13. Docker local

### 13.1 Artefactos

- `Dockerfile` multi-etapa en la raíz o `docker/Dockerfile.web`.
- `compose.yaml` como interfaz común local y base de producción.
- `.dockerignore` que excluye Git, mockup, caches, secretos, tests y `node_modules` anidados.
- `.env.example` solo con nombres y valores no secretos.

Los artefactos ejecutables heredados ya se retiraron. `docker/README.md` conserva este contrato sin imponer un runtime; la spec 000 crea el Dockerfile y Compose definitivos. La v1 del portfolio no levanta una base de datos.

### 13.2 Contrato local

```bash
docker compose up --build
```

Debe:

- Construir desde checkout limpio.
- Servir en `http://localhost:3000`.
- Funcionar sin credenciales SMTP en modo desarrollo: el formulario queda claramente no disponible y ofrece el enlace de email; nunca simula éxito.
- Exponer `/api/salud` con 200 y un cuerpo mínimo como `{"status":"ok"}`.
- Parar limpiamente con `docker compose down` sin perder datos, porque no existen volúmenes de aplicación.

### 13.3 Endurecimiento de imagen

- Multi-stage; compiladores y código fuente innecesario no llegan a runtime.
- Base mínima fijada por digest.
- Usuario UID/GID dedicado no root.
- `NODE_ENV=production` y solo dependencias de runtime.
- Las variantes de imagen se generan en build; el servidor no necesita escribir una caché de optimización en runtime.
- `HEALTHCHECK` contra loopback.
- Soporte de señales y parada limpia.
- Root filesystem read-only en Compose, `/tmp` como `tmpfs`, `cap_drop: ALL` y `no-new-privileges:true`.
- Sin shell o paquetes extra en runtime cuando la alternativa elegida lo permita.

---

## 14. Producción en Hetzner

### 14.1 Topología

- Servidor lógico: `hetzner`.
- Usuario dedicado: `deploy`, sin login por contraseña, sin login root y con permiso limitado para Docker y el directorio del portfolio.
- Directorio: `/srv/portfolio`, propiedad del usuario de despliegue.
- Aplicación Docker ligada solo a `127.0.0.1:3000`.
- Caddy instalado como servicio del host, delante del contenedor, gestionando HTTPS y redirecciones.
- Firewall: 80/443 públicos; SSH con claves, protección anti-fuerza-bruta y restricción de origen cuando la operativa lo permita.
- DNS A y, si existe conectividad IPv6 probada, AAAA del dominio raíz; `www` apunta al mismo servidor para redirigir.

Caddy se elige por su gestión automática de certificados y renovación. Su configuración y los secretos de producción se provisionan una sola vez fuera del workflow.

### 14.2 Configuración persistente

En `/srv/portfolio` viven únicamente:

- `compose.production.yaml` versionado o copiado desde un artefacto verificado.
- `.env.production` restringido y no versionado.
- `.deployed-image`, que contiene la referencia inmutable actual.
- `.previous-image`, para rollback.

No hay base de datos ni uploads; el contenido está en la imagen. Certificados y estado de Caddy se respaldan según la administración general del servidor, pero pueden regenerarse.

### 14.3 TLS y proxy

- Caddy obtiene y renueva certificados cuando DNS y 80/443 están disponibles.
- Redirige HTTP a HTTPS y `www` al dominio raíz.
- Proxy a `127.0.0.1:3000` con timeouts finitos.
- No confía en `X-Forwarded-For` procedente de Internet; la aplicación solo confía en el proxy local.
- Las cabeceras de seguridad se establecen en aplicación y se verifican desde Internet; Caddy puede reforzarlas sin duplicados contradictorios.

### 14.4 Operación

- El contenedor reinicia `unless-stopped` y tiene healthcheck.
- Logs Docker rotan por tamaño y número de ficheros.
- El endpoint de salud no informa versiones, secretos, hostname ni estado SMTP.
- Tras cada despliegue se comprueban salud, portada, canonical y cabeceras por HTTPS.
- Rollback usa la imagen anterior, sin reconstruir ni hacer `git reset` en producción.
- Se conservan al menos la imagen actual y la anterior; la limpieza nunca elimina la imagen necesaria para rollback.

---

## 15. GitHub Actions · `.github/workflows/deploy.yml`

### 15.1 Relación con el mockup

`mockup/deploy.yml` aporta la intención: despliegue en `main`, ejecución manual, exclusión mutua, SSH con fingerprint y Docker Compose. No se copia literalmente porque reconstruye desde un checkout mutable en el servidor, ejecuta `git reset --hard`/`git clean`, transmite todo el entorno como `BACKEND_ENV` y no garantiza que la verificación termine antes de publicar. Su grupo de concurrencia ya se neutralizó como `deploy-portfolio-production` para que la referencia tampoco conserve nombres de otro entorno.

### 15.2 Disparadores y permisos

- `push` a `main` y `workflow_dispatch`.
- No usar `paths-ignore` para ocultar cambios del propio workflow o de infraestructura.
- `concurrency.group: portfolio-production`, `cancel-in-progress: false`.
- GitHub Environment `production` con URL `https://rodrigovaldelvira.com`, rama `main` protegida y aprobación si el plan de GitHub lo permite.
- Permisos por defecto `contents: read`; `packages: write` solo en el job que publica imagen; `id-token: write` solo si se usa attestación/OIDC.
- PRs de forks nunca acceden a secretos ni despliegan.

### 15.3 Jobs mínimos

```text
verify ──> build_and_publish ──> deploy ──> verify_production
```

**verify**

- Checkout con historial necesario para secretos.
- Instalación desde lockfile congelado.
- Typecheck, lint, unitarias, integración y build.
- Validación de contenido, enlaces, JSON-LD, sitemap, robots y `llms.txt`.
- Pruebas de accesibilidad y e2e representativas.
- Audit, Gitleaks y CodeQL.

**build_and_publish**

- Construye una vez la imagen de producción.
- Etiqueta inmutable con `${{ github.sha }}`; `latest` puede existir solo como alias, nunca como entrada de despliegue.
- Genera provenance/SBOM cuando el builder lo soporte.
- Escanea con Trivy antes de desplegar.
- Publica en GHCR con `GITHUB_TOKEN` y referencia por digest.

**deploy**

- Solo después de los jobs anteriores.
- Usa una acción SSH fijada por SHA completo y valida `SSH_FINGERPRINT`.
- Copia el `compose.production.yaml` del commit verificado a un fichero remoto temporal, valida su configuración y lo sustituye de forma atómica; no copia `.env.production` ni Caddy.
- Envía la referencia/digest de imagen, no el contenido de secretos de la aplicación.
- En Hetzner: comprueba directorio y ficheros, guarda referencia anterior, hace pull, levanta con `docker compose up -d --wait --remove-orphans` y espera un tiempo limitado.
- Si falla salud, restaura la referencia anterior, vuelve a levantar y termina el workflow como fallido.
- Si funciona, actualiza `.deployed-image` de forma atómica.

**verify_production**

- `curl --fail --proto '=https'` a `/api/salud` y `/`.
- Comprueba dominio canónico, redirección `www`, HSTS, CSP, `X-Content-Type-Options` y que el HTML contiene el H1.
- Registra SHA, digest y URL en el resumen de GitHub Actions.

### 15.4 Secretos y variables

GitHub Environment `production`:

| Nombre | Tipo | Uso |
|---|---|---|
| `SSH_HOST` | secret | IP/host real de Hetzner |
| `SSH_PORT` | variable o secret | Puerto SSH |
| `SSH_USER` | variable | `deploy` |
| `SSH_PRIVATE_KEY` | secret | Clave exclusiva del workflow, sin reutilizar la personal |
| `SSH_FINGERPRINT` | variable/secret | Huella verificada del host |

Los secretos `SMTP_*` y `CONTACT_TO` están preaprovisionados en Hetzner. Si GHCR es privado, el servidor usa un token read-only almacenado una vez; el workflow no lo reenvía en cada ejecución.

Todas las acciones de terceros se fijan a SHA completo. Dependabot o Renovate puede proponer su actualización, pero no se acepta automáticamente un cambio de acción de despliegue.

---

## 16. Observabilidad, continuidad y mantenimiento

### 16.1 Logs

- Formato estructurado con timestamp, nivel, evento, status, latencia y request ID generado.
- No incluir cuerpo, nombre, email, query completa, cookies, claves, tokens o stack traces en respuesta.
- El proxy puede registrar ruta normalizada, status y latencia; `/api/contacto` se registra sin query ni cuerpo.
- Rotación Docker: tamaño y número limitados para no llenar el disco.

### 16.2 Salud y alertas

- `/api/salud` valida que el proceso atiende; no prueba SMTP en cada llamada.
- La verificación post-deploy es obligatoria.
- Una comprobación externa sencilla puede consultar salud cada 5 minutos y avisar por un canal definido por Rodrigo. No se instala APM en la v1.
- Fallos SMTP se cuentan como evento técnico sin datos del mensaje y deben ser visibles en logs/alerta.

### 16.3 Backups y recuperación

No hay datos de aplicación que respaldar. Código y contenido viven en Git; imágenes en GHCR; configuración y secretos se respaldan cifrados mediante el procedimiento del servidor. La prueba de recuperación consiste en desplegar la imagen anterior en un host limpio con la configuración preaprovisionada.

### 16.4 Mantenimiento

- Revisión mensual de dependencias y trimestral de contenido profesional.
- Renovación de dominio y DNS con alerta previa.
- Prueba automática de certificado y enlaces externos.
- Una vacante, puesto terminado, nuevo proyecto o cambio de contacto actualiza primero la fuente única, que regenera todas las superficies.

---

## 17. Estrategia de pruebas

### 17.1 Unitarias

- Normalización y resolución de intenciones, incluidos acentos y colisiones.
- Esquemas de contenido y unicidad de slugs.
- Cálculo de tiempo de lectura y fechas.
- Validación de contacto, honeypot, límites y cabeceras seguras.
- Generación de canonical, JSON-LD, sitemap, robots y `llms.txt`.

### 17.2 Integración

- Contacto contra SMTP de prueba: éxito, rechazo, timeout y mensaje no registrado.
- Headers y CSP con la aplicación empaquetada.
- Todas las rutas y assets desde un build limpio.
- PDF servido con nombre, headers y hash esperados.

### 17.3 End to end

- Recorridos de §2.2 en Chromium y al menos un motor adicional.
- Viewports 390 × 844 y 1440 × 900; comprobación adicional a 320 px.
- Con JavaScript y con JavaScript desactivado.
- Teclado completo, orden de foco, Escape, back/forward y recarga en ruta interna.
- Los cinco temas y `prefers-reduced-motion`.
- Formulario con servidor SMTP de prueba y fallo controlado.

### 17.4 Visuales

- Golden de portada, selector de tema, respuestas Sobre mí, Habilidades, Servicios, Proyectos, detalle de proyecto, Experiencia, Formación, Contacto, Bitácora, artículo y una superficie legal.
- Portada móvil y escritorio en Rioja; portada y controles críticos en los otros cuatro temas.
- Comparación por escena conforme a §6.5, con anclajes, umbral perceptual, imagen de diferencias e informe reproducible.
- Prueba de que las fuentes se sirven localmente y de que ninguna captura depende de red de terceros.
- Revisión humana de la spec `000` en 390 × 844 y 1440 × 900, y comprobación adicional a 320 px y zoom 200 %.
- No se actualizan capturas automáticamente para hacer pasar CI. Un golden nuevo exige aprobación y trazabilidad.

### 17.5 Seguridad y calidad

- Axe u otra herramienta equivalente sin impacto crítico/serio.
- Lighthouse CI con presupuestos de §1.2.
- Broken-link checker interno y externo; un enlace externo caído no rompe el build de forma inmediata, pero genera aviso accionable.
- Audit, CodeQL, Gitleaks, Trivy, inspección de usuario del contenedor y test de headers.
- Escaneo DAST baseline contra el contenedor antes del primer lanzamiento y cuando cambie el endpoint de contacto.

---

## 18. Criterios de aceptación de producto

### 18.1 Contenido y navegación

- **CA-01.** Con JavaScript desactivado puedo abrir desde la portada Sobre mí, Servicios, Proyectos, Experiencia, Formación, Bitácora y Contacto y leer contenido útil.
- **CA-02.** Con JavaScript activo, escribir “¿Qué experiencia tienes con LangGraph?” devuelve la respuesta aprobada y un enlace al artículo canónico; la consulta no aparece en la pestaña Network.
- **CA-03.** Una consulta desconocida no inventa respuesta y ofrece enlaces reales.
- **CA-04.** Back, forward y recarga conservan una ruta navegable, no un overlay huérfano.
- **CA-05.** Solo aparecen Leadia y Nami; Leadia abre su URL y Nami no muestra un CTA vacío.
- **CA-06.** Solo aparece en Bitácora el artículo con cuerpo completo y su título coincide con el contenido.
- **CA-07.** Todos los botones visibles realizan su acción; no se muestran micrófono, Toolkit ni etiquetas de demo.
- **CA-08.** TalentTools termina en diciembre de 2025 en todas las superficies.

### 18.2 Contacto y privacidad

- **CA-09.** Un mensaje válido llega una sola vez a `CONTACT_TO` y se confirma solo tras aceptación SMTP.
- **CA-10.** Si SMTP falla, el sitio conserva el texto, no confirma envío y ofrece email alternativo.
- **CA-11.** Payloads inválidos, origen ajeno, CRLF, más de 8 KiB y ráfaga se rechazan según §8.6.
- **CA-12.** Buscar el nombre, email y mensaje de la prueba en logs no devuelve resultados.
- **CA-13.** No hay cookies; rechazar todo el almacenamiento del navegador no impide usar el sitio, solo evita recordar el tema.

### 18.3 Accesibilidad y visual

- **CA-14.** Todos los recorridos se completan con teclado y el foco siempre es visible y no queda oculto por cabecera/footer.
- **CA-15.** Los cinco temas superan contraste AA para texto y controles.
- **CA-16.** A 320 px, zoom 200 % y teclado móvil abierto no aparece scroll horizontal ni acciones inaccesibles.
- **CA-17.** Con movimiento reducido no hay streaming, flotación, pulsos ni scroll suave.
- **CA-18.** Las capturas de regresión se corresponden con el mockup en estructura y jerarquía, salvo cambios registrados por accesibilidad, veracidad o responsive.

### 18.4 SEO y LLM

- **CA-19.** `curl` a cada ruta indexable contiene H1, contenido principal, title, description, canonical y JSON-LD sin ejecutar JavaScript.
- **CA-20.** Sitemap, robots y `llms.txt` solo enlazan URLs canónicas 200 y no incluyen drafts/API.
- **CA-21.** Rich Results/validador Schema no encuentra errores y los valores coinciden con texto visible.
- **CA-22.** `OAI-SearchBot` puede leer contenido público y `GPTBot` recibe la política de exclusión definida.
- **CA-23.** El PDF descarga correctamente desde `/Rodrigo-Valdelvira-CV.pdf` y responde con `X-Robots-Tag`.

### 18.5 Docker y producción

- **CA-24.** En checkout limpio, `docker compose up --build` deja la web sana en localhost sin instalar Node en el host.
- **CA-25.** El contenedor ejecuta como no root, con filesystem read-only, capacidades eliminadas y healthcheck sano.
- **CA-26.** Un push autorizado a `main` verifica, construye una única imagen, la escanea y despliega exactamente el SHA esperado.
- **CA-27.** Producción responde en HTTPS, `www` redirige al dominio raíz y las cabeceras de §11.3 están presentes.
- **CA-28.** Forzar un healthcheck fallido durante un despliegue restaura la imagen anterior y marca el workflow como fallido.
- **CA-29.** El resumen del workflow permite identificar commit, digest, hora, URL y resultado.

### 18.6 Orden de implementación, fidelidad y documentación

- **CA-30.** Al cerrar la spec `000`, todas las superficies visuales públicas de la v1 existen dentro de una única aplicación, usan los activos y tokens normativos y se alcanzan mediante navegación real; no quedan pantallas vacías, controles muertos ni componentes visuales genéricos pendientes de sustituir.
- **CA-31.** Cada escena declarada para la spec `000` supera la comparación de §6.5 y su informe conserva golden, candidata, diff y métricas. Una sola escena fallida impide cerrar la spec.
- **CA-32.** Las specs `010` y `020` vuelven a ejecutar la suite visual completa y no modifican el golden ni el registro de excepciones sin decisión aprobada.
- **CA-33.** El `README.md` raíz describe el estado real del repositorio, arquitectura funcional, requisitos, configuración, arranque local, parada, verificación por spec, solución de problemas, despliegue, verificación post-despliegue y rollback. Todos los comandos que declara como disponibles se ejecutan desde un checkout limpio o se marcan inequívocamente como contrato pendiente.
- **CA-34.** Existe un único comando de verificación por spec y un comando global documentados en el README; cada uno termina con código distinto de cero cuando falla cualquiera de sus criterios y enlaza o produce la evidencia indicada en §19.3.

La versión no se publica si falla un criterio de aceptación, aunque la apariencia coincida con el mockup.

---

## 19. Descomposición mínima para Servilleta y Spec Kit

Se proponen tres rebanadas. La primera fija el producto visible completo; las otras dos añaden lógica interna sin reconstruir su interfaz. No se acepta repartir la maquetación entre specs porque impediría validar pronto la fidelidad al mockup.

| Spec | Resultado verificable | Secciones maestras | Incluye | Depende de |
|---|---|---|---|---|
| `000-esqueleto-visual-funcional` | Aplicación completa en su dimensión visual, navegable en Docker y fiel a todas las escenas golden | §§0, 4–6, 8.1–8.5, 8.6–8.7 sólo presentación, 9, 11.3, 12–13, 17.3–17.4, 18.1, 18.3, 18.5–18.6 y 21 | Stack mínimo, sistema gráfico completo, activos y fuentes locales, todas las rutas y estados visuales de v1, HTML útil, navegación/enlaces reales, temas, CV, estados accesibles, healthcheck, Docker, suite visual y README operativo | Nada |
| `010-logica-del-portfolio` | La carcasa existente obtiene contenido único, conversación determinista, estados y descubrimiento completos sin variar el diseño | §§2–10, 17.1–17.4, 18.1, 18.3–18.4 y 18.6 | Modelo tipado de contenido, intenciones y normalización, History API, filtros/acordeones/carrusel, artículo, metadatos, JSON-LD, sitemap, robots, `llms.txt`, e2e con/sin JavaScript y regresión visual completa | 000 |
| `020-contacto-operacion-y-cierre` | El formulario envía de verdad y la misma imagen verificada se despliega y puede revertirse en producción | §§8.6–8.7, 11, 14–18, 20 y 23 | SMTP, validación/antiabuso/idempotencia, legal final, hardening OWASP, CI/CD completo, Caddy/Hetzner, observabilidad, verificación post-deploy, rollback, regresión visual y aceptación total | 000, 010 |

### 19.1 Frontera entre presentación y lógica

La spec `000` termina la presentación; no deja "para más adelante" estilos, layout, responsive, iconos, fuentes, temas, componentes, rutas visuales ni estados de carga/vacío/error necesarios en v1. También implementa el comportamiento mínimo indispensable para que nada visible sea falso: enlaces normales, navegación por rutas, selector de tema, descarga del CV y controles accesibles. La barra conversacional puede resolver los destinos explícitos ya visibles, pero la normalización completa, respuestas derivadas, historial y casos límite pertenecen a `010`.

El formulario puede mostrarse en `000` únicamente en un estado honesto no disponible cuando falte SMTP, con campos inactivos, explicación y `mailto:` operativo conforme a §13.2. La aceptación SMTP, el antiabuso y los estados reales de envío pertenecen a `020`. No se permite el éxito simulado del mockup.

Las specs `010` y `020` trabajan dentro de componentes y contratos visuales ya cerrados. Pueden añadir estados que estaban previstos —por ejemplo, respuesta desconocida o error SMTP— pero deben usar el sistema gráfico de `000` y quedar cubiertos por nuevas capturas candidatas; no pueden sustituir la composición base.

### 19.2 Regla de tareas

Cada spec se implementa por recorrido vertical y no por capas técnicas. Una tarea debe producir un resultado comprobable. No se crean tareas independientes para cada componente, token, metadato o test si pueden completarse dentro del mismo recorrido.

Objetivo orientativo:

- Spec 000: 8–12 tareas, porque entrega todas las superficies y su baseline visual.
- Spec 010: 8–12 tareas.
- Spec 020: 6–9 tareas.

Máximo total recomendado: 33 tareas, incluidas verificación y documentación. Si el plan supera ese número, debe justificar qué criterio de aceptación obliga a separar.

### 19.3 Contrato de verificación y evidencia por spec

Cada plan debe materializar los siguientes comandos estables en `package.json`. La herramienta interna puede cambiar, pero no el punto de entrada documentado:

| Spec | Comando bloqueante | Debe demostrar | Evidencia mínima de `cierre.md` |
|---|---|---|---|
| `000` | `npm run verify:spec:000` | Build limpio; rutas y activos 200/404 correctos; HTML útil; teclado básico; Docker sano/no root; tokens; y todas las comparaciones de §6.5 | Log del comando, informe visual por escena, capturas móvil/escritorio, inspección del contenedor y revisión humana de Rodrigo |
| `010` | `npm run verify:spec:010` | Unitarias de contenido/intenciones; e2e con y sin JavaScript; URL/back/forward; SEO/JSON-LD/sitemap/robots/`llms.txt`; accesibilidad; rendimiento; y suite visual completa sin cambios | Log, reporte unitario/e2e, axe/Lighthouse, validación de recursos de descubrimiento e informe visual |
| `020` | `npm run verify:spec:020` | SMTP real de prueba y fallos; abuso/privacidad; headers/CSP; audit/CodeQL/Gitleaks/Trivy; imagen inmutable; despliegue; healthcheck externo; y rollback forzado | Log, identificador del mensaje de prueba sin PII, reportes de seguridad, SHA/digest desplegado, comprobación HTTPS y ejecución de rollback |
| Global | `npm run verify` | Ejecuta las tres suites aplicables desde checkout limpio sin omitir una por estado local | Log único y enlaces a la evidencia de cada spec |

Un comando que sólo imprime instrucciones, marca pruebas como omitidas sin motivo aprobado o depende de artefactos no recreables no satisface el contrato. En CI, cualquier fallo devuelve código distinto de cero. La actualización deliberada de golden usa un comando diferente del de verificación y nunca se ejecuta en CI.

### 19.4 Lo que no debe convertirse en proyecto propio

- No crear “servicio SEO”, “servicio LLM”, “servicio de temas” o “servicio de contenido”.
- No añadir repositorios, paquetes compartidos o monorepo para una sola app.
- No crear una API genérica: solo contacto y salud.
- No automatizar publicación editorial que aún no existe.
- No preparar Toolkit, multidioma, analítica o CMS “por si acaso”.

---

## 20. Precondiciones y decisiones humanas pendientes

Estas son las únicas entradas externas que la implementación no puede fabricar:

1. **Repositorio GHCR.** Confirmar owner/nombre y si el paquete será público o privado.
2. **Acceso Hetzner.** IP/host real, puerto, usuario `deploy`, huella SSH y DNS controlado.
3. **SMTP.** Host, puerto, modo TLS, usuario, secreto, remitente autorizado y `CONTACT_TO`.
4. **DNS de email.** SPF, DKIM y DMARC alineados con el remitente usado.
5. **Contenido público.** Confirmar email, teléfono, LinkedIn, menciones a clientes, proyectos y cifra del 65 %.
6. **Legal.** Aprobar privacidad, cookies y términos, incluida base legal y conservación de mensajes en el buzón.
7. **Política de entrenamiento.** Confirmar o cambiar el valor predeterminado de bloquear GPTBot sin bloquear OAI-SearchBot.
8. **Monitorización.** Elegir el canal que recibe una caída o fallo continuado de contacto.

Una servilleta debe arrastrar solo las decisiones de esta lista que bloqueen su alcance; no debe reabrir el resto de decisiones cerradas.

---

## 21. Estado preparado del repositorio

La preparación agnóstica se completó el 9 de septiembre de 2026:

- La constitución y el baseline OWASP describen exclusivamente este portfolio y usan Top 10:2025 y ASVS 5.0.0.
- `design/golden.config.json` apunta al mockup real, extrae sus cinco temas y su contenido estructurado, e identifica las tres specs maestras.
- Inventario, tokens, contenido y mapa de fuentes se regeneran con herramientas configurables, sin rutas o reglas de negocio heredadas.
- El workflow base solo comprueba fuentes, trazabilidad y secretos; no busca aplicaciones o servicios aún inexistentes.
- Se retiraron los Dockerfiles de API/PostgreSQL ajenos. `docker/README.md` conserva el contrato exacto que debe instanciar la spec 000.
- El kit reutilizable no preselecciona framework, gestor de paquetes, monorepo, base de datos, autenticación ni hosting.

Permanecen pendientes **por diseño**, no por incompatibilidad: el código de aplicación, su lockfile, Dockerfile/Compose, las puertas del stack y `.github/workflows/deploy.yml`. El código, Docker y la verificación visual se crean en la spec `000`; la lógica de producto se completa en `010`; el despliegue productivo y sus puertas se completan en `020` según §§12–16.

Antes de la primera servilleta solo se exige que `npm run design:regen`, `npm run verify:kit` y la revisión humana de `FUENTES.md` estén en verde. El primer commit aprobado establecerá el baseline de comparación.

---

## 22. Referencias normativas y operativas

Referencias vigentes al redactar esta versión:

- [OWASP Top 10:2025](https://owasp.org/Top10/)
- [OWASP ASVS 5.0.0](https://owasp.org/www-project-application-security-verification-standard/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Google: optimización para funciones de IA generativa](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: crawling e indexación](https://developers.google.com/search/docs/crawling-indexing)
- [Google: datos estructurados ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [OpenAI: publishers, OAI-SearchBot y GPTBot](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
- [GitHub: deployment environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)
- [GitHub: secrets](https://docs.github.com/en/actions/concepts/security/secrets)
- [Caddy: Automatic HTTPS](https://caddyserver.com/docs/automatic-https)
- [Caddy: reverse_proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)

Las versiones concretas de frameworks, imágenes y GitHub Actions se verifican al redactar el plan de cada spec. No se copia una etiqueta “latest” desde este documento.

---

## 23. Definición de terminado global

El portfolio está terminado cuando:

1. Las tres specs de §19 están cerradas con su evidencia.
2. Los 34 criterios de aceptación tienen resultado y enlace a prueba/captura/log de CI.
3. Rodrigo ha completado las validaciones humanas de §§5.3, 8.7 y 20.
4. No queda ningún contenido o control visible marcado como demo, falso, vacío o próximamente.
5. El dominio canónico sirve la imagen correspondiente al commit aprobado y el rollback ha sido probado.
6. La matriz OWASP/ASVS enlaza control, prueba y evidencia.
7. La revisión manual de accesibilidad, contenido, contacto y seguridad no tiene bloqueantes.

Cumplir el diseño sin cumplir estas condiciones no constituye una entrega funcional.
