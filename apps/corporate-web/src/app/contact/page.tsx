import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'BudiMind Corporate contact and pre-launch status.',
  robots: { index: false, follow: false },
};

export default function ContactPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">CONTACT · PRE-LAUNCH</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Contact details are being verified.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          BudiMind Corporate is not yet accepting programme registrations through this website. An
          approved business address, email and response commitment will be published only after the
          operating team confirms them.
        </p>
        <div className="mt-10 border-l-2 border-teal-700 bg-stone-50 p-6">
          <h2 className="text-lg font-semibold text-slate-950">No sensitive information</h2>
          <p className="mt-2 leading-7 text-slate-600">
            Do not send employee names, assessment answers, health information or clinical details
            through an unverified contact channel.
          </p>
        </div>
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
