import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, patientId } = body;

    const db = getDb();

    let patient: any = null;

    if (email) {
      patient = db
        .prepare(
          `
          SELECT p.*, c.name as company_name
          FROM patients p
          LEFT JOIN companies c ON p.company_id = c.id
          WHERE p.email = ?
        `,
        )
        .get(email) as any;
    } else if (patientId) {
      patient = db
        .prepare(
          `
          SELECT p.*, c.name as company_name
          FROM patients p
          LEFT JOIN companies c ON p.company_id = c.id
          WHERE p.id = ?
        `,
        )
        .get(parseInt(patientId)) as any;
    }

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found. Please verify your email or patient ID.' },
        { status: 404 },
      );
    }

    // Generate a temporary patient token (valid for 24 hours)
    const token = await new SignJWT({
      patientId: patient.id,
      fullName: patient.full_name,
      userType: 'patient',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secretKey);

    // Return patient info (no PII beyond name) and token
    return NextResponse.json({
      success: true,
      token,
      patient: {
        id: patient.id,
        fullName: patient.full_name,
        companyName: patient.company_name,
      },
    });
  } catch (error) {
    console.error('Patient lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
