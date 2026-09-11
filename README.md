# BudiMind

A dual-platform mental health and workforce analytics platform.

> **Repository status:** pre-alpha scaffold. The product and deployment plan are defined, but the current pages and API
> stubs are not production-ready. Do not use real-person data. Start implementation with [`AGENTS.md`](AGENTS.md) and
> the [`Webapp-First Build and Deployment Execution Plan`](psychology-clinic-context/AI_DEPLOYMENT_EXECUTION_PLAN.md).

## Overview

BudiMind consists of two bounded products sharing a brand, design system, and deployment platform:

1. **Corporate/Analysis** — Confidential workforce assessments, governed I/O and CP analysis, privacy-released employer
   reports, interventions, and follow-up measurement.
2. **Clinical/Public** — Public and employee CP discovery, direct booking, intake, payment/benefit entitlement, private
   assessment, and clinician workflows.

The two products do not share unrestricted data access. Corporate-to-clinical movement occurs only through
client-authorised referral handoff or opaque benefit-entitlement check.

## Architecture

```
Hostinger Malaysia edge/runtime
       |
       +---------------- Corporate/Analysis ----------------+
       |  corporate-web -> corporate-api -> corporate-db    |
       |                     |             -> released views |
       |                     +-> SQS -> worker               |
       |                     +-> report storage              |
       |                                                     |
       +---------------- Clinical/Public --------------------+
       |  clinic-web -> clinical-api -> clinical-db          |
       |                   |          -> private documents    |
       |                   +-> SQS -> reminders/reconciliation|
       |                                                     |
       +---------------- Trust brokers ----------------------+
          invitation broker | entitlement broker | audit sink
```

## Repository Structure

```
budimind/
├── apps/
│   ├── corporate-web      # Next.js corporate sponsor, analyst, survey UI
│   ├── clinic-web         # Next.js public, client, employee, CP UI
│   ├── api-corporate      # FastAPI corporate collection, analysis, release API
│   ├── api-clinical       # FastAPI CP, availability, booking, intake, care API
│   └── worker             # Python SQS consumers and scheduled jobs
├── packages/
│   ├── ui                 # Accessible, non-domain-specific UI components
│   ├── contracts          # Generated TypeScript clients and shared enums
│   └── config             # Shared lint, formatting, TypeScript config
├── python/
│   ├── budimind_core      # Audit, identity claims, errors, idempotency
│   ├── corporate_domain   # Scoring, privacy release, reporting
│   └── clinical_domain    # Scheduling, referral, entitlement, consent
├── infra/
│   ├── modules            # Network, compute, database, queue, storage
│   └── environments       # dev, staging, production
├── tests/
│   ├── contracts
│   ├── security
│   ├── performance
│   └── fixtures
├── docs/
│   ├── api
│   ├── decisions
│   ├── methodology
│   ├── runbooks
│   └── threat-models
├── compose.yaml           # Local development infrastructure
├── .env.example           # Environment variables template
├── package.json           # Root workspace configuration
├── tsconfig.json          # Root TypeScript configuration
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
└── .gitignore
```

## Technology Stack

- **Web target**: Next.js 16 Active LTS + React 19 + strict TypeScript
- **API target**: FastAPI + Python 3.13 + Pydantic 2 + SQLAlchemy 2.x + Alembic
- **Database**: MySQL 8 (separate corporate and clinical databases/users)
- **Queue/storage**: add durable providers only when the implementing stage requires them
- **Identity**: Auth0 Australia, conditional on contract/TIA; server-side sessions and privileged-role MFA
- **Infrastructure**: Hostinger Enterprise Malaysia; AWS `ap-southeast-5` later for approved email/backup/security use
- **CI/CD**: GitHub Actions with protected deployment environments
- **Observability**: structured redacted logs; Sentry EU only after contract/TIA
- **Assurance targets**: OWASP ASVS 5.0, NIST SSDF, and WCAG 2.2 AA

The checked-in manifests were upgraded from the old prototype toolchain. Stage `S00-T02` records the lockfile and
remaining dependency-policy evidence before feature work.

## Current scaffold preview

These commands preview the existing web wireframes only. They are not evidence of a working product. The Python
dependency manifests, database migrations, identity, and end-to-end journeys are Stage 00+ work.

### Prerequisites

- Node.js 24 LTS
- pnpm 10 (use the repository-pinned version once Stage 00 is complete)
- Python 3.13
- uv (Python package manager)
- Docker & Docker Compose
- Git

### Installation

```bash
# Clone and enter the repository
cd budimind

# Install root dependencies (uses pnpm workspaces)
pnpm install --frozen-lockfile

# Start local infrastructure
docker compose up -d

# Verify databases are healthy
docker compose ps
```

### Running Locally

```bash
# Terminal 1: Corporate Web (port 3000)
pnpm dev:corporate-web

# Terminal 2: Clinic Web (port 3001)
pnpm dev:clinic-web

# API commands become supported after Stage 00 creates and locks the Python workspace.
```

### Health Checks

- Corporate Web: http://localhost:3000/health-ui
- Clinic Web: http://localhost:3001/health-ui
- Corporate and clinical API health/docs: available after Stage 00

## Target quality command contract

Run from repository root:

```bash
# Format check
pnpm format:check

# Lint
pnpm lint

# Type check
pnpm typecheck

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Implemented and verified by Stage 00
pnpm test:integration
pnpm python:sync
pnpm python:lint
pnpm python:typecheck
pnpm python:test
pnpm db:migrate
pnpm db:reset:test
```

## Environment Configuration

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

**Never commit `.env` files with real credentials.**

## Key Design Principles

1. **Strict Data Isolation** — Corporate and clinical data never mix. Separate databases, credentials, and API surfaces.
2. **Privacy by Design** — Employers never access response-level data. All employer-visible data goes through privacy
   release pipeline.
3. **Role Separation** — CP analyst and treating-CP permissions are separate assignments.
4. **Audit Everything** — All sensitive operations are logged with correlation IDs, no sensitive payloads in logs.
5. **Accessibility First** — WCAG 2.2 AA target for all user-facing journeys.

## Documentation

- [Agent rules](AGENTS.md) — mandatory task discipline, safety boundaries, and report format
- [Execution plan](psychology-clinic-context/AI_DEPLOYMENT_EXECUTION_PLAN.md) — authoritative stage/task order
- [Session context](psychology-clinic-context/SESSION_CONTEXT.md) — product model, scope, and unresolved decisions
- [Architecture](psychology-clinic-context/ARCHITECTURE.md) — boundaries, workflows, and deployment shape
- [Technology stack](psychology-clinic-context/TECH_STACK.md) — choices, rationale, and deferred technology
- [Full-stack reference](psychology-clinic-context/FULLSTACK_DEVELOPMENT_PLAN.md) — routes, models, APIs, and tests
- [Decision log](psychology-clinic-context/DECISIONS_LOG.md) — architecture and product decisions

## Contributing

1. Create a feature branch from `main`
2. Make changes with tests
3. Run quality checks: `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test`
4. Open a pull request
5. CI must pass before merge

## License

Proprietary — All rights reserved.
