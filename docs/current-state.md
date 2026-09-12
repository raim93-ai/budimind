# BudiMind Current State

Observed: 2026-09-12 — Branch: `codex/stage-03`
Authoritative next task: S02-T01 in `LUNA_EXECUTION.md`

## Completed

| Area                 | State                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| Repository           | Root Git history established; work is pushed to `raim93-ai/budimind`                                     |
| Toolchain            | Node 24, pnpm 10.15.1 metadata, Python 3.13, uv lock, ESLint, Prettier, Ruff, mypy and pytest            |
| Local data boundary  | Two isolated PostgreSQL 15.8 containers and guarded migration/reset commands                             |
| Hosted data boundary | Independent Supabase corporate/clinical migration roots with deny-by-default public grants               |
| Deployment decision  | Four Vercel projects and two Singapore Supabase projects; cloud deployment runs after local coding       |
| Requirements         | G0-S/G1-S approved for synthetic implementation through Stage 10                                         |
| Web shells           | Corporate and clinic public shells plus loading, error, empty/pre-launch and not-found states            |
| Test data            | Separate deterministic G2 corporate/clinical fixtures with external side effects disabled                |
| Verification         | Unit, integration, production build and Playwright preview-smoke commands are executable                 |
| CI                   | GitHub Actions definition pins the intended runtimes and runs database, source, build and browser checks |

## Current implementation gap

The APIs remain health/root scaffolds. Domain schemas, identity sessions, policy enforcement, audit/outbox, practitioner
directory, booking, clinical intake, corporate collection, privacy release and external adapters are not implemented.
The exact task sequence and acceptance conditions are in `LUNA_EXECUTION.md`.

## Preserved work

- `psychology-clinic-context` is a separate modified nested repository. Root documents override its old
  Hostinger/MySQL/AWS platform wording; do not reset or push it to an unknown destination.
- The ignored legacy clone remains quarantined under `tmp/` and is never imported into runtime code or fixtures.
- The root `nul` artifact has unclear ownership and remains untouched.

## Non-negotiable release boundary

Synthetic development may continue without further product decisions. Real identities, employee or clinical data,
payments, external messages, public booking, production domains and commercial claims remain disabled until the inputs
listed at the end of `LUNA_EXECUTION.md` and the G2 controls in `docs/decisions/gate-readiness.md` are satisfied.
