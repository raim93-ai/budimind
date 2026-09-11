# BudiMind Current-State Inventory

**Task:** S00-T01 Inventory and quarantine  
**Observed:** 2026-09-10  
**Source:** working tree inspection; no runtime behavior is inferred from filenames alone.

## Repository state

| Area                      | Observed state                                                           | Decision for Stage 00                                                |
| ------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Root Git repository       | No commits; all scaffold files are untracked                             | Keep current work intact; establish baseline only after owner review |
| Nested context repository | Existing modified documents plus new planning documents                  | Preserve all changes; do not reset or merge automatically            |
| `tmp/`                    | Ignored legacy GitHub review clone                                       | Keep quarantined and outside runtime imports                         |
| `nul`                     | Untracked root artifact with unclear origin                              | Document; do not delete without explicit approval                    |
| Context pack              | Product, architecture, stack, decisions, full-stack, and execution plans | Keep; execution plan v2.0 is authoritative for order                 |

## Keep and use

| Path                         | Why it is useful                                   | Constraints                                                           |
| ---------------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| `apps/corporate-web`         | Corporate/Analysis Next.js application boundary    | Current pages are wireframes; rebuild against UI standard             |
| `apps/clinic-web`            | Clinical/Public Next.js application boundary       | Current pages are wireframes; rebuild against UI standard             |
| `apps/api-corporate`         | Corporate API namespace and health route skeleton  | No Python dependency manifest, models, migrations, or auth yet        |
| `apps/api-clinical`          | Clinical API namespace and health route skeleton   | No Python dependency manifest, models, migrations, or auth yet        |
| `apps/worker`                | Worker namespace/config/logging skeleton           | Needs plane-specific entry points, queues, retries, and tests         |
| `packages/ui`                | Existing domain-neutral React primitives           | Audit accessibility and remove generic styling before reuse           |
| `packages/contracts`         | Shared contract package placeholder                | Generate from separate API OpenAPI documents; no duplicate hand types |
| `python/budimind_core`       | Intended shared audit/identity/error primitives    | Must not contain cross-plane repositories or data access              |
| `python/corporate_domain`    | Intended corporate scoring/release domain          | Implement only approved instruments and policies                      |
| `python/clinical_domain`     | Intended clinical booking/care domain              | Implement only approved clinical workflows                            |
| `compose.yaml`               | Two isolated local PostgreSQL services             | Mirrors the two-project Supabase boundary for synthetic development   |
| `infra/`                     | Empty Terraform module/environment layout          | Do not build cloud infrastructure before Stage 11                     |
| `tests/`                     | Empty contract/security/performance/fixture layout | Add tests with the feature that needs them                            |
| `psychology-clinic-context/` | Persistent product and engineering context         | Update only for approved decisions or plan evidence                   |

## Rework before feature work

| Finding                                                                                              | Evidence                                                        | Required owner/task                                                     |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Web apps and UI package use Next.js 14/React 18 ranges                                               | Both app manifests and `packages/ui/package.json`               | S00-T02: pin supported Next.js 16/React 19/Node 24                      |
| Root package uses pnpm 9 and Node `>=20`                                                             | Root `package.json`                                             | S00-T02: pin pnpm 10 and Node 24 LTS                                    |
| Web scripts use obsolete `next lint`                                                                 | Both app manifests                                              | S00-T02: replace with supported ESLint CLI                              |
| Python dependencies are not declared or locked                                                       | No `pyproject.toml`/`uv.lock` in APIs, worker, or root          | S00-T02: create one locked Python workspace                             |
| Root quality commands are declared but not all executable                                            | Root `package.json`; current install lacks a Prettier binary    | S00-T02/S00-T04: clean frozen install and make commands real            |
| Current pages contain generic marketing gradients, repeated cards, and unsupported claims            | Current `src/app` pages/styles                                  | S02-T04 and feature stages: rebuild to calm clinical editorial standard |
| No application migrations, auth, policy engine, or domain APIs                                       | App trees contain only health/root/config/session/logging stubs | S02 onward, after G0/G1 contracts                                       |
| `compose.yaml` uses shared network, default database passwords, Redis, and broad LocalStack services | `compose.yaml`                                                  | S00-T03: minimize and isolate local dependencies; synthetic data only   |
| Root README links to non-existent `docs/*.md` paths                                                  | Root `README.md`                                                | Corrected in planning task; keep links aligned as docs are created      |

## Do not port

- Legacy SQLite schema, sequential result identifiers, unauthenticated email/ID patient lookup, custom JWT fallback,
  public result pages, employer clinical severity/risk metrics, company-assigned clinical assessments, and any real or
  copied response data.
- Any legacy UI claim of HIPAA/security certification, encryption, customer trust, or clinical outcome without current
  jurisdiction-specific evidence and owner approval.

## Quarantine rules

1. The legacy clone remains under ignored `tmp/` and is never imported by a build, test, seed, or runtime path.
2. Candidate wording, instruments, scoring, charts, and resources require an entry in the salvage register before use.
3. Synthetic fixtures are authored in the target repository; do not copy legacy database rows or identifiers.
4. Any removal of `nul`, old pages, or scaffold dependencies is a later task with an exact target and reversible change.
