import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | BudiMind Clinic',
  description:
    'Articles and insights on mental health, psychotherapy, and psychological wellbeing.',
  alternates: { canonical: 'https://clinic.budimind.com/blog' },
};

const blogPosts = [
  {
    id: 1,
    title: 'Finding the Right Psychologist',
    description: 'Tips for selecting a therapist that fits your needs.',
    date: 'January 15, 2024',
    href: '/blog/finding-the-right-psychologist',
  },
  {
    id: 2,
    title: 'Managing Anxiety and Stress',
    description: 'Practical techniques for daily stress management.',
    date: 'December 10, 2023',
    href: '/blog/managing-anxiety-and-stress',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900/40">
      <div className="container">
        <h2 className="text-3xl font-bold text-primary mb-6">Blog</h2>
        <p className="text-secondary mb-8">
          Insights on mental health, psychotherapy, and psychological wellbeing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div
                  className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white font-bold"
                  aria-hidden="true"
                >
                  {post.id}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{post.title}</h3>
                  <p className="text-sm text-secondary">{post.description}</p>
                </div>
              </div>
              <p className="text-secondary text-sm">Published: {post.date}</p>
              <a href={post.href} className="text-primary hover:underline text-sm font-medium">
                Read more →
              </a>
            </article>
          ))}
        </div>

        {/* Psychology resource links at the bottom of the blog */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-primary mb-4">
            Referenced Mental Health Resources
          </h3>
          <p className="text-sm text-secondary mb-4 text-pretty">
            The content on this blog references the following authoritative mental health and
            psychology sources for evidence-based information:
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
            <li>
              <a
                href="https://adaa.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Anxiety & Depression Association of America (ADAA)
              </a>
              <p className="text-xs text-secondary mt-1 text-pretty">
                Non-profit dedicated to anxiety, depression, OCD, PTSD, and related disorders.
              </p>
            </li>
            <li>
              <a
                href="https://www.mhanational.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Mental Health America (MHA)
              </a>
              <p className="text-xs text-secondary mt-1 text-pretty">
                Premier community-based non-profit for mental health in the US.
              </p>
            </li>
            <li>
              <a
                href="https://www.who.int/health-topics/mental-health"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                World Health Organization – Mental Health
              </a>
              <p className="text-xs text-secondary mt-1 text-pretty">
                Global perspective on mental health, mental disorders, and evidence-based
                strategies.
              </p>
            </li>
          </ul>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <a href="/contact" className="text-primary hover:underline">
            Have a topic you'd like us to cover? Get in touch.
          </a>
        </div>
      </div>
    </div>
  );
}
