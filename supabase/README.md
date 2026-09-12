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
