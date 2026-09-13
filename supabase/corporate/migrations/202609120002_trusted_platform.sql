-- S02-T01: private, append-only platform primitives for the corporate plane.
create schema if not exists private;
create extension if not exists pgcrypto;

create table if not exists private.app_actor (
  id uuid primary key default gen_random_uuid(),
  auth_subject text not null unique,
  role text not null check (role in ('corporate_admin','corporate_operator','privacy_reviewer','platform_operations')),
  status text not null default 'active' check (status in ('active','suspended','disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists private.server_session (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references private.app_actor(id),
  token_hash bytea not null unique,
  expires_at timestamptz not null,
  rotated_from uuid references private.server_session(id),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  check (expires_at > created_at)
);
create index if not exists server_session_expiry_idx on private.server_session (expires_at);

create table if not exists private.idempotency_key (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references private.app_actor(id),
  key_hash bytea not null,
  action text not null,
  request_hash bytea not null,
  response_code integer,
  response_ref text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (actor_id, key_hash, action)
);

create table if not exists private.audit_event (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  actor_id uuid references private.app_actor(id),
  action text not null,
  resource_type text not null,
  resource_id text,
  purpose text not null,
  correlation_id uuid,
  outcome text not null check (outcome in ('success','denied','failure')),
  metadata jsonb not null default '{}'::jsonb
);
-- Keep actor_id as an immutable audit reference; actor deletion must not mutate audit rows.
alter table private.audit_event drop constraint if exists audit_event_actor_id_fkey;

create or replace function private.prevent_audit_mutation() returns trigger
language plpgsql security definer set search_path = pg_catalog, private as $$
begin
  raise exception 'audit_event is append-only';
end;
$$;
drop trigger if exists audit_event_append_only on private.audit_event;
create trigger audit_event_append_only
before update or delete on private.audit_event
for each row execute function private.prevent_audit_mutation();

create table if not exists private.outbox_job (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  aggregate_type text not null,
  aggregate_id text,
  payload jsonb not null default '{}'::jsonb,
  available_at timestamptz not null default now(),
  attempts integer not null default 0 check (attempts >= 0),
  claimed_at timestamptz,
  completed_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);
create index if not exists outbox_ready_idx on private.outbox_job (available_at) where completed_at is null;

revoke all on schema private from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on all tables in schema private from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on all tables in schema private from authenticated';
  end if;
end;
$$;
