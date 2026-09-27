# Publication and v1 closure gates

Each entry must have a pass/fail/pending/not-run result and a link to reproducible evidence. Human approvals must identify reviewer and date. An approved exception must identify scope, rationale, approver and expiry/recheck condition. Missing evidence is pending.

## Mandatory evidence set

- All 34 criteria in the v1 acceptance inventory, each separately evidenced.
- Technical verification for contact validation, unique delivery, failure retention, rate limit/idempotency, privacy/log redaction, legal routes, safe health, domain/HTTPS, image digest/serialized deployment/rollback, accessibility/security and full inherited visual suite.
- Human review: public content/channels and mentions; privacy/legal copy and data handling; operations and recovery.
- Verifiable closure state for specs 000 and 010, including visual/accessibility outcomes. Administrative continuation permission is not technical acceptance.
- Resolution and evidence for each applicable decision in research.md.

## Decision rules

- Publish allowed only if every publication-blocking criterion has pass or explicitly approved exception, all required checks ran, all blocking human decisions are verified, legal approval is complete, and 000/010 dependencies meet their documented exit conditions.
- v1 complete allowed only if all 34 criteria have result/evidence, no blocking failure or unapproved omission remains, all three human reviews are complete, and both prior specs have verifiable closure.
- Any fail, pending, absent evidence, unapproved not-run, unresolved blocking decision, or unverified dependency keeps the relevant gate blocked.
- A release summary must distinguish machine checks, human approvals, exceptions and open risks. It must not infer approval from an existing public value, recommendation, prior administrative decision or successful build.

## Current known blockers

The spec enters planning as Draft. Eight external decisions listed in research.md remain open. README also records 000 acceptance and accessibility review as pending and legal texts as drafts; spec 001 records its predecessor dependency and acceptance state. These are starting facts, not passes granted by this contract.
