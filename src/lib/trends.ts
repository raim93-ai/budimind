import { getDb } from './db';

// Dimension mapping from assessments to normalized dimensions for trend tracking
export const DIMENSION_MAPPING: Record<string, string> = {
  // DASS-21 subscales
  depression: 'depression',
  anxiety: 'anxiety',
  stress: 'stress',
  // PHQ-9 -> depression
  phq9: 'depression',
  // GAD-7 -> anxiety
  gad7: 'anxiety',
  // WHO-5 -> well-being
  who5: 'well-being',
  // PCL-5 -> PTSD
  pcl5: 'PTSD',
  // ASRS -> ADHD
  asrs: 'ADHD',
  // ISI -> sleep
  isi: 'sleep',
  // Y-BOCS -> OCD
  ybocs: 'OCD',
  // BDI-II -> depression
  bdi2: 'depression',
  // BAI -> anxiety
  bai: 'anxiety',
  // K10 -> stress (general psychological distress)
  k10: 'stress',
  // WHODAS 2.0 -> cognitive
  whodas2: 'cognitive',
  // CORE-OM -> well-being
  coreom: 'well-being',
  // EPDS -> depression
  epds: 'depression',
};

export interface TrendPoint {
  date: string;
  dimension: string;
  score: number;
  severity: string | null;
  assessment_type: string;
}

export interface PatientTrendSummary {
  patientId: number;
  patientName: string;
  trends: TrendPoint[];
  dimensions: string[];
  latestScores: Record<string, number>;
  overallTrend: 'improving' | 'declining' | 'stable';
  improvementRate: number; // percentage
}

export interface CompanyTrendSummary {
  companyId: number;
  companyName: string;
  patientCount: number;
  avgScores: Record<string, number>;
  trends: {
    date: string;
    dimension: string;
    score: number;
    patientCount: number;
  }[];
  burnoutRisk: {
    high: number;
    moderate: number;
    low: number;
  };
}

/**
 * Get time-series trend data for a specific patient
 * @param patientId - The patient ID
 * @param days - Number of days to look back (default: 90)
 */
export async function getPatientTrends(
  patientId: number,
  days: number = 90,
): Promise<TrendPoint[]> {
  const db = getDb();
  const trends = db
    .prepare(
      `
    SELECT assessment_date, dimension, score, severity_level, assessment_type
    FROM assessment_trends
    WHERE patient_id = ?
      AND assessment_date >= datetime('now', '-' || ? || ' days')
    ORDER BY assessment_date ASC, dimension ASC
  `,
    )
    .all(patientId, days) as TrendPoint[];

  return trends;
}

/**
 * Get a comprehensive trend summary for a patient including latest scores,
 * overall trend direction, and improvement rate
 */
export async function getPatientTrendSummary(
  patientId: number,
  days: number = 90,
): Promise<PatientTrendSummary | null> {
  const db = getDb();

  // Get patient name
  const patient = db
    .prepare('SELECT full_name FROM patients WHERE id = ?')
    .get(patientId) as { full_name: string } | undefined;

  if (!patient) {
    return null;
  }

  // Get all trend data
  const trends = await getPatientTrends(patientId, days);

  if (trends.length === 0) {
    return {
      patientId,
      patientName: patient.full_name,
      trends: [],
      dimensions: [],
      latestScores: {},
      overallTrend: 'stable',
      improvementRate: 0,
    };
  }

  // Get unique dimensions
  const dimensions = Array.from(new Set(trends.map((t) => t.dimension)));

  // Get latest score per dimension
  const latestScores: Record<string, number> = {};
  for (const dim of dimensions) {
    const dimTrends = trends
      .filter((t) => t.dimension === dim)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (dimTrends.length > 0) {
      latestScores[dim] = dimTrends[0].score;
    }
  }

  // Calculate overall trend direction
  // Lower scores = better for depression/anxiety/stress/PTSD/ADHD/sleep/OCD
  // Higher scores = better for well-being
  const invertedDimensions = new Set([
    'depression',
    'anxiety',
    'stress',
    'PTSD',
    'ADHD',
    'sleep',
    'OCD',
  ]);

  const overallTrend = calculateOverallTrend(trends, invertedDimensions);
  const improvementRate = calculateImprovementRate(trends, invertedDimensions);

  return {
    patientId,
    patientName: patient.full_name,
    trends,
    dimensions,
    latestScores,
    overallTrend,
    improvementRate,
  };
}

/**
 * Get aggregated trend data for an entire company
 */
export async function getCompanyTrends(
  companyId: number,
  days: number = 90,
): Promise<CompanyTrendSummary | null> {
  const db = getDb();

  // Get company info
  const company = db
    .prepare('SELECT name FROM companies WHERE id = ?')
    .get(companyId) as { name: string } | undefined;

  if (!company) {
    return null;
  }

  // Get patient count
  const patientCountResult = db
    .prepare('SELECT COUNT(*) as count FROM patients WHERE company_id = ?')
    .get(companyId) as { count: number };

  // Get aggregated trends by date and dimension
  const rawTrends = db
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

  // Get latest avg scores per dimension
  const avgScores: Record<string, number> = {};
  for (const t of rawTrends) {
    avgScores[t.dimension] = t.avg_score;
  }

  // Get burnout risk distribution
  const burnoutData = db
    .prepare(
      `
    SELECT severity_level, COUNT(*) as count
    FROM assessment_trends
    WHERE company_id = ?
      AND dimension = 'stress'
      AND assessment_date >= datetime('now', '-' || ? || ' days')
    GROUP BY severity_level
  `,
    )
    .all(companyId, days) as { severity_level: string; count: number }[];

  const burnoutRisk = {
    high:
      burnoutData.find((b) => ['severe', 'extreme'].includes(b.severity_level))?.count ||
      0,
    moderate:
      burnoutData.find((b) => b.severity_level === 'moderate')?.count || 0,
    low:
      (burnoutData.find((b) => ['normal', 'mild'].includes(b.severity_level))?.count ||
        0) +
      (burnoutData.find((b) => b.severity_level === 'unknown')?.count || 0),
  };

  return {
    companyId,
    companyName: company.name,
    patientCount: patientCountResult.count,
    avgScores,
    trends: rawTrends.map((t) => ({
      date: t.date,
      dimension: t.dimension,
      score: Math.round(t.avg_score * 10) / 10,
      patientCount: t.patient_count,
    })),
    burnoutRisk,
  };
}

/**
 * Helper: Calculate overall trend direction
 * Returns 'improving', 'declining', or 'stable'
 */
function calculateOverallTrend(
  trends: TrendPoint[],
  invertedDimensions: Set<string>,
): 'improving' | 'declining' | 'stable' {
  // Group by dimension, compare first half vs second half
  const dimensions = Array.from(new Set(trends.map((t) => t.dimension)));
  let improving = 0;
  let declining = 0;

  for (const dim of dimensions) {
    const dimTrends = trends
      .filter((t) => t.dimension === dim)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (dimTrends.length < 4) continue;

    const midpoint = Math.floor(dimTrends.length / 2);
    const firstHalf = dimTrends.slice(0, midpoint);
    const secondHalf = dimTrends.slice(midpoint);

    const firstAvg = firstHalf.reduce((s, t) => s + t.score, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((s, t) => s + t.score, 0) / secondHalf.length;

    const isInverted = invertedDimensions.has(dim);
    // For inverted dimensions (depression, anxiety, etc): lower is better
    // For normal dimensions (well-being): higher is better
    if (isInverted ? secondAvg < firstAvg : secondAvg > firstAvg) {
      improving++;
    } else if (isInverted ? secondAvg > firstAvg : secondAvg < firstAvg) {
      declining++;
    }
  }

  if (improving > declining) return 'improving';
  if (declining > improving) return 'declining';
  return 'stable';
}

/**
 * Helper: Calculate improvement rate as a percentage
 */
function calculateImprovementRate(
  trends: TrendPoint[],
  invertedDimensions: Set<string>,
): number {
  const dimensions = Array.from(new Set(trends.map((t) => t.dimension)));
  let totalImprovement = 0;
  let count = 0;

  for (const dim of dimensions) {
    const dimTrends = trends
      .filter((t) => t.dimension === dim)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (dimTrends.length < 2) continue;

    const first = dimTrends[0].score;
    const last = dimTrends[dimTrends.length - 1].score;

    const isInverted = invertedDimensions.has(dim);
    // For inverted dims: improvement = first - last (reduction = improvement)
    // For normal dims: improvement = last - first (increase = improvement)
    const improvement = isInverted ? first - last : last - first;
    totalImprovement += improvement;
    count++;
  }

  if (count === 0) return 0;
  return Math.round((totalImprovement / count) * 10) / 10;
}

/**
 * Log an action to the audit log for HIPAA compliance
 */
export async function logAuditEvent(params: {
  userId?: number;
  userType?: 'consultant' | 'admin' | 'system';
  action: string;
  resourceType: string;
  resourceId?: number;
  ipAddress?: string;
  userAgent?: string;
  details?: string;
}): Promise<void> {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO audit_log (user_id, user_type, action, resource_type, resource_id, ip_address, user_agent, details)
    VALUES (@userId, @userType, @action, @resourceType, @resourceId, @ipAddress, @userAgent, @details)
  `,
  ).run({
    userId: params.userId ?? null,
    userType: params.userType ?? null,
    action: params.action,
    resourceType: params.resourceType,
    resourceId: params.resourceId ?? null,
    ipAddress: params.ipAddress ?? null,
    userAgent: params.userAgent ?? null,
    details: params.details ?? null,
  });
}
