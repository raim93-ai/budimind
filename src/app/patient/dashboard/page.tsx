import { getDb } from '@/lib/db';
import Link from 'next/link';
import TrendChart from '@/components/charts/TrendChart';

interface AssessmentResponse {
  id: number;
  assessment_type: string;
  responses: string;
  raw_scores: string;
  severity: string;
  completed_at: string;
}

interface TrendPoint {
  date: string;
  dimension: string;
  score: number;
  severity_level: string | null;
  assessment_type: string;
}

export const dynamic = 'force-dynamic';

export default async function PatientDashboardPage({
  searchParams,
}: {
  searchParams: { patientToken?: string };
}) {
  const db = getDb();

  // In a real implementation, we'd verify the patient token here
  // For now, we'll accept a patientId param for demo purposes
  // The token verification happens client-side via cookie
  const urlParams = new URLSearchParams(searchParams);

  // Get patientId from cookie or param
  // This is simplified — in production, decode the JWT from the cookie
  const patientId =
    searchParams?.patientToken
      ? parseInt(searchParams.patientToken)
      : undefined;

  if (!patientId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center washi-paper">
        <div className="washi-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Access Required</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            Please log in through the patient portal to view your dashboard.
          </p>
          <Link href="/patient/login">
            <button className="button-primary w-full">
              Go to Patient Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Get patient info
  const patient = db
    .prepare(
      `
      SELECT p.*, c.name as company_name
      FROM patients p
      LEFT JOIN companies c ON p.company_id = c.id
      WHERE p.id = ?
    `,
    )
    .get(patientId) as {
    id: number;
    full_name: string | null;
    email: string | null;
    age: number | null;
    gender: string | null;
    company_name: string | null;
  } | null;

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center washi-paper">
        <div className="washi-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
          <p className="text-[var(--muted-foreground)] mb-6">
            The patient ID you provided does not exist.
          </p>
          <Link href="/patient/login">
            <button className="button-primary w-full">
              Go to Patient Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Get assessment history
  const assessmentHistory = db
    .prepare(
      `
      SELECT ar.*, a.title as assessment_title
      FROM assessment_responses ar
      JOIN (
        SELECT 'dass21' as type, 'DASS-21' as title UNION ALL
        SELECT 'phq9', 'PHQ-9' UNION ALL
        SELECT 'gad7', 'GAD-7' UNION ALL
        SELECT 'k10', 'K10' UNION ALL
        SELECT 'who5', 'WHO-5' UNION ALL
        SELECT 'whodas2', 'WHODAS 2.0' UNION ALL
        SELECT 'coreom', 'CORE-OM' UNION ALL
        SELECT 'pcl5', 'PCL-5' UNION ALL
        SELECT 'asrs', 'ASRS' UNION ALL
        SELECT 'isi', 'ISI' UNION ALL
        SELECT 'bdi2', 'BDI-II' UNION ALL
        SELECT 'bai', 'BAI' UNION ALL
        SELECT 'ybocs', 'Y-BOCS' UNION ALL
        SELECT 'epds', 'EPDS'
      ) a ON ar.assessment_type = a.type
      WHERE ar.patient_id = ?
      ORDER BY ar.completed_at DESC
    `,
    )
    .all(patientId) as AssessmentResponse[];

  // Get trend data for this patient
  const trendData = db
    .prepare(
      `
      SELECT assessment_date as date, dimension, score, severity_level, assessment_type
      FROM assessment_trends
      WHERE patient_id = ?
        AND assessment_date >= datetime('now', '-180 days')
      ORDER BY assessment_date ASC, dimension ASC
    `,
    )
    .all(patientId) as TrendPoint[];

  // Get latest scores per dimension
  const latestScores: Record<string, number> = {};
  const latestByDim: Record<string, TrendPoint> = {};
  for (const t of trendData) {
    if (!latestByDim[t.dimension] || new Date(t.date) > new Date(latestByDim[t.dimension].date)) {
      latestByDim[t.dimension] = t;
    }
  }
  for (const [dim, point] of Object.entries(latestByDim)) {
    latestScores[dim] = point.score;
  }

  // Assess improvement direction
  const dimensions = Object.keys(latestScores);
  const improvementCount = dimensions.filter((d) => {
    const dimTrends = trendData
      .filter((t) => t.dimension === d)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (dimTrends.length < 2) return false;
    const first = dimTrends[0].score;
    const last = dimTrends[dimTrends.length - 1].score;
    // For most dimensions, lower is better
    const isWellBeing = d === 'well-being';
    return isWellBeing ? last > first + 5 : last < first - 5;
  }).length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="washi-paper min-h-screen">
        {/* Header */}
        <header className="shoji-divider pb-6 mb-8">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--foreground)]">
                  Your Wellness Dashboard
                </h1>
                <p className="text-[var(--muted-foreground)] mt-1">
                  Hello, {patient.full_name || 'Patient'} — tracking your mental
                  health journey over time
                </p>
              </div>
              <Link href="/assessment">
                <button className="button-primary hanko-badge">
                  Take New Assessment
                </button>
              </Link>
            </div>
            {patient.company_name && (
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Affiliated with: {patient.company_name}
              </p>
            )}
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 pb-12">
          {/* Latest Scores Summary */}
          <section className="washi-card p-6 mb-8">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Your Latest Scores
            </h2>
            {dimensions.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dimensions.map((dim) => {
                  const score = latestScores[dim] || 0;
                  // For negative dimensions (depression, anxiety, etc), lower is better
                  const isPositive = dim === 'well-being';
                  const getScoreColor = (s: number, positive: boolean) => {
                    if (positive) {
                      if (s >= 70) return 'text-[var(--success)]';
                      if (s >= 40) return 'text-[var(--warning)]';
                      return 'text-[var(--destructive)]';
                    } else {
                      if (s <= 30) return 'text-[var(--success)]';
                      if (s <= 60) return 'text-[var(--warning)]';
                      return 'text-[var(--destructive)]';
                    }
                  };

                  return (
                    <div
                      key={dim}
                      className="bg-[var(--muted)]/20 rounded-xl p-4 text-center"
                    >
                      <p className="text-xs text-[var(--muted-foreground)] uppercase">
                        {dim}
                      </p>
                      <div
                        className={`text-2xl font-bold ${getScoreColor(score, isPositive)}`}
                      >
                        {Math.round(score)}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">
                        {isPositive ? 'Higher is better' : 'Lower is better'}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                <p>No assessment data yet. Take your first assessment to begin tracking!</p>
              </div>
            )}
          </section>

          {/* Trend Chart */}
          <section className="washi-card p-6 mb-8">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Your Progress Over Time
            </h2>
            {trendData.length > 0 ? (
              <TrendChart
                data={trendData.map((t) => ({
                  date: t.date,
                  dimension: t.dimension,
                  score: Math.round(t.score),
                  severity_level: t.severity_level,
                  assessment_type: t.assessment_type,
                }))}
                height={300}
                showPoints={true}
                className="w-full"
              />
            ) : (
              <div className="text-center py-12 text-[var(--muted-foreground)]">
                <p>No trend data available.</p>
                <p className="text-sm mt-2">
                  Complete at least 2 assessments to see your trend.
                </p>
              </div>
            )}

            {/* Improvement summary */}
            {trendData.length > 0 && (
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      improvementCount > dimensions.length / 2
                        ? 'bg-[var(--success)]'
                        : improvementCount < dimensions.length / 3
                          ? 'bg-[var(--destructive)]'
                          : 'bg-[var(--warning)]'
                    }`}
                  />
                  {improvementCount} of {dimensions.length} dimensions
                  {improvementCount > dimensions.length / 2
                    ? ' improved'
                    : ' showing concern'}
                </span>
              </div>
            )}
          </section>

          {/* Assessment History */}
          <section className="washi-card p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Assessment History
            </h2>
            {assessmentHistory.length > 0 ? (
              <div className="space-y-4">
                {assessmentHistory.map((assessment) => {
                  const scores = JSON.parse(assessment.raw_scores || '{}');
                  return (
                    <div
                      key={assessment.id}
                      className="flex items-center justify-between p-4 bg-[var(--muted)]/20 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="hanko-badge">
                          {assessment.assessment_type.toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {assessment.assessment_type
                              .replace(/([A-Z])/g, ' $1')
                              .trim()}
                          </h3>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            Completed: {new Date(assessment.completed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Score: {scores.total || scores.score || 'N/A'}
                        </p>
                        <span
                          className={`hanko-badge text-xs ${
                            scores.severity === 'normal' ||
                            scores.severity === 'minimal'
                              ? 'bg-[var(--success)]/20 text-[var(--success)]'
                              : scores.severity === 'mild'
                                ? 'bg-[var(--warning)]/20 text-[var(--warning)]'
                                : 'bg-[var(--destructive)]/20 text-[var(--destructive)]'
                          }`}
                        >
                          {scores.severity || 'N/A'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                <p>You haven't completed any assessments yet.</p>
                <p className="text-sm mt-2">
                  Take your first assessment to start tracking your mental health.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
