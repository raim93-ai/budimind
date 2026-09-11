# Legacy Salvage Register

**Scope:** `tmp/budimind-latest-review` (linked GitHub repository review clone)  
**Rule:** Reference only. No file is eligible for runtime import until it has an owner, licence/source check, privacy
review, and replacement tests.

| Candidate                                    | Decision                  | Why / required proof                                                                                            | Replacement                                                                       |
| -------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Assessment wording and instrument references | Review selectively        | Confirm instrument owner, licence, translation, version, scoring, and permitted use; obtain governance approval | One approved versioned instrument in the governed domain module                   |
| Assessment registry structure                | Do not port directly      | Legacy validation accepted non-empty numeric arrays and treated missing values as zero                          | Typed schemas, explicit missingness, official scoring fixtures, immutable version |
| Public clinic content/resource intent        | Rewrite                   | Verify launch-market crisis contacts, service claims, CP scope, and escalation ownership                        | Reviewed content files in `clinic-web`                                            |
| Public clinician directory concept           | Reimplement               | Legacy directory is not a credential or publication control                                                     | Clinical API credential/publication state and accessible directory UI             |
| Booking flow concept                         | Reimplement               | Legacy flow lacks proven atomic holds, state transitions, and concurrency guarantees                            | Clinical API availability/hold/booking state machine                              |
| Chart/analytics concepts                     | Reimplement selectively   | Legacy analytics casts JSON to numbers in SQLite and has broken trend assumptions                               | Typed aggregate tables, privacy release source, accessible table alternative      |
| Presentational Button/Input/Alert ideas      | Compare, not copy blindly | Keep only if they meet the shared UI, keyboard, focus, contrast, and state standard                             | Minimal `packages/ui` primitives                                                  |
| SQLite schema and seed rows                  | Reject                    | Wrong production boundary; sequential IDs and prototype data risk disclosure                                    | Separate MySQL migrations and synthetic fixtures                                  |
| Email/ID patient lookup                      | Reject                    | Unauthenticated lookup can issue access to another person                                                       | Managed OIDC, server sessions, relationship-scoped API authorization              |
| Custom JWT implementation/fallback secret    | Reject                    | Secret fallback and client-trusted token flow are unsafe                                                        | Managed OIDC + secure server-side sessions                                        |
| Public result routes/sequential IDs          | Reject                    | Enumeration and unauthorised result access risk                                                                 | Authenticated, audience-bound, non-guessable resources                            |
| Employer clinical severity/risk index        | Reject                    | Violates employer/clinical boundary and may create employment harm                                              | Sponsor reads approved workplace aggregate releases only                          |
| Company-admin clinical assignment            | Reject                    | Employer must not control treating clinical relationship                                                        | Clinical operations and CP-governed care relationship                             |
| Broad assessment library/generic builder     | Defer                     | Unapproved instruments create licensing and clinical risk                                                       | One approved instrument first; expand only after governance                       |
| AI recommendations/risk detection            | Reject for MVP            | No automated employment, diagnostic, triage, or treatment decisions                                             | Human-reviewed transparent methods; AI requires a new ADR/gate                    |
| HIPAA/security/trust marketing claims        | Remove unless evidenced   | Product claims need jurisdiction-specific contracts and evidence                                                | Reviewed copy with named owner and evidence link                                  |
| Legacy production configuration/secrets      | Reject                    | Never reuse credentials, endpoints, or real data                                                                | New environment-specific secrets through approved managers                        |

## Register procedure

For each proposed salvage item, add source path/commit, licence or provenance, data classification, owner, review
status, replacement path, and tests. Mark `APPROVED`, `REWRITE`, `DEFER`, or `REJECTED`. A coding agent may implement
only `APPROVED` items whose prerequisite human gate is recorded.
