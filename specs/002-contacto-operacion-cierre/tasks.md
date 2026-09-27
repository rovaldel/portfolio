# Tasks: Contacto, operación y cierre

**Input**: Design documents from `specs/002-contacto-operacion-cierre/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Included because the feature plan and quickstart explicitly require unit, integration, end-to-end, deployment and release-gate verification.

**Organization**: Tasks are grouped by user story. All work extends the existing Astro/TypeScript application and single Node/OCI deployment.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Wire the feature checks into the existing verification workflow.

- [ ] T001 [P] Add contact, legal-page, deployment-contract, and release-gate verification commands to `.github/workflows/verification.yml`
- [X] T002 [P] Document the feature's local verification commands and required non-production SMTP setup in `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared release gate used by publication and v1 closure.

- [X] T003 Extend the release readiness evaluator to consume the 020 evidence and decision states in `scripts/check-release-readiness.mjs`
- [X] T004 Add unit coverage for missing, pending, failed, excepted, and passed 020 evidence in `tests/unit/release-readiness.spec.ts`

**Checkpoint**: Shared verification and release-gate foundation is ready.

---

## Phase 3: User Story 1 - Enviar una consulta con resultado fiable (Priority: P1)

**Goal**: Deliver one valid message only after provider acceptance, preserve form values on failure, and provide a confirmed fallback channel.

**Independent Test**: With a fake SMTP transport, submit a valid message and verify exactly one delivery and success only after acceptance; simulate rejection, timeout, and missing configuration and verify no false success, preserved fields, and fallback email.

### Tests for User Story 1

- [X] T005 [P] [US1] Cover field limits, content type, exact field set, origin, CRLF, honeypot, and body size in `tests/unit/contact-submission.spec.ts`
- [X] T006 [P] [US1] Cover per-connection/global limits, idempotency, and expiry without persistent address storage in `tests/unit/contact-abuse.spec.ts`
- [X] T007 [P] [US1] Cover provider acceptance, rejection, timeout, unconfigured transport, and redacted logs in `tests/integration/contact-submission.spec.ts`
- [ ] T008 [P] [US1] Cover successful and failed form journeys, accessible feedback, preserved values, and fallback in `tests/e2e/contact-submission.spec.ts`

### Implementation for User Story 1

- [X] T009 [P] [US1] Implement bounded parsing, field validation, same-origin checks, and safe error results in `src/lib/contact-submission.ts`
- [X] T010 [P] [US1] Implement in-memory abuse limits, short-lived idempotency, and generic delivery logging in `src/lib/contact-abuse.ts`
- [X] T011 [US1] Add an injectable SMTP transport boundary with finite timeout, TLS, fixed sender/recipient, plain text, and no retry in `src/lib/contact-mailer.ts`
- [X] T012 [US1] Implement POST handling, bounded body parsing, status mapping, and 303 success response in `src/pages/api/contacto.ts`
- [ ] T013 [US1] Build the progressive contact form with approved channels, limits, privacy link, accessible errors, preserved values, and unavailable state in `src/pages/contacto.astro`
- [ ] T014 [US1] After SMTP provider and transport approval, add the bounded SMTP dependency and lock its approved version in `package.json` and `pnpm-lock.yaml`

**Checkpoint**: Contact submission is independently verifiable using fake SMTP; production activation remains gated on approved provider, sender, recipient, and secret provisioning.

---

## Phase 4: User Story 2 - Usar canales públicos y conocer el uso de datos (Priority: P2)

**Goal**: Show only approved public channels and make privacy, cookies, and terms directly accessible without an unnecessary consent banner.

**Independent Test**: Open `/contacto`, `/privacidad`, `/cookies`, and `/terminos` directly; verify approved channels only, working links, draft legal status until approval, and no consent banner while non-essential storage is absent.

### Tests for User Story 2

- [X] T015 [P] [US2] Verify approved, pending, and excluded channels render without inferred values or empty links in `tests/unit/public-contact-channels.spec.ts`
- [X] T016 [P] [US2] Verify legal routes, direct navigation, privacy links, draft status, and absence of a consent banner in `tests/integration/contact-legal-pages.spec.ts`

### Implementation for User Story 2

- [X] T017 [US2] Model individually approved public channels and omit pending/excluded values in `src/content/site.ts`
- [X] T018 [US2] Update public contact channel rendering to consume only approved content in `src/pages/contacto.astro`
- [X] T019 [P] [US2] Ensure the privacy document explains submitted data, purpose, retention, and rights while visibly remaining pending legal approval in `src/pages/privacidad.astro`
- [X] T020 [P] [US2] Ensure the cookies document reflects the actual storage behavior and has no consent flow while non-essential storage is absent in `src/pages/cookies.astro`
- [X] T021 [P] [US2] Ensure terms are directly available and visibly marked draft until human approval in `src/pages/terminos.astro`

**Checkpoint**: Public contact and legal routes work without treating unapproved values or draft copy as approved.

---

## Phase 5: User Story 3 - Mantener el sitio disponible durante una publicación (Priority: P2)

**Goal**: Promote one verified immutable image at a time, identify the active version, and restore the previous image when post-deployment checks fail.

**Independent Test**: In a controlled deployment environment, verify canonical HTTPS and www redirect, serialized digest promotion and metadata, safe health responses, and rollback to the prior digest after a simulated health failure.

### Tests for User Story 3

- [X] T022 [P] [US3] Verify GET, HEAD, POST, Allow, and exact non-sensitive health response contract in `tests/integration/health-endpoint.spec.ts`
- [ ] T023 [P] [US3] Add a controlled two-digest promotion/health-failure/rollback scenario in `tests/integration/deployment-rollback.spec.ts`

### Implementation for User Story 3

- [X] T024 [US3] Enforce the exact public health contract without version, host, mail, or secret details in `src/pages/api/salud.ts`
- [ ] T025 [US3] Create serialized production deployment that verifies before promotion, promotes the verified digest, records metadata, health-checks, and rolls back on failure in `.github/workflows/deploy.yml`
- [X] T026 [US3] Configure the production image and runtime for the approved single-instance deployment contract in `Dockerfile` and `compose.yaml`
- [ ] T027 [US3] Add an external production check for canonical HTTPS, www redirect, certificate, and public health endpoint in `.github/workflows/deploy.yml`

**Checkpoint**: Deployment and rollback behavior is demonstrable with test digests; actual production use remains gated on approved host, DNS, SSH, registry, and alerting details.

---

## Phase 6: User Story 4 - Cerrar la v1 con evidencia y aprobaciones completas (Priority: P1)

**Goal**: Link evidence and outcomes for all 34 criteria, three human reviews, eight decisions, and 000/010 dependencies; block release and completion while required evidence is incomplete.

**Independent Test**: Evaluate the closure record with each blocker class present and verify publication/completion stays blocked; provide complete evidence and approvals and verify technical and human results remain distinct.

### Tests for User Story 4

- [X] T028 [P] [US4] Cover 34-criterion coverage, missing evidence, human reviews, decisions, and 000/010 dependency states in `tests/unit/release-readiness.spec.ts`
- [X] T029 [P] [US4] Verify the release command reports blockers and distinguishes technical checks, human approvals, exceptions, and open risks in `tests/integration/release-readiness.spec.ts`

### Implementation for User Story 4

- [X] T030 [US4] Record per-criterion, review, decision, and dependency result/evidence references without personal data in `specs/002-contacto-operacion-cierre/closure-evidence.md`
- [X] T031 [US4] Enforce the 34 criteria, three human reviews, eight applicable decisions, and verifiable 000/010 closure rules in `scripts/check-release-readiness.mjs`
- [X] T032 [US4] Add the 020 release-gate command and its machine-readable result to `package.json` and `scripts/verify-spec-020.mjs`
- [ ] T033 [US4] Add explicit publication and v1 completion blocking behavior for failed, pending, missing, or unapproved omitted evidence in `.github/workflows/deploy.yml` and `scripts/verify-spec-020.mjs`

**Checkpoint**: Publication and completion remain blocked until actual evidence and human approvals are recorded; creating the evidence record does not mark any check passed.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Validate inherited quality gates and document unresolved operational decisions.

- [X] T034 [P] Run the full inherited visual scene suite and preserve the approved references in `tests/visual/scenes.spec.ts`
- [X] T035 [P] Verify WCAG 2.2 AA behavior and privacy/security handling for the contact and legal journeys in `tests/e2e/accessibility.spec.ts` and `tests/integration/contact-submission.spec.ts`
- [ ] T036 Execute the complete feature quickstart and record actual outcomes and remaining blockers in `specs/002-contacto-operacion-cierre/quickstart.md`

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; adds shared CI and operator instructions.
- **Foundational (Phase 2)**: Depends on setup; supplies the common release gate.
- **User Stories (Phases 3–6)**: Begin after the shared gate exists. US1 and US2 can proceed in parallel. US3 depends on the gate from US4 before production promotion. US4 depends on evidence from US1–US3 and verified exits for 000/010 before release can pass.
- **Polish**: Depends on implementation of the desired stories; production checks additionally depend on all human operational decisions being resolved.

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2; no dependency on other stories. Live delivery requires approved SMTP provider/sender/recipient and provisioned secrets.
- **US2 (P2)**: Can start after Phase 2; content-channel and legal approvals remain human gates.
- **US3 (P2)**: Can build and test after Phase 2; production promotion requires the US4 gate and approved deployment decisions.
- **US4 (P1)**: Gate tooling can start after Phase 2; the final gate depends on evidence from all applicable stories plus verified 000/010 closure.

### Parallel Opportunities

- T001 and T002 can run in parallel.
- T005–T008 can run in parallel; T009 and T010 can run in parallel.
- US1 and US2 implementation can proceed in parallel after Phase 2, except edits to the shared `src/pages/contacto.astro` should be coordinated between T013 and T018.
- T015–T016 and T019–T021 can run in parallel where they touch separate files.
- US3 contract tests can run in parallel; deployment workflow work should share one coordinated edit of `.github/workflows/deploy.yml` across T025 and T027.
- T028–T029 can run in parallel; evidence inventory and verifier work (T030–T033) depend on agreed gate schema.

## Parallel Example: User Story 1

```bash
# Independent tests and policy modules can be prepared concurrently:
Task: "Cover submission validation and request boundary in tests/unit/contact-submission.spec.ts"
Task: "Cover abuse controls and idempotency in tests/unit/contact-abuse.spec.ts"
Task: "Implement bounded parsing and validation in src/lib/contact-submission.ts"
Task: "Implement ephemeral abuse controls in src/lib/contact-abuse.ts"
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 with a fake SMTP transport and verify accepted and failed journeys independently.
3. Keep live SMTP activation blocked until the provider, sender, recipient, and secrets are approved.

### Incremental Delivery

1. Deliver US1 contact behavior and tests.
2. Deliver US2 approved channels and legal pages.
3. Deliver US3 immutable promotion and rollback in a controlled environment.
4. Complete US4 only after all applicable technical evidence, human reviews, and 000/010 dependency closures are verified.

### Release Constraints

- Eight human decisions in `research.md`, legal approval, and verifiable closure of specs 000 and 010 are external gates; no task may infer their outcomes.
- Do not update visual references as part of implementation; only approved visual changes can alter them.
- Keep SMTP credentials and deployment secrets outside source, client bundles, logs, and artifacts.


## Execution Notes (2026-09-25)

Completed tasks are checked above. The following remain open because their required behavior or external approval is not present:

- T001: CI runs contact/legal/release checks, but deployment-contract and rollback verification are not implemented.
- T008/T011/T013: no approved SMTP provider/transport or public fallback channel exists; end-to-end delivery and value-preserving failure journeys cannot be enabled or verified.
- T014: explicitly waits for provider, transport and address approval before dependency selection.
- T016: direct-route behavior is checked at source level; full HTTP legal journey and consent-storage verification remain open.
- T023/T025/T027: deploy target, registry and SSH details are pending; no production rollback workflow or external domain check can be exercised safely.
- T033: release readiness blocks closure, but there is no production deploy workflow to wire to that gate yet.
- T036: local checks were recorded in quickstart.md; the complete quickstart is blocked by inherited E2E/visual failures and unresolved external decisions.

