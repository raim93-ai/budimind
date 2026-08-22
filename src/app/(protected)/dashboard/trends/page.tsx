import { getDb } from '@/lib/db';
import TrendChart from '@/components/charts/TrendChart';
import { DIMENSION_COLORS } from '@/lib/dimensions';

interface TrendPoint {
  assessment_date: string;
  dimension: string;
  score: number;
  severity_level: string | null;
  assessment_type: string;
  patient_name: string;
  patient_id: number;
}

interface PatientSummary {
  id: number;
  full_name: string;
  latest_score: number;
  trend: 'improving' | 'declining' | 'stable';
  assessment_count: number;
  last_assessment_date: string;
}

export const dynamic = 'force-dynamic';

export default async function TrendsDashboardPage({
  searchParams,
}: {
  searchParams: {
    patientId?: string;
    companyId?: string;
    dimension?: string;
    days?: string;
    assessmentType?: string;
  };
}) {
  const db = getDb();
  const days = parseInt(searchParams.days || '90');

  // Build query for trend data
  let trendQuery = `
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
    WHERE 1=1
  `;
  const trendParams: any[] = [];

  if (searchParams.patientId) {
    trendQuery += ' AND p.id = ?';
    trendParams.push(parseInt(searchParams.patientId));
  }
  if (searchParams.companyId) {
    trendQuery += ' AND p.company_id = ?';
    trendParams.push(parseInt(searchParams.companyId));
  }
  if (searchParams.dimension) {
    trendQuery += ' AND at.dimension = ?';
    trendParams.push(searchParams.dimension);
  }
  if (searchParams.assessmentType) {
    trendQuery += ' AND at.assessment_type = ?';
    trendParams.push(searchParams.assessmentType);
  }

  trendQuery += `
    AND at.assessment_date >= datetime('now', '-' || ? || ' days')
    ORDER BY at.assessment_date ASC, at.dimension ASC
  `;
  trendParams.push(days);

  const trends = db.prepare(trendQuery).all(...trendParams) as TrendPoint[];

  // Get patient summaries
  let patientQuery = `
    SELECT 
      p.id,
      p.full_name,
      COUNT(at.id) as assessment_count,
      MAX(at.assessment_date) as last_assessment_date
    FROM patients p
    LEFT JOIN assessment_trends at ON p.id = at.patient_id
    WHERE at.assessment_date >= datetime('now', '-' || ? || ' days')
  `;
  const patientParams = [days];

  if (searchParams.companyId) {
    patientQuery += ' AND p.company_id = ?';
    patientParams.push(parseInt(searchParams.companyId));
  }
  if (searchParams.patientId) {
    patientQuery += ' AND p.id = ?';
    patientParams.push(parseInt(searchParams.patientId));
  }

  patientQuery += ' GROUP BY p.id ORDER BY p.full_name';

  const patients = db.prepare(patientQuery).all(...patientParams) as {
    id: number;
    full_name: string;
    assessment_count: number;
    last_assessment_date: string;
  }[];

  // Get all companies for filter dropdown
  const companies = db
    .prepare('SELECT id, name FROM companies ORDER BY name')
    .all() as { id: number; name: string }[];

  // Get distinct dimensions from data
  const dimensions = Array.from(new Set(trends.map((t) => t.dimension)));

  // Get distinct assessment types
  const assessmentTypes = Array.from(
    new Set(trends.map((t) => t.assessment_type)),
  );

  // Calculate summary stats
  const totalDataPoints = trends.length;
  const affectedPatients = new Set(trends.map((t) => t.patient_id)).size;
  const avgScore =
    totalDataPoints > 0
      ? Math.round(
          (trends.reduce((sum, t) => sum + t.score, 0) / totalDataPoints) * 10,
        ) / 10
      : 0;

  // Convert TrendPoint to TrendChart format
  const chartData = trends.map((t) => ({
    date: t.assessment_date,
    dimension: t.dimension,
    score: Math.round(t.score),
    severity_level: t.severity_level,
    assessment_type: t.assessment_type,
  }));

  // Build patient summaries with trend direction
  const patientSummaries: PatientSummary[] = patients.map((p) => {
    const patientTrends = chartData.filter(
      (t) => t.date && trends.find((pt) => pt.patient_id === p.id),
    );
    const patientScoreTrends = trends.filter((t) => t.patient_id === p.id);
    const firstScore = patientScoreTrends[0]?.score;
    const latestScore = patientScoreTrends[patientScoreTrends.length - 1]?.score;

    let trend: PatientSummary['trend'] = 'stable';
    if (firstScore !== undefined && latestScore !== undefined) {
      const diff = latestScore - firstScore;
      // For most dimensions, lower is better (depression, anxiety, etc.)
      // But for well-being, higher is better
      const isWellBeing = patientScoreTrends.some(
        (t) => t.dimension === 'well-being',
      );
      if (isWellBeing ? diff > 2 : diff < -2) {
        trend = 'improving';
      } else if (isWellBeing ? diff < -2 : diff > 2) {
        trend = 'declining';
      }
    }

    const latestScoreValue = patientScoreTrends.length > 0
      ? patientScoreTrends[patientScoreTrends.length - 1].score
      : 0;

    return {
      id: p.id,
      full_name: p.full_name,
      latest_score: Math.round(latestScoreValue),
      trend,
      assessment_count: p.assessment_count,
      last_assessment_date: p.last_assessment_date,
    };
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="washi-paper min-h-screen">
        {/* Header */}
        <header className="shoji-divider pb-6 mb-8">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
              Longitudinal Trends
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg">
              Track mental health progress across time — patient, team, and
              company-level trends for the past {days} days
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 pb-12">
          {/* Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="washi-card p-6 text-center">
              <div className="text-3xl font-bold text-[var(--primary)]">
                {affectedPatients}
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Patients Tracked
              </p>
            </div>
            <div className="washi-card p-6 text-center">
              <div className="text-3xl font-bold text-[var(--accent)]">
                {totalDataPoints}
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Data Points
              </p>
            </div>
            <div className="washi-card p-6 text-center">
              <div className="text-3xl font-bold text-[var(--secondary)]">
                {avgScore}
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Avg Score (0-100)
              </p>
            </div>
            <div className="washi-card p-6 text-center">
              <div className="text-3xl font-bold text-[var(--info)]">
                {dimensions.length}
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Dimensions Monitored
              </p>
            </div>
          </section>

          {/* Filters */}
          <section className="washi-card p-6 mb-8">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Filter Trends
            </h2>
            <form
              method="GET"
              className="grid grid-cols-1 md:grid-cols-5 gap-4"
            >
              <div>
                <label className="text-sm text-[var(--muted-foreground)] block mb-1">
                  Company
                </label>
                <select
                  name="companyId"
                  className="w-full hanko-badge px-3 py-2 text-sm"
                  defaultValue={searchParams.companyId || ''}
                >
                  <option value="">All Companies</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-[var(--muted-foreground)] block mb-1">
                  Patient
                </label>
                <select
                  name="patientId"
                  className="w-full hanko-badge px-3 py-2 text-sm"
                  defaultValue={searchParams.patientId || ''}
                >
                  <option value="">All Patients</option>
                  {patientSummaries.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-[var(--muted-foreground)] block mb-1">
                  Dimension
                </label>
                <select
                  name="dimension"
                  className="w-full hanko-badge px-3 py-2 text-sm"
                  defaultValue={searchParams.dimension || ''}
                >
                  <option value="">All Dimensions</option>
                  {dimensions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-[var(--muted-foreground)] block mb-1">
                  Time Range
                </label>
                <select
                  name="days"
                  className="w-full hanko-badge px-3 py-2 text-sm"
                  defaultValue={searchParams.days || '90'}
                >
                  <option value="30">30 Days</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="365">1 Year</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full button-primary px-4 py-2 rounded-md text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </section>

          {/* Main Trend Chart */}
          <section className="washi-card p-6 mb-8">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Score Trends Over Time
            </h2>
            {chartData.length > 0 ? (
              <TrendChart
                data={chartData}
                height={350}
                showPoints={true}
                showTooltips={true}
                className="w-full"
              />
            ) : (
              <div className="text-center py-12 text-[var(--muted-foreground)]">
                <p>No trend data available for the selected filters.</p>
                <p className="text-sm mt-2">
                  Data appears when patients complete assessments.
                </p>
              </div>
            )}
          </section>

          {/* Patient Summaries Table */}
          <section className="washi-card p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Patient Summaries
            </h2>
            {patientSummaries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="shoji-divider">
                      <th className="text-left py-3 px-2 text-[var(--muted-foreground)]">
                        Patient
                      </th>
                      <th className="text-left py-3 px-2 text-[var(--muted-foreground)]">
                        Latest Score
                      </th>
                      <th className="text-left py-3 px-2 text-[var(--muted-foreground)]">
                        Trend
                      </th>
                      <th className="text-left py-3 px-2 text-[var(--muted-foreground)]">
                        Assessments
                      </th>
                      <th className="text-left py-3 px-2 text-[var(--muted-foreground)]">
                        Last Checked
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientSummaries.map((p) => (
                      <tr key={p.id} className="hover:bg-[var(--muted)]/30">
                        <td className="py-3 px-2 font-medium">
                          {p.full_name}
                        </td>
                        <td className="py-3 px-2">{p.latest_score}/100</td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              p.trend === 'improving'
                                ? 'bg-[var(--success)]/20 text-[var(--success)]'
                                : p.trend === 'declining'
                                  ? 'bg-[var(--severe)]/20 text-[var(--severe)]'
                                  : 'bg-[var(--info)]/20 text-[var(--info)]'
                            }`}
                          >
                            {p.trend}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-[var(--muted-foreground)]">
                          {p.assessment_count}
                        </td>
                        <td className="py-3 px-2 text-[var(--muted-foreground)]">
                          {new Date(p.last_assessment_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                <p>No patient data available.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
