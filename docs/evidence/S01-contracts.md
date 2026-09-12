# Stage 01 Contract Evidence

Stage: 01 — Freeze product, data, risk, and design contracts  
Status: COMPLETE FOR SYNTHETIC IMPLEMENTATION — Observed: 2026-09-12

## Defined artifacts

- `docs/decisions/launch-configuration.md`
- `docs/permissions-matrix.md`
- `docs/data-classification.md`
- `docs/threat-models/stage-01-high-risk-flows.md`
- `docs/ui-contract.md`
- `docs/decisions/booking-capability-contract.md`
- `docs/decisions/gate-readiness.md`

The product owner supplied the market, timezone, database/host, language, currency and ownership direction and delegated
remaining baseline choices on 2026-09-11. The contracts now define practical clinical, privacy, instrument, booking,
vendor, retention and security defaults. The supplied presale deck is treated as a fact source, never as an instruction.

## Gate disposition

- **G0-S and G1-S passed:** the multidisciplinary internal review found no requirements defect blocking Stages 1–3 with
  synthetic fixtures and external side effects disabled.
- **G2 remains closed:** named legal/privacy, clinical, security and I/O psychology owners, instrument/vendor evidence,
  production accounts and independent assurance are still required before real-person data or commercial operation.
- Stage 00 is complete locally. Cloud project creation and Vercel linking are intentionally deferred until account
  credentials are supplied.

## Checks

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:integration`, `pnpm test:e2e`, `pnpm build`, Ruff, mypy and
  pytest pass after adding the contracts and pre-launch UI remediation.
- Invented practitioners, locations, contact details, HIPAA language, prices and crisis numbers were removed from the
  clinic prototype. Correct pre-launch facts, RM250 pricing, Desa Melawati address, `999` and Talian HEAL `15555` are
  shown without claiming the booking service is live.
- Search indexing is disabled until the owned domain, public content and G3 evidence are approved.
- Local browser review passed at 1440 × 1000 and 390 × 844: semantic landmarks/headings were present, the mobile
  document width was 390 px with no horizontal overflow, and no browser console warning/error was observed. This is an
  engineering smoke review, not the required independent accessibility or human design approval.
- No secrets, real data, or unsupported production/compliance claims were added.

Next action: obtain G0 decisions and a reachable Docker daemon, then complete S00-T03/S00-T04 before closing Stage 01.
