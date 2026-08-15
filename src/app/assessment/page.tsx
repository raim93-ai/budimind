import Link from 'next/link';
import { assessments } from '@/db/assessments';

export default function AssessmentSelectionPage() {
  const assessmentList = Object.values(assessments);

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assessmentList.map((assessment: any) => (
            <Link
              key={assessment.id}
              href={`/assessment/${assessment.id}`}
              className="washi-card p-6 hover:shadow-xl transition-all duration-300 flex flex-col items-center"
            >
              <div className="mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {/* Placeholder icon - in a real app, we'd have specific icons for each assessment */}
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
        <p className="text-center text-muted-foreground mt-4">
          Each assessment is scientifically validated and designed to provide 
          meaningful insights into specific psychological domains.
        </p>
      </div>
    </div>
  );
}