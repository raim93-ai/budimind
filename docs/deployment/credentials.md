# Credential setup (add later, without code changes)

Credentials are runtime configuration, not source files. Copy `.env.example` for local development and enter values only in an ignored `.env` file. For production, add the same variables in the matching Vercel project as encrypted Environment Variables:

- `budimind-corporate-web`: only `NEXT_PUBLIC_CORPORATE_SUPABASE_URL`, `NEXT_PUBLIC_CORPORATE_SUPABASE_PUBLISHABLE_KEY`, and the corporate API URL.
- `budimind-clinic-web`: only the clinical `NEXT_PUBLIC_*` URL/key and clinical API URL.
- `budimind-corporate-api`: `CORPORATE_DATABASE_URL`, `CORPORATE_SUPABASE_URL`, `CORPORATE_SUPABASE_PUBLISHABLE_KEY`, `CORPORATE_SUPABASE_SECRET_KEY`, and production CORS origins.
- `budimind-clinical-api`: the equivalent clinical variables.

Never put a secret key in a `NEXT_PUBLIC_*` variable. Vercel production values must use HTTPS endpoints and a non-local PostgreSQL host; the API settings reject unsafe production configuration at startup. Store the database URL and Supabase secret as encrypted server-only values, restrict access to project operators, rotate them after any exposure, and do not print them in logs or support tickets.

Supabase publishable keys are safe for browser initialization only when Row Level Security is enabled. Secret keys bypass RLS and must be used exclusively by the API boundary. Keep corporate and clinical projects, URLs, keys, databases, and service accounts separate.
