# Booking Capability Contract

Status: APPROVED PRODUCT BASELINE FOR SYNTHETIC IMPLEMENTATION  
Reference model: Amelia feature categories; implementation remains a BudiMind-owned Next.js/FastAPI/MySQL system  
Last reviewed: 2026-09-11

“Like Amelia” means clinically relevant capability parity, not a WordPress dependency or a blind clone. The BudiMind
database is authoritative for availability, booking, consent, payment and audit. Calendar, WhatsApp, email, video and
payment providers are adapters and cannot silently change clinical records.

## Required launch capabilities

### Catalogue and people

- Service categories, services, modality, duration, price/tax, buffer, lead time, booking horizon and cancellation rule.
- Verified professionals with scoped services, languages, locations, capacity, breaks, leave, holidays and booking
  limits.
- Physical locations, rooms and resources with conflict prevention.
- Individual appointments and packages/credits. Group capacity and events remain disabled until clinically governed.
- Customer, clinician and clinical-operations views, each with least-privilege authorization and complete audit.

### Availability and booking

- `Asia/Kuala_Lumpur` schedules with UTC instants and retained source timezone.
- Recurring working hours, date exceptions, breaks, holidays, location/modality, room/resource capacity and buffers.
- Bounded public search, transparent price/duration, expiring slot hold, idempotent confirmation, and a database unique
  constraint that prevents double booking.
- Booking, confirmed, rescheduled, cancelled, completed, provider-cancelled and no-show states with authorized
  transitions; immutable transition history.
- Client reschedule/cancel under the approved policy, staff override with reason, waiting list, package balance,
  coupon/presale eligibility, tax/invoice/receipt and refund reconciliation.
- No arbitrary recurring clinical series. A clinician may approve a plan, but each appointment remains visible,
  changeable and auditable.

### Google Calendar and Meet

- Per-clinician OAuth authorization; separate development and production Google projects; verified redirect domains.
- Request the minimum approved scopes. Use FreeBusy to block conflicts and create/update/delete the BudiMind-managed
  event corresponding to a confirmed booking.
- Event title is generic, for example `Reserved appointment`; description contains no client name, service concern,
  assessment, diagnosis or clinical link. Use opaque provider metadata to correlate records.
- Calendar edits do not alter a BudiMind booking. Reconciliation reports divergence to operations. Revoked access marks
  sync degraded but does not cancel appointments.
- Create a Meet link only for an approved online booking. Deliver it through the secure client/clinician views and a
  minimal notification; never expose it to an employer.

### WhatsApp and email

- Meta WhatsApp Cloud API sends only approved, generic templates after explicit opt-in. Supported events are booking
  confirmation, reminder, reschedule, cancellation, payment receipt availability and generic follow-up availability.
- WhatsApp is not used for consultation, intake, assessment, emergency triage, free-text clinical support or clinical
  record exchange. Incoming messages receive a generic channel/safety notice and route administrative support only.
- Email uses the same minimum-content rule and secure portal links. Users can choose email-only; operational delivery
  has retries, deduplication, provider event storage without message content, dead-letter review and preference audit.

### Operations and reporting

- Searchable appointment operations, role-scoped customer/professional panels, manual booking, reasoned override,
  waiting-list promotion, invoice/refund/reconciliation, webhook log, integration health and audit review.
- Aggregate operational reporting may show capacity, lead time, cancellation/no-show rate and payment reconciliation.
  Corporate sponsors never receive named utilisation, provider, service, appointment or attendance data.
- Export is role- and purpose-controlled, formula-safe, time-limited and audited. Clinical-content export is not part of
  the booking feature.

## Integration contracts

Every production adapter implements connect, health, send/sync, idempotency, retry/backoff, timeout, revocation,
reconciliation, audit and redaction. A deterministic local fake supports synthetic tests and is impossible to enable in
production. Webhooks require signature/timestamp validation, event uniqueness and a replay test.

## Parity catalogue after the safe booking core

These Amelia categories are represented in the roadmap but are not enabled merely to claim feature count:

| Category                                    | Decision                                                                           |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| Group appointments, events, tickets, extras | Deferred pending service/clinical/capacity/payment rules                           |
| Recurring appointments                      | Deferred pending clinician-plan and cancellation semantics                         |
| Multiple locations/resources                | Data model supports it; launch publishes Desa Melawati only                        |
| Coupons/packages/gift cards                 | Packages and approved presale codes in scope; gift cards deferred                  |
| Taxes/invoices                              | In scope after Malaysian tax/accounting review                                     |
| Zoom/Teams/Outlook/Apple Calendar           | Adapter backlog; Google Calendar/Meet is the launch integration                    |
| WooCommerce/WordPress                       | Not used                                                                           |
| CRM, Meta Pixel and marketing automation    | Not permitted on clinical/booking surfaces                                         |
| Custom fields/forms                         | Only schema-versioned, clinically/privacy approved fields; no unrestricted builder |

## Acceptance scenarios

1. Two clients race for one slot: one confirmed booking exists; the loser receives a generic conflict and can retry.
2. A retried request/webhook produces one transition, charge and notification.
3. Wrong client, clinician, employer, tenant or plane receives a generic denial and no existence signal.
4. Calendar outage preserves the booking, raises a redacted operations alert and reconciles later.
5. WhatsApp opt-out stops future WhatsApp without affecting care or email preference.
6. Provider cancellation offers reschedule/credit/refund and emits no clinical detail.
7. Expired/suspended professional cannot receive new bookings and disappears from public discovery.
8. Logs, browser storage, URLs, analytics, calendar and notifications contain no restricted payload.
9. Keyboard, screen reader, reduced motion, 200% zoom and 390/768/1440 layouts pass WCAG 2.2 AA checks.

Implementation begins at Stage 4 only after Stages 0–3 and G1 have current evidence.
