# Vercel + Supabase Deployment Trajectory

Status: ACTIVE — supersedes Hostinger/MySQL/AWS deployment wording Decision date: 2026-09-11 Scope: G0–G3 and Stages 0–3

## Non-negotiable platform shape

| Plane              | Vercel projects                                    | Supabase project     | Public browser key             | Server secret         |
| ------------------ | -------------------------------------------------- | -------------------- | ------------------------------ | --------------------- |
| Corporate/Analysis | `budimind-corporate-web`, `budimind-corporate-api` | `budimind-corporate` | Corporate publishable key only | Corporate secret only |
| Clinical/Public    | `budimind-clinic-web`, `budimind-clinical-api`     | `budimind-clinical`  | Clinical publishable key only  | Clinical secret only  |

Both Supabase projects use the specific Singapore region. All four Vercel projects pin Functions to `sin1`. Never copy a
key, database URL, Auth user, Storage bucket, migration, webhook secret or backup between planes. No cross-project SQL,
foreign data wrapper, shared service account or unrestricted analytics sink is permitted.

## Free-tier rule

The free configuration exists only to build and review the product with synthetic data:

- no real names, emails, phone numbers, employee data, assessments, appointments, clinical records or payment events;
- no public booking, assessment submission, WhatsApp/Calendar connection or live Stripe mode;
- no production or compliance claim;
- no availability promise or reliance on Supabase Free backups;
- Vercel Hobby must not be used for BudiMind commercial operations.

Before G2, upgrade both Supabase projects within an approved paid organisation and use an approved commercial Vercel
plan. Re-run the complete production checklist after the upgrade; a successful free preview is not production evidence.

## Execution order

An executor must stop at the first failed check and record the exact failure in `docs/evidence/`. Never skip forward.

### P0 — Repository rebase

1. Use PostgreSQL/asyncpg throughout application configuration and local tests.
2. Keep two isolated local PostgreSQL containers on ports `5432` and `5433`.
3. Use SQLAlchemy `NullPool` for serverless API connections; hosted URLs use the Supabase transaction pooler and TLS.
4. Keep Supabase publishable and secret variables separate. A variable containing `SECRET` must never be prefixed
   `NEXT_PUBLIC_`.
5. Verify format, lint, typecheck, unit tests, local database health, migration up, and guarded test reset.
6. Record evidence and commit before creating cloud resources.

Exit: repository checks pass and no MySQL/Hostinger/AWS runtime dependency remains outside superseded evidence/history.

### P1 — Synthetic Supabase projects

1. Create one BudiMind Supabase organisation with two Free projects named above. Select the specific Singapore region,
   not the general APAC region. Enable owner MFA and add a second recovery owner only when formally authorised.
2. Save project references in the approved password/secret manager, never in Git or evidence screenshots.
3. Link and migrate each project independently. Every migration must target exactly one plane.
4. Create the minimum schema for the current feature only. Enable RLS and explicitly set grants in the same migration.
5. Add allow-and-deny policy tests for `anon`, `authenticated`, wrong role, wrong tenant/relationship and wrong plane.
6. Use current publishable keys in browser code and current secret keys only in server-side Vercel environments. Do not
   introduce legacy long-lived `anon`/`service_role` keys into new configuration.
7. Run Supabase Security Advisor and retain a redacted result. Resolve every exposed-table and leaked-key finding.

Exit: two synthetic-only projects, migrations reproducible, RLS/grant denial tests passing, no cross-plane credential.

### P2 — Vercel preview projects

1. Import the GitHub repository into four Vercel projects. Set Root Directory to `apps/corporate-web`,
   `apps/api-corporate`, `apps/clinic-web` and `apps/api-clinical` respectively. Do not combine the data planes.
2. Use Node 24 and the repository-pinned pnpm version. Keep Framework Preset `Next.js`; do not override build output.
3. Confirm each checked-in `vercel.json` pins server functions to `sin1`.
4. Add only that plane's Supabase URL and publishable key to its web Preview. Add database/secret variables only to its
   API Preview. Never expose database URLs or secrets to `NEXT_PUBLIC_*`.
5. Keep generated preview URLs access-controlled where the plan permits. Use synthetic fixtures and Supabase test-mode
   email only. Do not attach the production domain yet.
6. Verify headers, robots/noindex, 390/768/1440 layouts, keyboard navigation, 200% zoom, error/empty/loading states and
   browser logs. Run dependency, secret and authorization scans.

Exit: both preview builds pass independently and cannot access the other plane.

### P3 — Stage 2 trusted platform

1. Implement Supabase Auth separately per plane using server-side sessions. Require verified email; require MFA and
   step-up for privileged roles. Do not build passwords or JWT issuance.
2. Implement policy checks at both the application action and PostgreSQL RLS/grant layers. UI hiding is not security.
3. Add append-only, payload-minimised audit records. Keep identifiers, tokens, assessment answers and clinical content
   out of Vercel/Supabase logs.
4. Add bilingual privacy, consent and crisis content where comprehension is safety-critical.
5. Complete threat-model denial tests and a cross-plane secret/configuration test.

Exit: Stage 2 synthetic evidence is complete under G1-S. Synthetic data remains mandatory until G2 has named human
approval.

### P4 — Stage 3 verified directory

1. Store credential evidence in the clinical project only and publish only an approved projection.
2. Default every professional to unpublished. Publication requires verified current registration/practising certificate,
   scope, indemnity and dual Clinical Operations/Clinical Governance approval.
3. Expose a bounded public directory query with pagination, allow-listed filters, rate limits and no private columns.
4. Expiry, suspension or failed re-verification immediately blocks new bookings and removes the public projection.
5. Test unpublished leakage, identifier enumeration, cache invalidation, wrong-role writes and accessible empty/error
   states.

Exit: Stage 3 evidence is complete. This does not authorise booking or real-person data.

## G2 production conversion

Before any real-person pilot:

1. Upgrade Vercel to a commercial plan and Supabase to an approved paid organisation covering both projects.
2. Execute DPAs and complete the Malaysia-to-Singapore transfer-impact assessment, privacy notices and consent updates.
3. Verify SSL enforcement, network restrictions, MFA, key rotation, least privilege, log retention and subprocessors.
4. Verify automatic backups, approved PITR/RPO/RTO, independent encrypted export, isolated restore and deletion/exit.
5. Create separate Preview and Production environment secrets; rotate every secret used during development.
6. Attach owned domains only after DNS/TLS, CSP/CORS/cookie, webhook and rollback tests pass.
7. Complete the full G2 checklist in `gate-readiness.md`; obtain named Legal, Privacy/DPO, Security, Clinical, I/O,
   Engineering and Operations approvals tied to the release commit.

## Required verification commands

```text
docker compose config
docker compose up -d --force-recreate
docker compose ps
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm python:lint
pnpm python:typecheck
pnpm python:test
pnpm db:migrate
```

Add Supabase CLI policy tests and Vercel preview smoke tests with the first feature that needs them. Do not create empty
test harnesses merely to satisfy a checklist.

## Rollback

- Code: promote the last known-good immutable Vercel deployment; do not rebuild an old commit with new dependencies.
- Schema: use forward-fix migrations by default. Destructive rollback requires backup/restore evidence and approval.
- Secrets: revoke the affected plane's key, rotate only that plane, redeploy, and verify cross-plane denial.
- Platform: export each Supabase project independently using a documented standard PostgreSQL exit procedure. A vendor
  exit must preserve the corporate/clinical boundary.
