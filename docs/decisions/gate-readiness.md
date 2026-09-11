# G0–G3 Readiness and Approval Contract

Status: ACTIVE CONTROL Last reviewed: 2026-09-11

This register prevents a plan, test stub, vendor website, or AI recommendation from being mistaken for approval. A gate
passes only when every mandatory row has a named accountable human, a dated evidence link, and no blocking finding.

## Accountable roles

| Role                      | Minimum authority                                                                       | Name/evidence     |
| ------------------------- | --------------------------------------------------------------------------------------- | ----------------- |
| Product owner             | Scope, customer promise, pricing, funding and risk acceptance                           | **NAME REQUIRED** |
| Engineering/release owner | Architecture, change, migration, rollback and production release                        | **NAME REQUIRED** |
| Security owner            | ASVS verification, identity, incident response, vulnerability and vendor security       | **NAME REQUIRED** |
| Privacy/DPO owner         | PDPA, notices, DPIA, transfers, rights, retention and breach notification               | **NAME REQUIRED** |
| Malaysian legal adviser   | Corporate, consumer, healthcare, employment and instrument-contract advice              | **NAME REQUIRED** |
| Clinical governance lead  | Scope, credentials, consent, records, safeguarding, referral and emergency care         | **NAME REQUIRED** |
| I/O psychology lead       | Corporate instrument, taxonomy, analysis, interpretation, suppression and interventions | **NAME REQUIRED** |
| Operations/on-call owner  | Staffing, support, incidents, complaints, vendor operations and continuity              | **NAME REQUIRED** |

One person may hold multiple roles only when qualified and conflicts are documented. Product or engineering cannot sign
on behalf of independent legal, privacy, clinical, I/O, accessibility, or penetration-test reviewers.

## G0 — Launch configuration

Current status: **OPEN — values defined, approvals missing**

| Evidence                                            | Accountable approval                            | Status                                        |
| --------------------------------------------------- | ----------------------------------------------- | --------------------------------------------- |
| Exact `launch-configuration.md` revision            | Product, legal/privacy, clinical, security, I/O | Pending named signatures                      |
| Malaysia facility/online-service regulatory opinion | Malaysian legal + clinical governance           | Missing                                       |
| Credentialing and indemnity procedure               | Clinical governance + legal                     | Defined; unsigned                             |
| Corporate instrument/licence register               | I/O + legal/privacy                             | Policy defined; instrument permission missing |
| Vendor/region/contract register                     | Privacy + security + procurement                | Vendors selected; contracts missing           |
| Domain, Vercel and Supabase ownership               | Product + engineering/security                  | Domain value and production accounts missing  |

Synthetic implementation may use the defined values. No real-person data, public booking, assessment, payment, or
production claim is permitted while this gate is open.

## G1 — Design and risk approval

Current status: **NOT ELIGIBLE — G0 and signed control set required**

Mandatory evidence:

- approved permission matrix, data classification/inventory, retention schedule, data-flow diagrams, and threat model;
- bilingual privacy notices, telehealth/in-person consent, client terms, complaint process, clinical-independence
  charter, analyst-purpose protocol, entitlement boundary, and referral-envelope specification;
- privacy request, correction, access, export, deletion/retention, legal-hold, breach, safeguarding, emergency,
  downtime, and business-continuity procedures;
- instrument licence/translation/scoring approval and corporate release method;
- DPIA and transfer-impact assessment for every non-Malaysia processor;
- OWASP ASVS 5.0 L2 control matrix, abuse cases, test identifiers, residual-risk owners, and WCAG 2.2 AA design review;
- named accountable roles above and a dated approval record tied to a commit hash.

Passing G1 permits real identity configuration for controlled testing; it does not permit real-person pilot data.

## G2 — Real-person pilot

Current status: **NOT ELIGIBLE**

All of the following are release-blocking:

1. G0 and G1 passed on the release candidate.
2. Vercel, Supabase, Stripe, Meta, Google, Plausible, Sentry, the transactional-email provider, and any subprocessors
   have approved agreements, DPAs, regional configuration evidence, TIAs where required, least-privilege access, and
   tested exit/deletion. Vercel and both Supabase projects are on approved paid plans; free tiers are prohibited.
3. Every bookable clinician has current verified registration/practising certificate, scope, indemnity, supervision, and
   clinical-governance approval.
4. Production-like staging passes synthetic UAT for visitor, client, clinician, clinical operations, employee, sponsor,
   analyst, privacy reviewer, and platform operations.
5. An independent reviewer verifies ASVS L2/API authorization/privacy boundaries and closes every critical/high finding.
6. A qualified accessibility review has no release-blocking WCAG 2.2 AA finding.
7. Clean migration, rollback/forward-fix, encrypted backup, point-in-time recovery, isolated restore, RPO/RTO, incident
   tabletop, breach workflow, and clinical emergency tabletop pass with evidence.
8. Support hours, on-call rota, clinical escalation, privacy response, payment reconciliation, vendor escalation, pilot
   limits, feature flags/kill switches, and stop authority are staffed.
9. Exact image digests, SBOMs, attestations, migration revision, configuration version, synthetic fixtures, and evidence
   index are frozen.

The pilot approval must state maximum organisations, participants, clinicians, bookings, duration, support hours,
permitted instruments, prohibited features, success/stop criteria, and who can terminate it.

## G3 — Production launch

Current status: **NOT ELIGIBLE**

Production requires:

- a successful bounded pilot with all incidents/findings closed or explicitly accepted by the qualified owner;
- a tagged release candidate that repeats Stage 12 in production-like staging after the last material code, schema,
  policy, vendor, or infrastructure change;
- verified domain/DNS/TLS, production secrets and rotation, protected environments, dual-control access, budgets,
  alarms, dashboards, status/support communications, data retention, backups/PITR, restore, and access review;
- backward-compatible migration plus tested rollback/forward-fix and an approved release/ramp plan;
- defined SLOs, monitored clinical-safety signals, incident commander, security/privacy/clinical on-call, breach and
  patient communication, payment reconciliation, and vendor escalation;
- final dated Product, Engineering, Security, Privacy/DPO, Legal, Clinical Governance, I/O Psychology, Operations, and
  independent assurance sign-off against exact digests.

The launch sequence is internal users, limited clinic traffic, then limited corporate invitations. Disable risky entry
flags first when authorization, confidentiality, data integrity, booking contention, payment reconciliation, audit,
availability, or clinical escalation fails.

## Evidence record format

```text
Gate: G0 | G1 | G2 | G3
Candidate commit/tag/digests:
Decision/evidence revision:
Reviewer name, role, qualification/authority:
Decision: APPROVE | REJECT
Conditions and expiry:
Open findings and owners/dates:
Signature/reference and UTC date:
```

Do not replace missing names with department labels and do not backdate approval.
