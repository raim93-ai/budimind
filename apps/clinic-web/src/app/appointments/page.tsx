import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Appointments',
  robots: { index: false, follow: false },
};

export default function AppointmentsPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">CLIENT AREA</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          Appointments are not active yet.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          The authenticated client area will open after identity, authorization, booking, consent
          and privacy controls have passed their gates.
        </p>
        <Link
          className="mt-8 inline-block font-semibold text-teal-800 underline underline-offset-4"
          href="/"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
