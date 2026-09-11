import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Practitioners',
  description: 'The BudiMind practitioner directory is being prepared for launch.',
};

export default function PsychologistsPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-4xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">PRACTITIONER DIRECTORY</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Published only when verified.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          There are no public practitioner profiles yet. Before a profile appears here, BudiMind
          will verify the person’s current Malaysian registration, practising certificate, service
          scope and professional indemnity.
        </p>
        <div className="mt-10 border-l-2 border-teal-700 bg-stone-50 p-6">
          <h2 className="text-lg font-semibold text-slate-950">Why the directory is empty</h2>
          <p className="mt-2 leading-7 text-slate-600">
            The previous prototype contained invented clinician profiles. They have been removed.
            Synthetic records may be used in private tests, but will never be presented as real
            professionals.
          </p>
        </div>
        <Link
          className="mt-8 inline-block font-semibold text-teal-800 underline underline-offset-4"
          href="/contact"
        >
          Register for an opening update
        </Link>
      </div>
    </section>
  );
}
