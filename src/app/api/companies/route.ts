import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const db = getDb();
    
    // Get companies with patient counts
    const companies = db.prepare(`
      SELECT c.*, 
             COUNT(p.id) as patient_count
      FROM companies c
      LEFT JOIN patients p ON c.id = p.company_id
      GROUP BY c.id
      ORDER BY c.name
    `).all();
    
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}