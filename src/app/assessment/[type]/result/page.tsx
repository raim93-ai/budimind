import { getDb } from '@/lib/db';
import { assessments } from '@/db/assessments';
import { notFound } from 'next/navigation';

export default async function AssessmentResultPage({
  searchParams,
}: {
  searchParams: { patientId: string; assessmentId: string };
}) {
  const patientId = parseInt(searchParams.patientId);
  const assessmentId = parseInt(searchParams.assessmentId);
  
  const db = getDb();
  
  // Get the specific assessment result
  const assessmentResult = db.prepare(`
    SELECT ar.*, p.full_name as patient_name
    FROM assessment_responses ar
    JOIN patients p ON ar.patient_id = p.id
    WHERE ar.id = ? AND ar.patient_id = ?
  `).get(assessmentId, patientId);
  
  if (!assessmentResult) {
    notFound();
  }
  
  // Get assessment info
  const assessment = (assessments as any)[assessmentResult.assessment_type];
  
  // Parse the scores
  const scores = JSON.parse(assessmentResult.raw_scores);
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12">
      <div className="washi-card w-full max-w-xl space-y-8">
        <div className="flex items-center justify-center">
          <h2 className="text-2xl font-bold">
            Assessment Results
          </h2>
        </div>
        
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              {assessment ? assessment.title : assessmentResult.assessment_type.toUpperCase()}
            </h3>
            <p className="text-muted-foreground">
              Completed on {new Date(assessmentResult.completed_at).toLocaleDateString()}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              Score: {scores.total || 0}
            </div>
            <p className="text-lg text-muted-foreground">
              {scores.interpretation || `Severity: ${scores.severity || 'N/A'}`}</p>
            <div className={`hanko-badge ${getSeverityClass(scores.severity)} px-4 py-2`}>
              {scores.severity || 'N/A'}
            </div>
          </div>
          
          {/* Show detailed breakdown if available */}
          {Object.keys(scores).length > 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-2">Score Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(scores).map(([key, value]) => {
                  // Skip non-score fields
                  if (['total', 'severity', 'interpretation'].includes(key)) return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex justify-center space-x-4">
            <Button 
              asChild
              href={`/dashboard/patients/${patientId}`} 
            >
              View Patient Profile
            </Button>
            
            <Button 
              asChild
              href={`/assessment`} 
              variant="secondary"
            >
              Take Another Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
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

// Button component (simple version for this page)
function Button({ 
  asChild, 
  href, 
  variant = 'primary', 
  children 
}: { 
  asChild: boolean; 
  href: string; 
  variant?: 'primary' | 'secondary'; 
  children: React.ReactNode 
}) {
  const BaseButton = asChild ? 'a' : 'button';
  const baseClasses = `inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
    disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2`;
  
  const variantClasses = variant === 'primary' 
    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
    : 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
  
  return (
    <BaseButton 
      className={`${baseClasses} ${variantClasses}`}
      href={asChild ? href : undefined}
      onClick={!asChild ? () => window.location.href = href : undefined}
    >
      {children}
    </BaseButton>
  );
}