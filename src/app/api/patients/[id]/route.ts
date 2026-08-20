import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth-middleware';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const authError = authMiddleware(request as any);
  if (authError) return authError;

  try {
    const { id } = await params;
    const patientId = parseInt(id);
    const db = getDb();

    // Get patient info
    const patient = db.prepare(`
      SELECT p.*, c.name as company_name
      FROM patients p
      LEFT JOIN companies c ON p.company_id = c.id
      WHERE p.id = ?
    `).get(patientId);

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 },
      );
    }

    // Get all assessments for this patient
    const patientAssessments = db.prepare(`
      SELECT * FROM assessment_responses
      WHERE patient_id = ?
      ORDER BY completed_at DESC
    `).all(patientId);

    // Parse JSON responses and scores
    const assessmentsWithData = patientAssessments.map((assessment: any) => ({
      ...assessment,
      responses: JSON.parse(assessment.responses),
      raw_scores: JSON.parse(assessment.raw_scores),
    }));

    // Get latest scores for each assessment type (for spider chart)
    const latestScores: Record<string, any> = {};
    for (const assessment of assessmentsWithData) {
      // Keep only the most recent assessment of each type
      if (!latestScores[assessment.assessment_type] ||
          new Date(assessment.completed_at) > new Date(latestScores[assessment.assessment_type].completed_at)) {
        latestScores[assessment.assessment_type] = assessment;
      }
    }

    return NextResponse.json({
      patient,
      assessments: assessmentsWithData,
      latestScores,
    });
  } catch (error) {
    console.error('Get patient error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}