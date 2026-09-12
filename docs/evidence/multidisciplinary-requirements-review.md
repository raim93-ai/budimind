# Multidisciplinary Requirements Review

Review date: 2026-09-12  
Candidate commit: `d32e5e2`  
Decision: **APPROVED FOR SYNTHETIC IMPLEMENTATION (G0-S AND G1-S)**

## Authority and limitation

This is an AI-assisted internal product, engineering, security, privacy and clinical-safety design review performed at
the product owner's request. It is sufficient to govern synthetic development. It is not legal advice, a practising
certificate, a DPO appointment, an instrument licence, an independent penetration test or a legally effective clinical
governance signature.

No document may represent this review as approval to process real-person data, provide clinical care, take payment or
launch commercially. Those actions remain subject to G2 and named accountable humans.

## Review decision by discipline

| Review lens                 | Decision for synthetic implementation         | Conditions retained for G2                                                                                                                   |
| --------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Product and operations      | Approved                                      | Confirm operator details, owned domain, service capacity, support hours and named operational owners                                         |
| Clinical safety             | Approved                                      | Credential every practitioner; approve service protocols, consent, safeguarding, emergency and record-retention procedures                   |
| Privacy and data protection | Approved                                      | Appoint/confirm DPO responsibility; complete DPIA, Malaysia–Singapore transfer assessment, notices, processor register and rights procedures |
| Malaysian legal             | Approved as an implementation assumption only | Obtain written advice on facility, online-service, consumer, employment, tax, advertising and recordkeeping obligations                      |
| Security engineering        | Approved                                      | Complete ASVS/API authorization evidence, independent review, incident exercise, backup/restore and production access review                 |
| I/O psychology              | Approved                                      | Obtain instrument licences; approve English/Malay versions, scoring, interpretation, cohort suppression and longitudinal use                 |
| Accessibility and design    | Approved                                      | Complete independent WCAG 2.2 AA review with keyboard, zoom, contrast and assistive-technology evidence                                      |

## Requirements accepted

- Separate corporate and clinical Vercel/Supabase planes, credentials, schemas, Auth tenants, Storage and audit.
- Singapore hosting with explicit cross-border assessment before real-person use.
- Adults-only, non-emergency initial clinical scope with credential-gated publication and booking.
- Deny-by-default authorization, PostgreSQL RLS, purpose/relationship checks and generic denial responses.
- Minimum necessary data, restricted clinical handling, sponsor exclusion and aggregate-only corporate releases.
- Server-side sessions, verified email, privileged MFA/step-up, CSRF protection, secure cookies and no custom passwords.
- Versioned consent, instrument, scoring, policy and translation content.
- Bounded booking, idempotent payment/webhook handling, calendar reconciliation and generic opt-in notifications.
- WCAG 2.2 AA and the restrained editorial UI contract.
- Synthetic-only Vercel/Supabase Free previews; paid plans, contracts and recovery controls before G2.

## Corrections made by this review

1. Development gates are split from release authority: G0-S/G1-S permit synthetic coding; G2 still requires named
   accountable human approval.
2. Human approval is no longer required merely to implement deterministic fake identity, policy, directory and booking
   flows using synthetic fixtures.
3. Real identity configuration, real contact details, clinical records, payments and external messaging remain disabled
   until the relevant G2 controls and contracts exist.
4. No retention period, legal interpretation, clinical protocol or vendor marketing statement is treated as statutory
   certainty merely because it appears in a design baseline.

## Residual findings

There is no blocking requirements defect for Stages 1–10 using synthetic data. The remaining findings are operational
and release conditions: named accountable owners, professional credentials, instrument permission, executed vendor
agreements, production accounts, independent assurance and recovery evidence.

## Sources checked

- Malaysia Personal Data Protection Commissioner: Act 709, the 2024 amendment, DPO, breach-notification and
  cross-border-transfer materials.
- Malaysia Ministry of Health: Guideline on Online Healthcare Services 2025 and Allied Health profession information.
- Malaysian Allied Health Professions Council/MHPS credential-verification mechanism.
- The official sources already linked in `launch-configuration.md` for payments, platform, accessibility and security.
