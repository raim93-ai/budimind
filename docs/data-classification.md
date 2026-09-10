# BudiMind Data Classification and Flow Contract

Status: DRAFT — G1 approval required  
Principle: collect the minimum data needed for an approved purpose; keep the corporate and clinical planes physically
separate.

| Class                  | Examples                                                                                  | Permitted location                                        | Handling baseline                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Public                 | Published CP profile, public service/help copy                                            | Public clinic web/CDN                                     | Reviewed copy, integrity-controlled publication, abuse limits                         |
| Operational            | Slot metadata, campaign state, job status, audit actor/resource IDs                       | Appropriate plane and operational stores                  | Least privilege, bounded retention, no sensitive payloads in logs                     |
| Confidential corporate | Pseudonymous responses, governed department/job bands, raw survey metadata                | Corporate database and protected analyst workspace        | Purpose-bound access, encryption, audited reads, no sponsor raw access                |
| Released corporate     | Privacy-checked aggregates, definitions, limitations, approved report                     | Immutable corporate release tables/private report storage | Versioned policy/scoring, suppression, approved export only                           |
| Restricted clinical    | Identity, consent, intake, assessment, care relationship, clinical notes, booking history | Clinical database/private documents only                  | Clinical authorization, consent-aware access, sensitive-read audit, no employer route |
| Secrets                | OIDC secrets, DB credentials, payment/webhook keys, encryption material                   | Secret manager/runtime only                               | Never source control, browser, logs, fixtures, screenshots, or prompts                |

## Prohibited flows

- Corporate services connecting to the clinical database or clinical object bucket.
- Sponsor APIs reading raw response tables, analyst queries, or clinical services.
- Clinical APIs returning employer participation, campaign answers, release status, or benefit-user identity.
- Identifiers, tokens, answers, intake, notes, or booking details in URLs, analytics, tracing attributes, support tools,
  or audit payloads.

## Required flow records

Stage 01 must add diagrams under `docs/threat-models/` for invitation redemption, booking, analyst release, and optional
referral. Each diagram names source, destination, data class, purpose, authorization, encryption, audit, retention
placeholder, and failure behavior.
