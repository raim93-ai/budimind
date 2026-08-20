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

function checkAuth(request: Request): NextResponse | null {
  // Get token from cookie header
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  // This is a simplified check - the middleware already verified the token
  // We just need to verify it again for safety
  const { SignJWT, jwtVerify } = require('jose');
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  const secretKey = new TextEncoder().encode(JWT_SECRET);
  
  try {
    const { payload } = jwtVerify(token, secretKey);
    return null;
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 },
    );
  }
}

export async function POST(request: Request) {
  const authError = checkAuth(request);
  if (authError) return authError;

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
        id: patientId,
      });
    } else if (existingPatientByEmail) {
      patientId = existingPatientByEmail.id;
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
        id: patientId,
      });
    } else {
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
        companyId: patientInfo.companyId ?? null,
      });

      patientId = result.lastInsertRowid;
    }

    // Get the assessment from the assessments object
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
      severity: scores.severity ?? 'unknown',
    });

    return NextResponse.json({
      success: true,
      patientId,
      assessmentId: responseResult.lastInsertRowid,
      scores,
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}