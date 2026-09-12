# Luna Execution Handoff

- Status: READY FOR SYNTHETIC IMPLEMENTATION
- Current task: S02-T01
- Deployment rule: finish and verify all local coding through Stage 10 before creating cloud deployments.

## Read order

1. `AGENTS.md`
2. This file
3. `docs/decisions/launch-configuration.md`
4. `docs/permissions-matrix.md`
5. `docs/data-classification.md`
6. The current stage section in `psychology-clinic-context/AI_DEPLOYMENT_EXECUTION_PLAN.md`

Do not treat old MySQL, Hostinger or AWS wording in the nested context repository as current. PostgreSQL, Supabase and
Vercel decisions in the root documents always win.

## Fixed architecture

Corporate and clinical data planes stay physically and logically separate.

| Component                   | Source root          | Hosted target                           | Allowed secrets                |
| --------------------------- | -------------------- | --------------------------------------- | ------------------------------ |
| Corporate web               | `apps/corporate-web` | `budimind-corporate-web` Vercel project | Corporate public URL/key only  |
| Corporate API               | `apps/api-corporate` | `budimind-corporate-api` Vercel project | Corporate database/secret only |
| Clinic web                  | `apps/clinic-web`    | `budimind-clinic-web` Vercel project    | Clinical public URL/key only   |
| Clinical API                | `apps/api-clinical`  | `budimind-clinical-api` Vercel project  | Clinical database/secret only  |
| Corporate data/Auth/Storage | `supabase/corporate` | `budimind-corporate` Supabase project   | Corporate plane only           |
| Clinical data/Auth/Storage  | `supabase/clinical`  | `budimind-clinical` Supabase project    | Clinical plane only            |

The browser calls its own web origin. Each web deployment proxies `/api/v1/*` to its matching API so the browser never
needs a database URL or server secret. The API projects are public network endpoints and must enforce authentication,
authorization, rate limits and generic denial responses. Do not use Vercel Services because it is still private beta.

All Vercel Functions use `sin1`; both Supabase projects use specific Singapore region `ap-southeast-1`. Free plans are
synthetic previews only.

## Already complete

- Stage 00 repository/toolchain/local Postgres foundations and command gates.
- Stage 01 contracts, threat baseline and UI direction under G0-S/G1-S.
- Separate Supabase migration roots with deny-by-default public grants.
- G2 synthetic UAT fixtures in `fixtures/g2`; they never authorize a real-person pilot.
- Static clinic/corporate public shells, error/loading/not-found states and preview smoke tests.
- CI workflow that pins Node 24, pnpm 10.15.1, Python 3.13 and uv 0.12.5.

## Work protocol

For each task below:

1. Read the matching stage section in the nested execution plan and the files named here.
2. Work on one task only. Do not combine planes in a repository, ORM session, migration or test fixture.
3. Use deterministic synthetic data. External payment, email, WhatsApp, Calendar and video adapters remain local fakes.
4. Add the smallest allow test and the complete denial set required by `docs/permissions-matrix.md`.
5. Run the task commands plus the root verification commands.
6. Create `docs/evidence/SXX-TYY.md` with exact results and known limits.
7. Commit only task-owned files. Stop on the first failing command; never disable a check.

Do not leave TODOs, fake success metrics, fabricated practitioners/customers/contact details or unsupported compliance
claims. A completed UI route includes loading, empty, error, unauthorized and narrow/mobile behavior.

## Remaining coding queue

### S02-T01 — database foundation

Implement independent corporate and clinical migrations. Each plane needs UUID/UTC conventions, actor projection, opaque
server-session records, idempotency keys, append-only audit events and outbox jobs. Add only the domain tables needed by
the next vertical slice. Keep application tables in a non-public schema; expose reviewed public projections only. Test
clean migration, uniqueness, rollback-on-error and cross-plane credential failure.

- Read: `supabase/README.md`, both baseline migrations, both API database sessions, `fixtures/g2/*.json`.
- Exit: `pnpm db:reset:test && pnpm db:migrate && pnpm test:integration` pass twice from a clean database.

### S02-T02 — synthetic identity and sessions

Implement one shared identity/session primitive with plane-specific configuration. Production identity is Supabase Auth;
local tests use a deterministic fake that refuses to start unless `ENVIRONMENT` is `development` or `test`. Use opaque,
rotated, expiring server sessions and `HttpOnly`, `Secure`, `SameSite=Lax` cookies. Add CSRF validation to
state-changing browser requests. Do not implement passwords or JWT issuance.

Exit: verified-email, logout, rotation, expiry, CSRF failure, wrong-plane and production-fake rejection tests pass.

### S02-T03 — policy and audit

Turn `docs/permissions-matrix.md` into explicit action checks. Every protected query requires plane, role, tenant when
applicable, purpose and relationship. Emit payload-minimised append-only audit records with correlation IDs. Generic
403/404 responses must not reveal protected-resource existence.

Exit: allow tests plus wrong-role, wrong-tenant, missing-purpose, missing-relationship and wrong-plane denials pass for
both APIs.

### S02-T04 — web shells

Complete shared tokens and primitives without redesigning working pages unnecessarily. Add session-expired and
maintenance states. Remove remaining gradients, automatic dark styling, unverifiable copy and decorative metrics. Test
390/768/1440 layouts, keyboard flow, 200% zoom and reduced motion.

### S03 — governed practitioner directory

Implement clinical-only credential/profile tables, operations actions and a public projection. Profiles default to
unpublished. Only clinical operations can record review; publication requires current synthetic credential, scope and
indemnity plus two synthetic approvals. Expiry/suspension must unpublish atomically. Public API uses opaque slugs,
allow-listed filters, bounded pagination and public fields only. Replace the directory empty state only in test/dev;
production remains empty until real credentials pass G2.

Exit: publication lifecycle, leakage, enumeration, cache and accessible UI tests pass.

### S04–S06 — clinical booking and integrations

Follow Stages 04–06 in the nested plan and `docs/decisions/booking-capability-contract.md`. Build availability, slot
holds, booking transitions, consent/intake, hosted-payment state, entitlement and notifications. Database uniqueness is
authoritative for slot races. Every provider is a typed adapter with a deterministic fake; no external side effect is
permitted before deployment credentials and contracts exist.

### S07–S09 — corporate collection, privacy release and intervention

Follow Stages 07–09. Use only the synthetic non-clinical instrument until a licence is recorded. Sponsors see released
aggregates only. Enforce cohort suppression, complementary suppression and differencing controls. Employee support and
optional clinical referral remain private, client-initiated and invisible to sponsors.

### S10 — complete local hardening

Run authorization/abuse suites, secret and dependency scans, SBOM generation, accessibility checks, production builds,
database recovery exercises and performance budgets. Replace every remaining placeholder test. Freeze a synthetic UAT
candidate only when every Stage 02–10 evidence file is complete.

## Required commands before every stage closes

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm python:lint
pnpm python:typecheck
pnpm python:test
pnpm build
pnpm test:e2e
pnpm db:reset:test
pnpm db:migrate
git diff --check
```

## Deployment queue — run last

1. Obtain the Supabase and Vercel credentials from the user; never request that secrets be pasted into source files.
2. Create two Supabase and four Vercel projects using the fixed architecture above.
3. Add API project packaging/entrypoints using Vercel's supported FastAPI detection at deployment time; pin direct
   Python dependencies to the reviewed lock versions.
4. Apply each migration root only to its matching Supabase project and run RLS denial tests.
5. Deploy APIs, then webs with matching API URLs. Keep previews access-controlled and synthetic-only.
6. Run preview smoke, authorization, headers, accessibility and cross-plane isolation checks.
7. Do not attach the production domain or enable real external adapters until G2 has accountable human approval.

## Inputs Luna must not invent

- Vercel/Supabase account credentials, project references and generated URLs.
- Owned domain and DNS access.
- Real clinician identity, registration, practising certificate, indemnity or approval.
- Instrument licences, validated English/Malay wording or scoring keys.
- Executed vendor agreements/DPA/TIA, real email/WhatsApp/Google/Stripe credentials.
- Named G2/G3 legal, privacy, clinical, security, I/O, accessibility and operational approvals.

If a task reaches one of these inputs, finish all synthetic/local work, record the exact missing value, and stop without
weakening the implementation.
