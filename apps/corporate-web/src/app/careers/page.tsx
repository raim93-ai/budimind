import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Careers | BudiMind Corporate',
  description:
    'Join our team and help shape the future of workplace mental health. View current openings and apply.',
  alternates: { canonical: 'https://corporate.budimind.com/careers' },
};

export default function CareersPage() {
  return (
    <div className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900/40 flex-1">
      <div className="container">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6">Careers</h2>
        <p className="text-secondary mb-6 sm:mb-8">
          We're building the future of workplace mental health. Join us.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Current Openings</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Senior Full-Stack Engineer</li>
              <li>Clinical Psychologist Consultant</li>
              <li>Product Designer</li>
              <li>DevOps Engineer</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Why Join Us</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Meaningful work impacting workplace wellbeing</li>
              <li>Competitive compensation and benefits</li>
              <li>Remote-first flexibility</li>
              <li>Learning and development budget</li>
            </ul>
          </div>
        </div>
        <div>
          <a href="/contact" className="text-primary hover:underline">
            View All Opportunities &amp; Apply
          </a>
        </div>

        {/* Psychology resource links for career context */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-primary mb-4">Our Field References</h3>
          <p className="text-sm text-secondary mb-4 text-pretty">
            We stay current with research from these authoritative psychology sources:
          </p>
          <ul className="space-y-2" role="list">
            <li>
              <a
                href="https://www.apa.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                American Psychological Association
              </a>
            </li>
            <li>
              <a
                href="https://www.nimh.nih.gov/health"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                National Institute of Mental Health (NIMH)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
