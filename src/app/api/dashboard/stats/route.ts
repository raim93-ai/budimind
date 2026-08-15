import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const db = getDb();
    
    // Get basic stats
    const totalPatients = db.prepare('SELECT COUNT(*) as count FROM patients').get().count as number;
    const totalAssessments = db.prepare('SELECT COUNT(*) as count FROM assessment_responses').get().count as number;
    const totalCompanies = db.prepare('SELECT COUNT(*) as count FROM companies').get().count as number;
    
    // Get assessments completed in last 7 days
    const recentAssessments = db.prepare(`
      SELECT COUNT(*) as count FROM assessment_responses 
      WHERE completed_at >= date('now', '-7 days')
    `).get().count as number;
    
    // Get patients with assessments in last 30 days (active patients)
    const activePatients = db.prepare(`
      SELECT COUNT(DISTINCT patient_id) as count 
      FROM assessment_responses 
      WHERE completed_at >= date('now', '-30 days')
    `).get().count as number;
    
    return NextResponse.json({
      totalPatients,
      totalAssessments,
      totalCompanies,
      recentAssessments,
      activePatients
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}