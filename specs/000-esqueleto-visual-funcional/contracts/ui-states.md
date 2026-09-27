# Contract: Progressive UI states

## Semantic base

Every public surface works without JavaScript and includes:

- `<html lang="es">`;
- a skip link that becomes visible on focus;
- named header/navigation, one `<main>` and footer;
- exactly one visible H1 and a coherent heading hierarchy;
- real anchors for every route-changing action;
- visible focus that is not covered by sticky UI;
- controls at least 24 × 24 CSS px, with primary actions targeting 44 × 44 px.

No information depends only on color, icon, position, animation, hover, dragging or stars.

## Header and navigation

- Avatar and visible name link to `/` from every internal route.
- The active destination is conveyed in text/semantics as well as styling.
- Keyboard order follows visual/document order; there is no focus trap.
- Back, forward and reload always resolve to meaningful canonical pages.

## Predetermined portfolio actions

- Seven actions are exposed: Sobre mí, Habilidades, Servicios, Proyectos, Experiencia, Formación and Contacto.
- Without JavaScript each action is a normal link to its canonical page.
- With JavaScript an action may append a user-action label and its approved assistant card, followed by a real link to the canonical page.
- An active card remains visible above the persistent query surface and is named for assistive technology.
- A new action or route change cancels timers, pending transitions and animations.
- Spec 000 does not interpret free text. If the visual query field is present, it is unmistakably unavailable or limited to the visible presets and has no dead Send control.

## Theme selector

Trigger contract:

- accessible name “Cambiar tema visual”;
- `aria-expanded` reflects open/closed state;
- the controlled layer has a stable name.

Layer contract:

- exactly Claro, Oscuro, Cobalto, Rioja and Bosque, each with text and swatch;
- current option uses a programmatically announced selected/current state;
- arrow/tab behavior is consistent with the selected native/ARIA pattern;
- Escape and outside activation close it and restore focus to the trigger;
- switching applies immediately and attempts to store only `rv_theme`;
- missing, damaged or unavailable storage falls back to Rioja without blocking use.

The theme is applied before first paint. Each theme passes AA contrast for text, informative icons, control borders and focus.

## Disclosures and optional layers

- Essential experience/profile/education content is visible while collapsed.
- A disclosure uses a button with `aria-expanded` and `aria-controls` and toggles the matching region with keyboard.
- Service full descriptions are present in `/servicios`. A dialog may duplicate the detail only as an enhancement.
- Any dialog has a name, contains focus, closes with Escape/outside, restores trigger focus and never replaces its canonical content route.

## Projects

- Project cards are keyboard-operable links to `/proyectos/leadia` and `/proyectos/nami`.
- The optional previous/next traversal announces “Proyecto 1 de 2” or “Proyecto 2 de 2”. It is not the only way to reach either project and does not require dragging.
- Leadia exposes its approved external link. Nami shows “En fase de diseño” and no empty external control.
- A failed project image keeps the reserved dimensions and displays its stable fallback label.

## Images

- Portrait accessible name: “Retrato de Rodrigo Valdelvira”.
- Product images describe what they add; decorative icons use an empty alternative.
- `loading -> loaded` and `loading -> fallback` keep identical layout dimensions.

## Contact in spec 000

- A valid service query preselects the corresponding subject locally; an unknown value selects nothing.
- The form is visibly unavailable and does not collect or submit name, email or message.
- There is no pending, success or operational error simulation and no request to `/api/contacto`.
- The approved `mailto:`, `tel:` and LinkedIn links remain active; the email alternative is prominent.
- The future enabled form and its live validation/statuses belong to spec 020.

## Legal and error states

- Privacy, Cookies and Terms visibly identify themselves as working drafts and are `noindex`.
- There is no cookie banner because only the optional theme preference is remembered.
- 404 and 500 keep the approved visual shell, omit internal detail and expose Portada, Proyectos and Contacto links.

## Motion, reflow and mobile keyboard

- With `prefers-reduced-motion: reduce`, progressive typing, floating, pulses and smooth scrolling are absent; content appears immediately.
- With `prefers-contrast` when available, focus and boundaries remain distinguishable.
- At 320 CSS px, 390 × 844, 200 % zoom and custom text size there is no horizontal page overflow or inaccessible action.
- Dynamic viewport units and bottom safe-area spacing keep the active answer and persistent query reachable when a mobile keyboard is shown.

## Removed controls

The DOM and accessibility tree contain no microphone, Toolkit, cookie-consent banner, demo badge, “indexado/citado por el agente” claim or simulated contact success.
