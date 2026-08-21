import Link from 'next/link';
import { assessments } from '@/db/assessments';

export default function AssessmentSelectionPage() {
  const assessmentList = Object.entries(assessments).map(([id, assessment]) => ({
    id,
    ...assessment
  }));

  // Separate clinical assessments from personality assessments
  const clinicalTypes = ['dass21', 'phq9', 'gad7', 'who5', 'pcl5', 'epds', 'k10', 'asrs', 'isi', 'bdi2', 'bai', 'ybocs', 'whodas2', 'coreom'];
  const clinicalAssessments = assessmentList.filter(a => clinicalTypes.includes(a.id));
  const personalityAssessments = assessmentList.filter(a => !clinicalTypes.includes(a.id));

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl washi-card space-y-8">
        <div className="flex items-center justify-center">
          <h2 className="text-2xl font-bold text-center">
            Choose Your Assessment
          </h2>
        </div>
        <p className="text-center text-muted-foreground max-w-2xl">
          Select from our comprehensive library of evidence-based psychological 
          assessments to gain insights into your mental health and well-being.
        </p>
        
        {/* Clinical Assessments Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
            Clinical Assessments (14 Validated Instruments)
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clinicalAssessments.map((assessment: any) => (
              <Link
                key={assessment.id}
                href={`/assessment/${assessment.id}`}
                className="washi-card p-6 hover:shadow-xl transition-all duration-300 flex flex-col items-center group"
              >
                <div className="mb-4">
                  <svg className="h-8 w-8 text-[var(--primary)] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{assessment.title}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {assessment.description}
                </p>
                <span className="hanko-badge px-3 py-1 text-xs">
                  Start Assessment
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Personality Assessments Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-2">
            Personality & Cognitive Assessments
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {personalityAssessments.map((assessment: any) => (
              <Link
                key={assessment.id}
                href={`/assessment/${assessment.id}`}
                className="washi-card p-6 hover:shadow-xl transition-all duration-300 flex flex-col items-center group"
              >
                <div className="mb-4">
                  <svg className="h-8 w-8 text-[var(--accent)] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 17V9m4.77 4.77A4.01 4.01 0 0 0 14 12c0-.55-.16-1.07-.44-1.52M9.23 9.23A4.01 4.01 0 0 1 12 7.5c.45 0 .88.08 1.27.22" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{assessment.title}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {assessment.description}
                </p>
                <span className="hanko-badge px-3 py-1 text-xs">
                  Start Assessment
                </span>
              </Link>
            ))}
          </div>
        </div>
        
        <p className="text-center text-muted-foreground mt-4">
          Each assessment is scientifically validated and designed to provide
          meaningful insights into specific psychological domains.
        </p>
      </div>
    </div>
  );
}