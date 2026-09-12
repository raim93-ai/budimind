# Supabase project layout

The two directories are independent migration roots. Link each one to its own Supabase project; never apply one plane's
migrations to the other project.

```text
supabase/corporate  -> budimind-corporate
supabase/clinical   -> budimind-clinical
```

When credentials are available, run these commands from the selected directory after installing the Supabase CLI:

```text
supabase login
supabase link --project-ref <project-ref>
supabase db push
```

The current migration intentionally creates no business tables. It revokes accidental API access to the public schema
until each table has an explicit grant, RLS policy and denial test. Keep all real-person data out of Free projects.

## Auth/session boundary

Each API uses its matching Supabase Auth project as the managed identity provider. Set `AUTH_PROVIDER=supabase`, the
plane-specific `*_SUPABASE_URL`, and the server-only `*_SUPABASE_SECRET_KEY` in the API environment. Browser builds may
use only the matching `NEXT_PUBLIC_*_SUPABASE_URL` and publishable key.

The API exchanges a verified Supabase bearer token at `POST /api/v1/auth/session` for an opaque, expiring
`HttpOnly; Secure; SameSite=Lax` `bm_session` cookie. `GET /api/v1/auth/session` is the protected session check;
`POST /api/v1/auth/session/rotate` rotates the cookie and `POST /api/v1/auth/logout` revokes it. State-changing calls
must send the `bm_csrf` cookie value in `X-CSRF-Token`. Local development defaults to a deterministic fake identity;
the configuration validator rejects that adapter in production.
