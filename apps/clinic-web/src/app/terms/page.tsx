import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service terms',
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">PRE-LAUNCH</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Service terms are being reviewed.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          No booking or payment contract is offered through this pre-launch site. Final Malaysian
          consumer, clinical, cancellation, privacy and complaint terms will be presented before a
          person books or pays.
        </p>
      </div>
    </section>
  );
}
