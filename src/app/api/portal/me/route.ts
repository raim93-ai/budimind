import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth-edge';

// Client's own data — scoped strictly to the logged-in user's patient record.
export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader.match(/token=([^;]+)/)?.[1];
  const payload = token ? await verifyToken(token) : null;

  if (!payload || payload.role !== 'client') {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const db = getDb();
  const patientId = payload.patientId as number | undefined;

  // Clients may not have a patient record yet (e.g. corporate worker pre-registration)
  if (!patientId) {
    return NextResponse.json({ history: [], assignments: [], patient: null });
  }

  const patient = db.prepare(
    'SELECT id, full_name, email, age, gender, company_id FROM patients WHERE id = ?'
  ).get(patientId) as any;

  const history = db.prepare(`
    SELECT id, assessment_type, raw_scores, severity, answers, completed_at
    FROM assessment_responses WHERE patient_id = ?
    ORDER BY completed_at DESC
  `).all(patientId);

  const assignments = db.prepare(`
    SELECT a.id, a.assessment_type, a.status, a.due_at, a.created_at,
           u.full_name as assigned_by_name
    FROM assignments a
    JOIN users u ON u.id = a.assigned_by
    WHERE a.client_user_id = ? AND a.status = 'pending'
    ORDER BY a.created_at DESC
  `).all(payload.id);

  return NextResponse.json({ patient, history, assignments });
}
