# Tasks: Lógica del portfolio

**Input**: Design documents from `/specs/001-logica-del-portafolio/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/portfolio-interaction.md`

**Tests**: Included because FR-018 and the plan explicitly require unit, integration, E2E, accessibility, no-JavaScript, reduced-motion, privacy, public-reference, and visual regression coverage.

**Organization**: Tasks are grouped by user story. The spec 000 entry gate has an explicit administrative waiver recorded in `closure-decision.md`; inherited visual and accessibility failures remain open and are not treated as passes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Record the authorized inherited-gate waiver and connect feature verification to the existing project.

- [X] T001 Record the user-authorized administrative waiver for the spec 000 entry gate in `specs/000-esqueleto-visual-funcional/closure-decision.md`; its visual suite remains failed and human accessibility review remains pending (waived; no PASS claimed)
- [X] T002 Add the `verify:spec:010` command to `package.json` and its verification entry point at `scripts/verify-spec-010.mjs`, following existing fail-fast summary conventions (created; execution unavailable in this environment)

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared, validated sources for intent matching and public-page discovery before story-specific UI work.

- [X] T003 [P] Define the typed local intent catalog, approved responses, content provenance, and canonical destinations in `src/lib/intents.ts`, sourcing facts from `src/content/site.ts` and `src/lib/routes.ts`
- [X] T004 [P] Extend public route metadata and indexability validation in `src/lib/routes.ts` and `src/lib/content.ts` so every indexable page has coherent Spanish title, description, canonical path, H1, and approved content
- [X] T005 Add unit coverage for unique IDs, approved provenance, and valid canonical destinations in `tests/unit/intent-catalog.spec.ts`

## Phase 3: User Story 1 - Consultar el portfolio con preguntas (Priority: P1)

**Goal**: Answer recognized questions deterministically from approved content; handle unknown and ambiguous queries honestly.

**Independent Test**: Submit representative questions for every published intent, plus unknown, ambiguous, empty, accented/case/spacing variants, and over-limit inputs; confirm approved responses and real detail links without unsupported claims.

### Tests for User Story 1

- [X] T006 [P] [US1] Test Unicode/accent/case/whitespace normalization and recognized, unknown, and ambiguous decisions in `tests/unit/intent-matching.spec.ts`
- [X] T007 [P] [US1] Test approved answer and canonical destination coverage for every published intent in `tests/unit/intent-responses.spec.ts`
- [X] T008 [P] [US1] Test empty input, 300-character maximum, over-limit rejection, Enter, and Shift+Enter behavior in `tests/e2e/query-interaction.spec.ts`

### Implementation for User Story 1

- [X] T009 [US1] Implement pure query normalization and unique/unknown/ambiguous intent resolution in `src/lib/intent-matching.ts`
- [X] T010 [US1] Render recognized answers, unknown guidance, ambiguous clarification, and existing destination links in `src/components/layout/ConversationPage.astro`
- [X] T011 [US1] Enforce the 300-character limit, empty-submit behavior, and Enter/Shift+Enter semantics in `src/scripts/query.ts`

## Phase 4: User Story 2 - Navegar por rutas públicas estables (Priority: P1)

**Goal**: Preserve canonical, directly addressable section routes with useful server-rendered content and browser history behavior.

**Independent Test**: Open each published route directly, follow canonical links, use back/forward and reload, and disable JavaScript; each destination remains readable and navigable.

### Tests for User Story 2

- [X] T012 [P] [US2] Verify canonical section links, direct routes, reload, back, and forward navigation in `tests/e2e/public-navigation.spec.ts`
- [X] T013 [P] [US2] Verify each public page retains main content and working links with JavaScript disabled in `tests/e2e/no-js-navigation.spec.ts`

### Implementation for User Story 2

- [X] T014 [US2] Wire canonical section destinations into query answers and shared navigation using `src/lib/routes.ts`, `src/components/layout/Navigation.astro`, and `src/components/layout/ConversationPage.astro`
- [X] T015 [US2] Ensure query history is tab-local, absent from network/storage, and cleared on home navigation and reload in `src/scripts/query.ts`

## Phase 5: User Story 5 - Consultar con control y accesibilidad (Priority: P1)

**Goal**: Make querying controllable by keyboard and reduced-motion preferences without focus theft or unexpected scrolling.

**Independent Test**: Complete query flows using keyboard only and reduced motion; verify visible focus, complete response text, and no automatic focus or disruptive scroll.

### Tests for User Story 5

- [X] T016 [P] [US5] Cover keyboard focus, live response announcements, and no focus theft or forced scroll in `tests/e2e/query-accessibility.spec.ts`
- [X] T017 [P] [US5] Verify reduced-motion mode disables progressive response rendering while preserving full text in `tests/e2e/keyboard-and-motion.spec.ts`

### Implementation for User Story 5

- [X] T018 [US5] Add accessible labels, character-limit announcement, response status semantics, and visible focus behavior in `src/components/layout/PersistentQuery.astro`
- [X] T019 [US5] Implement reduced-motion immediate rendering and avoid response-driven focus/scroll changes in `src/scripts/query.ts` and `src/styles/motion.css`

## Phase 6: User Story 3 - Encontrar y leer el artículo publicado (Priority: P2)

**Goal**: Publish and filter only the complete approved article, with an accessible empty-filter state and a related query action.

**Independent Test**: Filter the Bitácora with keyboard, confirm only the complete LangGraph article is published, open and read it, and invoke its related question action; empty categories announce an accessible empty state.

### Tests for User Story 3

- [X] T020 [P] [US3] Test published article completeness, title/body agreement, and exclusion of four incomplete records in `tests/unit/journal-content.spec.ts`
- [X] T021 [P] [US3] Test keyboard-operated filters, empty state, and article query action in `tests/e2e/journal-filters.spec.ts`

### Implementation for User Story 3

- [X] T022 [US3] Derive the public journal index and filters exclusively from complete published collection entries in `src/components/journal/JournalIndex.astro` and `src/lib/content.ts`
- [X] T023 [US3] Implement keyboard-operable filters and an accessible no-results state in `src/components/journal/JournalIndex.astro` and `src/scripts/journal-filters.ts`
- [X] T024 [US3] Connect the article “pregúntame sobre esto” action to the approved LangGraph intent in `src/components/journal/Article.astro`

## Phase 7: User Story 4 - Encontrar información pública coherente (Priority: P2)

**Goal**: Derive public metadata and discovery resources from published canonical pages and apply the approved crawler policy.

**Independent Test**: Inspect every indexable route and public reference; metadata matches visible content, all links resolve to canonical published pages, and OAI-SearchBot is allowed while GPTBot is blocked.

### Tests for User Story 4

- [X] T025 [P] [US4] Test title, description, canonical, H1, and rendered Spanish content for every indexable route in `tests/integration/public-metadata.spec.ts`
- [X] T026 [P] [US4] Test sitemap, JSON-LD, Open Graph, robots, and `/llms.txt` links against the canonical published route catalog in `tests/integration/public-discovery.spec.ts`
- [X] T027 [P] [US4] Test OAI-SearchBot allow and GPTBot disallow directives in `tests/integration/robots-policy.spec.ts`

### Implementation for User Story 4

- [X] T028 [US4] Generate per-page title, description, canonical, Open Graph, and JSON-LD from shared route/content data in `src/layouts/BaseLayout.astro` and `src/lib/content.ts`
- [X] T029 [US4] Generate sitemap and `/llms.txt` from published canonical routes in `src/pages/sitemap.xml.ts` and `src/pages/llms.txt.ts`
- [X] T030 [US4] Set the approved OAI-SearchBot and GPTBot directives in `src/pages/robots.txt.ts`

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Integrate the feature verification gate and confirm all story-level outcomes against the complete specification.

- [X] T031 [P] Add end-to-end coverage for no network requests or logs containing query text and clearing conversation state on reload/home in `tests/integration/query-privacy.spec.ts`
- [X] T032 [P] Add the complete feature verification matrix for query matching, navigation, journal, no-JavaScript content, accessibility, metadata, discovery, privacy, and visual regression to `scripts/verify-spec-010.mjs`
- [ ] T033 Run `pnpm run verify:spec:010` and resolve failures without updating visual goldens in `tests/visual/`

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 is an external entry gate; T002 can be prepared independently, but implementation must not begin until the spec 000 closure and full visual-contract check pass.
- **Foundational (Phase 2)**: Depends on the entry gate; T003–T004 establish shared catalogs; T005 validates the intent catalog.
- **User Stories (Phase 3+)**: Depend on the foundation. US1 provides local intent resolution; US2 and US5 integrate its UI and state behavior. US3 and US4 can proceed independently once foundational route/content data is ready.
- **Polish (Phase 8)**: Depends on all intended stories and feature verification wiring.

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2; provides the deterministic answer behavior used by US2 and US3.
- **US2 (P1)**: Depends on Phase 2 and US1 for query answer destinations; public section pages remain independently usable.
- **US5 (P1)**: Depends on the query UI from US1; can proceed alongside US2 route work.
- **US3 (P2)**: Depends on Phase 2 and the LangGraph intent from US1.
- **US4 (P2)**: Depends on Phase 2 route/content catalogs; otherwise independent of the interaction stories.

### Parallel Opportunities

- T003 and T004 are independent foundation tasks after the entry gate.
- Within US1, T006–T008 can be authored in parallel; matching and UI implementation follow the catalog.
- US2 navigation and US5 accessibility work can proceed in parallel after US1 establishes the query component contract.
- US3 journal tests and US4 metadata/discovery tests can proceed in parallel after foundational data is stable.
- Within US4, the metadata, discovery-resource, and crawler-policy tests are separate files and can proceed in parallel.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 entry gate and setup.
2. Complete Phase 2 foundational catalogs and validation.
3. Complete US1 local query recognition and response behavior.
4. Verify all published intents, unknown and ambiguous queries, input limits, and approved links.

### Incremental Delivery

1. Deliver query behavior (US1), then stable canonical navigation and ephemeral history (US2).
2. Add accessibility and user control (US5) before broadening the public discovery surface.
3. Deliver the complete published article and filters (US3), then public metadata and crawler references (US4).
4. Run the full `verify:spec:010` gate, including the inherited visual suite.

### Parallel Team Strategy

After the shared catalogs are ready, divide US2/US5 interaction and accessibility work from US3 journal work and US4 public discovery work. Integrate through the shared route and content catalogs before running the complete verification gate.

## Notes

- Every task uses the required checkbox, sequential ID, optional `[P]` marker, story label where applicable, and an exact file path or explicit gate artifact.
- Tests are included because this feature explicitly requires them in FR-018 and the plan.
- No runtime dependency or second application is introduced.
- Visual goldens are contractual; never update them merely to make this feature pass.


## Punto de control — 2026-09-25

verify:spec:010 (2026-09-25T14:17:43.155Z) pasa los chequeos técnicos, E2E Chromium/Firefox, no-JS, movimiento reducido y contenedor; su resultado global falla porque hereda las 19 escenas visuales fuera del umbral. T033 sigue abierta. Evidencia: artifacts/spec-010/verification-summary.json y artifacts/spec-000/visual-report.json (2026-09-25T14:20:07.814Z).
