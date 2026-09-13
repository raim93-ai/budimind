-- S03-T01: clinical-only practitioner directory and governed publication records.
alter table private.app_actor drop constraint if exists app_actor_role_check;
alter table private.app_actor add constraint app_actor_role_check
  check (role in ('clinic_admin','clinical_operations','clinical_practitioner','receptionist','privacy_reviewer','platform_operations'));

create table if not exists private.practitioner_profile (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  display_name text not null,
  biography text not null default '',
  languages text[] not null default '{}',
  modalities text[] not null default '{}',
  locations text[] not null default '{}',
  publication_state text not null default 'unpublished'
    check (publication_state in ('unpublished','published','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists private.practitioner_credential (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references private.practitioner_profile(id) on delete cascade,
  authority text not null,
  evidence_ref text not null,
  scope text not null,
  status text not null default 'pending'
    check (status in ('pending','verified','expired','suspended')),
  expires_at timestamptz not null,
  indemnity_expires_at timestamptz not null,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists practitioner_credential_current_idx
  on private.practitioner_credential (practitioner_id, status, expires_at, indemnity_expires_at);

create table if not exists private.practitioner_service (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references private.practitioner_profile(id) on delete cascade,
  name text not null,
  duration_minutes integer not null check (duration_minutes between 30 and 180),
  fee_minor integer not null check (fee_minor >= 0),
  currency char(3) not null check (currency in ('MYR')),
  active boolean not null default true
);
create index if not exists practitioner_service_public_idx
  on private.practitioner_service (practitioner_id, active, name);

create table if not exists private.practitioner_publication_approval (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references private.practitioner_profile(id) on delete cascade,
  approver_actor_id uuid not null,
  decision text not null check (decision in ('approved','rejected')),
  created_at timestamptz not null default now(),
  unique (practitioner_id, approver_actor_id)
);

-- Public APIs read this reviewed projection, never evidence or operational tables.
create or replace view private.practitioner_public_projection as
select p.id, p.slug, p.display_name, p.biography, p.languages, p.modalities, p.locations,
       coalesce(jsonb_agg(jsonb_build_object(
         'name', s.name, 'durationMinutes', s.duration_minutes,
         'feeMinor', s.fee_minor, 'currency', s.currency
       ) order by s.name) filter (where s.active), '[]'::jsonb) as services
from private.practitioner_profile p
left join private.practitioner_service s on s.practitioner_id = p.id
where p.publication_state = 'published'
  and exists (
    select 1
    from private.practitioner_credential c
    where c.practitioner_id = p.id
      and c.status = 'verified'
      and c.expires_at > now()
      and c.indemnity_expires_at > now()
  )
group by p.id;

revoke all on private.practitioner_profile, private.practitioner_credential,
  private.practitioner_service, private.practitioner_publication_approval,
  private.practitioner_public_projection from public;
