import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth-edge';
import { randomBytes } from 'crypto';

// Invite code management for company admins.
export async function GET(request: Request) {
  const payload = await requireAdmin(request);
  if (!payload) return unauthorized();
  const db = getDb();

  const invites = db.prepare(`
    SELECT code, role, is_active, created_at, used_by
    FROM company_invites WHERE company_id = ?
    ORDER BY created_at DESC LIMIT 50
  `).all(payload.companyId);

  return NextResponse.json({ invites });
}

export async function POST(request: Request) {
  const payload = await requireAdmin(request);
  if (!payload) return unauthorized();
  const db = getDb();

  const body = await request.json().catch(() => ({}));
  const role = body.role === 'company_admin' ? 'company_admin' : 'client';

  const code = `${codeWord()}-${randomBytes(3).toString('hex').toUpperCase()}`;
  db.prepare(
    'INSERT INTO company_invites (code, company_id, role, created_by) VALUES (?, ?, ?, ?)'
  ).run(code, payload.companyId, role, payload.id);

  return NextResponse.json({ code, role }, { status: 201 });
}

async function requireAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader.match(/token=([^;]+)/)?.[1];
  const payload = token ? await verifyToken(token) : null;
  if (!payload || payload.role !== 'company_admin' || !payload.companyId) return null;
  return payload as { id: number; companyId: number };
}

function unauthorized() {
  return NextResponse.json({ error: 'Company admin access required' }, { status: 401 });
}

function codeWord() {
  const words = ['WELL', 'CARE', 'MIND', 'THRIVE', 'BALANCE', 'CALM'];
  return words[Math.floor(Math.random() * words.length)];
}
