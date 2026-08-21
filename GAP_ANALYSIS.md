# Budimind Gap Analysis: Cached (Non-Functional Prototype) vs. Reference (Working)

## Executive Summary

The cached version at `~/AppData/Local/hermes/cache/budimind` is a **non-functional prototype**.
The reference version at `/tmp/budimind-test` is the **complete working implementation**.

The cached repo contains 28 source files identical in structure to the reference, but **8 critical files are entirely missing**, and **13 shared files contain substantive code differences** (auth library swap, missing auth middleware integration, broken assessment loading pattern). The root cause is that the cached `.gitignore` excludes the entire `db/` directory, and the `src/db/assessments/` module was never cached.

---

## 🔴 CRITICAL — App Cannot Boot or Function

### 1. Missing Assessment Engine Module (3 files, ~26KB)

The single most critical gap. **14 of 14 psychological assessment definitions are absent.**

| Reference File | Size | Contents |
|---|---|---|
| `src/db/assessments/assessments.ts` | 26KB, 656 lines | 14 assessment definitions with questions + scoring functions, plus registry `assessments` object |
| `src/db/assessments/types.ts` | 461B, 18 lines | `Assessment`, `AssessmentQuestion`, `ScoringResult` interfaces |
| `src/db/assessments/index.ts` | 122B, 1 line | Barrel re-export |

**Impact — breaks 5 files in the cached repo that import `@/db/assessments`:**
- `src/app/api/assessments/[type]/route.ts` — GET single assessment by type
- `src/app/api/assessments/route.ts` — POST save assessment response
- `src/app/assessment/page.tsx` — assessment selection page
- `src/app/assessment/[type]/page.tsx` — assessment form page
- `src/app/assessment/[type]/result/page.tsx` — result display page
- `src/app/(protected)/dashboard/patients/[id]/page.tsx` — patient detail with spider chart

**14 assessment definitions missing:**
`dass21` (DASS-21), `phq9` (PHQ-9), `gad7` (GAD-7), `who5` (WHO-5), `pcl5` (PCL-5), `epds` (EPDS), `k10` (K10), `asrs` (ASRS v1.1 ADHD), `isi` (ISI Insomnia), `bdi2` (BDI-II), `bai` (BAI), `ybocs` (Y-BOCS), `whodas2` (WHODAS 2.0), `coreom` (CORE-OM)

Each contains: title, description, instructions, full question set (5–34 items), and a `scoringFn` that returns `{ total, severity, interpretation, [subscale scores...] }`.

### 2. Missing Database Schema & Seed Data (entire `db/` directory)

| Reference File | Size | Contents |
|---|---|---|
| `db/schema.sql` | 5.3KB | PostgreSQL-compatible SQLite schema: `consultants`, `companies`, `patients`, `assessment_responses` tables + indexes + triggers |
| `db/seed.sql` | 8.4KB | Demo consultant login (bcrypt hash), 4 companies, 8 patients, 6+ seeded assessment responses |

**Root cause:** The cached `.gitignore` line 45 has `db/` (excludes the entire directory). The reference `.gitignore` removes this line and instead ignores only `budimind-new.db`.

**Impact:** `src/lib/db.ts` `initDb()` calls `readFileSync(join(process.cwd(), 'db', 'schema.sql'))` at startup — this **throws ENOENT** when the directory is absent. The database singleton `getDb()` opens `budimind.db` which is also gitignored. The app has **no data layer at all** in the cached version.

### 3. Missing Auth Infrastructure (2 of 3 auth modules)

| Reference File | Size | Contents |
|---|---|---|
| `src/lib/auth-edge.ts` | 950B, 27 lines | Edge Runtime compatible JWT using `jose` (`SignJWT`/`jwtVerify`) — used by `middleware.ts` |
| `src/lib/auth-middleware.ts` | 1.1KB, 47 lines | `authMiddleware()` function — checks httpOnly `token` cookie, verifies JWT, attaches `request.user` |
| `src/middleware.ts` | 2.4KB, 90 lines | Next.js root middleware — protects `/dashboard`, `/api/patients`, `/api/companies`, `/api/assessments`, `/api/dashboard`; redirects unauthed users to `/login` |

All three are **entirely absent** from the cached repo. The cached `auth.ts` is the only auth file, and it uses `jsonwebtoken` (not Edge-compatible).

### 4. Auth Library Mismatch (Sync → Async)

**`src/lib/auth.ts`** differs fundamentally:

| Aspect | Cached (Broken) | Reference (Working) |
|---|---|---|
| Library | `jsonwebtoken` | `jose` |
| `generateToken()` | Sync, returns `string` | Async, returns `Promise<string>` (uses `SignJWT`) |
| `verifyToken()` | Sync, returns `any` | Async, returns `Promise<any>` (uses `jwtVerify`) |
| Secret encoding | Raw string | `new TextEncoder().encode(JWT_SECRET)` |

**`src/app/api/auth/login/route.ts`** — cached calls `generateToken()` synchronously (line 27: `const token = generateToken(...)`). Reference calls `await generateToken(...)` (line 27). The cached version is incompatible with `jose`'s async API.

### 5. Assessment POST Route Uses Wrong Loading Pattern

**`src/app/api/assessments/route.ts`** (POST endpoint):

| | Cached | Reference |
|---|---|---|
| Assessment lookup | `await import('@/db/assessments/${assessmentType}')` — dynamic import expecting **individual files per assessment** that don't exist | `import { assessments } from '@/db/assessments'` + `(assessments as any)[assessmentType]` — correct barrel registry pattern |
| Auth | None | `checkAuth()` function using `jose` to verify JWT from cookie |
| Returns | `scores` only | `success`, `patientId`, `assessmentId`, `scores` |

The cached dynamic import pattern is fundamentally broken: it expects `src/db/assessments/dass21.ts`, `src/db/assessments/phq9.ts`, etc. as separate files, but the reference uses a single `assessments.ts` with a registry object. This would produce a runtime `404`/module-not-found error.

### 6. API Routes Have Zero Authentication

The cached versions of **all 5 protected API routes** have **no auth checks whatsoever**:

| Route | Cached | Reference |
|---|---|---|
| `GET /api/dashboard/stats` | No auth | `authMiddleware(request)` check |
| `GET/POST /api/patients` | No auth | `authMiddleware(request)` in both handlers |
| `GET /api/patients/[id]` | No auth | `authMiddleware(request)` check |
| `GET /api/companies` | No auth | `authMiddleware(request)` check |
| `POST /api/assessments` | No auth | `checkAuth(request)` function |

The `authMiddleware` function (from `src/lib/auth-middleware.ts`) is **imported but the module doesn't exist** in the cached version, causing import-time failures on every protected route.

---

## 🟠 HIGH — Functionality Broken Without Workaround

### 1. New Patient Page Is a Stub (Not Wired to API)

**`src/app/(protected)/dashboard/patients/new/page.tsx`** — completely different behavior:

| | Cached (146 lines) | Reference (190 lines) |
|---|---|---|
| Form validation | Basic `useForm()` — no schema | `zod` schema via `zodResolver` with full type validation |
| Form submission | `onSubmit` just calls `router.push('/assessment')` — **does NOT create a patient** | Sends `POST /api/patients` with validated payload, handles response, redirects to `/assessment?patientId=${result.id}` |
| Error handling | None | `useState` error display, try/catch, loading state |
| Data types | Plain strings for all fields | Proper type coercion (`valueAsNumber` for age/companyId, null for empty optionals) |
| `htmlValue` vs `htmlFor` | Uses `htmlValue` (non-standard) | Uses `htmlFor` (correct) |
| `use client` directive | Present | Present (but appears as second line — `'use client';` on line 2 after `import { useState }` on line 1, a formatting bug) |

The cached version is a non-functional placeholder. The "Register Patient" form collects data but **discards it** — it never calls the API and never stores the patient. The assessment flow then has no patient to attribute scores to.

### 2. `package.json` — Missing `jose` Dependency

| | Cached | Reference |
|---|---|---|
| `jose` | Absent | `^6.2.9` |
| `db:init` script | Absent | `ts-node --esm init-db.ts` |
| `init-db.ts` / `init-db.cjs` / `init-db-new.cjs` | Only `init-db.js` (identical) | All three + `next-env.d.ts` |

Without `jose`, `auth.ts` cannot function. Without `db:init`, there's no documented way to initialize the database.

### 3. Database Path Mismatch

**`src/lib/db.ts`** — cached uses `budimind.db`; reference uses `budimind-new.db`. The reference includes a debug comment: "Use the new database file to avoid locking issues."

---

## 🟡 MEDIUM — Present but Incorrect

### 1. `src/app/(protected)/dashboard/page.tsx` — No API-backed Stats

The cached dashboard page queries the DB directly with a **hardcoded subquery** of 12 assessment types (lines 17–31) using `UNION ALL`. This is **duplicated logic** that should be sourced from the `assessments` registry. If a new assessment is added, this hardcoded list must be updated in two places. The reference has the same code (file is identical between versions), so this is a pre-existing design issue, not a gap per se.

However, the **dedicated stats API** (`GET /api/dashboard/stats`) exists in both versions but the cached one lacks auth — so the dashboard page (which queries DB directly) and the API endpoint (which the page doesn't even use) are inconsistent.

### 2. `src/app/(protected)/layout.tsx` — Async `verifyToken` Not Awaited

Both versions have identical `ProtectedLayout` that calls `verifyToken(token)` synchronously (line 21: `const payload = verifyToken(token)`). In the cached version this works because `verifyToken` is sync (`jsonwebtoken`). In the reference, `verifyToken` is async (`jose`), so `const payload` would be a `Promise` — which is truthy, so `if (!payload)` never triggers. **This is a latent bug in the reference's protected layout.** However, `middleware.ts` (which IS present in the reference) runs first and handles route protection, masking this bug for page navigation. API routes use `authMiddleware` independently.

### 3. Patient Detail Page — Severity String Case Mismatch

In `src/app/(protected)/dashboard/patients/[id]/page.tsx`:

- Cached: `case 'probable PTSD':` (capital)
- Reference: `case 'probable ptsd':` (lowercase)

The PCA-5 scoring function in `assessments.ts` returns `severity: 'probable PTSD'` (capital). The cached version's case is **correct**; the reference's lowercase variant would fall through to the `default` case and return `''` (no badge class). This is a minor bug introduced in the reference.

### 4. `src/db/assessments/assessments.ts` — Missing `id` Property

The `Assessment` interface (`types.ts`) defines `title`, `description`, `instructions`, `questions`, `scoringFn` — but **no `id` field**. However, `src/app/assessment/page.tsx` (identical in both) uses `assessment.id` as the React key and `href` parameter:
```jsx
key={assessment.id}
href={`/assessment/${assessment.id}`}
```
Since `assessment.id` is `undefined`, all assessment cards get `key={undefined}` and navigate to `/assessment/undefined`. This is a **pre-existing bug in both versions** — not a gap — but worth noting as the root cause of why assessment selection would not work even with the module present.

### 5. Line Ending Differences (CRLF vs LF)

The cached repo files use Windows CRLF (`\r\n`) line endings throughout. The reference uses Unix LF (`\n`). Affected files (whitespace-only differences):
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/theme-provider.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/textarea.tsx`
- `src/app/(protected)/dashboard/patients/page.tsx`

These are cosmetic but could cause `git diff` noise and are worth normalizing.

### 6. Theme Provider Export Naming Difference

- Cached `theme-provider.tsx`: `export function ThemeProvider` (named export)
- Reference `theme-provider.tsx`: `export default function ThemeProvider` (default export)

Both are consumed via `import ThemeProvider from './theme-provider'` (default import in `layout.tsx`). The cached version uses a named export with no default export — this would cause a **runtime/import error** unless Next.js/TypeScript auto-interops. The reference fixes this with a default export.

---

## 🟢 LOW — Cosmetic / Minor

| Item | Cached | Reference |
|---|---|---|
| `.gitignore` trailing newline | Has trailing newline after `psychology-clinic-context/` | No trailing newline (truncated) |
| `tsconfig.json` | 7553 bytes | 670 bytes (identical content, different line endings) |
| `next.config.ts` | CRLF | LF |
| `init-db.js` | Identical | Identical (reference also has `init-db.ts`, `.cjs` variants) |

---

## Summary Table: Missing Files

| Severity | File | Lines | Description |
|---|---|---|---|
| 🔴 CRITICAL | `src/db/assessments/assessments.ts` | 656 | 14 psychological assessment definitions + registry |
| 🔴 CRITICAL | `src/db/assessments/types.ts` | 18 | TypeScript interfaces |
| 🔴 CRITICAL | `src/db/assessments/index.ts` | 1 | Barrel export |
| 🔴 CRITICAL | `db/schema.sql` | ~100 | Database schema (consultants, companies, patients, assessment_responses) |
| 🔴 CRITICAL | `db/seed.sql` | ~100 | Demo data with hashed passwords & seeded assessments |
| 🔴 CRITICAL | `src/lib/auth-edge.ts` | 27 | Edge Runtime JWT (jose) |
| 🔴 CRITICAL | `src/lib/auth-middleware.ts` | 47 | `authMiddleware()` for API route protection |
| 🔴 CRITICAL | `src/middleware.ts` | 90 | Next.js root middleware — route protection + redirect logic |
| 🟠 HIGH | `package.json` | — | Missing `jose` dep, missing `db:init` script |
| 🟠 HIGH | `src/lib/auth.ts` | 55→63 | `jsonwebtoken` (sync) → `jose` (async) swap |
| 🟠 HIGH | `src/lib/db.ts` | 40→41 | DB path `budimind.db` → `budimind-new.db` |
| 🟠 HIGH | `src/app/api/auth/login/route.ts` | 59→60 | Sync → async `generateToken()` |
| 🟠 HIGH | `src/app/api/assessments/route.ts` | 142→173 | Dynamic import → barrel import; no auth → `checkAuth()` |
| 🟠 HIGH | `src/app/api/dashboard/stats/route.ts` | 39→44 | No auth → `authMiddleware()` |
| 🟠 HIGH | `src/app/api/patients/route.ts` | 77→164 | No auth → `authMiddleware()` in both GET+POST |
| 🟠 HIGH | `src/app/api/patients/[id]/route.ts` | 63→68 | No auth → `authMiddleware()` |
| 🟠 HIGH | `src/app/api/companies/route.ts` | 25→30 | No auth → `authMiddleware()` |
| 🟠 HIGH | `src/app/(protected)/dashboard/patients/new/page.tsx` | 146→190 | Stub → full API integration with zod validation |
| 🟠 HIGH | `src/app/(protected)/dashboard/patients/[id]/page.tsx` | 286→290 | Adds authMiddleware import; case-sensitivity bug in severity |
| 🟡 MEDIUM | `src/app/theme-provider.tsx` | 15 | Named export → default export (import would fail) |
| 🟡 MEDIUM | Various UI/CSS/layout files | — | CRLF → LF line ending normalization |
