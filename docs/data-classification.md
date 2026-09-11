# BudiMind Data Classification and Flow Contract

Status: BASELINE DEFINED — named G1 approval required Principle: collect the minimum data needed for an approved
purpose; keep the corporate and clinical planes physically separate.

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

## Retention and disposal baseline

| Record                     | Baseline                                                                             | Disposal/control                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Adult clinical record      | Seven years after last contact, pending Malaysian legal/clinical approval            | Verified deletion after holds; retain deletion evidence only                          |
| Booking/payment ledger     | Seven years after financial year or longer legal requirement                         | Minimise narrative; reconcile before deletion                                         |
| Credential evidence        | Active engagement plus seven years, unless law/claim requires longer                 | Restricted encrypted archive; remove public copy on suspension/expiry                 |
| Corporate raw responses    | Programme term plus 24 months                                                        | Delete identity linkage first; retain only approved aggregates where contract permits |
| Released corporate reports | Seven years from release                                                             | Immutable version plus method/approval evidence                                       |
| Invitation/referral tokens | Until expiry plus 90 days of minimal replay/audit evidence                           | Store hash, not usable token                                                          |
| Security/audit events      | Seven years for restricted events; 13 months for low-risk operational logs           | Allow-listed metadata only; immutable storage and access review                       |
| Support tickets            | Two years after closure                                                              | Remove unnecessary attachments/content                                                |
| Marketing analytics        | Maximum 13 months                                                                    | Aggregate/cookieless; never clinical or authenticated routes                          |
| Backups                    | Daily 35 days, monthly 12 months, annual seven years only where record duty requires | Encrypted, legal-hold aware; tested expiry and restore                                |

Retention starts only after legal/privacy/clinical approval of the class, trigger, exceptions, backup behavior and
evidence. A legal hold suspends disposal. Deletion jobs are idempotent, audited and tested against restored backups.
