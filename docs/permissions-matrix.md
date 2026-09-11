# BudiMind Permission Contract

Status: BASELINE DEFINED — named G1 approval required Rule: deny by default; API policies, database queries, and tests
must enforce this matrix.

| Role                   | Plane              | Allowed scope                                                                              | Explicitly denied                                                                                             |
| ---------------------- | ------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Public visitor         | Clinical/Public    | Published CP profiles, public service content, available public slots                      | Any private client, booking, credential evidence, or clinical record                                          |
| Client                 | Clinical/Public    | Own account, own bookings, own consent/intake, own privacy requests                        | Other clients, CP credentials, sponsor data, corporate responses                                              |
| Treating CP            | Clinical/Public    | Assigned care relationships, consented intake/assessment, own availability                 | Sponsor workspace, raw corporate responses, unassigned clients                                                |
| Clinical operations    | Clinical/Public    | Credential review, publication, scheduling operations, support metadata                    | Corporate responses, clinical notes outside operational need                                                  |
| Employee participant   | Corporate/Analysis | Own invitation, notice, survey progress/submission, private support entry                  | Sponsor identity, other responses, clinical status                                                            |
| Sponsor admin          | Corporate/Analysis | Own tenant configuration, campaigns, participation counts, released reports, interventions | Response-level data, analyst workspace, bookings, utilisation identities, clinical data                       |
| I/O analyst            | Corporate/Analysis | Assigned tenant/campaign, approved purpose, pseudonymous response analysis, release draft  | Clinical plane, treating-CP records, unrestricted export, sponsor release approval unless separately assigned |
| Privacy reviewer       | Corporate/Analysis | Release candidates, suppression/differencing checks, approval/rejection, audit             | Clinical plane, unapproved raw analysis outside purpose                                                       |
| Platform administrator | Operations         | Infrastructure and operational metadata required for support                               | Routine content, survey answers, clinical notes, therapy records                                              |
| Support administrator  | Operations         | Account and delivery metadata required to resolve a documented support case                | Clinical content, assessment answers, employer responses, credentials/secrets, unrestricted impersonation     |
| Incident responder     | Operations         | Time-bound, approved incident metadata and containment actions                             | Unrecorded content access, routine clinical/corporate browsing, permanent emergency privilege                 |

Every sensitive action must carry actor, tenant, plane, purpose/assignment or care relationship, resource, decision, and
audit event. A UI hide is never an authorization control.

## Required denial test matrix

For each protected endpoint and query, test wrong role, wrong tenant, missing/expired purpose, missing care
relationship, wrong plane, revoked consent, released/unreleased state, replayed token, and unauthorised export.
Responses must be generic and must not reveal whether a protected resource exists.

Privileged support or incident access requires a ticket/incident, purpose, expiry, step-up authentication, explicit
approval, append-only audit and post-event review. There is no standing “super-admin” content role.
