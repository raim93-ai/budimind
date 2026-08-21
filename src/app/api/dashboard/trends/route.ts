import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-edge';
import { getPatientTrends, getCompanyTrends } from '@/lib/trends';

async function checkAuth(request: Request): Promise<{ valid: boolean; userId?: number; userType?: string }> {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) {
    return { valid: false };
  }

  try {
    const payload = await verifyToken(token);
    if (payload) {
      return {
        valid: true,
        userId: payload.userId || payload.id,
        userType: payload.userType || 'consultant',
      };
    }
  } catch (error) {
    // Invalid token
  }

  return { valid: false };
}

export async function GET(request: Request) {
  // Check authentication
  const auth = await checkAuth(request);
  if (!auth.valid) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId')
      ? parseInt(searchParams.get('patientId')!)
      : undefined;
    const companyId = searchParams.get('companyId')
      ? parseInt(searchParams.get('companyId')!)
      : undefined;
    const assessmentType = searchParams.get('assessmentType') || undefined;
    const dimension = searchParams.get('dimension') || undefined;
    const days = parseInt(searchParams.get('days') || '90');
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const db = getDb();

    // If patientId is provided, return individual patient trends
    if (patientId) {
      let query = `
        SELECT assessment_date, dimension, score, severity_level, assessment_type
        FROM assessment_trends
        WHERE patient_id = ?
      `;
      const params: any[] = [patientId];

      if (assessmentType) {
        query += ' AND assessment_type = ?';
        params.push(assessmentType);
      }
      if (dimension) {
        query += ' AND dimension = ?';
        params.push(dimension);
      }
      if (startDate) {
        query += ' AND assessment_date >= ?';
        params.push(startDate);
      }
      if (endDate) {
        query += ' AND assessment_date <= ?';
        params.push(endDate);
      }
      query += ' ORDER BY assessment_date ASC, dimension ASC';

      const trends = db.prepare(query).all(...params);

      return NextResponse.json({
        patientId,
        days,
        trends,
      });
    }

    // If companyId is provided, return company-aggregated trends
    if (companyId) {
      const trends = db
        .prepare(
          `
          SELECT 
            DATE(assessment_date) as date,
            dimension,
            AVG(score) as avg_score,
            COUNT(DISTINCT patient_id) as patient_count
          FROM assessment_trends
          WHERE company_id = ?
            AND assessment_date >= datetime('now', '-' || ? || ' days')
          GROUP BY DATE(assessment_date), dimension
          ORDER BY date ASC, dimension ASC
        `,
        )
        .all(companyId, days) as {
        date: string;
        dimension: string;
        avg_score: number;
        patient_count: number;
      }[];

      return NextResponse.json({
        companyId,
        days,
        trends: trends.map((t) => ({
          date: t.date,
          dimension: t.dimension,
          score: Math.round(t.avg_score * 10) / 10,
          patientCount: t.patient_count,
        })),
      });
    }

    // If neither is provided, return all trends for the consultant's scope
    let query = `
      SELECT 
        at.assessment_date,
        at.dimension,
        at.score,
        at.severity_level,
        at.assessment_type,
        p.full_name as patient_name,
        p.id as patient_id
      FROM assessment_trends at
      JOIN patients p ON at.patient_id = p.id
    `;
    const params: any[] = [];

    if (assessmentType) {
      query += ' AND at.assessment_type = ?';
      params.push(assessmentType);
    }
    query += ` ORDER BY at.assessment_date DESC LIMIT ?`;
    params.push(days * 100); // Limit results

    const trends = db.prepare(query).all(...params);

    // Also get summary stats
    const summary = db
      .prepare(
        `
        SELECT 
          COUNT(DISTINCT patient_id) as patient_count,
          COUNT(*) as total_data_points,
          AVG(score) as overall_avg
        FROM assessment_trends
        WHERE assessment_date >= datetime('now', '-' || ? || ' days')
      `,
      )
      .get(days) as {
      patient_count: number;
      total_data_points: number;
      overall_avg: number;
    };

    return NextResponse.json({
      days,
      summary: {
        patientCount: summary.patient_count,
        totalDataPoints: summary.total_data_points,
        overallAvgScore: Math.round(summary.overall_avg * 10) / 10,
      },
      trends,
    });
  } catch (error) {
    console.error('Get trends error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
