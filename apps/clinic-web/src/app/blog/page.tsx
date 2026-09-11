import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Resources', robots: { index: false, follow: false } };

export default function BlogPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">RESOURCES</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Clinical content is under review.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          The old prototype articles were removed because they had no recorded clinical reviewer or
          publication evidence. Resources will appear only with an author, reviewer, sources, review
          date and scope statement.
        </p>
      </div>
    </section>
  );
}
