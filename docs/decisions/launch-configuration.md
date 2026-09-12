# Launch Configuration — G0 Decision Record

Status: INTERNALLY APPROVED FOR SYNTHETIC IMPLEMENTATION (G0-S/G1-S) Decision authority: Product-owner instruction dated
2026-09-11, multidisciplinary internal review dated 2026-09-12 and the supplied BudiMind presale deck Last reviewed:
2026-09-12

This is the approved implementation baseline for synthetic-data work. It is not legal advice, a regulatory approval, a
vendor contract, or permission to process real-person data. G2 remains closed until accountable human reviewers named in
`gate-readiness.md` sign the release candidate and all production conditions are evidenced.

## 1. Operator, jurisdiction, locale, and domain

| Decision            | Implementation value                                                                                                                                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Operator            | Mafar Healthcare Sdn Bhd, trading as BudiMind. Confirm registered company details before publication.                                                                                                                                                                                                       |
| Launch jurisdiction | Malaysia. Initial clinical operations are limited to clients physically located in Malaysia. Obtain written advice on Act 586/CKAPS applicability before public clinical operations.                                                                                                                        |
| Clinic location     | No. 15, Jalan 3/4C, Desa Melawati, Kuala Lumpur. The presale deck targets Q4 2026; the website must not state an exact opening date until operations approve it.                                                                                                                                            |
| Timezone            | IANA `Asia/Kuala_Lumpur` (UTC+08:00). Store instants in UTC and retain the source timezone on schedules and bookings.                                                                                                                                                                                       |
| Languages           | Public marketing and administration: English. Assessment content: English and Bahasa Melayu, using separately versioned, approved wording. Privacy notice, informed consent, crisis, cancellation, and complaint content must also be available in both languages because comprehension is safety-critical. |
| Currency            | MYR only. Store monetary values as integer sen plus ISO currency code.                                                                                                                                                                                                                                      |
| Domain              | Customer owns and controls the production domain. Reserve `www`, `app`, `clinic`, `api`, `auth`, and `status` hostnames under the verified domain. Do not hard-code or publish a guessed domain. Registrar, DNS, recovery contacts, and hardware-key access require two named owners.                       |

## 2. Data residency and cloud model

### Vercel and Supabase

- Use two independent Supabase projects in the specific Singapore region (`ap-southeast-1`): one Corporate/Analysis
  project and one Clinical/Public project. They must not share database credentials, Auth tenants, Storage buckets,
  secrets, migrations, backups, or service identities. Cross-project application queries and joins are prohibited.
- PostgreSQL is the system of record. Apply versioned migrations, foreign keys, constraints, UTC timestamps and RLS to
  every exposed table. Revoke default grants not required by `anon` or `authenticated`; a secret key is server-only and
  must never reach browser code because it bypasses RLS.
- Deploy the two Next.js applications and two FastAPI services as four Vercel projects with Functions pinned to
  Singapore (`sin1`). Each web application proxies same-origin API paths to its matching service. Keep clinical and
  corporate environment variables and deployment access separate. CDN-hosted public assets contain only reviewed public
  content.
- Use Supabase's transaction pooler for Vercel serverless database traffic and do not maintain per-instance SQLAlchemy
  pools. Require TLS for every hosted connection.
- Singapore hosting is a cross-border transfer from Malaysia. Before any real-person data, execute the Supabase and
  Vercel terms/DPA, record subprocessors and retention, complete a Malaysian PDPA transfer-impact assessment, update
  notices/consents, and obtain Privacy/DPO, Legal, Security and Clinical Governance approval.
- Encrypt restricted fields at application level with independently controlled keys. Do not put identity, clinical
  content, assessment answers, or secrets in logs, analytics, URLs, calendar titles, email subjects, or WhatsApp.

### Free-tier boundary and production upgrade

- Vercel Hobby and Supabase Free are limited to synthetic development and non-production previews. Do not enable real
  identities, public booking, assessment submission, payments, calendar/WhatsApp integration, or clinical records.
- Vercel Hobby is restricted to non-commercial personal use; BudiMind must use a commercial Vercel plan before any
  business launch.
- Supabase Free has no automatic backups or PITR and may pause after low activity. Before G2, move both projects to a
  paid organisation and verify daily backups, restore, deletion protection, audit evidence, uptime/support, SSL
  enforcement, network restrictions, MFA, Security Advisor findings, and an independently controlled encrypted export.
- AWS is removed from the current trajectory. Add another cloud only through a new approved ADR tied to a demonstrated
  requirement that Vercel/Supabase cannot meet.

## 3. Clinical service contract

### Launch scope

- Adults aged 18 and above.
- Individual psychological therapy or counselling delivered by an appropriately registered professional.
- 50-minute appointment plus a 10-minute operational buffer.
- In-person at Desa Melawati or secure video when the client is physically in Malaysia and telehealth is clinically
  suitable.
- Exclude minors, couples/family work, group therapy, formal autism assessment, emergency care, prescribing, and the
  Soul Reset programme until each receives a separate clinical protocol, competence/capacity review, consent, pricing,
  and owner approval.
- The deck's Soul Reset description is internally inconsistent (a “40-week system”, 20 live sessions, and one-year
  support). Do not sell or implement it until an approved service specification resolves this.

### Pricing

| Offer                | Price and rule                                            |
| -------------------- | --------------------------------------------------------- |
| Single session       | RM250                                                     |
| Five-session package | RM1,250; founding-member price RM1,000                    |
| Ten-session package  | RM2,500; founding-member price RM2,000                    |
| Corporate Starter    | RM3,000/month; 12-month prepaid founding price RM30,600   |
| Corporate Growth     | RM8,000/month; 12-month prepaid founding price RM81,600   |
| Corporate Enterprise | RM15,000/month; 12-month prepaid founding price RM153,000 |

Show the exact service, duration, tax treatment, package expiry, and refund terms before payment. Founding and presale
offers require explicit eligibility, capacity, start date, expiry, and funds-handling terms. Do not describe waqf or
designated-account safeguards more strongly than the executed legal instrument permits.

### Payment, cancellation, refund, and attendance

- Use Stripe Malaysia hosted Checkout. Accept cards and FPX for one-time MYR payments. FPX is not used for recurring
  debits; corporate annual prepayment is a one-time payment or invoice/bank transfer after reconciliation approval.
- Never store card numbers, CVV, or online-banking credentials. Signed webhooks, event uniqueness, idempotency, and
  daily reconciliation are mandatory.
- A cancellation or reschedule at least 24 hours before the appointment returns the session credit or a full refund for
  a single session.
- A late cancellation under 24 hours or non-attendance uses one session credit, except verified emergency, technical
  failure attributable to BudiMind, or documented clinical discretion.
- A provider cancellation gives the client a choice of priority reschedule, account credit, or full refund.
- Five-session credits expire six months after first use; ten-session credits expire twelve months after first use. An
  unused package may be cancelled within 14 days. After first use, refund the unused balance less completed sessions
  repriced at the standard single-session rate. Approved refunds return to the original method within 7–10 business
  days, subject to processor timing.
- A presale purchaser may request a full refund if the centre is not available within 90 days after the published,
  contractually committed opening date, or BudiMind cannot provide the purchased service.
- Corporate cancellation, substitution, service credits, confidentiality, utilisation reporting, and refunds are
  controlled by a signed order form/SOW, not consumer defaults.

## 4. Credentialing and clinical governance

### Clinical psychologist

Before publication or booking, Clinical Operations must record and independently verify:

- government-issued identity;
- recognised qualification and transcript/equivalence where required;
- Malaysian Allied Health Professions Council registration and current practising certificate through MHPS;
- registered name/number, certificate issue/expiry, scope, languages, modalities, client groups, and locations;
- sanctions/conditions declaration, two professional references, supervision/consultation arrangement, and annual
  competence declaration;
- professional indemnity insurance covering the declared modalities and locations, plus the company's public and
  vicarious liability cover.

For a counsellor, replace the professional registration evidence with current Lembaga Kaunselor Malaysia registration
and practising certificate. A two-person Clinical Operations plus Clinical Governance approval publishes a profile.
Expiry, suspension, scope mismatch, or failed re-verification automatically blocks new bookings and unpublishes the
profile without exposing the reason publicly.

### Scope and records

- Professionals act only within verified training, registration, indemnity, modality, client group, and location.
- BudiMind does not represent psychologists or counsellors as psychiatrists, emergency responders, or prescribers.
- Notes must be accurate, contemporaneous, attributable, versioned, access-audited, and never silently overwritten.
- Proposed adult clinical-record retention is seven years after last contact. A legal hold suspends deletion. If minors
  are introduced later, retain until age 25 or seven years after last contact, whichever is later. Malaysian legal and
  clinical reviewers must approve these periods before G1 closes.
- Credential evidence is restricted and encrypted; the public profile exposes only verified professional facts needed
  for informed choice.

### Escalation and emergency safety

- Online care is not an emergency service and WhatsApp is not a consultation channel.
- At every video session verify identity, consent, current physical location, emergency contact, privacy, connection
  suitability, and a reconnection/emergency plan.
- Imminent danger: call Malaysian emergency services at `999` or direct the person to the nearest emergency department.
  National mental-health support: Talian HEAL `15555`. Maintain a clinically approved local referral directory.
- A named on-call Clinical Governance lead owns risk consultation, safeguarding, complaints, adverse events, external
  referral, emergency escalation, and documentation. Support staff do not make clinical decisions.

## 5. Corporate measurement and privacy release

### Instrument governance

- Maintain an instrument registry containing owner, exact version, purpose, licence evidence, approved languages,
  approved wording, scoring checksum, missingness rules, interpretation limits, norms/validation population, reviewer,
  and effective/retired dates.
- No instrument appears in production without written commercial-use and translation rights. WHO-5 is a candidate only;
  its published licence is non-commercial share-alike, so it remains disabled until written commercial permission and
  the approved English/Bahasa Melayu texts are retained.
- Internally authored workplace-factor items are labelled non-diagnostic and unvalidated until a qualified I/O
  psychology validation programme establishes reliability, validity, fairness, interpretation, and change sensitivity.
- Corporate results describe organisational conditions and associated factors. They do not diagnose, rank, or trigger
  employment action against individuals.

### Controlled attribute taxonomy

Default attributes are governed codes/bands for department, job family, job level band, work location, work arrangement,
and tenure band. Optional demographic attributes require a documented purpose and privacy approval. Do not collect exact
job titles, manager names, employee numbers, free-text work histories, diagnoses, or clinical scores in a corporate
response.

### Longitudinal linkage and release rules

- Use a random pseudonymous linkage token unavailable to sponsor users. Participation identity and survey answers live
  in separate stores. Rotate tokens per programme unless the approved longitudinal purpose requires otherwise.
- Explain longitudinal linkage before collection and permit participation without employer-visible individual status.
- Minimum releasable cohort is `k = 10`; minimum matched cohort for longitudinal deltas is `k = 20`.
- Apply primary suppression to every small cell and complementary suppression where totals or parent/child values could
  reveal it. Use fixed bands and allow-listed segments; users cannot create arbitrary cross-filters.
- Record released-query history and block repeated slicing, overlap, or differencing that can isolate a person. Round
  displayed percentages and counts consistently and show cohort-size bands, response rate, missingness, method, period,
  and limitations.
- Employers receive immutable aggregate HTML/PDF and formula-safe CSV exports only. Row-level, pseudonymous,
  assessment-answer, free-text, and clinician exports are prohibited. Exceptional analyst export requires purpose,
  expiry, privacy approval, second-person approval, encryption, watermarking, access logging, and confirmed deletion.
- Crisis answers, if a clinically approved instrument later collects them, follow an independent clinical safety flow
  disclosed to the participant and never appear in employer reporting.

## 6. Vendor baseline and contract conditions

| Function          | Decision                                                               | Required controls before real-person use                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity          | Supabase Auth, separate corporate and clinical projects                | DPA/TIA; server-side sessions; PKCE where applicable; staff MFA/step-up; RLS; identity metadata only; no clinical content                                       |
| Payment           | Stripe Malaysia hosted Checkout                                        | Malaysian agreement and DPA; cards/FPX; signed/idempotent webhooks; least privilege; reconciliation; no card data                                               |
| Email             | Supabase Auth email for identity only; transactional provider deferred | Custom SMTP before real-person use; SPF, DKIM, DMARC; generic content and secure portal links; no clinical content in subject/body                              |
| WhatsApp          | Meta WhatsApp Cloud API notification templates only                    | Explicit opt-in; approved generic templates; no consultation, free-form clinical chat, diagnosis, assessment, or sensitive appointment detail; email fallback   |
| Calendar/video    | Google Calendar and Google Meet                                        | Per-clinician OAuth; separate dev/prod projects; verified domain; minimal scopes; generic titles/opaque IDs; app database is authoritative; no clinical content |
| SMS               | Disabled                                                               | Add only after a documented accessibility/coverage need, vendor review, consent, DPA/TIA, and safe content contract                                             |
| Analytics         | Plausible on unauthenticated marketing pages only                      | DPA/TIA; no authenticated, booking, assessment, clinical, analyst, or sponsor routes; no sensitive custom properties                                            |
| Error reporting   | Sentry EU/DE region                                                    | DPA/TIA; replay off; default PII off; scrub URL/query/header/body/user data; codes and correlation IDs only                                                     |
| Application host  | Vercel, Functions pinned to Singapore (`sin1`)                         | Commercial plan before business use; DPA/TIA; separate projects/access; TLS; logs/retention; incident and subprocessor review                                   |
| Data/Auth/Storage | Two Supabase projects, specific Singapore region                       | Paid plan before real data; DPA/TIA; RLS/grants tests; TLS; MFA; backups/PITR decision; restore/exit test; separate corporate/clinical secrets                  |

Vendor marketing claims are not BudiMind compliance evidence. Record contract owner, signed agreement/DPA, hosting
region, subprocessors, transfer basis/TIA, retention/deletion, incident terms, access method, and exit test in the
vendor register before G2.

## 7. Privacy and regulatory control baseline

- Register as a Malaysian data controller if the health-sector class or other applicable class applies; obtain written
  confirmation before real-person collection.
- Treat identity, mental-health, assessment, and care data as sensitive. Record express consent where required while
  retaining the correct legal basis and purpose for each processing operation.
- Appoint and register a DPO when statutory thresholds apply, including regular and systematic monitoring. Given the
  planned corporate platform, appointing one before G2 is the conservative operational baseline.
- Maintain bilingual notice/consent evidence, data-subject request workflow, processor register, data inventory,
  retention/deletion jobs, legal holds, DPIA, transfer-impact assessments, access reviews, and incident records.
- Escalate a suspected breach immediately. The incident team assesses notification to Malaysia's Commissioner as soon as
  practicable and within the applicable 72-hour requirement; affected-person communication follows the approved breach
  plan.
- Online healthcare requires a secure platform, reproducible written consent, credential and identity verification,
  suitability/location checks, secure records, and a Malaysian physical presence. Do not use WhatsApp or Telegram as the
  clinical consultation platform.

## 8. Security and accessibility acceptance baseline

- OWASP ASVS 5.0 Level 2 and OWASP API Security Top 10 (2023) traceability.
- NIST Cybersecurity Framework 2.0 for governance and operational risk.
- WCAG 2.2 AA for all public and authenticated journeys.
- TLS 1.2 or later, encryption at rest and field encryption for restricted data, managed secrets, least privilege,
  server-side authorization, immutable audit, secure sessions, CSRF/CSP/CORS/rate limits, dependency/SBOM/scanning,
  backup restore, incident exercise, and independent penetration/privacy review before G2.
- No product copy may claim HIPAA, PDPA, clinical, security, or accessibility compliance merely from this baseline.

## 9. Gate record

G0-S and G1-S are approved for synthetic implementation by the product-owner instruction and the internal review dated
2026-09-12. Named Product, Legal/Privacy, Clinical Governance, Security/Engineering and I/O Psychology approval remains
mandatory at G2 before real-person processing or commercial operation.

## 10. Primary references reviewed

- Malaysia Personal Data Protection Department:
  [PDPA application](https://www.pdp.gov.my/ppdpv1/en/akta/application-and-non-application-of-the-act/),
  [2024 amendment](https://www.pdp.gov.my/ppdpv1/en/akta/personal-data-protection-amendment-act-2024/),
  [DPO FAQ](https://www.pdp.gov.my/ppdpv1/en/faq/),
  [breach-notification guideline](https://www.pdp.gov.my/ppdpv1/wp-content/uploads/2025/08/GP_DBN_ENG.pdf), and
  [cross-border guideline](https://www.pdp.gov.my/ppdpv1/wp-content/uploads/2025/08/JPDP-FSB-241001-Cross-Border-PCP-ENG-TC.pdf).
- Malaysia Ministry of Health:
  [Online Healthcare Services 2025](https://hq.moh.gov.my/perancangan/blog/utama/online-healthcare-services-ohs-2025/),
  [Act 774](https://hq.moh.gov.my/nutrition/wp-content/uploads/2023/12/Akta_AHP_Akta-774.pdf),
  [MHPS](https://mhps.moh.gov.my/mhps/index.php/main/about), and
  [Private Healthcare Facilities and Services Act 1998](https://www.moh.gov.my/en/publications-and-reports/policies-act-policies-guide-lines/akta-kesihatan/senarai-akta-kesihatan/private-healthcare-facilities-and-services-act-1998).
- Lembaga Kaunselor Malaysia: [official register/service](https://lembagakaunselor.kpwkm.gov.my/) and
  [Act 580 background](https://lembagakaunselor.kpwkm.gov.my/latar-belakang/).
- Emergency support:
  [MOH Talian HEAL 15555 and 999](https://jknselangor.moh.gov.my/htar/en/pengumuman-awam/661-talian-heal-15555).
- Supabase: [regions](https://supabase.com/docs/guides/platform/regions),
  [free-plan billing](https://supabase.com/docs/guides/platform/billing-on-supabase),
  [free-project pausing](https://supabase.com/docs/guides/platform/free-project-pausing),
  [database backups](https://supabase.com/docs/guides/platform/backups),
  [production checklist](https://supabase.com/docs/guides/deployment/going-into-prod),
  [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), and
  [API keys](https://supabase.com/docs/guides/getting-started/api-keys).
- Vercel: [Hobby plan](https://vercel.com/docs/plans/hobby),
  [Function regions](https://vercel.com/docs/functions/configuring-functions/region), and
  [FastAPI deployment](https://vercel.com/docs/frameworks/backend/fastapi).
- Booking vendors: [Amelia feature catalogue](https://wpamelia.com/features/),
  [Google Calendar behavior](https://wpamelia.com/documentation/google-calendar-google-meet/),
  [WhatsApp behavior](https://wpamelia.com/documentation/whatsapp/),
  [Google OAuth policy](https://developers.google.com/identity/protocols/oauth2/policies), and
  [Calendar FreeBusy](https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query).
- Identity/payment: [Stripe Malaysia agreement](https://stripe.com/legal/ssa/my),
  [Stripe FPX](https://docs.stripe.com/payments/fpx), and
  [Stripe webhook security](https://docs.stripe.com/webhooks?lang=node).
- Measurement: [WHO-5 publication/licence](https://www.who.int/publications/m/item/WHO-UCN-MSD-MHE-2024.01) and
  [Malay WHO-5 validation](https://pmc.ncbi.nlm.nih.gov/articles/PMC8998902/).
- Assurance: [OWASP ASVS 5.0](https://owasp.org/www-project-application-security-verification-standard/),
  [OWASP API Security Top 10](https://owasp.org/www-project-api-security/),
  [NIST CSF 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20), and
  [WCAG 2.2](https://www.w3.org/TR/wcag/).
