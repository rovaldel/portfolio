# Data Model: Esqueleto visual funcional

## Model boundary

El modelo es un conjunto de datos TypeScript/Markdown validado durante build. No existe base de datos. Solo `ThemePreference` cruza visitas mediante `localStorage`; el resto del estado interactivo vive en memoria de la pestaña y se descarta al navegar o cerrar.

`content/es.json` y `design/tokens.json` son extracciones protegidas del golden. Sirven como referencia y trazabilidad, pero el contenido público se obtiene exclusivamente de `src/content/site.ts` y de la colección aprobada de Bitácora.

## Entities

### SiteProfile

Singleton con identidad y datos profesionales compartidos.

| Field | Type | Rules |
|---|---|---|
| `fullName` | string | Exactamente `Rodrigo Valdelvira Ortigosa` |
| `displayName` | string | Exactamente `Rodrigo Valdelvira` |
| `primaryRole` | string | Exactamente `AI Engineer` |
| `professionalSummary` | string | No puede atribuir 15+ años a IA |
| `totalExperienceLabel` | string | Si contiene `15+`, debe calificarlo como experiencia profesional total |
| `location` | string | `Logroño, La Rioja · remoto` |
| `availability` | string | Disponible para nuevos proyectos en remoto |
| `languages` | Language[] | Valores aprobados y orden estable |
| `channels` | ContactChannel[] | Exactamente email, teléfono y LinkedIn aprobados |
| `portrait` | ImageAsset | Dimensiones, alt y fallback obligatorios |

`ContactChannel` contiene `kind`, `label`, `displayValue` y `href`. Valores canónicos: `mailto:rodrigo.valdelvira@gmail.com`, `tel:+34653850674` y `https://www.linkedin.com/in/rovaldel`.

### PublicSurface

Contrato común para cada destino navegable.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Único y estable |
| `canonicalPath` | RoutePath | Único; minúsculas, guiones y sin barra final salvo `/` |
| `kind` | `home \| profile \| catalogue \| detail \| article \| contact \| legal` | Determina composición, no indexación automática |
| `title` | string | No vacío; deriva el `<title>` |
| `description` | string | Veraz y autocontenida |
| `h1` | string | Exactamente uno visible en el documento |
| `contentRefs` | string[] | Referencias a entidades de la fuente única |
| `indexability` | `index \| noindex` | Legal es `noindex` mientras sea borrador |
| `publicationState` | `approved \| working-draft` | Todas aprobadas salvo las tres legales |
| `navigationLabel` | string | Nombre accesible estable |

El catálogo contiene exactamente las 15 rutas de FR-001. 404 y 500 son respuestas de recuperación, no entradas indexables del catálogo.

### Experience

| Field | Type | Rules |
|---|---|---|
| `id` | string | Único |
| `role` | string | Afirmación aprobada |
| `organization` | string | Afirmación aprobada |
| `location` | string | No se infiere si falta |
| `workMode` | `presencial \| remoto \| no-especificado` | Conforme a fuente aprobada |
| `start` | YearMonth | Fecha ISO parcial `YYYY-MM` |
| `end` | YearMonth \| null | `null` solo para puesto vigente |
| `current` | boolean | `true` si y solo si `end` es `null` |
| `highlights` | string[] | Sin contenido pendiente o duplicado |
| `order` | integer | Único y ascendente |
| `provenance` | SourceRef[] | Trazabilidad de afirmaciones sensibles |

Invariantes: Cidatum comienza `2025-12`, es vigente, presencial y en Logroño; TalentTools termina `2025-12`. El solapamiento de diciembre de 2025 es válido. Las menciones de FR-017 y la reducción del 65 % deben conservar proveniencia aprobada.

### Education

Campos: `id`, `title`, `institution`, `startYear?`, `endYear`, `description`, `order`, `provenance`. Deben existir exactamente las seis entradas de FR-016, sin titulaciones o credenciales inferidas y con orden editorial estable.

### SkillGroup

Campos: `id`, `name`, `order` y `skills: Skill[]`. `Skill` contiene solo `name` y `order`. Los nombres no se repiten dentro del grupo y no existe ningún campo de nivel, estrellas, porcentaje o certificación implícita. El `n` de la extracción del golden no se proyecta al modelo público.

### Service

| Field | Type | Rules |
|---|---|---|
| `slug` | string | Kebab-case y único |
| `title` | string | No vacío |
| `summary` | string | Visible sin expansión |
| `description` | string | Completa y disponible sin depender de diálogo |
| `icon` | IconAsset | Decorativo o con nombre alternativo según contexto |
| `contactSubject` | string | Derivado como `Consulta sobre: {title}` y validado contra allowlist |
| `order` | integer | Exactamente una posición de 1 a 6 |

El CTA canónico usa `/contacto?asunto={slug}`. Un valor desconocido se ignora y no se refleja como HTML.

### Project

| Field | Type | Rules |
|---|---|---|
| `slug` | `leadia \| nami` | Catálogo cerrado |
| `title` | string | `Leadia` o `Nami` |
| `status` | `published \| design` | Nami usa `design` |
| `statusLabel` | string | Nami muestra `En fase de diseño` |
| `client` | string | Aprobado |
| `role` | string | Aprobado |
| `description` | string | Completa |
| `technologies` | string[] | Lista ordenada, no vacía |
| `image` | ImageAsset | Dimensiones y fallback obligatorios |
| `externalUrl` | URL \| null | Leadia = `https://leadia.es`; Nami = `null` |
| `position` | 1 \| 2 | Leadia 1, Nami 2 |
| `count` | 2 | Constante anunciable |

Si `externalUrl` es `null`, no se renderiza enlace ni botón externo. Todo proyecto sí enlaza a `/proyectos/{slug}`.

### Article

| Field | Type | Rules |
|---|---|---|
| `slug` | string | Único; publicado = `langgraph-para-agentes-en-produccion` |
| `title` | string | Coincide exactamente en índice, página y enlace permanente |
| `excerpt` | string | Derivado del cuerpo aprobado o revisado con él |
| `category` | string | No vacía |
| `publishedAt` | ISO date | No se inventa fecha de actualización |
| `updatedAt` | ISO date \| null | Solo con fuente aprobada |
| `readingMinutes` | positive integer | Calculado de forma determinista desde el cuerpo |
| `authorId` | SiteProfile.id | Relación obligatoria |
| `status` | `draft \| published` | Solo uno puede ser `published` en esta feature |
| `body` | Markdown document | Sin HTML arbitrario |
| `headings` | Heading[] | Jerarquía H2/H3 sin saltos arbitrarios |

Los cuatro teasers sin cuerpo no se incluyen en navegación, rutas generadas ni bundle público.

### Theme

| Field | Type | Rules |
|---|---|---|
| `id` | `light \| dark \| cobalto \| rioja \| bosque` | Catálogo cerrado |
| `label` | `Claro \| Oscuro \| Cobalto \| Rioja \| Bosque` | Correspondencia uno a uno |
| `tokens` | ThemeTokens | Todos los tokens requeridos presentes |
| `swatch` | string | Presenta el tema sin ser su único indicador |
| `order` | integer | Único de 1 a 5 |
| `isDefault` | boolean | Exactamente Rioja es `true` |

`ThemeTokens` contiene `bg`, `surface`, `surface-2`, `line`, `text`, `muted`, `pill`, `fill`, `fill-text`, `blob` y `shadow`. Cualquier corrección de contraste cambia el token compartido de la fuente pública y enlaza una `VisualException`.

### ThemePreference

Único dato persistente del navegador.

| Field | Type | Rules |
|---|---|---|
| storage key | string | Exactamente `rv_theme` |
| value | Theme.id | Solo los cinco IDs válidos |

No se persiste marca temporal, perfil, conversación, asunto ni estado de controles. Un valor ausente, inválido o ilegible equivale a Rioja.

### LegalDocument

Campos: `kind: privacy | cookies | terms`, `title`, `sections`, `status: working-draft | approved`, `reviewedAt?`, `reviewedBy?`. En esta feature los tres documentos están en `working-draft`, se marcan visiblemente y usan `noindex`. La transición a `approved` requiere revisión humana externa; mientras falta, el despliegue público queda bloqueado.

### NavigationAction

Acción conversacional cerrada para esta feature.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Único |
| `label` | string | Nombre visible/accesible |
| `destination` | RoutePath | Una ruta canónica real |
| `responseKind` | `profile \| skills \| services \| projects \| experience \| education \| contact` | Solo siete respuestas aprobadas |
| `contentRefs` | string[] | Reutiliza entidades, no copy duplicado |

No contiene expresiones libres, clasificación de intención ni llamadas de red. La acción base es un enlace; el cliente puede interceptarlo para presentar una tarjeta y mantener un enlace a la superficie completa.

### PresentationState

Estado efímero por pestaña: `route`, `surfaceMode`, `activeResponse?`, `pendingAction?`, `openLayer?`, `expandedIds`, `projectPosition`, `sessionTheme`, `reducedMotion` y `contactSubject?`. Nunca se serializa ni se envía.

### ImageAsset

Campos: `src`, `alt`, `width`, `height`, `sources[]`, `fallbackLabel` y `sourceHash`. Retrato y capturas informativas tienen texto alternativo; iconos puramente decorativos usan alternativa vacía. El fallback conserva `width`/`height`.

### VisualScene

| Field | Type | Rules |
|---|---|---|
| `name` | string | Uno de los 19 IDs de `design/golden.config.json` |
| `source` | `portfolio` | Fuente congelada |
| `candidatePath` | RoutePath | Destino real de aplicación |
| `precondition` | InteractionStep[] | Roles/nombres o selección de tema estable |
| `viewport` | `{width,height}` | Valores declarados |
| `theme` | Theme.id | Explícito |
| `comparisonMode` | `pixel \| contract` | Resuelto por configuración |
| `anchors` | AnchorDefinition[] | Obligatorios en `contract` |

`habilidades` y `articulo-langgraph` deben registrarse como `contract` por cambios obligatorios de FR-012, FR-022 y FR-026.

### VisualException

Campos: `id`, `sceneName`, `category: truth | accessibility | responsive | removed-function`, `requirementIds`, `description`, `affectedState`, `beforeEvidence`, `afterEvidence`, `anchorLimitCssPx` y `approval`. Solo se admite para modo `contract`; el límite de anclaje es 2 CSS px. No autoriza máscaras ni cambios estéticos ajenos al requisito.

### VisualRun y SceneResult

`VisualRun` contiene `schemaVersion`, commit, hashes de fuente, Node/Playwright/Chromium/SO, DPR, configuración congelada, 19 resultados y resultado global.

Cada `SceneResult` contiene rutas a `golden`, `candidate`, `diff` y `metrics`; dimensiones; threshold; píxeles cambiados; ratio; comprobaciones de anclaje; comprobaciones de tokens/estilos/activos cuando proceda; excepción enlazada y estado `pass | fail`. El esquema normativo está en [contracts/visual-evidence.schema.json](contracts/visual-evidence.schema.json).

## Relationships

```text
SiteProfile ──< Experience
     │       ├─< Education
     │       └─< Article.authorId
     │
PublicSurface ──< contentRefs >── Service / Project / Article / SkillGroup
     │
     └── NavigationAction.destination

Theme ──0..1── ThemePreference

VisualScene ──0..1── VisualException
VisualRun ──19── SceneResult ──1── VisualScene
```

## State transitions

### Theme selector

```text
load
 ├─ stored valid ─> apply stored theme
 └─ absent/invalid/unreadable ─> apply Rioja

closed ──open──> open
open ──select valid──> applied ──attempt persist──> closed + focus trigger
open ──Escape/outside──> closed + focus trigger
```

Un fallo al persistir no revierte el tema de la sesión ni bloquea el selector.

### Predetermined conversational action

```text
hero ──activate real link──> pending ──render approved card──> active response
  │                            │
  └─ no JavaScript ───────────> canonical page
                               └─ route change/unmount ─> cancelled
```

Con movimiento reducido se omiten espera y animación. La tarjeta activa mantiene enlace canónico, foco comprensible y visibilidad sobre la consulta persistente. La entrada libre y su interpretación pertenecen a la spec 010; esta feature no expone un botón de envío muerto.

### Expandable content/layer

`collapsed <-> expanded`; el resumen esencial siempre queda visible. Si se usa diálogo como mejora: `closed -> open -> closed`, cierra con Escape/exterior y devuelve foco al disparador. El mismo detalle existe en la página sin diálogo.

### Project traversal

`Leadia (1/2) <-> Nami (2/2)` mediante anterior/siguiente y anuncio de posición. Cada elemento conserva su enlace canónico; el recorrido no depende de arrastre.

### Image

`reserved -> loaded` o `reserved -> fallback`. Ambos estados conservan la misma caja y comunican contenido equivalente.

### Contact in spec 000

`no subject | approved service subject -> unavailable`. El formulario no entra en estados enviando/enviado/error ni emite `POST`; los campos no recogen datos y `mailto:` permanece operativo.

### Visual validation

```text
declared -> captured -> compared -> pass -> eligible for human review
                               └-> fail -> feature blocked
```

La aprobación humana nunca transforma `fail` en `pass`. El resultado global es `pass` si y solo si los 19 resultados existen y pasan.
