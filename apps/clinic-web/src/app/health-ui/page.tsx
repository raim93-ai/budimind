import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preview status | BudiMind Clinic',
  description: 'Build status for the BudiMind Clinic preview.',
  robots: { index: false, follow: false },
};

export default function HealthPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-secondary">
        Preview environment
      </p>
      <h1 className="mt-3 text-3xl font-semibold">The application shell is available.</h1>
      <p className="mt-4 text-secondary">
        Live database, booking, payment, messaging and clinical service checks are not enabled in
        this synthetic preview.
      </p>
    </main>
  );
}
