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
  });
});
