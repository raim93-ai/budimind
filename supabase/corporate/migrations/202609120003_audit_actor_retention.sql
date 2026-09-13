-- Preserve audit history while allowing actor deprovisioning without mutating append-only rows.
alter table private.audit_event drop constraint if exists audit_event_actor_id_fkey;
