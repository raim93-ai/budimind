import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

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
    
    // Import the specific assessment to get its scoring function
    const assessmentsModule = await import(`@/db/assessments/${assessmentType}`);
    const assessment = assessmentsModule[assessmentType];
    
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