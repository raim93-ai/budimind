# BudiMind Agent Execution Rules

This repository contains a safety-sensitive mental-health and workforce product. These rules apply to every coding
agent, including lower-capability agents. The active handoff and remaining-work queue are in `LUNA_EXECUTION.md`. The
larger historical execution plan remains a functional reference, but its obsolete platform wording is not
authoritative.

## Current architecture override

The product owner's 2026-09-11 platform decision supersedes older Hostinger/MySQL and AWS-first wording in the nested
context repository. Use Vercel with two isolated Supabase/PostgreSQL projects: one corporate and one clinical. Configure
Vercel Functions and both Supabase projects in Singapore. Free tiers are synthetic-data development/preview only; they
are prohibited for real-person, payment, assessment, or clinical production use. The controlling records are
`docs/decisions/launch-configuration.md` and `docs/decisions/deployment-trajectory.md`. Sequence and human gates in the
nested execution plan still apply.

## Start here

Before changing application, infrastructure, schema, or deployment code:

1. Read this file completely.
2. Read `LUNA_EXECUTION.md` completely.
3. Read `psychology-clinic-context/SESSION_CONTEXT.md`.
4. Read only the current stage section in `psychology-clinic-context/AI_DEPLOYMENT_EXECUTION_PLAN.md`.
5. Locate the earliest incomplete task in the active stage. Work on that task only.
6. Read every file listed for that task in `LUNA_EXECUTION.md` and the plan's task file-routing table.
7. Inspect `git status --short` and preserve unrelated or pre-existing work.

If the user explicitly names a later task, execute that task only after confirming its prerequisites are complete.

## Scope discipline

- One task, one coherent change, one verification report.
- Do not silently add features, dependencies, abstractions, services, or design patterns.
- Reuse the existing monorepo, two web apps, two APIs, shared packages, and context pack where they fit the plan.
- Do not copy the legacy GitHub application wholesale. Use the legacy salvage table in the execution plan.
- Do not mark a checkbox complete unless its commands pass and its evidence exists.
- A task is incomplete until `docs/evidence/SXX-TYY.md` exists with `Status: COMPLETE` and reproducible results.
- Do not leave `TODO`, placeholder UI, mock success responses, fake metrics, or disabled tests inside completed scope.
- Never weaken validation, authorisation, privacy, accessibility, or audit behavior to make a test pass.

## Non-negotiable boundaries

- Corporate/Analysis and Clinical/Public have separate APIs, databases, service identities, secrets, and access paths.
- Employers and sponsors receive only approved privacy-released aggregates. They never receive response-level data.
- Employers never learn who booked, attended, chose a clinician, completed a clinical assessment, or entered care.
- Corporate-to-clinical handoff is client initiated, explicit, one-time, minimal, and auditable.
- Professional analysis access is purpose-bound, time-bounded, audited, and distinct from treating-clinician access.
- No AI makes or recommends employment, diagnostic, triage, or treatment decisions in the MVP.

## Security rules

- Deny by default. Enforce authorisation in each API action and query, not only in the UI or route middleware.
- Use managed OIDC, authorization code with PKCE, server-side sessions, secure cookies, and MFA for privileged roles.
- Never implement custom password storage or custom JWT issuance.
- Never put secrets, tokens, identifiers, assessment answers, clinical content, or real-person data in source control,
  logs, traces, analytics, URLs, screenshots, prompts, fixtures, or test output.
- Use parameterised data access, strict request schemas, migrations, constraints, idempotency keys, CSRF protection,
  restrictive CORS/CSP, rate limits, encrypted transport/storage, and least-privilege identities.
- Every sensitive allow-path needs a denial test for wrong role, tenant, purpose, relationship, and data plane.
- Stop for human approval when a task needs a legal basis, clinical rule, instrument licence/scoring rule, privacy
  threshold, vendor contract, production secret, destructive migration, or real data.

## UI rules

- Follow the design standard in the execution plan. Current prototype pages are not design references.
- Use semantic HTML and shared primitives before adding dependencies or custom abstractions.
- No generic gradient hero, decorative blob, glassmorphism, oversized slogan, invented testimonial/logo strip, fake
  dashboard metric, rainbow chart, or grid of repetitive feature cards.
- All states must be deliberate: default, hover, focus, disabled, loading, empty, error, success, and destructive.
- Meet WCAG 2.2 AA and support keyboard-only use, 200% zoom, reduced motion, and 390/768/1440 px viewports.
- Use realistic synthetic content. Never imply certifications, customer trust, clinical outcomes, encryption modes, or
  compliance status that have not been verified.

## Required task report

End every implementation task with:

```text
Task: [ID and name]
Status: COMPLETE | PARTIAL | BLOCKED
Files changed: [paths]
Commands run: [exact commands]
Tests: [pass/fail counts and relevant evidence]
Security/privacy checks: [results]
UI evidence: [routes and screenshot/accessibility results, or N/A]
Known limitations: [list]
Human decisions required: [list]
Next permitted task: [one task ID]
```
