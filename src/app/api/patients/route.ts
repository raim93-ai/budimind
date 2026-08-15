import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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
    
    const totalResult = db.prepare(countQuery).get(countParams);
    const total = totalResult.total as number;
    
    return NextResponse.json({
      patients,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}