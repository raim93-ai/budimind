import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth-edge';
import { assessments } from '@/db/assessments';
import { z } from 'zod';

// Assignment engine: consultants and company admins assign assessments
// to clients/workers. Workers see them as "Assigned to you" in /portal/me.

const assignSchema = z.object({
  patientId: z.number().int().positive(),   // patients.id of the assignee
  assessmentType: z.string(),
  dueAt: z.string().datetime().optional().nullable(),
});

async function requireStaff(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader.match(/token=([^;]+)/)?.[1];
  const payload = token ? await verifyToken(token) : null;
  if (!payload || (payload.role !== 'consultant' && payload.role !== 'company_admin')) return null;
  return payload as { id: number; role: string; companyId?: number | null };
}

export async function POST(request: Request) {
  const staff = await requireStaff(request);
  if (!staff) {
    return NextResponse.json({ error: 'Consultant or company admin access required' }, { status: 401 });
  }

  try {
    const { patientId, assessmentType, dueAt } = assignSchema.parse(await request.json());
    const db = getDb();

    if (!(assessments as any)[assessmentType]) {
      return NextResponse.json({ error: `Unknown assessment type: ${assessmentType}` }, { status: 400 });
    }

    const patient = db.prepare('SELECT id, user_id, company_id FROM patients WHERE id = ?')
      .get(patientId) as { id: number; user_id: number | null; company_id: number | null } | undefined;
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Company admins may only assign within their own company
    if (staff.role === 'company_admin') {
      if (patient.company_id !== staff.companyId) {
        return NextResponse.json({ error: 'Patient not in your company' }, { status: 403 });
      }
    }

    if (!patient.user_id) {
      return NextResponse.json(
        { error: 'This person has no Budimind account yet. They must sign up (with an invite code for companies) before assessments can be assigned.' },
        { status: 400 }
      );
    }

    const result = db.prepare(`
      INSERT INTO assignments (client_user_id, patient_id, company_id, assessment_type, assigned_by, due_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(patient.user_id, patient.id, patient.company_id, assessmentType, staff.id, dueAt ?? null);

    return NextResponse.json({ success: true, assignmentId: result.lastInsertRowid }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Assignment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const staff = await requireStaff(request);
  if (!staff) {
    return NextResponse.json({ error: 'Consultant or company admin access required' }, { status: 401 });
  }
  const db = getDb();

  const rows = staff.role === 'company_admin'
    ? db.prepare(`
        SELECT a.*, p.full_name as patient_name, u.email as client_email
        FROM assignments a
        JOIN patients p ON p.id = a.patient_id
        JOIN users u ON u.id = a.client_user_id
        WHERE a.company_id = ?
        ORDER BY a.created_at DESC LIMIT 100
      `).all(staff.companyId)
    : db.prepare(`
        SELECT a.*, p.full_name as patient_name, u.email as client_email
        FROM assignments a
        JOIN patients p ON p.id = a.patient_id
        JOIN users u ON u.id = a.client_user_id
        ORDER BY a.created_at DESC LIMIT 100
      `).all();

  return NextResponse.json({ assignments: rows });
}
