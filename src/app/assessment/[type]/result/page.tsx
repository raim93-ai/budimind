import { getDb } from '@/lib/db';
import { assessments } from '@/db/assessments';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default async function AssessmentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId: string; assessmentId: string }>;
}) {
  const { patientId: patientIdStr, assessmentId: assessmentIdStr } = await searchParams;
  const patientId = parseInt(patientIdStr);
  const assessmentId = parseInt(assessmentIdStr);
  
  const db = getDb();
  
  // Get the specific assessment result
  const assessmentResult = db.prepare(`
    SELECT ar.*, p.full_name as patient_name
    FROM assessment_responses ar
    JOIN patients p ON ar.patient_id = p.id
    WHERE ar.id = ? AND ar.patient_id = ?
  `).get(assessmentId, patientId) as { id: number; patient_id: number; assessment_type: string; responses: string; raw_scores: string; severity: string; completed_at: string; patient_name: string } | undefined;
  
  if (!assessmentResult) {
    notFound();
  }
  
  // Get assessment info
  const assessment = (assessments as any)[assessmentResult.assessment_type];
  
  // Parse the scores
  const scores = JSON.parse(assessmentResult.raw_scores) as Record<string, number | string>;
  
  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center px-6 py-12">
      <div className="washi-card w-full max-w-xl p-8 sm:p-10 space-y-7 animate-fade-up">
        <div className="text-center">
          <span className={`h-14 w-14 rounded-full inline-flex items-center justify-center ${severityTone(scores.severity as string)}`}>
            {isPositiveSeverity(scores.severity as string)
              ? <CheckCircle2 className="h-7 w-7" />
              : <AlertTriangle className="h-7 w-7" />}
          </span>
          <h1 className="text-2xl font-bold mt-4 tracking-tight">Your results</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {assessment ? assessment.title : assessmentResult.assessment_type.toUpperCase()}
            {' · '}{new Date(assessmentResult.completed_at + 'Z').toLocaleDateString()}
          </p>
        </div>

        <div className="rounded-xl bg-[var(--muted)]/60 border border-[var(--border)] p-6 text-center">
          <div className="text-4xl font-bold tracking-tight tabular-nums">{scores.total ?? 0}</div>
          <div className={`hanko-badge mt-3 ${getSeverityClass(scores.severity as string)} !text-sm`}>
            {scores.severity || 'N/A'}
          </div>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-3">
            {scores.interpretation || ''}
          </p>
        </div>

        {/* Subscale breakdown */}
        {Object.entries(scores).filter(([k]) => !['total', 'severity', 'interpretation'].includes(k)).length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Score breakdown</h3>
            <div className="space-y-2">
              {Object.entries(scores).map(([key, value]) => {
                if (['total', 'severity', 'interpretation'].includes(key)) return null;
                return (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm capitalize text-[var(--muted-foreground)]">{key.replace(/_/g, ' ')}</span>
                    <span className="font-semibold tabular-nums">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-xs text-[var(--muted-foreground)]/80 leading-relaxed text-center">
          This screening supports — but never replaces — professional clinical judgement.
          If you are struggling, please reach out to a qualified professional
          or Befrienders KL (+60 3-7627 2929).
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href={`/assessment`} className="button">
            Take Another Assessment
          </Link>
          <Link href={`/login`} className="button-secondary">
            Consultant Login
          </Link>
        </div>
      </div>
    </div>
  );
}

function severityTone(severity: string | undefined): string {
  const cls = getSeverityClass(severity);
  if (cls === 'severity-normal') return 'bg-emerald-100 text-emerald-700';
  if (cls === 'severity-mild' || cls === 'severity-moderate') return 'bg-amber-100 text-amber-700';
  if (cls) return 'bg-red-100 text-red-700';
  return 'bg-[var(--muted)] text-[var(--muted-foreground)]';
}

function isPositiveSeverity(severity: string | undefined): boolean {
  return getSeverityClass(severity) === 'severity-normal';
}

// Helper function to get severity class for badge styling
function getSeverityClass(severity: string | undefined): string {
  if (!severity) return '';
  
  const severityLower = severity.toLowerCase();
  switch (severityLower) {
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
    case 'probable PTSD':
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
