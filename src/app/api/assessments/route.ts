import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { assessments } from '@/db/assessments';
import { verifyToken } from '@/lib/auth-edge';

const assessmentResponseSchema = z.object({
  patientInfo: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    icNumber: z.string().optional().nullable(),
    email: z.string().email('Invalid email').optional().nullable(),
    age: z.number().min(1).max(120, 'Age must be between 1 and 120').optional().nullable(),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional().nullable(),
    phone: z.string().optional().nullable(),
    companyId: z.number().int().positive().optional().nullable(),
  }),
  assessmentType: z.string(),
  responses: z.array(z.number()).min(1, 'Responses are required'),
});

export async function POST(request: Request) {
  // Check authentication
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  try {
    const { jwtVerify } = await import('jose');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { patientInfo, assessmentType, responses } = assessmentResponseSchema.parse(body);
    
    const db = getDb();
    
    // Check if patient exists by IC or email, otherwise create new
    let patientId = null;
    const existingPatientByIc = patientInfo.icNumber 
      ? db.prepare('SELECT id FROM patients WHERE ic_number = ?').get(patientInfo.icNumber)
      : null;
    const existingPatientByEmail = patientInfo.email
      ? db.prepare('SELECT id FROM patients WHERE email = ?').get(patientInfo.email)
      : null;
    
    if (existingPatientByIc) {
      patientId = existingPatientByIc.id;
      // Update existing patient info
      db.prepare(`
        UPDATE patients SET 
          full_name = @fullName,
          email = @email,
          age = @age,
          gender = @gender,
          phone = @phone,
          company_id = @companyId
        WHERE id = @id
      `).run({
        fullName: patientInfo.fullName,
        email: patientInfo.email ?? null,
        age: patientInfo.age ?? null,
        gender: patientInfo.gender ?? null,
        phone: patientInfo.phone ?? null,
        companyId: patientInfo.companyId ?? null,
        id: patientId
      });
    } else if (existingPatientByEmail) {
      patientId = existingPatientByEmail.id;
      // Update existing patient info
      db.prepare(`
        UPDATE patients SET 
          full_name = @fullName,
          ic_number = @icNumber,
          age = @age,
          gender = @gender,
          phone = @phone,
          company_id = @companyId
        WHERE id = @id
      `).run({
        fullName: patientInfo.fullName,
        icNumber: patientInfo.icNumber ?? null,
        age: patientInfo.age ?? null,
        gender: patientInfo.gender ?? null,
        phone: patientInfo.phone ?? null,
        companyId: patientInfo.companyId ?? null,
        id: patientId
      });
    } else {
      // Create new patient
      const result = db.prepare(`
        INSERT INTO patients (
          full_name, ic_number, email, age, gender, phone, company_id
        ) VALUES (
          @fullName, @icNumber, @email, @age, @gender, @phone, @companyId
        )
      `).run({
        fullName: patientInfo.fullName,
        icNumber: patientInfo.icNumber ?? null,
        email: patientInfo.email ?? null,
        age: patientInfo.age ?? null,
        gender: patientInfo.gender ?? null,
        phone: patientInfo.phone ?? null,
        companyId: patientInfo.companyId ?? null
      });
      
      patientId = result.lastInsertRowid;
    }
    
    // Look up the assessment from the registry
    const assessment = (assessments as any)[assessmentType];
    
    if (!assessment) {
      throw new Error(`Assessment ${assessmentType} not found`);
    }
    
    // Score the responses
    const scores = assessment.scoringFn(responses);
    
    // Save assessment response
    const responseResult = db.prepare(`
      INSERT INTO assessment_responses (
        patient_id, assessment_type, responses, raw_scores, severity
      ) VALUES (
        @patientId, @assessmentType, @responses, @rawScores, @severity
      )
    `).run({
      patientId,
      assessmentType,
      responses: JSON.stringify(responses),
      rawScores: JSON.stringify(scores),
      severity: scores.severity ?? 'unknown'
    });

    // Inject trend data for longitudinal tracking
    const trendInsert = db.prepare(`
      INSERT INTO assessment_trends (
        patient_id, assessment_type, assessment_date, dimension, score, severity_level
      ) VALUES (
        @patientId, @assessmentType, @assessmentDate, @dimension, @score, @severity
      )
    `);

    const assessmentDate = new Date().toISOString();
    const now = new Date().toISOString();

    // Map score keys to dimensions and insert trend data
    for (const [key, value] of Object.entries(scores)) {
      if (['total', 'severity', 'interpretation'].includes(key)) continue;
      if (typeof value === 'number') {
        // Normalize score to 0-100 range (rough approximation)
        // For DASS-21 subscales: max is 42, so score/42 * 100
        // For PHQ-9: max is 27, so score/27 * 100
        // This is a rough normalization — individual assessments may need custom mapping
        let normalizedScore = 0;
        const maxValue = assessmentType === 'dass21' ? 42 :
                        ['phq9', 'bai', 'bdi2'].includes(assessmentType) ? 27 :
                        ['gad7'].includes(assessmentType) ? 21 :
                        ['k10'].includes(assessmentType) ? 50 :
                        ['who5'].includes(assessmentType) ? 25 :
                        ['pca5'].includes(assessmentType) ? 100 : 100;
        normalizedScore = Math.min(100, Math.max(0, (value / maxValue) * 100));

        trendInsert.run({
          patientId,
          assessmentType,
          assessmentDate,
          dimension: key,
          score: Math.round(normalizedScore * 10) / 10,
          severity: scores.severity ?? 'unknown'
        });
      }
    }

    return NextResponse.json({
      success: true,
      patientId,
      assessmentId: responseResult.lastInsertRowid,
      scores
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}