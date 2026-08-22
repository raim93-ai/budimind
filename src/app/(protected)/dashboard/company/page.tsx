import { getDb } from '@/lib/db';
import Link from 'next/link';
import TrendChart from '@/components/charts/TrendChart';
import { DIMENSION_COLORS } from '@/lib/dimensions';

interface TrendPoint {
  date: string;
  dimension: string;
  score: number;
  patient_count: number;
}

interface BurnoutRiskDist {
  high: number;
  moderate: number;
  low: number;
}

interface CompanyStat {
  id: number;
  name: string;
  patient_count: number;
  avg_score: number;
  risk_level: 'low' | 'moderate' | 'high';
}

export const dynamic = 'force-dynamic';

export default async function CorporateDashboardPage({
  searchParams,
}: {
  searchParams: { companyId?: string; days?: string };
}) {
  const db = getDb();
  const days = parseInt(searchParams.days || '90');
  const companyId = searchParams.companyId
    ? parseInt(searchParams.companyId)
    : undefined;

  // Get all companies with patient counts and risk stats
  const companies = db
    .prepare(`
      SELECT 
        c.id,
        c.name,
        COUNT(DISTINCT p.id) as patient_count,
        COUNT(ar.id) as assessment_count,
        AVG(CAST(ar.raw_scores AS REAL)) as avg_score
      FROM companies c
      LEFT JOIN patients p ON c.id = p.company_id
      LEFT JOIN assessment_responses ar ON p.id = ar.patient_id
      GROUP BY c.id, c.name
      ORDER BY c.name
    `)
    .all() as CompanyStat[];

  // Enhanced company stats with trend data
  const enhancedCompanies: CompanyStat[] = companies.map((c) => {
    const score = c.avg_score
      ? Math.round(c.avg_score)
      : 0;
    // Rough risk classification
    let risk: 'low' | 'moderate' | 'high' = 'low';
    if (c.avg_score > 70) risk = 'high';
    else if (c.avg_score > 40) risk = 'moderate';

    return {
      id: c.id,
      name: c.name,
      patient_count: c.patient_count,
      avg_score: score,
      risk_level: risk,
    };
  });

  // Get aggregated trend data for charts
  let trendQuery = `
    SELECT 
      DATE(at.assessment_date) as date,
      at.dimension,
      AVG(at.score) as avg_score,
      COUNT(DISTINCT at.patient_id) as patient_count
    FROM assessment_trends at
    JOIN patients p ON at.patient_id = p.id
    WHERE 1=1
  `;
  const trendParams: any[] = [];

  if (companyId) {
    trendQuery += ' AND p.company_id = ?';
    trendParams.push(companyId);
  }
  trendQuery += ` 
    AND at.assessment_date >= datetime('now', '-' || ? || ' days')
    GROUP BY DATE(at.assessment_date), at.dimension
    ORDER BY date ASC, at.dimension ASC
  `;
  trendParams.push(days);

  const trends = db.prepare(trendQuery).all(...trendParams) as TrendPoint[];

  // Convert to TrendChart format
  const chartData = trends.map((t) => ({
    date: t.date,
    dimension: t.dimension,
    score: Math.round(t.score),
    severity_level: null,
    assessment_type: '',
  }));

  // Get unique dimensions for chart
  const activeDimensions = Array.from(
    new Set(trends.map((t) => t.dimension)),
  );

  // Get burnout risk distribution (from stress dimension)
  const burnoutData = db
    .prepare(`
      SELECT severity_level, COUNT(*) as count
      FROM assessment_trends
      WHERE dimension = 'stress'
        AND assessment_date >= datetime('now', '-' || ? || ' days')
        ${companyId ? 'AND patient_id IN (SELECT id FROM patients WHERE company_id = ?)' : ''}
      GROUP BY severity_level
    `)
    .all(days, ...(companyId ? [companyId] : [])) as {
    severity_level: string;
    count: number;
  }[];

  const burnoutRisk: BurnoutRiskDist = {
    high:
      burnoutData.find((b) => ['severe', 'extreme', 'extremely severe'].includes(b.severity_level))
        ?.count || 0,
    moderate:
      burnoutData.find((b) => ['moderate', 'mild'].includes(b.severity_level))
        ?.count || 0,
    low:
      burnoutData.find((b) => ['normal', 'subclinical', 'minimal'].includes(b.severity_level))
        ?.count || 0,
  };

  // Get assessment completion rate
  const totalPossibleAssessments = enhancedCompanies.reduce(
    (sum, c) => sum + c.patient_count,
    0,
  );
  const totalCompleted = db
    .prepare(`
      SELECT COUNT(*) as count FROM assessment_responses 
      WHERE completed_at >= datetime('now', '-' || ? || ' days')
    `)
    .get(days) as { count: number };
  const completionRate =
    totalPossibleAssessments > 0
      ? Math.round((totalCompleted.count / totalPossibleAssessments) * 100)
      : 0;

  // Get assessment type distribution
  const assessmentTypes = db
    .prepare(`
      SELECT assessment_type, COUNT(*) as count
      FROM assessment_responses
      WHERE completed_at >= datetime('now', '-' || ? || ' days')
      GROUP BY assessment_type
      ORDER BY count DESC
    `)
    .all(days) as { assessment_type: string; count: number }[];

  // Get most at-risk patients (top 5 by latest stress score)
  const atRiskPatients = db
    .prepare(`
      SELECT DISTINCT
        p.id,
        p.full_name,
        p.company_id,
        c.name as company_name,
        at.score as stress_score,
        at.severity_level,
        at.assessment_date as last_date
      FROM assessment_trends at
      JOIN patients p ON at.patient_id = p.id
      LEFT JOIN companies c ON p.company_id = c.id
      WHERE at.dimension = 'stress'
        AND at.assessment_date >= datetime('now', '-' || ? || ' days')
        ${companyId ? 'AND p.company_id = ?' : ''}
      ORDER BY at.score DESC, at.assessment_date DESC
      LIMIT 10
    `)
    .all(days, ...(companyId ? [companyId] : [])) as {
    id: number;
    full_name: string;
    company_name: string;
    stress_score: number;
    severity_level: string;
    last_date: string;
  }[];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="washi-paper min-h-screen">
        {/* Header with company selector */}
        <header className="shoji-divider pb-6 mb-8">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-[var(--foreground)]">
                Corporate Analytics
              </h1>
              <Link href="/dashboard">
                <button className="button-secondary hanko-badge">
                  ← Back to Dashboard
                </button>
              </Link>
            </div>

            {/* Company Filter */}
            <form method="GET" className="flex items-end gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm text-[var(--muted-foreground)] block mb-1">
                  Organization
                </label>
                <select
                  name="companyId"
                  className="w-full hanko-badge px-3 py-2 text-sm"
                  defaultValue={companyId?.toString() || ''}
                >
                  <option value="">All Organizations</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <label className="text-sm text-[var(--muted-foreground)] block mb-1">
                  Time Range
                </label>
                <select
                  name="days"
                  className="w-full hanko-badge px-3 py-2 text-sm"
                  defaultValue={days.toString()}
                >
                  <option value="30">30 Days</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="365">1 Year</option>
                </select>
              </div>
              <button
                type="submit"
                className="button-primary px-4 py-2 rounded-md font-medium"
              >
                Apply
              </button>
            </form>

            <p className="text-[var(--muted-foreground)] text-lg mt-2">
              {companyId
                ? companies.find((c) => c.id === companyId)?.name || 'Selected'
                : 'All Organizations'} ·
              {days} day view · {activeDimensions.length} dimensions monitored
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 pb-12">
          {/* Org-Level KPI Cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="washi-card p-6 text-center">
              <div className="text-3xl font-bold text-[var(--primary)]">
                {enhancedCompanies.reduce(
                  (sum, c) => sum + c.patient_count,
                  0,
                )}
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Total Workers Tracked
              </p>
            </div>

            <div className="washi-card p-6 text-center">
              <div className="text-3xl font-bold text-[var(--accent)]">
                {completionRate}%
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Assessment Completion
              </p>
              <div className="w-full bg-[var(--border)]/30 rounded-full h-2 mt-2">
                <div
                  className="bg-[var(--primary)] h-2 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div className="washi-card p-6 text-center">
              <div className="text-3xl font-bold text-[var(--warning)]">
                {burnoutRisk.high}
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                High Burnout Risk
              </p>
            </div>

            <div className="washi-card p-6 text-center">
              <div className="text-3xl font-bold text-[var(--success)]">
                {Math.round(
                  enhancedCompanies.reduce(
                    (sum, c) => sum + c.avg_score,
                    0,
                  ) /
                    Math.max(enhancedCompanies.length, 1),
                )}
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Avg Wellness Score
              </p>
            </div>
          </section>

          {/* Longitudinal Trend Chart */}
          <section className="washi-card p-6 mb-8">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Organizational Wellness Trends
            </h2>
            {chartData.length > 0 ? (
              <TrendChart
                data={chartData}
                height={350}
                showPoints={true}
                className="w-full"
              />
            ) : (
              <div className="text-center py-12 text-[var(--muted-foreground)]">
                <p>No trend data available yet.</p>
                <p className="text-sm mt-2">
                  Data appears when workers complete assessments.
                </p>
              </div>
            )}
          </section>

          {/* Two-column layout: company list + at-risk patients */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Company List */}
            <section className="washi-card p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                Organization Overview
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="shoji-divider">
                      <th className="text-left py-3 px-2 text-[var(--muted-foreground)]">
                        Organization
                      </th>
                      <th className="text-left py-3 px-2 text-[var(--muted-foreground)]">
                        Workers
                      </th>
                      <th className="text-left py-3 px-2 text-[var(--muted-foreground)]">
                        Avg Score
                      </th>
                      <th className="text-left py-3 px-2 text-[var(--muted-foreground)]">
                        Risk
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {enhancedCompanies.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-[var(--muted)]/30"
                      >
                        <td className="py-3 px-2 font-medium">
                          {c.name}
                        </td>
                        <td className="py-3 px-2">
                          {c.patient_count} workers
                        </td>
                        <td className="py-3 px-2">
                          {c.avg_score}/100
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              c.risk_level === 'high'
                                ? 'bg-[var(--destructive)]/20 text-[var(--destructive)]'
                                : c.risk_level === 'moderate'
                                  ? 'bg-[var(--warning)]/20 text-[var(--warning)]'
                                  : 'bg-[var(--success)]/20 text-[var(--success)]'
                            }`}
                          >
                            {c.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* At-Risk Patients */}
            <section className="washi-card p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                At-Risk Individuals
              </h2>
              {atRiskPatients.length > 0 ? (
                <div className="space-y-4">
                  {atRiskPatients.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-[var(--muted)]/20 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {p.full_name}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {p.company_name || 'Unassigned'} · Stress: {Math.round(p.stress_score)}/100
                        </p>
                      </div>
                      <span
                        className={`hanko-badge text-xs ${
                          p.stress_score >= 67
                            ? 'bg-[var(--destructive)]/20 text-[var(--destructive)]'
                            : p.stress_score >= 34
                              ? 'bg-[var(--warning)]/20 text-[var(--warning)]'
                              : 'bg-[var(--success)]/20 text-[var(--success)]'
                        }`}
                      >
                        {p.severity_level || 'Unknown'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[var(--muted-foreground)]">
                  <p>No at-risk individuals identified.</p>
                </div>
              )}
            </section>
          </div>

          {/* Assessment Distribution */}
          <section className="washi-card p-6 mt-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Assessment Usage (Last {days} days)
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {assessmentTypes.map((stat) => (
                <div
                  key={stat.assessment_type}
                  className="bg-[var(--muted)]/20 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm uppercase">
                      {stat.assessment_type}
                    </h3>
                    <span className="text-2xl font-bold text-[var(--accent)]">
                      {stat.count}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--border)]/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded-full transition-all"
                      style={{
                        width: `${
                          Math.min(
                            (stat.count /
                              Math.max(
                                ...assessmentTypes.map((s) => s.count),
                                1,
                              )) *
                              100,
                            100,
                          )}%
                        `,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Burnout Risk Breakdown */}
          <section className="washi-card p-6 mt-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Burnout Risk Distribution
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 bg-[var(--destructive)]/10 rounded-xl">
                <div className="text-4xl font-bold text-[var(--destructive)]">
                  {burnoutRisk.high}
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  High Risk
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-2">
                  Immediate intervention recommended
                </p>
              </div>
              <div className="text-center p-6 bg-[var(--warning)]/10 rounded-xl">
                <div className="text-4xl font-bold text-[var(--warning)]">
                  {burnoutRisk.moderate}
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  Moderate Risk
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-2">
                  Monitor closely
                </p>
              </div>
              <div className="text-center p-6 bg-[var(--success)]/10 rounded-xl">
                <div className="text-4xl font-bold text-[var(--success)]">
                  {burnoutRisk.low}
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  Low Risk
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-2">
                  Healthy range
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
