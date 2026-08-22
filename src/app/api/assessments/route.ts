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

/**
 * Resolve the acting identity from the (optional) session cookie.
 * - consultant: acting on behalf of a patient (existing behaviour)
 * - client:     results attach to the client's own patient record
 */
async function getActor(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader.match(/token=([^;]+)/)?.[1] ?? null;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return payload as { id: number; role: string; patientId?: number | null; email?: string };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientInfo, assessmentType, responses } = assessmentResponseSchema.parse(body);
    const db = getDb();
    const actor = await getActor(request);

    let patientId: number | null = null;

    if (actor?.role === 'client') {
      // Logged-in client: results always attach to their own linked patient record
      if (actor.patientId) {
        patientId = actor.patientId;
      } else {
        // Client without a patient row yet — create one from their user record
        const r = db.prepare(
          'INSERT INTO patients (full_name, email, company_id, user_id) VALUES (?, ?, NULL, ?)'
        ).run(patientInfo.fullName, actor.email ?? null, actor.id);
        patientId = r.lastInsertRowid as number;
      }
    } else {
      // Anonymous / consultant flow: match by IC or email, otherwise create
      const existingPatientByIc = patientInfo.icNumber
        ? db.prepare('SELECT id FROM patients WHERE ic_number = ?').get(patientInfo.icNumber) as { id: number } | undefined
        : null;
      const existingPatientByEmail = patientInfo.email
        ? db.prepare('SELECT id FROM patients WHERE email = ?').get(patientInfo.email) as { id: number } | undefined
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
        patientId = result.lastInsertRowid as number;
      }
    }

    const assessment = (assessments as any)[assessmentType];
    if (!assessment) {
      throw new Error(`Assessment ${assessmentType} not found`);
    }

    const scores = assessment.scoringFn(responses);

    // Per-question snapshot: question text + chosen value for every item,
    // so results can be reviewed question-by-question forever.
    const answers = responses.map((v: number, i: number) => ({
      i,
      q: assessment.questions[i]?.text ?? `Question ${i + 1}`,
      v,
    }));

    const responseResult = db.prepare(`
      INSERT INTO assessment_responses (
        patient_id, assessment_type, responses, raw_scores, severity, answers
      ) VALUES (
        @patientId, @assessmentType, @responses, @rawScores, @severity, @answers
      )
    `).run({
      patientId,
      assessmentType,
      responses: JSON.stringify(responses),
      rawScores: JSON.stringify(scores),
      severity: scores.severity ?? 'unknown',
      answers: JSON.stringify(answers),
    });

    // Mark any matching pending assignment as completed
    if (actor?.role === 'client') {
      db.prepare(`
        UPDATE assignments
        SET status = 'completed', completed_response_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE client_user_id = ? AND assessment_type = ? AND status = 'pending'
      `).run(responseResult.lastInsertRowid, actor.id, assessmentType);
    }

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
