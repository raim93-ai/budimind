import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | BudiMind Corporate',
  description:
    'Articles and insights on workplace mental health, employee wellbeing, and corporate psychology.',
};

export default function BlogPage() {
  return (
    <div className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900/40 flex-1">
      <div className="container">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6">Blog</h2>
        <p className="text-secondary mb-6 sm:mb-8">
          Insights on workplace mental health and employee wellbeing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <article className="bg-white dark:bg-gray-800 rounded-lg p-5 sm:p-6 border">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div
                className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold"
                aria-hidden="true"
              >
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">The Future of Workplace Mental Health</h3>
                <p className="text-sm text-secondary">
                  Exploring trends and predictions for 2024 and beyond.
                </p>
              </div>
            </div>
            <p className="text-secondary text-sm">Published: January 15, 2024</p>
          </article>
          <article className="bg-white dark:bg-gray-800 rounded-lg p-5 sm:p-6 border">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div
                className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold"
                aria-hidden="true"
              >
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Employee Wellbeing Best Practices</h3>
                <p className="text-sm text-secondary">
                  Practical strategies for implementing mental health programs.
                </p>
              </div>
            </div>
            <p className="text-secondary text-sm">Published: December 10, 2023</p>
          </article>
        </div>

        {/* Psychology resource links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-primary mb-4">
            Referenced Mental Health Resources
          </h3>
          <p className="text-sm text-secondary mb-4 text-pretty">
            This blog references the following authoritative psychology and mental health sources:
          </p>
          <ul className="space-y-3" role="list">
            <li>
              <a
                href="https://www.apa.org/topics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                American Psychological Association – Psychology Topics
              </a>
              <p className="text-xs text-secondary mt-1 text-pretty">
                Evidence-based articles on mental health conditions, treatments, and research.
              </p>
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
              <p className="text-xs text-secondary mt-1 text-pretty">
                Authoritative mental health information from the US National Institutes of Health.
              </p>
            </li>
            <li>
              <a
                href="https://www.verywellmind.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Verywell Mind
              </a>
              <p className="text-xs text-secondary mt-1 text-pretty">
                Medically reviewed mental health articles written by clinical experts.
              </p>
            </li>
          </ul>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
          <a href="/contact" className="text-primary hover:underline">
            Have a topic you'd like us to cover? Get in touch.
          </a>
        </div>
      </div>
    </div>
  );
}
