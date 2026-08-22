import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authMiddleware } from '@/lib/auth-middleware';

const patientSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  icNumber: z.string().optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable(),
  age: z.number().int().min(1).max(120).optional().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional().nullable(),
  phone: z.string().optional().nullable(),
  companyId: z.number().int().positive().optional().nullable(),
});

export async function GET(request: Request) {
  // Check authentication
  const authError = await authMiddleware(request as any);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const companyId = searchParams.get('companyId')
      ? parseInt(searchParams.get('companyId')!)
      : undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const db = getDb();

    let query = `
      SELECT p.*, c.name as company_name
      FROM patients p
      LEFT JOIN companies c ON p.company_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      query += ` AND (p.full_name LIKE ? OR p.ic_number LIKE ? OR p.email LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (companyId !== undefined) {
      query += ` AND p.company_id = ?`;
      params.push(companyId);
    }

    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const patients = db.prepare(query).all(params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM patients p
      WHERE 1=1
    `;
    const countParams: any[] = [];

    if (search) {
      countQuery += ` AND (p.full_name LIKE ? OR p.ic_number LIKE ? OR p.email LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (companyId !== undefined) {
      countQuery += ` AND p.company_id = ?`;
      countParams.push(companyId);
    }

    const totalResult = db.prepare(countQuery).get(countParams) as { total: number };
    const total = totalResult.total;

    return NextResponse.json({
      patients,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  // Check authentication
  const authError = await authMiddleware(request as any);
  if (authError) return authError;

  try {
    const body = await request.json();
    const data = patientSchema.parse(body);

    const db = getDb();

    // Check if patient with same IC or email already exists
    if (data.icNumber) {
      const existingByIc = db.prepare('SELECT id FROM patients WHERE ic_number = ?').get(data.icNumber);
      if (existingByIc) {
        return NextResponse.json(
          { error: 'Patient with this IC number already exists' },
          { status: 409 },
        );
      }
    }

    if (data.email) {
      const existingByEmail = db.prepare('SELECT id FROM patients WHERE email = ?').get(data.email);
      if (existingByEmail) {
        return NextResponse.json(
          { error: 'Patient with this email already exists' },
          { status: 409 },
        );
      }
    }

    const result = db.prepare(`
      INSERT INTO patients (
        full_name, ic_number, email, age, gender, phone, company_id
      ) VALUES (
        @fullName, @icNumber, @email, @age, @gender, @phone, @companyId
      )
    `).run({
      fullName: data.fullName,
      icNumber: data.icNumber ?? null,
      email: data.email ?? null,
      age: data.age ?? null,
      gender: data.gender ?? null,
      phone: data.phone ?? null,
      companyId: data.companyId ?? null,
    });

    const newPatient = db.prepare(`
      SELECT p.*, c.name as company_name
      FROM patients p
      LEFT JOIN companies c ON p.company_id = c.id
      WHERE p.id = ?
    `).get(result.lastInsertRowid);

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 },
      );
    }
    console.error('Create patient error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}