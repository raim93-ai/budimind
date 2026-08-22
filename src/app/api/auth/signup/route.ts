import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser, generateToken, findUserByEmail, ROLE_HOME } from '@/lib/auth';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  inviteCode: z.string().optional(), // corporate worker invite code
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, inviteCode } = signupSchema.parse(body);
    const db = getDb();

    if (await findUserByEmail(email)) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    let companyId: number | null = null;
    let role: 'client' | 'company_admin' = 'client';

    // Corporate invite code: binds the account to a company
    if (inviteCode) {
      const invite = db.prepare(
        'SELECT * FROM company_invites WHERE code = ? AND is_active = 1'
      ).get(inviteCode) as { id: number; company_id: number; role: 'client' | 'company_admin' } | undefined;

      if (!invite) {
        return NextResponse.json(
          { error: 'Invalid or expired invite code' },
          { status: 400 }
        );
      }
      companyId = invite.company_id;
      role = invite.role;
      // Deactivate single-use invite
      db.prepare('UPDATE company_invites SET is_active = 0 WHERE id = ?').run(invite.id);
    }

    const userId = await createUser(email, password, fullName, role, companyId);

    // Create the linked patients record for clients so assessments attribute correctly
    let patientId: number | null = null;
    if (role === 'client') {
      const existing = db.prepare('SELECT id FROM patients WHERE email = ?').get(email) as { id: number } | undefined;
      if (existing) {
        patientId = existing.id;
        db.prepare('UPDATE patients SET user_id = ?, full_name = ? WHERE id = ?').run(userId, fullName, existing.id);
      } else {
        const r = db.prepare(
          'INSERT INTO patients (full_name, email, company_id, user_id) VALUES (?, ?, ?, ?)'
        ).run(fullName, email, companyId, userId);
        patientId = r.lastInsertRowid as number;
      }
    }

    const token = await generateToken({
      id: userId, email, fullName, role, companyId, patientId,
    });

    const response = NextResponse.json({
      user: { id: userId, email, fullName, role, companyId },
      redirectTo: ROLE_HOME[role],
    }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
