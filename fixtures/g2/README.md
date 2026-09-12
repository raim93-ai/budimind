# G2 synthetic UAT data

These deterministic fixtures exercise the G2 journeys without representing real people or authorising a real-person
pilot. Load them only in `development` or `test`. Never copy them to production or replace the synthetic markers with
real details.

- `clinical.json` covers visitor, client, clinician and clinical-operations journeys.
- `corporate.json` covers employee, sponsor, analyst, privacy-reviewer and platform-operations journeys.

The planes intentionally share no actor, tenant, booking, campaign or credential identifier. External side effects are
disabled: no payment, email, WhatsApp, calendar or video provider may be called while these fixtures are active.
