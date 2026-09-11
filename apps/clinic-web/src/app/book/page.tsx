import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Booking',
  description: 'BudiMind booking pre-launch status.',
  robots: { index: false, follow: false },
};

export default function BookPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">BOOKING</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Booking will open after verification.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          The production scheduler is not active. It will open only when practitioner credentials,
          service scope, consent, privacy, payment, calendar, notifications and clinical escalation
          have current approval and test evidence.
        </p>
        <p className="mt-8 border-l-2 border-amber-600 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Do not send clinical information through email or WhatsApp. BudiMind is not an emergency
          service; call 999 for immediate danger or Talian HEAL at 15555.
        </p>
        <Link
          className="mt-8 inline-block font-semibold text-teal-800 underline underline-offset-4"
          href="/services"
        >
          Review the planned service
        </Link>
      </div>
    </section>
  );
}
