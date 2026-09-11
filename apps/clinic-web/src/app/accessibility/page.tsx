import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility',
  robots: { index: false, follow: false },
};

export default function AccessibilityPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">ACCESSIBILITY</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Designed toward WCAG 2.2 AA.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          This is a target, not a certification. Before public launch, each journey requires
          keyboard, screen-reader, contrast, zoom, reduced-motion and responsive review, with
          release-blocking findings resolved.
        </p>
        <p className="mt-6 text-slate-600">
          The production contact method for accessibility help will be published after the support
          channel is staffed and verified.
        </p>
      </div>
    </section>
  );
}
