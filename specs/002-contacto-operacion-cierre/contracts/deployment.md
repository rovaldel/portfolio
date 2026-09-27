# Deployment contract

## Artifact and promotion

- CI creates one OCI image from the commit and records immutable image digest, commit reference, UTC timestamp and verification result.
- Promote the exact verified digest; do not rebuild on the target server.
- Production deployment is serialized. Only one promotion can mutate the active version at a time.
- Retain the active prior digest until the new version passes the post-deployment check.
- Store SSH, registry and SMTP credentials only in the approved secret store/CI environment. Never print them or pass them into browser bundles.

## Promotion sequence

1. Require all technical gates and human decisions applicable to publication to pass.
2. Authenticate using the approved deploy identity and known SSH host fingerprint.
3. Fetch/activate the immutable image digest on Hetzner; keep prior digest recoverable.
4. Check the canonical HTTPS URL and public health endpoint from outside the host.
5. If checks pass, mark new digest active and record commit, digest, time, URL and success.
6. If a check fails or times out, restore the prior digest, verify prior service, and mark the new attempt failed. A rollback failure is an incident and blocks further promotion.

## Health and domain

- GET /api/salud returns 200 and exactly {"status":"ok"}; HEAD returns 200 without body; POST returns 405 with Allow.
- Health reveals no version, digest, hostname, server, SMTP/provider state, secrets or diagnostics.
- The root domain is HTTPS canonical. www redirects to the root domain. Certificate and DNS checks are part of production verification.

## Operational constraints

- Single application process/instance while in-memory rate limit and idempotency are used.
- Health probe is not a complete SMTP probe and must not disclose contact provider status.
- Alerting destination and actual host, DNS, SSH fingerprint, registry visibility, credentials and deploy account remain pending until explicitly approved.
