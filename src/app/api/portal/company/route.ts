import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth-edge';

// Anonymized corporate wellbeing dashboard.
// SECURITY: company admins can ONLY ever receive aggregates —
// no names, no emails, no individual scores leave this endpoint.

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader.match(/token=([^;]+)/)?.[1];
  const payload = token ? await verifyToken(token) : null;

  if (!payload || payload.role !== 'company_admin') {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const companyId = payload.companyId as number | undefined;
  if (!companyId) {
    return NextResponse.json({ error: 'No company linked to this account' }, { status: 400 });
  }

  const db = getDb();

  // Headcount (aggregate only)
  const headcount = (db.prepare(
    'SELECT COUNT(*) as n FROM patients WHERE company_id = ?'
  ).get(companyId) as any).n;

  // Participation: distinct patients with at least one response
  const participants = (db.prepare(`
    SELECT COUNT(DISTINCT ar.patient_id) as n
    FROM assessment_responses ar
    JOIN patients p ON p.id = ar.patient_id
    WHERE p.company_id = ?
  `).get(companyId) as any).n;

  // Aggregate severity distribution per assessment type (last 90 days)
  const severityMix = db.prepare(`
    SELECT ar.assessment_type, ar.severity, COUNT(*) as count
    FROM assessment_responses ar
    JOIN patients p ON p.id = ar.patient_id
    WHERE p.company_id = ? AND ar.completed_at >= datetime('now', '-90 days')
    GROUP BY ar.assessment_type, ar.severity
    ORDER BY ar.assessment_type
  `).all(companyId);

  // Monthly participation trend (last 6 months)
  const monthlyTrend = db.prepare(`
    SELECT strftime('%Y-%m', ar.completed_at) as month, COUNT(*) as responses,
           COUNT(DISTINCT ar.patient_id) as unique_participants
    FROM assessment_responses ar
    JOIN patients p ON p.id = ar.patient_id
    WHERE p.company_id = ? AND ar.completed_at >= datetime('now', '-6 months')
    GROUP BY month ORDER BY month
  `).all(companyId);

  // Program-level risk index: % of responses in elevated+ severity bands
  const riskBands = ['moderate', 'moderately severe', 'severe', 'extremely severe',
                     'moderately elevated', 'high', 'probable PTSD', 'positive screen'];
  const allRecent = db.prepare(`
    SELECT ar.severity FROM assessment_responses ar
    JOIN patients p ON p.id = ar.patient_id
    WHERE p.company_id = ? AND ar.completed_at >= datetime('now', '-90 days')
  `).all(companyId) as Array<{ severity: string | null }>;
  const totalResponses = allRecent.length;
  const elevated = allRecent.filter(r =>
    r.severity && riskBands.some(b => r.severity!.toLowerCase().includes(b))
  ).length;

  return NextResponse.json({
    company: db.prepare('SELECT id, name FROM companies WHERE id = ?').get(companyId),
    headcount,
    participants,
    participationRate: headcount > 0 ? Math.round((participants / headcount) * 100) : 0,
    riskIndex: totalResponses > 0 ? Math.round((elevated / totalResponses) * 100) : 0,
    totalResponses90d: totalResponses,
    severityMix,
    monthlyTrend,
  });
}
