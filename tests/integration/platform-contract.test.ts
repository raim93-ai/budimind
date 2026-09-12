import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

describe('platform deployment contract', () => {
  it('keeps the two PostgreSQL and Vercel boundaries explicit', () => {
    const compose = readFileSync(resolve(root, 'compose.yaml'), 'utf8');
    const env = readFileSync(resolve(root, '.env.example'), 'utf8');

    expect(compose).toContain('postgres:15.8-bookworm');
    expect(compose).toContain('5432:5432');
    expect(compose).toContain('5433:5432');
    expect(compose).toContain('internal: true');
    expect(env).toContain('NEXT_PUBLIC_CORPORATE_SUPABASE_PUBLISHABLE_KEY=');
    expect(env).toContain('NEXT_PUBLIC_CLINICAL_SUPABASE_PUBLISHABLE_KEY=');
    expect(env).not.toContain('NEXT_PUBLIC_CORPORATE_SUPABASE_SECRET_KEY');
    expect(env).not.toContain('NEXT_PUBLIC_CLINICAL_SUPABASE_SECRET_KEY');

    for (const app of ['corporate-web', 'clinic-web', 'api-corporate', 'api-clinical']) {
      const vercel = readFileSync(resolve(root, 'apps', app, 'vercel.json'), 'utf8');
      expect(vercel).toContain('"sin1"');
    }

    for (const plane of ['corporate', 'clinical']) {
      const migration = readFileSync(
        resolve(root, 'supabase', plane, 'migrations', '202609120001_baseline.sql'),
        'utf8'
      );
      expect(migration).toContain('schema public');
      expect(migration).not.toContain('service_role');

      const trusted = readFileSync(
        resolve(root, 'supabase', plane, 'migrations', '202609120002_trusted_platform.sql'),
        'utf8'
      );
      for (const table of [
        'app_actor',
        'server_session',
        'idempotency_key',
        'audit_event',
        'outbox_job',
      ]) {
        expect(trusted).toContain(`private.${table}`);
      }
      expect(trusted).toContain('append-only');
    }
  });

  it('keeps G2 fixtures synthetic, isolated, and side-effect free', () => {
    const clinical = JSON.parse(
      readFileSync(resolve(root, 'fixtures', 'g2', 'clinical.json'), 'utf8')
    ) as Record<string, unknown>;
    const corporate = JSON.parse(
      readFileSync(resolve(root, 'fixtures', 'g2', 'corporate.json'), 'utf8')
    ) as Record<string, unknown>;

    for (const fixture of [clinical, corporate]) {
      const metadata = fixture.metadata as Record<string, unknown>;
      expect(metadata.synthetic).toBe(true);
      expect(metadata.allowedEnvironments).toEqual(['development', 'test']);
      expect(metadata.externalSideEffects).toBe(false);

      const serialized = JSON.stringify(fixture);
      const emails = serialized.match(/[\w.-]+@[\w.-]+/g) ?? [];
      expect(emails.length).toBeGreaterThan(0);
      expect(emails.every((email) => email.endsWith('.example.invalid'))).toBe(true);
    }

    const clinicalIds = new Set(JSON.stringify(clinical).match(/cln_[a-z0-9_]+/g) ?? []);
    const corporateIds = new Set(JSON.stringify(corporate).match(/corp_[a-z0-9_]+/g) ?? []);
    expect([...clinicalIds].some((id) => corporateIds.has(id))).toBe(false);
  });
});
