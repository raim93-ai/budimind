import { getDb } from '@/lib/db';
import { assessments } from '@/db/assessments';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SpiderChart from '@/components/charts/SpiderChart';
import TrendChart from '@/components/charts/TrendChart';

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Check authentication (server-side via middleware pattern)
  // In App Router, auth is typically handled via middleware.ts
  // This is a placeholder for server-side auth checks
  
  const { id } = await params;
  const patientId = parseInt(id);
  const db = getDb();

  // Get patient info
  const patient = db.prepare(`
    SELECT p.*, c.name as company_name
    FROM patients p
    LEFT JOIN companies c ON p.company_id = c.id
    WHERE p.id = ?
  `).get(patientId) as {
    id: number;
    full_name: string;
    ic_number: string | null;
    email: string | null;
    age: number | null;
    gender: string | null;
    phone: string | null;
    company_id: number | null;
    company_name: string | null;
    created_at: string;
  } | undefined;

  if (!patient) {
    notFound();
  }

  // Get all assessments for this patient
  const patientAssessments = db.prepare(`
    SELECT * FROM assessment_responses
    WHERE patient_id = ?
    ORDER BY completed_at DESC
  `).all(patientId);

  // Parse JSON responses and scores
  const assessmentsWithData = patientAssessments.map((assessment: any) => ({
    ...assessment,
    responses: JSON.parse(assessment.responses),
    raw_scores: JSON.parse(assessment.raw_scores),
  }));

  // Calculate normalized scores for spider chart (0-100 scale)
  // We'll map different assessment scores to common dimensions
  const dimensionScores: Record<string, number> = {
    depression: 0,
    anxiety: 0,
    stress: 0,
    wellBeing: 0,
    ptsd: 0,
    adhd: 0,
    sleep: 0,
    ocd: 0,
  };

  // Count how many assessments contributed to each dimension for averaging
  const dimensionCounts: Record<string, number> = {
    depression: 0,
    anxiety: 0,
    stress: 0,
    wellBeing: 0,
    ptsd: 0,
    adhd: 0,
    sleep: 0,
    ocd: 0,
  };

  // Process each assessment to accumulate scores
  for (const assessment of assessmentsWithData) {
    const scores = assessment.raw_scores;
    const type = assessment.assessment_type;

    switch (type) {
      case 'dass21':
        dimensionScores.depression += scores.depression || 0;
        dimensionScores.anxiety += scores.anxiety || 0;
        dimensionScores.stress += scores.stress || 0;
        dimensionCounts.depression++;
        dimensionCounts.anxiety++;
        dimensionCounts.stress++;
        break;
      case 'phq9':
        dimensionScores.depression += (scores.total || 0) * (21 / 9); // Normalize to DASS-21 scale
        dimensionCounts.depression++;
        break;
      case 'gad7':
        dimensionScores.anxiety += (scores.total || 0) * (21 / 7); // Normalize to DASS-21 anxiety scale
        dimensionCounts.anxiety++;
        break;
      case 'who5':
        // WHO-5 is well-being, higher is better. We invert it so higher score = worse well-being
        // WHO-5 score 0-25, we want 0-100 where 0=best well-being, 100=worst
        dimensionScores.wellBeing += ((25 - (scores.total || 0)) / 25) * 100;
        dimensionCounts.wellBeing++;
        break;
      case 'pcl5':
        // PCL-5 0-80, we want 0-100
        dimensionScores.ptsd += ((scores.total || 0) / 80) * 100;
        dimensionCounts.ptsd++;
        break;
      case 'asrs':
        // ASRS 0-24, we want 0-100
        dimensionScores.adhd += ((scores.total || 0) / 24) * 100;
        dimensionCounts.adhd++;
        break;
      case 'isi':
        // ISI 0-28, we want 0-100
        dimensionScores.sleep += ((scores.total || 0) / 28) * 100;
        dimensionCounts.sleep++;
        break;
      case 'ybocs':
        // Y-BOCS 0-40, we want 0-100
        dimensionScores.ocd += ((scores.total || 0) / 40) * 100;
        dimensionCounts.ocd++;
        break;
      // Add more mappings as needed
      default:
        break;
    }
  }

  // Calculate averages and ensure we don't divide by zero
  const spiderData = [
    dimensionCounts.depression > 0 ? Math.min(100, dimensionScores.depression / dimensionCounts.depression) : 0,
    dimensionCounts.anxiety > 0 ? Math.min(100, dimensionScores.anxiety / dimensionCounts.anxiety) : 0,
    dimensionCounts.stress > 0 ? Math.min(100, dimensionScores.stress / dimensionCounts.stress) : 0,
    dimensionCounts.wellBeing > 0 ? Math.min(100, dimensionScores.wellBeing / dimensionCounts.wellBeing) : 0,
    dimensionCounts.ptsd > 0 ? Math.min(100, dimensionScores.ptsd / dimensionCounts.ptsd) : 0,
    dimensionCounts.adhd > 0 ? Math.min(100, dimensionScores.adhd / dimensionCounts.adhd) : 0,
    dimensionCounts.sleep > 0 ? Math.min(100, dimensionScores.sleep / dimensionCounts.sleep) : 0,
    dimensionCounts.ocd > 0 ? Math.min(100, dimensionScores.ocd / dimensionCounts.ocd) : 0,
  ];

  // Labels for the spider chart
  const labels = ['Depression', 'Anxiety', 'Stress', 'Well-being', 'PTSD', 'ADHD', 'Sleep', 'OCD'];

  // Get trend data for this patient
  const trendData = db.prepare(`
    SELECT assessment_date as date, dimension, score, severity_level, assessment_type
    FROM assessment_trends
    WHERE patient_id = ?
      AND assessment_date >= datetime('now', '-180 days')
    ORDER BY assessment_date ASC, dimension ASC
  `).all(patientId) as { date: string; dimension: string; score: number; severity_level: string | null; assessment_type: string }[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Patient Overview
        </h1>
        <div className="flex space-x-3">
          <Link href="/dashboard/patients" className="button-secondary">
            ← Back to Patients
          </Link>
          <button className="button-secondary" onClick={() => window.print()}>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16V6a2 2 0 012-2h6a2 2 0 012 2v10m-9 4h4m-4 0l6-6m0 0l-6 6m6-6v.01" />
            </svg>
            Print Report
          </button>
        </div>
      </div>

      {/* Patient Info */}
      <div className="washi-card p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {patient.full_name}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">IC Number</h3>
            <p className="text-lg font-mono">{patient.ic_number || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg font-mono">{patient.email || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
            <p className="text-lg">{patient.age || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
            <p className="text-lg capitalize">{patient.gender || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
            <p className="text-lg font-mono">{patient.phone || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Organization</h3>
            <p className="text-lg">{patient.company_name || 'Independent'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Registration Date</h3>
            <p className="text-lg">{new Date(patient.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Spider Chart */}
      <div className="washi-card p-6">
        <h2 className="text-xl font-semibold mb-4">
          Psychological Profile (Spider Chart)
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Normalized scores (0-100) across key psychological dimensions based on
          completed assessments. Higher scores indicate greater severity.
        </p>
        <div className="relative h-96 w-full">
          <SpiderChart data={spiderData} labels={labels} />
        </div>
        <div className="mt-4 text-sm text-muted-foreground grid grid-cols-2">
          <div>Depression</div>
          <div>Anxiety</div>
          <div>Stress</div>
          <div>Well-being</div>
          <div>PTSD</div>
          <div>ADHD</div>
          <div>Sleep</div>
          <div>OCD</div>
        </div>
      </div>

      {/* Trend Chart - Longitudinal Progress */}
      {trendData.length > 0 && (
        <div className="washi-card p-6">
          <h2 className="text-xl font-semibold mb-4">
            Longitudinal Trend
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your scores over time across psychological dimensions. 
            Lower scores (except well-being) indicate improvement.
          </p>
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
        </div>
      )}

      {/* Assessment History */}
      <div className="washi-card p-6">
        <h2 className="text-xl font-semibold mb-4">Assessment History</h2>
        {assessmentsWithData.length > 0 ? (
          <div className="space-y-4">
            {assessmentsWithData.map((assessment: any) => {
              const assessmentInfo = assessments[assessment.assessment_type as keyof typeof assessments];
              return (
                <div key={assessment.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">
                      {assessmentInfo ? assessmentInfo.title : assessment.assessment_type.toUpperCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(assessment.completed_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-x-4">
                    <div className="hanko-badge">
                      Score: {assessment.raw_scores ? JSON.parse(assessment.raw_scores).total : 0}
                    </div>
                    <div className={`hanko-badge ${getSeverityClass(assessment.raw_scores ? JSON.parse(assessment.raw_scores).severity : '')}`}>
                      {assessment.raw_scores ? JSON.parse(assessment.raw_scores).severity : 'N/A'}
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Completed {assessment.responses.length} questions
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No assessments completed yet.
          </p>
        )}
      </div>
    </div>
  );
}

// Helper function to get severity class for badge styling
function getSeverityClass(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'normal':
    case 'none':
    case 'minimal':
    case 'subclinical':
      return 'severity-normal';
    case 'mild':
      return 'severity-mild';
    case 'moderate':
      return 'severity-moderate';
    case 'severe':
    case 'moderately severe':
    case 'major depression':
    case 'probable ptsd':
    case 'extreme':
      return 'severity-severe';
    case 'extremely severe':
    case 'severe insomnia':
    case 'very high':
      return 'severity-extreme';
    default:
      return '';
  }
}